import React, { useState } from 'react';
import { 
  Search, ExternalLink, ShieldCheck, AlertTriangle, 
  Globe, Calendar, Tag, Filter, CheckCircle2, XCircle
} from 'lucide-react';

const STATIC_FACT_CHECKS = [
  {
    id: "fc-001",
    title: "Claim: RBI orders closure of all zero-fee bank accounts nationwide",
    claim: "बड़ी खबर! सावधान रहें! तुरंत शेयर करें, बैंक खाते बंद होने वाले हैं! 100% गुप्त जानकारी! आरबीआई ने दिया आदेश।",
    language: "hi",
    language_name: "Hindi",
    native: "हिन्दी",
    verdict: "FALSE",
    source: "PIB Fact Check",
    source_url: "https://factcheck.pib.gov.in",
    debunk_summary: "The Reserve Bank of India and PIB confirmed no account-closure directives have been issued. All accounts remain secure.",
    category: "Finance & Economy",
    date: "August 2026",
    badge: "danger"
  },
  {
    id: "fc-002",
    title: "Claim: Viral video proves EVM manipulation in Punjab assembly elections",
    claim: "ਵਾਇਰਲ ਵੀਡੀਓ: ਚੋਣਾਂ ਵਿੱਚ ਈਵੀਐਮ ਨਾਲ ਛੇੜਛਾੜ ਦਾ ਵੱਡਾ ਖੁਲਾਸਾ! ਤੁਰੰਤ ਸ਼ੇਅਰ ਕਰੋ! ਸੱਚ ਸਾਹਮਣੇ ਆ ਗਿਆ।",
    language: "pa",
    language_name: "Punjabi",
    native: "ਪੰਜਾਬੀ",
    verdict: "MISLEADING",
    source: "Alt News",
    source_url: "https://www.altnews.in",
    debunk_summary: "The clip is from an old mock-poll awareness drive conducted in 2019, falsely shared as live election tampering.",
    category: "Elections & Politics",
    date: "July 2026",
    badge: "warning"
  },
  {
    id: "fc-003",
    title: "Claim: Secret Tamil herb 100% eradicates cancer cells within 48 hours",
    claim: "அதிர்ச்சி தகவல்! உடனே ஷேர் பண்ணுங்க! 100% கேன்சர் குணமாகும் ரகசிய மூலிகை கண்டுபிடிக்கப்பட்டது! பிரேக்கிங் நியூஸ்! ⚠️",
    language: "ta",
    language_name: "Tamil",
    native: "தமிழ்",
    verdict: "DANGEROUS HOAX",
    source: "BOOM Live",
    source_url: "https://www.boomlive.in",
    debunk_summary: "Oncologists confirm no miracle herbal cure exists. Discontinuing prescribed medical treatment poses fatal risks.",
    category: "Health & Medicine",
    date: "June 2026",
    badge: "danger"
  },
  {
    id: "fc-004",
    title: "Claim: Government portal doubles bank balance by midnight via secret link",
    claim: "চাঞ্চল্যকর তথ্য! অবশ্যই শেয়ার করুন! আজ রাত ১২টার মধ্যে দ্বিগুণ টাকা পান, এই গোপন লিঙ্কে ক্লিক করুন! ব্রেকিং নিউজ! ‼️",
    language: "bn",
    language_name: "Bengali",
    native: "বাংলা",
    verdict: "CYBER PHISHING",
    source: "Vishvas News",
    source_url: "https://www.vishvasnews.com",
    debunk_summary: "State cyber cell confirmed this is a malicious credential-harvesting phishing link targeting netbanking credentials.",
    category: "Cyber Crime",
    date: "May 2026",
    badge: "danger"
  },
  {
    id: "fc-005",
    title: "Claim: High-profile corporate executive deepfake announces emergency resignation",
    claim: "Breaking News: Shocking leaked video reveals secret CEO resignation and emergency liquidation! Share before deleted! ⚠️",
    language: "en",
    language_name: "English",
    native: "English",
    verdict: "AI DEEPFAKE",
    source: "Fact Crescendo",
    source_url: "https://english.factcrescendo.com",
    debunk_summary: "Forensic analysis revealed generative GAN facial boundary blending artifacts and a cloned voice synthesized using a short public speech clip.",
    category: "Deepfake & AI",
    date: "August 2026",
    badge: "danger"
  },
  {
    id: "fc-006",
    title: "Claim: Boiled ginger and lemon remedy completely eliminates viral infection in 3 hours",
    claim: "WHO secret advisory leaked: boiled ginger and lemon water immediately destroys viruses in 3 hours.",
    language: "en",
    language_name: "English",
    native: "English",
    verdict: "FALSE",
    source: "PIB Fact Check",
    source_url: "https://factcheck.pib.gov.in",
    debunk_summary: "World Health Organization advisory confirmed home remedies do not neutralize viral pathogens. The leaked memo is completely fabricated.",
    category: "Health & Medicine",
    date: "July 2026",
    badge: "warning"
  }
];

import { getFactChecks } from '../services/api';

export default function FactCheckExplorer({ onSelectClaim }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [checks, setChecks] = useState(STATIC_FACT_CHECKS);
  const [isDbLive, setIsDbLive] = useState(false);

  useEffect(() => {
    let active = true;
    getFactChecks(searchQuery, selectedLang, selectedCategory).then(res => {
      if (active && res && res.length > 0) {
        setChecks(res);
        setIsDbLive(true);
      } else if (active) {
        const filtered = STATIC_FACT_CHECKS.filter(item => {
          const matchesSearch = searchQuery === '' || 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.debunk_summary.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesLang = selectedLang === 'all' || item.language === selectedLang;
          const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
          return matchesSearch && matchesLang && matchesCategory;
        });
        setChecks(filtered);
      }
    });
    return () => { active = false; };
  }, [searchQuery, selectedLang, selectedCategory]);

  const filteredChecks = checks;

  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: 'var(--radius-md)',
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff'
          }}>
            <ShieldCheck size={16} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Fact-Check Knowledge Base
          </span>
        </div>
        <h1 className="ts-section-title" style={{ fontSize: '28px', marginBottom: '8px' }}>
          Indexed Regional Fact-Checks & Claims
        </h1>
        <p className="ts-section-subtitle" style={{ maxWidth: '720px' }}>
          Explore curated debunks from accredited Indian and international fact-checking organizations 
          (PIB Fact Check, Alt News, BOOM Live, Vishvas News) indexed for semantic similarity matching.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="ts-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center' }}>
          
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search claims, debunks, keywords in Hindi, Punjabi, Bengali, Tamil, English..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-inset)',
                color: 'var(--text-primary)',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Language filter */}
          <select 
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-inset)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <option value="all">All Languages</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
            <option value="ta">Tamil (தமிழ்)</option>
            <option value="bn">Bengali (বাংলা)</option>
            <option value="en">English</option>
          </select>

          {/* Category filter */}
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-inset)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <option value="all">All Categories</option>
            <option value="Finance & Economy">Finance</option>
            <option value="Elections & Politics">Politics</option>
            <option value="Health & Medicine">Health</option>
            <option value="Deepfake & AI">Deepfakes</option>
            <option value="Cyber Crime">Cyber Scams</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
        {filteredChecks.map(item => (
          <div 
            key={item.id}
            className="ts-card ts-card-interactive"
            style={{ 
              padding: '22px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              {/* Category & Language Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ 
                  fontSize: '11px', fontWeight: '600', 
                  color: 'var(--accent)', background: 'var(--accent-gradient-subtle)',
                  padding: '4px 10px', borderRadius: 'var(--radius-full)'
                }}>
                  {item.category}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Globe size={12} />
                  {item.language_name} ({item.native})
                </span>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.4', marginBottom: '10px' }}>
                {item.title}
              </h3>

              {/* Native Claim Text */}
              <div style={{
                background: 'var(--bg-inset)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: '1.5',
                marginBottom: '14px',
                borderLeft: '3px solid var(--accent)'
              }}>
                "{item.claim}"
              </div>

              {/* Debunk summary */}
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                {item.debunk_summary}
              </p>
            </div>

            {/* Footer */}
            <div style={{ 
              paddingTop: '14px', 
              borderTop: '1px solid var(--border-default)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className={`ts-badge ${item.badge === 'danger' ? 'ts-badge-false' : 'ts-badge-misleading'}`} style={{ fontSize: '10px' }}>
                  {item.verdict}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  by {item.source}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {onSelectClaim && (
                  <button 
                    className="ts-btn ts-btn-secondary" 
                    style={{ fontSize: '11px', padding: '4px 10px' }}
                    onClick={() => onSelectClaim(item)}
                  >
                    Test Scan
                  </button>
                )}
                <a 
                  href={item.source_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="ts-btn ts-btn-secondary"
                  style={{ fontSize: '11px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredChecks.length === 0 && (
        <div className="ts-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <AlertTriangle size={32} style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} />
          <p>No fact-checks found matching your filters. Try clearing the search query or selecting "All Languages".</p>
        </div>
      )}
    </div>
  );
}
