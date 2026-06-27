import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { BootstrapPayload } from '../shared/types.js';
import './styles.css';

const sampleCsv = `email,profile_name,location_id
manager@lakeview-smiles.example,Lakeview Smiles,locations/2201
owner@cedar-auto.example,Cedar Auto Repair,locations/2202`;

function App() {
  const [data, setData] = useState<BootstrapPayload | null>(null);
  const [csv, setCsv] = useState(sampleCsv);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    const payload = await api<BootstrapPayload>('/api/bootstrap');
    setData(payload);
  };

  useEffect(() => {
    refresh().catch((err: Error) => setError(err.message));
  }, []);

  const runAction = async (name: string, action: () => Promise<void>) => {
    setBusyAction(name);
    setError(null);
    try {
      await action();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBusyAction(null);
    }
  };

  if (!data) {
    return (
      <main className="loading-screen">
        <div className="tower-mark">CT</div>
        <p>{error || 'Loading Control Tower AI...'}</p>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="tower-mark">CT</div>
          <div>
            <strong>Control Tower AI</strong>
            <span>Google Business Profile ops</span>
          </div>
        </div>
        <nav>
          {['Mission Control', 'Profiles', 'Reviews', 'Posts', 'Media', 'Rankings', 'Health', 'Compliance', 'Recovery', 'AI Agents'].map((item) => (
            <a href={`#${item.toLowerCase().replaceAll(' ', '-')}`} className={item === 'Mission Control' ? 'active' : ''} key={item}>
              {item}
            </a>
          ))}
        </nav>
        <div className="sidebar-card">
          <span>Signed in with Google</span>
          <strong>{data.user.email}</strong>
          <small>{data.role.name} role</small>
        </div>
      </aside>

      <main className="page">
        <header className="hero">
          <div>
            <p className="eyebrow">Agency command center</p>
            <h1>Mission Control</h1>
            <p>{data.agency.name} has a typed v1 foundation for OAuth, imports, profile discovery, RBAC, and audit logging.</p>
          </div>
          <button
            className="primary-action"
            disabled={busyAction === 'oauth'}
            onClick={() =>
              runAction('oauth', async () => {
                const response = await api<{ authUrl: string }>('/api/auth/google/start', { method: 'POST' });
                window.open(response.authUrl, '_blank', 'noopener,noreferrer');
              })
            }
          >
            {busyAction === 'oauth' ? 'Opening OAuth...' : 'Connect Google'}
          </button>
        </header>

        {error && <div className="error-banner">{error}</div>}

        <section className="metric-grid" aria-label="Key performance indicators">
          {data.metrics.map((metric) => (
            <article className={`metric-card ${metric.tone}`} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.trend}</small>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="panel briefing-panel">
            <div className="section-heading">
              <span>AI Morning Briefing</span>
              <time>{new Date(data.briefing.generatedAt).toLocaleTimeString()}</time>
            </div>
            <h2>{data.briefing.headline}</h2>
            <ul>
              {data.briefing.priorities.map((priority) => (
                <li key={priority}>{priority}</li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <div className="section-heading">
              <span>Gmail / CSV Import</span>
              <small>email, profile_name, location_id</small>
            </div>
            <textarea value={csv} onChange={(event) => setCsv(event.target.value)} />
            <button
              className="secondary-action"
              disabled={busyAction === 'import'}
              onClick={() =>
                runAction('import', async () => {
                  await api('/api/imports/gmail/csv', {
                    method: 'POST',
                    body: JSON.stringify({ fileName: 'manual-import.csv', csv })
                  });
                })
              }
            >
              {busyAction === 'import' ? 'Importing...' : 'Import Gmail Accounts'}
            </button>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel wide-panel" id="profiles">
            <div className="section-heading">
              <span>Business Profiles</span>
              <button
                className="ghost-action"
                disabled={busyAction === 'discover'}
                onClick={() =>
                  runAction('discover', async () => {
                    await api('/api/google/profiles/discover', { method: 'POST' });
                  })
                }
              >
                {busyAction === 'discover' ? 'Discovering...' : 'Auto-discover'}
              </button>
            </div>
            <div className="profile-list">
              {data.businessProfiles.map((profile) => (
                <div className="profile-row" key={profile.id}>
                  <div>
                    <strong>{profile.name}</strong>
                    <span>{profile.address}</span>
                  </div>
                  <div>
                    <b>{profile.healthScore}%</b>
                    <small>{profile.status.replaceAll('_', ' ')}</small>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel" id="ai-agents">
            <div className="section-heading">
              <span>AI Agent Center</span>
              <small>{data.agents.length} agents</small>
            </div>
            <div className="agent-list">
              {data.agents.slice(0, 6).map((agent) => (
                <div className="agent-pill" key={agent.id}>
                  <strong>{agent.name}</strong>
                  <span>{agent.focus}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel">
            <div className="section-heading">
              <span>Approval Queue</span>
              <small>Sensitive actions require approval</small>
            </div>
            {data.pendingTasks.map((task) => (
              <div className="task-card" key={task.id}>
                <strong>{task.title}</strong>
                <p>{task.description}</p>
                <span>{task.sensitivity} sensitivity</span>
              </div>
            ))}
          </article>

          <article className="panel">
            <div className="section-heading">
              <span>Audit Log</span>
              <small>Latest actions</small>
            </div>
            <div className="audit-list">
              {data.auditLogs.slice(0, 6).map((log) => (
                <div key={log.id}>
                  <strong>{log.action}</strong>
                  <span>{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

async function api<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
  const payload = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error || `Request failed with ${response.status}`);
  }

  return payload;
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
