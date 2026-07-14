/**
 * Shareable deep links for the public demo (recruiter walkthroughs).
 * Examples: /chat, /tasks, /t/vault, /more/kanban, /?coach=1
 */

import type { MoreView, TabId } from '../data/seed'

const TABS: TabId[] = ['home', 'chat', 'tasks', 'brain', 'more']
const MORE: MoreView[] = [
  'hub',
  'kanban',
  'ideas',
  'trips',
  'vault',
  'agents',
  'logs',
  'personas',
  'art',
  'phone',
  'paywall',
  'connection',
  'design',
]

export type RouteState = {
  tab: TabId
  moreView: MoreView
  coach: boolean
}

export function parseLocation(pathname = window.location.pathname, search = window.location.search): RouteState {
  const path = pathname.replace(/\/+$/, '') || '/'
  const params = new URLSearchParams(search)
  const coach = params.get('coach') === '1' || params.get('coach') === 'true'

  // /t/<surface> short links
  const short = path.match(/^\/t\/([a-z-]+)$/i)
  if (short) {
    const key = short[1].toLowerCase()
    if ((TABS as string[]).includes(key) && key !== 'more') {
      return { tab: key as TabId, moreView: 'hub', coach }
    }
    if ((MORE as string[]).includes(key)) {
      return { tab: 'more', moreView: key as MoreView, coach }
    }
  }

  // /more/<view>
  const more = path.match(/^\/more(?:\/([a-z-]+))?$/i)
  if (more) {
    const view = (more[1] || 'hub').toLowerCase()
    return {
      tab: 'more',
      moreView: (MORE as string[]).includes(view) ? (view as MoreView) : 'hub',
      coach,
    }
  }

  // /chat /tasks /brain /home
  const tabMatch = path.match(/^\/(home|chat|tasks|brain)$/i)
  if (tabMatch) {
    return { tab: tabMatch[1].toLowerCase() as TabId, moreView: 'hub', coach }
  }

  return { tab: 'home', moreView: 'hub', coach }
}

export function pathFor(tab: TabId, moreView: MoreView = 'hub'): string {
  if (tab === 'home') return '/'
  if (tab === 'more') {
    return moreView === 'hub' ? '/more' : `/t/${moreView}`
  }
  return `/${tab}`
}

/** Update URL without full reload. */
export function pushRoute(tab: TabId, moreView: MoreView = 'hub', replace = false): void {
  const path = pathFor(tab, moreView)
  const url = `${path}${window.location.search.replace(/[?&]coach=[^&]*/g, '').replace(/^&/, '?')}`
  const clean = url.replace(/\?$/, '')
  if (replace) window.history.replaceState({ tab, moreView }, '', clean || '/')
  else window.history.pushState({ tab, moreView }, '', clean || '/')
}
