/**
 * Optional local-only WebCrypto vault lock (PBKDF2 + AES-GCM).
 * Demo secrets only — passphrase never leaves the browser.
 */

const META_KEY = 'mobileclaw-vault-crypto-v1'

export type VaultCryptoMeta = {
  salt: string
  iv: string
  ciphertext: string
  unlocked: boolean
}

function b64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let s = ''
  bytes.forEach((b) => {
    s += String.fromCharCode(b)
  })
  return btoa(s)
}

function fromB64(s: string): Uint8Array {
  const bin = atob(s)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const base = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, [
    'deriveKey',
  ])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 120_000, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export function loadVaultMeta(): VaultCryptoMeta | null {
  try {
    const raw = localStorage.getItem(META_KEY)
    if (!raw) return null
    return JSON.parse(raw) as VaultCryptoMeta
  } catch {
    return null
  }
}

export function clearVaultMeta(): void {
  localStorage.removeItem(META_KEY)
}

/** Lock vault payload with a passphrase. */
export async function lockVaultPayload(passphrase: string, plaintextJson: string): Promise<void> {
  if (!passphrase || passphrase.length < 4) {
    throw new Error('Passphrase must be at least 4 characters')
  }
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(passphrase, salt)
  const enc = new TextEncoder()
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintextJson))
  const meta: VaultCryptoMeta = {
    salt: b64(salt),
    iv: b64(iv),
    ciphertext: b64(ciphertext),
    unlocked: false,
  }
  localStorage.setItem(META_KEY, JSON.stringify(meta))
}

/** Unlock and return vault JSON string. */
export async function unlockVaultPayload(passphrase: string): Promise<string> {
  const meta = loadVaultMeta()
  if (!meta) throw new Error('No locked vault')
  const key = await deriveKey(passphrase, fromB64(meta.salt))
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromB64(meta.iv) },
    key,
    fromB64(meta.ciphertext),
  )
  const text = new TextDecoder().decode(plain)
  localStorage.setItem(META_KEY, JSON.stringify({ ...meta, unlocked: true }))
  return text
}

export function markVaultLocked(): void {
  const meta = loadVaultMeta()
  if (!meta) return
  localStorage.setItem(META_KEY, JSON.stringify({ ...meta, unlocked: false }))
}

export function isVaultLockedOnDisk(): boolean {
  return Boolean(loadVaultMeta()?.ciphertext)
}
