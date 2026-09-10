import os
import sys
import time
import json
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
sys.path.append(os.path.join(BASE_DIR, "dfa-core"))

try:
    import torch
    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False

from inference.analyze_video import analyze_media
from inference.report_generator.pdf_report import generate_forensic_html_report
from models.language.regional_detector import RegionalFakeNewsDetector
from models.multimodal.cross_verifier import MultimodalCrossVerifier
import database as db
from scrapers import scrape_article_from_url

app = Flask(__name__)
CORS(app)

text_detector = RegionalFakeNewsDetector()
cross_verifier = MultimodalCrossVerifier()

DEMO_PRESETS = [
    {
        "id": "demo-hindi-rumor",
        "title": "Hindi Election & Currency Rumor (हिन्दी)",
        "type": "text",
        "language": "hi",
        "text": "बड़ी खबर! सनसनीखेज खुलासा: सावधान रहें! तुरंत शेयर करें, बैंक खाते बंद होने वाले हैं! 100% गुप्त जानकारी! ⚠️⚠️‼️",
        "description": "Viral WhatsApp panic message in Hindi targeting banking systems."
    },
    {
        "id": "demo-tamil-hoax",
        "title": "Tamil Miracle Medical Remedy Hoax (தமிழ்)",
        "type": "text",
        "language": "ta",
        "text": "அதிர்ச்சி தகவல்! உடனே ஷேர் பண்ணுங்க! 100% கேன்சர் குணமாகும் ரகசிய மூலிகை கண்டுபிடிக்கப்பட்டது! பிரேக்கிங் நியூஸ்! ⚠️",
        "description": "Sensational medical misinformation in Tamil."
    },
    {
        "id": "demo-bengali-scam",
        "title": "Bengali Financial Scheme Scam (বাংলা)",
        "type": "text",
        "language": "bn",
        "text": "চাঞ্চল্যকর তথ্য! অবশ্যই শেয়ার করুন! আজ রাত ১২টার মধ্যে দ্বিগুণ টাকা পান, এই গোপন লিঙ্কে ক্লিক করুন! ব্রেকিং নিউজ! ‼️",
        "description": "Financial scam targeting Bengali online communities."
    },
    {
        "id": "demo-english-deepfake",
        "title": "English AI Voice & Video Swap",
        "type": "video",
        "language": "en",
        "text": "Breaking News: Shocking video footage reveals secret CEO resignation! Share before deleted! ⚠️",
        "description": "Adversarial StyleGAN3 deepfake video clip with English viral headline."
    },
    {
        "id": "demo-multimodal-mismatch",
        "title": "Multimodal News Mismatch (Kannada + Video)",
        "type": "multimodal",
        "language": "kn",
        "text": "ಎಚ್ಚರಿಕೆ! ತಕ್ಷಣ ಶೇರ್ ಮಾಡಿ! ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್ ರಹಸ್ಯ ಬಯಲು! ⚠️",
        "description": "Recycled authentic video attached to sensationalized Kannada panic headline."
    }
]

@app.route("/api/health", methods=["GET"])
def health_check():
    device_name = "CPU"
    if HAS_TORCH:
        if torch.cuda.is_available():
            device_name = torch.cuda.get_device_name(0)
        elif torch.backends.mps.is_available():
            device_name = "Apple Silicon (MPS Hardware Acceleration)"
            
    stats = db.get_system_stats()
    
    return jsonify({
        "status": "online",
        "platform": "DFA-Sentinel Forensic Intelligence Platform",
        "version": "1.0.0",
        "hardware": {
            "device": device_name,
            "torch_available": HAS_TORCH,
            "target_gpu": "NVIDIA RTX 4060 / Apple MPS"
        },
        "stats": stats,
        "supported_languages_count": len(text_detector.SUPPORTED_LANGUAGES),
        "modalities": ["RGB", "2D FFT", "DCT Residual", "rPPG++ BVP", "PRNU Noise", "NeRF Lighting", "Multilingual NLP", "Multimodal Cross-Check"]
    })

@app.route("/api/languages", methods=["GET"])
def get_languages():
    return jsonify({
        "languages": text_detector.SUPPORTED_LANGUAGES,
        "total": len(text_detector.SUPPORTED_LANGUAGES)
    })

@app.route("/api/demo-samples", methods=["GET"])
def get_demo_samples():
    return jsonify({"samples": DEMO_PRESETS})

@app.route("/api/analyze/video", methods=["POST"])
def analyze_video_endpoint():
    data = request.get_json(silent=True) or {}
    file_path = data.get("file_path", "data/samples/demo_deepfake.mp4")
    
    res = analyze_media(file_path, output_report="report.html")
    fake_score = res.get("summary", {}).get("fake_score_avg", 0.88)
    verdict = res.get("summary", {}).get("verdict", "DEEPFAKE DETECTED")
    risk_level = "CRITICAL" if fake_score >= 0.7 else ("HIGH" if fake_score >= 0.5 else "LOW")
    
    rec_id = db.save_audit_record("video", os.path.basename(file_path), "English", verdict, risk_level, fake_score, res)
    res["record_id"] = rec_id
    return jsonify(res)

@app.route("/api/analyze/text", methods=["POST"])
def analyze_text_endpoint():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    lang = data.get("language", None)
    
    res = text_detector.analyze(text, lang=lang)
    fake_score = res.get("overall_fake_score", 0.5)
    verdict = res.get("verdict", "UNVERIFIED")
    risk_level = "CRITICAL" if fake_score >= 0.7 else ("HIGH" if fake_score >= 0.55 else "LOW")
    
    rec_id = db.save_audit_record("text", text[:60] + "...", res.get("language_name", "Regional"), verdict, risk_level, fake_score, res)
    res["record_id"] = rec_id
    return jsonify(res)

@app.route("/api/analyze/url", methods=["POST"])
def analyze_url_endpoint():
    data = request.get_json(silent=True) or {}
    url = data.get("url", "")
    
    scraped = scrape_article_from_url(url)
    if not scraped.get("success", False):
        return jsonify({"error": f"Failed to scrape URL: {scraped.get('error', 'Unknown Error')}"}), 400
        
    res = text_detector.analyze(scraped["text"])
    res["url"] = url
    res["scraped_title"] = scraped["title"]
    
    fake_score = res.get("overall_fake_score", 0.5)
    verdict = res.get("verdict", "UNVERIFIED")
    risk_level = "CRITICAL" if fake_score >= 0.7 else ("HIGH" if fake_score >= 0.55 else "LOW")
    
    rec_id = db.save_audit_record("url", scraped["title"] or url, res.get("language_name", "Regional"), verdict, risk_level, fake_score, res)
    res["record_id"] = rec_id
    return jsonify(res)

@app.route("/api/analyze/multimodal", methods=["POST"])
def analyze_multimodal_endpoint():
    data = request.get_json(silent=True) or {}
    file_path = data.get("file_path", "data/samples/demo_deepfake.mp4")
    text = data.get("text", "")
    lang = data.get("language", None)
    
    video_res = analyze_media(file_path, output_report="report.html")
    text_res = text_detector.analyze(text, lang=lang)
    
    cross_res = cross_verifier.verify_alignment(video_res, text_res)
    multimodal_score = cross_res.get("multimodal_score", 0.8)
    
    rec_id = db.save_audit_record("multimodal", f"Video + {text_res.get('language_name', 'Regional')} Claim", text_res.get('language_name', 'Regional'), cross_res["verdict"], cross_res["risk_level"], multimodal_score, cross_res)
    
    return jsonify({
        "record_id": rec_id,
        "multimodal_result": cross_res,
        "video_analysis": video_res,
        "text_analysis": text_res
    })

@app.route("/api/history", methods=["GET"])
def get_history():
    records = db.get_audit_records(limit=50)
    return jsonify({"records": records, "total": len(records)})

@app.route("/api/history/<int:record_id>", methods=["DELETE"])
def delete_history_item(record_id):
    db.delete_audit_record(record_id)
    return jsonify({"status": "deleted", "id": record_id})

@app.route("/api/feedback", methods=["POST"])
def save_feedback():
    data = request.get_json(silent=True) or {}
    rec_id = data.get("record_id")
    rating = data.get("rating", 1)  # +1 or -1
    comments = data.get("comments", "")
    
    db.save_expert_feedback(rec_id, rating, comments)
    return jsonify({"status": "feedback_saved", "record_id": rec_id})

@app.route("/api/stats", methods=["GET"])
def get_stats():
    stats = db.get_system_stats()
    return jsonify(stats)

@app.route("/api/report/download", methods=["GET"])
def download_report():
    report_path = os.path.join(BASE_DIR, "report.html")
    if not os.path.exists(report_path):
        analyze_media("data/samples/demo.mp4", output_report=report_path)
    return send_file(report_path, mimetype="text/html", as_attachment=True, download_name="DFA_Forensic_Audit_Report.html")

if __name__ == "__main__":
    print("[DFA Server] Starting REST Server on http://localhost:5050")
    app.run(host="0.0.0.0", port=5050, debug=True)
