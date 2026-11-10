import { useState, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

export default function LoginPage() {
  const router = useRouter()
  const rawRedirect = (router.query.redirectTo as string) ?? '/daily-horoscope'
  const redirectTo = (rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')) ? rawRedirect : '/daily-horoscope'

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

    window.location.href = redirectTo
  }

  function handleTurnstileExpire() {
    setTurnstileToken(null)
    setCaptchaExpired(true)
  }

  function handleTurnstileError() {
    setTurnstileToken(null)
    setTurnstileReady(true)
    setError("We couldn't verify you with Cloudflare. Try refreshing this page, or disable browser extensions blocking challenges.cloudflare.com.")
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
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="card w-full max-w-md">
          <h1 className="font-display text-3xl md:text-4xl tracking-wide mb-6 text-center">Sign In</h1>

          {passwordReset && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm text-emerald-700 dark:text-emerald-300">
              Password updated successfully. Sign in with your new password.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-slate-500 dark:text-slate-400">
                Email <span aria-hidden="true" className="text-rose-600">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-slate-500 dark:text-slate-400">
                Password <span aria-hidden="true" className="text-rose-600">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
            </div>

            <div>
              <Turnstile
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={handleTurnstileSuccess}
                onExpire={handleTurnstileExpire}
                onError={handleTurnstileError}
              />
              {!turnstileReady && (
                <p className="text-xs text-slate-400 mt-1.5" role="status">
                  Verifying you&apos;re human&hellip;
                </p>
              )}
            </div>

            {captchaExpired && (
              <p className="text-amber-600 text-sm">
                Verification expired...{' '}
                <button
                  type="button"
                  onClick={() => turnstileRef.current?.reset()}
                  className="underline underline-offset-2 hover:text-amber-700"
                >
                  click to refresh
                </button>
              </p>
            )}

            {error && (
              <div className="text-red-600 text-sm">
                {isInvalidCreds ? (
                  <p>
                    Incorrect email or password...{' '}
                    <Link href="/forgot-password" className="underline underline-offset-2 hover:text-red-700">
                      forgot your password?
                    </Link>
                  </p>
                ) : (
                  <p>{error}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !turnstileToken}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in\u2026' : 'Sign In'}
            </button>
          </form>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 text-center flex items-center justify-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Your data is encrypted, never sold, and you can delete it anytime.
          </p>

          <div className="flex items-center justify-between mt-4">
            <Link href="/forgot-password" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Forgot password?
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <Link href="/signup" className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
