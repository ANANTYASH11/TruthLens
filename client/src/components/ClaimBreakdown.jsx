import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertTriangle, HelpCircle, ExternalLink } from 'lucide-react';

const CLAIMS = [
  {
    id: 1,
    text: '"India\'s bank accounts nationwide will be shut down immediately."',
    verdict: 'FALSE',
    confidence: 96,
    finding: 'No official directive from the Reserve Bank of India or any government body supports this claim. The RBI confirmed normal banking operations across all regions.',
    source: 'Reserve Bank of India — Official Communications',
    sourceDate: 'August 22, 2026',
    sourceRelation: 'Directly contradicts',
  },
  {
    id: 2,
    text: '"Authorities have issued an emergency financial warning."',
    verdict: 'FALSE',
    confidence: 91,
    finding: 'No emergency financial warning was issued by any government authority. The Finance Ministry confirmed no such advisory exists.',
    source: 'Ministry of Finance — Press Information Bureau',
    sourceDate: 'August 23, 2026',
    sourceRelation: 'Directly contradicts',
  },
  {
    id: 3,
    text: '"This is breaking news confirmed by multiple channels."',
    verdict: 'UNVERIFIED',
    confidence: 78,
    finding: 'No major news organization has covered or confirmed this story. The claim lacks attribution to any credible media outlet.',
    source: 'Media monitoring — Press Trust of India',
    sourceDate: 'August 24, 2026',
    sourceRelation: 'No coverage found',
  },
  {
    id: 4,
    text: '"Citizens should withdraw all funds immediately."',
    verdict: 'MISLEADING',
    confidence: 89,
    finding: 'This language pattern matches previously identified panic-inducing financial misinformation campaigns. Similar templates were used in 2021 and 2023.',
    source: 'Alt News Pattern Database',
    sourceDate: 'August 21, 2026',
    sourceRelation: 'Pattern match identified',
  },
];

const VERDICT_MAP = {
  'FALSE': { badge: 'ts-badge-false', icon: XCircle, color: 'var(--false)', gradient: 'var(--danger-gradient)' },
  'MISLEADING': { badge: 'ts-badge-misleading', icon: AlertTriangle, color: 'var(--misleading)', gradient: 'var(--warning-gradient)' },
  'UNVERIFIED': { badge: 'ts-badge-unverified', icon: HelpCircle, color: 'var(--unverified)', gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)' },
  'SUPPORTED': { badge: 'ts-badge-verified', icon: CheckCircle2, color: 'var(--verified)', gradient: 'var(--success-gradient)' },
};

export default function ClaimBreakdown() {
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => {
    setExpanded(prev => prev === id ? null : id);
  };

  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 48px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px', paddingTop: '32px', borderTop: '1px solid var(--border-default)' }}>
        <h2 className="ts-section-title">Claim-by-Claim Analysis</h2>
        <p className="ts-section-subtitle">
          Each extracted claim verified independently against available sources.
        </p>
      </div>

      {/* Claims Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {CLAIMS.map((claim) => {
          const isOpen = expanded === claim.id;
          const vs = VERDICT_MAP[claim.verdict] || VERDICT_MAP['UNVERIFIED'];
          const VIcon = vs.icon;
          
          return (
            <div key={claim.id} className="ts-card" style={{ overflow: 'hidden', borderLeft: `3px solid ${vs.color}`, borderRadius: 'var(--radius-lg)' }}>
              {/* Collapsed Row */}
              <button
                onClick={() => toggle(claim.id)}
                style={{
                  width: '100%', textAlign: 'left', cursor: 'pointer',
                  padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  background: 'none', border: 'none',
                  color: 'var(--text-primary)',
                }}
              >
                <span style={{ 
                  fontSize: '11px', fontWeight: '700', color: '#fff',
                  fontFamily: 'var(--font-mono)', flexShrink: 0, minWidth: '56px',
                  background: vs.gradient, padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  CLAIM {String(claim.id).padStart(2, '0')}
                </span>
                <span style={{ 
                  flex: 1, fontSize: '14px', color: 'var(--text-primary)',
                  fontWeight: '500', lineHeight: '1.4',
                }}>
                  {claim.text}
                </span>
                <span className={`ts-badge ${vs.badge}`}>
                  <VIcon size={12} />
                  {claim.verdict}
                </span>
                <span style={{ 
                  fontSize: '12px', color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)', flexShrink: 0,
                }}>
                  {claim.confidence}%
                </span>
                {isOpen ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
              </button>

              {/* Expanded Detail */}
              {isOpen && (
                <div className="anim-fade-in" style={{ 
                  padding: '0 20px 20px 92px',
                  borderTop: '1px solid var(--border-default)',
                  paddingTop: '16px',
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ 
                      fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.3px',
                      marginBottom: '8px',
                    }}>
                      What we found
                    </h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {claim.finding}
                    </p>
                  </div>

                  <div className="ts-card-flat" style={{ 
                    padding: '14px 16px', 
                    background: 'var(--bg-inset)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: '8px',
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {claim.source}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Published: {claim.sourceDate} · {claim.sourceRelation}
                      </div>
                    </div>
                    <button className="ts-btn ts-btn-ghost ts-btn-sm">
                      <ExternalLink size={13} />
                      <span>View Source</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
