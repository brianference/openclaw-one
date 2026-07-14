import type { DesignOption, ThemeMode } from './data/seed'
import { getState, setDesign, setThemeMode } from './lib/store'

/** Apply design option + light/dark to documentElement. */
export function applyChrome(design: DesignOption, mode: ThemeMode): void {
  const root = document.documentElement
  root.setAttribute('data-design', design)
  root.setAttribute('data-theme', mode)
}

export function initTheme(): { design: DesignOption; mode: ThemeMode } {
  const { design, themeMode } = getState()
  applyChrome(design, themeMode)
  return { design, mode: themeMode }
}

export function toggleTheme(): ThemeMode {
  const next: ThemeMode = getState().themeMode === 'dark' ? 'light' : 'dark'
  setThemeMode(next)
  applyChrome(getState().design, next)
  return next
}

export function chooseDesign(design: DesignOption): void {
  setDesign(design)
  applyChrome(design, getState().themeMode)
}

export const DESIGN_META: Record<
  DesignOption,
  { name: string; tagline: string; blurb: string }
> = {
  liquid: {
    name: 'Liquid Glass',
    tagline: 'iOS-inspired frosted glass',
    blurb: 'Large titles, soft blur surfaces, system blue, airy spacing.',
  },
  oled: {
    name: 'Deep OLED',
    tagline: 'True black utility',
    blurb: 'Dense cards, high contrast, electric accents for power users.',
  },
  aurora: {
    name: 'Soft Aurora',
    tagline: 'Gradient calm',
    blurb: 'Layered color washes, pill chips, rounded editorial cards.',
  },
}
