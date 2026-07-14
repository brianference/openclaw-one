# MobileClaw — feature guide

**Public demo:** https://openclaw-one.pages.dev  
**Native source:** https://github.com/brianference/mobileclaw (private Expo app)  
**Product site repo:** https://github.com/brianference/openclaw-one  

This document describes every surface in the **public web demo**. Native-only capabilities are marked clearly. The demo is anonymized: no real secrets, no Supabase keys in the browser, localStorage only.

---

## Product summary

MobileClaw is an AI agent command surface for mobile: chat with personas, tasks, second brain notes, kanban, trips, vault patterns, agent monitoring, and settings. The public site mirrors those flows so visitors can try the UX without accounts or credentials.

---

## Primary tabs

| Tab | What it does | Public demo notes |
|-----|----------------|-------------------|
| **Home** | Greeting, plan banner, quick actions, stats, feature grid, recent chats, trips | Seed data for user “Alex” |
| **Chat** | Multi-conversation chat, persona + model pickers, grounded assistant | Optional `/api/chat` when `OPENAI_API_KEY` is set on Pages; otherwise offline replies |
| **Tasks** | List, filter All/Active/Done, complete toggle, add task | Stored in `localStorage` |
| **Brain** | Second-brain notes by category (idea/note/todo/research), pin | Local only |
| **More** | Hub for secondary features | See below |

---

## More menu (secondary features)

| Feature | What it does | Public demo notes |
|---------|----------------|-------------------|
| **Kanban** | Columns: Backlog → Next → Progress → Done | Tap card to advance column |
| **Ideas** | Idea inbox with status cycle | Tap to cycle new → in-progress → done |
| **Trips** | Trip cards + day itinerary lines | Add trip; itinerary from seed |
| **Vault** | Named secrets with mask/reveal | **Demo values only**; real-looking credentials rejected |
| **Agents** | Fleet list, ping, add/remove | Ping is **simulated** status |
| **Logs** | Activity stream | Written by demo actions |
| **Personas** | Built-in assistants (OpenClaw, CodeMaster, Writer, Analyst, TripBot, Chef AI) | Used by Chat |
| **AI Art** | Prompt history + mock “generation” | No external image API |
| **Phone booking** | Mock table reservations | UI-only |
| **Plans (paywall)** | Free / Starter / Pro / Premium | Local tier only; no payments |
| **Connection** | Default / local / cloud endpoint toggle | Safe URLs only; tokens blocked |
| **Design options** | Liquid Glass / Deep OLED / Soft Aurora × light/dark | Persisted |
| **Setup coach** | AI-guided tour + auto-configure | See “Setup assistant” |

---

## Deep links (shareable)

| Path | Opens |
|------|--------|
| `/` or `/home` | Home |
| `/chat` | Chat |
| `/tasks` | Tasks |
| `/brain` | Brain |
| `/more` | More hub |
| `/t/vault`, `/t/kanban`, … | More surfaces |
| `/?coach=1` | Opens Setup coach |

## PWA

Installable via `manifest.webmanifest`. Service worker `sw.js` caches the shell and hashed assets for offline UI (API still needs network).

## Setup assistant (coach)

The floating **Setup coach** helps first-time visitors:

1. **Guided walkthrough** — step through Home → Chat → Tasks → Brain → More surfaces with short explanations and “Next / Back”.
2. **Auto-configure** — one tap applies a recommended public demo setup (design, theme, connection, tier, persona, sample content). Never writes real secrets.
3. **Q&A** — ask how to use a feature; answers from the feature catalog offline, or from `/api/chat` when the AI key is configured.
4. **Deep links into UI** — coach can open the correct tab/view while explaining it.

Commands the coach understands (examples):

- “Start the tour” / “Walk me through”
- “Auto configure everything”
- “Switch to OLED design” / “Use light mode”
- “Open vault” / “Show agents”
- “What can Chat do?” / “How does vault stay safe?”

---

## Security model (public)

| Rule | Detail |
|------|--------|
| No production secrets | Bundle scanned; vault rejects `sk-`, `ghp_`, JWT-like strings, etc. |
| Redaction | Chat and free-text fields strip secret-like patterns before storage/send |
| Demo identity | User “Alex” / `demo@openclaw.example` — not real PII |
| Local only | State key `mobileclaw-public-demo-v2` (migrates setup fields in-app) |
| Connection | Credentialed Supabase/OpenAI URLs blocked |

---

## Look & buttons

| Setting | Value |
|---------|--------|
| Structure | Deep OLED (dense utility chrome) |
| Dark mode | Soft Aurora night palette (`#0b1020`, indigo primary) |
| Light mode | Crisp OLED utility light |
| Buttons A | **Solid fill** (default) |
| Buttons B | **Soft tint** |
| Buttons C | **Outline glow** |

Change buttons in **More → Appearance** (not primary nav). Theme toggle is sun/moon only.

---

## Native-only (not fully on public web)

- Supabase auth and cloud sync  
- Real AES vault encryption  
- Real agent WebSocket health  
- Image generation edge function  
- Voice transcription  
- File attachments / camera  
- Push notifications, biometrics  
- Stripe billing  

---

## API (Cloudflare Pages Functions)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/health` | GET | Liveness |
| `/api/chat` | POST | Optional grounded assistant (`message`, `context`, `product`) |

---

## Related docs

- `docs/GAPS-AND-IMPROVEMENTS.md` — gaps and roadmap  
- `docs/UX-FEATURE-PLAN.md` — earlier portfolio plan (historical)  
- `docs/QUICK-WINS.md` — older quick wins list  

---

## Changelog note

Feature parity for the public demo was built against the MobileClaw Expo app structure (`app/(tabs)/*`, agents, vault patterns, personas) with intentional anonymization for public use.
