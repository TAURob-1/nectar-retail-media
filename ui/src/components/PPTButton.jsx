import React, { useState } from 'react';

export default function PPTButton({ response, apiBase }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generatePPT = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Build context data from agent response
      const contextData = {
        title: response.title,
        summary: response.summary,
        metrics: response.metrics,
        recommendations: response.recommendations,
        charts: response.suggestedCharts?.map(c => c.title),
        brand: 'Nectar / Sainsbury\'s',
        period: 'Q1 2026',
      };

      // Build a rich prompt for PPT generation
      const prompt = `Create a Nectar Retail Media presentation titled "${response.title}".

Executive Summary: ${response.summary}

Key Metrics:
${response.metrics?.map(m => `- ${m.label}: ${m.value} (${m.delta || 'no change'})`).join('\n')}

Recommendations:
${response.recommendations?.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Data Visualisations:
${response.suggestedCharts?.map(c => `- ${c.title}: ${c.description}`).join('\n')}

Style: Professional retail media pitch deck for Sainsbury's Nectar. Orange (#F06C00) and purple (#663399) brand colours. Include slide for exec summary, metrics dashboard, channel performance, recommendations, and next steps.`;

      const res = await fetch(`${apiBase}/api/ppt/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: response.title,
          subtitle: 'Nectar Retail Media Intelligence · Q1 2026',
          company: "Sainsbury's Nectar",
          prompt,
          context_data: contextData,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `HTTP ${res.status}`);
      }

      // Trigger download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Nectar_RetailMedia_${response.title.replace(/\s+/g, '_').substring(0, 40)}.pptx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <button
        onClick={generatePPT}
        disabled={isGenerating}
        style={{
          padding: '12px 20px',
          borderRadius: 'var(--border-radius-sm)',
          border: '2px solid rgba(255,255,255,0.25)',
          background: isGenerating ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.15)',
          color: '#FFF',
          fontSize: 13,
          fontWeight: 700,
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'var(--transition)',
          backdropFilter: 'blur(4px)',
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          if (!isGenerating) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = isGenerating ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.15)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {isGenerating ? (
          <>
            <span style={{
              width: 14,
              height: 14,
              border: '2px solid rgba(255,255,255,0.4)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.7s linear infinite',
            }} />
            Building Deck...
          </>
        ) : (
          <>
            <span style={{ fontSize: 16 }}>📥</span>
            Create Deck
          </>
        )}
      </button>
      {error && (
        <div style={{
          marginTop: 8,
          fontSize: 11,
          color: '#FFB3B3',
          maxWidth: 200,
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
