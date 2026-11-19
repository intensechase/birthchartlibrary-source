import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../lib/db'

// Used by UptimeRobot and by deploy/deploy.sh's gate before a new build goes live.
// It must touch the database: on 2026-11-19 Postgres came up on localhost only after a
// reboot, every page failed for ~14h, and the old always-"ok" version stayed green.
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store')
  try {
    await pool.query('SELECT 1')
    res.status(200).json({ status: 'ok', db: 'ok' })
  } catch {
    // No error details in the response; Sentry already gets the exception from pages.
    res.status(503).json({ status: 'error', db: 'unreachable' })
  }
}
