import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, ArrowRight, Play, FileText, Video, Globe, 
  Layers, Image, Mic, Sparkles, ScanLine, Activity,
  Cpu, CheckCircle2, Languages, Clock, BarChart3, Radio,
  Lock, RefreshCw, AlertCircle, Sliders, Terminal, Eye
} from 'lucide-react';
import HolographicSphere from './HolographicSphere';
import CyberRingsBackground from './CyberRingsBackground';
import ForensicFeatureMonitor from './ForensicFeatureMonitor';

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

// Expanded 9 Real-World Forensic Features
const FEATURES = [
  {
    icon: Video,
    monitorType: 'face_mesh',
    title: 'Neural Deepfake & Boundary Seam Tracker',
    badge: '68-Point Mesh',
    metric: '99.1% Seam Sensitivity',
    description: 'Calculates spatial-temporal warping vectors and detects micro-boundary blending seams across facial perimeters using Grad-CAM attention.',
    gradient: 'linear-gradient(135deg, #00f2fe 0%, #3b82f6 100%)',
  },
  {
    icon: Activity,
    monitorType: 'rppg_pulse',
    title: 'Biological Pulse (rPPG) Vital Monitor',
    badge: 'Biophysical Liveness',
    metric: '74 BPM • Cardiac Validated',
    description: 'Extracts sub-visual cardiovascular blood volume pulses (BVP) from skin reflectance to distinguish living humans from synthesized video frames.',
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  },
  {
    icon: Layers,
    monitorType: 'fft_spectrum',
    title: '2D Fourier (FFT) Generative Checkerboard',
    badge: 'Spectral Noise',
    metric: 'High-Freq Anomaly: DETECTED',
    description: 'Computes 2D Fast Fourier Transform power spectral density to isolate grid artifacts left by generative neural upsampling layers.',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  },
  {
    icon: Globe,
    monitorType: 'indic_nlp',
    title: 'Multilingual Regional NLP & Panic Lexer',
    badge: '10 Native Scripts',
    metric: 'IndicBERT Attention: 0.94',
    description: 'Tokenizes native Devanagari, Gurmukhi, Tamil, and Bengali scripts to detect sensational panic cues, fear markers, and viral claim vectors.',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  {
    icon: Mic,
    monitorType: 'audio_spectrogram',
    title: 'Audio Spectrogram & Vocal Clone Detector',
    badge: 'Harmonic Forensics',
    metric: 'Zero-Crossing Rate: Abnormal',
    description: 'Analyzes vocal formant trajectories, pitch jitter variance, and synthetic acoustic phase discontinuity across 100 Hz – 12 kHz.',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  },
  {
    icon: Image,
    monitorType: 'ela_comparator',
    title: 'Error Level Analysis (ELA) Compression Forensics',
    badge: 'Quantization Matrix',
    metric: 'Error Residual: Δ 34.2',
    description: 'Re-compresses images at known quantization tables to reveal differing compression error levels between authentic pixels and injected forgeries.',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  },
  {
    icon: Cpu,
    monitorType: 'prnu_sensor',
    title: 'Camera PRNU Sensor & EXIF Hex Fingerprint',
    badge: 'Hardware Sensor',
    metric: 'Sony IMX766 Match: 97.4%',
    description: 'Detects camera sensor Photo-Response Non-Uniformity (PRNU) noise patterns and validates EXIF header hex integrity against CFA Bayer matrices.',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
  },
  {
    icon: ScanLine,
    monitorType: 'optical_flow',
    title: 'Temporal Optical Flow & Eye Kinematics',
    badge: 'Motion Vectors',
    metric: 'Blink Interval: Irregular',
    description: 'Tracks micro-motion vectors between consecutive video frames to reveal unnatural head rotation lag and synthetic eye-blinking deficits.',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  },
  {
    icon: ShieldCheck,
    monitorType: 'vector_radar',
    title: 'Vector Provenance & Fact Grounding Radar',
    badge: 'Cosine Retrieval',
    metric: '3 Verified Debunks Matched',
    description: 'Queries high-dimensional vector embeddings against official fact-check registries (PIB, Alt News, BOOM Live) for deterministic citations.',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
  },
];

const LAB_INSTRUMENTS = [
  { id: 'face_mesh', label: 'Facial Landmark Seam Mesh', type: 'face_mesh', spec: 'Dlib / Mediapipe 68 pts • Grad-CAM Thermal Overlays' },
  { id: 'rppg_pulse', label: 'Cardiovascular rPPG Oscilloscope', type: 'rppg_pulse', spec: 'Remote Photoplethysmography • 74 BPM BVP Waveform' },
  { id: 'fft_spectrum', label: '2D Fourier (FFT) Power Spectrum', type: 'fft_spectrum', spec: 'Spatial Frequency Domain • Checkerboard Artifacts' },
  { id: 'indic_nlp', label: 'Regional Indic Panic Lexer', type: 'indic_nlp', spec: 'IndicBERT Attention • Hindi / Punjabi / Tamil Cues' },
  { id: 'audio_spectrogram', label: 'Audio Frequency Spectrogram', type: 'audio_spectrogram', spec: '100 Hz – 12 kHz • Synthetic Vocal Jitter' },
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
        fontSize: '26px', fontWeight: '700', 
        letterSpacing: '-0.5px', lineHeight: '1',
        fontFamily: 'var(--font-display)'
      }}>
        <span className="ts-gradient-text">
          {prefix}{animatedValue}{suffix}
        </span>
      </div>
      <div style={{ 
        fontSize: '11px', color: 'var(--text-muted)', 
        marginTop: '6px', fontWeight: '500',
        fontFamily: 'var(--font-mono)'
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
  const [activeLabTab, setActiveLabTab] = useState(LAB_INSTRUMENTS[0].id);

  const activeMode = OPERATING_MODES[activeModeIdx];
  const activeLabInstrument = LAB_INSTRUMENTS.find(ins => ins.id === activeLabTab) || LAB_INSTRUMENTS[0];

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
         ══════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', marginTop: '24px', marginBottom: '64px' }}>
        
        {/* Background Concentric Cybernetic Rings */}
        <CyberRingsBackground mode={activeModeIdx} />

        {/* Outer Glowing Stage Card */}
        <div 
          className="ts-futuristic-card"
          style={{
            padding: '32px 36px',
            minHeight: '460px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Subtle Cyber Grid Texture */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            opacity: 0.35,
            pointerEvents: 'none',
          }} />

          {/* Top Stage Bar */}
          <div style={{
            position: 'absolute', top: '18px', left: '32px', right: '32px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.45)',
            letterSpacing: '1px', textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: isScanning ? '#00f2fe' : '#10b981',
                boxShadow: isScanning ? '0 0 8px #00f2fe' : '0 0 6px #10b981',
                animation: 'pulseGlow 2s infinite',
              }} />
              <span style={{ color: '#ffffff', fontWeight: '700' }}>TRUTHLENS // v2.5.0</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.25)' }}>/</span>
              <span>AUTONOMOUS FORENSIC INTELLIGENCE</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="ts-hide-mobile" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                CORE: <strong style={{ color: '#00f0ff' }}>Apple Silicon MPS GPU</strong>
              </span>
              <span style={{ color: isScanning ? '#00f2fe' : 'rgba(255, 255, 255, 0.5)' }}>
                {scanStatus}
              </span>
            </div>
          </div>

          {/* Main Hero Grid: Balanced 360px Sphere Left, Ultra-Minimalist Typography Right */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
            gap: '28px',
            width: '100%',
            marginTop: '20px',
            position: 'relative',
          }}>
            
            {/* ── LEFT: 3D Holographic Neural Sphere with Clean Floating Badges ── */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '380px',
            }}>
              
              {/* Balanced 360px 3D Canvas Sphere */}
              <div style={{ filter: 'drop-shadow(0 0 35px rgba(0, 242, 254, 0.22))' }}>
                <HolographicSphere 
                  mode={activeModeIdx} 
                  isScanning={isScanning} 
                  size={360}
                  onSphereClick={handleSimulateScan}
                />
              </div>

              {/* Floating Holographic Badge 1: Biological Pulse (Top-Left) */}
              <div 
                className="ts-glass-pill"
                style={{
                  position: 'absolute',
                  top: '24px',
                  left: '8px',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animation: 'floatSlow 6s ease-in-out infinite',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
                onClick={() => setActiveModeIdx(1)}
              >
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', boxShadow: '0 0 8px rgba(168, 85, 247, 0.4)'
                }}>
                  <Activity size={12} />
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: '600', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    rPPG Pulse Flow
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                    Liveness: 99.4%
                  </div>
                </div>
              </div>

              {/* Floating Holographic Badge 2: Indic NLP (Bottom-Left) */}
              <div 
                className="ts-glass-pill"
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '12px',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animation: 'floatReverse 7s ease-in-out infinite',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
                onClick={() => setActiveModeIdx(2)}
              >
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)'
                }}>
                  <Languages size={12} />
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: '600', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    Indic Script NLP
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                    10 Native Scripts
                  </div>
                </div>
              </div>

              {/* Floating Holographic Badge 3: Trust Matrix (Bottom-Right) */}
              <div 
                className="ts-glass-pill"
                style={{
                  position: 'absolute',
                  bottom: '40px',
                  right: '12px',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animation: 'floatSlow 5s ease-in-out infinite',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
                onClick={() => setActiveModeIdx(0)}
              >
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00f2fe 0%, #3b82f6 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', boxShadow: '0 0 8px rgba(0, 242, 254, 0.4)'
                }}>
                  <ShieldCheck size={13} />
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: '600', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    Fused Trust Index
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#00f0ff', fontFamily: 'var(--font-mono)' }}>
                    Convex Synthesis
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Ultra-Minimalist Statement & Delicate Micro-Copy ── */}
            <div style={{ padding: '0 10px', zIndex: 2 }}>
              
              {/* Category Micro-Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '9999px',
                background: 'rgba(0, 240, 255, 0.08)',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                fontSize: '10px',
                fontWeight: '600',
                color: '#00f0ff',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                marginBottom: '14px',
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00f0ff', display: 'inline-block', boxShadow: '0 0 6px #00f0ff' }} />
                <span>MODE {activeMode.number} // {activeMode.badge}</span>
              </div>

              {/* Single-Line Minimalist Statement */}
              <h1 style={{
                fontSize: '28px',
                fontWeight: '600',
                lineHeight: '1.3',
                letterSpacing: '-0.5px',
                color: '#ffffff',
                marginBottom: '14px',
                fontFamily: 'var(--font-display)',
              }}>
                Reinventing{' '}
                <span style={{
                  background: 'linear-gradient(90deg, #00f0ff 0%, #38bdf8 50%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  truth
                </span>{' '}
                in the synthetic era.
              </h1>

              {/* Delicate Micro-Copy */}
              <p style={{
                fontSize: '13.5px',
                color: 'rgba(255, 255, 255, 0.65)',
                lineHeight: '1.7',
                marginBottom: '20px',
                maxWidth: '440px',
                fontFamily: 'var(--font-sans)',
              }}>
                An autonomous forensic intelligence engine uniting neural vision, 
                frequency spectra, and regional Indic language processing to verify media in milliseconds.
              </p>

              {/* Compact Data-Dense Telemetry Row */}
              <div style={{
                display: 'flex',
                gap: '16px',
                fontSize: '10.5px',
                fontFamily: 'var(--font-mono)',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '24px',
                flexWrap: 'wrap',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <span>ACCURACY: <strong style={{ color: '#ffffff' }}>{activeMode.stats.accuracy}</strong></span>
                <span>LATENCY: <strong style={{ color: '#00f0ff' }}>{activeMode.stats.latency}</strong></span>
                <span>MODEL: <strong style={{ color: '#c084fc' }}>{activeMode.stats.target}</strong></span>
              </div>

              {/* Compact Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '24px' }}>
                <button 
                  className="ts-cyber-btn"
                  onClick={onStartVerification}
                  style={{
                    padding: '10px 22px',
                    fontSize: '13px',
                    fontWeight: '600',
                    fontFamily: 'var(--font-display)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Launch Workspace</span>
                  <ArrowRight size={15} />
                </button>

                <button 
                  className="ts-cyber-btn-outline"
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  style={{
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontFamily: 'var(--font-display)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: isScanning ? 0.6 : 1,
                  }}
                >
                  <ScanLine size={15} style={{ color: '#00f0ff' }} />
                  <span>{isScanning ? 'Scanning Orbit...' : 'Simulate Scan'}</span>
                </button>
              </div>

              {/* Clean Operating Mode Dots (Matching Arthean Reference Layout) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '16px',
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

                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-mono)', display: 'flex', gap: '6px' }}>
                  <strong style={{ color: '#00f0ff' }}>{activeMode.number}</strong>
                  <span>// {activeMode.title}</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          INTERACTIVE FORENSIC LAB (Hands-on Real-World Workbench)
         ══════════════════════════════════════════════════════════════ */}
      <section style={{ marginBottom: '72px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '10.5px', fontWeight: '600', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)' }}>
            Interactive Diagnostic Workbench · Signal Processing Engine
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '4px', letterSpacing: '-0.3px', fontFamily: 'var(--font-display)' }}>
            Live Forensic Laboratory
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', maxWidth: '560px', margin: '6px auto 0' }}>
            Inspect real-world signal models in real time: cardiovascular pulse waves, facial landmark tracking, 2D FFT power spectra, and regional Indic lexical attention.
          </p>
        </div>

        <div className="ts-card" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          {/* Lab Instrument Selector Tabs */}
          <div style={{
            display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px',
            borderBottom: '1px solid var(--border-default)', marginBottom: '20px'
          }}>
            {LAB_INSTRUMENTS.map(ins => {
              const isActive = activeLabTab === ins.id;
              return (
                <button
                  key={ins.id}
                  onClick={() => setActiveLabTab(ins.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    background: isActive ? 'var(--accent-gradient)' : 'var(--bg-inset)',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {ins.label}
                </button>
              );
            })}
          </div>

          {/* Active Lab Instrument Display */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'center' }}>
            <div>
              <ForensicFeatureMonitor type={activeLabInstrument.type} height={220} />
            </div>

            <div style={{ background: 'var(--bg-inset)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                Operational Specification
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {activeLabInstrument.label}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                {activeLabInstrument.spec}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Sensor Sampling:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>60 Hz Real-Time</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Hardware Acceleration:</span>
                  <strong style={{ color: 'var(--accent)' }}>PyTorch MPS GPU</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Inference Mode:</span>
                  <strong style={{ color: 'var(--verified)' }}>Deterministic Forensics</strong>
                </div>
              </div>

              <div style={{ marginTop: '18px' }}>
                <button
                  className="ts-btn ts-btn-primary ts-btn-sm"
                  onClick={onStartVerification}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>Test on Your Media in Workspace</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          COMPREHENSIVE 9-FEATURE FORENSIC MATRIX
          Every card embeds an authentic real-world signal monitor
         ══════════════════════════════════════════════════════════════ */}
      <section style={{ marginBottom: '80px' }}>
        <div className="anim-fade-in-up" style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '10.5px', fontWeight: '600', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)' }}>
            Comprehensive Multi-Modal Diagnostic Suite
          </span>
          <h2 style={{ 
            fontSize: '24px', fontWeight: '600', 
            letterSpacing: '-0.4px', color: 'var(--text-primary)',
            marginTop: '4px', marginBottom: '8px',
            fontFamily: 'var(--font-display)'
          }}>
            Forensic Intelligence{' '}
            <span className="ts-gradient-text">Matrix</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto' }}>
            Real-world mathematical and signal-processing instruments engineered for newsroom investigations and cyber forensic units.
          </p>
        </div>

        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
          gap: '20px',
        }}>
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i} 
                className={`ts-card ts-card-interactive anim-fade-in-up stagger-${(i % 4) + 1}`}
                style={{ padding: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{
                    width: '40px', height: '40px',
                    borderRadius: 'var(--radius-lg)',
                    background: feat.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  }}>
                    <Icon size={20} />
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
                    letterSpacing: '0.6px', padding: '4px 10px', borderRadius: '9999px',
                    background: 'var(--bg-inset)', color: 'var(--accent)',
                    border: '1px solid var(--border-default)'
                  }}>
                    {feat.badge}
                  </span>
                </div>

                {/* Title & Metric */}
                <h3 style={{ 
                  fontSize: '14.5px', fontWeight: '600', 
                  color: 'var(--text-primary)', marginBottom: '4px',
                  fontFamily: 'var(--font-display)', letterSpacing: '-0.2px'
                }}>
                  {feat.title}
                </h3>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '14px' }}>
                  {feat.metric}
                </div>

                {/* Real-World Embedded Live Monitor */}
                <div style={{ marginBottom: '16px' }}>
                  <ForensicFeatureMonitor type={feat.monitorType} height={140} />
                </div>

                {/* Description */}
                <p style={{ 
                  fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: 'auto' 
                }}>
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          LIVE FORENSIC CASE PREVIEW
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
              Suspicious Claim · Regional Social Media Post
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
