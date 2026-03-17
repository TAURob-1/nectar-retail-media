import React, { useState, useEffect, useRef } from 'react';
import AgentBuilder from './components/AgentBuilder';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import StatusBar from './components/StatusBar';

const API = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [agentResponse, setAgentResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [dataSummary, setDataSummary] = useState(null);
  const dashboardRef = useRef(null);

  // Check API health on mount
  useEffect(() => {
    fetch(`${API}/health`)
      .then(r => r.json())
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));

    fetch(`${API}/api/data/summary`)
      .then(r => r.json())
      .then(setDataSummary)
      .catch(() => {});
  }, []);

  const runAgent = async ({ prompt, channel, timeRange, preset }) => {
    setIsLoading(true);
    setError(null);
    setAgentResponse(null);

    try {
      const res = await fetch(`${API}/api/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          channel: channel || 'all',
          time_range: timeRange || 'Q1 2026',
          preset: preset || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setAgentResponse(data);

      // Scroll to dashboard after short delay
      setTimeout(() => {
        dashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header dataSummary={dataSummary} />
      <StatusBar apiStatus={apiStatus} dataSummary={dataSummary} />

      <main style={{ flex: 1, padding: '0 24px 48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <AgentBuilder onSubmit={runAgent} isLoading={isLoading} />

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
              apiBase={API}
            />
          </div>
        )}
      </main>
    </div>
  );
}
