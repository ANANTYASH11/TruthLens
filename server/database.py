"""
TruthLens Database Layer
Manages SQLite database (truthlens.db) for:
- Investigations (case history, visual/text metrics, Trust Score, Grad-CAM data)
- Fact-Checks (curated debunks from PIB, Alt News, BOOM Live, Vishvas News)
- Analyst Feedback (expert reviews, ratings, notes)
- System Stats (total scans, language distribution, device acceleration)
"""

import os
import sqlite3
import json
import time
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "truthlens.db")

INITIAL_FACT_CHECKS = [
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
        "category": "Cyber Crime",
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
        "category": "Deepfake & AI",
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
    }
]

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Investigations Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS investigations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id TEXT UNIQUE NOT NULL,
            mode TEXT NOT NULL,
            title TEXT NOT NULL,
            language TEXT,
            language_name TEXT,
            trust_score REAL NOT NULL,
            confidence_margin REAL NOT NULL,
            verdict TEXT NOT NULL,
            risk_level TEXT NOT NULL,
            media_filename TEXT,
            claim_text TEXT,
            metrics_json TEXT NOT NULL,
            evidence_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Fact-Checks Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS fact_checks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            claim TEXT NOT NULL,
            language TEXT NOT NULL,
            language_name TEXT NOT NULL,
            verdict TEXT NOT NULL,
            source TEXT NOT NULL,
            source_url TEXT,
            debunk_summary TEXT NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL
        )
    ''')

    # Analyst Feedback Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analyst_feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id TEXT NOT NULL,
            rating INTEGER NOT NULL,
            analyst_verdict TEXT,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Create Indexes for fast lookup
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_investigations_case_id ON investigations(case_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_fact_checks_lang ON fact_checks(language)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_fact_checks_category ON fact_checks(category)')

    # Seed Fact-Checks if table is empty
    cursor.execute('SELECT COUNT(*) as cnt FROM fact_checks')
    if cursor.fetchone()['cnt'] == 0:
        for fc in INITIAL_FACT_CHECKS:
            cursor.execute('''
                INSERT INTO fact_checks (id, title, claim, language, language_name, verdict, source, source_url, debunk_summary, category, date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                fc["id"], fc["title"], fc["claim"], fc["language"], fc["language_name"],
                fc["verdict"], fc["source"], fc["source_url"], fc["debunk_summary"],
                fc["category"], fc["date"]
            ))

    conn.commit()
    conn.close()
    print(f"[TruthLens Database] SQLite schema initialized at {DB_PATH}")

def save_investigation(case_id: str, mode: str, title: str, language: str, language_name: str,
                       trust_score: float, confidence_margin: float, verdict: str, risk_level: str,
                       media_filename: str, claim_text: str, metrics: dict, evidence: list) -> int:
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO investigations (case_id, mode, title, language, language_name, trust_score, confidence_margin, verdict, risk_level, media_filename, claim_text, metrics_json, evidence_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        case_id, mode, title, language, language_name, float(trust_score), float(confidence_margin),
        verdict, risk_level, media_filename, claim_text, json.dumps(metrics), json.dumps(evidence)
    ))

    rec_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return rec_id

def get_investigations(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM investigations ORDER BY id DESC LIMIT ?', (limit,))
    rows = cursor.fetchall()

    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "case_id": r["case_id"],
            "mode": r["mode"],
            "title": r["title"],
            "language": r["language"],
            "language_name": r["language_name"],
            "trust_score": r["trust_score"],
            "confidence_margin": r["confidence_margin"],
            "verdict": r["verdict"],
            "risk_level": r["risk_level"],
            "media_filename": r["media_filename"],
            "claim_text": r["claim_text"],
            "metrics": json.loads(r["metrics_json"] or "{}"),
            "evidence": json.loads(r["evidence_json"] or "[]"),
            "created_at": r["created_at"]
        })
    conn.close()
    return results

def get_investigation_by_case_id(case_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM investigations WHERE case_id = ?', (case_id,))
    r = cursor.fetchone()
    conn.close()
    if not r:
        return None
    return {
        "id": r["id"],
        "case_id": r["case_id"],
        "mode": r["mode"],
        "title": r["title"],
        "language": r["language"],
        "language_name": r["language_name"],
        "trust_score": r["trust_score"],
        "confidence_margin": r["confidence_margin"],
        "verdict": r["verdict"],
        "risk_level": r["risk_level"],
        "media_filename": r["media_filename"],
        "claim_text": r["claim_text"],
        "metrics": json.loads(r["metrics_json"] or "{}"),
        "evidence": json.loads(r["evidence_json"] or "[]"),
        "created_at": r["created_at"]
    }

def delete_investigation(case_id: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM investigations WHERE case_id = ?', (case_id,))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return affected > 0

def get_fact_checks(query: str = "", language: str = None, category: str = None, limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()

    sql = "SELECT * FROM fact_checks WHERE 1=1"
    params = []

    if query:
        sql += " AND (title LIKE ? OR claim LIKE ? OR debunk_summary LIKE ?)"
        term = f"%{query}%"
        params.extend([term, term, term])

    if language and language != "all":
        sql += " AND language = ?"
        params.append(language)

    if category and category != "all":
        sql += " AND category = ?"
        params.append(category)

    sql += " ORDER BY id ASC LIMIT ?"
    params.append(limit)

    cursor.execute(sql, params)
    rows = cursor.fetchall()
    conn.close()

    return [dict(r) for r in rows]

def save_feedback(case_id: str, rating: int, analyst_verdict: str = "", notes: str = "") -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO analyst_feedback (case_id, rating, analyst_verdict, notes)
        VALUES (?, ?, ?, ?)
    ''', (case_id, rating, analyst_verdict, notes))
    feedback_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return feedback_id

def get_system_stats() -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT COUNT(*) as cnt FROM investigations')
    total_scans = cursor.fetchone()['cnt']

    cursor.execute('SELECT AVG(trust_score) as avg_trust FROM investigations')
    avg_trust = cursor.fetchone()['avg_trust'] or 65.0

    cursor.execute('SELECT COUNT(*) as cnt FROM fact_checks')
    total_fact_checks = cursor.fetchone()['cnt']

    cursor.execute('SELECT COUNT(*) as cnt FROM investigations WHERE verdict LIKE "%DEEPFAKE%" OR verdict LIKE "%FABRICATED%"')
    flagged_manipulations = cursor.fetchone()['cnt']

    conn.close()
    return {
        "total_investigations": total_scans,
        "average_trust_score": round(avg_trust, 1),
        "indexed_fact_checks": total_fact_checks,
        "flagged_manipulations": flagged_manipulations,
        "database": "SQLite (truthlens.db)",
        "status": "HEALTHY"
    }

# Ensure DB initialized on module import
init_db()
