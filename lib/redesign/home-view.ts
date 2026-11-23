// Server only: builds everything the redesigned home page shows (Issue 17,
// docs/redesign/2026-11-19-structure-notes.md). Loaded with a dynamic import from
// getStaticProps so none of it reaches the browser bundle.
import { query } from '@/lib/db'
import { QUALITY_BIO_SQL } from '@/lib/celebrities'
import { CELEBRITY_RANK } from '@/lib/celebrity-rank'
import { calculateBirthChart, toJulianDay } from '@/lib/swisseph/calculate'
import { MOON_WEATHER } from '@/lib/interpretations/daily'
import { getBirthTimeSource } from '@/lib/birth-time-source'
import { formatBirthDate, formatBirthTime } from '@/lib/format-birth'
import { TIER_OF, SIGN_NAMES } from './astro'
import type { VBody } from './celeb-view'

export interface HomePerson { name: string; slug: string; date: string; sun: string; moon: string; rising: string | null; offset?: number }
export interface HomeFact { body: string; title: string; sub: string }
export interface HomeShelf { title: string; sub: string; href: string; count: number; faces: { name: string; slug: string }[] }
export interface HomeCotd {
  name: string; slug: string; label: string; when: string; place: string
  tier: string | null; tierText: string
  bigThree: { sign: string; role: 'Sun' | 'Moon' | 'Rising' }[]
  lead: string; hasTime: boolean; bodies: VBody[]; asc: number | null; mc: number | null; city: string
}
export interface HomeView {
  dateLabel: string
  moon: { sign: string; phase: string; lit: number; waxing: boolean; elong: number; line: string }
  facts: HomeFact[]
  cotd: HomeCotd | null
  week: HomePerson[]
  // Everyone within 3 days, the chart of the day included; offset 0 = today.
  weekAll: HomePerson[]
  weekLabel: string
  shelves: HomeShelf[]
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY = 86400000
const TIER_SHORT: Record<string, string> = { S: 'birth certificate', A: 'from the person or family', B: 'from a biography', C: 'source unknown', D: 'reports conflict' }
const md = (d: Date) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`

function phaseName(e: number): string {
  if (e < 12 || e >= 348) return 'New moon'
  if (e < 80) return 'Waxing crescent'
  if (e < 100) return 'First quarter'
  if (e < 168) return 'Waxing gibbous'
  if (e < 192) return 'Full moon'
  if (e < 260) return 'Waning gibbous'
  if (e < 280) return 'Last quarter'
  return 'Waning crescent'
}

// A friendly date: weekday when within the coming week, else the month and day.
function friendly(d: Date, today: Date): { short: string; days: number } {
  const days = Math.round((Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - today.getTime()) / DAY)
  return { short: days === 0 ? 'today' : days === 1 ? 'tomorrow' : days < 7 ? WEEKDAYS[d.getUTCDay()] : md(d), days }
}

async function skyAt(t: Date) {
  const jd = await toJulianDay(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours() + t.getUTCMinutes() / 60)
  const c = await calculateBirthChart(jd, 0, 0)
  const g = (id: string) => c.planets.find(p => p.planet === id)!
  return { g }
}

// Today's sky plus the next events, scanned from the ephemeris (no hand dates).
async function buildSky(today: Date) {
  const noon = new Date(today.getTime() + DAY / 2)
  const { g } = await skyAt(noon)
  const sun = g('SUN'), moon = g('MOON'), merc = g('MERCURY')
  const elong = (((moon.longitude - sun.longitude) % 360) + 360) % 360
  const lit = Math.round(((1 - Math.cos((elong * Math.PI) / 180)) / 2) * 100)
  const moonInfo = { sign: moon.sign, phase: phaseName(elong), lit, waxing: elong < 180, elong: Math.round(elong), line: MOON_WEATHER[moon.sign] ?? '' }

  let nextFull: { t: Date; sign: string } | null = null, nextNew: { t: Date; sign: string } | null = null, sunIn: { t: Date; sign: string } | null = null
  let prevE = elong, prevSun = sun.sign
  for (let h = 6; h <= 24 * 35; h += 6) {
    const t = new Date(noon.getTime() + h * 3600000)
    const s = await skyAt(t)
    const S = s.g('SUN'), M = s.g('MOON')
    const e = (((M.longitude - S.longitude) % 360) + 360) % 360
    if (!nextFull && prevE < 180 && e >= 180) nextFull = { t, sign: M.sign }
    if (!nextNew && prevE > 300 && e < 60) nextNew = { t, sign: M.sign }
    if (!sunIn && S.sign !== prevSun) sunIn = { t, sign: S.sign }
    prevE = e; prevSun = S.sign
    if (nextFull && nextNew && sunIn) break
  }
  // Mercury: today's state and the next station, a day at a time for up to 4 months.
  let station: { t: Date; retro: boolean } | null = null
  for (let d = 1; d <= 120 && !station; d++) {
    const t = new Date(noon.getTime() + d * DAY)
    const r = (await skyAt(t)).g('MERCURY').retrograde
    if (r !== merc.retrograde) station = { t, retro: r }
  }

  const facts: HomeFact[] = []
  if (merc.retrograde) facts.push({ body: 'MERCURY', title: station ? `Mercury retrograde until ${md(station.t)}` : 'Mercury is retrograde', sub: 'Plans and messages may need a second look' })
  else facts.push({ body: 'MERCURY', title: 'Mercury is direct', sub: station ? `Next retrograde starts ${md(station.t)}` : 'No Mercury retrograde in the next four months' })
  if (sunIn) {
    const f = friendly(sunIn.t, today)
    facts.push({ body: 'SUN', title: `Sun enters ${sunIn.sign} ${f.short}`, sub: `${sun.sign} season ends ${md(sunIn.t)}` })
  }
  const lunar = [nextFull && { ...nextFull, kind: 'Full moon' }, nextNew && { ...nextNew, kind: 'New moon' }].filter(Boolean).sort((a, b) => a!.t.getTime() - b!.t.getTime())[0]
  if (lunar) {
    const f = friendly(lunar.t, today)
    facts.push({ body: 'MOON', title: `${lunar.kind} in ${lunar.sign} ${f.short}`, sub: `${md(lunar.t)}${f.days > 1 ? `, in ${f.days} days` : ''}` })
  }
  return { moon: moonInfo, facts }
}

interface Row {
  name: string; slug: string; birth_date: string; birth_time: string | null; birth_city: string | null
  category: string | null; sun_sign: string | null; moon_sign: string | null; rising_sign: string | null
  metadata: Record<string, unknown> | null; chart_data: any; bio_extended: string | null; description: string | null
}
const rankOf = (slug: string) => { const i = CELEBRITY_RANK.indexOf(slug); return i < 0 ? 99999 : i }
const RATING_ORDER = ['AA', 'A', 'B', 'C', 'DD']
const ratingOf = (r: Row) => { const v = (r.metadata?.rodden_rating as string | undefined) ?? ''; const i = RATING_ORDER.indexOf(v); return i < 0 ? 9 : i }
const isPolitician = (r: Row) => /politic|president|senator|governor|congress/i.test(r.category ?? '')

function firstSentences(text: string, n = 2): string {
  const p = text.replace(/\r\n/g, '\n').split(/\n\s*\n/).map(s => s.trim()).filter(Boolean)[0] ?? ''
  const parts = p.match(/[^.!?]+[.!?]+(["”’)]*)?/g) ?? [p]
  return parts.slice(0, n).join(' ').replace(/\s+/g, ' ').trim()
}

function toCotd(r: Row, label: string): HomeCotd {
  const hasTime = !!r.birth_time
  const cd = r.chart_data ?? {}
  const bodies: VBody[] = (cd.planets ?? []).filter((p: any) => p.planet !== 'LILITH').map((p: any) => ({
    id: p.planet, sign: p.sign, deg: p.signDegree, lon: p.longitude, house: hasTime ? p.house ?? null : null, retro: !!p.retrograde, dignity: null,
  }))
  const src = getBirthTimeSource(r.birth_time, r.metadata as any)
  const tier = hasTime && src?.rating ? TIER_OF[src.rating] ?? null : null
  const sun = bodies.find(b => b.id === 'SUN')?.sign, moon = bodies.find(b => b.id === 'MOON')?.sign
  const rising = hasTime && typeof cd.ascendant === 'number' ? SIGN_NAMES[Math.floor(cd.ascendant / 30) % 12] : null
  const bigThree: HomeCotd['bigThree'] = []
  if (sun) bigThree.push({ sign: sun, role: 'Sun' })
  if (moon) bigThree.push({ sign: moon, role: 'Moon' })
  if (rising) bigThree.push({ sign: rising, role: 'Rising' })
  return {
    name: r.name, slug: r.slug, label,
    when: [formatBirthDate(r.birth_date), hasTime ? formatBirthTime(r.birth_time!) : null].filter(Boolean).join(', '),
    place: r.birth_city ?? '',
    tier, tierText: !hasTime ? 'No birth time' : tier ? `Time rated ${tier}: ${TIER_SHORT[tier]}` : 'Time not graded yet',
    bigThree, lead: firstSentences(r.bio_extended || r.description || ''), hasTime, bodies,
    asc: hasTime && typeof cd.ascendant === 'number' ? cd.ascendant : null,
    mc: hasTime && typeof cd.midheaven === 'number' ? cd.midheaven : null,
    city: (r.birth_city ?? '').split(',')[0],
  }
}

// Each shelf links to its category page and counts the same people that page lists.
const SHELVES: [string, string, string, RegExp][] = [
  ['Film and TV', 'Actors and directors', 'actor', /actor/i],
  ['Music', 'Singers and bands', 'musician', /musician/i],
  ['Sport', 'Athletes', 'athlete', /athlete/i],
  ['Politics', 'Leaders and activists', 'politician', /politician/i],
  ['Writers', 'Authors and thinkers', 'writer', /writer/i],
  ['Business', 'Founders and designers', 'business', /business/i],
]

export async function buildHomeView(now = new Date()): Promise<HomeView> {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const sky = await buildSky(today)

  // Everyone with a written page born within 3 days of today (any year).
  const near = [-3, -2, -1, 0, 1, 2, 3].map(o => new Date(today.getTime() + o * DAY))
  const pairs = near.map(d => `(${d.getUTCMonth() + 1},${d.getUTCDate()})`).join(',')
  const rows = await query<Row>(
    `SELECT name, slug, birth_date::text, birth_time, birth_city, category, sun_sign, moon_sign, rising_sign, metadata, chart_data, bio_extended, description
     FROM celebrities
     WHERE (EXTRACT(MONTH FROM birth_date)::int, EXTRACT(DAY FROM birth_date)::int) IN (${pairs}) AND ${QUALITY_BIO_SQL}`,
  )
  const offset = (r: Row) => {
    const [, m, d] = r.birth_date.split('-').map(Number)
    return near.findIndex(x => x.getUTCMonth() + 1 === m && x.getUTCDate() === d) - 3
  }

  // Chart of the day (owner rules 11/19 and 11/20): birthday first, then the nearest
  // day; never politicians or anyone flagged front_page_skip; better rated times,
  // then better known people first.
  // To do: the 3 year no repeat rule needs a picks table (database change, owner OK).
  const pool = rows.filter(r => !isPolitician(r) && r.metadata?.front_page_skip !== true)
    .sort((a, b) => Math.abs(offset(a)) - Math.abs(offset(b)) || ratingOf(a) - ratingOf(b) || rankOf(a.slug) - rankOf(b.slug))
  const pick = pool[0]
  const o = pick ? offset(pick) : 0
  const label = !pick ? '' : o === 0 ? 'birthday today' : o === 1 ? 'birthday tomorrow' : o === -1 ? 'birthday yesterday' : `birthday ${md(near[o + 3])}`
  const cotd = pick ? toCotd(pick, label) : null

  // Born today and born this week leave flagged people out too (owner, 11/23).
  const weekAll: HomePerson[] = rows
    .filter(r => r.metadata?.front_page_skip !== true)
    .sort((a, b) => offset(a) - offset(b) || rankOf(a.slug) - rankOf(b.slug))
    .map(r => {
      const [y, m, d] = r.birth_date.split('-').map(Number)
      return { name: r.name, slug: r.slug, date: `${MONTHS[m - 1]} ${d}, ${y}`, sun: r.sun_sign ?? '', moon: r.moon_sign ?? '', rising: r.birth_time ? r.rising_sign : null, offset: offset(r) }
    })
  const week = weekAll.filter(p => p.slug !== pick?.slug)

  // Shelves: written pages by what people are known for, best known faces first.
  const all = await query<{ name: string; slug: string; category: string | null; y: number }>(`SELECT name, slug, category, EXTRACT(YEAR FROM birth_date)::int AS y FROM celebrities WHERE ${QUALITY_BIO_SQL}`)
  const shelves: HomeShelf[] = SHELVES.map(([title, sub, cat, re]) => {
    const list = all.filter(c => re.test(c.category ?? '')).sort((a, b) => rankOf(a.slug) - rankOf(b.slug))
    // Politics shows historical faces only (owner 11/20: don't look like taking sides).
    const faces = cat === 'politician' ? list.filter(c => c.y < 1930) : list
    return { title, sub, href: `/celebrity-birth-charts/category/${cat}`, count: list.length, faces: faces.slice(0, 3).map(c => ({ name: c.name, slug: c.slug })) }
  }).filter(s => s.count > 0)

  return {
    dateLabel: `${WEEKDAYS[today.getUTCDay()]}, ${md(today)}`,
    moon: sky.moon, facts: sky.facts, cotd, week, weekAll,
    weekLabel: `${md(near[0])} to ${near[6].getUTCDate()}`,
    shelves,
  }
}
