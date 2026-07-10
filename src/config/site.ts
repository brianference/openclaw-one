import type { SiteConfig } from './types'
export type { SiteConfig, FeatureItem, NavItem } from './types'

export const siteConfig: SiteConfig = {
  productId: 'openclaw-one',
  productName: 'OpenClaw One',
  kicker: 'OpenClaw One · mobile command for AI agents',
  tagline: 'Chat, tasks, vault, scan — on your phone.',
  lede: 'Product site for the Expo OpenClaw client. This web app demos the surfaces; the native repo is the real mobile binary.',
  githubUrl: 'https://github.com/brianference/openclaw-one',
  footerLine: 'Public face of openclaw-mobile ·',
  stackStrip: 'Stack: TypeScript · React · Vite · Cloudflare Pages · Expo · GitHub',
  finePrint: 'Native source: github.com/brianference/openclaw-mobile',
  nav: [
    { to: '/', label: 'Home', end: true },
    { to: '/app', label: 'Demo' },
    { to: '/features', label: 'Features' },
  ],
  features: [
    { title: 'Product narrative', description: 'Sales-ready homepage that explains mobile agent ops clearly.' },
    { title: 'Tabbed demos', description: 'Tasks, vault, and security scan as separate modules.' },
    { title: 'Native vs web labels', description: 'Honest about Expo vs browser demo.' },
    { title: 'Security checklist', description: 'Device hygiene patterns as a guided UI.' },
    { title: 'Companion chat', description: 'Ask how to connect a gateway.' },
    { title: 'Modular structure', description: 'Demo panels live in features/demo/*.' },
  ],
  heroPoints: ['Web demo', 'Native Expo', 'Security-minded', 'Light & dark'],
  ctaPrimary: { to: '/app', label: 'Open web demo' },
  ctaSecondary: { to: '/features', label: 'Features' },
}
