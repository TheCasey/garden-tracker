import { NavLink, Route, Routes } from 'react-router-dom';
import {
  getPublicAppConfig,
  publicAppRuntimeContract,
  type PublicAppConfig,
} from '../lib/env';

const appConfig = getPublicAppConfig(import.meta.env);

export function App() {
  return (
    <main className="app-shell" aria-label="Garden Tracker dashboard">
      <header className="topbar">
        <div>
          <p className="eyebrow">Garden operations workspace</p>
          <h1>{appConfig.config.appName}</h1>
          <p className="lead">
            Phase 2 foundation with routed placeholders, environment guardrails, and a verified
            browser smoke path.
          </p>
        </div>
        <div className="topbar-meta" aria-label="Runtime summary">
          <StatusPill label={appConfig.config.environment} tone="neutral" />
          <StatusPill label={`${appConfig.config.primaryBackend} target`} tone="green" />
          <StatusPill label={`${appConfig.config.aiProvider} reserved`} tone="amber" />
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar" aria-label="Primary navigation">
          <nav>
            <NavItem to="/" label="Dashboard" />
            <NavItem to="/plants" label="Plants" />
            <NavItem to="/settings" label="Settings" />
          </nav>

          <section className="sidebar-section">
            <h2>Runtime contract</h2>
            <dl className="definition-list">
              <Definition term="Location" value={appConfig.config.location} />
              <Definition term="Timezone" value={appConfig.config.timezone} />
              <Definition term="Hosting" value={appConfig.config.hostingProvider} />
              <Definition term="Storage" value={appConfig.config.primaryStorage} />
            </dl>
          </section>
        </aside>

        <section className="content">
          {appConfig.issues.length > 0 ? (
            <ConfigurationNotice config={appConfig.config} issues={appConfig.issues} />
          ) : null}

          <Routes>
            <Route path="/" element={<DashboardRoute config={appConfig.config} />} />
            <Route path="/plants" element={<PlantsRoute />} />
            <Route path="/settings" element={<SettingsRoute />} />
          </Routes>
        </section>
      </div>
    </main>
  );
}

function DashboardRoute({ config }: { config: PublicAppConfig }) {
  return (
    <section className="route-layout" aria-labelledby="dashboard-heading">
      <header className="section-header">
        <div>
          <p className="eyebrow">Foundation snapshot</p>
          <h2 id="dashboard-heading">Garden Tracker</h2>
        </div>
        <p className="section-note">Browser smoke target: {config.publicUrl}</p>
      </header>

      <div className="panel-grid">
        <article className="panel">
          <h3>Stack locked</h3>
          <ul className="bullet-list">
            <li>Vite + React + TypeScript with npm</li>
            <li>Vitest unit harness for source-level contracts</li>
            <li>Playwright smoke coverage against localhost:3000</li>
          </ul>
        </article>

        <article className="panel">
          <h3>Future phase seams</h3>
          <ul className="bullet-list">
            <li>Placeholder routes for dashboard, plants, and settings</li>
            <li>Environment contract reserved for Supabase and Gemini work</li>
            <li>No backend or AI integrations wired in this phase</li>
          </ul>
        </article>

        <article className="panel">
          <h3>Public env keys used now</h3>
          <ul className="bullet-list mono-list">
            {publicAppRuntimeContract.map((entry) => (
              <li key={entry.name}>{entry.name}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function PlantsRoute() {
  return (
    <section className="route-layout" aria-labelledby="plants-heading">
      <header className="section-header">
        <div>
          <p className="eyebrow">Placeholder route</p>
          <h2 id="plants-heading">Plant workspace</h2>
        </div>
        <p className="section-note">Reserved for plant matrix, detail views, and logging flows.</p>
      </header>

      <div className="placeholder-band">
        <p>Feature behavior stays out of scope in Phase 2.</p>
      </div>
    </section>
  );
}

function SettingsRoute() {
  return (
    <section className="route-layout" aria-labelledby="settings-heading">
      <header className="section-header">
        <div>
          <p className="eyebrow">Placeholder route</p>
          <h2 id="settings-heading">Environment and deployment notes</h2>
        </div>
        <p className="section-note">
          Secrets remain server-only and are not loaded into the client runtime.
        </p>
      </header>

      <div className="placeholder-band">
        <p>Supabase, Gemini, and storage integrations are intentionally deferred.</p>
      </div>
    </section>
  );
}

function ConfigurationNotice({
  config,
  issues,
}: {
  config: PublicAppConfig;
  issues: Array<{ key: string; message: string }>;
}) {
  return (
    <section className="notice" aria-labelledby="config-notice-heading">
      <div className="notice-header">
        <div>
          <p className="eyebrow">Configuration notice</p>
          <h2 id="config-notice-heading">Using fallback public runtime values</h2>
        </div>
        <StatusPill label={config.environment} tone="amber" />
      </div>

      <p className="notice-copy">
        The shell keeps rendering for local smoke testing, but these required values should come
        from <code>.env</code> before later phases expand runtime behavior.
      </p>

      <ul className="bullet-list">
        {issues.map((issue) => (
          <li key={issue.key}>{issue.message}</li>
        ))}
      </ul>
    </section>
  );
}

function NavItem({ label, to }: { label: string; to: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
    >
      {label}
    </NavLink>
  );
}

function StatusPill({ label, tone }: { label: string; tone: 'green' | 'amber' | 'neutral' }) {
  return <span className={`status-pill status-pill-${tone}`}>{label}</span>;
}

function Definition({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt>{term}</dt>
      <dd>{value}</dd>
    </div>
  );
}
