import React, { useRef, useEffect, useState } from 'react';

/**
 * ForensicFeatureMonitor
 * Renders real-world, authentic scientific & signal processing forensic animations:
 * - face_mesh: 68-point Dlib/Mediapipe facial landmark tracking with Grad-CAM seam overlay
 * - rppg_pulse: Medical oscilloscope photoplethysmography (BVP) pulse wave (74 BPM)
 * - fft_spectrum: 2D Fourier frequency domain power spectral density analyzer
 * - ela_comparator: Error Level Analysis JPEG quantization error residual comparator
 * - indic_nlp: Real-time lexical token attention scanner across Hindi/Punjabi/Tamil
 * - audio_spectrogram: Multi-channel audio frequency spectrogram with vocal jitter meter
 * - prnu_sensor: Photo-Response Non-Uniformity camera sensor pattern & EXIF hex inspector
 * - optical_flow: Temporal motion vectors and eye-blink kinematics tracker
 * - vector_radar: Vector cosine similarity radar linking PIB/AltNews debunks
 */
export default function ForensicFeatureMonitor({ type, height = 160 }) {
  const canvasRef = useRef(null);
  const [interactiveParam, setInteractiveParam] = useState(50);

  // ────────────────────────────────────────────────────────────────
  // 1. RPPG Cardiac Pulse Oscilloscope
  // ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (type !== 'rppg_pulse') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let animId;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Oscilloscope screen background
      ctx.fillStyle = '#080c10';
      ctx.fillRect(0, 0, w, h);

      // Oscilloscope grid lines
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw real Photoplethysmography (BVP) waveform:
      // Systolic peak followed by dicrotic notch and diastolic decay
      ctx.beginPath();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 8;

      const sweepHead = (frame * 2.5) % w;

      for (let x = 0; x < w; x++) {
        // Distance from current sweep beam
        const dist = (sweepHead - x + w) % w;
        if (dist > w * 0.85) continue; // Phosphor decay

        const t = (x + frame * 1.5) * 0.045;
        // Mathematical model of human cardiac blood volume pulse
        const pulseCycle = t % (Math.PI * 2);
        let waveY = 0;
        if (pulseCycle < 1.2) {
          // Sharp systolic ejection
          waveY = Math.sin(pulseCycle * 2.6) * 32;
        } else if (pulseCycle < 2.4) {
          // Dicrotic notch reflection
          waveY = Math.sin(pulseCycle * 2.2) * 14 - 4;
        } else {
          // Diastolic runoff
          waveY = Math.sin(pulseCycle * 0.8) * 6;
        }

        const y = h / 2 - waveY;
        if (x === 0 || dist > w * 0.84) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw active scanner beam
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#34d399';
      ctx.fillStyle = 'rgba(52, 211, 153, 0.85)';
      ctx.fillRect(sweepHead, 0, 2, h);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [type]);

  // ────────────────────────────────────────────────────────────────
  // 2. 2D Fourier (FFT) Frequency Spectrum Analyzer
  // ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (type !== 'fft_spectrum') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let animId;

    const render = () => {
      frame += 0.02;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Dark spectral background
      ctx.fillStyle = '#060912';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Concentric logarithmic frequency rings
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      for (let r = 15; r < w / 2; r += 22) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Orthogonal frequency axes
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
      ctx.moveTo(0, cy); ctx.lineTo(w, cy);
      ctx.stroke();

      // Natural 1/f falloff ambient field
      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 55);
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      coreGrad.addColorStop(0.3, 'rgba(0, 242, 254, 0.6)');
      coreGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 55, 0, Math.PI * 2);
      ctx.fill();

      // High-Frequency Checkerboard Generative Artifact Spikes (GAN / Diffusion fingerprint)
      const pulse = 1 + Math.sin(frame * 3) * 0.15;
      const spikeDist = 48 * pulse;
      const harmonics = [
        { x: cx + spikeDist, y: cy + spikeDist },
        { x: cx - spikeDist, y: cy + spikeDist },
        { x: cx + spikeDist, y: cy - spikeDist },
        { x: cx - spikeDist, y: cy - spikeDist },
      ];

      ctx.save();
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 10;
      harmonics.forEach(pt => {
        // Red anomaly spike
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Crosshair reticle
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 9, 0, Math.PI * 2);
        ctx.moveTo(pt.x - 12, pt.y); ctx.lineTo(pt.x + 12, pt.y);
        ctx.moveTo(pt.x, pt.y - 12); ctx.lineTo(pt.x, pt.y + 12);
        ctx.stroke();
      });
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [type]);

  // ────────────────────────────────────────────────────────────────
  // 3. Audio Spectrogram & Vocal Harmonic Analyzer
  // ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (type !== 'audio_spectrogram') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let animId;

    const barCount = 38;

    const render = () => {
      frame += 0.05;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#0a0d16';
      ctx.fillRect(0, 0, w, h);

      // Frequency grid marks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 0.5;
      for (let y = 15; y < h; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const barWidth = (w - (barCount - 1) * 3) / barCount;

      for (let i = 0; i < barCount; i++) {
        // Multi-frequency simulated voice spectrum
        const freqRatio = i / barCount;
        const baseAmp = Math.sin(frame * 2 + i * 0.4) * 0.4 + 
                        Math.cos(frame * 3.2 - i * 0.25) * 0.3 + 
                        Math.sin(frame * 1.1 + i * 0.7) * 0.3;
        
        // Human speech formants peak around F1 (low-mid) and F2 (mid)
        const formantWeight = Math.exp(-Math.pow(freqRatio - 0.28, 2) * 18) * 1.5 + 
                              Math.exp(-Math.pow(freqRatio - 0.58, 2) * 22) * 1.2;
        
        const barHeight = Math.max(6, (Math.abs(baseAmp) * 0.6 + 0.2) * (h - 24) * formantWeight);
        const x = i * (barWidth + 3);
        const y = h - barHeight - 8;

        // Gradient: Cyan for low frequencies, Violet for mid, Amber for synthetic anomalies
        const barGrad = ctx.createLinearGradient(0, y, 0, h);
        if (i > 26 && Math.sin(frame + i) > 0.4) {
          // Synthetic high-frequency pitch clipping
          barGrad.addColorStop(0, '#ef4444');
          barGrad.addColorStop(1, '#f59e0b');
        } else {
          barGrad.addColorStop(0, '#00f2fe');
          barGrad.addColorStop(0.6, '#3b82f6');
          barGrad.addColorStop(1, '#7c3aed');
        }

        ctx.fillStyle = barGrad;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Peak hold dot
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(x, y - 3, barWidth, 1.5);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [type]);

  // ────────────────────────────────────────────────────────────────
  // 4. Optical Flow & Motion Vector Kinematics
  // ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (type !== 'optical_flow') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let animId;

    const render = () => {
      frame += 0.03;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#080a12';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2 - 4;

      // Facial wireframe silhouette
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 42, 58, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Eyes
      const eyeL = { x: cx - 18, y: cy - 10 };
      const eyeR = { x: cx + 18, y: cy - 10 };
      ctx.beginPath();
      ctx.arc(eyeL.x, eyeL.y, 5, 0, Math.PI * 2);
      ctx.arc(eyeR.x, eyeR.y, 5, 0, Math.PI * 2);
      ctx.stroke();

      // Optical flow motion vector arrows over facial boundary
      const vectorCount = 18;
      ctx.strokeStyle = '#00f2fe';
      ctx.fillStyle = '#00f2fe';
      ctx.lineWidth = 1.4;

      for (let i = 0; i < vectorCount; i++) {
        const angle = (i / vectorCount) * Math.PI * 2;
        const px = cx + Math.cos(angle) * 44;
        const py = cy + Math.sin(angle) * 60;

        // Vector magnitude and direction (temporal jitter)
        const jitter = Math.sin(frame * 2 + i * 1.5) * 10;
        const vx = Math.cos(angle + 0.4) * jitter;
        const vy = Math.sin(angle + 0.4) * jitter;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + vx, py + vy);
        ctx.stroke();

        // Arrow head
        ctx.beginPath();
        ctx.arc(px + vx, py + vy, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [type]);

  // ────────────────────────────────────────────────────────────────
  // 5. Facial Mesh Landmark Tracker (Dlib/Mediapipe 68 pts)
  // ────────────────────────────────────────────────────────────────
  if (type === 'face_mesh') {
    return (
      <div style={{
        height: `${height}px`, background: '#090c14', borderRadius: '12px',
        position: 'relative', overflow: 'hidden', border: '1px solid rgba(56, 189, 248, 0.2)'
      }}>
        {/* Animated Scanner Laser Sweep */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, width: '2px',
          background: 'linear-gradient(180deg, transparent 0%, #00f2fe 50%, transparent 100%)',
          boxShadow: '0 0 12px #00f2fe',
          animation: 'scanBeam 2.8s ease-in-out infinite alternate',
          zIndex: 3,
        }} />

        {/* SVG 68-Point Landmark Wireframe */}
        <svg viewBox="0 0 240 160" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="meshGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Bounding Box */}
          <rect x="50" y="16" width="140" height="128" fill="none" stroke="rgba(0, 242, 254, 0.4)" strokeWidth="1" strokeDasharray="4 4" />
          <text x="54" y="28" fill="#00f2fe" fontSize="8" fontFamily="monospace">ROI [X:50 Y:16 W:140 H:128]</text>

          {/* Jawline contour */}
          <path d="M 64 60 Q 68 115 120 134 Q 172 115 176 60" fill="none" stroke="url(#meshGrad)" strokeWidth="1.5" />
          
          {/* Eyebrows */}
          <path d="M 78 48 Q 92 42 106 48" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
          <path d="M 134 48 Q 148 42 162 48" fill="none" stroke="#38bdf8" strokeWidth="1.2" />

          {/* Eyes with gaze landmarks */}
          <polygon points="80,56 92,52 104,56 92,60" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="1" />
          <circle cx="92" cy="56" r="2" fill="#ffffff" />
          
          <polygon points="136,56 148,52 160,56 148,60" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="1" />
          <circle cx="148" cy="56" r="2" fill="#ffffff" />

          {/* Nose bridge & nostrils */}
          <path d="M 120 48 L 120 82 M 110 84 Q 120 88 130 84" fill="none" stroke="#38bdf8" strokeWidth="1.2" />

          {/* Lips */}
          <polygon points="102,102 120,96 138,102 120,112" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" strokeWidth="1.2" />
          
          {/* Blending Seam Anomaly Thermal Ring (Deepfake seam detected) */}
          <ellipse cx="120" cy="120" rx="24" ry="14" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="148" y="124" fill="#ef4444" fontSize="7.5" fontFamily="monospace">SEAM: 0.88</text>
        </svg>

        {/* Telemetry Tag */}
        <div style={{
          position: 'absolute', bottom: '6px', left: '10px', right: '10px',
          display: 'flex', justifyContent: 'space-between', fontSize: '10px',
          fontFamily: 'monospace', color: 'rgba(255,255,255,0.7)',
          background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px'
        }}>
          <span>68 LANDMARKS ACTIVE</span>
          <span style={{ color: '#ef4444' }}>BOUNDARY ARTIFACT: DETECTED</span>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────
  // 6. Multilingual Regional NLP Lexical Token Attention Scanner
  // ────────────────────────────────────────────────────────────────
  if (type === 'indic_nlp') {
    return (
      <div style={{
        height: `${height}px`, background: '#090d16', borderRadius: '12px',
        padding: '12px 14px', position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex',
        flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {/* Real Hindi Sentence Tokenized with Attention Weights */}
        <div>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#10b981', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <span>NATIVE SCRIPT PARSER • INDICBERT</span>
            <span>FEAR CUE: 0.89</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            <span style={{ background: 'rgba(239, 68, 68, 0.25)', border: '1px solid #ef4444', color: '#fca5a5', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}>
              बड़ी खबर! [α=0.94]
            </span>
            <span style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#fde68a', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
              सनसनीखेज खुलासा [α=0.88]
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.06)', color: 'rgba(255,255,255,0.75)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
              देश भर के बैंक
            </span>
            <span style={{ background: 'rgba(239, 68, 68, 0.25)', border: '1px solid #ef4444', color: '#fca5a5', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}>
              बंद होने वाले हैं [α=0.91]
            </span>
            <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fde68a', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
              तुरंत पैसे निकालें
            </span>
          </div>
        </div>

        {/* Gurmukhi & Tamil Secondary Cross-Lingual Pipeline Cues */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px',
          display: 'flex', justifyContent: 'space-between', fontSize: '10px',
          color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace'
        }}>
          <span>PA: ਜ਼ਰੂਰੀ ਖ਼ਬਰ (Urgency: High)</span>
          <span style={{ color: '#38bdf8' }}>TA: முக்கிய செய்தி (Panic: Alert)</span>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────
  // 7. Error Level Analysis (ELA) Compression Residual Inspector
  // ────────────────────────────────────────────────────────────────
  if (type === 'ela_comparator') {
    return (
      <div style={{
        height: `${height}px`, background: '#090b14', borderRadius: '12px',
        position: 'relative', overflow: 'hidden', border: '1px solid rgba(245, 158, 11, 0.25)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%' }}>
          {/* Left: Raw JPEG Block Structure */}
          <div style={{
            background: 'linear-gradient(135deg, #182032 0%, #0e121d 100%)',
            padding: '10px', borderRight: '1px solid rgba(255,255,255,0.1)',
            position: 'relative'
          }}>
            <div style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8' }}>RAW PIXEL MATRIX</div>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: '#38bdf8', opacity: 0.3, margin: '20px auto 0',
              boxShadow: '0 0 15px #38bdf8'
            }} />
            <div style={{ position: 'absolute', bottom: '6px', left: '10px', fontSize: '9px', color: '#64748b', fontFamily: 'monospace' }}>
              DCT Quality: 75%
            </div>
          </div>

          {/* Right: ELA Quantization Noise Highlighting Altered Region */}
          <div style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.3) 0%, #080a12 70%)',
            padding: '10px', position: 'relative'
          }}>
            <div style={{ fontSize: '9px', fontFamily: 'monospace', color: '#f87171' }}>ELA NOISE RESIDUAL</div>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              border: '2px dashed #ef4444', margin: '20px auto 0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '8px', color: '#ef4444', fontFamily: 'monospace',
              animation: 'pulseGlow 2s infinite'
            }}>
              FORGED
            </div>
            <div style={{ position: 'absolute', bottom: '6px', right: '10px', fontSize: '9px', color: '#ef4444', fontFamily: 'monospace' }}>
              Error Δ: 34.2 (High)
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────
  // 8. PRNU Camera Hardware Sensor Fingerprint & EXIF Hex
  // ────────────────────────────────────────────────────────────────
  if (type === 'prnu_sensor') {
    return (
      <div style={{
        height: `${height}px`, background: '#090b14', borderRadius: '12px',
        padding: '12px', position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(56, 189, 248, 0.2)', fontFamily: 'monospace',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#38bdf8', marginBottom: '6px' }}>
            <span>SENSOR PRNU • BAYER CFA MATRIX</span>
            <span>MATCH: 97.4%</span>
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4' }}>
            <div>SENSOR: Sony IMX766 50MP (Bayer RGGB)</div>
            <div style={{ color: '#94a3b8', fontSize: '10px' }}>QUANT TABLE: Canon 5D Mark IV Preset #3</div>
          </div>
        </div>

        {/* Real Hex Byte Stream Sample */}
        <div style={{
          background: 'rgba(0,0,0,0.5)', padding: '6px 8px', borderRadius: '6px',
          fontSize: '9.5px', color: '#34d399', letterSpacing: '0.5px'
        }}>
          FF D8 FF E1 00 18 45 78 69 66 00 00 49 49 2A 00 ... [EXIF SIGNATURE VALID]
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────
  // 9. Vector Provenance Radar (PIB / Alt News / BOOM Grounding)
  // ────────────────────────────────────────────────────────────────
  if (type === 'vector_radar') {
    return (
      <div style={{
        height: `${height}px`, background: '#080a14', borderRadius: '12px',
        position: 'relative', overflow: 'hidden', border: '1px solid rgba(139, 92, 246, 0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {/* Radar concentric circles and rotating sweep */}
        <svg viewBox="0 0 200 160" style={{ width: '100%', height: '100%' }}>
          <circle cx="100" cy="80" r="60" fill="none" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1" />
          <circle cx="100" cy="80" r="40" fill="none" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="1" />
          <circle cx="100" cy="80" r="20" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
          
          <line x1="100" y1="20" x2="100" y2="140" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1" />
          <line x1="40" y1="80" x2="160" y2="80" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1" />

          {/* Target Blips */}
          {/* PIB Debunk */}
          <circle cx="74" cy="54" r="3.5" fill="#10b981" />
          <text x="50" y="46" fill="#34d399" fontSize="7.5" fontFamily="monospace">PIB (0.94)</text>

          {/* AltNews Match */}
          <circle cx="128" cy="62" r="3.5" fill="#38bdf8" />
          <text x="134" y="60" fill="#38bdf8" fontSize="7.5" fontFamily="monospace">AltNews (0.91)</text>

          {/* BOOM Live Match */}
          <circle cx="115" cy="112" r="3" fill="#c084fc" />
          <text x="110" y="126" fill="#c084fc" fontSize="7.5" fontFamily="monospace">BOOM (0.87)</text>
        </svg>

        {/* Sweep Needle */}
        <div style={{
          position: 'absolute', width: '120px', height: '120px', borderRadius: '50%',
          borderTop: '2px solid rgba(192, 132, 252, 0.8)',
          animation: 'ringSlowRotate 4s linear infinite',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute', bottom: '6px', left: '10px', fontSize: '9.5px',
          color: '#c084fc', fontFamily: 'monospace'
        }}>
          COSINE VECTOR GROUNDING: 3 CITATIONS FOUND
        </div>
      </div>
    );
  }

  // Default Canvas-based renders (rPPG, FFT, Audio, Optical Flow)
  return (
    <div style={{
      height: `${height}px`, borderRadius: '12px',
      position: 'relative', overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <canvas
        ref={canvasRef}
        width={360}
        height={height}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
