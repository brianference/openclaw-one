/**
 * Anonymized seed data for the public MobileClaw demo.
 * No real emails, tokens, vault secrets, or private endpoints.
 */

import { PUBLIC_DEMO_USER, SAFE_DEMO_ENDPOINTS } from '../lib/security'

export type DesignOption = 'liquid' | 'oled' | 'aurora'
export type ThemeMode = 'light' | 'dark'
export type TabId = 'home' | 'chat' | 'tasks' | 'brain' | 'more'
export type MoreView =
  | 'hub'
  | 'kanban'
  | 'ideas'
  | 'trips'
  | 'vault'
  | 'agents'
  | 'logs'
  | 'personas'
  | 'art'
  | 'phone'
  | 'paywall'
  | 'connection'
  | 'design'

export type TaskCategory = 'work' | 'personal' | 'shopping'
export type NoteCategory = 'idea' | 'note' | 'todo' | 'research'
export type ColumnId = 'backlog' | 'next-up' | 'progress' | 'done'
export type Priority = 'high' | 'medium' | 'low'
export type AgentStatus = 'online' | 'offline' | 'error' | 'unknown'
export type LogLevel = 'info' | 'warn' | 'error' | 'debug'
export type TripStatus = 'planning' | 'upcoming' | 'active' | 'completed' | 'cancelled'
export type VaultCategory = 'api_key' | 'password' | 'note' | 'other'
export type AIModel = 'demo-fast' | 'demo-balanced' | 'demo-deep'

export type Task = {
  id: string
  title: string
  category: TaskCategory
  completed: boolean
  notes?: string
  dueAt?: string
}

export type Note = {
  id: string
  title: string
  content: string
  category: NoteCategory
  pinned: boolean
  updatedAt: string
}

export type KanbanCard = {
  id: string
  title: string
  description?: string
  columnId: ColumnId
  priority: Priority
  tags: string[]
}

export type Idea = {
  id: string
  title: string
  description: string
  status: 'new' | 'in-progress' | 'done'
  priority: Priority
  tags: string[]
}

export type Trip = {
  id: string
  title: string
  destination: string
  emoji: string
  status: TripStatus
  budget: number
  notes: string
  startDate: string
  endDate: string
}

export type ItineraryItem = {
  id: string
  tripId: string
  dayNumber: number
  timeSlot: string
  activity: string
  location: string
  category: 'activity' | 'food' | 'transport' | 'accommodation' | 'note'
}

export type VaultItem = {
  id: string
  name: string
  category: VaultCategory
  /** Demo placeholder only — never a real secret. */
  demoValue: string
  notes?: string
}

export type Agent = {
  id: string
  name: string
  agentType: string
  /** Fake/public endpoint only */
  endpoint: string
  status: AgentStatus
  lastPing: string | null
}

export type AppLog = {
  id: string
  level: LogLevel
  category: string
  message: string
  createdAt: string
}

export type Persona = {
  id: string
  name: string
  description: string
  emoji: string
  model: AIModel
  builtin: boolean
}

export type Conversation = {
  id: string
  title: string
  model: AIModel
  personaId: string
  updatedAt: string
}

export type ChatMessage = {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  status?: 'sent' | 'failed'
}

export type SetupPrefs = {
  walkthroughCompleted: boolean
  coachDismissed: boolean
  coachSeen: boolean
  lastStepIndex: number
  autoConfiguredAt: string | null
}

export type DemoState = {
  version: 3
  user: typeof PUBLIC_DEMO_USER
  tasks: Task[]
  notes: Note[]
  kanban: KanbanCard[]
  ideas: Idea[]
  trips: Trip[]
  itinerary: ItineraryItem[]
  vault: VaultItem[]
  agents: Agent[]
  logs: AppLog[]
  personas: Persona[]
  conversations: Conversation[]
  messages: ChatMessage[]
  activeConversationId: string
  activePersonaId: string
  selectedModel: AIModel
  connection: {
    enabled: boolean
    type: 'default' | 'local' | 'cloud'
    /** Always a safe demo URL — tokens never stored. */
    url: string
  }
  themeMode: ThemeMode
  design: DesignOption
  artHistory: { id: string; prompt: string; createdAt: string }[]
  phoneBookings: { id: string; venue: string; partySize: number; when: string; status: string }[]
  setup: SetupPrefs
}

export const DEFAULT_SETUP: SetupPrefs = {
  walkthroughCompleted: false,
  coachDismissed: false,
  coachSeen: false,
  lastStepIndex: 0,
  autoConfiguredAt: null,
}

const now = () => new Date().toISOString()

export const BUILTIN_PERSONAS: Persona[] = [
  {
    id: 'p-openclaw',
    name: 'OpenClaw',
    description: 'General-purpose assistant',
    emoji: '⚡',
    model: 'demo-balanced',
    builtin: true,
  },
  {
    id: 'p-code',
    name: 'CodeMaster',
    description: 'Software engineering',
    emoji: '💻',
    model: 'demo-deep',
    builtin: true,
  },
  {
    id: 'p-writer',
    name: 'Writer',
    description: 'Creative writing',
    emoji: '✍️',
    model: 'demo-balanced',
    builtin: true,
  },
  {
    id: 'p-analyst',
    name: 'Analyst',
    description: 'Research and analysis',
    emoji: '📊',
    model: 'demo-deep',
    builtin: true,
  },
  {
    id: 'p-trip',
    name: 'TripBot',
    description: 'Travel planning',
    emoji: '🗺️',
    model: 'demo-fast',
    builtin: true,
  },
  {
    id: 'p-chef',
    name: 'Chef AI',
    description: 'Recipes and meal plans',
    emoji: '👨‍🍳',
    model: 'demo-fast',
    builtin: true,
  },
]

export function createSeedState(): DemoState {
  const c1 = 'conv-1'
  return {
    version: 3,
    user: { ...PUBLIC_DEMO_USER },
    tasks: [
      {
        id: 't1',
        title: 'Review gateway health checks',
        category: 'work',
        completed: false,
        dueAt: new Date(Date.now() + 86400000 * 2).toISOString(),
        notes: 'Demo checklist only',
      },
      {
        id: 't2',
        title: 'Prepare release notes',
        category: 'work',
        completed: false,
        dueAt: new Date(Date.now() + 21600000).toISOString(),
      },
      {
        id: 't3',
        title: 'Pick up travel adapter',
        category: 'shopping',
        completed: false,
        dueAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 't4',
        title: 'Pin useful Brain notes',
        category: 'personal',
        completed: true,
      },
    ],
    notes: [
      {
        id: 'n1',
        title: 'Agent fleet sketch',
        content: 'Chat agent + vault worker + scan runner. Keep secrets on-device only.',
        category: 'research',
        pinned: true,
        updatedAt: now(),
      },
      {
        id: 'n2',
        title: 'Product site parity',
        content: 'Public demo should mirror MobileClaw tabs without real credentials.',
        category: 'idea',
        pinned: true,
        updatedAt: now(),
      },
      {
        id: 'n3',
        title: 'Kanban flow',
        content: 'Backlog → Next → Progress → Done',
        category: 'todo',
        pinned: false,
        updatedAt: now(),
      },
      {
        id: 'n4',
        title: 'Meeting notes (demo)',
        content: 'Discussed anonymized public demo constraints and CSP headers.',
        category: 'note',
        pinned: false,
        updatedAt: now(),
      },
    ],
    kanban: [
      { id: 'k1', title: 'Public demo shell', columnId: 'done', priority: 'high', tags: ['web'], description: 'Phone frame + tabs' },
      { id: 'k2', title: 'Vault masking', columnId: 'progress', priority: 'high', tags: ['security'] },
      { id: 'k3', title: 'Trips itinerary UI', columnId: 'next-up', priority: 'medium', tags: ['travel'] },
      { id: 'k4', title: 'Agent ping simulation', columnId: 'backlog', priority: 'low', tags: ['agents'] },
    ],
    ideas: [
      {
        id: 'i1',
        title: 'Offline-first Brain search',
        description: 'Full-text search over local notes with no network.',
        status: 'in-progress',
        priority: 'high',
        tags: ['brain'],
      },
      {
        id: 'i2',
        title: 'Widget for tasks',
        description: 'iOS home-screen style glanceable tasks.',
        status: 'new',
        priority: 'medium',
        tags: ['mobile'],
      },
    ],
    trips: [
      {
        id: 'tr1',
        title: 'City sprint',
        destination: 'Demo City',
        emoji: '🏙️',
        status: 'planning',
        budget: 1200,
        notes: 'Anonymized sample trip',
        startDate: '2026-08-01',
        endDate: '2026-08-05',
      },
      {
        id: 'tr2',
        title: 'Coast weekend',
        destination: 'Sample Coast',
        emoji: '🌊',
        status: 'active',
        budget: 600,
        notes: '',
        startDate: '2026-07-18',
        endDate: '2026-07-20',
      },
    ],
    itinerary: [
      {
        id: 'it1',
        tripId: 'tr1',
        dayNumber: 1,
        timeSlot: '09:00',
        activity: 'Arrive & check-in',
        location: 'Demo Hotel',
        category: 'accommodation',
      },
      {
        id: 'it2',
        tripId: 'tr1',
        dayNumber: 1,
        timeSlot: '13:00',
        activity: 'Walking tour',
        location: 'Old Town',
        category: 'activity',
      },
      {
        id: 'it3',
        tripId: 'tr1',
        dayNumber: 2,
        timeSlot: '19:00',
        activity: 'Dinner reservation',
        location: 'Harbor Bistro',
        category: 'food',
      },
    ],
    vault: [
      {
        id: 'v1',
        name: 'Demo gateway token',
        category: 'api_key',
        demoValue: 'demo-gateway-token-not-real',
        notes: 'Placeholder only — not a production key',
      },
      {
        id: 'v2',
        name: 'Sample note password',
        category: 'password',
        demoValue: 'demo-password-0000',
        notes: 'Public demo value',
      },
      {
        id: 'v3',
        name: 'Recovery checklist',
        category: 'note',
        demoValue: '1) Rotate demo keys 2) Clear local vault 3) Re-seed',
      },
    ],
    agents: [
      {
        id: 'a1',
        name: 'Chat relay',
        agentType: 'chat',
        endpoint: SAFE_DEMO_ENDPOINTS.local,
        status: 'online',
        lastPing: now(),
      },
      {
        id: 'a2',
        name: 'Vault worker',
        agentType: 'vault',
        endpoint: SAFE_DEMO_ENDPOINTS.cloud,
        status: 'offline',
        lastPing: null,
      },
      {
        id: 'a3',
        name: 'Scan runner',
        agentType: 'scan',
        endpoint: 'http://127.0.0.1:9090',
        status: 'error',
        lastPing: now(),
      },
    ],
    logs: [
      {
        id: 'l1',
        level: 'info',
        category: 'chat',
        message: 'Demo conversation seeded',
        createdAt: now(),
      },
      {
        id: 'l2',
        level: 'warn',
        category: 'agents',
        message: 'Vault worker offline (simulated)',
        createdAt: now(),
      },
      {
        id: 'l3',
        level: 'error',
        category: 'scan',
        message: 'Scan runner returned demo error state',
        createdAt: now(),
      },
      {
        id: 'l4',
        level: 'debug',
        category: 'security',
        message: 'Secret redaction filter active',
        createdAt: now(),
      },
    ],
    personas: BUILTIN_PERSONAS,
    conversations: [
      {
        id: c1,
        title: 'Gateway setup (demo)',
        model: 'demo-balanced',
        personaId: 'p-openclaw',
        updatedAt: now(),
      },
      {
        id: 'conv-2',
        title: 'Trip brainstorm',
        model: 'demo-fast',
        personaId: 'p-trip',
        updatedAt: now(),
      },
    ],
    messages: [
      {
        id: 'm1',
        conversationId: c1,
        role: 'user',
        content: 'How do I connect a local gateway in the demo?',
        createdAt: now(),
        status: 'sent',
      },
      {
        id: 'm2',
        conversationId: c1,
        role: 'assistant',
        content:
          'Open **More → Connection**, enable a custom endpoint, choose **Local**, and use a safe demo URL like `ws://localhost:18789`. Real tokens are blocked and never stored on this public site.',
        createdAt: now(),
        status: 'sent',
      },
    ],
    activeConversationId: c1,
    activePersonaId: 'p-openclaw',
    selectedModel: 'demo-balanced',
    connection: {
      enabled: false,
      type: 'default',
      url: SAFE_DEMO_ENDPOINTS.local,
    },
    themeMode: 'dark',
    design: 'liquid',
    artHistory: [
      {
        id: 'art1',
        prompt: 'Minimal robot mascot, soft neon, public demo art',
        createdAt: now(),
      },
    ],
    phoneBookings: [
      {
        id: 'ph1',
        venue: 'Demo Bistro',
        partySize: 2,
        when: 'Tomorrow 7:00 PM',
        status: 'confirmed (demo)',
      },
    ],
    setup: { ...DEFAULT_SETUP },
  }
}

export const TIER_INFO = {
  free: { name: 'Free', credits: 50, price: '$0' },
  starter: { name: 'Starter', credits: 200, price: '$9' },
  pro: { name: 'Pro', credits: 500, price: '$19' },
  premium: { name: 'Premium', credits: -1, price: '$49' },
} as const

export const CHAT_PUBLIC_CONTEXT = [
  'Product: MobileClaw public web demo (anonymized).',
  'Native source: https://github.com/brianference/mobileclaw (private app mirrored here without secrets).',
  'Features: Home, Chat, Tasks, Brain, Kanban, Ideas, Trips, Vault (demo values), Agents, Logs, Personas, AI Art (mock), Phone booking (mock), Paywall (UI only).',
  'Security: no real API keys, passwords, or private endpoints; redaction enabled.',
  `Demo user: ${PUBLIC_DEMO_USER.displayName} <${PUBLIC_DEMO_USER.email}> tier=${PUBLIC_DEMO_USER.tier}.`,
].join('\n')
