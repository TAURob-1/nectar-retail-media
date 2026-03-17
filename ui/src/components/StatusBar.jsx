import React from 'react';

export default function StatusBar({ apiStatus, dataSummary }) {
  const statusColor = apiStatus === 'online' ? '#00843D' : apiStatus === 'offline' ? '#C0392B' : '#F06C00';
  const statusLabel = apiStatus === 'online' ? 'Agent Online' : apiStatus === 'offline' ? 'Agent Offline' : 'Connecting...';

  return (
    <div style={{
      background: '#1A1614',
      padding: '8px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Agent status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: statusColor,
            boxShadow: `0 0 6px ${statusColor}`,
            animation: apiStatus === 'online' ? 'none' : 'pulse 1.5s infinite',
          }} />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{statusLabel}</span>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>·</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>claude-sonnet-4</span>
        </div>

        {/* Data badges */}
        <div style={{ display: 'flex', gap: 12 }}>
          {['In-Store', 'On-Site', 'Off-Site'].map(ch => (
            <span key={ch} style={{
              padding: '3px 10px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              background: 'rgba(240,108,0,0.15)',
              color: '#F06C00',
              border: '1px solid rgba(240,108,0,0.25)',
            }}>{ch}</span>
          ))}
          {dataSummary && (
            <span style={{
              padding: '3px 10px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              background: 'rgba(0,132,61,0.15)',
              color: '#00843D',
              border: '1px solid rgba(0,132,61,0.25)',
            }}>
              {dataSummary.skus_count} SKUs Live
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
