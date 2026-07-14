/**
 * Setup coach: walkthrough steps, auto-configure, offline Q&A intents.
 */

import { FEATURE_CATALOG, buildFeaturesContext, findFeatures } from '../data/featuresCatalog'
import type { DesignOption, MoreView, TabId, ThemeMode } from '../data/seed'
import {
  addAgent,
  addArtPrompt,
  addNote,
  addTask,
  addTrip,
  addVaultItem,
  getState,
  markAutoConfigured,
  pingAgent,
  setButtonStyle,
  setConnection,
  setDesign,
  setTabMeta,
  setThemeMode,
  setTier,
} from './store'
import { applyChrome, chooseButtonStyle } from '../theme'
import { SAFE_DEMO_ENDPOINTS } from './security'

export type NavTarget = { tab: TabId; moreView?: MoreView }

export type WalkStep = {
  id: string
  title: string
  body: string
  nav: NavTarget
}

export const WALKTHROUGH: WalkStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to MobileClaw',
    body: 'This public demo mirrors the native app without real accounts or secrets. I’ll walk you through each area, or you can auto-configure a recommended setup.',
    nav: { tab: 'home' },
  },
  {
    id: 'home',
    title: 'Home dashboard',
    body: 'Home shows your plan, credits, quick actions, stats, and shortcuts into Chat, Vault, Agents, and more. Everything here is sample data for user Alex.',
    nav: { tab: 'home' },
  },
  {
    id: 'chat',
    title: 'Chat & personas',
    body: 'Chat supports multiple conversations, built-in personas, and demo models. Messages that look like API keys are redacted. Live AI needs a server key; offline replies still work.',
    nav: { tab: 'chat' },
  },
  {
    id: 'tasks',
    title: 'Tasks',
    body: 'Track work with All / Active / Done filters. Tap the circle to complete. New tasks stay in this browser only.',
    nav: { tab: 'tasks' },
  },
  {
    id: 'brain',
    title: 'Brain (second brain)',
    body: 'Notes by category: idea, note, todo, research. Pin the ones that matter. Great for agent runbooks and product ideas.',
    nav: { tab: 'brain' },
  },
  {
    id: 'kanban',
    title: 'Kanban board',
    body: 'Move work across Backlog → Next → Progress → Done. Tap a card to advance. Perfect for demo sprint boards.',
    nav: { tab: 'more', moreView: 'kanban' },
  },
  {
    id: 'vault',
    title: 'Vault (safe demo)',
    body: 'Vault shows masked demo secrets. Real-looking credentials are rejected. Never paste production keys on this public site.',
    nav: { tab: 'more', moreView: 'vault' },
  },
  {
    id: 'agents',
    title: 'Agents',
    body: 'Monitor a simulated fleet. Ping updates status for the demo. Native apps can hit real gateways; here we stay local and safe.',
    nav: { tab: 'more', moreView: 'agents' },
  },
  {
    id: 'appearance',
    title: 'Appearance & buttons',
    body: 'Look is Deep OLED with Soft Aurora night colors. Choose button group A Solid, B Soft, or C Glow under More → Appearance. Theme toggle is sun/moon only.',
    nav: { tab: 'more', moreView: 'appearance' },
  },
  {
    id: 'connection',
    title: 'Connection',
    body: 'Point at a local demo gateway URL if you want. Tokens and credentialed cloud URLs are blocked. Auto-configure sets a safe localhost WebSocket.',
    nav: { tab: 'more', moreView: 'connection' },
  },
  {
    id: 'done',
    title: 'You’re ready',
    body: 'That’s the tour. Use Auto-configure for a polished starter setup, or ask me anything about features. Full guide: docs/FEATURES.md in the repo.',
    nav: { tab: 'home' },
  },
]

export type AutoConfigResult = {
  applied: string[]
  message: string
}

/** Apply recommended public-demo configuration (never real secrets). */
export function autoConfigureEverything(): AutoConfigResult {
  const applied: string[] = []

  setDesign('oled')
  setThemeMode('dark')
  setButtonStyle('solid')
  applyChrome('oled', 'dark', 'solid')
  applied.push('Look → Deep OLED + Aurora dark · buttons Solid')

  setTier('pro')
  applied.push('Plan → Pro (demo credits)')

  setTabMeta({ activePersonaId: 'p-openclaw', selectedModel: 'demo-balanced' })
  applied.push('Persona → OpenClaw · Model → Demo Balanced')

  const conn = setConnection(true, 'local', SAFE_DEMO_ENDPOINTS.local)
  if (conn.ok) applied.push(`Connection → local ${SAFE_DEMO_ENDPOINTS.local}`)
  else applied.push(`Connection skipped: ${conn.error}`)

  addTask('Try the Setup coach walkthrough', 'personal')
  addTask('Explore Vault with demo values only', 'work')
  applied.push('Tasks → starter checklist items')

  addNote(
    'Setup complete',
    'Auto-configured by Setup coach. Public demo uses localStorage only — no production secrets.',
    'note',
  )
  applied.push('Brain → setup note')

  addTrip('Demo city weekend', 'Sample Coast')
  applied.push('Trips → sample trip')

  const vault = addVaultItem('Demo gateway token', 'demo-gateway-token-not-real', 'api_key')
  if (vault.ok) applied.push('Vault → demo token item')
  else applied.push(`Vault: ${vault.error}`)

  addArtPrompt('Minimal lightning mascot, soft neon, MobileClaw public demo')
  applied.push('AI Art → sample prompt')

  const agents = getState().agents
  agents.forEach((a) => pingAgent(a.id))
  applied.push(`Agents → pinged ${agents.length} (simulated)`)

  if (!agents.some((a) => a.name === 'Setup coach relay')) {
    addAgent('Setup coach relay', 'chat')
    applied.push('Agents → Setup coach relay')
  }

  markAutoConfigured()

  return {
    applied,
    message: `Configured ${applied.length} settings for a safe public demo. No real secrets were stored.`,
  }
}

export type CoachAction =
  | { type: 'navigate'; nav: NavTarget }
  | { type: 'auto-configure'; result: AutoConfigResult }
  | { type: 'set-design'; design: DesignOption }
  | { type: 'set-theme'; mode: ThemeMode }
  | { type: 'start-walkthrough' }
  | { type: 'none' }

export type CoachReply = {
  text: string
  actions: CoachAction[]
}

/** Offline intent router — always available without API keys. */
export function answerSetupLocally(userText: string): CoachReply {
  const q = userText.trim().toLowerCase()
  const actions: CoachAction[] = []

  if (!q) {
    return {
      text: 'Ask me to start a tour, auto-configure, open a feature, or explain how something works.',
      actions,
    }
  }

  if (/\b(auto[-\s]?configure|set\s*up\s*everything|configure\s*all|one[-\s]?click|recommended\s*setup)\b/.test(q)) {
    const result = autoConfigureEverything()
    actions.push({ type: 'auto-configure', result })
    return {
      text: `${result.message}\n\n${result.applied.map((a) => `• ${a}`).join('\n')}`,
      actions,
    }
  }

  if (/\b(start\s*(the\s*)?(tour|walkthrough|walk\s*through)|guide\s*me|show\s*me\s*around)\b/.test(q)) {
    actions.push({ type: 'start-walkthrough' })
    return {
      text: 'Starting the guided walkthrough. Use Next / Back in the coach panel.',
      actions,
    }
  }

  if (/\b(solid|fill)\b/.test(q) && /\b(button|btn|cta)\b/.test(q)) {
    chooseButtonStyle('solid')
    actions.push({ type: 'navigate', nav: { tab: 'more', moreView: 'appearance' } })
    return { text: 'Applied **Solid fill** buttons (group A).', actions }
  }
  if (/\b(soft|tint|glass)\b/.test(q) && /\b(button|btn|cta)\b/.test(q)) {
    chooseButtonStyle('soft')
    actions.push({ type: 'navigate', nav: { tab: 'more', moreView: 'appearance' } })
    return { text: 'Applied **Soft tint** buttons (group B).', actions }
  }
  if (/\b(glow|outline|neon)\b/.test(q) && /\b(button|btn|cta|look)\b/.test(q)) {
    chooseButtonStyle('glow')
    actions.push({ type: 'navigate', nav: { tab: 'more', moreView: 'appearance' } })
    return { text: 'Applied **Outline glow** buttons (group C).', actions }
  }
  if (/\b(oled|aurora|liquid|design)\b/.test(q)) {
    setDesign('oled')
    applyChrome('oled', getState().themeMode, getState().buttonStyle)
    actions.push({ type: 'navigate', nav: { tab: 'more', moreView: 'appearance' } })
    return {
      text: 'Product look is locked to **Deep OLED + Soft Aurora dark**. Open Appearance to pick button groups A/B/C.',
      actions,
    }
  }

  if (/\b(light\s*mode|day\s*mode)\b/.test(q)) {
    setThemeMode('light')
    applyChrome('oled', 'light', getState().buttonStyle)
    actions.push({ type: 'set-theme', mode: 'light' })
    return { text: 'Switched to **light** mode.', actions }
  }
  if (/\b(dark\s*mode|night\s*mode)\b/.test(q)) {
    setThemeMode('dark')
    applyChrome('oled', 'dark', getState().buttonStyle)
    actions.push({ type: 'set-theme', mode: 'dark' })
    return { text: 'Switched to **dark** (Aurora night) mode.', actions }
  }

  // Open feature by name
  const openMatch = q.match(/\b(?:open|show|go\s*to|take\s*me\s*to)\s+([a-z][a-z\s-]{1,30})/)
  if (openMatch) {
    const found = findFeatures(openMatch[1].trim())
    const hit = found.find((f) => f.navigate) || found[0]
    if (hit?.navigate) {
      actions.push({
        type: 'navigate',
        nav: {
          tab: hit.navigate.tab,
          moreView: hit.navigate.moreView as MoreView | undefined,
        },
      })
      return {
        text: `Opening **${hit.name}**. ${hit.howTo}${hit.demoLimit ? `\n\nNote: ${hit.demoLimit}` : ''}`,
        actions,
      }
    }
  }

  // Feature Q&A
  const hits = findFeatures(q)
  if (hits.length > 0) {
    const top = hits.slice(0, 3)
    const first = top[0]
    if (first.navigate) {
      actions.push({
        type: 'navigate',
        nav: {
          tab: first.navigate.tab,
          moreView: first.navigate.moreView as MoreView | undefined,
        },
      })
    }
    return {
      text: top
        .map(
          (f) =>
            `**${f.name}** — ${f.summary}\nHow: ${f.howTo}${f.demoLimit ? `\nLimit: ${f.demoLimit}` : ''}`,
        )
        .join('\n\n'),
      actions,
    }
  }

  if (/\b(feature|what can|capabilities|list)\b/.test(q)) {
    const names = FEATURE_CATALOG.filter((f) => f.area !== 'native-only')
      .map((f) => f.name)
      .join(', ')
    return {
      text: `Public demo features: ${names}. Ask about any one for details, or say “start the tour”.`,
      actions,
    }
  }

  if (/\b(secret|api key|password|safe|security)\b/.test(q)) {
    return {
      text: 'This public demo never wants production secrets. Vault rejects real-looking keys; chat redacts them. Use demo-* values only. Native MobileClaw encrypts vault data on-device.',
      actions: [{ type: 'navigate', nav: { tab: 'more', moreView: 'vault' } }],
    }
  }

  return {
    text: 'I can start a walkthrough, auto-configure the demo, switch designs, open features, or explain any surface. Try: “auto configure”, “start tour”, or “open vault”.',
    actions,
  }
}

/** Context blob for optional /api/chat setup mode. */
export function buildSetupAiContext(): string {
  const s = getState()
  return [
    'You are the MobileClaw Setup Coach on the public product demo.',
    'Help users set up, walk through, and configure the demo safely.',
    'Never ask for or accept real API keys, passwords, or private endpoints.',
    'Prefer concrete steps. If configuring, describe demo-safe actions only.',
    '',
    'FEATURE CATALOG:',
    buildFeaturesContext(),
    '',
    'CURRENT STATE:',
    `design=${s.design} theme=${s.themeMode} tier=${s.user.tier} connection.enabled=${s.connection.enabled} url=${s.connection.url}`,
    `tasks=${s.tasks.length} notes=${s.notes.length} agents=${s.agents.length} conversations=${s.conversations.length}`,
    '',
    'If the user wants auto-configure, tell them to press Auto-configure or say "auto configure everything" (client applies it).',
  ].join('\n')
}
