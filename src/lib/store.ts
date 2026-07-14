/**
 * Local-only demo store (localStorage). No Supabase, no real auth, no secret sync.
 */

import { createSeedState, type DemoState, type DesignOption, type ThemeMode } from '../data/seed'
import { isLikelyRealSecret, redactSecrets } from './security'

const STORAGE_KEY = 'mobileclaw-public-demo-v2'

type Listener = () => void

let state: DemoState = load()
const listeners = new Set<Listener>()

function load(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeedState()
    const parsed = JSON.parse(raw) as DemoState
    if (parsed?.version !== 2) return createSeedState()
    return parsed
  } catch {
    return createSeedState()
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* quota / private mode */
  }
  listeners.forEach((l) => l())
}

/** Subscribe to store changes (React-friendly). */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getState(): DemoState {
  return state
}

export function resetDemo(): void {
  state = createSeedState()
  persist()
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function setThemeMode(mode: ThemeMode): void {
  state = { ...state, themeMode: mode }
  persist()
}

export function setDesign(design: DesignOption): void {
  state = { ...state, design }
  persist()
}

export function setTabMeta(partial: Partial<Pick<DemoState, 'activeConversationId' | 'activePersonaId' | 'selectedModel'>>): void {
  state = { ...state, ...partial }
  persist()
}

export function toggleTask(id: string): void {
  state = {
    ...state,
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
  }
  persist()
}

export function addTask(title: string, category: DemoState['tasks'][0]['category'] = 'personal'): void {
  const clean = redactSecrets(title.trim())
  if (!clean) return
  state = {
    ...state,
    tasks: [
      { id: uid('t'), title: clean, category, completed: false },
      ...state.tasks,
    ],
    logs: [
      {
        id: uid('l'),
        level: 'info',
        category: 'tasks',
        message: `Task created: ${clean}`,
        createdAt: new Date().toISOString(),
      },
      ...state.logs,
    ].slice(0, 100),
  }
  persist()
}

export function toggleNotePin(id: string): void {
  state = {
    ...state,
    notes: state.notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
  }
  persist()
}

export function addNote(title: string, content: string, category: DemoState['notes'][0]['category']): void {
  const t = redactSecrets(title.trim())
  const c = redactSecrets(content.trim())
  if (!t) return
  state = {
    ...state,
    notes: [
      {
        id: uid('n'),
        title: t,
        content: c,
        category,
        pinned: false,
        updatedAt: new Date().toISOString(),
      },
      ...state.notes,
    ],
  }
  persist()
}

export function moveKanban(id: string, columnId: DemoState['kanban'][0]['columnId']): void {
  state = {
    ...state,
    kanban: state.kanban.map((k) => (k.id === id ? { ...k, columnId } : k)),
  }
  persist()
}

export function addKanban(title: string): void {
  const clean = redactSecrets(title.trim())
  if (!clean) return
  state = {
    ...state,
    kanban: [
      {
        id: uid('k'),
        title: clean,
        columnId: 'backlog',
        priority: 'medium',
        tags: ['demo'],
      },
      ...state.kanban,
    ],
  }
  persist()
}

export function addIdea(title: string, description: string): void {
  const t = redactSecrets(title.trim())
  if (!t) return
  state = {
    ...state,
    ideas: [
      {
        id: uid('i'),
        title: t,
        description: redactSecrets(description.trim()),
        status: 'new',
        priority: 'medium',
        tags: ['demo'],
      },
      ...state.ideas,
    ],
  }
  persist()
}

export function cycleIdeaStatus(id: string): void {
  const order = ['new', 'in-progress', 'done'] as const
  state = {
    ...state,
    ideas: state.ideas.map((idea) => {
      if (idea.id !== id) return idea
      const idx = order.indexOf(idea.status)
      return { ...idea, status: order[(idx + 1) % order.length] }
    }),
  }
  persist()
}

export function addTrip(title: string, destination: string): void {
  const t = redactSecrets(title.trim())
  if (!t) return
  state = {
    ...state,
    trips: [
      {
        id: uid('tr'),
        title: t,
        destination: redactSecrets(destination.trim()) || 'TBD',
        emoji: '✈️',
        status: 'planning',
        budget: 0,
        notes: '',
        startDate: '',
        endDate: '',
      },
      ...state.trips,
    ],
  }
  persist()
}

export function addVaultItem(name: string, demoValue: string, category: DemoState['vault'][0]['category']): { ok: true } | { ok: false; error: string } {
  const n = redactSecrets(name.trim())
  const v = demoValue.trim()
  if (!n) return { ok: false, error: 'Name required' }
  if (isLikelyRealSecret(v)) {
    return {
      ok: false,
      error: 'That looks like a real credential. Use a demo-* value only on the public site.',
    }
  }
  state = {
    ...state,
    vault: [
      {
        id: uid('v'),
        name: n,
        category,
        demoValue: v.startsWith('demo') ? v : `demo-${v || 'value'}`,
        notes: 'Stored only in this browser (public demo)',
      },
      ...state.vault,
    ],
    logs: [
      {
        id: uid('l'),
        level: 'info',
        category: 'vault',
        message: `Vault item added: ${n}`,
        createdAt: new Date().toISOString(),
      },
      ...state.logs,
    ].slice(0, 100),
  }
  persist()
  return { ok: true }
}

export function pingAgent(id: string): void {
  const roll = Math.random()
  const status = roll > 0.7 ? 'error' : roll > 0.35 ? 'online' : 'offline'
  state = {
    ...state,
    agents: state.agents.map((a) =>
      a.id === id
        ? { ...a, status, lastPing: new Date().toISOString() }
        : a,
    ),
    logs: [
      {
        id: uid('l'),
        level: status === 'error' ? 'error' : 'info',
        category: 'agents',
        message: `Ping ${id} → ${status}`,
        createdAt: new Date().toISOString(),
      },
      ...state.logs,
    ].slice(0, 100),
  }
  persist()
}

export function addAgent(name: string, agentType: string): void {
  const n = redactSecrets(name.trim())
  if (!n) return
  state = {
    ...state,
    agents: [
      {
        id: uid('a'),
        name: n,
        agentType: agentType || 'custom',
        endpoint: 'ws://localhost:18789',
        status: 'unknown',
        lastPing: null,
      },
      ...state.agents,
    ],
  }
  persist()
}

export function removeAgent(id: string): void {
  state = { ...state, agents: state.agents.filter((a) => a.id !== id) }
  persist()
}

export function setConnection(enabled: boolean, type: DemoState['connection']['type'], url: string): { ok: true } | { ok: false; error: string } {
  const cleanUrl = url.trim()
  if (isLikelyRealSecret(cleanUrl)) {
    return { ok: false, error: 'URL looks like it embeds a secret. Use a plain demo host only.' }
  }
  // Block accidental paste of real cloud project URLs with keys
  if (/supabase\.co|openai\.com|anthropic\.com/i.test(cleanUrl) && /[?&](key|token)=/i.test(cleanUrl)) {
    return { ok: false, error: 'Credentialed URLs are blocked on the public demo.' }
  }
  state = {
    ...state,
    connection: {
      enabled,
      type,
      url: cleanUrl || state.connection.url,
    },
    logs: [
      {
        id: uid('l'),
        level: 'info',
        category: 'connection',
        message: `Connection ${enabled ? 'enabled' : 'disabled'} (${type})`,
        createdAt: new Date().toISOString(),
      },
      ...state.logs,
    ].slice(0, 100),
  }
  persist()
  return { ok: true }
}

export function appendChatMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  status: 'sent' | 'failed' = 'sent',
): void {
  const clean = redactSecrets(content)
  state = {
    ...state,
    messages: [
      ...state.messages,
      {
        id: uid('m'),
        conversationId,
        role,
        content: clean,
        createdAt: new Date().toISOString(),
        status,
      },
    ],
    conversations: state.conversations.map((c) =>
      c.id === conversationId ? { ...c, updatedAt: new Date().toISOString() } : c,
    ),
  }
  persist()
}

export function createConversation(title: string): string {
  const id = uid('conv')
  state = {
    ...state,
    conversations: [
      {
        id,
        title: redactSecrets(title.trim()) || 'New chat',
        model: state.selectedModel,
        personaId: state.activePersonaId,
        updatedAt: new Date().toISOString(),
      },
      ...state.conversations,
    ],
    activeConversationId: id,
  }
  persist()
  return id
}

export function addArtPrompt(prompt: string): void {
  const p = redactSecrets(prompt.trim())
  if (!p) return
  state = {
    ...state,
    artHistory: [
      { id: uid('art'), prompt: p, createdAt: new Date().toISOString() },
      ...state.artHistory,
    ].slice(0, 20),
  }
  persist()
}

export function addPhoneBooking(venue: string, partySize: number, when: string): void {
  const v = redactSecrets(venue.trim())
  if (!v) return
  state = {
    ...state,
    phoneBookings: [
      {
        id: uid('ph'),
        venue: v,
        partySize: Math.max(1, Math.min(20, partySize || 2)),
        when: redactSecrets(when.trim()) || 'TBD',
        status: 'confirmed (demo)',
      },
      ...state.phoneBookings,
    ],
  }
  persist()
}

export function setTier(tier: DemoState['user']['tier']): void {
  const credits = tier === 'premium' ? 9999 : tier === 'pro' ? 500 : tier === 'starter' ? 200 : 50
  state = {
    ...state,
    user: { ...state.user, tier, credits },
  }
  persist()
}

/** Imperative API used by the 300-simulation harness. */
export const demoApi = {
  getState,
  resetDemo,
  toggleTask,
  addTask,
  toggleNotePin,
  addNote,
  moveKanban,
  addKanban,
  addIdea,
  cycleIdeaStatus,
  addTrip,
  addVaultItem,
  pingAgent,
  addAgent,
  removeAgent,
  setConnection,
  appendChatMessage,
  createConversation,
  addArtPrompt,
  addPhoneBooking,
  setTier,
  setDesign,
  setThemeMode,
  setTabMeta,
}
