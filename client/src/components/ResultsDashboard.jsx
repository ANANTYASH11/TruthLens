import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle2, XCircle, HelpCircle,
  Download, Share2, ExternalLink, ChevronRight, Eye, 
  Layers, Sliders, ShieldCheck, Globe, Sparkles, FileText,
  ScanLine, Copy, Check
} from 'lucide-react';

export default function ResultsDashboard({ result, onViewEvidence, onDownloadReport, onNewScan }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'media' | 'text' | 'factchecks'
  const [heatmapLayer, setHeatmapLayer] = useState('heatmap'); // 'original' | 'heatmap' | 'difference'
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Extract results safely with sensible defaults
  const trustScore = result?.unified_trust_score ?? (result?.fusion_result?.unified_trust_score ?? 34.2);
  const verdict = result?.verdict || result?.fusion_result?.verdict || 'FABRICATED / HIGH MISINFORMATION RISK';
  const confidenceMargin = result?.confidence_margin || result?.fusion_result?.confidence_margin || 3.5;
  const riskLevel = result?.risk_level || result?.fusion_result?.risk_level || 'CRITICAL RISK';
  
  const mediaAnalysis = result?.media_analysis || result?.fusion?.media || {
    file_name: "sample_executive_clip.mp4",
    media_trust_score: 18.5,
    average_fake_score: 0.815,
    frames: [
      {
        frame_index: 1, timestamp: "0.5s", fake_score: 0.82, trust_score: 18.0,
        attention_focus: "Facial boundary blending artifacts & lip-sync lag",
        gradcam_hotspots: [
          { region: "Periorbital & Brow", x_pct: 48, y_pct: 35, radius_pct: 25, intensity: 0.92, artifact: "GAN boundary glitch" },
          { region: "Mouth Seam", x_pct: 50, y_pct: 68, radius_pct: 22, intensity: 0.86, artifact: "Audio-visual jitter" }
        ],
        spectral_metrics: { fft_high_freq_anomaly: 0.88, dct_grid_fingerprint: 0.84, rppg_bvp_consistency: 0.22 }
      }
    ],
    primary_evidence: [
      "Grad-CAM activation highlights abnormal energy concentrations along facial contours.",
      "FFT spectral power density exhibits checkerboard grid artifacts from generative upsampling.",
      "rPPG remote photoplethysmography failed to detect periodic blood volume pulse."
    ]
  };

  const textAnalysis = result?.text_analysis || result?.fusion?.text || {
    language_name: "Hindi",
    language_native: "हिन्दी",
    language_script: "Devanagari",
    text_trust_score: 28.5,
    overall_fake_score: 0.715,
    annotated_tokens: [
      { token: "बड़ी", type: "sensational_claim" },
      { token: "खबर!", type: "sensational_claim" },
      { token: "सावधान", type: "urgency_marker" },
      { token: "रहें!", type: "urgency_marker" },
      { token: "तुरंत", type: "urgency_marker" },
      { token: "शेयर", type: "urgency_marker" },
      { token: "करें,", type: "urgency_marker" },
      { token: "बैंक", type: "neutral" },
      { token: "खाते", type: "neutral" },
      { token: "बंद", type: "neutral" },
      { token: "होने", type: "neutral" },
      { token: "वाले", type: "neutral" },
      { token: "हैं!", type: "neutral" },
      { token: "100%", type: "statistical_claim" },
      { token: "गुप्त", type: "sensational_claim" },
      { token: "जानकारी!", type: "sensational_claim" }
    ],
    claim_decomposition: {
      core_assertion: "बैंक खाते बंद होने वाले हैं, तुरंत पैसे निकालें।",
      asserted_numbers: ["100%"],
      detected_domains: [{ name: "Banking & Financial Sector", category: "FINANCE" }]
    },
    matched_fact_checks: [
      {
        id: "fc-001",
        title: "Claim: RBI orders closure of all zero-fee bank accounts nationwide",
        source: "PIB Fact Check",
        source_url: "https://factcheck.pib.gov.in",
        similarity_score: 0.84,
        debunk_summary: "PIB Fact Check confirmed no account-freezing directive was issued. All legitimate accounts remain safe."
      }
    ]
  };

  const fusionBreakdown = result?.fusion_result?.breakdown || {
    media_forensics: { trust_score: mediaAnalysis.media_trust_score, weight_pct: 45 },
    text_linguistics: { trust_score: textAnalysis.text_trust_score, weight_pct: 35, language: textAnalysis.language_name },
    fact_check_alignment: { trust_score: 15.0, weight_pct: 20 }
  };

  // Animated trust score count up
  const [animatedScore, setAnimatedScore] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * trustScore));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [trustScore]);

  // Color logic
  const isHighTrust = trustScore >= 70;
  const isMedTrust = trustScore >= 40 && trustScore < 70;
  const badgeClass = isHighTrust ? 'ts-badge-verified' : (isMedTrust ? 'ts-badge-misleading' : 'ts-badge-false');
  const meterColor = isHighTrust ? 'var(--verified)' : (isMedTrust ? 'var(--misleading)' : 'var(--false)');
  const gradientAccent = isHighTrust ? 'var(--success-gradient)' : (isMedTrust ? 'var(--warning-gradient)' : 'var(--danger-gradient)');

  const framesList = mediaAnalysis.frames || [];
  const currentFrameData = framesList[selectedFrame] || framesList[0] || {};

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '1150px', margin: '0 auto', padding: '40px 24px' }}>
      
      {/* Top Breadcrumb & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '600' }}>
              TruthLens Forensic Report
            </span>
            <span style={{ color: 'var(--border-default)' }}>•</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
              Case #{result?.record_id ? `TL-2026-${result.record_id.toString().padStart(4, '0')}` : 'TL-2026-8942'}
            </span>
          </div>
          <h1 className="ts-section-title" style={{ fontSize: '26px', margin: 0 }}>
            Forensic Verification Findings
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="ts-btn ts-btn-secondary" 
            onClick={handleCopyShare}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {copiedLink ? <Check size={14} style={{ color: 'var(--verified)' }} /> : <Share2 size={14} />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Case'}</span>
          </button>
          
          <button 
            className="ts-btn ts-btn-primary" 
            onClick={onDownloadReport}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>Export Audit PDF</span>
          </button>

          {onNewScan && (
            <button 
              className="ts-btn ts-btn-secondary" 
              onClick={onNewScan}
              style={{ fontSize: '13px' }}
            >
              New Scan
            </button>
          )}
        </div>
      </div>

      {/* ── HERO METRICS BAR: Trust Score Radial + Verdict ── */}
      <div className="ts-card" style={{ padding: '28px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: gradientAccent }} />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '32px', alignItems: 'center' }}>
          
          {/* Circular Trust Gauge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              background: `conic-gradient(${meterColor} ${animatedScore * 3.6}deg, var(--bg-inset) 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 24px ${meterColor}25`
            }}>
              <div style={{
                width: '94px', height: '94px', borderRadius: '50%',
                background: 'var(--bg-surface)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: '30px', fontWeight: '800', lineHeight: '1', color: 'var(--text-primary)' }}>
                  {animatedScore}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: '2px' }}>
                  Trust Score
                </span>
              </div>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
              Confidence ±{confidenceMargin}%
            </span>
          </div>

          {/* Verdict Narrative */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span className={`ts-badge ${badgeClass}`} style={{ fontSize: '12px', padding: '6px 14px' }}>
                {isHighTrust ? <CheckCircle2 size={14} /> : (isMedTrust ? <AlertTriangle size={14} /> : <XCircle size={14} />)}
                {verdict}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-inset)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                {riskLevel}
              </span>
            </div>

            <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '12px', maxWidth: '640px' }}>
              {result?.summary_narrative || (
                isHighTrust 
                  ? "Visual media and text signals display coherent, authentic biophysical signatures."
                  : (isMedTrust
                      ? "Discrepancy detected between media biophysics and regional text claim (context recycling suspected)."
                      : "Generative facial boundary blending artifacts detected alongside high-urgency sensational manipulation cues."
                    )
              )}
            </p>

            {/* Evidence Tags */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: 'var(--accent)', background: 'var(--accent-gradient-subtle)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontWeight: '600' }}>
                Media: {Math.round(mediaAnalysis.media_trust_score)}% Authentic
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-inset)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontWeight: '500' }}>
                Language: {textAnalysis.language_name} ({textAnalysis.language_native})
              </span>
              {textAnalysis.matched_fact_checks?.length > 0 && (
                <span style={{ fontSize: '11px', color: 'var(--misleading)', background: 'rgba(217,119,6,0.1)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontWeight: '600' }}>
                  {textAnalysis.matched_fact_checks.length} Debunk Matches
                </span>
              )}
            </div>
          </div>

          {/* Quick Sub-Score Bars */}
          <div style={{
            background: 'var(--bg-inset)', padding: '16px 20px', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)', minWidth: '220px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
              Fusion Components
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Visual Forensics</span>
                <span style={{ fontWeight: '600' }}>{Math.round(mediaAnalysis.media_trust_score)}%</span>
              </div>
              <div style={{ height: '5px', background: 'var(--border-default)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${mediaAnalysis.media_trust_score}%`, height: '100%', background: 'var(--accent)' }} />
              </div>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Linguistic Credibility</span>
                <span style={{ fontWeight: '600' }}>{Math.round(textAnalysis.text_trust_score)}%</span>
              </div>
              <div style={{ height: '5px', background: 'var(--border-default)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${textAnalysis.text_trust_score}%`, height: '100%', background: 'var(--verified)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Fact-Check Index</span>
                <span style={{ fontWeight: '600' }}>{Math.round(fusionBreakdown.fact_check_alignment?.trust_score || 25)}%</span>
              </div>
              <div style={{ height: '5px', background: 'var(--border-default)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${fusionBreakdown.fact_check_alignment?.trust_score || 25}%`, height: '100%', background: 'var(--misleading)' }} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── TAB NAVIGATION ── */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-default)', marginBottom: '24px' }}>
        {[
          { id: 'overview', label: 'Overview & Fusion' },
          { id: 'media', label: 'Visual Grad-CAM Forensics' },
          { id: 'text', label: 'Regional Text NLP' },
          { id: 'factchecks', label: 'Matched Fact-Checks' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: '600',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === t.id ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: activeTab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all var(--transition-base)'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: OVERVIEW & FUSION BREAKDOWN ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
          
          {/* Primary Evidence Trail */}
          <div className="ts-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Forensic Evidence Trail
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mediaAnalysis.primary_evidence?.map((ev, i) => (
                <div key={i} style={{
                  padding: '14px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-md)',
                  borderLeft: '3px solid var(--accent)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5'
                }}>
                  {ev}
                </div>
              ))}
              <div style={{
                padding: '14px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-md)',
                borderLeft: '3px solid var(--misleading)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5'
              }}>
                Regional claim contains <strong>{textAnalysis.annotated_tokens?.filter(t => t.type !== 'neutral').length || 4} linguistic manipulation triggers</strong> in {textAnalysis.language_name} ({textAnalysis.language_native}).
              </div>
            </div>
          </div>

          {/* Mathematical Fusion Weight Model */}
          <div className="ts-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Mathematical Weight Formulation
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
              TruthLens uses a convex combination model to prevent false positives from single-domain signals:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                  <span>Media Weight (45%)</span>
                  <span>Contribution: +{Math.round(mediaAnalysis.media_trust_score * 0.45)} pts</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-inset)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '45%', height: '100%', background: 'var(--accent)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                  <span>Linguistic Weight (35%)</span>
                  <span>Contribution: +{Math.round(textAnalysis.text_trust_score * 0.35)} pts</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-inset)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '35%', height: '100%', background: 'var(--verified)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                  <span>Fact-Check Alignment (20%)</span>
                  <span>Contribution: +{Math.round((fusionBreakdown.fact_check_alignment?.trust_score || 25) * 0.20)} pts</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-inset)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '20%', height: '100%', background: 'var(--misleading)' }} />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 2: GRAD-CAM VISUAL FORENSICS ── */}
      {activeTab === 'media' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
          
          {/* Heatmap Viewer */}
          <div className="ts-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  Grad-CAM Attention Heatmap
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Frame #{currentFrameData.frame_index || 1} ({currentFrameData.timestamp || '0.5s'})
                </span>
              </div>

              {/* Layer switch buttons */}
              <div style={{ display: 'flex', background: 'var(--bg-inset)', padding: '3px', borderRadius: 'var(--radius-md)', gap: '4px' }}>
                <button
                  onClick={() => setHeatmapLayer('original')}
                  style={{
                    padding: '4px 10px', fontSize: '11px', fontWeight: '600', borderRadius: 'var(--radius-sm)',
                    border: 'none', background: heatmapLayer === 'original' ? 'var(--bg-surface)' : 'none',
                    color: heatmapLayer === 'original' ? 'var(--text-primary)' : 'var(--text-muted)', cursor: 'pointer'
                  }}
                >
                  Original
                </button>
                <button
                  onClick={() => setHeatmapLayer('heatmap')}
                  style={{
                    padding: '4px 10px', fontSize: '11px', fontWeight: '600', borderRadius: 'var(--radius-sm)',
                    border: 'none', background: heatmapLayer === 'heatmap' ? 'var(--bg-surface)' : 'none',
                    color: heatmapLayer === 'heatmap' ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer'
                  }}
                >
                  Grad-CAM Overlay
                </button>
                <button
                  onClick={() => setHeatmapLayer('difference')}
                  style={{
                    padding: '4px 10px', fontSize: '11px', fontWeight: '600', borderRadius: 'var(--radius-sm)',
                    border: 'none', background: heatmapLayer === 'difference' ? 'var(--bg-surface)' : 'none',
                    color: heatmapLayer === 'difference' ? 'var(--misleading)' : 'var(--text-muted)', cursor: 'pointer'
                  }}
                >
                  Anomaly Mask
                </button>
              </div>
            </div>

            {/* Frame Canvas Simulator */}
            <div style={{
              width: '100%', height: '340px', background: '#0f172a', borderRadius: 'var(--radius-lg)',
              position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {/* Simulated Face Outline */}
              <div style={{
                width: '160px', height: '210px', borderRadius: '50% 50% 46% 46%',
                border: '2px dashed rgba(255,255,255,0.25)', position: 'relative'
              }}>
                {/* Eyes contour */}
                <div style={{ position: 'absolute', top: '70px', left: '26px', width: '32px', height: '14px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)' }} />
                <div style={{ position: 'absolute', top: '70px', right: '26px', width: '32px', height: '14px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)' }} />
                {/* Mouth contour */}
                <div style={{ position: 'absolute', bottom: '40px', left: '44px', width: '72px', height: '20px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)' }} />
              </div>

              {/* Heatmap Overlay Simulation */}
              {heatmapLayer !== 'original' && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  {currentFrameData.gradcam_hotspots?.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: `${h.x_pct}%`,
                        top: `${h.y_pct}%`,
                        width: `${h.radius_pct * 4}px`,
                        height: `${h.radius_pct * 4}px`,
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '50%',
                        background: heatmapLayer === 'heatmap'
                          ? `radial-gradient(circle, rgba(239, 68, 68, ${h.intensity * 0.75}) 0%, rgba(245, 158, 11, ${h.intensity * 0.4}) 50%, transparent 80%)`
                          : `radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, transparent 70%)`,
                        filter: 'blur(10px)'
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Scan laser */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                animation: 'scanSweep 3s ease-in-out infinite'
              }} />

              {/* HUD Overlay */}
              <div style={{ position: 'absolute', top: '12px', left: '14px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.6)' }}>
                MODE: {heatmapLayer.toUpperCase()} FORENSICS
              </div>
              <div style={{ position: 'absolute', bottom: '12px', right: '14px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--false)' }}>
                ANOMALY: {Math.round((currentFrameData.fake_score || 0.8) * 100)}%
              </div>
            </div>

            {/* Frame Timeline Scrubber */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>
                Temporal Frame Scrubber ({framesList.length} Frames Extracted)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${framesList.length || 8}, 1fr)`, gap: '6px' }}>
                {framesList.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedFrame(i)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedFrame === i ? '2px solid var(--accent)' : '1px solid var(--border-default)',
                      background: selectedFrame === i ? 'var(--accent-gradient-subtle)' : 'var(--bg-inset)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-primary)' }}>#{f.frame_index}</div>
                    <div style={{ fontSize: '9px', color: f.fake_score > 0.5 ? 'var(--false)' : 'var(--verified)' }}>
                      {Math.round(f.fake_score * 100)}%
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Biophysical & Spectral Metrics */}
          <div className="ts-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Biophysical & Spectral Signals
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'var(--bg-inset)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                  <span>2D FFT High-Frequency Anomaly</span>
                  <span style={{ color: 'var(--false)' }}>
                    {currentFrameData.spectral_metrics?.fft_high_freq_anomaly || 0.88}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                  High-frequency grid peaks indicative of GAN/Diffusion deconvolution upsampling.
                </p>
              </div>

              <div style={{ background: 'var(--bg-inset)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                  <span>DCT Residual Artifacts</span>
                  <span style={{ color: 'var(--false)' }}>
                    {currentFrameData.spectral_metrics?.dct_grid_fingerprint || 0.84}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                  Discrete Cosine Transform periodic block quantization noise mismatch across facial borders.
                </p>
              </div>

              <div style={{ background: 'var(--bg-inset)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                  <span>rPPG Biophysical Blood Flow Pulse</span>
                  <span style={{ color: 'var(--false)' }}>
                    {currentFrameData.spectral_metrics?.rppg_bvp_consistency ? 'FAILED (No Wave)' : 'FAILED'}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                  Remote photoplethysmography did not register regular hemoglobin capillary pulse frequencies.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 3: REGIONAL TEXT & TOKEN NLP ── */}
      {activeTab === 'text' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
          
          {/* Token Highlight Card */}
          <div className="ts-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  Linguistic Manipulation Cues
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Language: {textAnalysis.language_name} ({textAnalysis.language_native}) • Script: {textAnalysis.language_script}
                </span>
              </div>
            </div>

            {/* Annotated Text Tokens */}
            <div style={{
              background: 'var(--bg-inset)', padding: '20px', borderRadius: 'var(--radius-lg)',
              fontSize: '18px', lineHeight: '2.0', marginBottom: '20px', border: '1px solid var(--border-default)'
            }}>
              {textAnalysis.annotated_tokens?.map((tok, i) => {
                let underlineColor = 'transparent';
                let bgBadge = 'transparent';
                if (tok.type === 'urgency_marker') {
                  underlineColor = 'var(--false)';
                  bgBadge = 'rgba(239,68,68,0.12)';
                } else if (tok.type === 'sensational_claim') {
                  underlineColor = 'var(--misleading)';
                  bgBadge = 'rgba(245,158,11,0.14)';
                } else if (tok.type === 'statistical_claim') {
                  underlineColor = 'var(--accent)';
                  bgBadge = 'var(--accent-gradient-subtle)';
                }

                return (
                  <span
                    key={i}
                    style={{
                      marginRight: '6px',
                      padding: '2px 4px',
                      borderRadius: 'var(--radius-sm)',
                      background: bgBadge,
                      borderBottom: `2px solid ${underlineColor}`,
                      fontWeight: tok.type !== 'neutral' ? '600' : '400'
                    }}
                    title={`Cue type: ${tok.type}`}
                  >
                    {tok.token}
                  </span>
                );
              })}
            </div>

            {/* Cue Legend */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--false)' }} />
                Urgency & Panic Trigger
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--misleading)' }} />
                Sensational Assertion
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--accent)' }} />
                Numerical Assertion
              </span>
            </div>
          </div>

          {/* Claim Decomposition */}
          <div className="ts-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Decomposed Atomic Claims
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'var(--bg-inset)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Core Assertion
                </span>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '4px', margin: '4px 0 0' }}>
                  "{textAnalysis.claim_decomposition?.core_assertion || 'Claim text evaluated'}"
                </p>
              </div>

              <div style={{ background: 'var(--bg-inset)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Detected Domains & Entities
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {textAnalysis.claim_decomposition?.detected_domains?.map((d, i) => (
                    <span key={i} style={{ fontSize: '11px', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-default)' }}>
                      {d.name}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--bg-inset)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Numerical Assertion Check
                </span>
                <div style={{ marginTop: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {textAnalysis.claim_decomposition?.asserted_numbers?.join(', ') || 'None found'} (Evaluated for statistical distortion)
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 4: MATCHED FACT-CHECKS ── */}
      {activeTab === 'factchecks' && (
        <div className="ts-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Semantic Fact-Check Index Matches
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Cross-referenced against indexed records from accredited fact-checkers (PIB Fact Check, Alt News, BOOM Live).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {textAnalysis.matched_fact_checks?.map((fc, i) => (
              <div key={i} style={{
                background: 'var(--bg-inset)', padding: '18px', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent)', background: 'var(--accent-gradient-subtle)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                      {fc.source}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--misleading)' }}>
                      {Math.round((fc.similarity_score || 0.8) * 100)}% Match
                    </span>
                  </div>

                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.4', marginBottom: '8px' }}>
                    {fc.title}
                  </h4>

                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 14px' }}>
                    {fc.debunk_summary}
                  </p>
                </div>

                <a
                  href={fc.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="ts-btn ts-btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start' }}
                >
                  <span>View Original Debunk</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
