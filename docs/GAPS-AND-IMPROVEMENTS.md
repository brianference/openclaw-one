# Critical gaps and highest-value improvements

Generated after full MobileClaw feature port (public anonymized demo) and 1,021 automated simulations (5 modes).

## 10 critical gaps

1. **No real auth / multi-device sync** — native uses Supabase auth; public demo is single-browser localStorage only.
2. **AI Art is mock-only** — native image-generation edge function is not called (would expose keys / cost).
3. **Phone reservation is mock-only** — no real telephony or booking provider.
4. **Vault is not encrypted at rest** — values are demo placeholders with masking UI, not AES-GCM like native.
5. **No real agent WebSocket ping** — agent status is randomized simulation, not network health.
6. **Chat models are labeled demos** — no NVIDIA NIM / Claude routing; only public `/api/chat` when configured.
7. **Attachments / voice / camera** — native file upload, transcription, and image picker are not on the web demo.
8. **No push notifications or biometrics** — mobile-only surfaces omitted intentionally.
9. **Itinerary editing is read-mostly** — trips can be added; per-day itinerary CRUD is thinner than native.
10. **Paywall cannot charge** — plan switch is local UI state only (no Stripe).

## 10 highest-value improvements

| # | Item | Status |
|---|------|--------|
| 1 | PWA install + offline shell | **Done** — `manifest.webmanifest` + `sw.js` |
| 2 | Drag-and-drop kanban | **Done** — HTML5 DnD + tap-to-advance |
| 3 | In-app modals (no `prompt`) | **Done** — shared `Modal` for create flows |
| 4 | Brain full-text search | **Done** |
| 5 | Conversation sidebar | **Done** — chat rail on wider phone/desktop |
| 6 | Optional WebCrypto vault | **Done** — PBKDF2 + AES-GCM local lock |
| 7 | A11y (tab roving + live toasts) | **Done** |
| 8 | Visual / UI matrix | **Done** — `npm run test:ui` (+ optional PLAYWRIGHT=1) |
| 9 | Shareable deep links | **Done** — `/chat`, `/t/vault`, `/?coach=1` |
| 10 | Grounded chat context strip | **Done** |

## Simulation summary

| Mode | Intent | Result |
|------|--------|--------|
| store-ops | CRUD / transitions | pass |
| security | redaction + vault policy | pass |
| coverage | every feature surface | pass |
| chaos | random/invalid input | pass |
| invariants | post-conditions | pass |

Total: **1021** assertions, **0** failures (target ≥ 300).
