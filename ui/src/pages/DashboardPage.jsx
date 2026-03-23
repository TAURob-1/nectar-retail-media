import React from 'react';

const QUICK_STATS = [
  { icon: '💰', label: 'Total Media Spend', value: '£2.4M', change: '+12% vs Q1 2025', positive: true },
  { icon: '📈', label: 'Blended ROAS', value: '4.2x', change: '+0.6x vs last quarter', positive: true },
  { icon: '👁️', label: 'Total Impressions', value: '124M', change: '+8% vs Q1 2025', positive: true },
  { icon: '🛒', label: 'Incremental Revenue', value: '£10.1M', change: '+18% vs Q1 2025', positive: true },
];

const CHANNEL_BREAKDOWN = [
  { channel: 'In-Store', icon: '🏪', spend: '£940K', roas: '5.1x', share: 39, color: '#F06C00' },
  { channel: 'On-Site', icon: '🌐', spend: '£820K', roas: '4.4x', share: 34, color: '#663399' },
  { channel: 'Off-Site', icon: '📡', spend: '£640K', roas: '3.2x', share: 27, color: '#00843D' },
];

const RECENT_ACTIVITY = [
  { time: '2h ago', event: 'Easter Treats campaign ended', type: 'campaign', icon: '🎪' },
  { time: '1d ago', event: 'Q1 final spend report available', type: 'report', icon: '📋' },
  { time: '2d ago', event: 'Off-Site ROAS below 3.5x threshold', type: 'alert', icon: '⚠️' },
  { time: '3d ago', event: 'Snacks category share reached new high', type: 'insight', icon: '🏆' },
  { time: '5d ago', event: 'New Nectar loyalty segment identified', type: 'data', icon: '💎' },
];

export default function DashboardPage({ dataSummary, onNavigate }) {
  return (
    <div style={{ paddingTop: 28, paddingBottom: 48 }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #F06C00 0%, #C85A00 50%, #663399 100%)',
        borderRadius: 'var(--border-radius)',
        padding: '28px 32px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--card-shadow)',
        color: '#FFF',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Good morning · Nectar Retail Media
          </h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>
            {dataSummary
              ? `Tracking ${dataSummary.skus_count} SKUs · Best ROAS: ${dataSummary.best_roas_channel} · Period: ${dataSummary.reporting_period}`
              : 'Your retail media intelligence platform is ready.'}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        {QUICK_STATS.map(stat => (
          <div key={stat.label} style={{
            background: 'var(--white)',
            borderRadius: 'var(--border-radius)',
            padding: '20px',
            boxShadow: 'var(--card-shadow)',
            border: '1px solid var(--light-grey)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{stat.icon}</span>
              <span style={{ fontSize: 12, color: 'var(--dark-grey)', fontWeight: 500 }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--near-black)', letterSpacing: '-1px' }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: 12, marginTop: 4,
              color: stat.positive ? 'var(--sainsburys-green)' : '#E53E3E',
              fontWeight: 600,
            }}>
              {stat.positive ? '↑' : '↓'} {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Channel Breakdown */}
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--border-radius)',
          padding: '24px',
          boxShadow: 'var(--card-shadow)',
          border: '1px solid var(--light-grey)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 18 }}>📊</span>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--near-black)' }}>
              Channel Performance — Q1 2026
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CHANNEL_BREAKDOWN.map(ch => (
              <div key={ch.channel}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{ch.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--near-black)' }}>{ch.channel}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--dark-grey)' }}>Spend: {ch.spend}</span>
                    <span style={{
                      fontSize: 13, fontWeight: 700,
                      color: ch.color, background: `${ch.color}18`,
                      padding: '2px 8px', borderRadius: 10,
                    }}>
                      ROAS {ch.roas}
                    </span>
                  </div>
                </div>
                <div style={{ height: 8, background: 'var(--light-grey)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${ch.share}%`,
                    background: ch.color,
                    borderRadius: 4,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--dark-grey)', marginTop: 3 }}>
                  {ch.share}% of total spend
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--light-grey)' }}>
            <button
              onClick={() => onNavigate('reporting')}
              style={{
                padding: '10px 20px', borderRadius: 'var(--border-radius-sm)',
                border: 'none',
                background: 'linear-gradient(135deg, var(--nectar-orange), var(--nectar-orange-dark))',
                color: '#FFF', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 2px 8px rgba(240,108,0,0.3)',
              }}
            >
              ⚡ Run Full Channel Analysis →
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--border-radius)',
          padding: '24px',
          boxShadow: 'var(--card-shadow)',
          border: '1px solid var(--light-grey)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 18 }}>🔔</span>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--near-black)' }}>
              Recent Activity
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {RECENT_ACTIVITY.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'var(--off-white)', border: '1px solid var(--light-grey)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, color: 'var(--near-black)', fontWeight: 500, lineHeight: 1.3 }}>
                    {item.event}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--dark-grey)', marginTop: 2 }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action shortcuts */}
      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--border-radius)',
        padding: '24px',
        marginTop: 20,
        boxShadow: 'var(--card-shadow)',
        border: '1px solid var(--light-grey)',
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: 'var(--near-black)' }}>
          🚀 Quick Actions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { icon: '📊', label: 'Run a Report', desc: 'Analyse your latest data', page: 'reporting' },
            { icon: '💬', label: 'Common Questions', desc: 'Browse ready-made prompts', page: 'common-questions' },
            { icon: '🤖', label: 'Build Custom Agent', desc: 'Create your own intelligence agent', page: 'build-agent' },
          ].map(action => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.page)}
              style={{
                padding: '16px',
                borderRadius: 'var(--border-radius-sm)',
                border: '2px solid var(--light-grey)',
                background: 'var(--off-white)',
                textAlign: 'left', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'var(--transition)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--nectar-orange)';
                e.currentTarget.style.background = 'var(--nectar-orange-light)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--light-grey)';
                e.currentTarget.style.background = 'var(--off-white)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{action.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--near-black)' }}>{action.label}</div>
              <div style={{ fontSize: 12, color: 'var(--dark-grey)', marginTop: 2 }}>{action.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
