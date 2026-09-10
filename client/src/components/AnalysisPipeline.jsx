import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Loader2, Circle, FileSearch, Globe, 
  Shield, BarChart3, FileText, Database, Brain, Layers
} from 'lucide-react';

const PIPELINE_STAGES = [
  { id: 'ingest', label: 'Content Ingestion', desc: 'Parsing and preprocessing input media', icon: FileSearch, duration: 1800 },
  { id: 'lang', label: 'Language Detection', desc: 'Identifying script and language family', icon: Globe, duration: 1200 },
  { id: 'claims', label: 'Claim Extraction', desc: 'Decomposing content into verifiable claims', icon: FileText, duration: 2000 },
  { id: 'source', label: 'Source Verification', desc: 'Cross-referencing official sources and archives', icon: Database, duration: 2500 },
  { id: 'media', label: 'Media Forensics', desc: 'FFT spectral analysis, ELA, and metadata check', icon: Shield, duration: 2200 },
  { id: 'ai', label: 'AI Pattern Analysis', desc: 'Vision Transformer and RL agent inference', icon: Brain, duration: 1800 },
  { id: 'cross', label: 'Cross-Modal Validation', desc: 'Multimodal consistency and alignment check', icon: Layers, duration: 1500 },
  { id: 'report', label: 'Report Generation', desc: 'Compiling evidence into verification report', icon: BarChart3, duration: 1000 },
];

export default function AnalysisPipeline({ onComplete }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [stageTimers, setStageTimers] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentStage >= PIPELINE_STAGES.length) {
      const timer = setTimeout(() => onComplete(), 600);
      return () => clearTimeout(timer);
    }
    const stage = PIPELINE_STAGES[currentStage];
    const timer = setTimeout(() => {
      setStageTimers(prev => ({ ...prev, [stage.id]: stage.duration }));
      setCurrentStage(prev => prev + 1);
    }, stage.duration);
    return () => clearTimeout(timer);
  }, [currentStage, onComplete]);

  const totalDuration = PIPELINE_STAGES.reduce((a, s) => a + s.duration, 0);
  const completedDuration = PIPELINE_STAGES.slice(0, currentStage).reduce((a, s) => a + s.duration, 0);
  const progress = Math.min((completedDuration / totalDuration) * 100, 100);
  const isComplete = currentStage >= PIPELINE_STAGES.length;

  return (
    <div className="anim-fade-in-up ts-hero-grid" style={{ 
      maxWidth: '780px', margin: '0 auto', padding: '48px 24px',
      position: 'relative',
    }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px', position: 'relative', zIndex: 1 }}>
        <h1 className="ts-section-title" style={{ fontSize: '24px', marginBottom: '6px' }}>
          Analyzing Content
        </h1>
        <p className="ts-section-subtitle">
          Running multi-stage forensic verification pipeline.
        </p>
      </div>

      {/* Overall Progress */}
      <div className="ts-card" style={{ 
        padding: '20px', marginBottom: '24px', position: 'relative', 
        overflow: 'hidden', zIndex: 1,
      }}>
        {/* Gradient top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: isComplete ? 'var(--success-gradient)' : 'var(--accent-gradient)',
        }} />

        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {!isComplete && <div className="ts-spinner" />}
            {isComplete && (
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: 'var(--success-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--glow-success)',
              }}>
                <CheckCircle2 size={14} style={{ color: '#fff' }} />
              </div>
            )}
            <span style={{ 
              fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' 
            }}>
              {isComplete ? 'Analysis Complete' : `Stage ${currentStage + 1} of ${PIPELINE_STAGES.length}`}
            </span>
          </div>
          {/* Digital clock style */}
          <span style={{ 
            fontSize: '14px', color: 'var(--accent)', fontFamily: 'var(--font-mono)',
            fontWeight: '600', letterSpacing: '0.5px',
            background: 'var(--accent-light)', padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
          }}>
            {(elapsed / 1000).toFixed(1)}s
          </span>
        </div>
        <div className="ts-meter" style={{ height: '10px', borderRadius: '5px' }}>
          <div 
            className="ts-meter-fill"
            style={{ 
              width: `${progress}%`, 
              background: isComplete ? 'var(--success-gradient)' : 'var(--accent-gradient)',
              borderRadius: '5px',
            }} 
          />
        </div>
      </div>

      {/* Stage Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative', zIndex: 1 }}>
        {PIPELINE_STAGES.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = i === currentStage;
          const isDone = i < currentStage;
          const isPending = i > currentStage;

          return (
            <div
              key={stage.id}
              className={isDone || isActive ? 'anim-fade-in-up' : ''}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '16px',
                padding: '16px 18px',
                background: isActive 
                  ? 'var(--accent-gradient-subtle)' 
                  : 'transparent',
                borderRadius: 'var(--radius-xl)',
                border: isActive ? `1px solid var(--accent-border)` : '1px solid transparent',
                opacity: isPending ? 0.35 : 1,
                transition: 'all var(--transition-base)',
                boxShadow: isActive ? 'var(--glow-accent)' : 'none',
              }}
            >
              {/* Step Indicator */}
              <div style={{ 
                flexShrink: 0, width: '36px', height: '36px',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone 
                  ? 'var(--success-gradient)' 
                  : isActive 
                    ? 'var(--accent-gradient)' 
                    : 'var(--bg-inset)',
                border: `1px solid ${isDone ? 'transparent' : isActive ? 'transparent' : 'var(--border-default)'}`,
                color: isDone || isActive ? '#fff' : 'var(--text-muted)',
                transition: 'all var(--transition-base)',
                boxShadow: isDone 
                  ? 'var(--glow-success)' 
                  : isActive 
                    ? 'var(--glow-accent)' 
                    : 'none',
              }}>
                {isDone ? (
                  <CheckCircle2 size={16} />
                ) : isActive ? (
                  <div className="ts-spinner" style={{ 
                    width: '16px', height: '16px',
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                  }} />
                ) : (
                  <span style={{ fontSize: '12px', fontWeight: '700' }}>{i + 1}</span>
                )}
              </div>

              {/* Stage Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px',
                  marginBottom: '2px',
                }}>
                  <Icon size={14} style={{ 
                    color: isDone ? 'var(--verified)' : isActive ? 'var(--accent)' : 'var(--text-muted)',
                    ...(isActive ? { animation: 'iconSpin 2s linear infinite' } : {}),
                  }} />
                  <span style={{ 
                    fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' 
                  }}>
                    {stage.label}
                  </span>
                  {isDone && stageTimers[stage.id] && (
                    <span style={{ 
                      fontSize: '11px', color: 'var(--verified)', fontFamily: 'var(--font-mono)',
                      fontWeight: '600',
                      background: 'var(--verified-bg)', padding: '1px 6px',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      {(stageTimers[stage.id] / 1000).toFixed(1)}s ✓
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
