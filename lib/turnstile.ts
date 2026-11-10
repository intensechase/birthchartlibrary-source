import { env } from './env'

const TURNSTILE_TIMEOUT_MS = 5000

export async function verifyTurnstile(token: string): Promise<boolean> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TURNSTILE_TIMEOUT_MS)
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.turnstileSecret,
        response: token,
      }),
      signal: controller.signal,
    })
    if (!response.ok) return false
    const data = await response.json()
    return data.success === true && !data['error-codes']?.length
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}
