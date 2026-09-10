import os
import sqlite3
import json
import time

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dfa_sentinel.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Audit Records Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS audit_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            audit_type TEXT NOT NULL,
            target_name TEXT NOT NULL,
            language TEXT,
            verdict TEXT NOT NULL,
            risk_level TEXT NOT NULL,
            fake_score REAL NOT NULL,
            metrics_json TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    
    # Expert Feedback Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expert_feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            record_id INTEGER,
            rating INTEGER NOT NULL,
            comments TEXT,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (record_id) REFERENCES audit_records (id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"[DFA Database] SQLite initialized at: {DB_PATH}")

def save_audit_record(audit_type, target_name, language, verdict, risk_level, fake_score, metrics_dict):
    conn = get_db_connection()
    cursor = conn.cursor()
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    
    cursor.execute('''
        INSERT INTO audit_records (audit_type, target_name, language, verdict, risk_level, fake_score, metrics_json, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (audit_type, target_name, language, verdict, risk_level, float(fake_score), json.dumps(metrics_dict), ts))
    
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return record_id

def get_audit_records(limit=50):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM audit_records ORDER BY id DESC LIMIT ?', (limit,))
    rows = cursor.fetchall()
    
    records = []
    for r in rows:
        records.append({
            "id": r["id"],
            "audit_type": r["audit_type"],
            "target_name": r["target_name"],
            "language": r["language"],
            "verdict": r["verdict"],
            "risk_level": r["risk_level"],
            "fake_score": r["fake_score"],
            "metrics": json.loads(r["metrics_json"]),
            "timestamp": r["timestamp"]
        })
    conn.close()
    return records

def delete_audit_record(record_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM audit_records WHERE id = ?', (record_id,))
    conn.commit()
    conn.close()
    return True

def save_expert_feedback(record_id, rating, comments=""):
    conn = get_db_connection()
    cursor = conn.cursor()
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute('''
        INSERT INTO expert_feedback (record_id, rating, comments, timestamp)
        VALUES (?, ?, ?, ?)
    ''', (record_id, rating, comments, ts))
    conn.commit()
    conn.close()
    return True

def get_system_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) as total FROM audit_records')
    total_audits = cursor.fetchone()["total"]
    
    cursor.execute('SELECT COUNT(*) as deepfakes FROM audit_records WHERE fake_score >= 0.5 AND audit_type = "video"')
    deepfakes_detected = cursor.fetchone()["deepfakes"]
    
    cursor.execute('SELECT COUNT(*) as fake_news FROM audit_records WHERE fake_score >= 0.55 AND audit_type IN ("text", "url")')
    fake_news_flagged = cursor.fetchone()["fake_news"]
    
    conn.close()
    return {
        "total_audits": total_audits,
        "deepfakes_detected": deepfakes_detected,
        "fake_news_flagged": fake_news_flagged,
        "db_status": "connected"
    }

# Run init on import
init_db()
