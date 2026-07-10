import { DEMO } from '../../data/demo'

export function ScanPanel() {
  return (
    <>
      <h2>Security checklist</h2>
      <ul className="check-list">
        {DEMO.checks.map((check) => (
          <li key={check.id}>
            <span className={check.ok ? 'ok' : 'bad'}>{check.ok ? '✓' : '!'}</span> {check.label}
          </li>
        ))}
      </ul>
    </>
  )
}
