import React, { useState } from 'react';

const PROMPTS = [
  // Media Spend Analysis
  {
    id: 1,
    category: 'Media Spend Analysis',
    icon: '💰',
    title: 'Total Media Spend vs ROAS',
    prompt: 'Show me our total retail media spend across all channels for Q1 2026 and calculate the blended ROAS. Break it down by In-Store, On-Site, and Off-Site and highlight where we are over or under-investing relative to return.',
  },
  {
    id: 2,
    category: 'Media Spend Analysis',
    icon: '📉',
    title: 'Budget Efficiency by Channel',
    prompt: 'Analyse which retail media channels are delivering the best cost-per-acquisition across our Q1 2026 spend. Identify the top 2 channels we should increase budget in and flag any channels where we should pull back spend.',
  },
  {
    id: 3,
    category: 'Media Spend Analysis',
    icon: '📅',
    title: 'Spend Pacing & Forecast',
    prompt: 'How is our media budget tracking vs plan for Q1 2026? Show weekly spend pacing, flag any overspend or underspend weeks, and forecast end-of-quarter delivery against budget.',
  },

  // Reach & Impressions
  {
    id: 4,
    category: 'Reach & Impressions',
    icon: '👁️',
    title: 'Reach & Frequency Report',
    prompt: 'Give me a reach and frequency breakdown for our Q1 2026 On-Site campaigns. What percentage of Nectar loyalty shoppers did we reach, what was the average frequency, and are there signs of ad fatigue in any segment?',
  },
  {
    id: 5,
    category: 'Reach & Impressions',
    icon: '🎯',
    title: 'Impressions by Placement Type',
    prompt: 'Break down our total impressions by placement type (banner, sponsored product, email, in-store screen) for Q1 2026. Which placements have the highest viewability and engagement rates, and what is the CPM for each?',
  },

  // Competitor Benchmarking
  {
    id: 6,
    category: 'Competitor Benchmarking',
    icon: '🏆',
    title: 'Category Share of Voice',
    prompt: 'Compare our share of voice in the snacks and beverages categories against category benchmarks for Q1 2026. Where are competitors outspending us, and what is the correlation between share of voice and share of shelf in these categories?',
  },
  {
    id: 7,
    category: 'Competitor Benchmarking',
    icon: '🔍',
    title: 'Benchmark ROAS vs Category Norms',
    prompt: 'How does our overall ROAS compare to the Nectar retail media category benchmark for Q1 2026? Identify which of our campaigns are above benchmark and which are lagging, and give reasons why.',
  },

  // Channel Mix
  {
    id: 8,
    category: 'Channel Mix',
    icon: '🔀',
    title: 'Optimal Channel Mix Recommendation',
    prompt: 'Based on Q1 2026 performance, what is the recommended channel mix for our next campaign? Show current allocation vs optimal allocation based on ROAS, reach, and incrementality data, with projected uplift if we rebalance.',
  },
  {
    id: 9,
    category: 'Channel Mix',
    icon: '🛒',
    title: 'In-Store vs Digital Performance',
    prompt: 'Compare In-Store retail media performance (endcaps, shelf screens, print) vs digital (On-Site and Off-Site) for Q1 2026. Which channels are driving more incremental basket size, and is there a halo effect from combining channels?',
  },
  {
    id: 10,
    category: 'Channel Mix',
    icon: '🌐',
    title: 'Off-Site Attribution Analysis',
    prompt: 'Show me the attribution breakdown for our Off-Site retail media campaigns in Q1 2026. How much of the revenue is view-through vs click-through, and what is the average time lag between ad exposure and purchase in-store?',
  },

  // Audience Segmentation
  {
    id: 11,
    category: 'Audience Segmentation',
    icon: '👥',
    title: 'Nectar Loyalty Segment Performance',
    prompt: 'Analyse campaign performance by Nectar loyalty tier (Gold, Silver, Bronze, New) for Q1 2026. Which segments have the highest ROAS, lowest churn, and highest CLV? Which tiers are we under-targeting?',
  },
  {
    id: 12,
    category: 'Audience Segmentation',
    icon: '🧑‍🤝‍🧑',
    title: 'Audience Overlap & Deduplication',
    prompt: 'Show audience overlap between our On-Site and Off-Site campaigns in Q1 2026. What percentage of shoppers saw both campaigns, and is there evidence of incremental reach from running both channels together?',
  },

  // ROI Analysis
  {
    id: 13,
    category: 'ROI Analysis',
    icon: '📈',
    title: 'Incremental Revenue Attribution',
    prompt: 'Calculate the incremental revenue driven by retail media in Q1 2026 using Nectar card data. Strip out organic sales lift and show only the sales directly attributable to paid media. What is the true iROAS?',
  },
  {
    id: 14,
    category: 'ROI Analysis',
    icon: '🏪',
    title: 'Promo ROI by SKU',
    prompt: 'For our top 10 promoted SKUs in Q1 2026, show the ROI for each promotional campaign including discounting cost, media spend, and incremental sales. Which SKUs are delivering the best promotional ROI and should be prioritised for Q2?',
  },
  {
    id: 15,
    category: 'ROI Analysis',
    icon: '💡',
    title: 'Full-Funnel ROI Report',
    prompt: 'Build a full-funnel ROI report for Q1 2026 covering awareness (impressions, reach), consideration (CTR, engagement), and conversion (add-to-basket, purchase). Show where in the funnel we lose shoppers and what media investment is driving the most efficient conversion.',
  },

  // Bonus prompts
  {
    id: 16,
    category: 'Campaign Performance',
    icon: '🎪',
    title: 'Easter Campaign Post-Mortem',
    prompt: 'Run a post-mortem on the Easter Treats endcap and digital campaign. Compare performance vs our pre-campaign forecast, show category uplift, basket size change, and identify the top 3 learnings we should apply to the next seasonal campaign.',
  },
  {
    id: 17,
    category: 'Campaign Performance',
    icon: '⚡',
    title: 'Top Performing Campaigns Summary',
    prompt: 'Show me the top 5 performing retail media campaigns in Q1 2026 ranked by ROAS, and the bottom 5 that underperformed. For the underperformers, what are the likely causes and what would you recommend changing?',
  },
  {
    id: 18,
    category: 'Strategic Planning',
    icon: '🗺️',
    title: 'Q2 Retail Media Strategy',
    prompt: 'Based on Q1 2026 performance data, build a recommended Q2 retail media strategy. Include: suggested budget split by channel, priority audience segments, recommended SKUs to promote, and 3 test-and-learn hypotheses to validate.',
  },
];

const CATEGORIES = [...new Set(PROMPTS.map(p => p.category))];

const categoryColors = {
  'Media Spend Analysis': { bg: '#FFF3E0', border: '#F06C00', text: '#C85A00' },
  'Reach & Impressions': { bg: '#E8D5F5', border: '#663399', text: '#4A2570' },
  'Competitor Benchmarking': { bg: '#E0F5EC', border: '#00843D', text: '#005C2A' },
  'Channel Mix': { bg: '#E3F2FD', border: '#1976D2', text: '#0D47A1' },
  'Audience Segmentation': { bg: '#FCE4EC', border: '#E91E63', text: '#880E4F' },
  'ROI Analysis': { bg: '#F3E5F5', border: '#9C27B0', text: '#4A148C' },
  'Campaign Performance': { bg: '#FFF8E1', border: '#FF8F00', text: '#E65100' },
  'Strategic Planning': { bg: '#E8EAF6', border: '#3F51B5', text: '#1A237E' },
};

export default function CommonQuestions({ onUsePrompt }) {
  const [copiedId, setCopiedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  const filteredPrompts = PROMPTS.filter(p => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = !searchText ||
      p.title.toLowerCase().includes(searchText.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchText.toLowerCase()) ||
      p.category.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCopy = (prompt) => {
    navigator.clipboard.writeText(prompt.prompt).then(() => {
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleUse = (prompt) => {
    handleCopy(prompt);
    if (onUsePrompt) onUsePrompt(prompt.prompt);
  };

  return (
    <div style={{ paddingTop: 28, paddingBottom: 48 }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #663399 0%, #4A2570 100%)',
        borderRadius: 'var(--border-radius)',
        padding: '32px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--card-shadow)',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,108,0,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <span style={{ fontSize: 32 }}>💬</span>
            <div>
              <h1 style={{ margin: 0, color: '#FFF', fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>
                Common Questions
              </h1>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>
                Ready-to-use retail media analysis prompts — click to copy or use directly
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
            {[
              { icon: '📋', label: `${PROMPTS.length} prompts ready to use` },
              { icon: '🏷️', label: `${CATEGORIES.length} analysis categories` },
              { icon: '⚡', label: 'One click to run any analysis' },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 20, padding: '5px 12px',
                color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 500,
              }}>
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--border-radius)',
        padding: '16px 20px',
        marginBottom: 20,
        boxShadow: 'var(--card-shadow)',
        border: '1px solid var(--light-grey)',
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            fontSize: 14, color: 'var(--dark-grey)',
          }}>🔍</span>
          <input
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Search prompts..."
            style={{
              width: '100%', paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
              borderRadius: 'var(--border-radius-sm)', border: '2px solid var(--light-grey)',
              fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'var(--off-white)',
              color: 'var(--near-black)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--nectar-purple)'}
            onBlur={e => e.target.style.borderColor = 'var(--light-grey)'}
          />
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['All', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                border: activeCategory === cat
                  ? '2px solid var(--nectar-purple)'
                  : '2px solid var(--light-grey)',
                background: activeCategory === cat ? 'var(--nectar-purple)' : 'var(--off-white)',
                color: activeCategory === cat ? '#FFF' : 'var(--dark-grey)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'var(--transition)',
                whiteSpace: 'nowrap',
              }}
            >
              {cat === 'All' ? `All (${PROMPTS.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 13, color: 'var(--dark-grey)', marginBottom: 16, paddingLeft: 2 }}>
        Showing {filteredPrompts.length} of {PROMPTS.length} prompts
        {searchText && ` for "${searchText}"`}
      </div>

      {/* Prompt cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 16,
      }}>
        {filteredPrompts.map(prompt => {
          const colors = categoryColors[prompt.category] || { bg: '#F8F7F5', border: '#6B6560', text: '#6B6560' };
          const isCopied = copiedId === prompt.id;
          return (
            <div
              key={prompt.id}
              style={{
                background: 'var(--white)',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--light-grey)',
                boxShadow: 'var(--card-shadow)',
                overflow: 'hidden',
                transition: 'var(--transition)',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Card Header */}
              <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--light-grey)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{prompt.icon}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 12,
                    background: colors.bg, border: `1px solid ${colors.border}`,
                    color: colors.text, fontSize: 10, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>
                    {prompt.category}
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--near-black)', lineHeight: 1.3 }}>
                  {prompt.title}
                </h3>
              </div>

              {/* Prompt Text */}
              <div style={{ padding: '12px 16px', flex: 1 }}>
                <p style={{
                  margin: 0, fontSize: 12.5, color: 'var(--dark-grey)',
                  lineHeight: 1.6, fontStyle: 'italic',
                }}>
                  "{prompt.prompt}"
                </p>
              </div>

              {/* Card Actions */}
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid var(--light-grey)',
                display: 'flex', gap: 8,
                background: 'var(--off-white)',
              }}>
                {/* Copy button */}
                <button
                  onClick={() => handleCopy(prompt)}
                  style={{
                    flex: 1, padding: '8px 12px',
                    borderRadius: 'var(--border-radius-sm)',
                    border: '2px solid var(--light-grey)',
                    background: isCopied ? 'var(--sainsburys-green-light)' : 'var(--white)',
                    color: isCopied ? 'var(--sainsburys-green)' : 'var(--dark-grey)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'var(--transition)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  }}
                >
                  <span>{isCopied ? '✅' : '📋'}</span>
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>

                {/* Use prompt button */}
                <button
                  onClick={() => handleUse(prompt)}
                  style={{
                    flex: 2, padding: '8px 12px',
                    borderRadius: 'var(--border-radius-sm)',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--nectar-orange), var(--nectar-orange-dark))',
                    color: '#FFF',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'var(--transition)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    boxShadow: '0 2px 8px rgba(240,108,0,0.3)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span>⚡</span>
                  Use This Prompt
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPrompts.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '48px 24px',
          background: 'var(--white)', borderRadius: 'var(--border-radius)',
          border: '1px solid var(--light-grey)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--near-black)', marginBottom: 6 }}>No prompts found</div>
          <div style={{ fontSize: 14, color: 'var(--dark-grey)' }}>Try adjusting your search or filter</div>
        </div>
      )}
    </div>
  );
}
