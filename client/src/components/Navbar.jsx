import React from 'react';
import { 
  ShieldCheck, Sun, Moon, Search, FileText, History, 
  Building2, Command, ChevronDown, Menu, X 
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'workspace', label: 'Verify', icon: Search },
  { id: 'history', label: 'Investigations', icon: History },
  { id: 'report', label: 'Reports', icon: FileText },
  { id: 'enterprise', label: 'Enterprise', icon: Building2 },
];

export default function Navbar({ currentView, setCurrentView, theme, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="ts-no-print" style={{
      backgroundColor: theme === 'dark' ? 'rgba(10,12,16,0.8)' : 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(16px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(16px) saturate(1.8)',
      borderBottom: '1px solid var(--border-default)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        
        {/* ── Brand ── */}
        <div 
          onClick={() => setCurrentView('landing')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '10px', 
            cursor: 'pointer', flexShrink: 0 
          }}
          role="button"
          tabIndex={0}
          aria-label="Go to home"
        >
          <div style={{
            width: '32px', height: '32px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
          }}>
            <ShieldCheck size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ 
              fontSize: '15px', fontWeight: '800', 
              letterSpacing: '-0.3px', lineHeight: '1.2',
            }}>
              <span className="ts-gradient-text">TRUTH LENS</span>
            </div>
            <div style={{ 
              fontSize: '10px', color: 'var(--text-muted)', 
              fontWeight: '500', letterSpacing: '0.2px',
              lineHeight: '1',
            }}>
              Verify before you trust
            </div>
          </div>
        </div>

        {/* ── Desktop Navigation ── */}
        <nav className="ts-hide-mobile" style={{ 
          display: 'flex', alignItems: 'center', gap: '2px',
        }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all var(--transition-fast)',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={15} />
                <span>{item.label}</span>
                {/* Active indicator dot */}
                {isActive && (
                  <div style={{
                    position: 'absolute', bottom: '2px', left: '50%',
                    transform: 'translateX(-50%)',
                    width: '16px', height: '2px',
                    borderRadius: '1px',
                    background: 'var(--accent-gradient)',
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Right Controls ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          
          {/* Keyboard Shortcut Hint */}
          <div className="ts-hide-mobile" style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '11px', color: 'var(--text-muted)',
            padding: '4px 8px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-inset)',
          }}>
            <Command size={11} />
            <span>K</span>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="ts-btn ts-btn-ghost"
            style={{ padding: '7px', borderRadius: 'var(--radius-md)' }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Primary CTA */}
          <button 
            className="ts-btn ts-btn-primary ts-hide-mobile"
            onClick={() => setCurrentView('workspace')}
          >
            <ShieldCheck size={15} />
            <span>Verify Content</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="ts-btn ts-btn-ghost"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none', padding: '7px' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Navigation Dropdown ── */}
      {mobileOpen && (
        <div className="anim-fade-in" style={{
          borderTop: '1px solid var(--border-default)',
          padding: '8px',
          display: 'flex', flexDirection: 'column', gap: '2px',
        }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentView(item.id); setMobileOpen(false); }}
                style={{
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            className="ts-btn ts-btn-primary"
            onClick={() => { setCurrentView('workspace'); setMobileOpen(false); }}
            style={{ marginTop: '4px' }}
          >
            <ShieldCheck size={15} />
            <span>Verify Content</span>
          </button>
        </div>
      )}
    </header>
  );
}
