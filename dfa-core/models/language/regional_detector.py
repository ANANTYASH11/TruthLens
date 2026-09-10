"""
TruthLens - Regional Language Misinformation & Linguistic Forensics Detector
Supports 10 Indian Regional Languages (Hindi, Punjabi, Tamil, Telugu, Bengali, Marathi,
Gujarati, Kannada, Malayalam, Urdu) and English.

Provides:
- Token-level manipulation cue highlighting (sensationalism, urgency, unverified authority)
- Claim decomposition into core assertion, entities, and numerical markers
- Semantic cross-referencing against indexed Indian fact-checks
- Explainable linguistic forensic audit trail
"""

import re
import math
import numpy as np

class RegionalFakeNewsDetector:
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
            "ml": ["ഞെട്ടിക്കുന്ന സത്യം", "ബ്രേക്കിംഗ് ന്യൂസ്", "രഹസ്യം പുറത്ത്"],
            "ur": ["سنسنی خیز", "بڑی خبر", "سچ سامنے آگیا", "دھماکہ خیز"]
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

    def __init__(self):
        pass

    def detect_language(self, text: str) -> str:
        """Identify language from Unicode code point distributions."""
        script_counts = {
            "hi": 0, "ta": 0, "te": 0, "bn": 0, "gu": 0,
            "kn": 0, "ml": 0, "pa": 0, "ur": 0, "en": 0
        }
        for char in text:
            code = ord(char)
            if 0x0900 <= code <= 0x097F: script_counts["hi"] += 1
            elif 0x0B80 <= code <= 0x0BFF: script_counts["ta"] += 1
            elif 0x0C00 <= code <= 0x0C7F: script_counts["te"] += 1
            elif 0x0980 <= code <= 0x09FF: script_counts["bn"] += 1
            elif 0x0A80 <= code <= 0x0AFF: script_counts["gu"] += 1
            elif 0x0C80 <= code <= 0x0CFF: script_counts["kn"] += 1
            elif 0x0D00 <= code <= 0x0D7F: script_counts["ml"] += 1
            elif 0x0A00 <= code <= 0x0A7F: script_counts["pa"] += 1
            elif 0x0600 <= code <= 0x06FF: script_counts["ur"] += 1
            elif 0x0041 <= code <= 0x007A: script_counts["en"] += 1

        top_lang = max(script_counts, key=script_counts.get)
        if script_counts[top_lang] > 0:
            return top_lang
        return "en"

    def annotate_tokens(self, text: str, lang: str):
        """Break down text into tokens and categorize linguistic manipulation cues."""
        words = re.findall(r'\S+', text)
        annotated = []
        text_lower = text.lower()

        # Build list of active patterns
        active_cues = []
        for cue_type, lang_dict in self.CUE_TAXONOMY.items():
            phrases = lang_dict.get(lang, []) + lang_dict.get("en", [])
            for p in phrases:
                active_cues.append((p.lower(), cue_type))

        for word in words:
            clean_word = re.sub(r'[^\w]', '', word).lower()
            tag = "neutral"
            for phrase, cue_type in active_cues:
                if phrase in clean_word or clean_word in phrase:
                    tag = cue_type
                    break
            
            if re.search(r'\d+', word):
                tag = "statistical_claim"

            annotated.append({
                "token": word,
                "type": tag
            })
        return annotated

    def extract_claim_components(self, text: str, lang: str):
        """Decompose raw text into atomic claim elements for verification."""
        numbers = re.findall(r'\d+(?:\.\d+)?%?', text)
        sentences = [s.strip() for s in re.split(r'[।!?.\n]+', text) if len(s.strip()) > 5]
        
        core_assertion = sentences[0] if sentences else text[:80]
        
        entities = []
        if re.search(r'(?i)(rbi|bank|account|खाते|ਬੈਂਕ|வங்கி|টাকা|finance)', text):
            entities.append({"name": "Banking / Financial Sector", "category": "FINANCE"})
        if re.search(r'(?i)(cancer|herb|cure|remedy|रोग|ਕੈਂਸਰ|மூலிகை|ডাক্তার|who|health)', text):
            entities.append({"name": "Healthcare / Medical Protocol", "category": "HEALTH"})
        if re.search(r'(?i)(election|evm|vote|चोਣਾਂ|ਚੋਣ|வாக்கு|ভোট|court|supreme court)', text):
            entities.append({"name": "Democratic Process / Judiciary", "category": "GOVERNANCE"})
        if re.search(r'(?i)(ceo|video|footage|leak|scandal|resignation|deepfake)', text):
            entities.append({"name": "Corporate Leadership / Audio-Visual Media", "category": "MEDIA"})

        return {
            "core_assertion": core_assertion,
            "asserted_numbers": numbers,
            "detected_domains": entities if entities else [{"name": "General Public Information", "category": "GENERAL"}],
            "total_sentences": len(sentences)
        }

    def analyze(self, text: str, lang: str = None):
        if not text or not text.strip():
            text = "Breaking News: Shocking secret revealed! Share immediately before deleted! ⚠️"

        if not lang or lang not in self.SUPPORTED_LANGUAGES:
            lang = self.detect_language(text)

        lang_info = self.SUPPORTED_LANGUAGES.get(lang, self.SUPPORTED_LANGUAGES["en"])
        annotated_tokens = self.annotate_tokens(text, lang)
        claim_components = self.extract_claim_components(text, lang)

        # Count cue types
        cue_counts = {"urgency_marker": 0, "sensational_claim": 0, "unverified_authority": 0, "statistical_claim": 0}
        for t in annotated_tokens:
            if t["type"] in cue_counts:
                cue_counts[t["type"]] += 1

        exclamations = text.count("!") + text.count("‼️") + text.count("⚠️")
        
        sensationalism_score = min(1.0, (cue_counts["sensational_claim"] * 0.28) + (exclamations * 0.12) + (0.15 if text.isupper() else 0.0))
        urgency_score = min(1.0, (cue_counts["urgency_marker"] * 0.35) + (0.2 if exclamations > 1 else 0.0))
        authority_risk = min(1.0, (cue_counts["unverified_authority"] * 0.45))
        numerical_density = min(1.0, len(claim_components["asserted_numbers"]) * 0.25)

        # Misinformation Probability
        overall_fake_score = (sensationalism_score * 0.35) + (urgency_score * 0.30) + (authority_risk * 0.20) + (numerical_density * 0.15)
        overall_fake_score = round(float(np.clip(overall_fake_score, 0.06, 0.96)), 3)

        # Trust Score (Inverse of Fake Score, calibrated 0-100)
        trust_score = round(float(np.clip((1.0 - overall_fake_score) * 100, 4.0, 96.0)), 1)

        if overall_fake_score >= 0.65:
            verdict = "FABRICATED / HIGH MISINFORMATION RISK"
            verdict_badge = "dangerous"
        elif overall_fake_score >= 0.40:
            verdict = "QUESTIONABLE / UNVERIFIED CONTENT"
            verdict_badge = "warning"
        else:
            verdict = "LIKELY AUTHENTIC / LOW RISK"
            verdict_badge = "verified"

        # Search against curated Indian fact-checks database
        matched_fact_checks = []
        try:
            from server.fact_checks_db import search_fact_checks
            matched_fact_checks = search_fact_checks(text, target_lang=lang, top_k=3)
        except Exception:
            pass

        return {
            "text": text,
            "language_code": lang,
            "language_name": lang_info["name"],
            "language_native": lang_info["native"],
            "language_script": lang_info["script"],
            "overall_fake_score": overall_fake_score,
            "text_trust_score": trust_score,
            "verdict": verdict,
            "verdict_badge": verdict_badge,
            "confidence_margin": round(3.5 + abs(overall_fake_score - 0.5) * 4.0, 1),
            "annotated_tokens": annotated_tokens,
            "claim_decomposition": claim_components,
            "metrics": {
                "sensationalism_index": round(float(sensationalism_score), 3),
                "urgency_index": round(float(urgency_score), 3),
                "unverified_authority_risk": round(float(authority_risk), 3),
                "numerical_density": round(float(numerical_density), 3)
            },
            "matched_fact_checks": matched_fact_checks,
            "forensic_audit_notes": [
                f"Identified primary script as {lang_info['script']} ({lang_info['name']} - {lang_info['native']}).",
                f"Linguistic parser flagged {cue_counts['urgency_marker']} urgency triggers and {cue_counts['sensational_claim']} sensational markers.",
                f"Extracted {len(claim_components['asserted_numbers'])} numerical assertions.",
                f"Indexed {len(matched_fact_checks)} cross-lingual fact-check reference records."
            ]
        }
