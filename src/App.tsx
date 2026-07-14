import { useEffect, useState } from 'react'
import { PhoneShell } from './components/PhoneShell'
import { HomeScreen } from './components/screens/HomeScreen'
import { ChatScreen } from './components/screens/ChatScreen'
import { TasksScreen } from './components/screens/TasksScreen'
import { BrainScreen } from './components/screens/BrainScreen'
import { MoreScreen } from './components/screens/MoreScreen'
import { SetupAssistant } from './components/SetupAssistant'
import type { MoreView, TabId } from './data/seed'
import { applyChrome, initTheme, toggleTheme } from './theme'
import { useDemoStore } from './lib/useDemoStore'
import { parseLocation, pushRoute } from './lib/routes'

/**
 * Public MobileClaw companion — full feature surface, anonymized, local-only.
 */
export default function App() {
  const state = useDemoStore()
  const initial = parseLocation()
  const [tab, setTab] = useState<TabId>(initial.tab)
  const [moreView, setMoreView] = useState<MoreView>(initial.moreView)
  const [coachOpen, setCoachOpen] = useState(initial.coach)

  useEffect(() => {
    initTheme()
  }, [])

  useEffect(() => {
    applyChrome('oled', state.themeMode, state.buttonStyle)
  }, [state.themeMode, state.buttonStyle])

  // Sync browser history → app
  useEffect(() => {
    const onPop = () => {
      const r = parseLocation()
      setTab(r.tab)
      setMoreView(r.moreView)
      if (r.coach) setCoachOpen(true)
    }
    window.addEventListener('popstate', onPop)
    pushRoute(initial.tab, initial.moreView, true)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // First visit: open setup coach after a short beat
  useEffect(() => {
    if (!state.setup.coachSeen && !state.setup.coachDismissed && !initial.coach) {
      const t = window.setTimeout(() => setCoachOpen(true), 600)
      return () => window.clearTimeout(t)
    }
  }, [state.setup.coachSeen, state.setup.coachDismissed, initial.coach])

  function openTab(next: TabId) {
    setTab(next)
    const view = next === 'more' ? 'hub' : moreView
    if (next === 'more') setMoreView('hub')
    pushRoute(next, next === 'more' ? 'hub' : view)
  }

  function openMore(view: MoreView) {
    setTab('more')
    setMoreView(view)
    pushRoute('more', view)
  }

  function navigate(nextTab: TabId, view?: MoreView) {
    setTab(nextTab)
    const mv = nextTab === 'more' ? view || 'hub' : 'hub'
    if (nextTab === 'more') setMoreView(mv)
    pushRoute(nextTab, mv)
  }

  function setMore(view: MoreView) {
    setMoreView(view)
    pushRoute('more', view)
  }

  const moreTitle =
    moreView === 'hub' ? 'More' : moreView.charAt(0).toUpperCase() + moreView.slice(1)

  return (
    <>
      <PhoneShell
        tab={tab}
        title={tab === 'more' ? moreTitle : undefined}
        onTabChange={openTab}
        themeMode={state.themeMode}
        buttonStyle={state.buttonStyle}
        onToggleTheme={() => toggleTheme()}
        onOpenAppearance={() => openMore('appearance')}
        onOpenCoach={() => setCoachOpen(true)}
      >
        {tab === 'home' ? (
          <HomeScreen
            onOpenTab={openTab}
            onOpenMore={openMore}
            onOpenCoach={() => setCoachOpen(true)}
          />
        ) : null}
        {tab === 'chat' ? <ChatScreen /> : null}
        {tab === 'tasks' ? <TasksScreen /> : null}
        {tab === 'brain' ? <BrainScreen /> : null}
        {tab === 'more' ? (
          <MoreScreen
            view={moreView}
            onView={setMore}
            onOpenCoach={() => setCoachOpen(true)}
          />
        ) : null}
      </PhoneShell>

      <SetupAssistant
        open={coachOpen}
        onOpenChange={setCoachOpen}
        onNavigate={navigate}
      />
    </>
  )
}
