import { useEffect, useState } from 'react'
import { PhoneShell } from './components/PhoneShell'
import { HomeScreen } from './components/screens/HomeScreen'
import { ChatScreen } from './components/screens/ChatScreen'
import { TasksScreen } from './components/screens/TasksScreen'
import { BrainScreen } from './components/screens/BrainScreen'
import { MoreScreen } from './components/screens/MoreScreen'
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

  useEffect(() => {
    initTheme()
  }, [])

  useEffect(() => {
    applyChrome(state.design, state.themeMode)
  }, [state.design, state.themeMode])

  function openTab(next: TabId) {
    setTab(next)
    if (next === 'more') setMoreView('hub')
  }

  function openMore(view: MoreView) {
    setTab('more')
    setMoreView(view)
  }

  const moreTitle =
    moreView === 'hub'
      ? 'More'
      : moreView.charAt(0).toUpperCase() + moreView.slice(1)

  return (
    <PhoneShell
      tab={tab}
      title={tab === 'more' ? moreTitle : undefined}
      onTabChange={openTab}
      themeMode={state.themeMode}
      design={state.design}
      onToggleTheme={() => toggleTheme()}
      onOpenDesign={() => openMore('design')}
    >
      {tab === 'home' ? <HomeScreen onOpenTab={openTab} onOpenMore={openMore} /> : null}
      {tab === 'chat' ? <ChatScreen /> : null}
      {tab === 'tasks' ? <TasksScreen /> : null}
      {tab === 'brain' ? <BrainScreen /> : null}
      {tab === 'more' ? <MoreScreen view={moreView} onView={setMoreView} /> : null}
    </PhoneShell>
  )
}
