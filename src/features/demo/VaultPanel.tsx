/** Web-only illustration of vault principles (no real secrets). */
export function VaultPanel() {
  return (
    <div className="card">
      <h2>Secrets vault (demo)</h2>
      <p className="lede">Illustrates local encrypted storage patterns. No real secrets are stored in this site.</p>
      <ul className="check-list">
        <li>AES-style envelope on device (native Secure Store)</li>
        <li>Biometric unlock optional</li>
        <li>Never sync raw keys to the server</li>
      </ul>
      <p className="meta">This web card is UI only — implement secrets only in the Expo app.</p>
    </div>
  )
}
