import { useDemoStore } from '../../lib/useDemoStore'
import type { MoreView, TabId } from '../../data/seed'

export type HomeScreenProps = {
  onOpenTab: (tab: TabId) => void
  onOpenMore: (view: MoreView) => void
  onOpenCoach?: () => void
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/**
 * MobileClaw Home — greeting, plan, quick actions, stats, feature grid.
 */
export function HomeScreen({ onOpenTab, onOpenMore, onOpenCoach }: HomeScreenProps) {
  const s = useDemoStore()
  const openTasks = s.tasks.filter((t) => !t.completed).length

  return (
    <div className="screen">
      <p className="large-title">
        {greeting()},
        <br />
        {s.user.displayName}
      </p>
      <p className="sub">Public MobileClaw demo · local data only</p>

      {onOpenCoach ? (
        <button
          type="button"
          className="banner"
          style={{ marginBottom: 12, width: 'calc(100% - 32px)', cursor: 'pointer' }}
          onClick={onOpenCoach}
        >
          <span aria-hidden>✨</span>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <p className="row-title" style={{ margin: 0 }}>
              New here?
            </p>
            <p className="row-sub">Tour · auto-configure · feature Q&A</p>
          </div>
          <span className="pill" style={{ pointerEvents: 'none' }}>
            Coach
          </span>
        </button>
      ) : null}

      <div className="banner">
        <span aria-hidden>💎</span>
        <div style={{ flex: 1 }}>
          <p className="row-title" style={{ margin: 0 }}>
            {s.user.tier.toUpperCase()} plan
          </p>
          <p className="row-sub">{s.user.credits} credits remaining</p>
        </div>
        <button type="button" className="pill" onClick={() => onOpenMore('paywall')}>
          Upgrade
        </button>
      </div>

      <p className="section">Quick actions</p>
      <div className="h-scroll">
        <button type="button" className="tile" onClick={() => onOpenTab('chat')}>
          <span className="emoji">💬</span>
          <strong>New chat</strong>
          <span>Ask anything</span>
        </button>
        <button type="button" className="tile" onClick={() => onOpenMore('art')}>
          <span className="emoji">🎨</span>
          <strong>AI art</strong>
          <span>Mock studio</span>
        </button>
        <button type="button" className="tile" onClick={() => onOpenMore('trips')}>
          <span className="emoji">✈️</span>
          <strong>Trips</strong>
          <span>Itineraries</span>
        </button>
        <button type="button" className="tile" onClick={() => onOpenMore('phone')}>
          <span className="emoji">📞</span>
          <strong>AI call</strong>
          <span>Book table</span>
        </button>
        <button type="button" className="tile" onClick={() => onOpenMore('vault')}>
          <span className="emoji">🛡️</span>
          <strong>Vault</strong>
          <span>Demo secrets</span>
        </button>
      </div>

      <div className="stats">
        <div className="stat">
          <b>{s.conversations.length}</b>
          <small>Chats</small>
        </div>
        <div className="stat">
          <b>{openTasks}</b>
          <small>Open tasks</small>
        </div>
        <div className="stat">
          <b>{s.trips.length}</b>
          <small>Trips</small>
        </div>
      </div>

      <p className="section">Features</p>
      <div className="grid3">
        <button type="button" className="f-tile" onClick={() => onOpenTab('brain')}>
          🧠<br />
          Brain
        </button>
        <button type="button" className="f-tile" onClick={() => onOpenMore('vault')}>
          🛡️<br />
          Vault
        </button>
        <button type="button" className="f-tile" onClick={() => onOpenTab('tasks')}>
          ✅<br />
          Tasks
        </button>
        <button type="button" className="f-tile" onClick={() => onOpenMore('agents')}>
          <span className="badge">Pro</span>
          ⚡<br />
          Agents
        </button>
        <button type="button" className="f-tile" onClick={() => onOpenMore('kanban')}>
          📋<br />
          Kanban
        </button>
        <button type="button" className="f-tile" onClick={() => onOpenMore('logs')}>
          📜<br />
          Logs
        </button>
      </div>

      <p className="section">Recent chats</p>
      <div className="card">
        {s.conversations.slice(0, 4).map((c) => (
          <button key={c.id} type="button" className="row" onClick={() => onOpenTab('chat')}>
            <span className="row-ico">💬</span>
            <span>
              <p className="row-title">{c.title}</p>
              <p className="row-sub">{new Date(c.updatedAt).toLocaleDateString()}</p>
            </span>
            <span className="chev">›</span>
          </button>
        ))}
      </div>

      <p className="section">Trips</p>
      <div className="h-scroll">
        {s.trips.map((t) => (
          <button key={t.id} type="button" className="tile" onClick={() => onOpenMore('trips')}>
            <span className="emoji">{t.emoji}</span>
            <strong>{t.title}</strong>
            <span>{t.destination}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
