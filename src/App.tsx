import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import './styles.css'
import { initTheme, toggleTheme, getTheme } from './theme'
import { ChatDock } from './ChatDock'
import { seedContext } from './seedContext'
import { DEMO } from './data'

const FEATURES = [
  { t: 'Product narrative', d: 'Sales-ready homepage that explains mobile agent ops clearly.' },
  { t: 'Tabbed demos', d: 'Chat, tasks, vault, and security scan as separate surfaces.' },
  { t: 'Native vs web labels', d: 'Honest about what runs in Expo vs this browser demo.' },
  { t: 'Security checklist', d: 'Device hygiene patterns as a guided UI.' },
  { t: 'Companion chat', d: 'Ask how to connect a gateway — answers from the docs graph.' },
  { t: 'Theme toggle', d: 'Light/dark polished for screenshot parity.' },
]

const TABS = ['tasks', 'vault', 'scan'] as const

function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme())
  return (
    <button type="button" className="theme-toggle" aria-label="Toggle theme" onClick={() => setTheme(toggleTheme())}>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false)
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div id="main-content" className={`shell${chatOpen ? ' shell--chat' : ''}`}>
      <header className="topbar">
        <Link to="/" className="brand">
          OpenClaw One
        </Link>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/app">Demo</NavLink>
          <NavLink to="/features">Features</NavLink>
        </nav>
        <ThemeToggle />
      </header>
      <main>{children}</main>
      <ChatDock open={chatOpen} onOpenChange={setChatOpen} context={seedContext()} product="openclaw-one" />
      <footer className="footer">
        <p>
          Public face of{' '}
          <a href="https://github.com/brianference/openclaw-mobile" target="_blank" rel="noreferrer">
            openclaw-mobile
          </a>{' '}
          ·{' '}
          <a href="https://github.com/brianference/openclaw-one" target="_blank" rel="noreferrer">
            openclaw-one
          </a>
        </p>
              <p className="recruiter-strip">Stack: TypeScript · React · Vite · Cloudflare Pages · Expo · GitHub</p>
      </footer>
    </div>
    </>
  )
}

function Home() {
  return (
    <Shell>
      <section className="hero">
        <p className="kicker">OpenClaw One · mobile command for AI agents</p>
        <h1>Chat, tasks, vault, scan — on your phone.</h1>
        <p className="lede">
          Product site for the Expo OpenClaw client. This web app demos the surfaces; the native repo is the real
          mobile binary.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" to="/app">
            Open web demo
          </Link>
          <a className="btn btn-ghost" href="https://github.com/brianference/openclaw-mobile" target="_blank" rel="noreferrer">
            Native source
          </a>
        </div>
        <ul className="hero-points">
          <li>Web demo</li>
          <li>Native Expo</li>
          <li>Security-minded</li>
          <li>Light & dark</li>
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
    </Shell>
  )
}

function FeaturesPage() {
  return (
    <Shell>
      <section className="panel">
        <h1>Features</h1>
        <div className="grid-2">
          {FEATURES.map((f) => (
            <article key={f.t} className="card">
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </article>
          ))}
        </div>
      </section>
    </Shell>
  )
}

function ProductApp() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('tasks')
  const cols = ['todo', 'doing', 'done'] as const

  return (
    <section className="panel">
      <div className="chips">
        <span className="chip chip-warn">Web demo</span>
        <span className="chip">Native: Expo / openclaw-mobile</span>
      </div>
      <h1>Mobile companion demos</h1>
      <p className="lede">Switch surfaces below. Chat is the dock FAB — same assistant as production product framing.</p>

      <div className="tabs" role="tablist" aria-label="Demo surfaces">
        {TABS.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} className={`tab${tab === t ? ' is-active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'tasks' && (
        <div className="kanban">
          {cols.map((col) => (
            <div key={col} className="kanban-col">
              <h3>{col}</h3>
              {DEMO.tasks
                .filter((t) => t.col === col)
                .map((t) => (
                  <div key={t.id} className="card card-slim">
                    {t.title}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}

      {tab === 'vault' && (
        <div className="card">
          <h2>Secrets vault (demo)</h2>
          <p className="lede">Illustrates local encrypted storage patterns. No real secrets are stored in this site.</p>
          <ul className="check-list">
            <li>AES-style envelope on device (native Secure Store)</li>
            <li>Biometric unlock optional</li>
            <li>Never sync raw keys to the server</li>
          </ul>
          <p className="meta">This web card is UI only — implement secrets only in the Expo app.</p>
        </div>
      )}

      {tab === 'scan' && (
        <>
          <h2>Security checklist</h2>
          <ul className="check-list">
            {DEMO.checks.map((c) => (
              <li key={c.id}>
                <span className={c.ok ? 'ok' : 'bad'}>{c.ok ? '✓' : '!'}</span> {c.label}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="sticky-cta">
        <a className="btn btn-primary" href="https://github.com/brianference/openclaw-mobile" target="_blank" rel="noreferrer">
          Get native app source
        </a>
        <button type="button" className="btn btn-ghost" onClick={() => document.querySelector<HTMLButtonElement>('.chat-fab')?.click()}>
          Ask setup chat
        </button>
      </div>
    </section>
  )
}

function AppPage() {
  return (
    <Shell>
      <ProductApp />
    </Shell>
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
