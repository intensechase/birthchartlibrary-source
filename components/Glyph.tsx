import { SIGN_SYMBOLS } from '@/lib/zodiac-colors'
import { PLANET_SYMBOLS } from '@/lib/constants'

// Astrological glyphs paired with screen-reader-accessible names.
// Renders the Unicode symbol visibly + the human-readable name to AT only.
// Use these instead of inline `{SIGN_SYMBOLS[sign]}` / `{PLANET_SYMBOLS[planet]}`
// so blind users hear "Aries" or "Moon" rather than "white sun with rays"
// or "first quarter moon".

interface GlyphProps {
  className?: string
  // When true, no accessible name is exposed (purely decorative — e.g.
  // a symbol shown next to the spelled-out sign name in the same line).
  decorative?: boolean
}

export function SignGlyph({ sign, className, decorative }: GlyphProps & { sign: string }) {
  const symbol = SIGN_SYMBOLS[sign]
  if (!symbol) return null
  if (decorative) return <span aria-hidden="true" className={className}>{symbol}</span>
  return (
    <span className={className} role="img" aria-label={sign}>
      <span aria-hidden="true">{symbol}</span>
    </span>
  )
}

export function PlanetGlyph({ planet, className, decorative }: GlyphProps & { planet: string }) {
  const symbol = PLANET_SYMBOLS[planet]
  if (!symbol) return null
  // Normalize SUN → Sun for the label
  const label = planet.charAt(0).toUpperCase() + planet.slice(1).toLowerCase()
  if (decorative) return <span aria-hidden="true" className={className}>{symbol}</span>
  return (
    <span className={className} role="img" aria-label={label}>
      <span aria-hidden="true">{symbol}</span>
    </span>
  )
}
