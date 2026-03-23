import React, { useState } from 'react';

const DATA_SOURCES = [
  { id: 'nectar_loyalty', label: '🧡 Nectar Loyalty Data', description: 'Cardholder purchase history, segments, CLV' },
  { id: 'instore_media', label: '🏪 In-Store Media Data', description: 'Endcap, shelf, and screen campaign performance' },
  { id: 'onsite_data', label: '🌐 On-Site Retail Data', description: 'Sponsored products, banners, search placement' },
  { id: 'offsite_data', label: '📡 Off-Site Data', description: 'Programmatic, social, email campaign attribution' },
  { id: 'sales_data', label: '📦 SKU Sales Data', description: 'Product-level sales, basket size, category share' },
  { id: 'competitor_intel', label: '🏆 Competitor Intelligence', description: 'Share of voice, category benchmarks, pricing' },
  { id: 'seasonal_calendar', label: '📅 Seasonal Calendar', description: 'Key trade events, bank holidays, seasonal peaks' },
  { id: 'media_costs', label: '💷 Media Cost Data', description: 'CPM, CPC, spend pacing, budget allocation' },
];

const OUTPUT_FORMATS = [
  { value: 'dashboard', label: '📊 Interactive Dashboard', description: 'Charts, metrics, and recommendations' },
  { value: 'summary', label: '📝 Executive Summary', description: 'Concise written analysis with key takeaways' },
  { value: 'ppt', label: '📑 PowerPoint Slide', description: 'Ready-to-present slide with visuals' },
  { value: 'data_table', label: '📋 Data Table', description: 'Structured data export with calculated fields' },
  { value: 'alert', label: '🔔 Alert & Monitoring', description: 'Trigger notifications when thresholds are breached' },
];

const EXAMPLE_AGENTS = [
  { icon: '📉', name: 'Weekly ROAS Monitor', desc: 'Alerts when ROAS drops below 3.5x on any channel' },
  { icon: '🏆', name: 'Category Share Tracker', desc: 'Weekly share of voice vs top 3 competitors' },
  { icon: '💎', name: 'CLV Segment Analyser', desc: 'Monthly CLV movement by Nectar loyalty tier' },
];

const WIZARD_STEPS = ['Define Agent', 'Select Data', 'Set Output', 'Instructions', 'Preview'];

export default function BuildYourOwnAgent() {
  const [step, setStep] = useState(0);
  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSources, setSelectedSources] = useState([]);
  const [outputFormat, setOutputFormat] = useState('dashboard');
  const [customInstructions, setCustomInstructions] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const toggleSource = (id) => {
    setSelectedSources(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const isStepValid = () => {
    if (step === 0) return agentName.trim().length > 0;
    if (step === 1) return selectedSources.length > 0;
    return true;
  };

  const previewDataSources = selectedSources
    .map(id => DATA_SOURCES.find(d => d.id === id)?.label)
    .filter(Boolean);
  const previewOutput = OUTPUT_FORMATS.find(f => f.value === outputFormat);

  return (
    <div style={{ paddingTop: 28, paddingBottom: 48 }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1A1614 0%, #2D2420 100%)',
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
          background: 'radial-gradient(circle, rgba(102,51,153,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Coming soon badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(240,108,0,0.2)', border: '1px solid rgba(240,108,0,0.4)',
            borderRadius: 20, padding: '4px 12px', marginBottom: 12,
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#F06C00', textTransform: 'uppercase', letterSpacing: '1px' }}>
              🚀 Coming Soon — Preview Mode
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>🤖</span>
            <div>
              <h1 style={{ margin: 0, color: '#FFF', fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>
                Build Your Own Agent
              </h1>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                Design a custom retail media intelligence agent tailored to your exact needs
              </p>
            </div>
          </div>
          <div style={{
            marginTop: 14,
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 13,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 600,
          }}>
            💡 This is an interactive preview. Fill in the form to see how your custom agent would be configured — full deployment coming in the next release.
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Main Builder */}
        <div>
          {/* Wizard Progress */}
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--border-radius)',
            padding: '20px 24px',
            marginBottom: 20,
            boxShadow: 'var(--card-shadow)',
            border: '1px solid var(--light-grey)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {WIZARD_STEPS.map((s, idx) => (
                <React.Fragment key={s}>
                  <div
                    onClick={() => idx < step + 1 && setStep(idx)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      cursor: idx <= step ? 'pointer' : 'default',
                      flex: 1,
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: idx < step ? 'var(--sainsburys-green)'
                        : idx === step ? 'var(--nectar-orange)'
                        : 'var(--light-grey)',
                      color: idx <= step ? '#FFF' : 'var(--dark-grey)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700,
                      transition: 'var(--transition)',
                      boxShadow: idx === step ? '0 0 0 4px rgba(240,108,0,0.2)' : 'none',
                    }}>
                      {idx < step ? '✓' : idx + 1}
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: idx === step ? 700 : 500,
                      color: idx === step ? 'var(--nectar-orange)' : idx < step ? 'var(--sainsburys-green)' : 'var(--dark-grey)',
                      whiteSpace: 'nowrap',
                    }}>
                      {s}
                    </span>
                  </div>
                  {idx < WIZARD_STEPS.length - 1 && (
                    <div style={{
                      flex: 1, height: 2, marginBottom: 18,
                      background: idx < step ? 'var(--sainsburys-green)' : 'var(--light-grey)',
                      transition: 'var(--transition)',
                    }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--border-radius)',
            padding: '28px',
            boxShadow: 'var(--card-shadow)',
            border: '1px solid var(--light-grey)',
            minHeight: 400,
          }}>
            {/* Step 0: Define Agent */}
            {step === 0 && (
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: 'var(--near-black)' }}>
                  Define Your Agent
                </h2>
                <p style={{ margin: '0 0 24px', color: 'var(--dark-grey)', fontSize: 14 }}>
                  Give your agent a name and describe what it should do.
                </p>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--near-black)', marginBottom: 6 }}>
                    Agent Name *
                  </label>
                  <input
                    value={agentName}
                    onChange={e => setAgentName(e.target.value)}
                    placeholder="e.g. Weekly ROAS Performance Monitor"
                    style={{
                      width: '100%', padding: '12px 14px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: '2px solid var(--light-grey)',
                      fontSize: 14, fontFamily: 'inherit', outline: 'none',
                      color: 'var(--near-black)', background: 'var(--off-white)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--nectar-orange)'}
                    onBlur={e => e.target.style.borderColor = 'var(--light-grey)'}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--near-black)', marginBottom: 6 }}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe what this agent will analyse and what decisions it should help you make..."
                    rows={4}
                    style={{
                      width: '100%', padding: '12px 14px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: '2px solid var(--light-grey)',
                      fontSize: 14, fontFamily: 'inherit', outline: 'none',
                      color: 'var(--near-black)', background: 'var(--off-white)',
                      resize: 'vertical',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--nectar-orange)'}
                    onBlur={e => e.target.style.borderColor = 'var(--light-grey)'}
                  />
                </div>

                {/* Inspiration */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--dark-grey)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Inspiration — Popular Agents
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {EXAMPLE_AGENTS.map(ex => (
                      <button
                        key={ex.name}
                        onClick={() => { setAgentName(ex.name); setDescription(ex.desc); }}
                        style={{
                          padding: '10px 14px', borderRadius: 'var(--border-radius-sm)',
                          border: '2px solid var(--light-grey)', background: 'var(--off-white)',
                          textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                          transition: 'var(--transition)',
                          display: 'flex', alignItems: 'center', gap: 10,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--nectar-orange)';
                          e.currentTarget.style.background = 'var(--nectar-orange-light)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--light-grey)';
                          e.currentTarget.style.background = 'var(--off-white)';
                        }}
                      >
                        <span style={{ fontSize: 18 }}>{ex.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--near-black)' }}>{ex.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--dark-grey)', marginTop: 2 }}>{ex.desc}</div>
                        </div>
                        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--nectar-orange)' }}>Use →</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Select Data Sources */}
            {step === 1 && (
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: 'var(--near-black)' }}>
                  Select Data Sources
                </h2>
                <p style={{ margin: '0 0 24px', color: 'var(--dark-grey)', fontSize: 14 }}>
                  Choose which data sources your agent should have access to. Select all that are relevant.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {DATA_SOURCES.map(source => {
                    const isSelected = selectedSources.includes(source.id);
                    return (
                      <label
                        key={source.id}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 12,
                          padding: '14px', borderRadius: 'var(--border-radius-sm)',
                          border: `2px solid ${isSelected ? 'var(--nectar-orange)' : 'var(--light-grey)'}`,
                          background: isSelected ? 'var(--nectar-orange-light)' : 'var(--off-white)',
                          cursor: 'pointer', transition: 'var(--transition)',
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'var(--nectar-orange)';
                            e.currentTarget.style.background = 'var(--nectar-orange-light)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'var(--light-grey)';
                            e.currentTarget.style.background = 'var(--off-white)';
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSource(source.id)}
                          style={{ marginTop: 2, accentColor: 'var(--nectar-orange)' }}
                        />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--near-black)' }}>{source.label}</div>
                          <div style={{ fontSize: 12, color: 'var(--dark-grey)', marginTop: 3 }}>{source.description}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {selectedSources.length > 0 && (
                  <div style={{
                    marginTop: 14, padding: '10px 14px',
                    background: 'var(--nectar-orange-light)', borderRadius: 'var(--border-radius-sm)',
                    border: '1px solid rgba(240,108,0,0.3)',
                    fontSize: 13, color: 'var(--nectar-orange-dark)',
                  }}>
                    ✅ {selectedSources.length} source{selectedSources.length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Output Format */}
            {step === 2 && (
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: 'var(--near-black)' }}>
                  Select Output Format
                </h2>
                <p style={{ margin: '0 0 24px', color: 'var(--dark-grey)', fontSize: 14 }}>
                  How should your agent deliver its findings?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {OUTPUT_FORMATS.map(format => {
                    const isSelected = outputFormat === format.value;
                    return (
                      <label
                        key={format.value}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '16px 18px',
                          borderRadius: 'var(--border-radius-sm)',
                          border: `2px solid ${isSelected ? 'var(--nectar-orange)' : 'var(--light-grey)'}`,
                          background: isSelected ? 'var(--nectar-orange-light)' : 'var(--off-white)',
                          cursor: 'pointer', transition: 'var(--transition)',
                        }}
                      >
                        <input
                          type="radio"
                          name="output"
                          value={format.value}
                          checked={isSelected}
                          onChange={() => setOutputFormat(format.value)}
                          style={{ accentColor: 'var(--nectar-orange)' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--near-black)' }}>{format.label}</div>
                          <div style={{ fontSize: 12, color: 'var(--dark-grey)', marginTop: 2 }}>{format.description}</div>
                        </div>
                        {isSelected && (
                          <span style={{ fontSize: 18 }}>✅</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Custom Instructions */}
            {step === 3 && (
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: 'var(--near-black)' }}>
                  Add Custom Instructions
                </h2>
                <p style={{ margin: '0 0 24px', color: 'var(--dark-grey)', fontSize: 14 }}>
                  Give your agent specific guidance on how to analyse, what to prioritise, and how to communicate.
                </p>
                <div style={{ marginBottom: 20 }}>
                  <textarea
                    value={customInstructions}
                    onChange={e => setCustomInstructions(e.target.value)}
                    placeholder={`e.g. Always compare to the same period last year. Focus on Q4 seasonal SKUs. Flag any ROAS below 3x as a critical alert. Use formal language suitable for a board report. Highlight competitor activity in the snacks category...`}
                    rows={8}
                    style={{
                      width: '100%', padding: '14px 16px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: '2px solid var(--light-grey)',
                      fontSize: 14, fontFamily: 'inherit', outline: 'none',
                      color: 'var(--near-black)', background: 'var(--off-white)',
                      resize: 'vertical',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--nectar-purple)'}
                    onBlur={e => e.target.style.borderColor = 'var(--light-grey)'}
                  />
                  <div style={{ fontSize: 12, color: 'var(--dark-grey)', marginTop: 6 }}>
                    Optional but recommended — the more specific you are, the better your agent performs.
                  </div>
                </div>

                {/* Instruction suggestions */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--dark-grey)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Quick Add
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      'Compare to last year',
                      'Flag anything below benchmark',
                      'Focus on top 10 SKUs',
                      'Board-ready language',
                      'Include competitor context',
                      'Weekly cadence',
                    ].map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => setCustomInstructions(prev =>
                          prev ? `${prev}\n${suggestion}` : suggestion
                        )}
                        style={{
                          padding: '5px 10px', borderRadius: 16,
                          border: '1px solid var(--light-grey)',
                          background: 'var(--off-white)', cursor: 'pointer',
                          fontSize: 12, color: 'var(--dark-grey)',
                          fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--nectar-purple)';
                          e.currentTarget.style.color = 'var(--nectar-purple)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--light-grey)';
                          e.currentTarget.style.color = 'var(--dark-grey)';
                        }}
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Preview */}
            {step === 4 && (
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: 'var(--near-black)' }}>
                  Agent Preview
                </h2>
                <p style={{ margin: '0 0 24px', color: 'var(--dark-grey)', fontSize: 14 }}>
                  Here's a summary of your custom agent configuration.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Agent Identity */}
                  <div style={{
                    padding: '16px', borderRadius: 'var(--border-radius-sm)',
                    background: 'linear-gradient(135deg, var(--nectar-orange-light), #FFF)',
                    border: '1px solid rgba(240,108,0,0.2)',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--nectar-orange)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                      Agent Identity
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--near-black)' }}>
                      🤖 {agentName || 'Unnamed Agent'}
                    </div>
                    {description && (
                      <div style={{ fontSize: 13, color: 'var(--dark-grey)', marginTop: 6 }}>{description}</div>
                    )}
                  </div>

                  {/* Data Sources */}
                  {previewDataSources.length > 0 && (
                    <div style={{
                      padding: '16px', borderRadius: 'var(--border-radius-sm)',
                      background: 'var(--off-white)', border: '1px solid var(--light-grey)',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--dark-grey)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                        Data Sources ({previewDataSources.length})
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {previewDataSources.map(s => (
                          <span key={s} style={{
                            padding: '3px 10px', borderRadius: 12,
                            background: 'var(--nectar-orange-light)',
                            border: '1px solid rgba(240,108,0,0.3)',
                            fontSize: 12, color: 'var(--nectar-orange-dark)', fontWeight: 500,
                          }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Output Format */}
                  {previewOutput && (
                    <div style={{
                      padding: '16px', borderRadius: 'var(--border-radius-sm)',
                      background: 'var(--off-white)', border: '1px solid var(--light-grey)',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--dark-grey)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                        Output Format
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--near-black)' }}>{previewOutput.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--dark-grey)', marginTop: 3 }}>{previewOutput.description}</div>
                    </div>
                  )}

                  {/* Custom Instructions */}
                  {customInstructions && (
                    <div style={{
                      padding: '16px', borderRadius: 'var(--border-radius-sm)',
                      background: 'var(--off-white)', border: '1px solid var(--light-grey)',
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--dark-grey)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                        Custom Instructions
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--near-black)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {customInstructions}
                      </div>
                    </div>
                  )}
                </div>

                {/* Deploy CTA */}
                <div style={{
                  marginTop: 24, padding: '20px',
                  background: 'linear-gradient(135deg, #1A1614 0%, #2D2420 100%)',
                  borderRadius: 'var(--border-radius-sm)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>🚀</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#FFF', marginBottom: 6 }}>
                    Ready to deploy
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
                    Agent deployment is coming in the next release. Your configuration will be saved.
                  </div>
                  <button
                    disabled
                    style={{
                      padding: '12px 32px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: '2px solid rgba(240,108,0,0.4)',
                      background: 'rgba(240,108,0,0.15)',
                      color: 'rgba(240,108,0,0.6)',
                      fontSize: 14, fontWeight: 700,
                      cursor: 'not-allowed', fontFamily: 'inherit',
                    }}
                  >
                    Deploy Agent (Coming Soon)
                  </button>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--light-grey)' }}>
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 0}
                style={{
                  padding: '10px 20px', borderRadius: 'var(--border-radius-sm)',
                  border: '2px solid var(--light-grey)',
                  background: 'var(--off-white)',
                  color: step === 0 ? 'var(--mid-grey)' : 'var(--dark-grey)',
                  fontSize: 13, fontWeight: 600, cursor: step === 0 ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                ← Back
              </button>

              {step < WIZARD_STEPS.length - 1 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!isStepValid()}
                  style={{
                    padding: '10px 24px', borderRadius: 'var(--border-radius-sm)',
                    border: 'none',
                    background: !isStepValid()
                      ? 'var(--mid-grey)'
                      : 'linear-gradient(135deg, var(--nectar-orange), var(--nectar-orange-dark))',
                    color: '#FFF', fontSize: 13, fontWeight: 700,
                    cursor: !isStepValid() ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: !isStepValid() ? 'none' : '0 4px 12px rgba(240,108,0,0.3)',
                  }}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={() => setStep(0)}
                  style={{
                    padding: '10px 24px', borderRadius: 'var(--border-radius-sm)',
                    border: 'none',
                    background: 'var(--sainsburys-green)',
                    color: '#FFF', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Start Over 🔄
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Live preview card */}
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--border-radius)',
            padding: '20px',
            boxShadow: 'var(--card-shadow)',
            border: '1px solid var(--light-grey)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--near-black)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>👁️</span> Live Summary
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--dark-grey)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Name</div>
                <div style={{ fontSize: 13, color: 'var(--near-black)', fontWeight: agentName ? 600 : 400, fontStyle: agentName ? 'normal' : 'italic' }}>
                  {agentName || 'Not set yet'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--dark-grey)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Data Sources</div>
                <div style={{ fontSize: 13, color: 'var(--near-black)', fontStyle: selectedSources.length === 0 ? 'italic' : 'normal' }}>
                  {selectedSources.length === 0 ? 'None selected' : `${selectedSources.length} source${selectedSources.length !== 1 ? 's' : ''}`}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--dark-grey)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Output</div>
                <div style={{ fontSize: 13, color: 'var(--near-black)' }}>
                  {OUTPUT_FORMATS.find(f => f.value === outputFormat)?.label || '—'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--dark-grey)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Instructions</div>
                <div style={{ fontSize: 12, color: 'var(--near-black)', fontStyle: customInstructions ? 'normal' : 'italic', lineHeight: 1.4 }}>
                  {customInstructions ? `${customInstructions.slice(0, 80)}${customInstructions.length > 80 ? '...' : ''}` : 'None added'}
                </div>
              </div>
            </div>

            {/* Completion */}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--light-grey)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: 'var(--dark-grey)', fontWeight: 600 }}>Setup progress</span>
                <span style={{ color: 'var(--nectar-orange)', fontWeight: 700 }}>Step {step + 1} of {WIZARD_STEPS.length}</span>
              </div>
              <div style={{ height: 6, background: 'var(--light-grey)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${((step + 1) / WIZARD_STEPS.length) * 100}%`,
                  background: 'linear-gradient(90deg, var(--nectar-orange), var(--nectar-orange-dark))',
                  borderRadius: 3, transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          </div>

          {/* What this unlocks */}
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--border-radius)',
            padding: '20px',
            boxShadow: 'var(--card-shadow)',
            border: '1px solid var(--light-grey)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--near-black)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>✨</span> What Custom Agents Unlock
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '⏰', text: 'Scheduled reports delivered to your inbox' },
                { icon: '🔔', text: 'Real-time alerts when KPIs breach thresholds' },
                { icon: '🧠', text: 'Agents that learn your preferences over time' },
                { icon: '🔗', text: 'API integration with your BI tools' },
                { icon: '👥', text: 'Share agents across your team' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: 'var(--dark-grey)', lineHeight: 1.4 }}>{text}</span>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 14, padding: '8px 12px',
              background: 'var(--nectar-purple-light)',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: 11, color: 'var(--nectar-purple-dark)', fontWeight: 600,
              textAlign: 'center',
            }}>
              Powered by TAU Signal · Enterprise Ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
