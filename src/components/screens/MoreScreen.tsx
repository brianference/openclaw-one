import { useState } from 'react'
import type { MoreView } from '../../data/seed'
import { TIER_INFO } from '../../data/seed'
import { DESIGN_META, chooseDesign } from '../../theme'
import {
  addAgent,
  addArtPrompt,
  addIdea,
  addKanban,
  addPhoneBooking,
  addTrip,
  addVaultItem,
  cycleIdeaStatus,
  moveKanban,
  pingAgent,
  removeAgent,
  resetDemo,
  setConnection,
  setTier,
} from '../../lib/store'
import { useDemoStore } from '../../lib/useDemoStore'
import { maskSecret } from '../../lib/security'
import type { ColumnId, DesignOption } from '../../data/seed'

export type MoreScreenProps = {
  view: MoreView
  onView: (view: MoreView) => void
  onOpenCoach?: () => void
}

const HUB: { view: MoreView; icon: string; title: string; sub: string }[] = [
  { view: 'kanban', icon: '📋', title: 'Kanban', sub: 'Board columns' },
  { view: 'ideas', icon: '💡', title: 'Ideas', sub: 'Capture & cycle status' },
  { view: 'trips', icon: '✈️', title: 'Trips', sub: 'Itineraries' },
  { view: 'vault', icon: '🛡️', title: 'Vault', sub: 'Demo secrets only' },
  { view: 'agents', icon: '⚡', title: 'Agents', sub: 'Ping simulated fleet' },
  { view: 'logs', icon: '📜', title: 'Logs', sub: 'Local activity stream' },
  { view: 'personas', icon: '🎭', title: 'Personas', sub: 'Built-in assistants' },
  { view: 'art', icon: '🎨', title: 'AI Art', sub: 'Mock generation' },
  { view: 'phone', icon: '📞', title: 'Phone booking', sub: 'Mock reservation' },
  { view: 'paywall', icon: '💎', title: 'Plans', sub: 'Subscription UI' },
  { view: 'connection', icon: '🔗', title: 'Connection', sub: 'Safe endpoints' },
  { view: 'design', icon: '✨', title: 'Design options', sub: '3 iPhone looks' },
]

/**
 * More hub + secondary MobileClaw surfaces.
 */
export function MoreScreen({ view, onView, onOpenCoach }: MoreScreenProps) {
  const s = useDemoStore()
  const [err, setErr] = useState<string | null>(null)
  const [revealId, setRevealId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function flash(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }

  if (view === 'hub') {
    return (
      <div className="screen">
        <p className="large-title">More</p>
        <p className="sub">
          {s.user.displayName} · {s.user.email}
        </p>
        {onOpenCoach ? (
          <button type="button" className="banner" onClick={onOpenCoach} style={{ width: 'calc(100% - 32px)', cursor: 'pointer', border: 'var(--hairline)', background: 'var(--surface)' }}>
            <span aria-hidden>✨</span>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <p className="row-title" style={{ margin: 0 }}>
                Setup coach
              </p>
              <p className="row-sub">Tour, auto-configure, and feature Q&A</p>
            </div>
            <span className="chev">›</span>
          </button>
        ) : null}
        <div className="card">
          {HUB.map((item) => (
            <button key={item.view} type="button" className="row" onClick={() => onView(item.view)}>
              <span className="row-ico">{item.icon}</span>
              <span>
                <p className="row-title">{item.title}</p>
                <p className="row-sub">{item.sub}</p>
              </span>
              <span className="chev">›</span>
            </button>
          ))}
        </div>
        <div className="fab-wrap">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              if (window.confirm('Reset all local demo data?')) {
                resetDemo()
                flash('Demo reset')
              }
            }}
          >
            Reset demo data
          </button>
        </div>
        <p className="footer-note">
          Mirrors{' '}
          <a href="https://github.com/brianference/mobileclaw" target="_blank" rel="noreferrer">
            mobileclaw
          </a>{' '}
          without real credentials.
        </p>
        {toast ? <div className="toast" role="status">{toast}</div> : null}
      </div>
    )
  }

  const back = (
    <button type="button" className="chip" style={{ margin: '8px 16px' }} onClick={() => onView('hub')}>
      ← More
    </button>
  )

  if (view === 'design') {
    return (
      <div className="screen">
        {back}
        <p className="large-title">Design</p>
        <p className="sub">Pick one of three iPhone-modern systems</p>
        <div className="design-grid">
          {(Object.keys(DESIGN_META) as DesignOption[]).map((id) => {
            const meta = DESIGN_META[id]
            return (
              <button
                key={id}
                type="button"
                className={`design-opt${s.design === id ? ' is-on' : ''}`}
                onClick={() => {
                  chooseDesign(id)
                  flash(`${meta.name} applied`)
                }}
              >
                <strong>{meta.name}</strong>
                <span>
                  {meta.tagline}. {meta.blurb}
                </span>
              </button>
            )
          })}
        </div>
        {toast ? <div className="toast" role="status">{toast}</div> : null}
      </div>
    )
  }

  if (view === 'kanban') {
    const cols: { id: ColumnId; label: string }[] = [
      { id: 'backlog', label: 'Backlog' },
      { id: 'next-up', label: 'Next' },
      { id: 'progress', label: 'Progress' },
      { id: 'done', label: 'Done' },
    ]
    const nextCol = (id: ColumnId): ColumnId => {
      const order: ColumnId[] = ['backlog', 'next-up', 'progress', 'done']
      return order[(order.indexOf(id) + 1) % order.length]
    }
    return (
      <div className="screen">
        {back}
        <p className="large-title">Kanban</p>
        <div className="board">
          {cols.map((col) => (
            <div key={col.id} className="col">
              <h4>{col.label}</h4>
              {s.kanban
                .filter((k) => k.columnId === col.id)
                .map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    className="k-card"
                    onClick={() => moveKanban(card.id, nextCol(card.columnId))}
                  >
                    {card.title}
                    <small>
                      {card.priority} · tap to advance
                    </small>
                  </button>
                ))}
            </div>
          ))}
        </div>
        <div className="fab-wrap">
          <button
            type="button"
            className="btn"
            onClick={() => {
              const title = window.prompt('Card title')
              if (title) addKanban(title)
            }}
          >
            + Card
          </button>
        </div>
      </div>
    )
  }

  if (view === 'ideas') {
    return (
      <div className="screen">
        {back}
        <p className="large-title">Ideas</p>
        <div className="stack">
          {s.ideas.map((idea) => (
            <button
              key={idea.id}
              type="button"
              className="item"
              style={{ borderLeftColor: 'var(--primary)', width: '100%', cursor: 'pointer' }}
              onClick={() => cycleIdeaStatus(idea.id)}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>{idea.title}</p>
                <p className="muted">{idea.description}</p>
                <p className="muted">
                  {idea.status} · {idea.priority}
                </p>
              </div>
            </button>
          ))}
        </div>
        <div className="fab-wrap">
          <button
            type="button"
            className="btn"
            onClick={() => {
              const title = window.prompt('Idea title')
              if (!title) return
              const description = window.prompt('Description') || ''
              addIdea(title, description)
            }}
          >
            + Idea
          </button>
        </div>
      </div>
    )
  }

  if (view === 'trips') {
    return (
      <div className="screen">
        {back}
        <p className="large-title">Trips</p>
        <div className="stack">
          {s.trips.map((trip) => (
            <div key={trip.id} className="item" style={{ borderLeftColor: 'var(--accent)', flexDirection: 'column' }}>
              <div style={{ fontSize: 28 }}>{trip.emoji}</div>
              <strong>{trip.title}</strong>
              <span className="muted">
                {trip.destination} · {trip.status} · budget ${trip.budget}
              </span>
              <div className="stack" style={{ padding: 0, width: '100%' }}>
                {s.itinerary
                  .filter((i) => i.tripId === trip.id)
                  .map((item) => (
                    <div key={item.id} className="muted">
                      Day {item.dayNumber} {item.timeSlot} — {item.activity} ({item.location})
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <div className="fab-wrap">
          <button
            type="button"
            className="btn"
            onClick={() => {
              const title = window.prompt('Trip title')
              if (!title) return
              const destination = window.prompt('Destination') || 'TBD'
              addTrip(title, destination)
            }}
          >
            + Trip
          </button>
        </div>
      </div>
    )
  }

  if (view === 'vault') {
    return (
      <div className="screen">
        {back}
        <p className="large-title">Vault</p>
        <p className="sub">Demo values only · real secrets rejected</p>
        {err ? <p className="err pad">{err}</p> : null}
        <div className="stack">
          {s.vault.map((item) => (
            <div key={item.id} className="item" style={{ borderLeftColor: 'var(--success)', flexDirection: 'column' }}>
              <strong>{item.name}</strong>
              <span className="muted">{item.category}</span>
              <code className="mask">
                {revealId === item.id ? item.demoValue : maskSecret(item.demoValue)}
              </code>
              <button
                type="button"
                className="reveal"
                onClick={() => setRevealId(revealId === item.id ? null : item.id)}
              >
                {revealId === item.id ? 'Hide' : 'Reveal demo value'}
              </button>
              {item.notes ? <span className="muted">{item.notes}</span> : null}
            </div>
          ))}
        </div>
        <div className="fab-wrap">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setErr(null)
              const name = window.prompt('Item name')
              if (!name) return
              const demoValue = window.prompt('Demo value (use demo-* prefix; real secrets blocked)') || ''
              const result = addVaultItem(name, demoValue, 'other')
              if (!result.ok) setErr(result.error)
              else flash('Vault item saved locally')
            }}
          >
            + Vault item
          </button>
        </div>
        {toast ? <div className="toast" role="status">{toast}</div> : null}
      </div>
    )
  }

  if (view === 'agents') {
    return (
      <div className="screen">
        {back}
        <p className="large-title">Agents</p>
        <div className="stack">
          {s.agents.map((agent) => (
            <div key={agent.id} className="item" style={{ borderLeftColor: 'var(--primary)', flexDirection: 'column' }}>
              <strong>{agent.name}</strong>
              <span className="muted">
                {agent.agentType} · {agent.status}
              </span>
              <code className="muted">{agent.endpoint}</code>
              <span className="muted">
                Last ping: {agent.lastPing ? new Date(agent.lastPing).toLocaleTimeString() : 'never'}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn" onClick={() => pingAgent(agent.id)}>
                  Ping
                </button>
                <button type="button" className="btn btn-danger" onClick={() => removeAgent(agent.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="fab-wrap">
          <button
            type="button"
            className="btn"
            onClick={() => {
              const name = window.prompt('Agent name')
              if (name) addAgent(name, 'custom')
            }}
          >
            + Agent
          </button>
        </div>
      </div>
    )
  }

  if (view === 'logs') {
    return (
      <div className="screen">
        {back}
        <p className="large-title">Logs</p>
        <div className="card">
          {s.logs.map((log) => (
            <div key={log.id} className="log-line">
              <span className={`lvl lvl-${log.level}`}>{log.level}</span>
              <strong>{log.category}</strong> — {log.message}
              <div className="muted">{new Date(log.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (view === 'personas') {
    return (
      <div className="screen">
        {back}
        <p className="large-title">Personas</p>
        <div className="card">
          {s.personas.map((p) => (
            <div key={p.id} className="row" style={{ cursor: 'default' }}>
              <span className="row-ico">{p.emoji}</span>
              <span>
                <p className="row-title">{p.name}</p>
                <p className="row-sub">
                  {p.description} · {p.model}
                </p>
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (view === 'art') {
    return (
      <div className="screen">
        {back}
        <p className="large-title">AI Art</p>
        <p className="sub">Mock studio — no external image API on the public site</p>
        <div className="stack">
          {s.artHistory.map((art) => (
            <div key={art.id} className="item" style={{ borderLeftColor: '#8b5cf6', flexDirection: 'column' }}>
              <div
                style={{
                  height: 120,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, var(--primary-soft), color-mix(in srgb, var(--accent) 30%, transparent))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 40,
                }}
              >
                🖼️
              </div>
              <strong>{art.prompt}</strong>
              <span className="muted">{new Date(art.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="fab-wrap">
          <button
            type="button"
            className="btn"
            onClick={() => {
              const prompt = window.prompt('Art prompt')
              if (prompt) {
                addArtPrompt(prompt)
                flash('Demo artwork queued')
              }
            }}
          >
            Generate (mock)
          </button>
        </div>
        {toast ? <div className="toast" role="status">{toast}</div> : null}
      </div>
    )
  }

  if (view === 'phone') {
    return (
      <div className="screen">
        {back}
        <p className="large-title">Phone booking</p>
        <p className="sub">UI-only reservation demo</p>
        <div className="stack">
          {s.phoneBookings.map((b) => (
            <div key={b.id} className="item" style={{ borderLeftColor: 'var(--accent)', flexDirection: 'column' }}>
              <strong>{b.venue}</strong>
              <span className="muted">
                Party of {b.partySize} · {b.when}
              </span>
              <span className="ok">{b.status}</span>
            </div>
          ))}
        </div>
        <div className="fab-wrap">
          <button
            type="button"
            className="btn"
            onClick={() => {
              const venue = window.prompt('Venue name')
              if (!venue) return
              const party = Number(window.prompt('Party size') || '2')
              const when = window.prompt('When') || 'Tonight'
              addPhoneBooking(venue, party, when)
              flash('Demo booking saved')
            }}
          >
            Book table (mock)
          </button>
        </div>
        {toast ? <div className="toast" role="status">{toast}</div> : null}
      </div>
    )
  }

  if (view === 'paywall') {
    return (
      <div className="screen">
        {back}
        <p className="large-title">Plans</p>
        <p className="sub">UI only — no real payments on the public site</p>
        <div className="stack">
          {(Object.keys(TIER_INFO) as Array<keyof typeof TIER_INFO>).map((tier) => {
            const info = TIER_INFO[tier]
            const active = s.user.tier === tier
            return (
              <button
                key={tier}
                type="button"
                className="item"
                style={{
                  borderLeftColor: active ? 'var(--primary)' : 'var(--border)',
                  width: '100%',
                  cursor: 'pointer',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
                onClick={() => {
                  setTier(tier)
                  flash(`${info.name} selected (demo)`)
                }}
              >
                <strong>
                  {info.name} · {info.price}/mo
                </strong>
                <span className="muted">
                  {info.credits === -1 ? 'Unlimited' : info.credits} credits
                </span>
                {active ? <span className="ok">Current</span> : null}
              </button>
            )
          })}
        </div>
        {toast ? <div className="toast" role="status">{toast}</div> : null}
      </div>
    )
  }

  if (view === 'connection') {
    return (
      <div className="screen">
        {back}
        <p className="large-title">Connection</p>
        <p className="sub">Safe demo endpoints only — tokens blocked</p>
        {err ? <p className="err pad">{err}</p> : null}
        <div className="card card-pad">
          <div className="field">
            <label htmlFor="conn-enabled">Use custom endpoint</label>
            <input
              id="conn-enabled"
              type="checkbox"
              checked={s.connection.enabled}
              onChange={(e) => {
                const result = setConnection(e.target.checked, s.connection.type, s.connection.url)
                if (!result.ok) setErr(result.error)
              }}
            />
          </div>
          <div className="field">
            <label htmlFor="conn-type">Type</label>
            <select
              id="conn-type"
              value={s.connection.type}
              onChange={(e) => {
                const type = e.target.value as typeof s.connection.type
                const result = setConnection(s.connection.enabled, type, s.connection.url)
                if (!result.ok) setErr(result.error)
              }}
            >
              <option value="default">Default</option>
              <option value="local">Local</option>
              <option value="cloud">Cloud</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="conn-url">URL</label>
            <input
              id="conn-url"
              value={s.connection.url}
              onChange={(e) => {
                setErr(null)
                const result = setConnection(s.connection.enabled, s.connection.type, e.target.value)
                if (!result.ok) setErr(result.error)
              }}
            />
          </div>
          <p className="muted">Tokens and credentialed URLs are rejected. Prefer ws://localhost:… for demos.</p>
        </div>
      </div>
    )
  }

  return null
}
