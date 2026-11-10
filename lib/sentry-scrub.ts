import type { ErrorEvent, EventHint } from '@sentry/nextjs'

// PII fields specific to this app — birth chart sites should NEVER leak
// these into observability tooling. Matched case-insensitively against
// request body keys, frame local variables, and event extra/contexts.
const PII_KEYS = new Set([
  'password', 'oldpassword', 'oldpw', 'newpassword',
  'email', 'pending_email', 'normalized',
  'birthdate', 'birth_date',
  'birthtime', 'birth_time',
  'birthcity', 'birth_city',
  'birthlat', 'birth_lat', 'birthlng', 'birth_lng',
  'lat', 'lng', 'latitude', 'longitude',
  'token', 'turnstiletoken', 'verificationtoken',
  'chart_data', 'chartdata',
])

const REDACTED = '[redacted]'

function isPiiKey(key: string): boolean {
  return PII_KEYS.has(key.toLowerCase().replace(/[-_]/g, ''))
}

function scrubObject(obj: unknown, depth = 0): unknown {
  if (depth > 8 || obj == null) return obj
  if (Array.isArray(obj)) return obj.map(v => scrubObject(v, depth + 1))
  if (typeof obj !== 'object') return obj
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    out[k] = isPiiKey(k) ? REDACTED : scrubObject(v, depth + 1)
  }
  return out
}

export function scrubSentryEvent(event: ErrorEvent, _hint: EventHint): ErrorEvent {
  // Strip cookies + auth headers from request
  if (event.request?.headers) {
    const h = event.request.headers as Record<string, string>
    if (h.cookie) h.cookie = REDACTED
    if (h.authorization) h.authorization = REDACTED
    if (h['x-forwarded-for']) h['x-forwarded-for'] = REDACTED
  }

  // Strip token-bearing query strings (reset, verify, unsubscribe)
  if (event.request?.query_string) {
    event.request.query_string = String(event.request.query_string).replace(
      /(token|reset|unsubscribe[-_]?token)=[^&]+/gi,
      '$1=' + REDACTED
    )
  }

  // Scrub request body
  if (event.request?.data) {
    event.request.data = scrubObject(event.request.data)
  }

  // Scrub extra + contexts (where ad-hoc data goes)
  if (event.extra) event.extra = scrubObject(event.extra) as typeof event.extra
  if (event.contexts) event.contexts = scrubObject(event.contexts) as typeof event.contexts

  // Scrub exception frame locals (from includeLocalVariables — defensive
  // even though we now leave it off, in case it's re-enabled)
  if (event.exception?.values) {
    for (const ex of event.exception.values) {
      if (!ex.stacktrace?.frames) continue
      for (const frame of ex.stacktrace.frames) {
        if (frame.vars) frame.vars = scrubObject(frame.vars) as typeof frame.vars
      }
    }
  }

  // Drop user.email/ip — keep only id for correlation
  if (event.user) {
    event.user = { id: event.user.id }
  }

  return event
}
