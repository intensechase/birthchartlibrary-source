import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import * as Sentry from '@sentry/nextjs'
import { getUser } from '@/lib/auth'
import { isValidId } from '@/lib/validate'
import { env } from '@/lib/env'
import { sendErrorAlert } from '@/lib/emails'

// Throttle error alerts — at most one per 5 minutes across all routes
let lastErrorAlertAt = 0
const ERROR_ALERT_THROTTLE_MS = 5 * 60 * 1000

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

function isCsrfSafe(req: NextApiRequest): boolean {
  const method = req.method?.toUpperCase()
  if (!method || !MUTATING_METHODS.has(method)) return true

  // Modern browsers always send Origin on mutating requests. If absent,
  // assume it's a non-browser or attacker-crafted request and reject —
  // legitimate server-to-server callers (e.g. cron) use GET + bearer token.
  const origin = req.headers.origin
  if (!origin) return false

  const appOrigin = new URL(env.appUrl).origin
  return origin === appOrigin
}

export function adminHandler(handler: NextApiHandler): NextApiHandler {
  return apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await getUser({ req, res })
    if (!user || !user.is_admin) return res.status(401).json({ error: 'Unauthorized' })
    return handler(req, res)
  })
}

export function apiHandler(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!isCsrfSafe(req)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    try {
      await handler(req, res)
    } catch (err) {
      console.error(`[API] Unhandled error ${req.method} ${req.url}:`, err)
      Sentry.captureException(err, { tags: { route: req.url, method: req.method } })
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' })
      }
      const now = Date.now()
      if (now - lastErrorAlertAt > ERROR_ALERT_THROTTLE_MS) {
        lastErrorAlertAt = now
        sendErrorAlert(
          req.method ?? 'UNKNOWN',
          req.url ?? 'unknown',
          err instanceof Error ? err.message : String(err)
        ).catch(() => {})
      }
    }
  }
}

type IdHandler = (req: NextApiRequest, res: NextApiResponse, id: string) => Promise<void>

export function adminIdHandler(handlers: { patch?: IdHandler; delete?: IdHandler }): NextApiHandler {
  return apiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await getUser({ req, res })
    if (!user || !user.is_admin) return res.status(401).json({ error: 'Unauthorized' })

    const { id } = req.query
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid ID' })

    if (req.method === 'PATCH' && handlers.patch) return handlers.patch(req, res, id)
    if (req.method === 'DELETE' && handlers.delete) return handlers.delete(req, res, id)

    return res.status(405).json({ error: 'Method not allowed' })
  })
}
