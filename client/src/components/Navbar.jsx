import React from 'react';
import { 
  ShieldCheck, Sun, Moon, Search, FileText, History, 
  Building2, Command, ChevronDown, Menu, X, Database, BookOpen 
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'workspace', label: 'Verify', icon: Search },
  { id: 'factchecks', label: 'Fact-Checks', icon: Database },
  { id: 'methodology', label: 'Viva & Methodology', icon: BookOpen },
  { id: 'history', label: 'Investigations', icon: History },
  { id: 'report', label: 'Audit Report', icon: FileText },
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
              Multimodal Verification Platform
            </div>
          </div>
        </div>

        {/* ── Desktop Navigation ── */}
        <nav className="ts-hide-mobile" style={{ 
          display: 'flex', alignItems: 'center', gap: '4px',
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
              >
                <Icon size={15} />
                <span>{item.label}</span>
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
          {/* Theme toggle */}
          <button 
            className="ts-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            style={{
              width: '36px', height: '36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Quick Action Button */}
          <button 
            className="ts-btn ts-btn-primary ts-hide-mobile"
            onClick={() => setCurrentView('workspace')}
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            <Search size={13} />
            <span>New Scan</span>
          </button>

          {/* Mobile menu trigger */}
          <button 
            className="ts-show-mobile"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              width: '36px', height: '36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {mobileOpen && (
        <div className="ts-show-mobile anim-fade-in-up" style={{
          padding: '12px 24px 20px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          display: 'flex', flexDirection: 'column', gap: '6px',
        }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentView(item.id); setMobileOpen(false); }}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                  fontSize: '14px', fontWeight: '500',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  textAlign: 'left',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
