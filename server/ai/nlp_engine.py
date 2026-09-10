"""
TruthLens Regional Language NLP & Semantic Fact-Check Search Engine
Processes native scripts, detects linguistic manipulation triggers,
decomposes claims, and computes cosine similarity against truthlens.db.
"""

import re
import math
import numpy as np
from typing import Dict, Any, List
import database as db

SUPPORTED_LANGUAGES = {
    "en": {"name": "English", "native": "English", "script": "Latin"},
    "hi": {"name": "Hindi", "native": "हिन्दी", "script": "Devanagari"},
    "pa": {"name": "Punjabi", "native": "ਪੰਜਾਬੀ", "script": "Gurmukhi"},
    "ta": {"name": "Tamil", "native": "தமிழ்", "script": "Tamil"},
    "te": {"name": "Telugu", "native": "తెలుగు", "script": "Telugu"},
    "bn": {"name": "Bengali", "native": "বাংলা", "script": "Bengali"},
    "mr": {"name": "Marathi", "native": "मराठी", "script": "Devanagari"},
    "gu": {"name": "Gujarati", "native": "ગુજરાતી", "script": "Gujarati"},
    "kn": {"name": "Kannada", "native": "ಕನ್ನಡ", "script": "Kannada"},
    "ml": {"name": "Malayalam", "native": "മലയാളം", "script": "Malayalam"},
    "ur": {"name": "Urdu", "native": "اردو", "script": "Arabic/Nastaliq"}
}

CUE_TAXONOMY = {
    "urgency_marker": {
        "en": ["urgent", "immediately", "before deleted", "share now", "share fast", "hurry", "last chance", "today only"],
        "hi": ["तुरंत", "जल्दी", "डिलीट होने से पहले", "अभी शेयर करें", "सावधान", "फटाफट", "आज ही"],
        "pa": ["ਤੁਰੰਤ", "ਛੇਤੀ", "ਹੁਣੇ ਸ਼ੇਅਰ ਕਰੋ", "ਸਾਵਧਾਨ", "ਅੱਜ ਹੀ", "ਖ਼ਬਰਦਾਰ"],
        "ta": ["உடனே", "இப்போதே", "எச்சரிக்கை", "அவசரம்", "ஷேர் பண்ணுங்க"],
        "te": ["వెంటనే", "ఇప్పుడే", "జాగ్రత్త", "షేర్ చేయండి", "అత్యవసరం"],
        "bn": ["অবিলম্বে", "এখনই", "সতর্কতা", "জরুরি", "শেয়ার করুন"],
        "mr": ["त्वरित", "लगेच", "सावधान", "शेअर करा", "आताच"],
        "gu": ["તાત્કાલિક", "તરત જ", "સાવધાન", "શેર કરો"],
        "kn": ["ತಕ್ಷಣ", "ಈಗಲೇ", "ಎಚ್ಚರಿಕೆ", "ಶೇರ್ ಮಾಡಿ"],
        "ml": ["ഉടൻ", "ഇപ്പോൾ തന്നെ", "ജാഗ്രത", "ഷെയർ ചെയ്യൂ"],
        "ur": ["فوراً", "ابھی", "خبردار", "ضروری", "شیئر کریں"]
    },
    "sensational_claim": {
        "en": ["breaking news", "shocking truth", "secret revealed", "banned video", "must watch", "100% cure", "miracle remedy", "exposed"],
        "hi": ["सनसनीखेज", "बड़ी खबर", "सच सामने आ गया", "गुप्त नुस्खा", "चमत्कार", "पर्दाफाश", "धमाका"],
        "pa": ["ਵੱਡੀ ਖ਼ਬਰ", "ਸੱਚ ਸਾਹਮਣੇ ਆ ਗਿਆ", "ਚਮਤਕਾਰ", "ਧਮਾਕਾ", "ਗੁਪਤ"],
        "ta": ["அதிர்ச்சி தகவல்", "ரகசிய மூலிகை", "உண்மை வெளிவந்தது", "பிரேக்கிங் நியூஸ்"],
        "te": ["సంచలనం", "షాకింగ్ నిజం", "రహస్యం ಬಯಲು", "బ్రేకింగ్ న్యూస్"],
        "bn": ["চাঞ্চল্যকর তথ্য", "গোপন তথ্য ফাঁস", "ব্রেকিং নিউজ", "চমকপ্রদ"],
        "mr": ["धक्कादायक", "मोठी बातमी", "सत्य उघडकीस", "चमत्कार"],
        "gu": ["ધમાકેદાર", "મોટા સમાચાર", "રહસ્ય ખોલ્યું", "ચમત્કાર"],
        "kn": ["ಸಂಚಲನ", "ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್", "ರಹಸ್ಯ ಬಯಲು", "ಆಘಾತಕಾರಿ"],
        "ml": ["ഞെട്ടിക്കുന്ന സത്യം", "ബ്രേക്കിംഗ് ന്യൂസ്", "രಹസ്യം പുറത്ത്"],
        "ur": ["سنسنی خیز", "بڑی खबर", "سچ سامنے آگیا", "دھماکہ خیز"]
    },
    "unverified_authority": {
        "en": ["secret order", "leaked document", "government hidden", "who secret", "supreme court banned", "army advisory"],
        "hi": ["गुप्त आदेश", "सरकारी गुप्त जानकारी", "आरबीआई का आदेश", "सुप्रीम कोर्ट का फैसला", "सेना की चेतावनी"],
        "pa": ["ਗੁਪਤ ਹੁਕਮ", "ਸਰਕਾਰੀ ਖੁਲਾਸਾ", "ਫੌਜ ਦੀ ਚੇਤਾਵਨੀ"],
        "ta": ["அரசு ரகசியம்", "உச்சநீதிமன்ற உத்தரவு", "ரகசிய தகவல்"],
        "te": ["ప్రభుత్వ రహస్యం", "సుప్రీంకోర్టు ఉత్తర్వులు"],
        "bn": ["সরকারি গোপন আদেশ", "সুপ্রিম কোর্টের নির্দেশ"],
        "mr": ["सरकारी गुप्त आदेश", "न्यायालयाचा निर्णय"],
        "gu": ["સરકારી ગુપ્ત આદેશ"],
        "kn": ["ಸರ್ಕಾರಿ ರಹಸ್ಯ ಆದೇಶ"],
        "ml": ["സർക്കാർ രഹസ്യ ഉത്തരവ്"],
        "ur": ["خفیہ دستاویز", "حکومتی حکم"]
    }
}

class NLPEngine:
    def __init__(self):
        pass

    def detect_language(self, text: str) -> str:
        for char in text:
            code = ord(char)
            if 0x0900 <= code <= 0x097F: return "hi" # Devanagari (Hindi/Marathi)
            if 0x0A00 <= code <= 0x0A7F: return "pa" # Punjabi (Gurmukhi)
            if 0x0B80 <= code <= 0x0BFF: return "ta" # Tamil
            if 0x0C00 <= code <= 0x0C7F: return "te" # Telugu
            if 0x0980 <= code <= 0x09FF: return "bn" # Bengali
            if 0x0A80 <= code <= 0x0AFF: return "gu" # Gujarati
            if 0x0C80 <= code <= 0x0CFF: return "kn" # Kannada
            if 0x0D00 <= code <= 0x0D7F: return "ml" # Malayalam
            if 0x0600 <= code <= 0x06FF: return "ur" # Urdu
        return "en"

    def tokenize_and_tag(self, text: str, lang: str) -> List[Dict[str, str]]:
        words = re.findall(r'\S+', text)
        tagged = []

        active_cues = []
        for cue_type, lang_dict in CUE_TAXONOMY.items():
            phrases = lang_dict.get(lang, []) + lang_dict.get("en", [])
            for p in phrases:
                active_cues.append((p.lower(), cue_type))

        for w in words:
            clean = re.sub(r'[^\w]', '', w).lower()
            tag = "neutral"
            for phrase, cue_type in active_cues:
                if phrase in clean or clean in phrase:
                    tag = cue_type
                    break
            if re.search(r'\d+', w):
                tag = "statistical_claim"
            tagged.append({"token": w, "type": tag})

        return tagged

    def compute_similarity(self, q_tokens: List[str], doc_text: str) -> float:
        doc_tokens = re.sub(r'[^\w\s]', ' ', doc_text.lower()).split()
        if not q_tokens or not doc_tokens:
            return 0.0
        q_set = set(q_tokens)
        d_set = set(doc_tokens)
        intersection = q_set.intersection(d_set)
        if not intersection:
            return 0.0
        jaccard = len(intersection) / len(q_set.union(d_set))
        overlap = len(intersection) / math.sqrt(len(q_set) * len(d_set))
        return round(min(1.0, 0.4 * jaccard + 0.6 * overlap), 3)

    def analyze_claim(self, text: str, user_lang: str = None) -> Dict[str, Any]:
        if not text or not text.strip():
            text = "Breaking News: Shocking secret revealed! Share immediately before deleted! ⚠️"

        lang = user_lang if user_lang in SUPPORTED_LANGUAGES else self.detect_language(text)
        lang_info = SUPPORTED_LANGUAGES.get(lang, SUPPORTED_LANGUAGES["en"])

        tagged_tokens = self.tokenize_and_tag(text, lang)

        # Count cue frequencies
        cues = {"urgency_marker": 0, "sensational_claim": 0, "unverified_authority": 0, "statistical_claim": 0}
        for t in tagged_tokens:
            if t["type"] in cues:
                cues[t["type"]] += 1

        exclamations = text.count("!") + text.count("‼️") + text.count("⚠️")
        sensationalism_score = min(1.0, (cues["sensational_claim"] * 0.28) + (exclamations * 0.12) + (0.15 if text.isupper() else 0.0))
        urgency_score = min(1.0, (cues["urgency_marker"] * 0.35) + (0.2 if exclamations > 1 else 0.0))
        authority_risk = min(1.0, (cues["unverified_authority"] * 0.45))
        numerical_density = min(1.0, cues["statistical_claim"] * 0.25)

        overall_fake_score = (sensationalism_score * 0.35) + (urgency_score * 0.30) + (authority_risk * 0.20) + (numerical_density * 0.15)
        overall_fake_score = round(float(np.clip(overall_fake_score, 0.06, 0.96)), 3)
        text_trust_score = round(float(np.clip((1.0 - overall_fake_score) * 100, 4.0, 96.0)), 1)

        # Query SQLite Fact-Checks Table
        q_tokens = [re.sub(r'[^\w]', '', w).lower() for w in text.split() if len(w) > 1]
        all_fact_checks = db.get_fact_checks(limit=50)

        scored_fcs = []
        for fc in all_fact_checks:
            sim = self.compute_similarity(q_tokens, fc["title"] + " " + fc["claim"] + " " + fc["debunk_summary"])
            if fc["language"] == lang:
                sim = min(1.0, sim * 1.25)
            scored_fcs.append((sim, fc))

        scored_fcs.sort(key=lambda x: x[0], reverse=True)
        matched_fcs = []
        for sim, fc in scored_fcs[:3]:
            item = dict(fc)
            item["similarity_score"] = round(sim, 2)
            matched_fcs.append(item)

        # Decomposed components
        numbers = re.findall(r'\d+(?:\.\d+)?%?', text)
        sentences = [s.strip() for s in re.split(r'[।!?.\n]+', text) if len(s.strip()) > 5]

        return {
            "text": text,
            "language_code": lang,
            "language_name": lang_info["name"],
            "language_native": lang_info["native"],
            "language_script": lang_info["script"],
            "overall_fake_score": overall_fake_score,
            "text_trust_score": text_trust_score,
            "confidence_margin": round(3.2 + abs(overall_fake_score - 0.5) * 3.8, 1),
            "annotated_tokens": tagged_tokens,
            "claim_decomposition": {
                "core_assertion": sentences[0] if sentences else text[:80],
                "asserted_numbers": numbers,
                "detected_domains": [{"name": "Banking & Governance", "category": "GOVERNANCE"}] if "बैंक" in text or "rbi" in text.lower() or "bank" in text.lower() else [{"name": "General Media Content", "category": "GENERAL"}]
            },
            "matched_fact_checks": matched_fcs
        }

# Singleton instance
_nlp_instance = None

def get_nlp_engine() -> NLPEngine:
    global _nlp_instance
    if _nlp_instance is None:
        _nlp_instance = NLPEngine()
    return _nlp_instance
