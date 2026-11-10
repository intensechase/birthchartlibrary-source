import type { NextApiRequest, NextApiResponse } from 'next'
import * as Sentry from '@sentry/nextjs'
import { fetchTrendingPeople } from '@/lib/trending/fetch-trending'
import { buildChart } from '@/lib/swisseph/buildChart'
import { queryOne } from '@/lib/db'
import { timingSafeEqual } from 'crypto'
import { env } from '@/lib/env'
import { apiHandler } from '@/lib/apiHandler'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const authHeader = req.headers.authorization
  const expected = `Bearer ${env.cronSecret}`
  if (!authHeader || !env.cronSecret ||
      authHeader.length !== expected.length ||
      !timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected))) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const newPeople = await fetchTrendingPeople()

  if (newPeople.length === 0) {
    return res.status(200).json({ message: 'No new trending people to add', added: 0 })
  }

  let added = 0
  const results: string[] = []

  for (const person of newPeople) {
    try {
      const { chartData, timezone } = await buildChart(person.birthDate, person.birthTime, person.lat, person.lng)

      const row = await queryOne<{ id: string }>(
        `INSERT INTO celebrities (name, slug, birth_date, birth_time, birth_city, birth_lat, birth_lng, timezone, chart_data, category, bio, source)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (slug) DO NOTHING
         RETURNING id`,
        [
          person.name, person.slug, person.birthDate, person.birthTime,
          person.birthCity, person.lat, person.lng, timezone,
          JSON.stringify(chartData), person.category, person.bio || null, 'trending',
        ]
      )
      if (row) {
        results.push(`Added: ${person.name}`)
        added++
      } else {
        results.push(`Skipped (exists): ${person.name}`)
      }
    } catch (err) {
      Sentry.captureException(err, { tags: { cron: 'trending', person: person.name } })
      results.push(`Error: ${person.name} — ${err instanceof Error ? err.message : 'unknown'}`)
    }
  }

  return res.status(200).json({ message: 'Trending update complete', added, results })
})
