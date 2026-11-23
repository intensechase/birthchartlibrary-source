import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { PENDING_COMPARE_KEY, clearWaiting, waitingChart, type PendingChart } from '@/lib/kept-chart'
import { safeSessionGet } from '@/lib/safe-storage'
import { safeNext } from '@/lib/safe-next'
import { track } from '@/lib/track'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import AuthShell, { AuthCaptcha, PrivacyLine } from '@/components/redesign/AuthShell'

const RULES: [key: 'length' | 'letters' | 'numbers', label: string][] = [['length', '8 characters'], ['letters', 'a letter'], ['numbers', 'a number']]

// "1990-07-04" to "July 4, 1990"; anything else passes through.
function niceDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${names[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`
}

export default function SignupPage() {
  const router = useRouter()
  const ref = router.query.ref as string | undefined
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [captchaExpired, setCaptchaExpired] = useState(false)
  const [turnstileReady, setTurnstileReady] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const turnstileRef = useRef<TurnstileInstance>(null)
  // A chart the reader made before signing up (set by the chart page's save
  // bar). It is sent with the sign up so it saves in the same step.
  const [held, setHeld] = useState<PendingChart | null>(null)
  // A comparison they pressed Save on: the compare page saves it on arrival.
  const [compare, setCompare] = useState(false)
  useEffect(() => { setHeld(waitingChart()); setCompare(safeSessionGet(PENDING_COMPARE_KEY) !== null) }, [])
  const next = safeNext(router.query.next)

  const rules = {
    length: password.length >= 8,
    letters: /[a-zA-Z]/.test(password),
    numbers: /[0-9]/.test(password),
  }
  const metCount = [rules.length, rules.letters, rules.numbers].filter(Boolean).length

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
      body: JSON.stringify({ email, password, turnstileToken, signup_source: signupSource, signup_ref: signupRef, chart: held }),
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
    // Straight to the saved chart when it saved with the account; a page that
    // sent the reader here (compare) gets them back; otherwise make a chart.
    track('signup_finished', compare ? 'comparison' : !held ? 'none' : held.isForSelf ? 'self' : 'someone')
    if (data.chartId && held) clearWaiting(held)
    if (compare) window.location.href = '/calculators/synastry?saving=1'
    else if (data.chartId) window.location.href = `/birth-chart/${data.chartId}`
    else window.location.href = next ?? '/birth-chart?welcome=true'
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



  return (
    <>
      <Head>
        <title>Sign Up | Birth Chart Library</title>
        <meta name="description" content="Create a free Birth Chart Library account to get your personalized birth chart, daily horoscope, and astrology interpretations." />
        <meta name="robots" content="noindex" />
      </Head>
      <AuthShell
        title={compare ? 'Keep your comparison' : held ? 'Keep your chart' : 'Create your free account'}
        sub={compare
          ? `Your comparison saves to your account as you sign up${held ? ', and so does your chart' : ''}.`
          : held
          ? `${held.isForSelf === false && held.subjectName ? `${held.subjectName}’s chart` : 'Your chart'} for ${niceDate(held.birthDate)} saves to your account as you sign up. Private unless you share it.`
          : 'Save your chart and the charts of people you know, and compare any two.'}
        after={<>
          <p>Already have an account? <Link className="tlink" href={next ? `/login?redirectTo=${encodeURIComponent(next)}` : '/login'}>Sign in</Link></p>
          <PrivacyLine text="Your birth data is encrypted, never sold, and you can delete it anytime." />
          <p className="fine">Free · Open source · Ad supported</p>
        </>}
      >
        <form className="mform" onSubmit={handleSubmit}>
          <div className="hp" aria-hidden="true">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
          </div>
          <label className="field">
            <span>Email</span>
            <input type="email" required autoComplete="email" autoCapitalize="none" autoCorrect="off" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <div className="field">
            <label htmlFor="new-password">Password</label>
            <input id="new-password" type="password" required autoComplete="new-password" aria-describedby="pw-rules" value={password} onChange={e => setPassword(e.target.value)} />
            <ul className="pwrules" id="pw-rules" aria-label="The password needs">
              {RULES.map(([k, label]) => <li key={k} className={rules[k] ? 'met' : undefined}><span aria-hidden="true">{rules[k] ? '✓' : '·'}</span>{label}{rules[k] ? <span className="sr-only"> (done)</span> : null}</li>)}
            </ul>
          </div>
          <AuthCaptcha boxRef={turnstileRef} ready={turnstileReady} expired={captchaExpired} onSuccess={handleTurnstileSuccess} onExpire={handleTurnstileExpire} onError={handleTurnstileError} />
          {error ? (
            <div className="err" role="alert">
              <p>{error}</p>
              {error.includes('already exists') ? (
                <p><Link href={next ? `/login?redirectTo=${encodeURIComponent(next)}` : '/login'}>Sign in</Link> or <Link href="/forgot-password">reset your password</Link></p>
              ) : null}
            </div>
          ) : null}
          <button type="submit" className="btn wide" disabled={loading || !turnstileToken || metCount < 3}>{loading ? 'Creating your account…' : 'Create account'}</button>
        </form>
      </AuthShell>
    </>
  )
}
