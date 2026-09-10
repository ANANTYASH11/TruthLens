import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Layers, Info, Eye, RotateCcw, Image, ScanLine } from 'lucide-react';

const METADATA = [
  { key: 'Format', value: 'JPEG' },
  { key: 'Resolution', value: '1920 × 1080' },
  { key: 'File Size', value: '2.4 MB' },
  { key: 'Camera', value: 'Unknown / Stripped' },
  { key: 'Date Created', value: 'March 14, 2019' },
  { key: 'Last Modified', value: 'August 18, 2026' },
  { key: 'GPS Data', value: 'Not available' },
  { key: 'Software', value: 'Adobe Photoshop 2024' },
  { key: 'Compression', value: 'Quality 72 (re-compressed)' },
];

const TOOLS = [
  { id: 'compare', label: 'Compare', icon: Layers },
  { id: 'zoom', label: 'Zoom', icon: ZoomIn },
  { id: 'metadata', label: 'Metadata', icon: Info },
  { id: 'artifacts', label: 'Artifacts', icon: Eye },
];

export default function ImageForensics() {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeTool, setActiveTool] = useState('compare');
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef(null);

  const handleSlider = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 48px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px', paddingTop: '32px', borderTop: '1px solid var(--border-default)' }}>
        <h2 className="ts-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ScanLine size={22} style={{ color: 'var(--accent)' }} />
          Image Analysis
        </h2>
        <p className="ts-section-subtitle">
          Error Level Analysis and metadata inspection for uploaded image content.
        </p>
      </div>

      {/* Tool Bar */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '16px', flexWrap: 'wrap', gap: '8px',
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {TOOLS.map(tool => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                className={`ts-btn ${activeTool === tool.id ? 'ts-btn-primary' : 'ts-btn-secondary'} ts-btn-sm`}
                onClick={() => setActiveTool(tool.id)}
              >
                <Icon size={14} />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button className="ts-btn ts-btn-ghost ts-btn-sm" onClick={() => setZoom(z => Math.min(z + 0.25, 3))}>
            <ZoomIn size={14} />
          </button>
          <button className="ts-btn ts-btn-ghost ts-btn-sm" onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}>
            <ZoomOut size={14} />
          </button>
          <button className="ts-btn ts-btn-ghost ts-btn-sm" onClick={() => { setZoom(1); setSliderPos(50); }}>
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>
        
        {/* ── Image Comparison Viewer ── */}
        {/* eslint-disable-next-line no-unused-vars */}
        <div className="ts-card" style={{ overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
          {activeTool === 'compare' && (
            <div
              ref={containerRef}
              onMouseMove={(e) => {
                if (e.buttons === 1) handleSlider(e);
              }}
              onClick={handleSlider}
              style={{
                position: 'relative', aspectRatio: '16/10',
                cursor: 'col-resize', overflow: 'hidden',
                background: '#f0f0f0',
              }}
            >
              {/* Original Layer */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
                transform: `scale(${zoom})`,
                transition: 'transform var(--transition-base)',
              }}>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Image size={48} style={{ opacity: 0.3, marginBottom: '8px' }} />
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>Original Image</div>
                </div>
              </div>

              {/* ELA Layer (clipped) */}
              <div style={{
                position: 'absolute', inset: 0,
                clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e293b 25%, #334155 50%, #1e293b 75%)',
                transform: `scale(${zoom})`,
                transition: 'transform var(--transition-base)',
              }}>
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <Layers size={48} style={{ opacity: 0.3, marginBottom: '8px' }} />
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>ELA Heatmap</div>
                </div>
              </div>

              {/* Slider Handle */}
              <div style={{
                position: 'absolute', top: 0, bottom: 0,
                left: `${sliderPos}%`, transform: 'translateX(-50%)',
                width: '3px', background: '#fff',
                boxShadow: '0 0 12px rgba(37,99,235,0.3)',
                zIndex: 5,
              }}>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '30px', height: '30px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  boxShadow: 'var(--glow-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', color: '#fff',
                }}>
                  ↔
                </div>
              </div>

              {/* Labels */}
              <div style={{
                position: 'absolute', top: '12px', left: '12px',
                fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.85)', padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
              }}>
                ORIGINAL
              </div>
              <div style={{
                position: 'absolute', top: '12px', right: '12px',
                fontSize: '11px', fontWeight: '600', color: '#94a3b8',
                background: 'rgba(0,0,0,0.6)', padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
              }}>
                ELA ANALYSIS
              </div>
            </div>
          )}

          {activeTool === 'metadata' && (
            <div style={{ padding: '20px' }}>
              <table className="ts-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {METADATA.map((m, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: '500' }}>{m.key}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{m.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(activeTool === 'zoom' || activeTool === 'artifacts') && (
            <div style={{
              aspectRatio: '16/10',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-inset)',
            }}>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <Eye size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <div style={{ fontSize: '13px' }}>
                  {activeTool === 'zoom' ? 'Zoom & Pan View' : 'Compression Artifact Analysis'}
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  Upload an image to activate this tool.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Metadata & Findings Panel ── */}
        <div className="ts-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'var(--accent-gradient)',
          }} />
          <h3 style={{
            fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.4px',
            marginBottom: '16px', paddingBottom: '12px',
            borderBottom: '1px solid var(--border-default)',
          }}>
            Image Analysis Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* ELA Score */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>ELA Manipulation Score</span>
                <span style={{ fontWeight: '700', color: 'var(--false-text)', fontFamily: 'var(--font-mono)' }}>76%</span>
              </div>
              <div className="ts-meter">
                <div className="ts-meter-fill anim-progress" style={{ width: '76%', background: 'var(--false)' }} />
              </div>
            </div>

            {/* Metadata Integrity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Metadata Integrity</span>
                <span style={{ fontWeight: '700', color: 'var(--misleading-text)', fontFamily: 'var(--font-mono)' }}>42%</span>
              </div>
              <div className="ts-meter">
                <div className="ts-meter-fill anim-progress" style={{ width: '42%', background: 'var(--misleading)' }} />
              </div>
            </div>

            <div className="ts-divider" style={{ margin: '8px 0' }} />

            {/* Key Findings */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                Key Findings
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Image was re-saved with Adobe Photoshop',
                  'Creation date (2019) predates article (2026)',
                  'EXIF metadata partially stripped',
                  'Compression artifacts suggest multiple saves',
                ].map((f, i) => (
                  <li key={i} style={{ 
                    fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4',
                    paddingLeft: '12px',
                    borderLeft: '2px solid var(--border-default)',
                  }}>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
