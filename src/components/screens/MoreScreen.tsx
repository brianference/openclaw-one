import { useEffect, useState, type DragEvent, type ReactNode } from 'react'
import type { MoreView, VaultCategory } from '../../data/seed'
import { TIER_INFO } from '../../data/seed'
import { BUTTON_META, chooseButtonStyle } from '../../theme'
import type { ButtonStyle } from '../../data/seed'
import {
  addAgent,
  addArtPrompt,
  addIdea,
  addKanban,
  addPhoneBooking,
  addTrip,
  addVaultItem,
  clearVaultMemory,
  cycleIdeaStatus,
  exportVaultJson,
  importVaultJson,
  moveKanban,
  pingAgent,
  removeAgent,
  resetDemo,
  setConnection,
  setTier,
} from '../../lib/store'
import { useDemoStore } from '../../lib/useDemoStore'
import { maskSecret } from '../../lib/security'
import type { ColumnId } from '../../data/seed'
import { Modal } from '../ui/Modal'
import { useToast } from '../ui/Toast'
import {
  clearVaultMeta,
  isVaultLockedOnDisk,
  lockVaultPayload,
  markVaultLocked,
  unlockVaultPayload,
} from '../../lib/vaultCrypto'
import { HUB_ICONS, Icon, IconBadge } from '../icons'

export type MoreScreenProps = {
  view: MoreView
  onView: (view: MoreView) => void
  onOpenCoach?: () => void
}

const HUB: {
  view: MoreView
  title: string
  sub: string
  tone?: 'primary' | 'accent' | 'success' | 'warn' | 'muted'
}[] = [
  { view: 'kanban', title: 'Kanban', sub: 'Drag cards between columns', tone: 'primary' },
  { view: 'ideas', title: 'Ideas', sub: 'Capture & cycle status', tone: 'warn' },
  { view: 'trips', title: 'Trips', sub: 'Itineraries', tone: 'accent' },
  { view: 'vault', title: 'Vault', sub: 'Demo secrets + optional lock', tone: 'success' },
  { view: 'agents', title: 'Agents', sub: 'Ping simulated fleet', tone: 'primary' },
  { view: 'logs', title: 'Logs', sub: 'Local activity stream', tone: 'muted' },
  { view: 'personas', title: 'Personas', sub: 'Built-in assistants', tone: 'accent' },
  { view: 'art', title: 'AI Art', sub: 'Mock generation', tone: 'warn' },
  { view: 'phone', title: 'Phone booking', sub: 'Mock reservation', tone: 'primary' },
  { view: 'paywall', title: 'Plans', sub: 'Subscription UI', tone: 'accent' },
  { view: 'connection', title: 'Connection', sub: 'Safe endpoints', tone: 'muted' },
  { view: 'appearance', title: 'Appearance', sub: '3 button systems', tone: 'primary' },
]

type CreateKind = 'kanban' | 'idea' | 'trip' | 'vault' | 'agent' | 'art' | 'phone' | null

/**
 * More hub + secondary MobileClaw surfaces.
 */
export function MoreScreen({ view, onView, onOpenCoach }: MoreScreenProps) {
  const s = useDemoStore()
  const { toast } = useToast()
  const [err, setErr] = useState<string | null>(null)
  const [revealId, setRevealId] = useState<string | null>(null)
  const [create, setCreate] = useState<CreateKind>(null)
  const [fieldA, setFieldA] = useState('')
  const [fieldB, setFieldB] = useState('')
  const [fieldC, setFieldC] = useState('2')
  const [vaultCat, setVaultCat] = useState<VaultCategory>('other')
  const [dragId, setDragId] = useState<string | null>(null)
  const [kanbanHint, setKanbanHint] = useState(() => {
    try {
      return localStorage.getItem('mobileclaw-kanban-hint-dismissed') !== '1'
    } catch {
      return true
    }
  })
  const [vaultSessionUnlocked, setVaultSessionUnlocked] = useState(!isVaultLockedOnDisk())
  const [passphrase, setPassphrase] = useState('')
  const [cryptoBusy, setCryptoBusy] = useState(false)

  useEffect(() => {
    setVaultSessionUnlocked(!isVaultLockedOnDisk())
  }, [view])

  function openCreate(kind: CreateKind) {
    setFieldA('')
    setFieldB('')
    setFieldC(kind === 'phone' ? '2' : '')
    setVaultCat('other')
    setErr(null)
    setCreate(kind)
  }

  function submitCreate() {
    setErr(null)
    if (create === 'kanban') {
      if (!fieldA.trim()) return
      addKanban(fieldA)
      toast('Card added')
    } else if (create === 'idea') {
      if (!fieldA.trim()) return
      addIdea(fieldA, fieldB)
      toast('Idea added')
    } else if (create === 'trip') {
      if (!fieldA.trim()) return
      addTrip(fieldA, fieldB || 'TBD')
      toast('Trip added')
    } else if (create === 'vault') {
      const result = addVaultItem(fieldA, fieldB, vaultCat)
      if (!result.ok) {
        setErr(result.error)
        return
      }
      toast('Vault item saved')
    } else if (create === 'agent') {
      if (!fieldA.trim()) return
      addAgent(fieldA, fieldB || 'custom')
      toast('Agent added')
    } else if (create === 'art') {
      if (!fieldA.trim()) return
      addArtPrompt(fieldA)
      toast('Demo artwork queued')
    } else if (create === 'phone') {
      if (!fieldA.trim()) return
      addPhoneBooking(fieldA, Number(fieldC) || 2, fieldB || 'Tonight')
      toast('Demo booking saved')
    }
    setCreate(null)
  }

  async function lockVault() {
    setCryptoBusy(true)
    setErr(null)
    try {
      await lockVaultPayload(passphrase, exportVaultJson())
      clearVaultMemory()
      setVaultSessionUnlocked(false)
      setPassphrase('')
      toast('Vault locked with passphrase (local only)')
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Lock failed')
    } finally {
      setCryptoBusy(false)
    }
  }

  async function unlockVault() {
    setCryptoBusy(true)
    setErr(null)
    try {
      const json = await unlockVaultPayload(passphrase)
      importVaultJson(json)
      setVaultSessionUnlocked(true)
      setPassphrase('')
      toast('Vault unlocked')
    } catch {
      setErr('Wrong passphrase or corrupted vault lock')
    } finally {
      setCryptoBusy(false)
    }
  }

  function sessionLock() {
    markVaultLocked()
    clearVaultMemory()
    setVaultSessionUnlocked(false)
    toast('Vault locked for this session')
  }

  if (view === 'hub') {
    return (
      <div className="screen">
        <p className="large-title">More</p>
        <p className="sub">
          {s.user.displayName} · {s.user.email}
        </p>
        {onOpenCoach ? (
          <button
            type="button"
            className="banner"
            onClick={onOpenCoach}
            style={{
              width: 'calc(100% - 32px)',
              cursor: 'pointer',
              border: 'var(--hairline)',
              background: 'var(--surface)',
            }}
          >
            <IconBadge name="sparkles" />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <p className="row-title" style={{ margin: 0 }}>
                Setup coach
              </p>
              <p className="row-sub">Tour, auto-configure, and feature Q&A</p>
            </div>
            <span className="chev">
              <Icon name="chevron" size={18} />
            </span>
          </button>
        ) : null}
        <div className="card">
          {HUB.map((item) => (
            <button key={item.view} type="button" className="row" onClick={() => onView(item.view)}>
              <IconBadge name={HUB_ICONS[item.view] || 'more'} tone={item.tone || 'primary'} />
              <span>
                <p className="row-title">{item.title}</p>
                <p className="row-sub">{item.sub}</p>
              </span>
              <span className="chev">
                <Icon name="chevron" size={18} />
              </span>
            </button>
          ))}
        </div>
        <div className="fab-wrap">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              if (window.confirm('Reset all local demo data?')) {
                clearVaultMeta()
                resetDemo()
                toast('Demo reset')
              }
            }}
          >
            Reset demo data
          </button>
        </div>
        <p className="footer-note">
          Deep links: <code>/t/vault</code>, <code>/chat</code>, <code>/tasks</code>. Docs:{' '}
          <code>docs/FEATURES.md</code>.
        </p>
      </div>
    )
  }

  const back = (
    <button type="button" className="chip chip-ico back-chip" onClick={() => onView('hub')}>
      <Icon name="arrow-left" size={16} />
      More
    </button>
  )

  if (view === 'appearance') {
    const styles: ButtonStyle[] = ['solid', 'soft', 'glow']
    return (
      <div className="screen">
        {back}
        <p className="sub">Deep OLED + Aurora dark · pick a button system</p>
        <div className="card card-pad" style={{ margin: '0 16px 12px' }}>
          <p className="row-title" style={{ marginTop: 0 }}>
            Product look
          </p>
          <p className="muted">
            Locked hybrid: OLED structure and Soft Aurora night colors in dark mode. Use the moon/sun
            control for light/dark only.
          </p>
        </div>
        <p className="section">Button groups</p>
        <div className="design-grid">
          {styles.map((id) => {
            const meta = BUTTON_META[id]
            return (
              <button
                key={id}
                type="button"
                className={`design-opt${s.buttonStyle === id ? ' is-on' : ''}`}
                onClick={() => {
                  chooseButtonStyle(id)
                  toast(`${meta.name} buttons`)
                }}
              >
                <strong>
                  {id === 'solid' ? 'A · ' : id === 'soft' ? 'B · ' : 'C · '}
                  {meta.name}
                </strong>
                <span>
                  {meta.tagline}. {meta.blurb}
                </span>
                <div className="btn-preview-row" data-btn={id}>
                  <span className="btn">Primary</span>
                  <span className="btn-ghost">Ghost</span>
                  <span className="btn-danger">Danger</span>
                </div>
              </button>
            )
          })}
        </div>
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

    function onDrop(col: ColumnId) {
      if (!dragId) return
      moveKanban(dragId, col)
      setDragId(null)
      toast(`Moved to ${col}`)
    }

    return (
      <div className="screen">
        {back}
        <p className="sub">Drag cards between columns · or tap to advance</p>
        {kanbanHint ? (
          <div className="gesture-hint" role="status">
            <Icon name="grip" size={16} />
            <span>Drag by the handle or tap a card to advance columns</span>
            <button
              type="button"
              className="chip"
              onClick={() => {
                try {
                  localStorage.setItem('mobileclaw-kanban-hint-dismissed', '1')
                } catch {
                  /* ignore */
                }
                setKanbanHint(false)
              }}
            >
              Got it
            </button>
          </div>
        ) : null}
        <div className="board">
          {cols.map((col) => (
            <div
              key={col.id}
              className={`col${dragId ? ' col-drop' : ''}`}
              onDragOver={(e: DragEvent) => e.preventDefault()}
              onDrop={() => onDrop(col.id)}
            >
              <h4>{col.label}</h4>
              {s.kanban
                .filter((k) => k.columnId === col.id)
                .map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    className={`k-card${dragId === card.id ? ' is-dragging' : ''}`}
                    draggable
                    onDragStart={() => setDragId(card.id)}
                    onDragEnd={() => setDragId(null)}
                    onClick={() => {
                      const order: ColumnId[] = ['backlog', 'next-up', 'progress', 'done']
                      const next = order[(order.indexOf(card.columnId) + 1) % order.length]
                      moveKanban(card.id, next)
                    }}
                  >
                    <span className="k-grip" aria-hidden>
                      <Icon name="grip" size={14} />
                    </span>
                    <span className="k-card-body">
                      {card.title}
                      <small>
                        {card.priority} · drag or tap
                      </small>
                    </span>
                  </button>
                ))}
            </div>
          ))}
        </div>
        <div className="fab-wrap">
          <button type="button" className="btn" onClick={() => openCreate('kanban')}>
            <Icon name="plus" size={16} />
            Card
          </button>
        </div>
        <CreateModal
          open={create === 'kanban'}
          title="New card"
          onClose={() => setCreate(null)}
          onSubmit={submitCreate}
          canSubmit={Boolean(fieldA.trim())}
        >
          <div className="field">
            <label htmlFor="k-title">Title</label>
            <input id="k-title" value={fieldA} onChange={(e) => setFieldA(e.target.value)} autoFocus />
          </div>
        </CreateModal>
      </div>
    )
  }

  if (view === 'ideas') {
    return (
      <div className="screen">
        {back}
        <div className="stack">
          {s.ideas.length === 0 ? (
            <p className="empty">
              <span className="empty-ico" aria-hidden>
                <Icon name="inbox" size={28} />
              </span>
              No ideas yet.
            </p>
          ) : null}
          {s.ideas.map((idea) => (
            <button
              key={idea.id}
              type="button"
              className="item"
              style={{ borderLeftColor: 'var(--primary)', width: '100%', cursor: 'pointer' }}
              onClick={() => {
                cycleIdeaStatus(idea.id)
                toast('Status advanced')
              }}
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
          <button type="button" className="btn" onClick={() => openCreate('idea')}>
            <Icon name="plus" size={16} />
            Idea
          </button>
        </div>
        <CreateModal
          open={create === 'idea'}
          title="New idea"
          onClose={() => setCreate(null)}
          onSubmit={submitCreate}
          canSubmit={Boolean(fieldA.trim())}
        >
          <div className="field">
            <label htmlFor="i-title">Title</label>
            <input id="i-title" value={fieldA} onChange={(e) => setFieldA(e.target.value)} autoFocus />
          </div>
          <div className="field">
            <label htmlFor="i-desc">Description</label>
            <textarea id="i-desc" rows={3} value={fieldB} onChange={(e) => setFieldB(e.target.value)} />
          </div>
        </CreateModal>
      </div>
    )
  }

  if (view === 'trips') {
    return (
      <div className="screen">
        {back}
        <div className="stack">
          {s.trips.map((trip) => (
            <div
              key={trip.id}
              className="item"
              style={{ borderLeftColor: 'var(--accent)', flexDirection: 'column' }}
            >
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
          <button type="button" className="btn" onClick={() => openCreate('trip')}>
            <Icon name="plus" size={16} />
            Trip
          </button>
        </div>
        <CreateModal
          open={create === 'trip'}
          title="New trip"
          onClose={() => setCreate(null)}
          onSubmit={submitCreate}
          canSubmit={Boolean(fieldA.trim())}
        >
          <div className="field">
            <label htmlFor="tr-title">Title</label>
            <input id="tr-title" value={fieldA} onChange={(e) => setFieldA(e.target.value)} autoFocus />
          </div>
          <div className="field">
            <label htmlFor="tr-dest">Destination</label>
            <input id="tr-dest" value={fieldB} onChange={(e) => setFieldB(e.target.value)} />
          </div>
        </CreateModal>
      </div>
    )
  }

  if (view === 'vault') {
    const locked = isVaultLockedOnDisk() && !vaultSessionUnlocked
    return (
      <div className="screen">
        {back}
        <p className="sub">Demo values only · optional WebCrypto passphrase lock</p>
        {err ? <p className="err pad">{err}</p> : null}

        <div className="card card-pad" style={{ marginBottom: 12 }}>
          <p className="row-title" style={{ marginTop: 0 }}>
            Local lock
          </p>
          <p className="muted">
            PBKDF2 + AES-GCM in this browser only. Never use a production passphrase you reuse
            elsewhere.
          </p>
          <div className="field">
            <label htmlFor="vault-pass">Passphrase</label>
            <input
              id="vault-pass"
              type="password"
              autoComplete="new-password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="min 4 chars"
            />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button
              type="button"
              className="btn"
              disabled={cryptoBusy || passphrase.length < 4 || locked}
              onClick={() => void lockVault()}
            >
              <Icon name="lock" size={16} />
              Lock vault
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={cryptoBusy || passphrase.length < 4 || !isVaultLockedOnDisk()}
              onClick={() => void unlockVault()}
            >
              <Icon name="unlock" size={16} />
              Unlock
            </button>
            {vaultSessionUnlocked && isVaultLockedOnDisk() ? (
              <button type="button" className="btn btn-ghost" onClick={sessionLock}>
                <Icon name="lock" size={16} />
                Lock session
              </button>
            ) : null}
            {isVaultLockedOnDisk() ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  clearVaultMeta()
                  setVaultSessionUnlocked(true)
                  toast('Vault lock removed from this browser')
                }}
              >
                Remove lock
              </button>
            ) : null}
          </div>
        </div>

        {locked ? (
          <p className="empty">Vault is locked. Enter passphrase and unlock to view demo items.</p>
        ) : (
          <>
            <div className="stack">
              {s.vault.map((item) => (
                <div
                  key={item.id}
                  className="item"
                  style={{ borderLeftColor: 'var(--success)', flexDirection: 'column' }}
                >
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
              <button type="button" className="btn" onClick={() => openCreate('vault')}>
                <Icon name="plus" size={16} />
                Vault item
              </button>
            </div>
          </>
        )}

        <CreateModal
          open={create === 'vault'}
          title="New vault item"
          onClose={() => setCreate(null)}
          onSubmit={submitCreate}
          canSubmit={Boolean(fieldA.trim())}
          error={err}
        >
          <div className="field">
            <label htmlFor="v-name">Name</label>
            <input id="v-name" value={fieldA} onChange={(e) => setFieldA(e.target.value)} autoFocus />
          </div>
          <div className="field">
            <label htmlFor="v-val">Demo value (use demo-* ; real secrets blocked)</label>
            <input id="v-val" value={fieldB} onChange={(e) => setFieldB(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="v-cat">Category</label>
            <select
              id="v-cat"
              value={vaultCat}
              onChange={(e) => setVaultCat(e.target.value as VaultCategory)}
            >
              <option value="other">Other</option>
              <option value="api_key">API key</option>
              <option value="password">Password</option>
              <option value="note">Note</option>
            </select>
          </div>
        </CreateModal>
      </div>
    )
  }

  if (view === 'agents') {
    return (
      <div className="screen">
        {back}
        <div className="stack">
          {s.agents.map((agent) => (
            <div
              key={agent.id}
              className="item"
              style={{ borderLeftColor: 'var(--primary)', flexDirection: 'column' }}
            >
              <strong className="agent-name">
                <span
                  className={`status-dot status-dot--${agent.status}`}
                  title={agent.status}
                  aria-hidden
                />
                {agent.name}
              </strong>
              <span className="muted">
                {agent.agentType} · {agent.status}
              </span>
              <code className="muted">{agent.endpoint}</code>
              <span className="muted">
                Last ping: {agent.lastPing ? new Date(agent.lastPing).toLocaleTimeString() : 'never'}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    pingAgent(agent.id)
                    toast('Ping sent (simulated)')
                  }}
                >
                  Ping
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    removeAgent(agent.id)
                    toast('Agent removed')
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="fab-wrap">
          <button type="button" className="btn" onClick={() => openCreate('agent')}>
            <Icon name="plus" size={16} />
            Agent
          </button>
        </div>
        <CreateModal
          open={create === 'agent'}
          title="New agent"
          onClose={() => setCreate(null)}
          onSubmit={submitCreate}
          canSubmit={Boolean(fieldA.trim())}
        >
          <div className="field">
            <label htmlFor="a-name">Name</label>
            <input id="a-name" value={fieldA} onChange={(e) => setFieldA(e.target.value)} autoFocus />
          </div>
          <div className="field">
            <label htmlFor="a-type">Type</label>
            <input
              id="a-type"
              value={fieldB}
              onChange={(e) => setFieldB(e.target.value)}
              placeholder="custom"
            />
          </div>
        </CreateModal>
      </div>
    )
  }

  if (view === 'logs') {
    return (
      <div className="screen">
        {back}
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
        <p className="sub">Mock studio — no external image API on the public site</p>
        <div className="stack">
          {s.artHistory.map((art) => (
            <div
              key={art.id}
              className="item"
              style={{ borderLeftColor: '#8b5cf6', flexDirection: 'column' }}
            >
              <div
                className="art-placeholder"
                style={{
                  height: 120,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, var(--primary-soft), color-mix(in srgb, var(--accent) 30%, transparent))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                }}
                aria-hidden
              >
                <Icon name="image" size={36} strokeWidth={1.5} />
              </div>
              <strong>{art.prompt}</strong>
              <span className="muted">{new Date(art.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="fab-wrap">
          <button type="button" className="btn" onClick={() => openCreate('art')}>
            Generate (mock)
          </button>
        </div>
        <CreateModal
          open={create === 'art'}
          title="Art prompt"
          onClose={() => setCreate(null)}
          onSubmit={submitCreate}
          canSubmit={Boolean(fieldA.trim())}
        >
          <div className="field">
            <label htmlFor="art-p">Prompt</label>
            <textarea
              id="art-p"
              rows={3}
              value={fieldA}
              onChange={(e) => setFieldA(e.target.value)}
              autoFocus
            />
          </div>
        </CreateModal>
      </div>
    )
  }

  if (view === 'phone') {
    return (
      <div className="screen">
        {back}
        <p className="sub">UI-only reservation demo</p>
        <div className="stack">
          {s.phoneBookings.map((b) => (
            <div
              key={b.id}
              className="item"
              style={{ borderLeftColor: 'var(--accent)', flexDirection: 'column' }}
            >
              <strong>{b.venue}</strong>
              <span className="muted">
                Party of {b.partySize} · {b.when}
              </span>
              <span className="ok">{b.status}</span>
            </div>
          ))}
        </div>
        <div className="fab-wrap">
          <button type="button" className="btn" onClick={() => openCreate('phone')}>
            Book table (mock)
          </button>
        </div>
        <CreateModal
          open={create === 'phone'}
          title="Book table"
          onClose={() => setCreate(null)}
          onSubmit={submitCreate}
          canSubmit={Boolean(fieldA.trim())}
        >
          <div className="field">
            <label htmlFor="ph-v">Venue</label>
            <input id="ph-v" value={fieldA} onChange={(e) => setFieldA(e.target.value)} autoFocus />
          </div>
          <div className="field">
            <label htmlFor="ph-when">When</label>
            <input id="ph-when" value={fieldB} onChange={(e) => setFieldB(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="ph-n">Party size</label>
            <input
              id="ph-n"
              type="number"
              min={1}
              max={20}
              value={fieldC}
              onChange={(e) => setFieldC(e.target.value)}
            />
          </div>
        </CreateModal>
      </div>
    )
  }

  if (view === 'paywall') {
    return (
      <div className="screen">
        {back}
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
                  toast(`${info.name} selected (demo)`)
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
      </div>
    )
  }

  if (view === 'connection') {
    return (
      <div className="screen">
        {back}
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
          <p className="muted">
            Tokens and credentialed URLs are rejected. Prefer ws://localhost:… for demos.
          </p>
        </div>
      </div>
    )
  }

  return null
}

function CreateModal({
  open,
  title,
  onClose,
  onSubmit,
  canSubmit,
  children,
  error,
}: {
  open: boolean
  title: string
  onClose: () => void
  onSubmit: () => void
  canSubmit: boolean
  children: ReactNode
  error?: string | null
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn" onClick={onSubmit} disabled={!canSubmit}>
            Save
          </button>
        </>
      }
    >
      {error ? <p className="err">{error}</p> : null}
      {children}
    </Modal>
  )
}
