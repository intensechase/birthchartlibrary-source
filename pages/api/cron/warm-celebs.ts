import type { NextApiRequest, NextApiResponse } from 'next'
import * as Sentry from '@sentry/nextjs'
import { timingSafeEqual } from 'crypto'
import { query } from '@/lib/db'
import { QUALITY_BIO_SQL } from '@/lib/celebrities'
import { env } from '@/lib/env'
import { apiHandler } from '@/lib/apiHandler'

// Post-deploy warmer for celeb pages.
//
// Why: ISR cache lives inside the Docker image's filesystem. Every deploy
// starts with only what was prerendered at build time warm; the long tail
// of celeb pages takes a 765ms cold TTFB hit on first visit until ISR
// regenerates them. Calling res.revalidate() here populates the cache
// without waiting for a real visitor to pay that cost.
//
// What it warms: the N most-recently-updated celebrities, sorted by the
// `updated_at` trigger that already powers sitemap <lastmod>. That signal
// correlates well with "recently enriched" → "likely to get traffic
// post-deploy" without us needing a separate analytics integration.
//
// Pacing: each res.revalidate() runs the celeb page's getStaticProps end
// to end (DB + sweph compute) — typically ~250ms. Sequential to avoid
// hammering Postgres and chart compute under deploy load. Default
// limit=25 → ~6s wall clock. Caller can override with ?limit=N (capped
// at 200 so a runaway query can't tie up the route forever).
//
// Idempotency: deliberately none. The cron is safe to invoke repeatedly
// after a deploy — each call is a fresh top-N pass and revalidating an
// already-warm page is a no-op for end users.

const DEFAULT_LIMIT = 25
const MAX_LIMIT = 200

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const authHeader = req.headers.authorization
  const expected = `Bearer ${env.cronSecret}`
  if (!authHeader || !env.cronSecret ||
      authHeader.length !== expected.length ||
      !timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected))) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const limitParam = Number(req.query.limit)
  const limit = Number.isFinite(limitParam) && limitParam > 0
    ? Math.min(Math.floor(limitParam), MAX_LIMIT)
    : DEFAULT_LIMIT

  const rows = await query<{ slug: string }>(
    `SELECT slug FROM celebrities
     WHERE slug IS NOT NULL AND ${QUALITY_BIO_SQL}
     ORDER BY updated_at DESC
     LIMIT $1`,
    [limit]
  )

  const startedAt = Date.now()
  let warmed = 0
  let failed = 0
  const errors: string[] = []

  for (const { slug } of rows) {
    const path = `/celebrity-birth-charts/${slug}`
    try {
      await res.revalidate(path)
      warmed++
    } catch (err) {
      failed++
      const msg = err instanceof Error ? err.message : 'unknown'
      errors.push(`${slug}: ${msg}`)
      Sentry.captureException(err, { tags: { cron: 'warm-celebs', slug } })
    }
  }

  return res.status(200).json({
    message: 'Celeb cache warm complete',
    requested: rows.length,
    warmed,
    failed,
    durationMs: Date.now() - startedAt,
    errors: errors.slice(0, 10),
  })
})
