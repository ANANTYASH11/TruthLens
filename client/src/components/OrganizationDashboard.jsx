import React from 'react';
import { 
  BarChart3, TrendingUp, Globe, Shield, Users, 
  FileText, Clock, AlertTriangle, CheckCircle2, XCircle,
  TrendingDown
} from 'lucide-react';

const MONTHLY_DATA = [
  { month: 'Mar', verified: 12, misleading: 28, false: 8 },
  { month: 'Apr', verified: 18, misleading: 32, false: 14 },
  { month: 'May', verified: 22, misleading: 45, false: 19 },
  { month: 'Jun', verified: 15, misleading: 38, false: 22 },
  { month: 'Jul', verified: 28, misleading: 52, false: 16 },
  { month: 'Aug', verified: 34, misleading: 61, false: 24 },
];

const LANGUAGE_STATS = [
  { lang: 'Hindi', count: 142, pct: 35 },
  { lang: 'English', count: 98, pct: 24 },
  { lang: 'Tamil', count: 56, pct: 14 },
  { lang: 'Bengali', count: 41, pct: 10 },
  { lang: 'Telugu', count: 28, pct: 7 },
  { lang: 'Other', count: 40, pct: 10 },
];

const TOP_CATEGORIES = [
  { category: 'Financial Misinformation', count: 67, trend: '+12%' },
  { category: 'Health & Medical Claims', count: 54, trend: '+8%' },
  { category: 'Political Manipulation', count: 48, trend: '-3%' },
  { category: 'Deepfake Media', count: 31, trend: '+24%' },
  { category: 'Social Media Hoaxes', count: 29, trend: '+5%' },
];

const KPI_ITEMS = [
  { label: 'Total Investigations', value: '405', icon: FileText, change: '+18% this month', color: 'var(--accent)', gradient: 'var(--accent-gradient)', positive: true },
  { label: 'Misinformation Detected', value: '287', icon: AlertTriangle, change: '71% of total', color: 'var(--misleading)', gradient: 'var(--warning-gradient)', positive: false },
  { label: 'Avg. Analysis Time', value: '12.4s', icon: Clock, change: '-2.1s from last month', color: 'var(--verified)', gradient: 'var(--success-gradient)', positive: true },
  { label: 'Languages Analyzed', value: '14', icon: Globe, change: '+2 new languages', color: 'var(--info)', gradient: 'var(--accent-gradient)', positive: true },
];

export default function OrganizationDashboard() {
  const maxBar = Math.max(...MONTHLY_DATA.map(d => d.verified + d.misleading + d.false));

  return (
    <div className="anim-fade-in-up" style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="ts-section-title" style={{ fontSize: '24px', marginBottom: '6px' }}>
          Enterprise Dashboard
        </h1>
        <p className="ts-section-subtitle">
          Organization-wide verification analytics and trend monitoring.
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {KPI_ITEMS.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={`ts-card ts-card-interactive anim-fade-in-up stagger-${i+1}`} style={{ 
              padding: '22px', position: 'relative', overflow: 'hidden',
            }}>
              {/* Gradient top bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: kpi.gradient,
              }} />
              
              {/* Icon with glow */}
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: 'var(--radius-lg)',
                  background: kpi.gradient, opacity: 0.1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <Icon size={18} style={{ color: kpi.color, position: 'absolute', opacity: 10 }} />
                </div>
                {kpi.positive !== undefined && (
                  <div style={{ 
                    fontSize: '11px', fontWeight: '600', 
                    color: kpi.positive ? 'var(--verified)' : 'var(--misleading)',
                    display: 'flex', alignItems: 'center', gap: '2px',
                  }}>
                    {kpi.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  </div>
                )}
              </div>
              <div style={{ 
                fontSize: '30px', fontWeight: '800', letterSpacing: '-0.5px', lineHeight: '1',
              }}>
                <span className="ts-gradient-text">{kpi.value}</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '500' }}>
                {kpi.label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                {kpi.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', marginBottom: '24px' }}>
        
        {/* Trend Chart */}
        <div className="ts-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'var(--accent-gradient)',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
              Detection Trends
            </h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--success-gradient)', display: 'inline-block' }} />
                Verified
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--warning-gradient)', display: 'inline-block' }} />
                Misleading
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--danger-gradient)', display: 'inline-block' }} />
                False
              </span>
            </div>
          </div>

          {/* Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px' }}>
            {MONTHLY_DATA.map((d, i) => {
              const scale = 160 / maxBar;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', width: '100%' }}>
                    <div className="anim-fade-in-up" style={{ 
                      height: `${d.false * scale}px`, 
                      background: 'var(--danger-gradient)',
                      borderRadius: '4px 4px 0 0', animationDelay: `${i * 0.05}s`,
                    }} />
                    <div className="anim-fade-in-up" style={{ 
                      height: `${d.misleading * scale}px`, 
                      background: 'var(--warning-gradient)',
                      animationDelay: `${i * 0.05 + 0.05}s`,
                    }} />
                    <div className="anim-fade-in-up" style={{ 
                      height: `${d.verified * scale}px`, 
                      background: 'var(--success-gradient)',
                      borderRadius: '0 0 4px 4px', animationDelay: `${i * 0.05 + 0.1}s`,
                    }} />
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Language Distribution */}
        <div className="ts-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'var(--accent-gradient)',
          }} />
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '20px' }}>
            Language Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {LANGUAGE_STATS.map((l, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{l.lang}</span>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{l.count} ({l.pct}%)</span>
                </div>
                <div className="ts-meter" style={{ height: '6px' }}>
                  <div className="ts-meter-fill anim-progress" style={{ 
                    width: `${l.pct}%`, background: 'var(--accent-gradient)',
                    animationDelay: `${i * 0.08}s`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top Categories ── */}
      <div className="ts-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'var(--accent-gradient)',
        }} />
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Top Misinformation Categories
        </h3>
        <table className="ts-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Investigations</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {TOP_CATEGORIES.map((cat, i) => (
              <tr key={i}>
                <td style={{ fontWeight: '500' }}>{cat.category}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{cat.count}</td>
                <td>
                  <span style={{ 
                    fontWeight: '600', fontSize: '13px',
                    display: 'inline-flex', alignItems: 'center', gap: '3px',
                    ...(cat.trend.startsWith('+') ? {
                      background: 'var(--danger-gradient)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    } : {
                      background: 'var(--success-gradient)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }),
                  }}>
                    {cat.trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {cat.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
