// Disputed births (owner 11/19 spec, docs/2026-11-19-consistency-audit.md):
// a celebrity row can carry other credible accounts of the birth in
// metadata.alt_births. The page shows one tab per account; the main row stays
// the default tab and is what the title, schema and sitemap describe.
//
// metadata shape:
//   main_birth_label: "June 14 (registered)"
//   alt_births: [{ key: "may-14", label: "May 14 (his mother's account)",
//                  date: "1928-05-14", time: "03:05" | null, reading: "…" }]
// A reading is 250 to 400 words, chart focused, and says which account it
// follows; the life story stays in the main bio.
export interface AltBirth {
  key: string
  label: string
  date: string // YYYY-MM-DD, local date at the birth place
  time: string | null // HH:MM local, null = untimed
  reading: string
}

const KEY = /^[a-z0-9-]{1,40}$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^\d{2}:\d{2}$/

// Reads and checks metadata; anything malformed is skipped, never thrown.
export function readAltBirths(meta: Record<string, unknown> | null | undefined): { mainLabel: string; alts: AltBirth[] } | null {
  const raw = meta?.alt_births
  if (!Array.isArray(raw) || !raw.length) return null
  const alts: AltBirth[] = []
  for (const a of raw as Record<string, unknown>[]) {
    if (!a || typeof a !== 'object') continue
    const { key, label, date, time, reading } = a
    if (typeof key !== 'string' || !KEY.test(key) || key === 'main') continue
    if (typeof label !== 'string' || !label.trim()) continue
    if (typeof date !== 'string' || !DATE.test(date)) continue
    if (time != null && (typeof time !== 'string' || !TIME.test(time))) continue
    if (typeof reading !== 'string' || !reading.trim()) continue
    alts.push({ key, label: label.trim(), date, time: (time as string | null) ?? null, reading: reading.trim() })
  }
  if (!alts.length) return null
  const mainLabel = typeof meta?.main_birth_label === 'string' && meta.main_birth_label.trim() ? meta.main_birth_label.trim() : 'On record'
  return { mainLabel, alts }
}
