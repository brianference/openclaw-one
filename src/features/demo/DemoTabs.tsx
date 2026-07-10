export const DEMO_TABS = ['tasks', 'vault', 'scan'] as const
export type DemoTab = (typeof DEMO_TABS)[number]

export type DemoTabsProps = { value: DemoTab; onChange: (tab: DemoTab) => void }

export function DemoTabs({ value, onChange }: DemoTabsProps) {
  return (
    <div className="tabs" role="tablist" aria-label="Demo surfaces">
      {DEMO_TABS.map((tab) => (
        <button key={tab} type="button" role="tab" aria-selected={value === tab} className={`tab${value === tab ? ' is-active' : ''}`} onClick={() => onChange(tab)}>
          {tab}
        </button>
      ))}
    </div>
  )
}
