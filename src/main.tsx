import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ToastProvider } from './components/ui/Toast'
import './styles.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root mount node')

createRoot(root).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* offline shell optional */
    })
  })
}
