import type { NextApiRequest } from 'next'
import * as Sentry from '@sentry/nextjs'
import { query } from './db'
import { getClientIp } from './request'

// Closed list of event types. Adding a new type is fine — keeping the
// vocabulary closed makes ad-hoc queries reliable.
export type AuthEventType =
  | 'login_success'
  | 'login_failure'
  | 'signup'
  | 'signout'
  | 'password_changed'
  | 'password_reset_requested'
  | 'password_reset_completed'
  | 'email_change_requested'
  | 'email_change_completed'
  | 'email_verified'
  | 'account_deleted'

interface LogOpts {
  type: AuthEventType
  req: NextApiRequest
  userId?: string | null
  email?: string | null
  metadata?: Record<string, unknown>
}

// Append-only audit log. Best-effort: a DB write failure here must
// never break the user-facing auth flow, so errors are swallowed +
// reported to Sentry instead of bubbling up.
//
// IP and user-agent are captured intentionally — this is the one place
// in the app where "who/where" matters more than data minimization.
// Retention policy elsewhere will purge rows older than 1 year.
export async function logAuthEvent(opts: LogOpts): Promise<void> {
  try {
    const ua = (opts.req.headers['user-agent'] || null) as string | null
    await query(
      `INSERT INTO auth_events (event_type, user_id, email, ip, user_agent, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        opts.type,
        opts.userId ?? null,
        opts.email ? opts.email.toLowerCase() : null,
        getClientIp(opts.req),
        ua ? ua.slice(0, 500) : null,
        opts.metadata ? JSON.stringify(opts.metadata) : null,
      ]
    )
  } catch (err) {
    Sentry.captureException(err, { tags: { component: 'audit', event_type: opts.type } })
  }
}
