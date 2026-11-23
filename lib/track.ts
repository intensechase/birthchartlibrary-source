import { cookiesDeclined } from '@/lib/cookie-choice'

// The five counts the owner asked for (11/23), and nothing else: no names, no
// birth details, no chart ids. Declined cookies = no counting.
export type TrackEvent = 'chart_made' | 'reading_teaser_seen' | 'save_pressed' | 'signup_finished' | 'my_chart_opened'
export type TrackKind = 'self' | 'someone' | 'comparison' | 'none'

export function track(event: TrackEvent, kind?: TrackKind, tries = 8) {
  if (typeof window === 'undefined' || cookiesDeclined()) return
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag
  // On a fresh page Analytics loads after the page does: wait a few seconds for it.
  if (!gtag) { if (tries > 0) setTimeout(() => track(event, kind, tries - 1), 600); return }
  // beacon: several of these are followed at once by leaving the page
  gtag('event', event, { ...(kind ? { kind } : {}), transport_type: 'beacon' })
}
