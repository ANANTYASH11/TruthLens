import React, { useEffect, useRef } from 'react';
import { 
  ShieldCheck, ArrowRight, Play, FileText, Video, Globe, 
  Layers, Image, Mic, Link2, CheckCircle2, Users, Building,
  BarChart3, Clock, Languages, Zap, Sparkles, ScanLine
} from 'lucide-react';

const FEATURES = [
  {
    icon: FileText,
    title: 'Text & News Verification',
    description: 'Deconstructs articles into individual claims. Verifies dates, entities, and statistics against official sources and news archives.',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
  },
  {
    icon: Video,
    title: 'Deepfake Detection',
    description: 'Spatial-temporal analysis for facial boundary glitches, lip-sync mismatch, 2D FFT spectral noise, and voice cloning patterns.',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
  },
  {
    icon: Globe,
    title: 'Multilingual Analysis',
    description: 'Native script verification across 15+ languages including Hindi, Tamil, Bengali, Telugu, Arabic, French, Spanish, and English.',
    gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
  },
  {
    icon: Image,
    title: 'Image Forensics',
    description: 'Error Level Analysis (ELA), metadata inspection, reverse image search, and compression artifact detection.',
    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  },
  {
    icon: Mic,
    title: 'Audio Authentication',
    description: 'Voice cloning detection, spectrogram analysis, and speech-to-text cross-referencing for audio content verification.',
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
  },
  {
    icon: ShieldCheck,
    title: 'Evidence & Audit Reports',
    description: 'Transparent citation trails, evidence strength indicators, and exportable PDF reports for editorial teams and legal proceedings.',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #f43f5e 100%)',
  },
];

const STATS = [
  { value: '15+', label: 'Languages', icon: Languages },
  { value: '8', label: 'Analysis Stages', icon: Layers },
  { value: '<15s', label: 'Avg. Analysis', icon: Clock },
  { value: '94%', label: 'Accuracy Rate', icon: BarChart3 },
];

const TRUSTED_BY = [
  'Newsrooms', 'Universities', 'Fact-Checkers', 'NGOs', 'Government Agencies', 'Research Labs'
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

/* ── Floating particles component ── */
function HeroParticles() {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
    }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${6 + i * 3}px`,
          height: `${6 + i * 3}px`,
          borderRadius: '50%',
          background: `rgba(37, 99, 235, ${0.08 + i * 0.02})`,
          left: `${10 + i * 15}%`,
          top: `${20 + (i % 3) * 25}%`,
          animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
          animationDelay: `${i * 0.4}s`,
        }} />
      ))}
    </div>
  );
}

function StatCard({ stat, index }) {
  const Icon = stat.icon;
  const [ref, animatedValue] = useCountUp(stat.value.replace(/[^0-9]/g, ''), 1200);
  const hasSymbol = stat.value.includes('+') || stat.value.includes('<') || stat.value.includes('%');
  const prefix = stat.value.startsWith('<') ? '<' : '';
  const suffix = stat.value.endsWith('+') ? '+' : stat.value.endsWith('%') ? '%' : '';

  return (
    <div
      ref={ref}
      className={`ts-card ts-card-interactive anim-fade-in-up stagger-${index + 1}`}
      style={{ padding: '28px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
    >
      {/* Gradient accent bar */}
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
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
      
      {/* ═══ HERO ═══ */}
      <section className="ts-hero-grid" style={{ 
        textAlign: 'center', maxWidth: '760px', margin: '0 auto',
        paddingTop: '80px', paddingBottom: '72px',
        position: 'relative',
      }}>
        {/* Mesh gradient overlay */}
        <div style={{
          position: 'absolute', inset: '-100px -200px',
          background: 'var(--hero-mesh)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <HeroParticles />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Platform Badge */}
          <div className="anim-fade-in-up anim-glow-pulse" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-gradient-subtle)',
            border: '1px solid var(--accent-border)',
            color: 'var(--accent)',
            fontSize: '12px', fontWeight: '600',
            marginBottom: '28px',
          }}>
            <Sparkles size={14} />
            <span>AI-Powered Multilingual Verification & Forensic Intelligence</span>
          </div>

          <h1 className="anim-fade-in-up stagger-2" style={{
            fontSize: '52px', fontWeight: '800',
            letterSpacing: '-1.8px', lineHeight: '1.08',
            color: 'var(--text-primary)',
            marginBottom: '22px',
          }}>
            Know what's{' '}
            <span className="ts-gradient-text">real</span>
            <br />before it spreads.
          </h1>

          <p className="anim-fade-in-up stagger-3" style={{
            fontSize: '18px', lineHeight: '1.65',
            color: 'var(--text-secondary)',
            marginBottom: '36px',
            maxWidth: '600px', margin: '0 auto 36px',
          }}>
            Verify suspicious news, images, videos, and audio across 15+ languages 
            with evidence-backed analysis. Built for journalists, fact-checkers, 
            and investigative teams.
          </p>

          {/* CTA Buttons */}
          <div className="anim-fade-in-up stagger-4" style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              className="ts-btn ts-btn-primary ts-btn-lg" 
              onClick={onStartVerification}
            >
              <span>Start Verification</span>
              <ArrowRight size={18} />
            </button>
            <button 
              className="ts-btn ts-btn-secondary ts-btn-lg" 
              onClick={onStartVerification}
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <Play size={15} />
              <span>Try a Sample</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══ DUAL-PIPELINE ARCHITECTURE VISUALIZER ═══ */}
      <section className="anim-fade-in-up" style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Two Independent Forensic Pipelines · One Fused Trust Score
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
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
            background: 'var(--bg-inset)', padding: '20px', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-md)', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Video size={15} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Media Forensics Pipeline</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div>• MTCNN Face Extraction & Keyframe Jitter</div>
              <div>• Fine-Tuned CNN / EfficientNet Forgery Classifier</div>
              <div>• Grad-CAM Spatial Heatmap Overlays</div>
              <div>• 2D FFT Frequency Upsampling Detection</div>
            </div>
          </div>

          {/* Fusion Center Node */}
          <div style={{ textAlign: 'center', padding: '0 10px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              margin: '0 auto 8px', boxShadow: 'var(--glow-accent)'
            }}>
              <ShieldCheck size={32} />
            </div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>Trust Score</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>0 — 100%</div>
          </div>

          {/* Text Pipeline Box */}
          <div style={{
            background: 'var(--bg-inset)', padding: '20px', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-md)', background: 'var(--success-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Globe size={15} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Regional Text Pipeline</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div>• Native Scripts: Hindi, Punjabi, Tamil, Bengali</div>
              <div>• Linguistic Urgency & Panic Trigger Highlighting</div>
              <div>• Claim Decomposition & Entity Extraction</div>
              <div>• PIB / Alt News / BOOM Vector Similarity Index</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LIVE PREVIEW CARD ═══ */}
      <section className="ts-card anim-fade-in-up stagger-5" style={{ 
        padding: '0', marginBottom: '80px',
        position: 'relative', overflow: 'hidden',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
      }}>
        {/* Gradient top accent */}
        <div style={{
          height: '3px',
          background: 'var(--accent-gradient)',
        }} />
        
        {/* Scan line overlay */}
        <div className="ts-scan-line" />
        
        {/* Header */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', borderBottom: '1px solid var(--border-default)',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span className="ts-badge ts-badge-misleading">
              Likely Misleading
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
              Verification Evidence
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { source: 'Reserve Bank Official Release', status: 'Contradicts Claim', note: 'No account freezing directive issued.' },
                { source: 'Reuters Fact-Check', status: 'Previously Debunked', note: 'Same text circulated in 2023 with altered dates.' },
              ].map((ev, i) => (
                <div key={i} style={{
                  padding: '14px', 
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-default)',
                  transition: 'all var(--transition-base)',
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

      {/* ═══ STATS ROW ═══ */}
      <section style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px',
        marginBottom: '80px',
      }}>
        {STATS.map((stat, i) => (
          <StatCard key={i} stat={stat} index={i} />
        ))}
      </section>

      {/* ═══ FEATURES ═══ */}
      <section style={{ marginBottom: '80px' }}>
        <div className="anim-fade-in-up" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '36px', fontWeight: '800', 
            letterSpacing: '-1px', color: 'var(--text-primary)',
            marginBottom: '12px',
          }}>
            Comprehensive{' '}
            <span className="ts-gradient-text">verification</span>
            {' '}toolkit
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '550px', margin: '0 auto' }}>
            Multi-modal forensic analysis engineered for high-volume newsroom investigations.
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
                {/* Hover glow bg */}
                <div style={{
                  position: 'absolute', top: '-20px', right: '-20px',
                  width: '100px', height: '100px',
                  borderRadius: '50%',
                  background: feat.gradient,
                  opacity: 0.05,
                  filter: 'blur(30px)',
                  transition: 'opacity var(--transition-slow)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  width: '44px', height: '44px',
                  borderRadius: 'var(--radius-lg)',
                  background: feat.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff',
                  marginBottom: '18px',
                  boxShadow: `0 4px 12px ${feat.gradient.includes('#2563eb') ? 'rgba(37,99,235,0.2)' : 
                              feat.gradient.includes('#7c3aed') ? 'rgba(124,58,237,0.2)' : 
                              feat.gradient.includes('#0891b2') ? 'rgba(8,145,178,0.2)' :
                              feat.gradient.includes('#059669') ? 'rgba(5,150,105,0.2)' :
                              feat.gradient.includes('#d97706') ? 'rgba(217,119,6,0.2)' : 'rgba(220,38,38,0.2)'}`,
                }}>
                  <Icon size={22} />
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

      {/* ═══ TRUSTED BY ═══ */}
      <section style={{ 
        textAlign: 'center', paddingBottom: '72px',
        borderTop: '1px solid var(--border-default)', paddingTop: '48px',
      }}>
        <p className="anim-fade-in-up" style={{ 
          fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '1px',
          marginBottom: '24px',
        }}>
          Designed for
        </p>
        <div className="anim-fade-in-up stagger-2" style={{ 
          display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap',
        }}>
          {TRUSTED_BY.map((org, i) => (
            <span key={i} style={{ 
              fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface)',
              transition: 'all var(--transition-base)',
              cursor: 'default',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-border)';
                e.currentTarget.style.color = 'var(--accent)';
                e.currentTarget.style.background = 'var(--accent-light)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.background = 'var(--bg-surface)';
              }}
            >
              {org}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
