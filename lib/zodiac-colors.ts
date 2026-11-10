// Shared color system used site-wide.
//
// Previously this was a 4-color element palette (Fire/Earth/Air/Water).
// Replaced 2026-05-24 with a 12-color per-sign palette tuned to the
// slate ground — muted, traditional astrology associations. Leo
// (#D97706) harmonizes with the brand amber accent so the Sun pill
// reads warm when Sun is in Leo. Cancer (#64748B) gives the Moon pill
// a cool silver-blue when Moon is in Cancer.
//
// `getElementColor(sign)` keeps its old name for back-compat; it now
// returns per-sign colors rather than per-element.
//
// Text colors come from --sign-* in styles/globals.css, with a darker
// day value and a lighter night value so they stay readable on both.
//
// IMPORTANT: classes are written as literal strings (not constructed
// via template literals) so Tailwind's JIT scanner can statically
// detect them and include them in the compiled CSS bundle.

type ColorSet = { text: string; bg: string; border: string; gradient: string }

export const SIGN_COLORS: Record<string, ColorSet> = {
  Aries:       { text: 'text-[color:var(--sign-aries)]', bg: 'bg-[#C2410C]/5', border: 'border-[#C2410C]/25', gradient: 'from-[#C2410C]/5 to-[#C2410C]/10' },
  Taurus:      { text: 'text-[color:var(--sign-taurus)]', bg: 'bg-[#65A30D]/5', border: 'border-[#65A30D]/25', gradient: 'from-[#65A30D]/5 to-[#65A30D]/10' },
  Gemini:      { text: 'text-[color:var(--sign-gemini)]', bg: 'bg-[#CA8A04]/5', border: 'border-[#CA8A04]/25', gradient: 'from-[#CA8A04]/5 to-[#CA8A04]/10' },
  Cancer:      { text: 'text-[color:var(--sign-cancer)]', bg: 'bg-[#64748B]/5', border: 'border-[#64748B]/25', gradient: 'from-[#64748B]/5 to-[#64748B]/10' },
  Leo:         { text: 'text-[color:var(--sign-leo)]', bg: 'bg-[#D97706]/5', border: 'border-[#D97706]/25', gradient: 'from-[#D97706]/5 to-[#D97706]/10' },
  Virgo:       { text: 'text-[color:var(--sign-virgo)]', bg: 'bg-[#15803D]/5', border: 'border-[#15803D]/25', gradient: 'from-[#15803D]/5 to-[#15803D]/10' },
  Libra:       { text: 'text-[color:var(--sign-libra)]', bg: 'bg-[#9333EA]/5', border: 'border-[#9333EA]/25', gradient: 'from-[#9333EA]/5 to-[#9333EA]/10' },
  Scorpio:     { text: 'text-[color:var(--sign-scorpio)]', bg: 'bg-[#9F1239]/5', border: 'border-[#9F1239]/25', gradient: 'from-[#9F1239]/5 to-[#9F1239]/10' },
  Sagittarius: { text: 'text-[color:var(--sign-sagittarius)]', bg: 'bg-[#7C3AED]/5', border: 'border-[#7C3AED]/25', gradient: 'from-[#7C3AED]/5 to-[#7C3AED]/10' },
  Capricorn:   { text: 'text-[color:var(--sign-capricorn)]', bg: 'bg-[#475569]/5', border: 'border-[#475569]/25', gradient: 'from-[#475569]/5 to-[#475569]/10' },
  Aquarius:    { text: 'text-[color:var(--sign-aquarius)]', bg: 'bg-[#0891B2]/5', border: 'border-[#0891B2]/25', gradient: 'from-[#0891B2]/5 to-[#0891B2]/10' },
  Pisces:      { text: 'text-[color:var(--sign-pisces)]', bg: 'bg-[#0E7490]/5', border: 'border-[#0E7490]/25', gradient: 'from-[#0E7490]/5 to-[#0E7490]/10' },
}

// Kept for back-compat. New callers should use getElementColor(sign).
export const ELEMENT_COLORS: Record<string, ColorSet> = {
  Fire:  { text: 'text-[color:var(--sign-leo)]', bg: 'bg-[#D97706]/5', border: 'border-[#D97706]/25', gradient: 'from-[#D97706]/5 to-[#D97706]/10' },
  Earth: { text: 'text-[color:var(--sign-taurus)]', bg: 'bg-[#65A30D]/5', border: 'border-[#65A30D]/25', gradient: 'from-[#65A30D]/5 to-[#65A30D]/10' },
  Air:   { text: 'text-[color:var(--sign-aquarius)]', bg: 'bg-[#0891B2]/5', border: 'border-[#0891B2]/25', gradient: 'from-[#0891B2]/5 to-[#0891B2]/10' },
  Water: { text: 'text-[color:var(--sign-pisces)]', bg: 'bg-[#0E7490]/5', border: 'border-[#0E7490]/25', gradient: 'from-[#0E7490]/5 to-[#0E7490]/10' },
}

export const SIGN_ELEMENTS: Record<string, string> = {
  Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
  Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
  Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water',
}

export const SIGN_SYMBOLS: Record<string, string> = {
  Aries: '♈︎', Taurus: '♉︎', Gemini: '♊︎', Cancer: '♋︎', Leo: '♌︎', Virgo: '♍︎',
  Libra: '♎︎', Scorpio: '♏︎', Sagittarius: '♐︎', Capricorn: '♑︎', Aquarius: '♒︎', Pisces: '♓︎',
}

// Looks up the per-sign color. Falls back to the sign's element color
// (for legacy data) then to a neutral slate. Function name preserved
// so existing call sites do not need to change.
export function getElementColor(sign: string): ColorSet {
  return SIGN_COLORS[sign]
      || ELEMENT_COLORS[SIGN_ELEMENTS[sign] || 'Fire']
      || ELEMENT_COLORS.Fire
}
