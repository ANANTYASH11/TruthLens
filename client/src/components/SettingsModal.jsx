import React, { useState } from 'react';
import { X, Shield, Database, Bell, Globe, Sliders, Key } from 'lucide-react';

const SETTING_SECTIONS = [
  { id: 'general', label: 'General', icon: Sliders },
  { id: 'data', label: 'Data & Privacy', icon: Database },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'api', label: 'API Access', icon: Key },
];

export default function SettingsModal({ onClose }) {
  const [activeSection, setActiveSection] = useState('general');
  const [dataRetention, setDataRetention] = useState('90');
  const [autoDetect, setAutoDetect] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div 
      className="anim-fade-in"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'var(--bg-overlay)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div 
        className="anim-scale-in ts-card"
        onClick={e => e.stopPropagation()}
        style={{
          width: '640px', maxHeight: '80vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
        }}
      >
        {/* Gradient top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'var(--accent-gradient)', zIndex: 1,
        }} />
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', borderBottom: '1px solid var(--border-default)',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Settings
          </h2>
          <button 
            className="ts-btn ts-btn-ghost"
            onClick={onClose}
            style={{ padding: '6px' }}
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Sidebar */}
          <div style={{ 
            width: '180px', borderRight: '1px solid var(--border-default)',
            padding: '8px', flexShrink: 0,
          }}>
            {SETTING_SECTIONS.map(sec => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '8px 12px', fontSize: '13px', fontWeight: '500',
                    color: activeSection === sec.id ? 'var(--accent)' : 'var(--text-secondary)',
                    background: activeSection === sec.id ? 'var(--accent-light)' : 'transparent',
                    border: 'none', borderRadius: 'var(--radius-md)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'all var(--transition-fast)',
                    marginBottom: '2px',
                  }}
                >
                  <Icon size={15} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            
            {activeSection === 'general' && (
              <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label className="ts-label">Auto-detect Language</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => setAutoDetect(!autoDetect)}
                      style={{
                        width: '40px', height: '22px', borderRadius: '11px',
                        background: autoDetect ? 'var(--accent)' : 'var(--border-strong)',
                        border: 'none', cursor: 'pointer', position: 'relative',
                        transition: 'background var(--transition-fast)',
                      }}
                    >
                      <div style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: '#fff', position: 'absolute', top: '3px',
                        left: autoDetect ? '21px' : '3px',
                        transition: 'left var(--transition-fast)',
                        boxShadow: 'var(--shadow-xs)',
                      }} />
                    </button>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Automatically detect content language during analysis
                    </span>
                  </div>
                </div>

                <div>
                  <label className="ts-label">Default Analysis Depth</label>
                  <select className="ts-input ts-select" defaultValue="standard" style={{ maxWidth: '240px' }}>
                    <option value="quick">Quick (5-8 sec)</option>
                    <option value="standard">Standard (12-15 sec)</option>
                    <option value="thorough">Thorough (25-40 sec)</option>
                  </select>
                </div>

                <div>
                  <label className="ts-label">Theme</label>
                  <select className="ts-input ts-select" defaultValue="system" style={{ maxWidth: '240px' }}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
              </div>
            )}

            {activeSection === 'data' && (
              <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label className="ts-label">Data Retention Period</label>
                  <select 
                    className="ts-input ts-select" 
                    value={dataRetention}
                    onChange={e => setDataRetention(e.target.value)}
                    style={{ maxWidth: '240px' }}
                  >
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                    <option value="0">Indefinite</option>
                  </select>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Investigation records older than this will be automatically deleted.
                  </p>
                </div>

                <div>
                  <label className="ts-label">Data Export</label>
                  <button className="ts-btn ts-btn-secondary ts-btn-sm">
                    Export All Investigations (JSON)
                  </button>
                </div>

                <div>
                  <label className="ts-label" style={{ color: 'var(--false)' }}>Danger Zone</label>
                  <button className="ts-btn ts-btn-danger ts-btn-sm">
                    Delete All Investigation Data
                  </button>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label className="ts-label">Email Notifications</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      style={{
                        width: '40px', height: '22px', borderRadius: '11px',
                        background: notifications ? 'var(--accent)' : 'var(--border-strong)',
                        border: 'none', cursor: 'pointer', position: 'relative',
                        transition: 'background var(--transition-fast)',
                      }}
                    >
                      <div style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: '#fff', position: 'absolute', top: '3px',
                        left: notifications ? '21px' : '3px',
                        transition: 'left var(--transition-fast)',
                        boxShadow: 'var(--shadow-xs)',
                      }} />
                    </button>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Receive analysis completion notifications
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'api' && (
              <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label className="ts-label">API Key</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      className="ts-input" 
                      value="ts_live_••••••••••••••••" 
                      readOnly
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                    />
                    <button className="ts-btn ts-btn-secondary ts-btn-sm">Copy</button>
                  </div>
                </div>

                <div>
                  <label className="ts-label">API Quota</label>
                  <div style={{ 
                    display: 'flex', justifyContent: 'space-between', 
                    fontSize: '13px', marginBottom: '6px',
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>342 / 1000 requests this month</span>
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>34%</span>
                  </div>
                  <div className="ts-meter">
                    <div className="ts-meter-fill" style={{ width: '34%', background: 'var(--accent)' }} />
                  </div>
                </div>

                <div>
                  <label className="ts-label">Documentation</label>
                  <a href="#" style={{ fontSize: '13px' }}>
                    View API Reference →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
