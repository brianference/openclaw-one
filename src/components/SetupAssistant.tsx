import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { MoreView, TabId } from '../data/seed'
import {
  WALKTHROUGH,
  answerSetupLocally,
  autoConfigureEverything,
  buildSetupAiContext,
  type CoachAction,
} from '../lib/setupAssistant'
import { markAutoConfigured, patchSetup } from '../lib/store'
import { useDemoStore } from '../lib/useDemoStore'
import { redactSecrets } from '../lib/security'

export type SetupAssistantProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (tab: TabId, moreView?: MoreView) => void
}

type ChatLine = { id: string; role: 'user' | 'assistant'; text: string }

/**
 * Floating setup coach: walkthrough, auto-configure, and setup Q&A.
 */
export function SetupAssistant({ open, onOpenChange, onNavigate }: SetupAssistantProps) {
  const state = useDemoStore()
  const [mode, setMode] = useState<'home' | 'tour' | 'chat'>('home')
  const [step, setStep] = useState(state.setup.lastStepIndex || 0)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [lines, setLines] = useState<ChatLine[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hi — I’m the Setup coach. I can walk you through MobileClaw, auto-configure a safe demo, or answer how any feature works. No real secrets, please.',
    },
  ])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && !state.setup.coachSeen) {
      patchSetup({ coachSeen: true })
    }
  }, [open, state.setup.coachSeen])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines.length, open, mode])

  function runActions(actions: CoachAction[]) {
    for (const action of actions) {
      if (action.type === 'navigate') {
        onNavigate(action.nav.tab, action.nav.moreView)
      }
      if (action.type === 'start-walkthrough') {
        setMode('tour')
        setStep(0)
        patchSetup({ lastStepIndex: 0 })
        onNavigate(WALKTHROUGH[0].nav.tab, WALKTHROUGH[0].nav.moreView)
      }
      if (action.type === 'auto-configure') {
        markAutoConfigured()
      }
      if (action.type === 'set-design' || action.type === 'set-theme') {
        /* already applied in answerSetupLocally */
      }
    }
  }

  function goStep(index: number) {
    const clamped = Math.max(0, Math.min(WALKTHROUGH.length - 1, index))
    setStep(clamped)
    patchSetup({ lastStepIndex: clamped })
    const s = WALKTHROUGH[clamped]
    onNavigate(s.nav.tab, s.nav.moreView)
    if (clamped === WALKTHROUGH.length - 1) {
      patchSetup({ walkthroughCompleted: true })
    }
  }

  function handleAutoConfigure() {
    const result = autoConfigureEverything()
    markAutoConfigured()
    setLines((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: `${result.message}\n\n${result.applied.map((x) => `• ${x}`).join('\n')}`,
      },
    ])
    setMode('chat')
    onNavigate('home')
  }

  async function onAsk(e?: FormEvent) {
    e?.preventDefault()
    const text = redactSecrets(input.trim())
    if (!text || busy) return
    setInput('')
    setLines((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text }])
    setBusy(true)

    // Always try local intents first (instant auto-config / navigation)
    const local = answerSetupLocally(text)
    const needsLlm =
      local.text.startsWith('I can start a walkthrough') ||
      (local.actions.length === 0 &&
        !/\b(auto|tour|walk|liquid|oled|aurora|light|dark|open|vault|chat|task)\b/i.test(text))

    if (!needsLlm || local.actions.length > 0) {
      runActions(local.actions)
      setLines((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', text: local.text },
      ])
      setBusy(false)
      return
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: buildSetupAiContext(),
          product: 'mobileclaw-setup-coach',
        }),
      })
      const data = (await res.json()) as { message?: string; error?: string }
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      setLines((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: data.message || local.text,
        },
      ])
    } catch {
      runActions(local.actions)
      setLines((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: `${local.text}\n\n(Live AI unavailable — used offline coach.)`,
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  const current = WALKTHROUGH[step]

  return (
    <>
      {!open ? (
        <button
          type="button"
          className="coach-fab"
          onClick={() => onOpenChange(true)}
          aria-label="Open setup coach"
        >
          <span aria-hidden>✨</span>
          Setup
          {!state.setup.walkthroughCompleted && !state.setup.coachDismissed ? (
            <span className="coach-dot" aria-hidden />
          ) : null}
        </button>
      ) : null}

      {open ? (
        <div className="coach-panel" role="dialog" aria-label="Setup coach">
          <header className="coach-header">
            <div>
              <strong>Setup coach</strong>
              <p className="muted" style={{ margin: 0 }}>
                Tour · auto-configure · Q&A
              </p>
            </div>
            <button
              type="button"
              className="icon-btn"
              aria-label="Close setup coach"
              onClick={() => {
                onOpenChange(false)
                patchSetup({ coachDismissed: true })
              }}
            >
              ✕
            </button>
          </header>

          <div className="coach-tabs">
            <button
              type="button"
              className={`chip${mode === 'home' ? ' is-on' : ''}`}
              onClick={() => setMode('home')}
            >
              Home
            </button>
            <button
              type="button"
              className={`chip${mode === 'tour' ? ' is-on' : ''}`}
              onClick={() => {
                setMode('tour')
                goStep(step)
              }}
            >
              Tour
            </button>
            <button
              type="button"
              className={`chip${mode === 'chat' ? ' is-on' : ''}`}
              onClick={() => setMode('chat')}
            >
              Ask
            </button>
          </div>

          {mode === 'home' ? (
            <div className="coach-body">
              <p>
                Get oriented in under two minutes. I never store production secrets — only demo-safe
                settings.
              </p>
              <div className="coach-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setMode('tour')
                    goStep(0)
                  }}
                >
                  Start walkthrough
                </button>
                <button type="button" className="btn btn-ghost" onClick={handleAutoConfigure}>
                  Auto-configure everything
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setMode('chat')}>
                  Ask a question
                </button>
              </div>
              {state.setup.autoConfiguredAt ? (
                <p className="ok">
                  Last auto-configure: {new Date(state.setup.autoConfiguredAt).toLocaleString()}
                </p>
              ) : null}
              <p className="muted">
                Full feature list: see <code>docs/FEATURES.md</code> in the repo, or ask “list
                features”.
              </p>
            </div>
          ) : null}

          {mode === 'tour' ? (
            <div className="coach-body">
              <p className="muted">
                Step {step + 1} of {WALKTHROUGH.length}
              </p>
              <h3 style={{ margin: '4px 0 8px' }}>{current.title}</h3>
              <p>{current.body}</p>
              <div className="coach-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={step === 0}
                  onClick={() => goStep(step - 1)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    if (step >= WALKTHROUGH.length - 1) {
                      setMode('home')
                      onNavigate('home')
                    } else {
                      goStep(step + 1)
                    }
                  }}
                >
                  {step >= WALKTHROUGH.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
              <div className="coach-progress" aria-hidden>
                <span style={{ width: `${((step + 1) / WALKTHROUGH.length) * 100}%` }} />
              </div>
            </div>
          ) : null}

          {mode === 'chat' ? (
            <div className="coach-chat">
              <div className="coach-log">
                {lines.map((line) => (
                  <div
                    key={line.id}
                    className={`coach-bubble ${line.role === 'user' ? 'user' : 'bot'}`}
                  >
                    {line.text.split('\n').map((part, i) => (
                      <p key={i} style={{ margin: i ? '6px 0 0' : 0 }}>
                        {part}
                      </p>
                    ))}
                  </div>
                ))}
                {busy ? <div className="coach-bubble bot">Thinking…</div> : null}
                <div ref={endRef} />
              </div>
              <form className="coach-form" onSubmit={onAsk}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Try “auto configure” or “open vault”'
                  aria-label="Ask the setup coach"
                />
                <button type="submit" className="btn" disabled={busy || !input.trim()}>
                  Send
                </button>
              </form>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
