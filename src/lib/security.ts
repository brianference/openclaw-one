/**
 * Public-demo security helpers.
 * Never log, render, or ship real secrets. All vault/API values are demo-only.
 */

const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{10,}/g,
  /ghp_[a-zA-Z0-9]{20,}/g,
  /xox[baprs]-[a-zA-Z0-9-]{10,}/g,
  /eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{10,}/g,
  /Bearer\s+[a-zA-Z0-9._-]{20,}/gi,
  /supabase\.co\/[^\s"']+/gi,
  /password\s*[:=]\s*\S+/gi,
  /api[_-]?key\s*[:=]\s*\S+/gi,
]

/** Mask any string that looks like a credential for public display. */
export function maskSecret(value: string, visible = 4): string {
  if (!value) return '••••'
  if (value.length <= visible) return '•'.repeat(Math.max(4, value.length))
  return `${'•'.repeat(Math.min(12, value.length - visible))}${value.slice(-visible)}`
}

/** Strip secret-like substrings from free text before showing or sending to chat API. */
export function redactSecrets(text: string): string {
  let out = text
  for (const re of SECRET_PATTERNS) {
    out = out.replace(re, '[redacted]')
  }
  return out
}

/** Block persistence of values that look like real production credentials. */
export function isLikelyRealSecret(value: string): boolean {
  if (!value || value.length < 12) return false
  if (/^demo[-_]/i.test(value)) return false
  if (/^••••/.test(value) || value.includes('•')) return false
  return SECRET_PATTERNS.some((re) => {
    re.lastIndex = 0
    return re.test(value)
  })
}

/** Anonymized public identity — no real PII. */
export const PUBLIC_DEMO_USER = {
  id: 'demo-user',
  displayName: 'Alex',
  email: 'demo@openclaw.example',
  tier: 'pro' as const,
  credits: 420,
}

/** Safe mock endpoints — never real hosts with credentials. */
export const SAFE_DEMO_ENDPOINTS = {
  local: 'ws://localhost:18789',
  cloud: 'wss://gateway.example.invalid',
} as const
