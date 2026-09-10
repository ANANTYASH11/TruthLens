import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, SkipForward, Volume2, Maximize, AlertTriangle, 
  CheckCircle2, Activity, Eye, Layers, BarChart3, ScanLine
} from 'lucide-react';

const SUSPICIOUS_MOMENTS = [
  { time: '00:14', label: 'Facial boundary anomaly', severity: 'HIGH', desc: 'Edge distortion detected around jaw and hairline boundary.' },
  { time: '00:27', label: 'Lip-sync mismatch', severity: 'MEDIUM', desc: 'Audio-visual desynchronization of 120ms in phoneme mapping.' },
  { time: '01:03', label: 'Frame inconsistency', severity: 'HIGH', desc: 'Temporal coherence break — 3 frames show interpolation artifacts.' },
  { time: '01:28', label: 'Lighting anomaly', severity: 'LOW', desc: 'Shadow direction inconsistency in background region.' },
];

const SCORE_BREAKDOWN = [
  { label: 'Face manipulation', score: 89, severity: 'HIGH' },
  { label: 'Lip synchronization', score: 67, severity: 'MEDIUM' },
  { label: 'Frame artifacts', score: 82, severity: 'HIGH' },
  { label: 'Audio inconsistencies', score: 34, severity: 'LOW' },
  { label: 'Metadata anomalies', score: 56, severity: 'MEDIUM' },
];

const SEVERITY_COLORS = {
  'HIGH': 'var(--false)',
  'MEDIUM': 'var(--misleading)',
  'LOW': 'var(--verified)',
};

const SEVERITY_GRADIENTS = {
  'HIGH': 'var(--danger-gradient)',
  'MEDIUM': 'var(--warning-gradient)',
  'LOW': 'var(--success-gradient)',
};

const SEVERITY_BADGE = {
  'HIGH': 'ts-badge-false',
  'MEDIUM': 'ts-badge-misleading',
  'LOW': 'ts-badge-verified',
};

const SEVERITY_GLOW = {
  'HIGH': 'var(--glow-danger)',
  'MEDIUM': 'var(--glow-warning)',
  'LOW': 'var(--glow-success)',
};

export default function DeepfakeAnalysis() {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedMoment, setSelectedMoment] = useState(null);
  const canvasRef = useRef(null);

  // Simulated rPPG waveform drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    let frame = 0;
    let animId;
    
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      
      // Dark background
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.fillStyle = isDark ? '#0a0c10' : '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 0.5;
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Normal waveform (blue gradient)
      ctx.beginPath();
      const gradient = ctx.createLinearGradient(0, 0, w, 0);
      gradient.addColorStop(0, '#2563eb');
      gradient.addColorStop(1, '#7c3aed');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(37, 99, 235, 0.4)';
      for (let x = 0; x < w; x++) {
        const normalY = Math.sin((x + frame) * 0.04) * 15 + 
                        Math.sin((x + frame) * 0.08) * 8 + 
                        Math.sin((x + frame) * 0.02) * 20;
        const y = h / 2 + normalY;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Anomaly waveform overlay (red)
      ctx.beginPath();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(239, 68, 68, 0.3)';
      for (let x = 0; x < w; x++) {
        const anomalyY = Math.sin((x + frame * 1.3) * 0.05) * 10 + 
                         Math.cos((x + frame) * 0.09) * 12;
        const y = h / 2 + anomalyY + 5;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
      
      frame++;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 48px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px', paddingTop: '32px', borderTop: '1px solid var(--border-default)' }}>
        <h2 className="ts-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ScanLine size={22} className="ts-gradient-text" style={{ color: 'var(--accent)' }} />
          Media Forensics
        </h2>
        <p className="ts-section-subtitle">
          Deepfake detection analysis results for uploaded video content.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', alignItems: 'start' }}>

        {/* ── LEFT: Video Player & Waveform ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Video Viewport */}
          <div className="ts-card ts-forensic-viewport" style={{ overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
            <div style={{
              aspectRatio: '16/9',
              background: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              {/* Scan line */}
              <div className="ts-scan-line" />

              <div style={{ 
                color: 'var(--text-muted)', fontSize: '14px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              }}>
                <Play size={32} style={{ color: '#fff', opacity: 0.7 }} />
                <span style={{ color: '#fff', opacity: 0.5 }}>Sample Video Placeholder</span>
              </div>

              {/* Facial ROI Overlay with pulse */}
              <div style={{
                position: 'absolute',
                top: '25%', left: '35%',
                width: '30%', height: '50%',
                border: '2px solid rgba(59, 130, 246, 0.7)',
                borderRadius: '4px',
                pointerEvents: 'none',
                animation: 'pulseRing 3s ease-in-out infinite',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.15), inset 0 0 20px rgba(59, 130, 246, 0.05)',
              }}>
                <div style={{
                  position: 'absolute', top: '-22px', left: '0',
                  fontSize: '10px', color: '#60a5fa', fontFamily: 'var(--font-mono)',
                  background: 'rgba(0,0,0,0.8)', padding: '3px 8px', borderRadius: '3px',
                  fontWeight: '600', letterSpacing: '0.5px',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#3b82f6', animation: 'pulseDot 1.5s ease-in-out infinite',
                  }} />
                  FACE ROI
                </div>
              </div>

              {/* Corner brackets */}
              <div style={{ position: 'absolute', top: '8px', left: '8px', width: '20px', height: '20px', borderTop: '2px solid rgba(59,130,246,0.5)', borderLeft: '2px solid rgba(59,130,246,0.5)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', borderTop: '2px solid rgba(59,130,246,0.5)', borderRight: '2px solid rgba(59,130,246,0.5)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '20px', height: '20px', borderBottom: '2px solid rgba(59,130,246,0.5)', borderLeft: '2px solid rgba(59,130,246,0.5)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '20px', height: '20px', borderBottom: '2px solid rgba(59,130,246,0.5)', borderRight: '2px solid rgba(59,130,246,0.5)', pointerEvents: 'none' }} />
            </div>

            {/* Controls */}
            <div style={{
              padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: '12px',
              borderTop: '1px solid var(--border-default)',
            }}>
              <button 
                className="ts-btn ts-btn-ghost ts-btn-sm"
                onClick={() => setPlaying(!playing)}
              >
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </button>
              
              {/* Timeline */}
              <div style={{ flex: 1, position: 'relative' }}>
                <div className="ts-meter" style={{ cursor: 'pointer' }}>
                  <div className="ts-meter-fill" style={{ width: '35%', background: 'var(--accent-gradient)' }} />
                </div>
                {/* Anomaly markers */}
                {[14, 27, 63, 88].map((pos, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    left: `${(pos / 120) * 100}%`,
                    top: '-2px',
                    width: '3px', height: '12px',
                    background: SEVERITY_COLORS[SUSPICIOUS_MOMENTS[i]?.severity || 'MEDIUM'],
                    borderRadius: '1px',
                    cursor: 'pointer',
                    boxShadow: `0 0 6px ${SEVERITY_COLORS[SUSPICIOUS_MOMENTS[i]?.severity || 'MEDIUM']}40`,
                  }} />
                ))}
              </div>

              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: '600' }}>
                00:42 / 02:00
              </span>
              <button className="ts-btn ts-btn-ghost ts-btn-sm"><Volume2 size={14} /></button>
              <button className="ts-btn ts-btn-ghost ts-btn-sm"><Maximize size={14} /></button>
            </div>
          </div>

          {/* rPPG Waveform */}
          <div className="ts-card" style={{ 
            padding: '16px', position: 'relative', overflow: 'hidden',
            borderRadius: 'var(--radius-xl)',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'var(--accent-gradient)',
            }} />
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={15} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  rPPG Blood Volume Pulse
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '12px', height: '3px', background: 'var(--accent-gradient)', display: 'inline-block', borderRadius: '2px' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Normal</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '12px', height: '3px', background: '#ef4444', display: 'inline-block', borderRadius: '2px', opacity: 0.7 }} />
                  <span style={{ color: 'var(--text-muted)' }}>Anomaly</span>
                </span>
              </div>
            </div>
            <canvas
              ref={canvasRef}
              width={600}
              height={100}
              style={{ width: '100%', height: '100px', borderRadius: 'var(--radius-md)' }}
            />
          </div>
        </div>

        {/* ── RIGHT: Scores & Moments ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Authenticity Assessment */}
          <div className="ts-card" style={{ 
            padding: '20px', position: 'relative', overflow: 'hidden',
            borderRadius: 'var(--radius-xl)',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
              background: 'var(--danger-gradient)',
            }} />
            <h3 style={{ 
              fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.4px',
              marginBottom: '16px',
            }}>
              Media Authenticity Assessment
            </h3>

            <div style={{ 
              textAlign: 'center', marginBottom: '20px',
              padding: '20px', 
              background: 'var(--false-bg)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--false-border)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Glow */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px', height: '120px', borderRadius: '50%',
                background: 'var(--false)', opacity: 0.06, filter: 'blur(30px)',
                pointerEvents: 'none',
              }} />
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', position: 'relative' }}>
                Risk Level
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--false-text)', position: 'relative' }}>
                High Risk of Manipulation
              </div>
              <div style={{ 
                fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-mono)', marginTop: '4px',
                position: 'relative',
              }}>
                <span style={{
                  background: 'var(--danger-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>89%</span>
              </div>
            </div>

            {/* Score Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SCORE_BREAKDOWN.map((item, i) => (
                <div key={i}>
                  <div style={{ 
                    display: 'flex', justifyContent: 'space-between', 
                    fontSize: '12px', marginBottom: '4px',
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span className={`ts-badge ${SEVERITY_BADGE[item.severity]}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                      {item.severity}
                    </span>
                  </div>
                  <div className="ts-meter" style={{ height: '6px' }}>
                    <div className="ts-meter-fill anim-progress" style={{ 
                      width: `${item.score}%`,
                      background: SEVERITY_GRADIENTS[item.severity],
                      animationDelay: `${i * 0.1}s`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suspicious Moments */}
          <div className="ts-card" style={{ 
            padding: '20px', borderRadius: 'var(--radius-xl)',
          }}>
            <h3 style={{ 
              fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.4px',
              marginBottom: '12px',
            }}>
              Suspicious Moments
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {SUSPICIOUS_MOMENTS.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMoment(m)}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: selectedMoment === m ? 'var(--accent-gradient-subtle)' : 'var(--bg-inset)',
                    border: selectedMoment === m ? '1px solid var(--accent-border)' : '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-lg)',
                    transition: 'all var(--transition-fast)',
                    boxShadow: selectedMoment === m ? 'var(--glow-accent)' : 'none',
                  }}
                >
                  <span style={{ 
                    fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: '600',
                    color: 'var(--accent)', flexShrink: 0,
                    background: 'var(--accent-light)', padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    {m.time}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
                      {m.label}
                    </div>
                    {selectedMoment === m && (
                      <div className="anim-fade-in" style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {m.desc}
                      </div>
                    )}
                  </div>
                  <span className={`ts-badge ${SEVERITY_BADGE[m.severity]}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                    {m.severity}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
