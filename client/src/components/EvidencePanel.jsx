import React from 'react';
import { ExternalLink, CheckCircle2, AlertTriangle, XCircle, Clock, FileText, Globe } from 'lucide-react';

const EVIDENCE_SOURCES = [
  {
    source: 'Reuters Fact-Check',
    type: 'Fact-Check Organization',
    published: 'August 24, 2026',
    relationship: 'Contradicts claim',
    strength: 'Strong',
    strengthColor: 'var(--verified)',
    strengthGradient: 'var(--success-gradient)',
    note: 'Identical text previously circulated in 2023 with altered dates. Verified as fabricated.',
  },
  {
    source: 'Reserve Bank of India — Official Portal',
    type: 'Government Source',
    published: 'August 22, 2026',
    relationship: 'Contradicts claim',
    strength: 'Strong',
    strengthColor: 'var(--verified)',
    strengthGradient: 'var(--success-gradient)',
    note: 'No directive regarding account closures issued. Official statement confirms normal operations.',
  },
  {
    source: 'NDTV Fact-Check Bureau',
    type: 'News Organization',
    published: 'August 23, 2026',
    relationship: 'Contradicts claim',
    strength: 'Moderate',
    strengthColor: 'var(--misleading)',
    strengthGradient: 'var(--warning-gradient)',
    note: 'Similar WhatsApp forward debunked multiple times since 2021.',
  },
  {
    source: 'Alt News Investigation',
    type: 'Independent Fact-Checker',
    published: 'August 21, 2026',
    relationship: 'Provides context',
    strength: 'Moderate',
    strengthColor: 'var(--misleading)',
    strengthGradient: 'var(--warning-gradient)',
    note: 'Traced original claim origin to a satirical post misinterpreted as news.',
  },
];

const TIMELINE = [
  { year: '2021', event: 'Original satirical post published on social media', type: 'origin' },
  { year: '2023', event: 'Post repackaged with updated dates and forwarded via WhatsApp', type: 'spread' },
  { year: '2024', event: 'Debunked by Reuters and Alt News after viral spread', type: 'debunked' },
  { year: '2026', event: 'Re-emerged with new urgency language and banking panic framing', type: 'current' },
];

const typeColors = {
  origin: 'var(--text-muted)',
  spread: 'var(--misleading)',
  debunked: 'var(--verified)',
  current: 'var(--accent)',
};

const typeGlows = {
  origin: 'none',
  spread: 'var(--glow-warning)',
  debunked: 'var(--glow-success)',
  current: 'var(--glow-accent)',
};

export default function EvidencePanel() {
  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 48px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px', paddingTop: '32px', borderTop: '1px solid var(--border-default)' }}>
        <h2 className="ts-section-title">Evidence</h2>
        <p className="ts-section-subtitle">Sources used to evaluate this content.</p>
      </div>

      {/* Source Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
        {EVIDENCE_SOURCES.map((ev, i) => (
          <div key={i} className={`ts-card anim-fade-in-up stagger-${i + 1}`} style={{ 
            padding: '20px', position: 'relative', overflow: 'hidden',
            borderLeft: `3px solid ${ev.strengthColor}`,
            borderRadius: 'var(--radius-lg)',
          }}>
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              marginBottom: '10px', flexWrap: 'wrap', gap: '8px',
            }}>
              <div>
                <div style={{ 
                  fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)',
                  marginBottom: '2px',
                }}>
                  {ev.source}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {ev.type}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="ts-badge ts-badge-verified" style={{ fontSize: '10px' }}>
                  {ev.relationship}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '12px' }}>
              {ev.note}
            </p>

            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '8px',
            }}>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> Published {ev.published}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Evidence strength:{' '}
                  <strong style={{ 
                    background: ev.strengthGradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{ev.strength}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button className="ts-btn ts-btn-ghost ts-btn-sm">
                  <ExternalLink size={13} /> Open Source
                </button>
                <button className="ts-btn ts-btn-ghost ts-btn-sm">
                  <FileText size={13} /> View Context
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Information Timeline ── */}
      <div>
        <h3 style={{ 
          fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)',
          marginBottom: '20px',
        }}>
          Information Timeline
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          How this claim has evolved and spread over time.
        </p>

        <div style={{ 
          display: 'flex', flexDirection: 'column', gap: '0',
          paddingLeft: '20px', borderLeft: '2px solid var(--border-default)',
        }}>
          {TIMELINE.map((item, i) => (
            <div key={i} className={`anim-fade-in-up stagger-${i + 1}`} style={{ 
              position: 'relative', paddingLeft: '24px', paddingBottom: i === TIMELINE.length - 1 ? '0' : '28px',
            }}>
              {/* Dot with glow */}
              <div style={{
                position: 'absolute', left: '-28px', top: '2px',
                width: '12px', height: '12px', borderRadius: '50%',
                background: typeColors[item.type],
                border: '2px solid var(--bg-surface)',
                boxShadow: typeGlows[item.type],
              }} />
              
              <div style={{ 
                fontSize: '12px', fontWeight: '700',
                fontFamily: 'var(--font-mono)',
                marginBottom: '4px',
              }}>
                <span style={{
                  background: item.type === 'current' ? 'var(--accent-gradient)' : 'none',
                  WebkitBackgroundClip: item.type === 'current' ? 'text' : 'unset',
                  WebkitTextFillColor: item.type === 'current' ? 'transparent' : typeColors[item.type],
                  backgroundClip: item.type === 'current' ? 'text' : 'unset',
                  color: typeColors[item.type],
                }}>
                  {item.year}
                </span>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                {item.event}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
