/**
 * Lucide-style stroke icons (24×24 viewBox).
 * ui-ux-pro-max: no emoji as structural icons — vector only, one stroke language.
 */

export type IconName =
  | 'home'
  | 'chat'
  | 'tasks'
  | 'brain'
  | 'more'
  | 'sparkles'
  | 'sun'
  | 'moon'
  | 'gem'
  | 'image'
  | 'plane'
  | 'phone'
  | 'shield'
  | 'bolt'
  | 'board'
  | 'scroll'
  | 'check'
  | 'idea'
  | 'masks'
  | 'link'
  | 'sliders'
  | 'chevron'
  | 'message'
  | 'note'
  | 'todo'
  | 'research'
  | 'all'

export type IconProps = {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
  /** When true, parent supplies color via currentColor */
  title?: string
}

const PATHS: Record<IconName, string> = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z',
  chat: 'M21 12a8 8 0 0 1-8 8H7l-4 3v-3.5A8 8 0 1 1 21 12z',
  tasks: 'M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01',
  brain:
    'M9.5 4a3.5 3.5 0 0 0-2.8 5.6A3.5 3.5 0 0 0 6 16.5c0 1.7 1.1 3.1 2.6 3.4.5 1.2 1.7 2.1 3.1 2.1h.6c1.4 0 2.6-.9 3.1-2.1 1.5-.3 2.6-1.7 2.6-3.4a3.5 3.5 0 0 0-.7-6.9A3.5 3.5 0 0 0 14.5 4c-.9 0-1.7.3-2.3.9A3.5 3.5 0 0 0 9.5 4z',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  sparkles: 'M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8',
  sun: 'M12 4v2M12 18v2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
  moon: 'M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5z',
  gem: 'M6 3h12l4 7-10 11L2 10 6 3zm0 0 6 7 6-7M2 10h20',
  image: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm3 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm13 8-5-6-4 5-2-2-5 6',
  plane: 'M10 17 21 12 3 4l4 8-4 8 7-3zm0 0v-5',
  phone: 'M7 3h4l1 4-2 1a12 12 0 0 0 5 5l1-2 4 1v4c0 1-1 2-2 2C10 18 6 14 6 5c0-1 1-2 1-2z',
  shield: 'M12 3 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-3z',
  bolt: 'M13 2 4 14h7l-1 8 10-14h-7l0-6z',
  board: 'M4 4h6v16H4V4zm10 0h6v10h-6V4z',
  scroll: 'M8 4h9a2 2 0 0 1 2 2v12a1 1 0 0 1-1 1H8a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm0 4h8M8 12h6',
  check: 'M5 12.5 9.5 17 19 7',
  idea: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11c.6.5 1 1.2 1 2h4c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z',
  masks: 'M7 8c0-2 2-4 5-4s5 2 5 4v3c0 3-2 5-5 5S7 14 7 11V8zm0 0C5 8 3 9 3 11s2 4 4 3m10-6c2 0 4 1 4 3s-2 4-4 3',
  link: 'M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1',
  sliders: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4',
  chevron: 'M9 6l6 6-6 6',
  message: 'M21 12a8 8 0 0 1-8 8H7l-4 3v-3.5A8 8 0 1 1 21 12z',
  note: 'M7 3h8l4 4v14H7V3zm8 0v4h4M9 12h6M9 16h4',
  todo: 'M9 12l2 2 4-4M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  research: 'M10 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm5-2 5 5',
  all: 'M4 6h16M4 12h16M4 18h10',
}

/**
 * Stroke icon — uses currentColor so theme tokens drive color.
 */
export function Icon({ name, size = 22, className, strokeWidth = 1.75, title }: IconProps) {
  const d = PATHS[name]
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d={d} />
    </svg>
  )
}

/** Icon in a soft primary tile (home features / more rows). */
export function IconBadge({
  name,
  tone = 'primary',
}: {
  name: IconName
  tone?: 'primary' | 'accent' | 'success' | 'warn' | 'muted'
}) {
  return (
    <span className={`icon-badge icon-badge--${tone}`} aria-hidden>
      <Icon name={name} size={18} />
    </span>
  )
}

export const TAB_ICONS: Record<string, IconName> = {
  home: 'home',
  chat: 'chat',
  tasks: 'tasks',
  brain: 'brain',
  more: 'more',
}

export const HUB_ICONS: Record<string, IconName> = {
  kanban: 'board',
  ideas: 'idea',
  trips: 'plane',
  vault: 'shield',
  agents: 'bolt',
  logs: 'scroll',
  personas: 'masks',
  art: 'image',
  phone: 'phone',
  paywall: 'gem',
  connection: 'link',
  appearance: 'sliders',
}
