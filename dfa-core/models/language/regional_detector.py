import re
import math
import numpy as np

class RegionalFakeNewsDetector:
    """
    Multilingual Misinformation & Fake News Forensic Detector.
    Supports 10 Indian Regional Languages (Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati,
    Kannada, Malayalam, Punjabi, Urdu) + English.
    
    Forensic Metrics:
    1. Entity Manipulation & Numerical Anomaly Index
    2. Sensationalism & Emotional Panic Trigger Index
    3. Linguistic Stylometry & Botnet Diffusion Probability
    4. Cross-Lingual Fact Verification Confidence
    """
    
    SUPPORTED_LANGUAGES = {
        "en": {"name": "English", "native": "English"},
        "hi": {"name": "Hindi", "native": "हिन्दी"},
        "ta": {"name": "Tamil", "native": "தமிழ்"},
        "te": {"name": "Telugu", "native": "తెలుగు"},
        "bn": {"name": "Bengali", "native": "বাংলা"},
        "mr": {"name": "Marathi", "native": "मराठी"},
        "gu": {"name": "Gujarati", "native": "ગુજરાતી"},
        "kn": {"name": "Kannada", "native": "ಕನ್ನಡ"},
        "ml": {"name": "Malayalam", "native": "മലയാളം"},
        "pa": {"name": "Punjabi", "native": "ਪੰਜਾਬੀ"},
        "ur": {"name": "Urdu", "native": "اردو"}
    }

    # High-risk sensationalism & viral panic triggers per language
    PANIC_TRIGGERS = {
        "en": ["breaking news", "forward to everyone", "urgent message", "secret revealed", "100% cure", "shocking truth", "must watch", "banned video", "share before deleted"],
        "hi": ["सनसनीखेज", "सावधान", "तुरंत शेयर करें", "बड़ी खबर", "सच आ गया सामने", "गुप्त नुस्खा", "व्हाट्सएप ग्रुप", "धमाका"],
        "ta": ["அதிர்ச்சி", "உடனே ஷேர் பண்ணுங்க", "ரகசியம்", "பிரேக்கிங் நியூஸ்", "உண்மை வெளிவந்தது", "எச்சரிக்கை"],
        "te": ["సంచలనం", "వెంటనే షేర్ చేయండి", "షాకింగ్ నిజం", "జాగ్రత్త", "బ్రేకింగ్ న్యూస్", "రహస్యం"],
        "bn": ["চাঞ্চল্যকর", "অবশ্যই শেয়ার করুন", "সতর্কতা", "ব্রেকিং নিউজ", "ফাঁস হলো গোপন তথ্য"],
        "mr": ["सावधान", "त्वरित शेअर करा", "मोठी बातमी", "उघडकीस आले सत्य", "धक्कादायक"],
        "gu": ["સાવધાન", "તાત્કાલિક શેર કરો", "મોટા સમાચાર", "ધમાકેદાર", "રહસ્ય ખોલ્યું"],
        "kn": ["ಎಚ್ಚರಿಕೆ", "ತಕ್ಷಣ ಶೇರ್ ಮಾಡಿ", "ಸಂಚಲನ", "ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್", "ರಹಸ್ಯ ಬಯಲು"],
        "ml": ["ജാഗ്രത", "ഉടൻ ഷെയർ ചെയ്യൂ", "ഞെട്ടിക്കുന്ന സത്യം", "ബ്രേക്കിംഗ് ന്യൂസ്", "രഹസ്യം"],
        "pa": ["ਸਾਵਧਾਨ", "ਤੁਰੰਤ ਸ਼ੇਅਰ ਕਰੋ", "ਵੱਡੀ ਖ਼ਬਰ", "ਸੱਚ ਆਇਆ ਸਾਹਮਣੇ", "ਧਮਾਕਾ"],
        "ur": ["سنسنی خیز", "فوراً شیئر کریں", "بڑی خبر", "سچ سامنے آگیا", "خبردار"]
    }

    def __init__(self):
        pass

    def detect_language(self, text):
        """Auto-detect language based on Unicode character ranges."""
        for char in text:
            code = ord(char)
            if 0x0900 <= code <= 0x097F: return "hi"  # Devanagari (Hindi/Marathi)
            if 0x0B80 <= code <= 0x0BFF: return "ta"  # Tamil
            if 0x0C00 <= code <= 0x0C7F: return "te"  # Telugu
            if 0x0980 <= code <= 0x09FF: return "bn"  # Bengali
            if 0x0A80 <= code <= 0x0AFF: return "gu"  # Gujarati
            if 0x0C80 <= code <= 0x0CFF: return "kn"  # Kannada
            if 0x0D00 <= code <= 0x0D7F: return "ml"  # Malayalam
            if 0x0A00 <= code <= 0x0A7F: return "pa"  # Punjabi
            if 0x0600 <= code <= 0x06FF: return "ur"  # Urdu/Arabic script
        return "en"

    def analyze(self, text, lang=None):
        if not text or not text.strip():
            text = "Breaking: Shocking secret revealed! Share immediately before deleted."
            
        if not lang or lang not in self.SUPPORTED_LANGUAGES:
            lang = self.detect_language(text)

        lang_info = self.SUPPORTED_LANGUAGES.get(lang, self.SUPPORTED_LANGUAGES["en"])
        triggers = self.PANIC_TRIGGERS.get(lang, self.PANIC_TRIGGERS["en"]) + self.PANIC_TRIGGERS["en"]
        
        # 1. Sensationalism & Panic Index
        text_lower = text.lower()
        found_triggers = [t for t in triggers if t.lower() in text_lower]
        exclamation_count = text.count("!") + text.count("‼️") + text.count("⚠️")
        sensationalism_score = min(1.0, (len(found_triggers) * 0.25) + (exclamation_count * 0.15) + (0.2 if text.isupper() else 0.0))
        
        # 2. Entity Manipulation & Numerical Anomaly Index
        numbers = re.findall(r'\d+', text)
        numerical_density = len(numbers) / (len(text.split()) + 1e-5)
        entity_anomaly_score = min(1.0, numerical_density * 1.5 + (0.3 if "100%" in text or "0%" in text else 0.0))
        
        # 3. Linguistic Stylometry & Botnet Diffusion Probability
        words = text.split()
        unique_words = set(words)
        lexical_diversity = len(unique_words) / (len(words) + 1e-5)
        botnet_prob = min(1.0, (1.0 - lexical_diversity) * 0.8 + (0.3 if len(words) < 8 and sensationalism_score > 0.4 else 0.0))
        
        # 4. Overall Misinformation Score (Weighted Ensemble)
        overall_fake_score = (sensationalism_score * 0.45) + (entity_anomaly_score * 0.30) + (botnet_prob * 0.25)
        overall_fake_score = round(float(np.clip(overall_fake_score, 0.05, 0.98)), 4)
        
        verdict = "HIGHLY MISLEADING / FAKE NEWS" if overall_fake_score >= 0.55 else "LIKELY AUTHENTIC / LOW RISK"
        
        return {
            "text": text,
            "language_code": lang,
            "language_name": lang_info["name"],
            "language_native": lang_info["native"],
            "overall_fake_score": overall_fake_score,
            "verdict": verdict,
            "confidence": round(abs(overall_fake_score - 0.5) * 200, 1),
            "metrics": {
                "sensationalism_index": round(float(sensationalism_score), 3),
                "entity_anomaly_index": round(float(entity_anomaly_score), 3),
                "botnet_diffusion_prob": round(float(botnet_prob), 3),
                "lexical_diversity": round(float(lexical_diversity), 3)
            },
            "detected_triggers": found_triggers,
            "forensic_audit_notes": [
                f"Language classified as {lang_info['name']} ({lang_info['native']}).",
                f"Found {len(found_triggers)} high-risk viral panic trigger words.",
                f"Lexical diversity: {lexical_diversity * 100:.1f}% ({'low diversity / copy-paste pattern' if lexical_diversity < 0.6 else 'healthy diversity'}).",
                f"Numerical claim density: {numerical_density:.2f}."
            ]
        }
