import React from 'react';
import AgentBuilder from '../components/AgentBuilder';
import Dashboard from '../components/Dashboard';

export default function Reporting({ onSubmit, isLoading, agentResponse, error, dashboardRef, apiBase, initialPrompt, onPromptConsumed }) {
  return (
    <div style={{ paddingTop: 28, paddingBottom: 48 }}>
      {/* Page Header */}
      <div style={{
        marginBottom: 8,
      }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--near-black)' }}>
          📊 Reporting
        </h2>
        <p style={{ margin: '4px 0 0', color: 'var(--dark-grey)', fontSize: 14 }}>
          Run AI-powered retail media reports and analyses across your Nectar data.
        </p>
      </div>

      <AgentBuilder onSubmit={onSubmit} isLoading={isLoading} initialPrompt={initialPrompt} onPromptConsumed={onPromptConsumed} />

      {error && (
        <div style={{
          margin: '24px 0',
          padding: '16px 20px',
          background: '#FFF0F0',
          border: '1px solid #FFB3B3',
          borderRadius: 'var(--border-radius)',
          color: '#C0392B',
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <strong>Agent Error</strong>
            <div style={{ marginTop: 4, opacity: 0.8 }}>{error}</div>
          </div>
        </div>
      )}

      {(isLoading || agentResponse) && (
        <div ref={dashboardRef}>
          <Dashboard
            response={agentResponse}
            isLoading={isLoading}
            apiBase={apiBase}
          />
        </div>
      )}
    </div>
  );
}
