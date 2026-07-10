# OpenClaw One

Product site and interactive web companion for OpenClaw Mobile: AI chat, kanban, encrypted vault concepts, and device security checks.

**Live:** https://openclaw-one.pages.dev

> Public, no-account portfolio product in the same family as [trip-one](https://trip-one.pages.dev): grounded AI chat, light/dark UI, Cloudflare Pages, secrets server-side.

## What it does

- **Product narrative** â€” Sales-ready homepage that explains mobile agent ops clearly.
- **Task board demo** â€” Kanban columns that mirror the native app.
- **Vault UX demo** â€” Illustrates AES-style local secrets flow without storing real keys in the cloud.
- **Security checklist** â€” Network and device hygiene checks as a guided UI.
- **Companion chat** â€” Ask how to connect a gateway â€” answers from the docs graph.
- **Theme toggle** â€” Light/dark polished for App Store screenshots parity.

## Integrations

- **Expo / React Native app** â€” iOS & Android client via EAS
- **WebSocket agent gateway** â€” Real-time chat with your backend
- **Secure Store + biometrics** â€” Device-bound secrets patterns
- **OpenAI-assisted onboarding** â€” Setup chat on this site

## Engineering signals (for recruiters)

- Mobile + web: Expo RN product with matching marketing app
- Security-minded UX: vault, biometrics, threat checklist
- Real-time systems: WebSocket gateway integration story
- Design system: consistent tokens, a11y-sized controls

## Quick wins

- Deep link from site into Expo Go / TestFlight
- Live gateway status badge
- Push-notification preference mock
- Share encrypted backup flow docs

## Stack

- Vite + React 18 + TypeScript (strict)
- React Router
- Cloudflare Pages + Functions (`/api/chat`, `/api/health`)
- OpenAI `gpt-4o-mini` (optional; UI works without it)

## Develop

```bash
npm install
npm run dev
```

Copy `.env.example` to `.dev.vars` for Functions:

```
OPENAI_API_KEY=
AI_MODEL=gpt-4o-mini
```

## Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name openclaw-one --branch main
```

Set `OPENAI_API_KEY` on the Pages project for live chat.

`git push` updates GitHub only â€” deploy is a separate step.

## Privacy

No accounts. Chat sends the on-page context + your message to `/api/chat` when AI is configured. No ads, no tracking pixels.

## License

MIT
