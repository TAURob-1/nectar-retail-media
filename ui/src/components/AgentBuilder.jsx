import React, { useState } from 'react';

const PRESETS = [
  {
    id: 'shelf-share',
    icon: '🏪',
    label: 'Shelf Share Trends',
    description: 'In-Store placement performance & category wins',
    channel: 'In-Store',
  },
  {
    id: 'channel-attribution',
    icon: '📊',
    label: 'Channel Attribution',
    description: 'Full ROAS breakdown across all 3 channels',
    channel: 'all',
  },
  {
    id: 'promo-performance',
    icon: '🎯',
    label: 'Promo Performance',
    description: 'Campaign uplifts, SKU winners & ROI',
    channel: 'all',
  },
  {
    id: 'clv',
    icon: '💎',
    label: 'CLV by Segment',
    description: 'Nectar loyalty tiers & targeting opportunity',
    channel: 'all',
  },
];

const CHANNELS = [
  { value: 'all', label: 'All Channels' },
  { value: 'In-Store', label: '🏪 In-Store' },
  { value: 'On-Site', label: '🌐 On-Site' },
  { value: 'Off-Site', label: '📡 Off-Site' },
];

const TIME_RANGES = [
  'Q1 2026',
  'Q4 2025',
  'Last 30 days',
  'Last 90 days',
  'YTD 2026',
];

export default function AgentBuilder({ onSubmit, isLoading, initialPrompt, onPromptConsumed }) {
  const [prompt, setPrompt] = useState('');
  const [channel, setChannel] = useState('all');
  const [timeRange, setTimeRange] = useState('Q1 2026');
  const [activePreset, setActivePreset] = useState(null);

  // Accept injected prompt from Common Questions
  React.useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      setActivePreset(null);
      if (onPromptConsumed) onPromptConsumed();
    }
  }, [initialPrompt]);

  const handlePreset = (preset) => {
    setActivePreset(preset.id);
    setChannel(preset.channel);
    setPrompt('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt && !activePreset) return;
    onSubmit({ prompt, channel, timeRange, preset: activePreset });
  };

  const handlePromptChange = (val) => {
    setPrompt(val);
    if (val) setActivePreset(null); // clear preset if typing custom
  };

  return (
    <section style={{
      background: 'var(--white)',
      borderRadius: 'var(--border-radius)',
      boxShadow: 'var(--card-shadow)',
      padding: '32px',
      marginTop: 28,
      border: '1px solid var(--light-grey)',
    }}>
      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--near-black)' }}>
          Build Your Retail Media Report
        </h2>
        <p style={{ margin: '6px 0 0', color: 'var(--dark-grey)', fontSize: 14 }}>
          Describe what you want to analyse, or choose a preset below. The agent will generate metrics, charts, and recommendations instantly.
        </p>
      </div>

      {/* Presets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
        marginBottom: 24,
      }}>
        {PRESETS.map(preset => (
          <button
            key={preset.id}
            onClick={() => handlePreset(preset)}
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--border-radius-sm)',
              border: activePreset === preset.id
                ? '2px solid var(--nectar-orange)'
                : '2px solid var(--light-grey)',
              background: activePreset === preset.id
                ? 'var(--nectar-orange-light)'
                : 'var(--off-white)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'var(--transition)',
              transform: activePreset === preset.id ? 'translateY(-2px)' : 'none',
              boxShadow: activePreset === preset.id ? '0 4px 12px rgba(240,108,0,0.2)' : 'none',
            }}
            onMouseEnter={e => {
              if (activePreset !== preset.id) {
                e.currentTarget.style.borderColor = 'var(--nectar-orange)';
                e.currentTarget.style.background = 'var(--nectar-orange-light)';
              }
            }}
            onMouseLeave={e => {
              if (activePreset !== preset.id) {
                e.currentTarget.style.borderColor = 'var(--light-grey)';
                e.currentTarget.style.background = 'var(--off-white)';
              }
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{preset.icon}</div>
            <div style={{
              fontWeight: 600,
              fontSize: 13,
              color: activePreset === preset.id ? 'var(--nectar-orange-dark)' : 'var(--near-black)',
            }}>
              {preset.label}
            </div>
            <div style={{ fontSize: 12, color: 'var(--dark-grey)', marginTop: 3 }}>
              {preset.description}
            </div>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--light-grey)' }} />
        <span style={{ color: 'var(--dark-grey)', fontSize: 12, fontWeight: 500 }}>or write your own</span>
        <div style={{ flex: 1, height: 1, background: 'var(--light-grey)' }} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Prompt textarea */}
        <div style={{ marginBottom: 16 }}>
          <textarea
            value={prompt}
            onChange={e => handlePromptChange(e.target.value)}
            placeholder="e.g. Show me how the Easter Treats endcap campaign performed vs our baseline, broken down by SKU category and time..."
            rows={3}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 'var(--border-radius-sm)',
              border: '2px solid var(--light-grey)',
              fontSize: 14,
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none',
              transition: 'var(--transition)',
              color: 'var(--near-black)',
              background: 'var(--off-white)',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--nectar-orange)';
              e.target.style.background = 'var(--white)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--light-grey)';
              e.target.style.background = 'var(--off-white)';
            }}
          />
        </div>

        {/* Controls row */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Channel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--dark-grey)', whiteSpace: 'nowrap' }}>Channel:</label>
            <select
              value={channel}
              onChange={e => setChannel(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--border-radius-sm)',
                border: '2px solid var(--light-grey)',
                fontSize: 13,
                fontFamily: 'inherit',
                cursor: 'pointer',
                outline: 'none',
                background: 'var(--white)',
              }}
            >
              {CHANNELS.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Time Range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--dark-grey)', whiteSpace: 'nowrap' }}>Period:</label>
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--border-radius-sm)',
                border: '2px solid var(--light-grey)',
                fontSize: 13,
                fontFamily: 'inherit',
                cursor: 'pointer',
                outline: 'none',
                background: 'var(--white)',
              }}
            >
              {TIME_RANGES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || (!prompt && !activePreset)}
            style={{
              padding: '11px 28px',
              borderRadius: 'var(--border-radius-sm)',
              border: 'none',
              background: isLoading || (!prompt && !activePreset)
                ? 'var(--mid-grey)'
                : 'linear-gradient(135deg, var(--nectar-orange), var(--nectar-orange-dark))',
              color: 'var(--white)',
              fontSize: 14,
              fontWeight: 700,
              cursor: isLoading || (!prompt && !activePreset) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'var(--transition)',
              boxShadow: isLoading ? 'none' : '0 4px 12px rgba(240,108,0,0.35)',
              fontFamily: 'inherit',
            }}
          >
            {isLoading ? (
              <>
                <span style={{
                  width: 16,
                  height: 16,
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Analysing...
              </>
            ) : (
              <>
                <span>⚡</span>
                Run Agent
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
