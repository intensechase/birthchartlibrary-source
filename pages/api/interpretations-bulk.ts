import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler } from '@/lib/apiHandler'
import { dbGetAllInterpretationsForChart } from '@/lib/interpretations/db'
import { SIGN_LIST } from '@/lib/constants'
import { PLANET_IN_SIGN } from '@/lib/interpretations/planet_in_sign'

// Bulk interpretation lookup for celebrity chart pages. Interpretation
// text is NOT server-rendered on those pages: the same paragraph appears on
// every celebrity with that placement, and it made up ~70% of each page
// (2026-10-15 audit). The reader taps "Show interpretations" and the client
// requests the chart's keys here — Placidus, then Whole-Sign on toggle.
//
// Key formats:
//   `${PLANET}_${Sign}_H${house}` — combined sign+house text (birth time known)
//   `${PLANET}_${Sign}`           — sign-only text (no birth time: houses are
//                                   noon estimates, so the page never claimed them)
//
// Keeps the same DB-first → static-combined → sign-only fallback chain
// that the SSR path uses, so admin-edited text shows up consistently
// in either house system.

const MAX_KEYS = 24
// Any chart body (incl. LILITH, which isn't in PLANET_KEYS); the DB lookup is
// parameterised and unknown planets simply resolve to no text.
const PLANET_RE = /^[A-Z][A-Z_]*$/
const SIGNS = new Set<string>(SIGN_LIST)

interface Triple {
  planet: string
  sign: string
  house: number
}

function parseKey(key: string): Triple | null {
  // Format: `${PLANET}_${SIGN}_H${HOUSE}` — matches what
  // dbGetAllInterpretationsForChart returns and what [slug].tsx emits.
  // Planet is UPPER (and may contain an underscore, e.g. NORTH_NODE);
  // sign is Title-case. Greedy `(.+)` plus the Title-cased sign anchor
  // disambiguates correctly even when the planet name has an underscore.
  const match = /^(.+)_([A-Z][a-z]+)_H(\d{1,2})$/.exec(key)
  if (!match) return null
  const [, planet, sign, houseStr] = match
  const house = parseInt(houseStr, 10)
  if (!PLANET_RE.test(planet)) return null
  if (!SIGNS.has(sign)) return null
  if (house < 1 || house > 12) return null
  return { planet, sign, house }
}

function parseSignOnlyKey(key: string): { planet: string; sign: string } | null {
  const match = /^([A-Z][A-Z_]*)_([A-Z][a-z]+)$/.exec(key)
  if (!match || !SIGNS.has(match[2])) return null
  return { planet: match[1], sign: match[2] }
}

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { keys } = req.query
  if (typeof keys !== 'string' || !keys) {
    return res.status(400).json({ error: 'keys query param required' })
  }

  const rawKeys = keys.split(',').filter(Boolean)
  if (rawKeys.length === 0) return res.status(400).json({ error: 'no keys' })
  if (rawKeys.length > MAX_KEYS) {
    return res.status(400).json({ error: `max ${MAX_KEYS} keys per request` })
  }

  const triples: Triple[] = []
  const signOnly: string[] = []
  for (const k of rawKeys) {
    const t = parseKey(k)
    if (t) { triples.push(t); continue }
    const so = parseSignOnlyKey(k)
    if (so) { signOnly.push(`${so.planet}_${so.sign}`); continue }
    return res.status(400).json({ error: `invalid key: ${k}` })
  }

  const interpretations = triples.length ? await dbGetAllInterpretationsForChart(triples) : {}
  for (const k of signOnly) interpretations[k] = PLANET_IN_SIGN[k] || ''

  // Strip empty-string entries to keep the wire payload minimal — the
  // client will fall back to its own "missing" rendering for those.
  const compact: Record<string, string> = {}
  for (const [k, v] of Object.entries(interpretations)) {
    if (v) compact[k] = v
  }

  // Same triples always resolve to the same text until an admin edits
  // the interpretations table (rare). 24h CDN cache; client cache is
  // permanent within the page session.
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400')
  res.json(compact)
})
