# Design plugin findings (MobileClaw)

Generated from **ui-ux-pro-max** + **mobile-dashboard-design** against the public demo.

## Design system recommendation

| Dimension | Recommendation | Applied? |
|-----------|----------------|----------|
| Pattern | Real-time / ops product, dark utility | Yes — OLED + Aurora night |
| Style | Dark Mode (OLED) for AI/ops tools | Yes |
| Typography | Inter (precision / developer tools) | Yes |
| Icons | **SVG only — no emoji as nav/system icons** | **Yes (this pass)** |
| Touch | ≥44×44px targets, 8px gap | Yes (tabs, tiles, icon badges) |
| Nav | Bottom tabs ≤5, icon + label | Yes |
| Motion | 150–300ms, honor reduced-motion | Yes (`prefers-reduced-motion`) |

## Critical anti-pattern fixed

**Emoji as structural icons** (ui-ux-pro-max § Icons):

> Emojis are font-dependent, inconsistent across platforms, and cannot be controlled via design tokens.

**Before:** `⌂ 💬 ✓ 🧠 •••`, hub rows with 📋 💡 ✈️, etc.  
**After:** Lucide-style stroke SVG set in `src/components/icons.tsx` with `currentColor` theming.

Decorative content (persona avatars, trip cover emojis in seed data) may remain as content, not chrome.

## Icon system

- Single stroke width (~1.75–2.1)
- 24×24 viewBox, sized 18–24px in UI
- Active tab: slightly heavier stroke
- `IconBadge` soft tile for list rows
- `tile-ico` / `f-tile` for home grid

## Further improvements (not all shipped)

1. Replace remaining content emoji in Brain filter chips with small SVG
2. Plus Jakarta Sans optional if we want “enterprise SaaS” warmer headings
3. Skeleton loaders for chat send >300ms
4. Gesture tutorial for kanban drag on first visit
5. Visual regression via Playwright screenshots in CI

## Commands used

```bash
python search.py "AI agent mobile command productivity dark dashboard" --design-system -p "MobileClaw"
python search.py "minimal dark utility mobile app icons" --domain style
python search.py "modern professional mobile productivity" --domain typography
python search.py "icon navigation accessibility touch targets no emoji" --domain ux
```
