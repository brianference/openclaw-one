import type { ReactNode } from 'react'
import type { TabId } from '../data/seed'
import { DESIGN_META } from '../theme'
import type { DesignOption, ThemeMode } from '../data/seed'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'tasks', label: 'Tasks', icon: '✓' },
  { id: 'brain', label: 'Brain', icon: '🧠' },
  { id: 'more', label: 'More', icon: '•••' },
]

const TITLES: Record<TabId, string> = {
  home: 'Home',
  chat: 'Chat',
  tasks: 'Tasks',
  brain: 'Brain',
  more: 'More',
}

export type PhoneShellProps = {
  tab: TabId
  title?: string
  onTabChange: (tab: TabId) => void
  onToggleTheme: () => void
  onOpenDesign: () => void
  onOpenCoach?: () => void
  themeMode: ThemeMode
  design: DesignOption
  children: ReactNode
}

/**
 * iPhone-style chrome + desktop side rails for feature map and design summary.
 */
export function PhoneShell({
  tab,
  title,
  onTabChange,
  onToggleTheme,
  onOpenDesign,
  onOpenCoach,
  themeMode,
  design,
  children,
}: PhoneShellProps) {
  const meta = DESIGN_META[design]

  return (
    <div className="app-frame">
      <a className="skip-link" href="#phone-main">
        Skip to content
      </a>

      <aside className="desktop-rail" aria-label="About this demo">
        <div>
          <h2>MobileClaw</h2>
          <p>Public web demo of the native app — anonymized data, no real secrets.</p>
        </div>
        <div className="desktop-card">
          <h3>Included surfaces</h3>
          <ul>
            <li>Home, Chat, Tasks, Brain</li>
            <li>Kanban, Ideas, Trips</li>
            <li>Vault (demo values only)</li>
            <li>Agents, Logs, Personas</li>
            <li>AI Art & phone booking (mock)</li>
            <li>Paywall & connection UI</li>
          </ul>
        </div>
        <div className="desktop-card">
          <h3>Active design</h3>
          <p>
            <strong>{meta.name}</strong> — {meta.tagline}
          </p>
          <p style={{ marginTop: 8 }}>{meta.blurb}</p>
          <button type="button" className="btn" style={{ marginTop: 12, width: '100%' }} onClick={onOpenDesign}>
            Compare 3 designs
          </button>
          {onOpenCoach ? (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ marginTop: 8, width: '100%' }}
              onClick={onOpenCoach}
            >
              Open setup coach
            </button>
          ) : null}
        </div>
        <div className="desktop-card">
          <h3>Feature guide</h3>
          <p>
            Full docs live in the repo at <code>docs/FEATURES.md</code>. The setup coach can also walk
            you through every surface.
          </p>
        </div>
      </aside>

      <div className="phone" role="application" aria-label="MobileClaw public demo">
        <div className="notch" aria-hidden>
          <div className="notch-bar" />
        </div>
        <header className="topbar">
          <h1>{title || TITLES[tab]}</h1>
          <div className="top-actions">
            {onOpenCoach ? (
              <button type="button" className="icon-btn" aria-label="Setup coach" onClick={onOpenCoach}>
                ✨
              </button>
            ) : null}
            <button type="button" className="icon-btn" aria-label="Design options" onClick={onOpenDesign}>
              🎨
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Toggle light and dark mode"
              onClick={onToggleTheme}
            >
              {themeMode === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </header>
        <main id="phone-main" className="body" tabIndex={-1}>
          {children}
        </main>
        <nav
          className="tabbar"
          aria-label="Primary"
          onKeyDown={(e) => {
            const idx = TABS.findIndex((t) => t.id === tab)
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              e.preventDefault()
              onTabChange(TABS[(idx + 1) % TABS.length].id)
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault()
              onTabChange(TABS[(idx - 1 + TABS.length) % TABS.length].id)
            }
            if (e.key === 'Home') {
              e.preventDefault()
              onTabChange(TABS[0].id)
            }
            if (e.key === 'End') {
              e.preventDefault()
              onTabChange(TABS[TABS.length - 1].id)
            }
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              className={`tab${tab === t.id ? ' is-active' : ''}`}
              aria-selected={tab === t.id}
              aria-current={tab === t.id ? 'page' : undefined}
              tabIndex={tab === t.id ? 0 : -1}
              onClick={() => onTabChange(t.id)}
            >
              <span className="tab-ico" aria-hidden>
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <aside className="desktop-rail" aria-label="Security notes">
        <div className="desktop-card">
          <h3>Public safety</h3>
          <ul>
            <li>No Supabase keys in the browser</li>
            <li>Vault rejects real-looking secrets</li>
            <li>Optional WebCrypto vault lock</li>
            <li>Chat redacts credential patterns</li>
            <li>Demo user only (Alex)</li>
          </ul>
        </div>
        <div className="desktop-card">
          <h3>Deep links</h3>
          <ul>
            <li>
              <code>/chat</code> · <code>/tasks</code>
            </li>
            <li>
              <code>/t/vault</code> · <code>/t/kanban</code>
            </li>
            <li>
              <code>/?coach=1</code> opens setup coach
            </li>
          </ul>
        </div>
        <div className="desktop-card">
          <h3>Native source</h3>
          <p>
            Feature parity with{' '}
            <a href="https://github.com/brianference/mobileclaw" target="_blank" rel="noreferrer">
              mobileclaw
            </a>
            , adapted for a public product site.
          </p>
        </div>
      </aside>
    </div>
  )
}
