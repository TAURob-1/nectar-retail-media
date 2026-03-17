import React from 'react';

export default function Header({ dataSummary }) {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #F06C00 0%, #C85A00 50%, #663399 100%)',
      padding: '0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo / Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            backdropFilter: 'blur(4px)',
            border: '2px solid rgba(255,255,255,0.3)',
          }}>
            🛒
          </div>
          <div>
            <div style={{
              color: '#FFF',
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
            }}>
              Nectar Retail Media
            </div>
            <div style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 12,
              fontWeight: 400,
              marginTop: 2,
            }}>
              Agent Builder · Powered by TAU Signal
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
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                <div style={{ color: '#FFF', fontSize: 14, fontWeight: 700, marginTop: 2 }}>{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
