import type { NextApiRequest } from 'next'

// cf-connecting-ip is set exclusively by Cloudflare's edge — it strips any
// client-supplied value for this header before forwarding to origin, so it
// can't be spoofed the way x-forwarded-for can. x-forwarded-for is
// attacker-controllable end-to-end (a client can send an arbitrary chain,
// and naively taking the leftmost entry trusts whatever the client claimed
// rather than a value any proxy actually verified), which meant every
// IP-keyed rate limit in the app — password reset, login, guest chart
// calculation, celebrity requests — could be bypassed by sending a
// different fake X-Forwarded-For value on every request. Falls back to
// x-forwarded-for only for local/non-Cloudflare traffic (e.g. health
// checks hitting the container directly).
export function getClientIp(req: NextApiRequest): string {
  const cfIp = req.headers['cf-connecting-ip']
  if (typeof cfIp === 'string' && cfIp) return cfIp
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
}
