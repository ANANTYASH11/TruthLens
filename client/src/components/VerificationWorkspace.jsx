import React, { useState, useRef } from 'react';
import { 
  FileText, Video, Image, Mic, Link2, Upload, Globe, 
  ArrowRight, X, AlertCircle, CheckCircle2, Trash2, ShieldCheck, Sparkles,
  Layers, ScanLine, Play
} from 'lucide-react';

const WORKSPACE_MODES = [
  { id: 'multimodal', label: 'Multimodal Dual-Scan', desc: 'Media + Regional Headline', icon: Layers, badge: 'Recommended' },
  { id: 'text', label: 'Regional Claim / URL', desc: 'Text Misinformation & Phishing', icon: FileText },
  { id: 'video', label: 'Media Forensics', desc: 'Deepfake & Voice Clone Detection', icon: Video },
];

const PRESET_CASES = [
  {
    id: 'demo-hindi-banking',
    title: '🇮🇳 Hindi Banking Panic Forward (हिन्दी)',
    text: 'बड़ी खबर! सनसनीखेज खुलासा: सावधान रहें! तुरंत शेयर करें, बैंक खाते बंद होने वाले हैं! 100% गुप्त जानकारी! आरबीआई ने दिया आदेश। ⚠️⚠️‼️',
    lang: 'hi',
    langName: 'Hindi (हिन्दी)',
    type: 'multimodal',
    fileName: 'demo_banking_rumor.mp4'
  },
  {
    id: 'demo-punjabi-evm',
    title: '🇮🇳 Punjabi Election Tampering Clip (ਪੰਜਾਬੀ)',
    text: 'ਵਾਇਰਲ ਵੀਡੀਓ: ਚੋਣਾਂ ਵਿੱਚ ਈਵੀਐਮ ਨਾਲ ਛੇੜਛਾੜ ਦਾ ਵੱਡਾ ਖੁਲਾਸਾ! ਤੁਰੰਤ ਸ਼ੇਅਰ ਕਰੋ! ਸੱਚ ਸਾਹਮਣੇ ਆ ਗਿਆ। ⚠️',
    lang: 'pa',
    langName: 'Punjabi (ਪੰਜਾਬੀ)',
    type: 'multimodal',
    fileName: 'demo_punjabi_evm.mp4'
  },
  {
    id: 'demo-tamil-herbal',
    title: '🇮🇳 Tamil Miracle Herbal Cure (தமிழ்)',
    text: 'அதிர்ச்சி தகவல்! உடனே ஷேர் பண்ணுங்க! 100% கேன்சர் குணமாகும் ரகசிய மூலிகை கண்டுபிடிக்கப்பட்டது! பிரேக்கிங் நியூஸ்! ⚠️',
    lang: 'ta',
    langName: 'Tamil (தமிழ்)',
    type: 'text',
    fileName: ''
  },
  {
    id: 'demo-bengali-phish',
    title: '🇮🇳 Bengali Bank Double Scheme (বাংলা)',
    text: 'চাঞ্চল্যকর তথ্য! অবশ্যই শেয়ার করুন! আজ রাত ১২টার মধ্যে দ্বিগুণ টাকা পান, এই গোপন লিঙ্কে ক্লিক করুন! ব্রেকিং নিউজ! ‼️',
    lang: 'bn',
    langName: 'Bengali (বাংলা)',
    type: 'text',
    fileName: ''
  },
  {
    id: 'demo-english-deepfake',
    title: '🎬 Executive Face-Swap Deepfake (English)',
    text: 'Breaking News: Shocking leaked video reveals secret CEO resignation and emergency liquidation! Share before deleted! ⚠️',
    lang: 'en',
    langName: 'English',
    type: 'video',
    fileName: 'demo_executive_deepfake.mp4'
  }
];

export default function VerificationWorkspace({ onStartAnalysis }) {
  const [workspaceMode, setWorkspaceMode] = useState('multimodal');
  const [claimText, setClaimText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [detectedLang, setDetectedLang] = useState({ code: 'en', name: 'English', script: 'Latin' });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Auto-detect script on text change
  const handleTextChange = (e) => {
    const text = e.target.value;
    setClaimText(text);

    for (let char of text) {
      const code = char.charCodeAt(0);
      if (code >= 0x0900 && code <= 0x097F) { setDetectedLang({ code: 'hi', name: 'Hindi', script: 'Devanagari' }); return; }
      if (code >= 0x0A00 && code <= 0x0A7F) { setDetectedLang({ code: 'pa', name: 'Punjabi', script: 'Gurmukhi' }); return; }
      if (code >= 0x0B80 && code <= 0x0BFF) { setDetectedLang({ code: 'ta', name: 'Tamil', script: 'Tamil' }); return; }
      if (code >= 0x0980 && code <= 0x09FF) { setDetectedLang({ code: 'bn', name: 'Bengali', script: 'Bengali' }); return; }
      if (code >= 0x0C00 && code <= 0x0C7F) { setDetectedLang({ code: 'te', name: 'Telugu', script: 'Telugu' }); return; }
      if (code >= 0x0C80 && code <= 0x0CFF) { setDetectedLang({ code: 'kn', name: 'Kannada', script: 'Kannada' }); return; }
      if (code >= 0x0D00 && code <= 0x0D7F) { setDetectedLang({ code: 'ml', name: 'Malayalam', script: 'Malayalam' }); return; }
      if (code >= 0x0600 && code <= 0x06FF) { setDetectedLang({ code: 'ur', name: 'Urdu', script: 'Nastaliq' }); return; }
    }
    setDetectedLang({ code: 'en', name: 'English', script: 'Latin' });
  };

  const handleSelectPreset = (preset) => {
    setWorkspaceMode(preset.type);
    setClaimText(preset.text);
    if (preset.fileName) {
      setUploadedFile({ name: preset.fileName, size: '24.2 MB' });
    } else {
      setUploadedFile(null);
    }
    setDetectedLang({ code: preset.lang, name: preset.langName, script: 'Regional Script' });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      setUploadedFile({ name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({ name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
    }
  };

  const handleStartScan = () => {
    onStartAnalysis({
      mode: workspaceMode,
      text: claimText,
      url: urlInput,
      file: uploadedFile?.name || 'demo_sample.mp4',
      language: detectedLang.code
    });
  };

  const canSubmit = workspaceMode === 'multimodal'
    ? (claimText.trim().length > 0 || uploadedFile !== null)
    : (workspaceMode === 'text' ? (claimText.trim().length > 0 || urlInput.trim().length > 0) : uploadedFile !== null);

  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: 'var(--radius-md)',
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff'
          }}>
            <ScanLine size={16} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Forensic Investigation Intake
          </span>
        </div>
        <h1 className="ts-section-title" style={{ fontSize: '30px', marginBottom: '8px' }}>
          TruthLens Verification Workspace
        </h1>
        <p className="ts-section-subtitle" style={{ maxWidth: '720px' }}>
          Submit video, imagery, or suspicious news claims in English or Indian regional languages 
          for multimodal forensic verification and fact-check vector matching.
        </p>
      </div>

      {/* Mode Selector Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {WORKSPACE_MODES.map(m => {
          const Icon = m.icon;
          const isActive = workspaceMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setWorkspaceMode(m.id)}
              className="ts-card ts-card-interactive"
              style={{
                padding: '18px 20px',
                textAlign: 'left',
                border: isActive ? '2px solid var(--accent)' : '1px solid var(--border-default)',
                background: isActive ? 'var(--accent-gradient-subtle)' : 'var(--bg-surface)',
                position: 'relative'
              }}
            >
              {m.badge && (
                <span style={{
                  position: 'absolute', top: '12px', right: '12px',
                  fontSize: '10px', fontWeight: '700', color: 'var(--accent)',
                  background: 'var(--bg-surface)', padding: '2px 8px', borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--accent-border)'
                }}>
                  {m.badge}
                </span>
              )}
              <div style={{
                width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--accent)' : 'var(--bg-inset)',
                color: isActive ? '#fff' : 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <Icon size={18} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {m.label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {m.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Input Form */}
      <div className="ts-card" style={{ padding: '28px', marginBottom: '28px' }}>
        
        {/* Multimodal & Media: Drag and Drop Upload */}
        {(workspaceMode === 'multimodal' || workspaceMode === 'video') && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                Visual Media Ingest (Video or Image)
              </label>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Supported: MP4, WEBM, AVI, JPG, PNG
              </span>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: isDragging ? '2px dashed var(--accent)' : '2px dashed var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                padding: '36px 20px',
                textAlign: 'center',
                background: isDragging ? 'var(--accent-gradient-subtle)' : 'var(--bg-inset)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)'
              }}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                style={{ display: 'none' }} 
                accept="video/*,image/*"
              />
              
              {uploadedFile ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'var(--bg-surface)', padding: '10px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                  <Video size={20} style={{ color: 'var(--accent)' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{uploadedFile.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{uploadedFile.size} • Ready for frame extraction</div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                    style={{ border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={28} style={{ color: 'var(--accent)', margin: '0 auto 10px' }} />
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Drag & drop media file here, or click to browse
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Runs automated face alignment, temporal sampling, and Grad-CAM heatmap extraction
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Multimodal & Text: Claim or Article Text */}
        {(workspaceMode === 'multimodal' || workspaceMode === 'text') && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                Regional News Claim, Headline, or Social Post
              </label>

              {/* Language auto-detect pill */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '3px 10px', borderRadius: 'var(--radius-full)',
                background: 'var(--accent-gradient-subtle)', border: '1px solid var(--accent-border)',
                fontSize: '11px', fontWeight: '600', color: 'var(--accent)'
              }}>
                <Globe size={12} />
                <span>Detected: {detectedLang.name} ({detectedLang.script})</span>
              </div>
            </div>

            <textarea
              rows={4}
              placeholder="Paste headline, WhatsApp forward, or claim in Hindi, Punjabi, Tamil, Bengali, Telugu, English..."
              value={claimText}
              onChange={handleTextChange}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-inset)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                lineHeight: '1.6',
                resize: 'vertical',
                marginBottom: '14px'
              }}
            />

            {workspaceMode === 'text' && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Or verify from web link:
                </div>
                <div style={{ position: 'relative' }}>
                  <Link2 size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="url"
                    placeholder="https://news-portal.com/article-to-verify"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-default)',
                      background: 'var(--bg-inset)',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button
            className="ts-btn ts-btn-primary ts-btn-lg"
            disabled={!canSubmit}
            onClick={handleStartScan}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: canSubmit ? 1 : 0.6 }}
          >
            <span>Run Forensic Verification</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>

      {/* Preset Quick Demo Cases */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '14px' }}>
          Instant Test Presets (Regional Indian Languages)
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {PRESET_CASES.map(p => (
            <div
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className="ts-card ts-card-interactive"
              style={{ padding: '14px 16px', cursor: 'pointer' }}
            >
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {p.title}
              </div>
              <div style={{
                fontSize: '12px', color: 'var(--text-secondary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>
                "{p.text}"
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
