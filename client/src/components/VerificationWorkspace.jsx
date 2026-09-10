import React, { useState, useRef } from 'react';
import { 
  FileText, Video, Image, Mic, Link2, Upload, Globe, 
  ArrowRight, X, AlertCircle, CheckCircle2, Trash2, ShieldCheck, Sparkles
} from 'lucide-react';

const INPUT_MODES = [
  { id: 'text', label: 'News / Text', icon: FileText },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'audio', label: 'Audio', icon: Mic },
  { id: 'url', label: 'URL', icon: Link2 },
];

const LANGUAGES = [
  { code: 'auto', name: 'Auto-Detect', native: '' },
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
];

const SAMPLE_PRESETS = [
  { 
    label: '🇮🇳 Hindi Banking Rumor',
    text: 'बड़ी खबर! सनसनीखेज खुलासा: सावधान रहें! तुरंत शेयर करें, बैंक खाते बंद होने वाले हैं!',
    lang: 'hi', type: 'text',
  },
  {
    label: '🇮🇳 Tamil Medical Hoax',
    text: 'அதிர்ச்சி தகவல்! 100% கேன்சர் குணமாகும் ரகசிய மூலிகை கண்டுபிடிக்கப்பட்டது!',
    lang: 'ta', type: 'text',
  },
  {
    label: '🎬 English Deepfake Claim',
    text: 'Breaking: Shocking leaked video of CEO resignation. Share before it gets deleted!',
    lang: 'en', type: 'video',
  },
];

export default function VerificationWorkspace({ onStartAnalysis }) {
  const [mode, setMode] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedLang, setSelectedLang] = useState('auto');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);

  const handleSubmit = () => {
    onStartAnalysis({
      type: mode,
      text: textInput,
      url: urlInput,
      language: selectedLang,
      file: fileName,
    });
  };

  const loadPreset = (preset) => {
    setTextInput(preset.text);
    setSelectedLang(preset.lang);
    setMode(preset.type);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) setFileName(file.name);
  };

  const isReady = mode === 'url' 
    ? urlInput.trim().length > 0 
    : (mode === 'text' ? textInput.trim().length > 0 : fileName.length > 0);

  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="ts-section-title" style={{ fontSize: '24px', marginBottom: '6px' }}>
          Verify Content
        </h1>
        <p className="ts-section-subtitle">
          Submit text, images, video, audio, or a URL for multi-stage forensic analysis.
        </p>
      </div>

      {/* ── Mode Tabs (Pill style) ── */}
      <div style={{ 
        display: 'flex', gap: '4px', marginBottom: '24px',
        background: 'var(--bg-inset)', padding: '4px',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)',
        width: 'fit-content',
      }}>
        {INPUT_MODES.map(m => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '500',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-gradient)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? 'var(--glow-accent)' : 'none',
              }}
            >
              <Icon size={15} />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Input Area ── */}
      <div className="ts-card" style={{ 
        padding: '24px', marginBottom: '20px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Gradient top accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'var(--accent-gradient)',
        }} />

        {/* Text Input */}
        {mode === 'text' && (
          <div>
            <label className="ts-label" htmlFor="text-input">Content to Verify</label>
            <textarea
              id="text-input"
              className="ts-input ts-textarea"
              placeholder="Paste the news article, social media post, or claim you want to verify..."
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              style={{ minHeight: '180px' }}
            />
            <div style={{ 
              marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>Supports 15+ languages including Hindi, Tamil, Bengali, Arabic</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{textInput.length} chars</span>
            </div>
          </div>
        )}

        {/* URL Input */}
        {mode === 'url' && (
          <div>
            <label className="ts-label" htmlFor="url-input">Article URL</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="url-input"
                className="ts-input"
                type="url"
                placeholder="https://example.com/news-article"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
              />
            </div>
            <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              We'll extract and analyze the article content automatically.
            </p>
          </div>
        )}

        {/* File Upload (Image / Video / Audio) */}
        {(mode === 'image' || mode === 'video' || mode === 'audio') && (
          <div>
            <label className="ts-label">
              Upload {mode === 'image' ? 'Image' : mode === 'video' ? 'Video' : 'Audio'} File
            </label>
            
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: isDragging ? '2px solid var(--accent)' : '2px dashed var(--border-strong)',
                borderRadius: 'var(--radius-xl)',
                padding: '48px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragging ? 'var(--accent-light)' : 'var(--bg-inset)',
                transition: 'all var(--transition-base)',
                boxShadow: isDragging ? 'var(--glow-accent)' : 'none',
                ...(isDragging ? {} : {
                  backgroundImage: `repeating-linear-gradient(
                    0deg, var(--border-default), var(--border-default) 8px, transparent 8px, transparent 16px
                  )`,
                  backgroundSize: '1px 100%',
                  backgroundPosition: '0 0, 100% 0',
                  backgroundRepeat: 'no-repeat',
                }),
              }}
            >
              <Upload size={32} style={{ color: isDragging ? 'var(--accent)' : 'var(--text-muted)', marginBottom: '12px' }} />
              {fileName ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--verified)' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{fileName}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFileName(''); }}
                      className="ts-btn ts-btn-ghost ts-btn-sm"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500', marginBottom: '4px' }}>
                    Drop file here or click to browse
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {mode === 'image' && 'Supports PNG, JPG, WEBP (max 25MB)'}
                    {mode === 'video' && 'Supports MP4, MOV, AVI (max 500MB)'}
                    {mode === 'audio' && 'Supports MP3, WAV, FLAC (max 100MB)'}
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept={
                mode === 'image' ? 'image/*' : 
                mode === 'video' ? 'video/*' : 
                'audio/*'
              }
              onChange={e => { if (e.target.files?.[0]) setFileName(e.target.files[0].name); }}
              style={{ display: 'none' }}
            />

            {/* Optional caption/context for media */}
            <div style={{ marginTop: '16px' }}>
              <label className="ts-label" htmlFor="media-context">Context / Caption (Optional)</label>
              <textarea
                id="media-context"
                className="ts-input ts-textarea"
                placeholder="Provide any accompanying text, headline, or context for better analysis..."
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                style={{ minHeight: '80px' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Language & Settings Row ── */}
      <div className="ts-card" style={{ 
        padding: '16px 20px', marginBottom: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Globe size={16} style={{ color: 'var(--accent)' }} />
          <div>
            <label className="ts-label" htmlFor="lang-select" style={{ marginBottom: '0' }}>
              Language
            </label>
          </div>
          <select
            id="lang-select"
            className="ts-input ts-select"
            value={selectedLang}
            onChange={e => setSelectedLang(e.target.value)}
            style={{ width: '200px' }}
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>
                {l.name} {l.native && `(${l.native})`}
              </option>
            ))}
          </select>
        </div>

        <button
          className="ts-btn ts-btn-primary ts-btn-lg"
          onClick={handleSubmit}
          disabled={!isReady}
          style={{ 
            opacity: isReady ? 1 : 0.5,
            cursor: isReady ? 'pointer' : 'not-allowed',
          }}
        >
          <Sparkles size={16} />
          <span>Begin Verification</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* ── Quick Samples ── */}
      <div style={{ marginTop: '32px' }}>
        <p style={{ 
          fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.5px',
          marginBottom: '12px',
        }}>
          Try a sample
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {SAMPLE_PRESETS.map((preset, i) => (
            <button
              key={i}
              className="ts-btn ts-btn-secondary ts-btn-sm"
              onClick={() => loadPreset(preset)}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
