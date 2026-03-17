import React from 'react';

const TREND_CONFIG = {
  up: { color: '#00843D', bg: '#E0F5EC', arrow: '↑' },
  down: { color: '#C0392B', bg: '#FFF0F0', arrow: '↓' },
  flat: { color: '#F06C00', bg: '#FFE8CC', arrow: '→' },
};

export default function MetricsGrid({ metrics }) {
  const cols = Math.min(metrics.length, 6);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 14,
    }}>
      {metrics.map((metric, idx) => {
        const trend = TREND_CONFIG[metric.trend] || TREND_CONFIG['flat'];
        return (
          <div key={idx} style={{
            background: 'var(--white)',
            borderRadius: 'var(--border-radius)',
            padding: '20px 20px 18px',
            boxShadow: 'var(--card-shadow)',
            border: '1px solid var(--light-grey)',
            transition: 'var(--transition)',
            cursor: 'default',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--card-shadow)';
          }}
          >
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--dark-grey)',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              marginBottom: 8,
            }}>
              {metric.label}
            </div>
            <div style={{
              fontSize: 26,
              fontWeight: 800,
              color: 'var(--near-black)',
              letterSpacing: '-1px',
              lineHeight: 1.1,
              marginBottom: 8,
            }}>
              {metric.value}
            </div>
            {metric.delta && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                borderRadius: 20,
                background: trend.bg,
                color: trend.color,
                fontSize: 12,
                fontWeight: 700,
              }}>
                <span>{trend.arrow}</span>
                <span>{metric.delta}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
