import { useState } from 'react'
import type { SiteConfig } from '../config/site'
import { Shell } from '../components/Shell'
import { DemoTabs, type DemoTab } from '../features/demo/DemoTabs'
import { TaskBoard } from '../features/demo/TaskBoard'
import { VaultPanel } from '../features/demo/VaultPanel'
import { ScanPanel } from '../features/demo/ScanPanel'

export type ProductPageProps = { config: SiteConfig }

export function ProductPage({ config }: ProductPageProps) {
  const [tab, setTab] = useState<DemoTab>('tasks')
  return (
    <Shell config={config}>
      <section className="panel">
        <div className="chips">
          <span className="chip chip-warn">Web demo</span>
          <span className="chip">Native: Expo / openclaw-mobile</span>
        </div>
        <h1>Mobile companion demos</h1>
        <p className="lede">Switch surfaces below. Chat is the dock FAB.</p>
        <DemoTabs value={tab} onChange={setTab} />
        {tab === 'tasks' ? <TaskBoard /> : null}
        {tab === 'vault' ? <VaultPanel /> : null}
        {tab === 'scan' ? <ScanPanel /> : null}
        <div className="sticky-cta">
          <a className="btn btn-primary" href="https://github.com/brianference/openclaw-mobile" target="_blank" rel="noreferrer">
            Get native app source
          </a>
        </div>
      </section>
    </Shell>
  )
}
