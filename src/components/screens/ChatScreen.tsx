import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CHAT_PUBLIC_CONTEXT } from '../../data/seed'
import { appendChatMessage, createConversation, setTabMeta } from '../../lib/store'
import { useDemoStore } from '../../lib/useDemoStore'
import { redactSecrets } from '../../lib/security'

/**
 * Chat with conversations, personas, models, and grounded public /api/chat.
 */
export function ChatScreen() {
  const s = useDemoStore()
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  const messages = s.messages.filter((m) => m.conversationId === s.activeConversationId)
  const persona = s.personas.find((p) => p.id === s.activePersonaId)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, busy])

  async function send(e?: FormEvent) {
    e?.preventDefault()
    const text = redactSecrets(input.trim())
    if (!text || busy) return
    const convId = s.activeConversationId || createConversation('New chat')
    appendChatMessage(convId, 'user', text)
    setInput('')
    setBusy(true)
    setError(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: [
            CHAT_PUBLIC_CONTEXT,
            `Persona: ${persona?.name || 'OpenClaw'}`,
            `Model: ${s.selectedModel}`,
            `Open tasks: ${s.tasks.filter((t) => !t.completed).map((t) => t.title).join('; ')}`,
          ].join('\n'),
          product: 'mobileclaw-public-demo',
        }),
      })
      const data = (await res.json()) as { message?: string; error?: string }
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      appendChatMessage(convId, 'assistant', data.message || 'No response body.')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Chat failed'
      setError(msg)
      appendChatMessage(
        convId,
        'assistant',
        'Chat API unavailable. Offline demo reply: use More → Connection for local gateway notes. Real tokens stay blocked.',
        'failed',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="chat">
      <div className="chat-tools">
        <select
          aria-label="Conversation"
          value={s.activeConversationId}
          onChange={(e) => setTabMeta({ activeConversationId: e.target.value })}
        >
          {s.conversations.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <button type="button" className="chip" onClick={() => createConversation('New chat')}>
          + New
        </button>
        <select
          aria-label="Persona"
          value={s.activePersonaId}
          onChange={(e) => setTabMeta({ activePersonaId: e.target.value })}
        >
          {s.personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.emoji} {p.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Model"
          value={s.selectedModel}
          onChange={(e) =>
            setTabMeta({ selectedModel: e.target.value as typeof s.selectedModel })
          }
        >
          <option value="demo-fast">Demo Fast</option>
          <option value="demo-balanced">Demo Balanced</option>
          <option value="demo-deep">Demo Deep</option>
        </select>
      </div>

      <div className="chat-log" role="log" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={`bubble ${m.role === 'user' ? 'user' : 'bot'}`}>
            {m.role === 'assistant' ? (
              <span aria-hidden>{persona?.emoji || '⚡'}</span>
            ) : null}
            <div>
              {m.content}
              <div className="muted" style={{ marginTop: 6 }}>
                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {m.status === 'failed' ? ' · failed' : ''}
              </div>
            </div>
          </div>
        ))}
        {busy ? (
          <div className="bubble bot">
            <span aria-hidden>{persona?.emoji || '⚡'}</span>
            <div>Thinking…</div>
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      {error ? <p className="err pad">{error}</p> : null}

      <form className="composer" onSubmit={send}>
        <label className="visually-hidden" htmlFor="msg">
          Message
        </label>
        <textarea
          id="msg"
          rows={1}
          placeholder="Message (secrets are redacted)…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void send()
            }
          }}
        />
        <button type="submit" className="btn" disabled={busy || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}
