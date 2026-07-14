/**
 * Structured feature catalog — used by Setup coach context and docs generation.
 * Keep in sync with docs/FEATURES.md.
 */

export type FeatureEntry = {
  id: string
  name: string
  area: 'tab' | 'more' | 'system' | 'security' | 'native-only'
  summary: string
  howTo: string
  demoLimit?: string
  navigate?: { tab: 'home' | 'chat' | 'tasks' | 'brain' | 'more'; moreView?: string }
}

export const FEATURE_CATALOG: FeatureEntry[] = [
  {
    id: 'home',
    name: 'Home',
    area: 'tab',
    summary: 'Dashboard with greeting, plan banner, quick actions, stats, and shortcuts.',
    howTo: 'Open the Home tab. Tap quick actions or feature tiles to jump into Chat, Tasks, Vault, Agents, and more.',
    navigate: { tab: 'home' },
  },
  {
    id: 'chat',
    name: 'Chat',
    area: 'tab',
    summary: 'Conversations with persona and model selectors; optional AI API.',
    howTo: 'Open Chat. Pick a conversation, persona, and model. Type a message. Secrets are redacted automatically.',
    demoLimit: 'Live model replies need OPENAI_API_KEY on the server; otherwise offline guidance is used.',
    navigate: { tab: 'chat' },
  },
  {
    id: 'tasks',
    name: 'Tasks',
    area: 'tab',
    summary: 'Task list with filters and completion toggles.',
    howTo: 'Open Tasks. Filter All/Active/Done. Tap the circle to complete. Use + New task to add.',
    navigate: { tab: 'tasks' },
  },
  {
    id: 'brain',
    name: 'Brain',
    area: 'tab',
    summary: 'Second-brain notes by category with pin support.',
    howTo: 'Open Brain. Filter by category. Pin important notes. Add notes with + New note.',
    navigate: { tab: 'brain' },
  },
  {
    id: 'kanban',
    name: 'Kanban',
    area: 'more',
    summary: 'Board with backlog, next, progress, and done columns.',
    howTo: 'More → Kanban. Tap a card to advance its column. Add cards with + Card.',
    navigate: { tab: 'more', moreView: 'kanban' },
  },
  {
    id: 'ideas',
    name: 'Ideas',
    area: 'more',
    summary: 'Lightweight idea inbox with status cycling.',
    howTo: 'More → Ideas. Tap an idea to cycle status. Add with + Idea.',
    navigate: { tab: 'more', moreView: 'ideas' },
  },
  {
    id: 'trips',
    name: 'Trips',
    area: 'more',
    summary: 'Trip cards with sample itinerary lines.',
    howTo: 'More → Trips (or Home quick action). Review itinerary. Add a trip with + Trip.',
    navigate: { tab: 'more', moreView: 'trips' },
  },
  {
    id: 'vault',
    name: 'Vault',
    area: 'more',
    summary: 'Masked demo secrets with reveal and add flow.',
    howTo: 'More → Vault. Reveal demo values only. New items must use demo-* style values; real keys are rejected.',
    demoLimit: 'Not AES-encrypted like the native app; public demo only.',
    navigate: { tab: 'more', moreView: 'vault' },
  },
  {
    id: 'agents',
    name: 'Agents',
    area: 'more',
    summary: 'Simulated agent fleet with ping and remove.',
    howTo: 'More → Agents. Tap Ping to simulate health. Add custom agents with safe local endpoints.',
    demoLimit: 'No real WebSocket health checks on the public site.',
    navigate: { tab: 'more', moreView: 'agents' },
  },
  {
    id: 'logs',
    name: 'Logs',
    area: 'more',
    summary: 'Local activity log of demo actions.',
    howTo: 'More → Logs. Review info/warn/error/debug lines from vault, agents, and connection changes.',
    navigate: { tab: 'more', moreView: 'logs' },
  },
  {
    id: 'personas',
    name: 'Personas',
    area: 'more',
    summary: 'Built-in AI personas for chat tone and focus.',
    howTo: 'More → Personas to browse. In Chat, use the persona dropdown to switch.',
    navigate: { tab: 'more', moreView: 'personas' },
  },
  {
    id: 'art',
    name: 'AI Art',
    area: 'more',
    summary: 'Mock image studio with prompt history.',
    howTo: 'More → AI Art (or Home quick action). Enter a prompt to queue a demo artwork card.',
    demoLimit: 'No external image generation API.',
    navigate: { tab: 'more', moreView: 'art' },
  },
  {
    id: 'phone',
    name: 'Phone booking',
    area: 'more',
    summary: 'Mock restaurant / venue booking UI.',
    howTo: 'More → Phone booking. Create a demo reservation with venue, party size, and time.',
    demoLimit: 'UI only — no real calls.',
    navigate: { tab: 'more', moreView: 'phone' },
  },
  {
    id: 'paywall',
    name: 'Plans',
    area: 'more',
    summary: 'Subscription tiers for the demo user.',
    howTo: 'More → Plans (or Home Upgrade). Tap a tier to switch local credits/tier.',
    demoLimit: 'No Stripe or real billing.',
    navigate: { tab: 'more', moreView: 'paywall' },
  },
  {
    id: 'connection',
    name: 'Connection',
    area: 'more',
    summary: 'Gateway endpoint type and safe URL for demos.',
    howTo: 'More → Connection. Enable custom endpoint, choose Local/Cloud/Default, use ws://localhost:… only.',
    demoLimit: 'Credentialed URLs and API keys are blocked.',
    navigate: { tab: 'more', moreView: 'connection' },
  },
  {
    id: 'appearance',
    name: 'Appearance',
    area: 'more',
    summary: 'Deep OLED + Aurora dark look; three button systems (solid, soft, glow).',
    howTo: 'More → Appearance. Pick button group A/B/C. Use sun/moon for light/dark.',
    navigate: { tab: 'more', moreView: 'appearance' },
  },
  {
    id: 'setup-coach',
    name: 'Setup coach',
    area: 'system',
    summary: 'AI-assisted tour, auto-configure, and setup Q&A.',
    howTo: 'Open the floating Setup coach. Start walkthrough, auto-configure, or ask a question.',
  },
  {
    id: 'security',
    name: 'Public security',
    area: 'security',
    summary: 'Secret redaction, vault policy, demo identity, localStorage only.',
    howTo: 'Never paste production keys. Use demo-* vault values. Coach and chat will refuse real-looking secrets.',
  },
  {
    id: 'native-auth',
    name: 'Native auth & sync',
    area: 'native-only',
    summary: 'Supabase auth and cloud sync exist only in the native Expo app.',
    howTo: 'Use the native MobileClaw app for accounts; this public site stays offline-first.',
    demoLimit: 'Not available on the public web demo.',
  },
]

/** Flatten catalog into LLM / offline context. */
export function buildFeaturesContext(): string {
  return FEATURE_CATALOG.map(
    (f) =>
      `- ${f.name} [${f.area}]: ${f.summary} How: ${f.howTo}${f.demoLimit ? ` Limit: ${f.demoLimit}` : ''}`,
  ).join('\n')
}

export function findFeatures(query: string): FeatureEntry[] {
  const q = query.toLowerCase()
  return FEATURE_CATALOG.filter(
    (f) =>
      f.id.includes(q) ||
      f.name.toLowerCase().includes(q) ||
      f.summary.toLowerCase().includes(q) ||
      f.howTo.toLowerCase().includes(q),
  )
}
