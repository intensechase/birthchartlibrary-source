import type { NextApiRequest, NextApiResponse } from 'next'
import { timingSafeEqual } from 'crypto'
import * as Sentry from '@sentry/nextjs'
import { query, queryOne, parseJsonb } from '@/lib/db'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import { calculateBirthChart, toJulianDay } from '@/lib/swisseph/calculate'
import { calculateDailyTransits } from '@/lib/swisseph/transits'
import { describeMoonTransit, describeTransit } from '@/lib/interpretations/transits'
import { MOON_REFLECTIONS } from '@/lib/interpretations/daily'
import { sendDailyHoroscopeEmail, sendGuestDailyHoroscopeEmail, sendAdminAlert } from '@/lib/emails'
import { env } from '@/lib/env'

const BATCH_SIZE = 10

async function getTodayMoonData(): Promise<{ moonSign: string; moonTransit: string; reflection: string }> {
  const now = new Date()
  const jd = await toJulianDay(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), 0)
  const todayChart = await calculateBirthChart(jd, 0, 0)
  const moonPlanet = todayChart.planets.find(p => p.planet === 'MOON')
  const moonSign = moonPlanet?.sign || 'Unknown'
  return {
    moonSign,
    moonTransit: describeMoonTransit(moonSign, 1),
    reflection: MOON_REFLECTIONS[moonSign] || '',
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const authHeader = req.headers.authorization
  const expected = `Bearer ${env.cronSecret}`
  if (!authHeader || !env.cronSecret ||
      authHeader.length !== expected.length ||
      !timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected))) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })
  const runDate = new Date().toISOString().slice(0, 10) // YYYY-MM-DD UTC

  // Idempotency: claim today's slot. If another run already inserted, abort.
  const claim = await queryOne<{ job: string }>(
    `INSERT INTO cron_runs (job, run_date) VALUES ('daily-email', $1)
     ON CONFLICT (job, run_date) DO NOTHING
     RETURNING job`,
    [runDate]
  )
  if (!claim) {
    return res.status(200).json({ message: 'Already ran today', skipped: true })
  }

  // Compute today's moon data once — shared across all sends
  const { moonSign, moonTransit, reflection } = await getTodayMoonData()

  // --- Registered subscribers (personalized transits) ---
  // Per-user cadence: only pull users whose last send is older than their
  // chosen cadence (default 1 day = daily). NULL last_email_sent_at means
  // they've never received an email yet, so they're eligible immediately.
  const subscribers = await query<{ id: string; email: string; chart_data: unknown }>(
    `SELECT p.id, p.email, bc.chart_data
     FROM profiles p
     JOIN birth_charts bc ON bc.user_id = p.id AND bc.is_primary = true
     WHERE p.daily_email = true AND p.email IS NOT NULL
       AND (
         p.last_email_sent_at IS NULL
         OR p.last_email_sent_at < NOW() - (p.email_cadence_days * INTERVAL '1 day')
       )`
  )

  let sent = 0
  let failed = 0

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE)
    const results = await Promise.allSettled(batch.map(async (sub) => {
      if (!sub.chart_data) return 'skip'
      const natalChart = parseJsonb<BirthChartData>(sub.chart_data)
      const daily = await calculateDailyTransits(natalChart, 0)
      const topTransit = daily.transits.week[0]
      const transitText = topTransit ? describeTransit(topTransit) : ''
      const ok = await sendDailyHoroscopeEmail(sub.email, moonSign, moonTransit, reflection, transitText, today)
      if (!ok) throw new Error(`Send failed for ${sub.email}`)
      // Only stamp last_email_sent_at on success — failed sends should
      // remain eligible so tomorrow's run retries them.
      await query('UPDATE profiles SET last_email_sent_at = NOW() WHERE id = $1', [sub.id])
      return 'ok'
    }))
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value === 'ok') sent++
      else if (r.status === 'rejected') { console.error(r.reason); Sentry.captureException(r.reason); failed++ }
    }
  }

  // --- Guest subscribers (moon + reflection only, no natal transits) ---
  const guests = await query<{ email: string; unsubscribe_token: string; sun_sign: string; subscribed_at: string }>(
    `SELECT email, unsubscribe_token, sun_sign, subscribed_at FROM guest_subscribers
     WHERE unsubscribed_at IS NULL
       AND email NOT IN (SELECT email FROM profiles WHERE email IS NOT NULL)`
  )

  let guestSent = 0
  let guestFailed = 0

  for (let i = 0; i < guests.length; i += BATCH_SIZE) {
    const batch = guests.slice(i, i + BATCH_SIZE)
    const results = await Promise.allSettled(batch.map(async (g) => {
      const daysSince = Math.floor((Date.now() - new Date(g.subscribed_at).getTime()) / 86400000)
      const showUpgradeCta = daysSince <= 1 || daysSince === 7 || daysSince === 30
      const ok = await sendGuestDailyHoroscopeEmail(g.email, moonSign, moonTransit, reflection, g.unsubscribe_token, today, g.sun_sign, showUpgradeCta)
      if (!ok) throw new Error(`Send failed for ${g.email}`)
      return 'ok'
    }))
    for (const r of results) {
      if (r.status === 'fulfilled') guestSent++
      else { console.error(r.reason); Sentry.captureException(r.reason); guestFailed++ }
    }
  }

  const totalSubscribers = subscribers.length + guests.length
  const totalSent = sent + guestSent
  const totalFailed = failed + guestFailed
  const failureRate = totalSubscribers > 0 ? totalFailed / totalSubscribers : 0
  // Only alert if there WERE subscribers due today — with per-user
  // cadence it's normal for a given day to have zero eligible users.
  if (totalSubscribers > 0 && (totalSent === 0 || failureRate > 0.5)) {
    await sendAdminAlert(totalSent, totalFailed, totalSubscribers)
  }

  await query(
    `UPDATE cron_runs SET finished_at = NOW(), sent = $1, failed = $2
     WHERE job = 'daily-email' AND run_date = $3`,
    [totalSent, totalFailed, runDate]
  )

  return res.status(200).json({
    message: 'Daily email complete',
    sent, failed, total: subscribers.length,
    guestSent, guestFailed, guestTotal: guests.length,
  })
}
