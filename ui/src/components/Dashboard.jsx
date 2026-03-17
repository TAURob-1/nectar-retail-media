import React, { useState } from 'react';
import MetricsGrid from './MetricsGrid';
import ChartPanel from './ChartPanel';
import PPTButton from './PPTButton';

export default function Dashboard({ response, isLoading, apiBase }) {
  const [generatedCharts, setGeneratedCharts] = useState({});
  const [chartLoadingIdx, setChartLoadingIdx] = useState(null);

  if (isLoading) {
    return (
      <div style={{
        marginTop: 24,
        background: 'var(--white)',
        borderRadius: 'var(--border-radius)',
        padding: '48px 32px',
        textAlign: 'center',
        border: '1px solid var(--light-grey)',
        boxShadow: 'var(--card-shadow)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
        <div style={{
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--near-black)',
          marginBottom: 8,
        }}>
          Agent processing your request...
        </div>
        <div style={{ color: 'var(--dark-grey)', fontSize: 14, marginBottom: 24 }}>
          Analysing Nectar data · Generating insights · Building recommendations
        </div>
        {/* Animated progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--nectar-orange)',
              animation: `pulse 1.2s ease ${i * 0.15}s infinite`,
            }} />
          ))}
        </div>
      </div>
    );
  }

  if (!response) return null;

  const generateChart = async (chart, idx) => {
    setChartLoadingIdx(idx);
    try {
      const res = await fetch(`${apiBase}/api/widget/nectar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: chart.prompt || chart.description,
          data_key: chart.data_key,
          type: chart.type,
        }),
      });
      const data = await res.json();
      setGeneratedCharts(prev => ({ ...prev, [idx]: data.widget_html }));
    } catch (e) {
      console.error('Chart gen error:', e);
    } finally {
      setChartLoadingIdx(null);
    }
  };

  return (
    <div style={{ marginTop: 24, animation: 'fadeInUp 0.4s ease' }} className="animate-fade-up">
      {/* Title + Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #1A1614 0%, #2D2420 100%)',
        borderRadius: 'var(--border-radius)',
        padding: '28px 32px',
        marginBottom: 20,
        boxShadow: 'var(--card-shadow)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background accent */}
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,108,0,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{
                padding: '3px 10px',
                borderRadius: 20,
                background: 'rgba(240,108,0,0.2)',
                color: '#F06C00',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: '1px solid rgba(240,108,0,0.3)',
              }}>
                Agent Report
              </span>
              <span style={{
                padding: '3px 10px',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.5)',
                fontSize: 11,
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h2 style={{
              margin: '0 0 12px',
              color: '#FFF',
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}>
              {response.title}
            </h2>
            <p style={{
              margin: 0,
              color: 'rgba(255,255,255,0.72)',
              fontSize: 15,
              lineHeight: 1.6,
              maxWidth: 700,
            }}>
              {response.summary}
            </p>
          </div>

          {/* PPT Button */}
          <PPTButton response={response} apiBase={apiBase} />
        </div>
      </div>

      {/* Metrics Grid */}
      {response.metrics && response.metrics.length > 0 && (
        <MetricsGrid metrics={response.metrics} />
      )}

      {/* Charts + Recommendations row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: response.recommendations?.length ? '1fr 360px' : '1fr',
        gap: 20,
        marginTop: 20,
        alignItems: 'start',
      }}>
        {/* Charts */}
        {response.suggestedCharts && response.suggestedCharts.length > 0 && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 14,
            }}>
              <span style={{ fontSize: 18 }}>📈</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--near-black)' }}>
                Suggested Visualisations
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {response.suggestedCharts.map((chart, idx) => (
                <ChartPanel
                  key={idx}
                  chart={chart}
                  idx={idx}
                  generatedHtml={generatedCharts[idx]}
                  isGenerating={chartLoadingIdx === idx}
                  onGenerate={() => generateChart(chart, idx)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {response.recommendations && response.recommendations.length > 0 && (
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--border-radius)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
            border: '1px solid var(--light-grey)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span style={{ fontSize: 18 }}>💡</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--near-black)' }}>
                Agent Recommendations
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {response.recommendations.map((rec, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--nectar-orange), var(--nectar-orange-dark))',
                    color: '#FFF',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    {idx + 1}
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    color: 'var(--near-black)',
                  }}>
                    {rec}
                  </p>
                </div>
              ))}
            </div>

            {/* Sainsbury's branding tag */}
            <div style={{
              marginTop: 24,
              paddingTop: 16,
              borderTop: '1px solid var(--light-grey)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#00843D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
              }}>
                🛒
              </div>
              <span style={{ fontSize: 11, color: 'var(--dark-grey)', fontWeight: 500 }}>
                Powered by Nectar Intelligence · TAU Signal
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
