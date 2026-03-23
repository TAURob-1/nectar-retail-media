import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import StatusBar from './components/StatusBar';
import DashboardPage from './pages/DashboardPage';
import Reporting from './pages/Reporting';
import CommonQuestions from './pages/CommonQuestions';
import BuildYourOwnAgent from './pages/BuildYourOwnAgent';

const API = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
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
    // Switch to reporting tab when running an agent
    setActivePage('reporting');

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

  const [pendingPrompt, setPendingPrompt] = useState('');

  const handleUsePrompt = (promptText) => {
    // Navigate to Reporting and pre-fill the query
    setPendingPrompt(promptText);
    setActivePage('reporting');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        dataSummary={dataSummary}
        activePage={activePage}
        onNavigate={handleNavigate}
      />
      <StatusBar apiStatus={apiStatus} dataSummary={dataSummary} />

      <main style={{ flex: 1, padding: '0 24px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {activePage === 'dashboard' && (
          <DashboardPage dataSummary={dataSummary} onNavigate={handleNavigate} />
        )}

        {activePage === 'reporting' && (
          <Reporting
            onSubmit={runAgent}
            isLoading={isLoading}
            agentResponse={agentResponse}
            error={error}
            dashboardRef={dashboardRef}
            apiBase={API}
            initialPrompt={pendingPrompt}
            onPromptConsumed={() => setPendingPrompt('')}
          />
        )}

        {activePage === 'common-questions' && (
          <CommonQuestions onUsePrompt={handleUsePrompt} />
        )}

        {activePage === 'build-agent' && (
          <BuildYourOwnAgent />
        )}
      </main>
    </div>
  );
}
