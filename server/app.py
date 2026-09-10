"""
TruthLens - REST API Server
Provides endpoints for multimodal media forensics, regional Indian language
misinformation analysis, fact-check similarity search, and case audit history.
"""

import os
import sys
import time
import json
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
sys.path.append(os.path.join(BASE_DIR, "dfa-core"))

from inference.analyze_video import analyze_media
from inference.report_generator.pdf_report import generate_forensic_html_report
from models.language.regional_detector import RegionalFakeNewsDetector
from models.multimodal.cross_verifier import MultimodalCrossVerifier
import database as db
from scrapers import scrape_article_from_url
from fact_checks_db import search_fact_checks, get_all_fact_checks

app = Flask(__name__)
CORS(app)

text_detector = RegionalFakeNewsDetector()
cross_verifier = MultimodalCrossVerifier()

DEMO_PRESETS = [
    {
        "id": "demo-hindi-banking",
        "title": "Hindi Banking Panic Hoax (हिन्दी)",
        "type": "text",
        "language": "hi",
        "text": "बड़ी खबर! सनसनीखेज खुलासा: सावधान रहें! तुरंत शेयर करें, बैंक खाते बंद होने वाले हैं! 100% गुप्त जानकारी! आरबीआई ने दिया आदेश। ⚠️⚠️‼️",
        "description": "Sensational WhatsApp forward targeting banking and currency transactions in Hindi.",
        "media_file": "demo_banking_clip.mp4"
    },
    {
        "id": "demo-punjabi-evm",
        "title": "Punjabi Election Tampering Clip (ਪੰਜਾਬੀ)",
        "type": "multimodal",
        "language": "pa",
        "text": "ਵਾਇਰਲ ਵੀਡੀਓ: ਚੋਣਾਂ ਵਿੱਚ ਈਵੀਐਮ ਨਾਲ ਛੇੜਛਾੜ ਦਾ ਵੱਡਾ ਖੁਲਾਸਾ! ਤੁਰੰਤ ਸ਼ੇਅਰ ਕਰੋ! ਸੱਚ ਸਾਹਮਣੇ ਆ ਗਿਆ। ⚠️",
        "description": "Recycled 2019 mock-poll video circulated with an inflammatory Punjabi election headline.",
        "media_file": "demo_punjabi_election.mp4"
    },
    {
        "id": "demo-tamil-herbal",
        "title": "Tamil Miracle Medical Remedy (தமிழ்)",
        "type": "text",
        "language": "ta",
        "text": "அதிர்ச்சி தகவல்! உடனே ஷேர் பண்ணுங்க! 100% கேன்சர் குணமாகும் ரகசிய மூலிகை கண்டுபிடிக்கப்பட்டது! பிரேக்கிங் நியூஸ்! ⚠️",
        "description": "Viral herbal medical misinformation promising miraculous cures in Tamil.",
        "media_file": "demo_medical_herb.mp4"
    },
    {
        "id": "demo-bengali-finance",
        "title": "Bengali Phishing Scheme (বাংলা)",
        "type": "text",
        "language": "bn",
        "text": "চাঞ্চল্যকর তথ্য! অবশ্যই শেয়ার করুন! আজ রাত ১২টার মধ্যে দ্বিগুণ টাকা পান, এই গোপন লিঙ্কে ক্লিক করুন! ব্রেকিং নিউজ! ‼️",
        "description": "Cyber phishing scheme targeting Bengali online communities with urgent promises.",
        "media_file": "demo_scam_portal.mp4"
    },
    {
        "id": "demo-english-deepfake",
        "title": "English Executive Deepfake & Voice Clone",
        "type": "video",
        "language": "en",
        "text": "Breaking News: Shocking leaked video reveals secret CEO resignation and emergency liquidation! Share before deleted! ⚠️",
        "description": "High-fidelity generative AI face swap paired with audio voice cloning.",
        "media_file": "demo_executive_deepfake.mp4"
    }
]

@app.route("/api/health", methods=["GET"])
def health_check():
    stats = db.get_system_stats()
    return jsonify({
        "status": "online",
        "platform": "TruthLens Multimodal Forensic Platform",
        "version": "2.0.0",
        "supported_languages_count": len(text_detector.SUPPORTED_LANGUAGES),
        "supported_languages": text_detector.SUPPORTED_LANGUAGES,
        "indexed_fact_checks": len(get_all_fact_checks()),
        "stats": stats
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

@app.route("/api/fact-checks", methods=["GET"])
def list_fact_checks():
    query = request.args.get("q", "")
    lang = request.args.get("lang", None)
    if query:
        results = search_fact_checks(query, target_lang=lang, top_k=10)
    else:
        results = get_all_fact_checks()
    return jsonify({"fact_checks": results, "total": len(results)})

@app.route("/api/analyze/video", methods=["POST"])
def analyze_video_endpoint():
    data = request.get_json(silent=True) or {}
    file_path = data.get("file_path", "demo_deepfake.mp4")
    
    video_res = analyze_media(file_path)
    
    # Synthesize neutral text baseline to produce full fusion report
    dummy_text_res = text_detector.analyze(f"Analysis of visual media file: {os.path.basename(file_path)}")
    fusion_res = cross_verifier.verify_alignment(video_res, dummy_text_res)
    
    rec_id = db.save_audit_record(
        "video",
        os.path.basename(file_path),
        "Media Only",
        fusion_res["verdict"],
        fusion_res["risk_level"],
        video_res["average_fake_score"],
        {"media": video_res, "fusion": fusion_res}
    )
    
    return jsonify({
        "record_id": rec_id,
        "media_analysis": video_res,
        "fusion_result": fusion_res,
        "unified_trust_score": fusion_res["unified_trust_score"],
        "verdict": fusion_res["verdict"]
    })

@app.route("/api/analyze/text", methods=["POST"])
def analyze_text_endpoint():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    lang = data.get("language", None)
    
    text_res = text_detector.analyze(text, lang=lang)
    
    # Synthesize clean visual baseline to produce complete fusion score
    dummy_video_res = {
        "file_name": "No Media Provided",
        "media_trust_score": text_res["text_trust_score"],
        "average_fake_score": text_res["overall_fake_score"],
        "verdict": "TEXT CLAIM ONLY",
        "frames": []
    }
    fusion_res = cross_verifier.verify_alignment(dummy_video_res, text_res)
    
    rec_id = db.save_audit_record(
        "text",
        text[:60] + "..." if len(text) > 60 else text,
        text_res.get("language_name", "Regional"),
        fusion_res["verdict"],
        fusion_res["risk_level"],
        text_res["overall_fake_score"],
        {"text": text_res, "fusion": fusion_res}
    )
    
    return jsonify({
        "record_id": rec_id,
        "text_analysis": text_res,
        "fusion_result": fusion_res,
        "unified_trust_score": fusion_res["unified_trust_score"],
        "verdict": fusion_res["verdict"]
    })

@app.route("/api/analyze/url", methods=["POST"])
def analyze_url_endpoint():
    data = request.get_json(silent=True) or {}
    url = data.get("url", "")
    
    scraped = scrape_article_from_url(url)
    if not scraped.get("success", False):
        return jsonify({"error": f"Failed to scrape URL: {scraped.get('error', 'Unable to fetch page')}"}), 400
        
    text_res = text_detector.analyze(scraped["text"])
    text_res["url"] = url
    text_res["scraped_title"] = scraped["title"]
    
    dummy_video_res = {
        "file_name": url,
        "media_trust_score": text_res["text_trust_score"],
        "average_fake_score": text_res["overall_fake_score"],
        "verdict": "URL EXTRACTED TEXT",
        "frames": []
    }
    fusion_res = cross_verifier.verify_alignment(dummy_video_res, text_res)
    
    rec_id = db.save_audit_record(
        "url",
        scraped["title"] or url,
        text_res.get("language_name", "Regional"),
        fusion_res["verdict"],
        fusion_res["risk_level"],
        text_res["overall_fake_score"],
        {"text": text_res, "fusion": fusion_res}
    )
    
    return jsonify({
        "record_id": rec_id,
        "url": url,
        "title": scraped["title"],
        "text_analysis": text_res,
        "fusion_result": fusion_res,
        "unified_trust_score": fusion_res["unified_trust_score"],
        "verdict": fusion_res["verdict"]
    })

@app.route("/api/analyze/multimodal", methods=["POST"])
def analyze_multimodal_endpoint():
    data = request.get_json(silent=True) or {}
    file_path = data.get("file_path", "sample_media.mp4")
    text = data.get("text", "")
    lang = data.get("language", None)
    
    video_res = analyze_media(file_path)
    text_res = text_detector.analyze(text, lang=lang)
    
    fusion_res = cross_verifier.verify_alignment(video_res, text_res)
    
    rec_id = db.save_audit_record(
        "multimodal",
        f"Media + {text_res.get('language_name', 'Regional')} Claim",
        text_res.get("language_name", "Regional"),
        fusion_res["verdict"],
        fusion_res["risk_level"],
        1.0 - (fusion_res["unified_trust_score"] / 100.0),
        {"media": video_res, "text": text_res, "fusion": fusion_res}
    )
    
    return jsonify({
        "record_id": rec_id,
        "unified_trust_score": fusion_res["unified_trust_score"],
        "verdict": fusion_res["verdict"],
        "risk_level": fusion_res["risk_level"],
        "fusion_result": fusion_res,
        "media_analysis": video_res,
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
    rating = data.get("rating", 1)
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
    return send_file(report_path, mimetype="text/html", as_attachment=True, download_name="TruthLens_Forensic_Report.html")

if __name__ == "__main__":
    print("[TruthLens Server] Starting REST Server on http://localhost:5050")
    app.run(host="0.0.0.0", port=5050, debug=True)
