import React, { useState } from 'react';
import { 
  Search, Filter, FileText, Video, Image, Mic, Link2,
  MoreHorizontal, Eye, Copy, Download, Trash2, ChevronDown
} from 'lucide-react';

const MOCK_RECORDS = [
  { id: 'TS-2026-008241', title: 'Hindi Banking Panic WhatsApp Forward', type: 'text', language: 'Hindi', verdict: 'LIKELY MISLEADING', confidence: 87, date: '2026-08-24', icon: FileText },
  { id: 'TS-2026-008239', title: 'Tamil Medical Remedy Chain Message', type: 'text', language: 'Tamil', verdict: 'FALSE', confidence: 94, date: '2026-08-24', icon: FileText },
  { id: 'TS-2026-008236', title: 'CEO Resignation Deepfake Video', type: 'video', language: 'English', verdict: 'MANIPULATED', confidence: 91, date: '2026-08-23', icon: Video },
  { id: 'TS-2026-008230', title: 'Satellite Image Weather Manipulation', type: 'image', language: 'English', verdict: 'LIKELY MISLEADING', confidence: 72, date: '2026-08-22', icon: Image },
  { id: 'TS-2026-008225', title: 'Political Speech Audio Clone', type: 'audio', language: 'Hindi', verdict: 'MANIPULATED', confidence: 86, date: '2026-08-21', icon: Mic },
  { id: 'TS-2026-008220', title: 'Bengali Financial Scheme Promotion', type: 'text', language: 'Bengali', verdict: 'FALSE', confidence: 93, date: '2026-08-20', icon: FileText },
  { id: 'TS-2026-008215', title: 'French Election Poll Misinformation', type: 'url', language: 'French', verdict: 'UNVERIFIED', confidence: 58, date: '2026-08-19', icon: Link2 },
];

const VERDICT_BADGE = {
  'LIKELY MISLEADING': 'ts-badge-misleading',
  'FALSE': 'ts-badge-false',
  'MANIPULATED': 'ts-badge-false',
  'VERIFIED': 'ts-badge-verified',
  'UNVERIFIED': 'ts-badge-unverified',
};

const FILTERS = ['All', 'Verified', 'Misleading', 'False', 'Manipulated', 'Unverified'];

export default function InvestigationHistory({ onOpenReport }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [actionMenuId, setActionMenuId] = useState(null);

  const filtered = MOCK_RECORDS.filter(r => {
    if (activeFilter !== 'All' && !r.verdict.toLowerCase().includes(activeFilter.toLowerCase())) return false;
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="ts-section-title" style={{ fontSize: '24px', marginBottom: '6px' }}>
          Investigations
        </h1>
        <p className="ts-section-subtitle">
          {MOCK_RECORDS.length} investigations on record.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '16px', flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={15} style={{ 
            position: 'absolute', left: '12px', top: '50%', 
            transform: 'translateY(-50%)', color: 'var(--text-muted)',
          }} />
          <input
            className="ts-input"
            placeholder="Search investigations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap',
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
      <div className="ts-card" style={{ overflow: 'hidden', position: 'relative', borderRadius: 'var(--radius-xl)' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'var(--accent-gradient)',
        }} />
        <table className="ts-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Investigation</th>
              <th>Type</th>
              <th>Language</th>
              <th>Result</th>
              <th>Confidence</th>
              <th>Date</th>
              <th style={{ width: '60px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((record) => {
              const Icon = record.icon;
              return (
                <tr key={record.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '13px' }}>{record.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {record.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                      {record.type}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {record.language}
                    </span>
                  </td>
                  <td>
                    <span className={`ts-badge ${VERDICT_BADGE[record.verdict] || 'ts-badge-unverified'}`}>
                      {record.verdict}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                      {record.confidence}%
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {record.date}
                    </span>
                  </td>
                  <td>
                    <div style={{ position: 'relative' }}>
                      <button 
                        className="ts-btn ts-btn-ghost ts-btn-sm"
                        onClick={() => setActionMenuId(actionMenuId === record.id ? null : record.id)}
                        style={{ padding: '4px' }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {actionMenuId === record.id && (
                        <div className="anim-scale-in ts-glass-strong" style={{
                          position: 'absolute', right: 0, top: '100%',
                          borderRadius: 'var(--radius-lg)',
                          boxShadow: 'var(--shadow-xl)',
                          minWidth: '160px', zIndex: 50,
                          padding: '4px',
                        }}>
                          {[
                            { icon: Eye, label: 'Open', action: () => onOpenReport?.() },
                            { icon: Copy, label: 'Duplicate' },
                            { icon: Download, label: 'Export' },
                            { icon: Trash2, label: 'Delete', danger: true },
                          ].map((item, i) => (
                            <button
                              key={i}
                              className="ts-btn ts-btn-ghost"
                              onClick={() => { item.action?.(); setActionMenuId(null); }}
                              style={{
                                width: '100%', justifyContent: 'flex-start',
                                fontSize: '13px', padding: '8px 12px',
                                color: item.danger ? 'var(--false)' : 'var(--text-secondary)',
                                borderRadius: 'var(--radius-md)',
                              }}
                            >
                              <item.icon size={14} />
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No investigations match your search.
          </div>
        )}
      </div>
    </div>
  );
}
