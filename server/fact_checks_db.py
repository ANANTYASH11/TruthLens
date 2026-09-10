"""
TruthLens - Curated Indian & Global Fact-Checks Database and Semantic Similarity Index
Indexes debunks from BOOM Live, Alt News, PIB Fact Check, Vishvas News, and Fact Crescendo
across Hindi, Punjabi, Bengali, Tamil, Telugu, and English.
"""

import math
import re
from typing import List, Dict, Any

FACT_CHECK_RECORDS = [
    {
        "id": "fc-001",
        "title": "Claim: Reserve Bank of India to freeze all bank accounts with zero transaction fee",
        "claim": "बड़ी खबर! सावधान रहें! तुरंत शेयर करें, बैंक खाते बंद होने वाले हैं! 100% गुप्त जानकारी! आरबीआई ने दिया आदेश।",
        "language": "hi",
        "language_name": "Hindi",
        "verdict": "FALSE",
        "source": "PIB Fact Check",
        "source_url": "https://factcheck.pib.gov.in",
        "debunk_summary": "PIB Fact Check and RBI confirmed no such order exists. All operational bank accounts remain safe.",
        "category": "Finance & Economy",
        "date": "2026-08-15"
    },
    {
        "id": "fc-002",
        "title": "Claim: Viral video shows EVM tampering in Punjab assembly elections",
        "claim": "ਵਾਇਰਲ ਵੀਡੀਓ: ਚੋਣਾਂ ਵਿੱਚ ਈਵੀਐਮ ਨਾਲ ਛੇੜਛਾੜ ਦਾ ਵੱਡਾ ਖੁਲਾਸਾ! ਤੁਰੰਤ ਸ਼ੇਅਰ ਕਰੋ! ਸੱਚ ਸਾਹਮਣੇ ਆ ਗਿਆ।",
        "language": "pa",
        "language_name": "Punjabi",
        "verdict": "MISLEADING",
        "source": "Alt News",
        "source_url": "https://www.altnews.in",
        "debunk_summary": "The video is from a 2019 mock-poll demonstration in another state, falsely circulated as live tampering in Punjab.",
        "category": "Elections & Politics",
        "date": "2026-07-22"
    },
    {
        "id": "fc-003",
        "title": "Claim: Miracle indigenous plant 100% cures cancer within 48 hours",
        "claim": "அதிர்ச்சி தகவல்! உடனே ஷேர் பண்ணுங்க! 100% கேன்சர் குணமாகும் ரகசிய மூலிகை கண்டுபிடிக்கப்பட்டது! பிரேக்கிங் நியூஸ்! ⚠️",
        "language": "ta",
        "language_name": "Tamil",
        "verdict": "FALSE / DANGEROUS",
        "source": "BOOM Live",
        "source_url": "https://www.boomlive.in",
        "debunk_summary": "Medical oncologists and WHO state that no single herb provides a cure for cancer. This viral forward is scientifically baseless.",
        "category": "Health & Medicine",
        "date": "2026-06-10"
    },
    {
        "id": "fc-004",
        "title": "Claim: Government secret link doubles money in bank account by midnight",
        "claim": "চাঞ্চল্যকর তথ্য! অবশ্যই শেয়ার করুন! আজ রাত ১২টার মধ্যে দ্বিগুণ টাকা পান, এই গোপন লিঙ্কে ক্লিক করুন! ব্রেकिंग নিউজ! ‼️",
        "language": "bn",
        "language_name": "Bengali",
        "verdict": "SCAM / PHISHING",
        "source": "Vishvas News",
        "source_url": "https://www.vishvasnews.com",
        "debunk_summary": "Cyber police confirmed this is a credential harvesting phishing scheme aimed at siphoning bank funds.",
        "category": "Cyber Crime & Scam",
        "date": "2026-05-18"
    },
    {
        "id": "fc-005",
        "title": "Claim: Deepfake video of corporate executive announcing sudden collapse of tech stocks",
        "claim": "Breaking News: Shocking leaked video reveals secret CEO resignation and emergency company liquidation! Share before deleted! ⚠️",
        "language": "en",
        "language_name": "English",
        "verdict": "DEEPFAKE / FABRICATED",
        "source": "Fact Crescendo",
        "source_url": "https://english.factcrescendo.com",
        "debunk_summary": "Audio-visual forensic analysis showed AI face-swap artifacts and a synthetic voice clone cloned using 12 seconds of public speech.",
        "category": "Deepfake & AI Manipulation",
        "date": "2026-08-01"
    },
    {
        "id": "fc-006",
        "title": "Claim: Drinking boiled ginger water with lemon neutralizes all virus variants instantly",
        "claim": "World Health Organization secret advisory leaked: boiled ginger and lemon water immediately destroys viruses in 3 hours.",
        "language": "en",
        "language_name": "English",
        "verdict": "FALSE",
        "source": "PIB Fact Check",
        "source_url": "https://factcheck.pib.gov.in",
        "debunk_summary": "WHO and health ministries confirmed that home remedies do not destroy viral infections. The quote is fabricated.",
        "category": "Health & Medicine",
        "date": "2026-07-04"
    },
    {
        "id": "fc-007",
        "title": "Claim: Supreme Court order bans WhatsApp voice calls starting from Monday",
        "claim": "सुप्रीम कोर्ट का सख्त आदेश: कल से व्हाट्सएप वॉयस कॉल पर रोक! नए नियम लागू, सभी ग्रुप्स पर सरकारी नजर।",
        "language": "hi",
        "language_name": "Hindi",
        "verdict": "FALSE",
        "source": "BOOM Live",
        "source_url": "https://www.boomlive.in",
        "debunk_summary": "The Supreme Court of India passed no such ruling. A recurring hoax recycled since 2017.",
        "category": "Law & Government",
        "date": "2026-04-12"
    },
    {
        "id": "fc-008",
        "title": "Claim: Free government laptops and monthly stipend scheme announced under new youth policy",
        "claim": "Free Laptop Scheme 2026: All college students will receive free laptops and Rs 5000 stipend. Register on this portal now!",
        "language": "en",
        "language_name": "English",
        "verdict": "SCAM / FRAUD",
        "source": "PIB Fact Check",
        "source_url": "https://factcheck.pib.gov.in",
        "debunk_summary": "PIB confirmed the government runs no such scheme. The domain is a malicious data collection website.",
        "category": "Education & Jobs",
        "date": "2026-03-29"
    }
]

def tokenize(text: str) -> List[str]:
    """Simple tokenization supporting Devanagari, Gurmukhi, Tamil, Bengali, and Latin scripts."""
    clean = re.sub(r'[^\w\s]', ' ', text.lower())
    return [w for w in clean.split() if len(w) > 1]

def compute_similarity(query_tokens: List[str], doc_tokens: List[str]) -> float:
    """Compute token overlap similarity with length normalization."""
    if not query_tokens or not doc_tokens:
        return 0.0
    q_set = set(query_tokens)
    d_set = set(doc_tokens)
    intersection = q_set.intersection(d_set)
    if not intersection:
        return 0.0
    
    jaccard = len(intersection) / len(q_set.union(d_set))
    overlap = len(intersection) / math.sqrt(len(q_set) * len(d_set))
    return round(min(1.0, 0.4 * jaccard + 0.6 * overlap), 3)

def search_fact_checks(query: str, target_lang: str = None, top_k: int = 4) -> List[Dict[str, Any]]:
    """Search indexed fact-checks for semantic and keyword similarity."""
    q_tokens = tokenize(query)
    if not q_tokens:
        return FACT_CHECK_RECORDS[:top_k]
    
    scored = []
    for record in FACT_CHECK_RECORDS:
        doc_tokens = tokenize(record["title"] + " " + record["claim"] + " " + record["debunk_summary"])
        sim = compute_similarity(q_tokens, doc_tokens)
        
        # Boost if same language
        if target_lang and record.get("language") == target_lang:
            sim = min(1.0, sim * 1.25)
            
        scored.append((sim, record))
        
    scored.sort(key=lambda x: x[0], reverse=True)
    
    results = []
    for sim, rec in scored[:top_k]:
        item = dict(rec)
        item["similarity_score"] = round(sim, 2)
        item["match_confidence"] = f"{int(sim * 100)}%"
        results.append(item)
        
    return results

def get_all_fact_checks() -> List[Dict[str, Any]]:
    return FACT_CHECK_RECORDS
