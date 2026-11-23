import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '@/lib/db'
import { apiHandler } from '@/lib/apiHandler'
import { QUALITY_BIO_SQL } from '@/lib/celebrities'
import { CELEBRITY_RANK } from '@/lib/celebrity-rank'
import { calculateBirthChart, toJulianDay } from '@/lib/swisseph/calculate'

// "Who shares your chart?" from a birth date alone (Issue 4, owner 11/19): the Sun
// and Moon worked out by the chart engine, then written profiles sharing them.
// Without a birth time and place the Moon can be one of two signs on the day it
// changed sign, so both ends of the day are checked and both signs are said.
// Read only; nothing about the visitor is stored.
const rankOf = (slug: string) => { const i = CELEBRITY_RANK.indexOf(slug); return i < 0 ? 99999 : i }

async function signsAt(y: number, m: number, d: number, h: number) {
  const c = await calculateBirthChart(await toJulianDay(y, m, d, h), 0, 0)
  return { sun: c.planets.find(p => p.planet === 'SUN')!.sign, moon: c.planets.find(p => p.planet === 'MOON')!.sign }
}

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const date = String(req.query.date ?? '')
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!m) return res.status(400).json({ error: 'Send the birth date as YYYY-MM-DD.' })
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  if (y < 1800 || y > new Date().getUTCFullYear() || mo < 1 || mo > 12 || d < 1 || d > 31) return res.status(400).json({ error: 'That date is out of range.' })

  // Local midnight to midnight anywhere on Earth spans about UTC -12h to +36h.
  const early = await signsAt(y, mo, d, -10), late = await signsAt(y, mo, d, 34), mid = await signsAt(y, mo, d, 12)
  const moons = Array.from(new Set([early.moon, mid.moon, late.moon]))
  const suns = Array.from(new Set([early.sun, mid.sun, late.sun]))

  const rows = await query<{ name: string; slug: string; sun_sign: string; moon_sign: string; rising_sign: string | null; birth_time: string | null }>(
    `SELECT name, slug, sun_sign, moon_sign, rising_sign, birth_time FROM celebrities
     WHERE sun_sign = ANY($1) AND moon_sign = ANY($2) AND ${QUALITY_BIO_SQL}`,
    [suns, moons],
  )
  const people = rows.sort((a, b) => rankOf(a.slug) - rankOf(b.slug)).slice(0, 12)
    .map(r => ({ name: r.name, slug: r.slug, sun: r.sun_sign, moon: r.moon_sign }))

  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
  return res.status(200).json({ sun: mid.sun, suns, moon: mid.moon, moons, total: rows.length, people })
})
