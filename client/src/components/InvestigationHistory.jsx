import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, FileText, Video, Image, Mic, Link2,
  MoreHorizontal, Eye, Copy, Download, Trash2, ChevronDown,
  Database, RefreshCw, AlertCircle
} from 'lucide-react';
import { getInvestigations, deleteInvestigation } from '../services/api';

const DEFAULT_RECORDS = [
  { case_id: 'TL-2026-0082', title: 'Hindi Banking Panic WhatsApp Forward', mode: 'multimodal', language_name: 'Hindi', verdict: 'FABRICATED / HIGH MISINFORMATION RISK', trust_score: 28.4, created_at: '2026-08-24 14:20' },
  { case_id: 'TL-2026-0079', title: 'Punjabi Election Mock Poll EVM Hoax', mode: 'multimodal', language_name: 'Punjabi', verdict: 'QUESTIONABLE / CONTEXT MISMATCH', trust_score: 46.2, created_at: '2026-08-24 11:05' },
  { case_id: 'TL-2026-0074', title: 'Tamil Miracle Cancer Cure Forward', mode: 'text', language_name: 'Tamil', verdict: 'FABRICATED / HIGH MISINFORMATION RISK', trust_score: 18.0, created_at: '2026-08-23 18:30' },
  { case_id: 'TL-2026-0068', title: 'CEO Resignation Deepfake Video', mode: 'video', language_name: 'English', verdict: 'FABRICATED MANIPULATION DETECTED', trust_score: 21.5, created_at: '2026-08-22 09:15' },
];

const FILTERS = ['All', 'Verified', 'Misleading', 'Fabricated', 'Questionable'];

export default function InvestigationHistory({ onOpenReport, onSelectCase }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isDbConnected, setIsDbConnected] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    const dbRecords = await getInvestigations(50);
    if (dbRecords && dbRecords.length > 0) {
      setRecords(dbRecords);
      setIsDbConnected(true);
    } else {
      setRecords(DEFAULT_RECORDS);
      setIsDbConnected(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (e, caseId) => {
    e.stopPropagation();
    if (window.confirm(`Delete investigation record ${caseId}?`)) {
      await deleteInvestigation(caseId);
      setRecords(prev => prev.filter(r => r.case_id !== caseId));
    }
  };

  const filtered = records.filter(r => {
    const verdictStr = (r.verdict || '').toLowerCase();
    if (activeFilter === 'Verified' && !verdictStr.includes('authentic') && !verdictStr.includes('verified')) return false;
    if (activeFilter === 'Fabricated' && !verdictStr.includes('fabricated') && !verdictStr.includes('deepfake')) return false;
    if (activeFilter === 'Questionable' && !verdictStr.includes('questionable') && !verdictStr.includes('misleading')) return false;
    if (searchQuery && !(r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) && !(r.case_id || '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Database Audit Trail
            </span>
            <span style={{ color: 'var(--border-default)' }}>•</span>
            <span style={{ fontSize: '11px', color: isDbConnected ? 'var(--verified)' : 'var(--text-muted)' }}>
              {isDbConnected ? 'Connected: SQLite (truthlens.db)' : 'Offline Demonstration Store'}
            </span>
          </div>
          <h1 className="ts-section-title" style={{ fontSize: '28px', margin: 0 }}>
            Past Forensic Investigations
          </h1>
        </div>

        <button 
          onClick={fetchRecords} 
          className="ts-btn ts-btn-secondary"
          style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={13} className={loading ? 'anim-spin' : ''} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '20px', flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={15} style={{ 
            position: 'absolute', left: '12px', top: '50%', 
            transform: 'translateY(-50%)', color: 'var(--text-muted)',
          }} />
          <input
            className="ts-input"
            placeholder="Search cases, claims, language..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', width: '100%' }}
          />
        </div>

        <div style={{ 
          display: 'flex', gap: '4px', flexWrap: 'wrap',
          background: 'var(--bg-inset)', padding: '3px',
          borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)',
        }}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`ts-btn ${activeFilter === f ? 'ts-btn-primary' : 'ts-btn-ghost'} ts-btn-sm`}
              onClick={() => setActiveFilter(f)}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="ts-card" style={{ overflow: 'hidden', position: 'relative', borderRadius: 'var(--radius-xl)', padding: 0 }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'var(--accent-gradient)',
        }} />
        
        <table className="ts-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-inset)', borderBottom: '1px solid var(--border-default)', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 18px', width: '38%' }}>Investigation</th>
              <th style={{ padding: '14px 18px' }}>Type</th>
              <th style={{ padding: '14px 18px' }}>Language</th>
              <th style={{ padding: '14px 18px' }}>Verdict</th>
              <th style={{ padding: '14px 18px' }}>Trust Score</th>
              <th style={{ padding: '14px 18px' }}>Date</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => {
              const isManipulated = (r.verdict || '').toLowerCase().includes('fabricated') || (r.verdict || '').toLowerCase().includes('deepfake');
              const isVerified = (r.verdict || '').toLowerCase().includes('authentic') || (r.verdict || '').toLowerCase().includes('verified');
              const badgeClass = isVerified ? 'ts-badge-verified' : (isManipulated ? 'ts-badge-false' : 'ts-badge-misleading');

              return (
                <tr 
                  key={r.case_id}
                  onClick={() => onSelectCase ? onSelectCase(r) : onOpenReport()}
                  style={{ borderBottom: '1px solid var(--border-default)', cursor: 'pointer', transition: 'background 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '3px' }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {r.case_id}
                    </div>
                  </td>

                  <td style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span style={{ textTransform: 'capitalize' }}>{r.mode || 'multimodal'}</span>
                  </td>

                  <td style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {r.language_name || 'Regional'}
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <span className={`ts-badge ${badgeClass}`} style={{ fontSize: '10px' }}>
                      {r.verdict}
                    </span>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: isVerified ? 'var(--verified)' : (isManipulated ? 'var(--false)' : 'var(--misleading)') }}>
                      {Math.round(r.trust_score || 50)}%
                    </span>
                  </td>

                  <td style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {r.created_at ? r.created_at.slice(0, 16) : 'Just now'}
                  </td>

                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); onOpenReport(); }}
                        className="ts-btn ts-btn-secondary ts-btn-sm"
                        style={{ padding: '4px 8px' }}
                        title="View Report"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, r.case_id)}
                        className="ts-btn ts-btn-secondary ts-btn-sm"
                        style={{ padding: '4px 8px', color: 'var(--false)' }}
                        title="Delete Record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No investigations match your filter criteria.
          </div>
        )}
      </div>

    </div>
  );
}
