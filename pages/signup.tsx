import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs transition-all duration-300 ${met ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500'}`}>
      <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full border transition-all duration-300 text-[10px] font-bold
        ${met ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 dark:border-slate-600'}`}>
        {met ? '\u2713' : '\u00B7'}
      </span>
      {label}
    </div>
  )
}

function StarField() {
  const stars = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.6 + 0.1,
    delay: `${Math.random() * 4}s`,
  })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-slate-300 animate-pulse"
          style={{
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            opacity: s.opacity,
            animationDelay: s.delay,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const ref = router.query.ref as string | undefined
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [captchaExpired, setCaptchaExpired] = useState(false)
  const [turnstileReady, setTurnstileReady] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const turnstileRef = useRef<TurnstileInstance>(null)

  const rules = {
    length: password.length >= 8,
    letters: /[a-zA-Z]/.test(password),
    numbers: /[0-9]/.test(password),
  }
  const metCount = [rules.length, rules.letters, rules.numbers].filter(Boolean).length
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)
  const isStrong = metCount === 3 && (password.length >= 12 || hasSpecial)

  const strengthLabel = password.length === 0 ? null
    : metCount <= 1 ? 'Weak'
    : metCount === 2 ? 'Fair'
    : isStrong ? 'Strong' : 'Good'

  const strengthColor = password.length === 0 ? 'bg-slate-200'
    : metCount <= 1 ? 'bg-red-500'
    : metCount === 2 ? 'bg-amber-500'
    : isStrong ? 'bg-emerald-400' : 'bg-yellow-400'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!turnstileToken || metCount < 3) return
    if (honeypot) return
    setLoading(true)
    setError(null)

    const signupRef = ref || null
    const signupSource = signupRef
      ? signupRef.startsWith('blog') ? 'blog'
      : signupRef.startsWith('calc') ? 'calculator'
      : signupRef.startsWith('social') || signupRef.startsWith('twitter') || signupRef.startsWith('youtube') ? 'social'
      : 'referral'
      : 'direct'

    const signupRes = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, turnstileToken, signup_source: signupSource, signup_ref: signupRef }),
    })

    const data = await signupRes.json()
    if (!signupRes.ok) {
      if (signupRes.status === 403) {
        setTurnstileToken(null)
        turnstileRef.current?.reset()
      }
      setError(data.error)
      setLoading(false)
      return
    }

    // Account created and logged in — fire Pinterest signup event then redirect
    if (typeof window !== 'undefined' && (window as any).pintrk) {
      (window as any).pintrk('track', 'signup', {
        event_id: `bcl-signup-${Date.now()}`,
        lead_type: 'Free Account',
      })
    }
    window.location.href = '/birth-chart?welcome=true'
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



  return (
    <>
      <Head>
        <title>Sign Up | Birth Chart Library</title>
        <meta name="description" content="Create a free Birth Chart Library account to get your personalized birth chart, daily horoscope, and astrology interpretations." />
        <meta name="robots" content="noindex" />
      </Head>
      <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <StarField />

        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-3xl mb-3 tracking-widest text-slate-400">{'\u2726'} {'\u2726'} {'\u2726'}</div>
            <h1 className="font-serif text-4xl font-bold mb-2 bg-gradient-to-b from-slate-800 to-slate-500 bg-clip-text text-transparent">
              Begin Your Journey
            </h1>
            <p className="text-slate-500 text-sm">
              Create your account to generate your natal chart
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2 text-slate-500 dark:text-slate-400">
                  Email Address <span aria-hidden="true" className="text-rose-600 normal-case">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input type="email" required autoComplete="email" autoCapitalize="none" autoCorrect="off" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest mb-2 text-slate-500 dark:text-slate-400">
                  Password <span aria-hidden="true" className="text-rose-600 normal-case">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  className="input"
                  placeholder="At least 8 characters"
                />

                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3].map(n => (
                        <div key={n} className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${n <= metCount ? strengthColor : 'bg-slate-200'}`} />
                      ))}
                    </div>
                    {strengthLabel && (
                      <p className={`text-xs text-right transition-colors duration-300 ${isStrong ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {isStrong ? '\u2726 ' : ''}{strengthLabel}
                      </p>
                    )}
                  </div>
                )}

                {(passwordFocused || password.length > 0) && (
                  <div className="mt-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-1.5">
                    <PasswordRule met={rules.length} label="At least 8 characters" />
                    <PasswordRule met={rules.letters} label="Contains letters" />
                    <PasswordRule met={rules.numbers} label="Contains numbers" />
                    <div className={`flex items-center gap-2 text-xs transition-all duration-300 mt-2 pt-2 border-t border-slate-200 dark:border-slate-600 ${isStrong ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500'}`}>
                      <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full border transition-all duration-300 text-[10px] ${isStrong ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
                        {isStrong ? '\u2605' : '\u00B7'}
                      </span>
                      12+ chars or special characters for strong
                    </div>
                  </div>
                )}
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
                  <button type="button" onClick={() => turnstileRef.current?.reset()} className="underline underline-offset-2 hover:text-amber-700">
                    click to refresh
                  </button>
                </p>
              )}

              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <p>{error}</p>
                  {error.includes('already exists') && (
                    <div className="mt-2 flex gap-3 text-xs">
                      <Link href="/login" className="underline underline-offset-2 hover:text-red-700">Sign in</Link>
                      <Link href="/forgot-password" className="underline underline-offset-2 hover:text-red-700">Reset password</Link>
                    </div>
                  )}
                </div>
              )}

              <button type="submit" disabled={loading || !turnstileToken || metCount < 3} className="btn-primary w-full py-3 text-base">
                {loading ? 'Creating account\u2026' : 'Create Account'}
              </button>
            </form>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 text-center flex items-center justify-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Your birth data is encrypted, never sold, and you can delete it anytime.
            </p>

            <p className="text-xs text-center mt-6 text-slate-400 dark:text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-colors">Sign in</Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Free forever · Open source · Ad-supported
          </p>
        </div>
      </main>
    </>
  )
}
