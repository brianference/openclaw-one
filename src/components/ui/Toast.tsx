import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type ToastCtx = {
  toast: (message: string) => void
}

const Ctx = createContext<ToastCtx | null>(null)

/**
 * Live-region toasts for screen readers and action feedback.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)

  const toast = useCallback((msg: string) => {
    setMessage(msg)
    window.setTimeout(() => setMessage(null), 2400)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toast-live" role="status" aria-live="polite" aria-atomic="true">
        {message ? <div className="toast">{message}</div> : null}
      </div>
    </Ctx.Provider>
  )
}

export function useToast(): ToastCtx {
  const ctx = useContext(Ctx)
  if (!ctx) return { toast: () => undefined }
  return ctx
}
