import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import './styles.css'
import { initTheme, toggleTheme, getTheme } from './theme'
import { ChatDock } from './ChatDock'
import { seedContext } from './seedContext'
import { DEMO } from './data'

const FEATURES = [{"t": "Product narrative", "d": "Sales-ready homepage that explains mobile agent ops clearly."}, {"t": "Task board demo", "d": "Kanban columns that mirror the native app."}, {"t": "Vault UX demo", "d": "Illustrates AES-style local secrets flow without storing real keys in the cloud."}, {"t": "Security checklist", "d": "Network and device hygiene checks as a guided UI."}, {"t": "Companion chat", "d": "Ask how to connect a gateway \u2014 answers from the docs graph."}, {"t": "Theme toggle", "d": "Light/dark polished for App Store screenshots parity."}] as { t: string; d: string }[]
const INTEGRATIONS = [{"t": "Expo / React Native app", "d": "iOS & Android client via EAS"}, {"t": "WebSocket agent gateway", "d": "Real-time chat with your backend"}, {"t": "Secure Store + biometrics", "d": "Device-bound secrets patterns"}, {"t": "OpenAI-assisted onboarding", "d": "Setup chat on this site"}] as { t: string; d: string }[]
const RECRUITER = ["Mobile + web: Expo RN product with matching marketing app", "Security-minded UX: vault, biometrics, threat checklist", "Real-time systems: WebSocket gateway integration story", "Design system: consistent tokens, a11y-sized controls"] as string[]
const QUICK = ["Deep link from site into Expo Go / TestFlight", "Live gateway status badge", "Push-notification preference mock", "Share encrypted backup flow docs"] as string[]

function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme())
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Toggle light and dark mode"
      onClick={() => setTheme(toggleTheme())}
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false)
  return (
    <div className={`shell${chatOpen ? ' shell--chat' : ''}`}>
      <header className="topbar">
        <Link to="/" className="brand">OpenClaw One</Link>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/app">App</NavLink>
          <NavLink to="/features">Features</NavLink>
        </nav>
        <ThemeToggle />
      </header>
      <main>{children}</main>
      <ChatDock open={chatOpen} onOpenChange={setChatOpen} context={seedContext()} product="openclaw-one" />
      <footer className="footer">
        <p>
          OpenClaw One · public portfolio product ·{' '}
          <a href="https://github.com/brianference/openclaw-one" target="_blank" rel="noreferrer">GitHub</a>
        </p>
        <p className="fine">Built for real use and for hiring conversations — stack, constraints, and integrations included.</p>
      </footer>
    </div>
  )
}

function Home() {
  return (
    <Shell>
      <section className="hero">
        <p className="kicker">OpenClaw One · the public face of OpenClaw Mobile</p>
        <h1>Mobile command for AI agents — chat, tasks, vault, scan.</h1>
        <p className="lede">Product site and interactive web companion for OpenClaw Mobile: AI chat, kanban, encrypted vault concepts, and device security checks.</p>
        <div className="cta-row">
          <Link className="btn btn-primary" to="/app">Open the app</Link>
          <Link className="btn btn-ghost" to="/features">See features</Link>
        </div>
        <ul className="hero-points">
          <li>Light & dark mode</li>
          <li>Grounded AI chat</li>
          <li>No account required</li>
          <li>Cloudflare Pages ready</li>
        </ul>
      </section>
      <section className="grid-3">
        {FEATURES.slice(0, 3).map((f) => (
          <article key={f.t} className="card">
            <h3>{f.t}</h3>
            <p>{f.d}</p>
          </article>
        ))}
      </section>
      <section className="panel">
        <h2>Integrations</h2>
        <div className="grid-2">
          {INTEGRATIONS.map((i) => (
            <div key={i.t} className="card card-slim">
              <h3>{i.t}</h3>
              <p>{i.d}</p>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  )
}

function FeaturesPage() {
  return (
    <Shell>
      <section className="panel">
        <h1>Features</h1>
        <p className="lede">Product depth first — the same signals recruiters and technical founders look for.</p>
        <div className="grid-2">
          {FEATURES.map((f) => (
            <article key={f.t} className="card">
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="panel subtle">
        <h2>Engineering signals</h2>
        <ul className="check-list">
          {RECRUITER.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <h2>Quick wins next</h2>
        <ul className="check-list">
          {QUICK.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </section>
    </Shell>
  )
}

function AppPage() {
  return (
    <Shell>
      <ProductApp />
    </Shell>
  )
}


function ProductApp() {
  const cols = ['todo', 'doing', 'done'] as const
  return (
    <section className="panel">
      <h1>Mobile companion demos</h1>
      <p className="lede">Web previews of OpenClaw Mobile surfaces. Native app: <a href="https://github.com/brianference/openclaw-mobile" target="_blank" rel="noreferrer">openclaw-mobile</a></p>
      <h2>Task board</h2>
      <div className="kanban">
        {cols.map((col) => (
          <div key={col} className="kanban-col">
            <h3>{col}</h3>
            {DEMO.tasks.filter((t) => t.col === col).map((t) => (
              <div key={t.id} className="card card-slim">{t.title}</div>
            ))}
          </div>
        ))}
      </div>
      <h2>Security checklist</h2>
      <ul className="check-list">
        {DEMO.checks.map((c) => (
          <li key={c.id}><span className={c.ok ? 'ok' : 'bad'}>{c.ok ? '✓' : '!'}</span> {c.label}</li>
        ))}
      </ul>
    </section>
  )
}


export default function App() {
  useEffect(() => {
    initTheme()
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/features" element={<FeaturesPage />} />
      </Routes>
    </BrowserRouter>
  )
}
