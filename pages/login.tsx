import { useState, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { safeSessionGet } from '@/lib/safe-storage'
import { PENDING_COMPARE_KEY, PENDING_KEY, readKept } from '@/lib/kept-chart'
import { safeNext } from '@/lib/safe-next'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import AuthShell, { AuthCaptcha, PrivacyLine } from '@/components/redesign/AuthShell'

export default function LoginPage() {
  const router = useRouter()
  const redirectTo = safeNext(router.query.redirectTo) ?? '/birth-chart'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [captchaExpired, setCaptchaExpired] = useState(false)
  const [turnstileReady, setTurnstileReady] = useState(false)
  const turnstileRef = useRef<TurnstileInstance>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!turnstileToken) return

    setLoading(true)
    setError(null)

    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, turnstileToken }),
    })

    const data = await loginRes.json()
    if (!loginRes.ok) {
      if (loginRes.status === 403) {
        setTurnstileToken(null)
        turnstileRef.current?.reset()
      }
      setError(data.error)
      setLoading(false)
      return
    }

    // Back where they were, by way of anything made before signing in: a
    // comparison or chart they pressed Save on, or their chart kept on this device.
    const compare = safeSessionGet(PENDING_COMPARE_KEY) !== null
    const dest = compare ? '/calculators/synastry?saving=1' : redirectTo
    const pressed = safeSessionGet(PENDING_KEY) !== null
    if (pressed || readKept()) {
      const on = compare || (!pressed && dest !== '/birth-chart') ? `&next=${encodeURIComponent(dest)}` : ''
      window.location.href = `/birth-chart?save=1${on}`
    } else window.location.href = dest
  }

  function handleTurnstileExpire() {
    setTurnstileToken(null)
    setCaptchaExpired(true)
  }

  function handleTurnstileError() {
    setTurnstileToken(null)
    setTurnstileReady(true)
    setError("The check did not load. Refresh the page, or turn off any extension that blocks challenges.cloudflare.com.")
  }

  function handleTurnstileSuccess(token: string) {
    setTurnstileToken(token)
    setTurnstileReady(true)
    setCaptchaExpired(false)
  }

  const isInvalidCreds = error === 'Invalid login credentials'
  const passwordReset = router.query.passwordReset === '1'

  return (
    <>
      <Head>
        <title>Sign In | Birth Chart Library</title>
        <meta name="description" content="Sign in to Birth Chart Library to access your personalized daily horoscope, saved birth charts, and chart interpretations." />
        <meta name="robots" content="noindex" />
      </Head>
      <AuthShell
        title="Sign in"
        sub="Back to your chart, your people and your daily horoscope."
        after={<>
          <p>New here? <Link className="tlink" href={router.query.redirectTo ? `/signup?next=${encodeURIComponent(redirectTo)}` : '/signup'}>Create a free account</Link></p>
          <PrivacyLine text="Your data is encrypted, never sold, and you can delete it anytime." />
        </>}
      >
        {passwordReset ? <p className="okbox" role="status">Your password is changed. Sign in with the new one.</p> : null}
        <form className="mform" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input type="email" required autoComplete="email" autoCapitalize="none" autoCorrect="off" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
          </label>
          <AuthCaptcha boxRef={turnstileRef} ready={turnstileReady} expired={captchaExpired} onSuccess={handleTurnstileSuccess} onExpire={handleTurnstileExpire} onError={handleTurnstileError} />
          {error ? (
            <p className="err" role="alert">
              {isInvalidCreds ? <>That email and password do not match. <Link href="/forgot-password">Reset your password</Link></> : error}
            </p>
          ) : null}
          <button type="submit" className="btn wide" disabled={loading || !turnstileToken}>{loading ? 'Signing in…' : 'Sign in'}</button>
          <p className="hint center"><Link className="tlink" href="/forgot-password">Forgot your password?</Link></p>
        </form>
      </AuthShell>
    </>
  )
}
