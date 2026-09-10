import React from 'react';
import { 
  ShieldCheck, Download, Printer, Clock, FileText, Globe,
  CheckCircle2, AlertTriangle, XCircle, BarChart3
} from 'lucide-react';

export default function VerificationReport() {
  const handlePrint = () => window.print();

  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
      
      {/* Action Bar (hidden in print) */}
      <div className="ts-no-print" style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '24px', flexWrap: 'wrap', gap: '12px',
      }}>
        <h1 className="ts-section-title" style={{ fontSize: '24px' }}>
          Verification Report
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ts-btn ts-btn-secondary" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print</span>
          </button>
          <button className="ts-btn ts-btn-primary">
            <Download size={15} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* ── Report Document ── */}
      <div className="ts-card" style={{ padding: '48px', lineHeight: '1.7', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
        {/* Gradient top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'var(--accent-gradient)',
        }} />
        
        {/* Report Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px', paddingBottom: '32px', borderBottom: '2px solid var(--border-default)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
                width: '32px', height: '32px', borderRadius: 'var(--radius-md)',
                background: 'var(--accent-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
              }}>
                <ShieldCheck size={18} style={{ color: '#fff' }} />
              </div>
            <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.3px' }}>
              <span className="ts-gradient-text">TRUTH LENS</span>
            </span>
          </div>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
            Verification Report
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <div><strong>Case ID:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>TL-2026-008241</span></div>
            <div><strong>Date:</strong> August 24, 2026</div>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <span className="ts-badge ts-badge-misleading" style={{ fontSize: '12px', padding: '6px 16px' }}>
              <AlertTriangle size={14} />
              LIKELY MISLEADING — 87% Confidence
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-default)' }}>
            1. Executive Summary
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            The submitted content — a Hindi-language WhatsApp forward claiming imminent nationwide bank account 
            closures — has been assessed as <strong>Likely Misleading</strong> with 87% confidence. Analysis of 
            7 individual claims against 12 authoritative sources reveals that the central assertions are directly 
            contradicted by official Reserve Bank of India communications and have been previously debunked by 
            Reuters Fact-Check and Alt News.
          </p>
        </section>

        {/* Claim Analysis Summary */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-default)' }}>
            2. Claim Analysis
          </h3>
          <table className="ts-table" style={{ marginTop: '12px' }}>
            <thead>
              <tr>
                <th>Claim</th>
                <th>Verdict</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {[
                { claim: 'Bank accounts will be shut down nationwide', verdict: 'FALSE', conf: '96%' },
                { claim: 'Authorities issued emergency warning', verdict: 'FALSE', conf: '91%' },
                { claim: 'Confirmed by multiple news channels', verdict: 'UNVERIFIED', conf: '78%' },
                { claim: 'Citizens should withdraw all funds', verdict: 'MISLEADING', conf: '89%' },
              ].map((c, i) => (
                <tr key={i}>
                  <td style={{ fontSize: '13px' }}>{c.claim}</td>
                  <td>
                    <span className={`ts-badge ${c.verdict === 'FALSE' ? 'ts-badge-false' : c.verdict === 'MISLEADING' ? 'ts-badge-misleading' : 'ts-badge-unverified'}`}>
                      {c.verdict}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{c.conf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Evidence */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-default)' }}>
            3. Evidence & Sources
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { source: 'Reserve Bank of India — Official Portal', relation: 'Contradicts claim', strength: 'Strong' },
              { source: 'Reuters Fact-Check Archives', relation: 'Previously debunked', strength: 'Strong' },
              { source: 'Alt News Investigation Database', relation: 'Pattern match', strength: 'Moderate' },
              { source: 'NDTV Fact-Check Bureau', relation: 'Contradicts claim', strength: 'Moderate' },
            ].map((ev, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                background: 'var(--bg-inset)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: '13px',
              }}>
                <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{ev.source}</span>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{ev.relation}</span>
                  <span style={{ fontWeight: '600', color: ev.strength === 'Strong' ? 'var(--verified)' : 'var(--misleading)' }}>
                    {ev.strength}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Language Analysis */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-default)' }}>
            4. Language Analysis
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Detected Language</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Hindi (हिन्दी)</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Script</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Devanagari</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Sensationalism Score</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--false)' }}>High (0.89)</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Urgency Indicators</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--misleading)' }}>4 detected</div>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-default)' }}>
            5. Methodology
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            This verification was performed using Truth Lens's multi-stage forensic pipeline, which includes:
          </p>
          <ol style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li>Automated language detection and script identification</li>
            <li>Claim decomposition using NLP entity and temporal extraction</li>
            <li>Cross-referencing against government databases, news archives, and fact-check repositories</li>
            <li>Linguistic pattern analysis for sensationalism, urgency, and manipulation indicators</li>
            <li>Multi-modal consistency verification (when media is present)</li>
          </ol>
        </section>

        {/* Limitations */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-default)' }}>
            6. Limitations
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            This analysis is based on publicly available sources and automated pattern detection. Results should 
            be evaluated alongside the cited evidence and original sources. Truth Lens provides analytical assistance 
            for content verification — it does not replace human editorial judgment.
          </p>
        </section>

        {/* Footer */}
        <div style={{
          paddingTop: '24px', borderTop: '2px solid var(--border-default)',
          textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)',
        }}>
          <p style={{ marginBottom: '4px' }}>
            <strong>TRUTH LENS</strong> — AI-Assisted Multilingual Verification Platform
          </p>
          <p>
            This report was generated automatically. Results should be evaluated alongside cited evidence and original sources.
          </p>
        </div>
      </div>
    </div>
  );
}
