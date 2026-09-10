import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Loader2, FileSearch, Globe, 
  Shield, BarChart3, FileText, Database, Layers,
  Cpu, ScanLine
} from 'lucide-react';

const PIPELINE_STAGES = [
  { id: 'ingest', label: 'Ingest & Script Identification', desc: 'Detecting Unicode ranges and normalizing frame sampling', icon: Globe, duration: 1100 },
  { id: 'face', label: 'Face Alignment & Temporal Sampling', desc: 'Extracting keyframes and facial bounding contours', icon: FileSearch, duration: 1300 },
  { id: 'cnn', label: 'CNN Forensics & Grad-CAM Heatmap', desc: 'Analyzing spatial boundaries and 2D FFT spectral harmonics', icon: Shield, duration: 1500 },
  { id: 'nlp', label: 'Regional NLP & Claim Decomposition', desc: 'Highlighting urgency triggers and sensationalism cues', icon: FileText, duration: 1200 },
  { id: 'vector', label: 'Fact-Check Database Similarity Search', desc: 'Querying indexed debunks from PIB, Alt News, and BOOM Live', icon: Database, duration: 1400 },
  { id: 'fusion', label: 'Multimodal Fusion Synthesis', desc: 'Calculating unified Trust Score and confidence intervals', icon: Layers, duration: 1100 },
];

export default function AnalysisPipeline({ inputData, onComplete }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedMs(prev => prev + 50);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentStage >= PIPELINE_STAGES.length) {
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(finishTimer);
    }

    const currentDuration = PIPELINE_STAGES[currentStage].duration;
    const stageTimer = setTimeout(() => {
      setCurrentStage(prev => prev + 1);
    }, currentDuration);

    return () => clearTimeout(stageTimer);
  }, [currentStage, onComplete]);

  const progressPercent = Math.min(100, Math.round((currentStage / PIPELINE_STAGES.length) * 100));
  const isComplete = currentStage >= PIPELINE_STAGES.length;

  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '4px 14px', borderRadius: 'var(--radius-full)',
          background: 'var(--accent-gradient-subtle)', border: '1px solid var(--accent-border)',
          fontSize: '12px', fontWeight: '600', color: 'var(--accent)',
          marginBottom: '12px'
        }}>
          <Cpu size={14} />
          <span>Real-Time Forensic Engine Active</span>
        </div>
        <h1 className="ts-section-title" style={{ fontSize: '28px', marginBottom: '6px' }}>
          Analyzing Media & Claims
        </h1>
        <p className="ts-section-subtitle" style={{ margin: '0 auto', maxWidth: '600px' }}>
          Running dual-pipeline analysis: visual spatial-temporal artifacts + regional NLP fact-checking.
        </p>
      </div>

      {/* ── LIVE SCANNER FRAME VISUALIZER ── */}
      <div className="ts-card" style={{ padding: '0', marginBottom: '24px', overflow: 'hidden', position: 'relative' }}>
        <div style={{
          height: '200px', background: '#090d16', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
        }}>
          {/* Sweeping Laser Scan Line */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, width: '3px',
            background: 'linear-gradient(180deg, transparent, #38bdf8, transparent)',
            boxShadow: '0 0 16px #38bdf8',
            animation: 'radarSweep 2.8s linear infinite',
            zIndex: 2
          }} />

          {/* Grid Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px)',
            backgroundSize: '20px 20px', pointerEvents: 'none'
          }} />

          {/* Center Target Box */}
          <div style={{
            width: '120px', height: '120px', border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: 'var(--radius-md)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ width: '8px', height: '8px', borderTop: '2px solid #38bdf8', borderLeft: '2px solid #38bdf8', position: 'absolute', top: '-1px', left: '-1px' }} />
            <div style={{ width: '8px', height: '8px', borderTop: '2px solid #38bdf8', borderRight: '2px solid #38bdf8', position: 'absolute', top: '-1px', right: '-1px' }} />
            <div style={{ width: '8px', height: '8px', borderBottom: '2px solid #38bdf8', borderLeft: '2px solid #38bdf8', position: 'absolute', bottom: '-1px', left: '-1px' }} />
            <div style={{ width: '8px', height: '8px', borderBottom: '2px solid #38bdf8', borderRight: '2px solid #38bdf8', position: 'absolute', bottom: '-1px', right: '-1px' }} />
            <ScanLine size={32} style={{ color: '#38bdf8', opacity: 0.8 }} />
          </div>

          {/* Live Telemetry HUD */}
          <div style={{ position: 'absolute', top: '14px', left: '16px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.7)' }}>
            TARGET: {inputData?.file || 'sample_media.mp4'}
          </div>
          <div style={{ position: 'absolute', bottom: '14px', left: '16px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
            ELAPSED: {(elapsedMs / 1000).toFixed(2)}s • ACCELERATION: APPLE MPS / CUDA
          </div>
          <div style={{ position: 'absolute', top: '14px', right: '16px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.7)' }}>
            STATUS: STAGE {Math.min(currentStage + 1, PIPELINE_STAGES.length)}/6
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '4px', background: 'var(--bg-inset)', width: '100%' }}>
          <div style={{
            height: '100%', width: `${progressPercent}%`,
            background: 'var(--accent-gradient)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* ── STAGE CARDS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {PIPELINE_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;

          return (
            <div
              key={stage.id}
              className="ts-card"
              style={{
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                border: isCurrent ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                background: isCurrent ? 'var(--accent-gradient-subtle)' : 'var(--bg-surface)',
                opacity: idx > currentStage ? 0.45 : 1,
                transition: 'all var(--transition-base)'
              }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: 'var(--radius-md)',
                background: isDone ? 'var(--success-gradient)' : (isCurrent ? 'var(--accent)' : 'var(--bg-inset)'),
                color: isDone || isCurrent ? '#fff' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {isDone ? <CheckCircle2 size={16} /> : (isCurrent ? <Loader2 size={16} className="anim-spin" /> : <Icon size={16} />)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {stage.desc}
                </div>
              </div>

              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: isDone ? 'var(--verified)' : (isCurrent ? 'var(--accent)' : 'var(--text-muted)') }}>
                {isDone ? 'COMPLETE' : (isCurrent ? 'PROCESSING...' : 'QUEUED')}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
