import type { ReactNode } from 'react'
import type { ButtonStyle, TabId } from '../data/seed'
import { BUTTON_META, DESIGN_META } from '../theme'
import type { ThemeMode } from '../data/seed'

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
  onOpenCoach?: () => void
  onOpenAppearance?: () => void
  themeMode: ThemeMode
  buttonStyle: ButtonStyle
  children: ReactNode
}

/**
 * iPhone-style chrome + desktop rails. No design-compare in primary nav.
 */
export function PhoneShell({
  tab,
  title,
  onTabChange,
  onToggleTheme,
  onOpenCoach,
  onOpenAppearance,
  themeMode,
  buttonStyle,
  children,
}: PhoneShellProps) {
  const look = DESIGN_META.oled
  const btn = BUTTON_META[buttonStyle]

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
          <h3>Surfaces</h3>
          <ul>
            <li>Home, Chat, Tasks, Brain</li>
            <li>Kanban, Ideas, Trips, Vault</li>
            <li>Agents, Logs, Personas</li>
            <li>Setup coach · PWA offline shell</li>
          </ul>
        </div>
        <div className="desktop-card">
          <h3>Look</h3>
          <p>
            <strong>{look.name}</strong>
          </p>
          <p style={{ marginTop: 6 }}>{look.blurb}</p>
          <p style={{ marginTop: 10 }}>
            Buttons: <strong>{btn.name}</strong> — {btn.tagline}
          </p>
          {onOpenAppearance ? (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ marginTop: 12, width: '100%' }}
              onClick={onOpenAppearance}
            >
              Button styles
            </button>
          ) : null}
          {onOpenCoach ? (
            <button
              type="button"
              className="btn"
              style={{ marginTop: 8, width: '100%' }}
              onClick={onOpenCoach}
            >
              Setup coach
            </button>
          ) : null}
        </div>
        <div className="desktop-card">
          <h3>Feature guide</h3>
          <p>
            See <code>docs/FEATURES.md</code> or ask the setup coach.
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
          role="tablist"
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
          </ul>
        </div>
        <div className="desktop-card">
          <h3>Deep links</h3>
          <ul>
            <li>
              <code>/chat</code> · <code>/tasks</code>
            </li>
            <li>
              <code>/t/vault</code> · <code>/t/appearance</code>
            </li>
            <li>
              <code>/?coach=1</code>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  )
}
