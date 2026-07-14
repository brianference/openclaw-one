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

/**
 * Public MobileClaw companion — full feature surface, anonymized, local-only.
 */
export default function App() {
  const state = useDemoStore()
  const [tab, setTab] = useState<TabId>('home')
  const [moreView, setMoreView] = useState<MoreView>('hub')
  const [coachOpen, setCoachOpen] = useState(false)

  useEffect(() => {
    initTheme()
  }, [])

  useEffect(() => {
    applyChrome(state.design, state.themeMode)
  }, [state.design, state.themeMode])

  // First visit: open setup coach after a short beat
  useEffect(() => {
    if (!state.setup.coachSeen && !state.setup.coachDismissed) {
      const t = window.setTimeout(() => setCoachOpen(true), 600)
      return () => window.clearTimeout(t)
    }
  }, [state.setup.coachSeen, state.setup.coachDismissed])

  function openTab(next: TabId) {
    setTab(next)
    if (next === 'more') setMoreView('hub')
  }

  function openMore(view: MoreView) {
    setTab('more')
    setMoreView(view)
  }

  function navigate(nextTab: TabId, view?: MoreView) {
    setTab(nextTab)
    if (nextTab === 'more') setMoreView(view || 'hub')
  }

  const moreTitle =
    moreView === 'hub'
      ? 'More'
      : moreView.charAt(0).toUpperCase() + moreView.slice(1)

  return (
    <>
      <PhoneShell
        tab={tab}
        title={tab === 'more' ? moreTitle : undefined}
        onTabChange={openTab}
        themeMode={state.themeMode}
        design={state.design}
        onToggleTheme={() => toggleTheme()}
        onOpenDesign={() => openMore('design')}
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
            onView={setMoreView}
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
