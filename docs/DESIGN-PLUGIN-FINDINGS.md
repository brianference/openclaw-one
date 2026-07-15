# Design plugin findings (MobileClaw)

Generated from **ui-ux-pro-max** + **mobile-dashboard-design** against the public demo.

## Design system recommendation

| Dimension | Recommendation | Applied? |
|-----------|----------------|----------|
| Pattern | Real-time / ops product, dark utility | Yes — OLED + Aurora night |
| Style | Dark Mode (OLED) for AI/ops tools | Yes |
| Typography | Inter (precision / developer tools) | Yes |
| Icons | **SVG only — no emoji as nav/system icons** | **Yes** |
| Touch | ≥44×44px targets, 8px gap | Yes (tabs, tiles, chips, checks) |
| Nav | Bottom tabs ≤5, icon + label | Yes |
| Motion | 150–300ms, honor reduced-motion | Yes (`prefers-reduced-motion`) |
| Press feedback | scale ~0.97 on active | Yes (btns, chips, checks, icon-btns) |

## Critical anti-pattern fixed

**Emoji as structural icons** (ui-ux-pro-max § Icons):

> Emojis are font-dependent, inconsistent across platforms, and cannot be controlled via design tokens.

| Surface | Before | After |
|---------|--------|-------|
| Bottom tabs | ⌂ 💬 ✓ 🧠 ••• | Lucide-style SVG |
| Home feature tiles | emoji | SVG in `tile-ico` |
| More hub rows | 📋 💡 ✈️ … | `IconBadge` SVG |
| Brain filter chips | 🧠 💡 📝 ✅ 🔬 | SVG + label chips |
| Task complete mark | text ✓ | SVG check, 44px hit |
| AI Art placeholder | 🖼️ | SVG `image` icon |

Decorative content (persona avatars, trip cover emojis in seed data) stays as **content**, not chrome.

## Icon system

- Single stroke width (~1.75–2.1); active state slightly heavier
- 24×24 viewBox, sized 12–36px in UI
- `IconBadge` soft tile for list rows
- `tile-ico` / `f-tile` for home grid
- `chip-ico` for filter chips with icon + label

## Plugin checklist (this pass)

- [x] No emojis as structural icons
- [x] cursor-pointer on clickable chrome
- [x] Hover / press transitions 150–300ms
- [x] Focus-visible rings
- [x] prefers-reduced-motion
- [x] Touch targets ≥44px on chips + task checks
- [ ] Skeleton loaders for chat send >300ms (optional)
- [ ] Gesture tutorial for kanban drag (optional)
- [ ] Playwright visual regression in CI (optional)

## Typography note

ui-ux-pro-max recommends **Inter** for developer / AI dashboards (shipped). Alternate: Plus Jakarta Sans for warmer “enterprise SaaS” headings — not applied to avoid thrashing the locked OLED+Aurora look.

## Commands used

```bash
python search.py "AI agent mobile command productivity dark dashboard" --design-system -p "MobileClaw"
python search.py "icon navigation accessibility no emoji touch targets loading" --domain ux
python search.py "minimal dark utility mobile icons professional" --domain style
python search.py "modern professional mobile productivity developer tools" --domain typography
```
