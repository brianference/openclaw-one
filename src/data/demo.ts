/** Seed data shaped like MobileClaw store entities (demo only — not live Supabase). */

export type TaskCategory = 'work' | 'personal' | 'shopping'
export type NoteCategory = 'idea' | 'note' | 'todo' | 'research'

export type DemoTask = {
  id: string
  title: string
  category: TaskCategory
  completed: boolean
  notes?: string
  dueLabel?: string
  overdue?: boolean
}

export type DemoNote = {
  id: string
  title: string
  content: string
  category: NoteCategory
  pinned: boolean
  updated: string
}

export type DemoChat = {
  id: string
  title: string
  updated: string
}

export type DemoMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

export type DemoTrip = {
  id: string
  title: string
  destination: string
  emoji: string
  status: 'active' | 'planning' | 'done'
}

export const DEMO_USER = {
  displayName: 'Brian',
  tier: 'Pro',
  credits: 420,
  creditsLabel: '420 credits remaining',
}

export const DEMO_CHATS: DemoChat[] = [
  { id: 'c1', title: 'Gateway setup checklist', updated: 'Jul 12' },
  { id: 'c2', title: 'Vault key rotation plan', updated: 'Jul 10' },
  { id: 'c3', title: 'Trip: Tokyo itinerary', updated: 'Jul 8' },
]

export const DEMO_MESSAGES: DemoMessage[] = [
  {
    id: 'm1',
    role: 'user',
    content: 'How do I connect OpenClaw to a local gateway?',
    time: '9:41 AM',
  },
  {
    id: 'm2',
    role: 'assistant',
    content:
      'Open **Profile → AI Connection**, enable a custom endpoint, pick **Local Network**, then paste your gateway URL (for example `ws://192.168.1.20:18789`). Tokens stay on-device — MobileClaw never ships them to the marketing site.',
    time: '9:41 AM',
  },
  {
    id: 'm3',
    role: 'user',
    content: 'Can I use this web demo offline?',
    time: '9:42 AM',
  },
  {
    id: 'm4',
    role: 'assistant',
    content:
      'This site is a **UI demo** of MobileClaw. Tasks, Brain, and Home use local seed data. Chat can call `/api/chat` when configured; otherwise it answers from on-page context only.',
    time: '9:42 AM',
  },
]

export const DEMO_TASKS: DemoTask[] = [
  {
    id: 't1',
    title: 'Rotate vault master passphrase',
    category: 'work',
    completed: false,
    dueLabel: '2d left',
    notes: 'After US-084 audit',
  },
  {
    id: 't2',
    title: 'Ship TestFlight build notes',
    category: 'work',
    completed: false,
    dueLabel: '6h left',
  },
  {
    id: 't3',
    title: 'Buy travel adapter for NRT',
    category: 'shopping',
    completed: false,
    dueLabel: 'Overdue',
    overdue: true,
  },
  {
    id: 't4',
    title: 'Review Second Brain pin list',
    category: 'personal',
    completed: true,
  },
]

export const DEMO_NOTES: DemoNote[] = [
  {
    id: 'n1',
    title: 'Agent fleet topology',
    content: 'Primary chat agent + vault worker + scan runner. Prefer local gateway for secrets.',
    category: 'research',
    pinned: true,
    updated: 'Jul 11',
  },
  {
    id: 'n2',
    title: 'Product site must match app',
    content: 'openclaw-one.pages.dev should look like MobileClaw: dark shell, blue primary, bottom tabs.',
    category: 'idea',
    pinned: true,
    updated: 'Jul 10',
  },
  {
    id: 'n3',
    title: 'Kanban columns',
    content: 'Backlog → Doing → Review → Done. Mirror native board.',
    category: 'todo',
    pinned: false,
    updated: 'Jul 9',
  },
  {
    id: 'n4',
    title: 'Meeting: EAS credentials',
    content: 'Confirm iOS bundle com.openclaw.ai and Android package align with app.json.',
    category: 'note',
    pinned: false,
    updated: 'Jul 7',
  },
]

export const DEMO_TRIPS: DemoTrip[] = [
  {
    id: 'tr1',
    title: 'Tokyo sprint',
    destination: 'Tokyo, Japan',
    emoji: '🗼',
    status: 'planning',
  },
  {
    id: 'tr2',
    title: 'Bay Area meetup',
    destination: 'San Francisco',
    emoji: '🌉',
    status: 'active',
  },
]

export const CHAT_CONTEXT = [
  'Product: MobileClaw / OpenClaw AI — Expo mobile client for agent ops.',
  'Native repo: https://github.com/brianference/mobileclaw',
  'Public companion: https://github.com/brianference/openclaw-one',
  'Tabs: Home, Chat, Tasks, Brain, Profile.',
  'Theme: dark #0a0a0a, primary #3b82f6, accent #06b6d4.',
  `Demo user: ${DEMO_USER.displayName}, ${DEMO_USER.tier}, ${DEMO_USER.credits} credits.`,
  `Tasks: ${DEMO_TASKS.map((t) => t.title).join('; ')}`,
  `Brain notes: ${DEMO_NOTES.map((n) => n.title).join('; ')}`,
].join('\n')
