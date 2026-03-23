import React from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'reporting', label: 'Reporting', icon: '📊' },
  { id: 'build-agent', label: 'Build Your Own Agent', icon: '🤖' },
  { id: 'common-questions', label: 'Common Questions', icon: '💬' },
];

export default function Header({ dataSummary, activePage, onNavigate }) {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #F06C00 0%, #C85A00 50%, #663399 100%)',
      padding: '0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
    }}>
      {/* Top bar: Logo + Quick Stats */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
      }}>
        {/* Logo / Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            backdropFilter: 'blur(4px)',
            border: '2px solid rgba(255,255,255,0.3)',
          }}>
            🛒
          </div>
          <div>
            <div style={{
              color: '#FFF',
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
            }}>
              Nectar Retail Media
            </div>
            <div style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 11,
              fontWeight: 400,
              marginTop: 2,
            }}>
              Intelligence Platform · Powered by TAU Signal
            </div>
          </div>
        </div>

        {/* Right: Quick Stats */}
        {dataSummary && (
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {[
              { label: 'Period', value: dataSummary.reporting_period },
              { label: 'Best Channel ROAS', value: dataSummary.best_roas_channel },
              { label: 'SKUs Tracked', value: dataSummary.skus_count },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                <div style={{ color: '#FFF', fontSize: 13, fontWeight: 700, marginTop: 2 }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation bar */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}>
        {NAV_ITEMS.map(item => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                padding: '10px 16px',
                borderRadius: '0',
                border: 'none',
                background: 'transparent',
                color: isActive ? '#FFF' : 'rgba(255,255,255,0.72)',
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                position: 'relative',
                transition: 'color 0.15s ease',
                borderBottom: isActive
                  ? '3px solid #FFF'
                  : '3px solid transparent',
                marginBottom: '-1px',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.color = '#FFF';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.72)';
              }}
            >
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'build-agent' && (
                <span style={{
                  fontSize: 9, fontWeight: 700,
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  borderRadius: 10,
                  padding: '1px 5px',
                  color: 'rgba(255,255,255,0.9)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  marginLeft: 2,
                }}>
                  Beta
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
