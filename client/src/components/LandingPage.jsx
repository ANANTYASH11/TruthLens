import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, ArrowRight, Play, FileText, Video, Globe, 
  Layers, Image, Mic, Sparkles, ScanLine, Activity,
  Cpu, CheckCircle2, Languages, Clock, BarChart3, Radio,
  Lock, RefreshCw, AlertCircle
} from 'lucide-react';
import HolographicSphere from './HolographicSphere';
import CyberRingsBackground from './CyberRingsBackground';

// Operating modes corresponding to the reference design's pagination dots
const OPERATING_MODES = [
  {
    id: 'visual',
    number: '01',
    title: 'Visual Forensics',
    badge: 'Neural Vision & 2D-FFT',
    subtitle: 'Spatial-temporal anomaly detection & Grad-CAM heatmap visualization',
    stats: { accuracy: '96.2%', latency: '14ms', target: 'EfficientNet / Xception' }
  },
  {
    id: 'biometric',
    number: '02',
    title: 'Biometric Pulse',
    badge: 'rPPG Remote Perfusion',
    subtitle: 'Extracts sub-visual blood volume pulses to detect synthetic facial recreation',
    stats: { accuracy: '94.8%', latency: '22ms', target: 'Chrominance BVP Filter' }
  },
  {
    id: 'indic',
    number: '03',
    title: 'Indic Intelligence',
    badge: '10 Regional Scripts',
    subtitle: 'Direct native script NLP across Hindi, Punjabi, Tamil, Bengali & Telugu',
    stats: { accuracy: '92.6%', latency: '38ms', target: 'IndicBERT Multi-Script' }
  },
  {
    id: 'deepfake',
    number: '04',
    title: 'Integrity Ledger',
    badge: 'PIB & AltNews Grounding',
    subtitle: 'Deterministic citation trails against indexed official fact-checks & vector debunks',
    stats: { accuracy: '98.5%', latency: '8ms', target: 'Vector Similarity Index' }
  }
];

const FEATURES = [
  {
    icon: Video,
    title: 'Neural Deepfake Detection',
    badge: 'Vision AI',
    description: 'Spatial-temporal analysis for facial boundary blending seams, lip-sync lag, and 2D FFT high-frequency checkerboard grid artifacts.',
    gradient: 'linear-gradient(135deg, #00f2fe 0%, #3b82f6 100%)',
  },
  {
    icon: Globe,
    title: 'Multilingual Regional NLP',
    badge: '10 Native Scripts',
    description: 'Native script verification for Devanagari, Gurmukhi, Tamil, Telugu, and Bengali without translational loss.',
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  },
  {
    icon: Activity,
    title: 'Biological Pulse (rPPG)',
    badge: 'Liveness Forensics',
    description: 'Remote photoplethysmography measures subtle cardiovascular blood volume pulse (BVP) cycles imperceptible to the naked eye.',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  },
  {
    icon: Image,
    title: 'Image Error Level Analysis',
    badge: 'Spectral Noise',
    description: 'Color-space quantization inspection, JPEG compression history, and clone-stamp artifact localization.',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  },
  {
    icon: FileText,
    title: 'Fact-Check Grounding',
    badge: 'Vector Search',
    description: 'Instant cosine-similarity retrieval against verified archives from PIB Fact Check, Alt News, and BOOM Live.',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  },
  {
    icon: ShieldCheck,
    title: 'Unified Trust Score',
    badge: 'Convex Fusion',
    description: 'Cross-modality penalty formula reconciling discrepancies between visual footage and accompanying textual headlines.',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  },
];

const STATS = [
  { value: '15+', label: 'Languages Supported', icon: Languages },
  { value: '8', label: 'Pipeline Stages', icon: Layers },
  { value: '<15s', label: 'Inference Latency', icon: Clock },
  { value: '94%', label: 'Forensic Accuracy', icon: BarChart3 },
];

const TRUSTED_BY = [
  'Newsrooms', 'Editorial Desks', 'Fact-Checking Units', 'Cyber Cells', 'Research Labs', 'Academic Universities'
];

/* ── Animated count-up hook ── */
function useCountUp(target, duration = 1500) {
  const [value, setValue] = React.useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const num = parseInt(target, 10);
          if (isNaN(num)) { setValue(target); return; }
          const startTime = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * num));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return [ref, typeof target === 'string' && isNaN(parseInt(target, 10)) ? target : value];
}

function StatCard({ stat, index }) {
  const Icon = stat.icon;
  const [ref, animatedValue] = useCountUp(stat.value.replace(/[^0-9]/g, ''), 1200);
  const prefix = stat.value.startsWith('<') ? '<' : '';
  const suffix = stat.value.endsWith('+') ? '+' : stat.value.endsWith('%') ? '%' : '';

  return (
    <div
      ref={ref}
      className={`ts-card ts-card-interactive anim-fade-in-up stagger-${index + 1}`}
      style={{ padding: '28px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: 'var(--accent-gradient)',
      }} />
      <div style={{
        width: '40px', height: '40px', borderRadius: 'var(--radius-lg)',
        background: 'var(--accent-gradient-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 14px',
      }}>
        <Icon size={20} style={{ color: 'var(--accent)' }} />
      </div>
      <div style={{ 
        fontSize: '32px', fontWeight: '800', 
        letterSpacing: '-1px', lineHeight: '1',
      }}>
        <span className="ts-gradient-text">
          {prefix}{animatedValue}{suffix}
        </span>
      </div>
      <div style={{ 
        fontSize: '12px', color: 'var(--text-muted)', 
        marginTop: '6px', fontWeight: '500',
      }}>
        {stat.label}
      </div>
    </div>
  );
}

export default function LandingPage({ onStartVerification }) {
  const [activeModeIdx, setActiveModeIdx] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('Standby • Ready for Analysis');

  const activeMode = OPERATING_MODES[activeModeIdx];

  // Trigger simulated live scan animation
  const handleSimulateScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanStatus('Scanning Multimodal Waveforms...');
    setTimeout(() => setScanStatus('Extracting Spatial FFT Frequencies...'), 1100);
    setTimeout(() => setScanStatus('Measuring Facial rPPG Biophysical Flow...'), 2200);
    setTimeout(() => {
      setIsScanning(false);
      setScanStatus('Verification Complete • 94.8% Authenticity Score');
    }, 3500);
  };

  // Auto-cycle through modes every 8 seconds if idle
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isScanning) {
        setActiveModeIdx(prev => (prev + 1) % OPERATING_MODES.length);
      }
    }, 7000);
    return () => clearInterval(timer);
  }, [isScanning]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px' }}>
      
      {/* ══════════════════════════════════════════════════════════════
          HERO SHOWCASE SECTION (Arthean / PYTIA Design Aesthetics)
          Features: Concentric geometric arcs, 3D holographic neural sphere,
          interactive mode switcher dots, floating data nodes, & cyber HUD
         ══════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', marginTop: '24px', marginBottom: '64px' }}>
        
        {/* Background Concentric Cybernetic Rings */}
        <CyberRingsBackground mode={activeModeIdx} />

        {/* Outer Glowing Stage Card */}
        <div 
          className="ts-futuristic-card"
          style={{
            padding: '48px 40px',
            minHeight: '560px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Subtle Cyber Grid Texture */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            opacity: 0.4,
            pointerEvents: 'none',
          }} />

          {/* Top Stage Bar */}
          <div style={{
            position: 'absolute', top: '24px', left: '36px', right: '36px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '1px', textTransform: 'uppercase',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: isScanning ? '#00f2fe' : '#10b981',
                boxShadow: isScanning ? '0 0 10px #00f2fe' : '0 0 8px #10b981',
                animation: 'pulseGlow 2s infinite',
              }} />
              <span style={{ color: '#ffffff', fontWeight: '700' }}>TRUTHLENS A.I.</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
              <span>Autonomous Forensic Intelligence</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="ts-hide-mobile" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                CORE: <strong style={{ color: '#38bdf8' }}>Apple Silicon MPS GPU</strong>
              </span>
              <span style={{ color: isScanning ? '#00f2fe' : 'rgba(255, 255, 255, 0.6)' }}>
                {scanStatus}
              </span>
            </div>
          </div>

          {/* Main Hero Grid: 3D Hologram Left, Typography & Controls Right */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 1fr',
            alignItems: 'center',
            gap: '36px',
            width: '100%',
            marginTop: '28px',
            position: 'relative',
          }}>
            
            {/* ── LEFT: 3D Holographic Neural Sphere with Floating Forensic Badges ── */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '440px',
            }}>
              
              {/* Interactive 3D Canvas Sphere */}
              <div style={{ filter: 'drop-shadow(0 0 45px rgba(0, 242, 254, 0.25))' }}>
                <HolographicSphere 
                  mode={activeModeIdx} 
                  isScanning={isScanning} 
                  size={460}
                  onSphereClick={handleSimulateScan}
                />
              </div>

              {/* Floating Holographic Badge 1: Biological Pulse (Top-Left) */}
              <div 
                className="ts-glass-pill"
                style={{
                  position: 'absolute',
                  top: '40px',
                  left: '10px',
                  padding: '8px 14px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  animation: 'floatSlow 6s ease-in-out infinite',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
                onClick={() => setActiveModeIdx(1)}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)'
                }}>
                  <Activity size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff', letterSpacing: '0.2px' }}>
                    rPPG Blood Pulse
                  </div>
                  <div style={{ fontSize: '10px', color: '#c084fc' }}>
                    Biological Liveness: 99.4%
                  </div>
                </div>
              </div>

              {/* Floating Holographic Badge 2: Indic NLP (Bottom-Left) */}
              <div 
                className="ts-glass-pill"
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  left: '20px',
                  padding: '8px 14px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  animation: 'floatReverse 7s ease-in-out infinite',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
                onClick={() => setActiveModeIdx(2)}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
                }}>
                  <Languages size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff', letterSpacing: '0.2px' }}>
                    Indic Script NLP
                  </div>
                  <div style={{ fontSize: '10px', color: '#34d399' }}>
                    10 Native Alphabets
                  </div>
                </div>
              </div>

              {/* Floating Holographic Badge 3: Trust Matrix (Bottom-Right) */}
              <div 
                className="ts-glass-pill"
                style={{
                  position: 'absolute',
                  bottom: '70px',
                  right: '15px',
                  padding: '8px 14px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  animation: 'floatSlow 5s ease-in-out infinite',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
                onClick={() => setActiveModeIdx(0)}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00f2fe 0%, #3b82f6 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', boxShadow: '0 0 10px rgba(0, 242, 254, 0.4)'
                }}>
                  <ShieldCheck size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff', letterSpacing: '0.2px' }}>
                    Fused Trust Index
                  </div>
                  <div style={{ fontSize: '10px', color: '#38bdf8' }}>
                    Dual-Pipeline Verified
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Futuristic Typography, Telemetry & Interactive Switcher ── */}
            <div style={{ padding: '10px 0 10px 20px', zIndex: 2 }}>
              
              {/* Active Mode Category Tag */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 14px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontSize: '11px',
                fontWeight: '700',
                color: '#38bdf8',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '18px',
              }}>
                <Sparkles size={12} />
                <span>{activeMode.badge}</span>
              </div>

              {/* Main Headline */}
              <h1 style={{
                fontSize: '44px',
                fontWeight: '900',
                lineHeight: '1.1',
                letterSpacing: '-1.5px',
                color: '#ffffff',
                marginBottom: '18px',
              }}>
                Reinventing{' '}
                <span style={{
                  background: 'linear-gradient(90deg, #00f2fe 0%, #38bdf8 50%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Truth
                </span>
                <br />
                in the synthetic era.
              </h1>

              {/* Refined Narrative */}
              <p style={{
                fontSize: '15px',
                color: 'rgba(255, 255, 255, 0.72)',
                lineHeight: '1.65',
                marginBottom: '28px',
                maxWidth: '480px',
              }}>
                An autonomous forensic intelligence engine uniting neural spatial-temporal forensics, 
                2D Fourier spectra, and regional Indic language processing to verify media in milliseconds.
              </p>

              {/* Active Mode Telemetry Capsule */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '14px 18px',
                marginBottom: '28px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Accuracy
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', marginTop: '2px' }}>
                    {activeMode.stats.accuracy}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Latency
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#00f2fe', marginTop: '2px' }}>
                    {activeMode.stats.latency}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Core Architecture
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#c084fc', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {activeMode.stats.target}
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '32px' }}>
                <button 
                  className="ts-cyber-btn"
                  onClick={onStartVerification}
                  style={{
                    padding: '12px 28px',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Launch Workspace</span>
                  <ArrowRight size={16} />
                </button>

                <button 
                  className="ts-cyber-btn-outline"
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  style={{
                    padding: '12px 22px',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: isScanning ? 0.6 : 1,
                  }}
                >
                  <ScanLine size={16} style={{ color: '#00f2fe' }} />
                  <span>{isScanning ? 'Scanning Orbit...' : 'Simulate Scan'}</span>
                </button>
              </div>

              {/* Interactive Operating Mode Dots (01, 02, 03, 04) like Arthean showcase */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '18px',
              }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {OPERATING_MODES.map((modeItem, idx) => (
                    <button
                      key={modeItem.id}
                      className={`ts-mode-dot ${activeModeIdx === idx ? 'active' : ''}`}
                      onClick={() => setActiveModeIdx(idx)}
                      aria-label={`Switch to mode ${modeItem.number}: ${modeItem.title}`}
                    />
                  ))}
                </div>

                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', display: 'flex', gap: '8px' }}>
                  <strong style={{ color: '#ffffff' }}>{activeMode.number}</strong>
                  <span>{activeMode.title}</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          DUAL-PIPELINE ARCHITECTURE VISUALIZER
         ══════════════════════════════════════════════════════════════ */}
      <section className="anim-fade-in-up" style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Two Independent Forensic Pipelines · Unified Mathematical Synthesis
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
            Multimodal Intelligence Architecture
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'center',
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)',
          padding: '28px', boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden'
        }}>
          {/* Media Pipeline Box */}
          <div style={{
            background: 'var(--bg-inset)', padding: '22px', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: 'var(--radius-md)', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Video size={16} />
              </div>
              <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Media Forensics Pipeline</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div>• MTCNN Face Landmark Extraction & Jitter Stability</div>
              <div>• CNN / EfficientNet Deepfake Forgery Classifier</div>
              <div>• Grad-CAM Spatial Saliency Heatmap Overlays</div>
              <div>• 2D Fourier (FFT) Checkerboard Grid Artifact Analysis</div>
            </div>
          </div>

          {/* Fusion Center Node */}
          <div style={{ textAlign: 'center', padding: '0 10px' }}>
            <div style={{
              width: '68px', height: '68px', borderRadius: '50%', background: 'var(--accent-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              margin: '0 auto 8px', boxShadow: 'var(--glow-accent)'
            }}>
              <ShieldCheck size={34} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>Trust Score</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>0 — 100%</div>
          </div>

          {/* Text Pipeline Box */}
          <div style={{
            background: 'var(--bg-inset)', padding: '22px', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: 'var(--radius-md)', background: 'var(--success-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Globe size={16} />
              </div>
              <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Regional Text Pipeline</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div>• 10 Indic Native Scripts: Hindi, Punjabi, Tamil, Bengali</div>
              <div>• Sensational Lexical & Panic Cue Triggers</div>
              <div>• Named Entity Extraction & Claim Dissection</div>
              <div>• Vector Cosine Matching with PIB & Alt News</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          LIVE FORENSIC PREVIEW CARD
         ══════════════════════════════════════════════════════════════ */}
      <section className="ts-card anim-fade-in-up" style={{ 
        padding: '0', marginBottom: '80px',
        position: 'relative', overflow: 'hidden',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
      }}>
        <div style={{ height: '3px', background: 'var(--accent-gradient)' }} />
        <div className="ts-scan-line" />
        
        {/* Header */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', borderBottom: '1px solid var(--border-default)',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span className="ts-badge ts-badge-misleading">
              High Risk Misinformation
            </span>
            <span style={{ 
              fontSize: '12px', color: 'var(--text-muted)', 
              fontFamily: 'var(--font-mono)' 
            }}>
              Case #TL-2026-8942
            </span>
          </div>
          <div style={{ 
            display: 'flex', gap: '20px', fontSize: '12px', color: 'var(--text-muted)' 
          }}>
            <span><strong>Language:</strong> Hindi (हिन्दी)</span>
            <span><strong>Confidence:</strong> 87%</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div className="ts-pulse-dot" style={{ width: '6px', height: '6px' }} />
              <strong>Latency:</strong> 410ms
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', padding: '24px' }}>
          
          {/* Suspicious Claim */}
          <div style={{ 
            background: 'var(--bg-inset)', padding: '20px', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--border-default)',
          }}>
            <div style={{ 
              fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.4px',
              marginBottom: '12px',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <ScanLine size={12} />
              Suspicious Claim · Social Media Post
            </div>
            <p style={{ 
              fontSize: '15px', fontWeight: '600', 
              color: 'var(--text-primary)', lineHeight: '1.5',
              marginBottom: '12px',
            }}>
              "बड़ी खबर! सनसनीखेज खुलासा: देश भर के बैंक खाते बंद होने वाले हैं, तुरंत अपने पैसे निकालें!"
            </p>
            <div style={{
              fontSize: '13px', color: 'var(--text-secondary)',
              padding: '12px', background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid var(--accent)',
            }}>
              <strong>Translation:</strong> "Breaking News: Shocking revelation — 
              Bank accounts nationwide to close soon, withdraw your money immediately!"
            </div>
          </div>

          {/* Evidence Trail */}
          <div>
            <div style={{ 
              fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.4px',
              marginBottom: '12px',
            }}>
              Verification Citations
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { source: 'Reserve Bank Official Directive', status: 'Contradicts Claim', note: 'No account freezing directive issued by central authorities.' },
                { source: 'PIB Fact Check Registry', status: 'Previously Debunked', note: 'Circulated previously in regional channels with altered timestamps.' },
              ].map((ev, i) => (
                <div key={i} style={{
                  padding: '14px', 
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                }}>
                  <div style={{ 
                    display: 'flex', justifyContent: 'space-between', 
                    alignItems: 'center', marginBottom: '6px',
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {ev.source}
                    </span>
                    <span className="ts-badge ts-badge-verified" style={{ fontSize: '10px' }}>
                      {ev.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {ev.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATS COUNTER ROW
         ══════════════════════════════════════════════════════════════ */}
      <section style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px',
        marginBottom: '80px',
      }}>
        {STATS.map((stat, i) => (
          <StatCard key={i} stat={stat} index={i} />
        ))}
      </section>

      {/* ══════════════════════════════════════════════════════════════
          COMPREHENSIVE FORENSIC TOOLKIT
         ══════════════════════════════════════════════════════════════ */}
      <section style={{ marginBottom: '80px' }}>
        <div className="anim-fade-in-up" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '36px', fontWeight: '800', 
            letterSpacing: '-1px', color: 'var(--text-primary)',
            marginBottom: '12px',
          }}>
            Forensic Intelligence{' '}
            <span className="ts-gradient-text">Matrix</span>
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '550px', margin: '0 auto' }}>
            Multi-modal verification toolkit engineered for newsroom investigations and fact-checking institutions.
          </p>
        </div>

        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
          gap: '16px',
        }}>
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i} 
                className={`ts-card ts-card-interactive anim-fade-in-up stagger-${i + 1}`}
                style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                  <div style={{
                    width: '44px', height: '44px',
                    borderRadius: 'var(--radius-lg)',
                    background: feat.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  }}>
                    <Icon size={22} />
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
                    letterSpacing: '0.6px', padding: '4px 10px', borderRadius: '9999px',
                    background: 'var(--bg-inset)', color: 'var(--text-muted)',
                    border: '1px solid var(--border-default)'
                  }}>
                    {feat.badge}
                  </span>
                </div>
                <h3 style={{ 
                  fontSize: '16px', fontWeight: '700', 
                  color: 'var(--text-primary)', marginBottom: '8px',
                }}>
                  {feat.title}
                </h3>
                <p style={{ 
                  fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' 
                }}>
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          DESIGNED FOR INSTITUTIONS
         ══════════════════════════════════════════════════════════════ */}
      <section style={{ 
        textAlign: 'center', paddingBottom: '20px',
        borderTop: '1px solid var(--border-default)', paddingTop: '48px',
      }}>
        <p className="anim-fade-in-up" style={{ 
          fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '1px',
          marginBottom: '24px',
        }}>
          Architected for
        </p>
        <div className="anim-fade-in-up stagger-2" style={{ 
          display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap',
        }}>
          {TRUSTED_BY.map((org, i) => (
            <span key={i} style={{ 
              fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)',
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface)',
              transition: 'all var(--transition-base)',
              cursor: 'default',
            }}>
              {org}
            </span>
          ))}
        </div>
      </section>

    </div>
  );
}
