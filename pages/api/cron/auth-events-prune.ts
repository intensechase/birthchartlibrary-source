import type { NextApiRequest, NextApiResponse } from 'next'
import { timingSafeEqual } from 'crypto'
import * as Sentry from '@sentry/nextjs'
import { query, queryOne } from '@/lib/db'
import { env } from '@/lib/env'
import { apiHandler } from '@/lib/apiHandler'

// Daily prune of auth_events older than 1 year. The audit table is
// append-only and unbounded otherwise — 365 days is long enough for
// after-the-fact incident review while keeping the table from growing
// forever. Bumping the window is fine; shrinking it loses history.
const RETENTION_DAYS = 365

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const authHeader = req.headers.authorization
  const expected = `Bearer ${env.cronSecret}`
  if (!authHeader || !env.cronSecret ||
      authHeader.length !== expected.length ||
      !timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected))) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const runDate = new Date().toISOString().slice(0, 10)

  // Same idempotency pattern as the daily-email cron — claim today's
  // slot, abort if another run already took it.
  const claim = await queryOne<{ job: string }>(
    `INSERT INTO cron_runs (job, run_date) VALUES ('auth-events-prune', $1)
     ON CONFLICT (job, run_date) DO NOTHING
     RETURNING job`,
    [runDate]
  )
  if (!claim) {
    return res.status(200).json({ message: 'Already ran today', skipped: true })
  }

  let deleted = 0
  try {
    const result = await query<{ id: string }>(
      `DELETE FROM auth_events WHERE created_at < NOW() - ($1::int * INTERVAL '1 day') RETURNING id`,
      [RETENTION_DAYS]
    )
    deleted = result.length
  } catch (err) {
    Sentry.captureException(err, { tags: { cron: 'auth-events-prune' } })
    throw err
  }

  await query(
    `UPDATE cron_runs SET finished_at = NOW(), sent = $1
     WHERE job = 'auth-events-prune' AND run_date = $2`,
    [deleted, runDate]
  )

  return res.status(200).json({ message: 'Auth events prune complete', deleted, retention_days: RETENTION_DAYS })
})
