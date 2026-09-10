import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle2, XCircle, HelpCircle,
  Download, Share2, ExternalLink, ChevronRight, Eye
} from 'lucide-react';

const VERDICT_STYLES = {
  'LIKELY MISLEADING': { 
    badge: 'ts-badge-misleading', icon: AlertTriangle,
    meterColor: 'var(--misleading)',
    gradient: 'var(--warning-gradient)',
    glow: 'var(--glow-warning)',
  },
  'FALSE': { 
    badge: 'ts-badge-false', icon: XCircle,
    meterColor: 'var(--false)',
    gradient: 'var(--danger-gradient)',
    glow: 'var(--glow-danger)',
  },
  'VERIFIED': { 
    badge: 'ts-badge-verified', icon: CheckCircle2,
    meterColor: 'var(--verified)',
    gradient: 'var(--success-gradient)',
    glow: 'var(--glow-success)',
  },
  'UNVERIFIED': { 
    badge: 'ts-badge-unverified', icon: HelpCircle,
    meterColor: 'var(--unverified)',
    gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)',
    glow: 'none',
  },
};

const REASONS = [
  '3 credible sources contradict the central claim.',
  'The attached image predates the article by 4 years.',
  'The original statement was taken out of context.',
];

export default function ResultsDashboard({ result, onViewEvidence, onDownloadReport }) {
  const verdict = result?.verdict || 'LIKELY MISLEADING';
  const confidence = result?.confidence || 87;
  const style = VERDICT_STYLES[verdict] || VERDICT_STYLES['UNVERIFIED'];
  const VerdictIcon = style.icon;

  const [animatedConf, setAnimatedConf] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedConf(Math.round(eased * confidence));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [confidence]);

  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="ts-section-title" style={{ fontSize: '24px', marginBottom: '6px' }}>
          Verification Result
        </h1>
        <p className="ts-section-subtitle">
          Analysis complete. Review the findings and evidence below.
        </p>
      </div>

      {/* ── Two-Column Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
        
        {/* ── LEFT: Main Content ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Verdict Card */}
          <div className="ts-card" style={{ 
            padding: '32px', position: 'relative', overflow: 'hidden',
          }}>
            {/* Gradient top bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
              background: style.gradient,
            }} />

            {/* Verdict aura glow */}
            <div style={{
              position: 'absolute', top: '-40px', right: '-40px',
              width: '160px', height: '160px',
              borderRadius: '50%',
              background: style.meterColor,
              opacity: 0.06,
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }} />

            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '14px', 
              marginBottom: '24px', position: 'relative',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: style.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: style.glow,
              }}>
                <VerdictIcon size={22} style={{ color: '#fff' }} />
              </div>
              <div>
                <span className={`ts-badge ${style.badge}`} style={{ fontSize: '13px', padding: '5px 14px' }}>
                  {verdict}
                </span>
              </div>
            </div>

            {/* Confidence Meter */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                marginBottom: '10px',
              }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Confidence
                </span>
                <span className="anim-count-up" style={{ 
                  fontSize: '36px', fontWeight: '800', 
                  letterSpacing: '-1.5px',
                  fontFamily: 'var(--font-mono)',
                }}>
                  <span className="ts-gradient-text">{animatedConf}%</span>
                </span>
              </div>
              <div className="ts-meter" style={{ height: '12px', borderRadius: '6px' }}>
                <div 
                  className="ts-meter-fill anim-progress"
                  style={{ 
                    width: `${confidence}%`, 
                    background: style.gradient,
                    borderRadius: '6px',
                  }} 
                />
              </div>
            </div>

            {/* Why this result? */}
            <div style={{
              padding: '20px', borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-default)',
            }}>
              <h3 style={{ 
                fontSize: '14px', fontWeight: '600', 
                color: 'var(--text-primary)', marginBottom: '14px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <AlertTriangle size={14} style={{ color: style.meterColor }} />
                Why this result?
              </h3>
              <ul style={{ 
                listStyle: 'none', padding: 0, 
                display: 'flex', flexDirection: 'column', gap: '10px',
              }}>
                {REASONS.map((reason, i) => (
                  <li key={i} style={{ 
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5',
                  }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: style.gradient, opacity: 0.15,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: '1px',
                    }}>
                      <ChevronRight size={12} style={{ color: style.meterColor }} />
                    </div>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="ts-btn ts-btn-primary" onClick={onViewEvidence}>
              <Eye size={15} />
              <span>View Evidence</span>
            </button>
            <button className="ts-btn ts-btn-secondary" onClick={onDownloadReport}>
              <Download size={15} />
              <span>Download Report</span>
            </button>
            <button className="ts-btn ts-btn-secondary">
              <Share2 size={15} />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* ── RIGHT: Summary Panel ── */}
        <div className="ts-card" style={{ 
          padding: '24px', position: 'relative', overflow: 'hidden',
        }}>
          {/* Gradient top bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'var(--accent-gradient)',
          }} />

          <h3 style={{ 
            fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.4px',
            marginBottom: '20px', paddingBottom: '12px',
            borderBottom: '1px solid var(--border-default)',
          }}>
            Investigation Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Verdict', value: verdict, highlight: true },
              { label: 'Confidence', value: `${confidence}%` },
              { label: 'Language', value: 'Hindi (हिन्दी)' },
              { label: 'Content Type', value: result?.type === 'video' ? 'Video' : 'Article' },
              { label: 'Claims Analyzed', value: '7' },
              { label: 'Sources Checked', value: '12' },
              { label: 'Analysis Time', value: '14.2 sec' },
              { label: 'Case ID', value: 'TS-2026-008241', mono: true },
            ].map((item, i) => (
              <div key={i} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {item.label}
                </span>
                <span style={{ 
                  fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)',
                  fontFamily: item.mono ? 'var(--font-mono)' : 'inherit',
                  textAlign: 'right',
                  ...(item.highlight ? {
                    background: style.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: '700',
                  } : {}),
                }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
