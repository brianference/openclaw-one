import type { ButtonStyle, DesignOption, ThemeMode } from './data/seed'
import { getState, setButtonStyle, setDesign, setThemeMode } from './lib/store'

/**
 * Apply chrome: hybrid Deep OLED + Soft Aurora dark, plus button system.
 * data-design is always `oled` (structure); dark tokens = Aurora palette in CSS.
 */
export function applyChrome(
  design: DesignOption = 'oled',
  mode: ThemeMode = getState().themeMode,
  buttonStyle: ButtonStyle = getState().buttonStyle,
): void {
  const root = document.documentElement
  root.setAttribute('data-design', design || 'oled')
  root.setAttribute('data-theme', mode)
  root.setAttribute('data-btn', buttonStyle || 'solid')
  // Theme color for PWA / mobile chrome
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', mode === 'dark' ? '#0b1020' : '#fafafa')
  }
}

export function initTheme(): { design: DesignOption; mode: ThemeMode; buttonStyle: ButtonStyle } {
  const { design, themeMode, buttonStyle } = getState()
  const locked: DesignOption = 'oled'
  if (design !== 'oled') setDesign(locked)
  applyChrome(locked, themeMode, buttonStyle)
  return { design: locked, mode: themeMode, buttonStyle }
}

export function toggleTheme(): ThemeMode {
  const next: ThemeMode = getState().themeMode === 'dark' ? 'light' : 'dark'
  setThemeMode(next)
  applyChrome('oled', next, getState().buttonStyle)
  return next
}

export function chooseDesign(_design: DesignOption): void {
  setDesign('oled')
  applyChrome('oled', getState().themeMode, getState().buttonStyle)
}

export function chooseButtonStyle(style: ButtonStyle): void {
  setButtonStyle(style)
  applyChrome('oled', getState().themeMode, style)
}

export const DESIGN_META = {
  oled: {
    name: 'Deep OLED + Aurora night',
    tagline: 'Utility structure · aurora dark palette',
    blurb: 'Dense OLED chrome with Soft Aurora colors in dark mode. Light mode stays crisp OLED.',
  },
} as const

export const BUTTON_META: Record<
  ButtonStyle,
  { name: string; tagline: string; blurb: string }
> = {
  solid: {
    name: 'Solid fill',
    tagline: 'Bold primary CTAs',
    blurb: 'Filled primary, subtle ghost, high contrast — best default for mobile thumbs.',
  },
  soft: {
    name: 'Soft tint',
    tagline: 'Glass / muted chips',
    blurb: 'Tinted surfaces, lighter weight — calmer secondary actions and toolbars.',
  },
  glow: {
    name: 'Outline glow',
    tagline: 'Neon edge accents',
    blurb: 'Transparent fill with luminous border and soft outer glow — agent-ops vibe.',
  },
}
