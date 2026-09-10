import React from 'react';
import { 
  Cpu, Database, Layers, ShieldCheck, AlertTriangle, 
  HelpCircle, BarChart3, CheckCircle2, FileText, Sparkles, BookOpen
} from 'lucide-react';

export default function MethodologyGuide() {
  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: 'var(--radius-md)',
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff'
          }}>
            <BookOpen size={16} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Academic Viva & Defense Documentation
          </span>
        </div>
        <h1 className="ts-section-title" style={{ fontSize: '30px', marginBottom: '8px' }}>
          TruthLens System Methodology & Viva Guide
        </h1>
        <p className="ts-section-subtitle" style={{ maxWidth: '780px' }}>
          Engineering rationale, architectural decisions, model selection benchmarks, 
          and honest error analysis prepared for major project examiners and panel evaluation.
        </p>
      </div>

      {/* ── Section 1: The Core Academic Differentiators ── */}
      <div className="ts-card" style={{ padding: '28px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} style={{ color: 'var(--accent)' }} />
          1. Key Differentiators & Problem Statement
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
          Traditional college projects usually build either an isolated English-only deepfake detector or a plain text classifier. 
          TruthLens addresses two critical real-world gaps:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--bg-inset)', padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent)', marginBottom: '8px' }}>
              Dual Domain Fusion
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Combines media forensic sub-scores (face-swap boundaries, frequency anomalies) with text misinformation credibility into a single mathematically weighted Trust Score (0–100%).
            </p>
          </div>
          <div style={{ background: 'var(--bg-inset)', padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent)', marginBottom: '8px' }}>
              Indian Regional Language Focus
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Native script analysis across Hindi, Punjabi, Tamil, Bengali, Telugu, and English, detecting viral panic triggers and cross-referencing claims against verified Indian fact-check records.
            </p>
          </div>
          <div style={{ background: 'var(--bg-inset)', padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent)', marginBottom: '8px' }}>
              Explainable Visual Evidence
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Instead of opaque probabilities, examiners and fact-checkers receive Grad-CAM heatmap overlays, token-level manipulation triggers, and direct source debunk citations.
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 2: Architecture & Model Selection Rationale ── */}
      <div className="ts-card" style={{ padding: '28px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} style={{ color: 'var(--accent)' }} />
          2. Architectural Rationale: Feasible vs. Theoretical ML
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '18px' }}>
          When defending this project before an evaluation panel, examiners often ask: <em>"Why did you not train a Vision Transformer-Huge from scratch?"</em> Here is our defensible engineering rationale:
        </p>
        
        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-default)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 14px' }}>Component</th>
                <th style={{ padding: '10px 14px' }}>Theoretical Claim (Unfeasible)</th>
                <th style={{ padding: '10px 14px' }}>TruthLens Chosen Solution (Defensible)</th>
                <th style={{ padding: '10px 14px' }}>Viva Defense Reason</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                <td style={{ padding: '12px 14px', fontWeight: '600' }}>Deepfake Backbone</td>
                <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>ViT-Huge trained on 10M images</td>
                <td style={{ padding: '12px 14px', color: 'var(--accent)', fontWeight: '600' }}>Fine-tuned EfficientNet / Xception</td>
                <td style={{ padding: '12px 14px' }}>Runs on RTX 4060 / Apple Silicon with sub-second latency; avoids VRAM exhaustion.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                <td style={{ padding: '12px 14px', fontWeight: '600' }}>Explainability</td>
                <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Blackbox NeRF 3D reconstruction</td>
                <td style={{ padding: '12px 14px', color: 'var(--accent)', fontWeight: '600' }}>Grad-CAM thermal heatmap overlays</td>
                <td style={{ padding: '12px 14px' }}>Directly points to face-swap blending seams and facial contours for auditability.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                <td style={{ padding: '12px 14px', fontWeight: '600' }}>Regional NLP</td>
                <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Generic English LLM translation</td>
                <td style={{ padding: '12px 14px', color: 'var(--accent)', fontWeight: '600' }}>Multilingual IndicBERT / Token Cues</td>
                <td style={{ padding: '12px 14px' }}>Directly parses native Devanagari, Gurmukhi, and Tamil scripts without translation loss.</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 14px', fontWeight: '600' }}>Fact Verification</td>
                <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>Unindexed live web scraping</td>
                <td style={{ padding: '12px 14px', color: 'var(--accent)', fontWeight: '600' }}>Curated vector database of debunks</td>
                <td style={{ padding: '12px 14px' }}>Deterministic citations from PIB, Alt News, and BOOM Live with match confidence.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 3: Mathematical Fusion Engine ── */}
      <div className="ts-card" style={{ padding: '28px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} style={{ color: 'var(--accent)' }} />
          3. Unified Trust Score Formulation
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '14px' }}>
          The unified Trust Score $T \in [0, 100]$ is computed as a convex combination of visual forensics ($S_m$), 
          linguistic authenticity ($S_t$), and indexed fact-check consistency ($S_f$):
        </p>
        <div style={{
          background: 'var(--bg-inset)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          Trust Score = 0.45 · S_media + 0.35 · S_text + 0.20 · S_factcheck - Penalty(Discrepancy)
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          Where Penalty = 10.0 if |S_media - S_text| &gt; 40.0, penalizing <em>context recycling</em> attacks 
          (where genuine historical footage is attached to an inflammatory false regional headline).
        </p>
      </div>

      {/* ── Section 4: Honest Limitations & Evaluation Ethics ── */}
      <div className="ts-card" style={{ padding: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
          4. Known Limitations & Academic Candor
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <strong>Regional Dataset Scarcity:</strong> Open labeled fake-news datasets in Punjabi and Tamil are limited compared to English. 
              Mitigated by bootstrap translation-augmented training and transparent confidence margins ($\pm 3.5\%$).
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <strong>Zero-Day Generative Generalization:</strong> No forensic classifier is 100% invariant to brand-new diffusion models. 
              TruthLens therefore relies on multimodal corroboration rather than visual cues alone.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <strong>Human-in-the-Loop Requirement:</strong> TruthLens is designed as an analytical decision-support copilot for newsrooms and investigators, not an automated censorship authority.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
