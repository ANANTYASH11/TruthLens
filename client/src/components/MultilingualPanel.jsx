import React, { useState } from 'react';
import { Globe, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Languages } from 'lucide-react';

const AVAILABLE_LANGUAGES = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'en', name: 'English', native: 'English' },
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

const EXAMPLE_CONTENT = {
  hi: {
    original: 'बड़ी खबर! सनसनीखेज खुलासा: देश भर के बैंक खाते बंद होने वाले हैं, तुरंत अपने पैसे निकालें! सावधान रहें! यह 100% सच है!',
    translated: 'Breaking news! Shocking revelation: Bank accounts across the country are going to be shut down, withdraw your money immediately! Be careful! This is 100% true!',
    verdict: 'LIKELY MISLEADING',
    flags: [
      { text: 'Sensational language pattern (सनसनीखेज, 100% सच)', type: 'warning' },
      { text: 'Urgency and panic indicators (तुरंत, सावधान)', type: 'warning' },
      { text: 'No credible source attribution', type: 'error' },
      { text: 'Matches known misinformation template', type: 'error' },
    ],
  },
  ta: {
    original: 'அதிர்ச்சி தகவல்! உடனே ஷேர் பண்ணுங்க! 100% கேன்சர் குணமாகும் ரகசிய மூலிகை கண்டுபிடிக்கப்பட்டது! பிரேக்கிங் நியூஸ்!',
    translated: 'Shocking information! Share immediately! A secret herb that cures cancer 100% has been discovered! Breaking news!',
    verdict: 'FALSE',
    flags: [
      { text: 'Medical misinformation — "100% cancer cure"', type: 'error' },
      { text: 'Urgent sharing request pattern', type: 'warning' },
      { text: 'No medical source or study cited', type: 'error' },
    ],
  },
};

export default function MultilingualPanel() {
  const [activeLang, setActiveLang] = useState('hi');
  const content = EXAMPLE_CONTENT[activeLang] || EXAMPLE_CONTENT['hi'];
  const langInfo = AVAILABLE_LANGUAGES.find(l => l.code === activeLang) || AVAILABLE_LANGUAGES[0];

  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 48px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px', paddingTop: '32px', borderTop: '1px solid var(--border-default)' }}>
        <h2 className="ts-section-title">Multilingual Analysis</h2>
        <p className="ts-section-subtitle">
          Native script verification with side-by-side translation and linguistic pattern analysis.
        </p>
      </div>

      {/* Language Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '20px', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Languages size={16} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
            Detected Language:
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {AVAILABLE_LANGUAGES.filter(l => EXAMPLE_CONTENT[l.code]).map(lang => (
            <button
              key={lang.code}
              className={`ts-btn ${activeLang === lang.code ? 'ts-btn-primary' : 'ts-btn-secondary'} ts-btn-sm`}
              onClick={() => setActiveLang(lang.code)}
            >
              {lang.native}
            </button>
          ))}
          {/* Show other languages as text */}
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '4px 8px', display: 'flex', alignItems: 'center' }}>
            +{AVAILABLE_LANGUAGES.filter(l => !EXAMPLE_CONTENT[l.code]).length} more
          </span>
        </div>
      </div>

      {/* ── Side-by-Side Content ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        
        {/* Original Script */}
        <div className="ts-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'var(--accent-gradient)',
          }} />
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '16px', paddingBottom: '12px',
            borderBottom: '1px solid var(--border-default)',
          }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Original Content
              </span>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent)', marginTop: '2px' }}>
                {langInfo.name} ({langInfo.native})
              </div>
            </div>
            <Globe size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <p style={{
            fontSize: '16px', lineHeight: '1.8',
            color: 'var(--text-primary)',
            fontWeight: '500',
          }}>
            {content.original}
          </p>
        </div>

        {/* English Translation */}
        <div className="ts-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(135deg, #6b7280, #9ca3af)',
          }} />
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '16px', paddingBottom: '12px',
            borderBottom: '1px solid var(--border-default)',
          }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Standardized Translation
              </span>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '2px' }}>
                English
              </div>
            </div>
            <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <p style={{
            fontSize: '15px', lineHeight: '1.7',
            color: 'var(--text-secondary)',
          }}>
            {content.translated}
          </p>
        </div>
      </div>

      {/* ── Linguistic Flags ── */}
      <div className="ts-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: content.verdict === 'FALSE' ? 'var(--danger-gradient)' : 'var(--warning-gradient)',
        }} />
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '16px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Linguistic Pattern Analysis
          </h3>
          <span className={`ts-badge ${content.verdict === 'FALSE' ? 'ts-badge-false' : 'ts-badge-misleading'}`}>
            {content.verdict}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {content.flags.map((flag, i) => {
            const Icon = flag.type === 'error' ? XCircle : AlertTriangle;
            const color = flag.type === 'error' ? 'var(--false)' : 'var(--misleading)';
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px',
                background: flag.type === 'error' ? 'var(--false-bg)' : 'var(--misleading-bg)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${flag.type === 'error' ? 'var(--false-border)' : 'var(--misleading-border)'}`,
                fontSize: '13px', color: 'var(--text-primary)',
              }}>
                <Icon size={15} style={{ color, flexShrink: 0 }} />
                <span>{flag.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
