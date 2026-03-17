import React, { useRef, useEffect } from 'react';

const TYPE_ICONS = {
  bar: '📊',
  line: '📈',
  pie: '🥧',
  doughnut: '🍩',
  scatter: '⚡',
};

export default function ChartPanel({ chart, idx, generatedHtml, isGenerating, onGenerate }) {
  const iframeRef = useRef(null);

  // Inject HTML into iframe when generated
  useEffect(() => {
    if (generatedHtml && iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      doc.open();
      doc.write(`<!DOCTYPE html><html><head>
        <style>
          body { margin: 0; padding: 0; background: #fff; overflow: hidden; }
          canvas { max-width: 100% !important; }
        </style>
      </head><body>${generatedHtml}</body></html>`);
      doc.close();
    }
  }, [generatedHtml]);

  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: 'var(--border-radius)',
      boxShadow: 'var(--card-shadow)',
      border: '1px solid var(--light-grey)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: generatedHtml ? '1px solid var(--light-grey)' : 'none',
        background: generatedHtml ? 'var(--off-white)' : 'var(--white)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>{TYPE_ICONS[chart.type] || '📊'}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--near-black)' }}>
              {chart.title}
            </div>
            <div style={{ fontSize: 12, color: 'var(--dark-grey)', marginTop: 2 }}>
              {chart.description}
            </div>
          </div>
        </div>

        {/* Generate button */}
        {!generatedHtml && (
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--border-radius-sm)',
              border: 'none',
              background: isGenerating
                ? 'var(--mid-grey)'
                : 'linear-gradient(135deg, var(--nectar-purple), var(--nectar-purple-dark))',
              color: 'var(--white)',
              fontSize: 12,
              fontWeight: 700,
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'var(--transition)',
              flexShrink: 0,
              fontFamily: 'inherit',
              boxShadow: isGenerating ? 'none' : '0 3px 10px rgba(102,51,153,0.3)',
            }}
          >
            {isGenerating ? (
              <>
                <span style={{
                  width: 12,
                  height: 12,
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Generating...
              </>
            ) : (
              <>
                <span>✨</span>
                Generate Chart
              </>
            )}
          </button>
        )}

        {generatedHtml && (
          <span style={{
            padding: '4px 10px',
            borderRadius: 20,
            background: 'var(--sainsburys-green-light)',
            color: 'var(--sainsburys-green)',
            fontSize: 11,
            fontWeight: 700,
          }}>
            ✓ Generated
          </span>
        )}
      </div>

      {/* Chart iframe */}
      {generatedHtml && (
        <div style={{ padding: '4px', background: '#fff' }}>
          <iframe
            ref={iframeRef}
            style={{
              width: '100%',
              height: 320,
              border: 'none',
              display: 'block',
            }}
            title={`chart-${idx}`}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}

      {/* Loading placeholder */}
      {isGenerating && !generatedHtml && (
        <div style={{
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          color: 'var(--dark-grey)',
          fontSize: 14,
        }}>
          <span style={{
            width: 20,
            height: 20,
            border: '2px solid var(--light-grey)',
            borderTopColor: 'var(--nectar-purple)',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.7s linear infinite',
          }} />
          Claude is building your chart...
        </div>
      )}
    </div>
  );
}
