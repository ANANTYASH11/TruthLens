import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import VerificationWorkspace from './components/VerificationWorkspace';
import AnalysisPipeline from './components/AnalysisPipeline';
import ResultsDashboard from './components/ResultsDashboard';
import EvidencePanel from './components/EvidencePanel';
import ClaimBreakdown from './components/ClaimBreakdown';
import DeepfakeAnalysis from './components/DeepfakeAnalysis';
import ImageForensics from './components/ImageForensics';
import MultilingualPanel from './components/MultilingualPanel';
import InvestigationHistory from './components/InvestigationHistory';
import VerificationReport from './components/VerificationReport';
import OrganizationDashboard from './components/OrganizationDashboard';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const [showSettings, setShowSettings] = useState(false);
  const [activeAnalysisType, setActiveAnalysisType] = useState('text');
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleStartAnalysis = (payload) => {
    setActiveAnalysisType(payload.type || 'text');
    setCurrentView('analysis');
  };

  const handlePipelineComplete = () => {
    setAnalysisResult({
      verdict: 'LIKELY MISLEADING',
      confidence: 87,
      type: activeAnalysisType,
    });
    setCurrentView('results');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-body)' }}>
      
      {/* ── Navigation ── */}
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* ── Main Content ── */}
      <main style={{ flex: 1 }}>
        
        {currentView === 'landing' && (
          <LandingPage 
            onStartVerification={() => setCurrentView('workspace')} 
          />
        )}

        {currentView === 'workspace' && (
          <VerificationWorkspace 
            onStartAnalysis={handleStartAnalysis} 
          />
        )}

        {currentView === 'analysis' && (
          <AnalysisPipeline 
            onComplete={handlePipelineComplete} 
          />
        )}

        {currentView === 'results' && (
          <div>
            <ResultsDashboard 
              result={analysisResult} 
              onViewEvidence={() => {
                const el = document.getElementById('evidence-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onDownloadReport={() => setCurrentView('report')}
            />

            <div id="evidence-section">
              <EvidencePanel />
            </div>

            <ClaimBreakdown />

            {(activeAnalysisType === 'video' || activeAnalysisType === 'audio' || activeAnalysisType === 'text') && (
              <DeepfakeAnalysis />
            )}

            {activeAnalysisType === 'image' && (
              <ImageForensics />
            )}

            <MultilingualPanel />
          </div>
        )}

        {currentView === 'history' && (
          <InvestigationHistory 
            onOpenReport={() => setCurrentView('report')} 
          />
        )}

        {currentView === 'report' && (
          <VerificationReport />
        )}

        {currentView === 'enterprise' && (
          <OrganizationDashboard />
        )}
      </main>

      {/* ── Settings Modal ── */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}

      {/* ── Footer ── */}
      <footer className="ts-no-print" style={{
        borderTop: '1px solid var(--border-default)',
        padding: '20px 0',
        fontSize: '12px',
        color: 'var(--text-muted)',
        background: 'var(--bg-surface)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>TRUTHSCAN</strong> — AI-Assisted Media Verification Platform
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => setShowSettings(true)} 
              style={{ 
                background: 'none', border: 'none', 
                color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px',
              }}
            >
              Settings
            </button>
            <span style={{ color: 'var(--border-default)' }}>·</span>
            <span>Terms & Privacy</span>
            <span style={{ color: 'var(--border-default)' }}>·</span>
            <span>API Documentation</span>
          </div>

          <div style={{ color: 'var(--text-muted)' }}>
            Results should be evaluated alongside cited evidence and original sources.
          </div>
        </div>
      </footer>
    </div>
  );
}
