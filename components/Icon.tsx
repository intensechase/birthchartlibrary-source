import type { IconName } from '@/lib/icons/paths'

// One icon from the redesign set, drawn from the shared sprite (public/icons.svg).
// Colour follows `currentColor`, so set it with a text class (text-ink, text-el-fire).
//
// Accessibility: pass `label` when the icon carries meaning on its own
// ("Aries" with no word beside it). Leave it out when the name is already
// written next to the icon, and the icon is hidden from screen readers.
//
// Bump SPRITE_VERSION after rebuilding the sprite so Cloudflare and browsers
// fetch the new file instead of a cached one.
const SPRITE_VERSION = 1

interface IconProps {
  name: IconName
  size?: number
  label?: string
  className?: string
}

export default function Icon({ name, size = 24, label, className }: IconProps) {
  // Small icons get a slightly heavier line so they don't look faint.
  const stroke = size < 20 ? 1.9 : 1.75
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <use href={`/icons.svg?v=${SPRITE_VERSION}#${name}`} />
    </svg>
  )
}
