import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { CHAT_PUBLIC_CONTEXT } from '../../data/seed'
import { appendChatMessage, createConversation, setTabMeta } from '../../lib/store'
import { useDemoStore } from '../../lib/useDemoStore'
import { redactSecrets } from '../../lib/security'
import { useToast } from '../ui/Toast'

/**
 * Chat with conversations, personas, models, grounded context strip, desktop rail.
 */
export function ChatScreen() {
  const s = useDemoStore()
  const { toast } = useToast()
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSources, setLastSources] = useState<string[]>([])
  const endRef = useRef<HTMLDivElement>(null)

  const messages = s.messages.filter((m) => m.conversationId === s.activeConversationId)
  const persona = s.personas.find((p) => p.id === s.activePersonaId)

  const contextSlices = useMemo(() => {
    const openTasks = s.tasks.filter((t) => !t.completed).map((t) => t.title)
    return [
      { id: 'product', label: 'Product', text: CHAT_PUBLIC_CONTEXT.slice(0, 120) + '…' },
      { id: 'persona', label: 'Persona', text: persona?.name || 'OpenClaw' },
      { id: 'model', label: 'Model', text: s.selectedModel },
      {
        id: 'tasks',
        label: 'Open tasks',
        text: openTasks.length ? openTasks.join('; ') : '(none)',
      },
      {
        id: 'notes',
        label: 'Pinned notes',
        text: s.notes
          .filter((n) => n.pinned)
          .map((n) => n.title)
          .join('; ') || '(none)',
      },
    ]
  }, [s.tasks, s.notes, s.selectedModel, persona?.name])

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

    const used = contextSlices.map((c) => c.label)
    setLastSources(used)

    const context = [
      CHAT_PUBLIC_CONTEXT,
      `Persona: ${persona?.name || 'OpenClaw'}`,
      `Model: ${s.selectedModel}`,
      `Open tasks: ${s.tasks.filter((t) => !t.completed).map((t) => t.title).join('; ')}`,
      `Pinned notes: ${s.notes.filter((n) => n.pinned).map((n) => n.title).join('; ')}`,
    ].join('\n')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context,
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
    <div className="chat-layout">
      <aside className="chat-rail" aria-label="Conversations">
        <div className="chat-rail-head">
          <strong>Chats</strong>
          <button
            type="button"
            className="chip"
            onClick={() => {
              createConversation('New chat')
              toast('Conversation created')
            }}
          >
            + New
          </button>
        </div>
        <div className="chat-rail-list">
          {s.conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chat-rail-item${c.id === s.activeConversationId ? ' is-on' : ''}`}
              onClick={() => setTabMeta({ activeConversationId: c.id })}
            >
              <span className="row-title">{c.title}</span>
              <span className="muted">{new Date(c.updatedAt).toLocaleDateString()}</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="chat">
        <div className="chat-tools">
          <select
            className="chat-conv-select"
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
          <button
            type="button"
            className="chip chat-new-mobile"
            onClick={() => {
              createConversation('New chat')
              toast('Conversation created')
            }}
          >
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

        <div className="ctx-strip" aria-label="Grounding context for AI answers">
          <span className="ctx-label">Grounded on</span>
          {contextSlices.map((slice) => (
            <span
              key={slice.id}
              className={`ctx-chip${lastSources.includes(slice.label) ? ' is-hot' : ''}`}
              title={slice.text}
            >
              {slice.label}
            </span>
          ))}
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
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
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
        {lastSources.length > 0 ? (
          <p className="ctx-footnote muted pad">
            Last reply used: {lastSources.join(' · ')}
          </p>
        ) : null}

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
    </div>
  )
}
