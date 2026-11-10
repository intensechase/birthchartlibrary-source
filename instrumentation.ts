import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Helsinki's Docker bridge network has no IPv6 route, so any outbound
    // fetch to a dual-stack host (Turnstile, Wikidata, Nominatim) wastes a
    // doomed IPv6 attempt before falling back to IPv4 -- and on rare
    // transient blips both attempts fail together (ENETUNREACH + ETIMEDOUT).
    // Dynamic import keeps 'dns' (Node-only) out of the Edge runtime bundle.
    const dns = await import('dns')
    dns.setDefaultResultOrder('ipv4first')
    await import('./sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

export const onRequestError = Sentry.captureRequestError
