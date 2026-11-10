import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Mediates email verification so the link-click is a real browser action, not
// an email-client prefetch. The email template now links here (instead of
// /api/auth/verify-email) and this page POSTs the token from JS onMount.
// Prefetchers don't execute JS → no accidental verification.

type State =
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'invalid' }
  | { status: 'expired' }
  | { status: 'error' }
  | { status: 'no-token' }

export default function VerifyEmailPage() {
  const router = useRouter()
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    if (!router.isReady) return
    const token = router.query.token
    if (!token || typeof token !== 'string') {
      setState({ status: 'no-token' })
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
        if (cancelled) return
        if (res.ok) {
          setState({ status: 'success' })
          // Brief pause so the user sees the confirmation before bouncing
          setTimeout(() => router.replace('/account?emailVerified=1'), 1500)
          return
        }
        const data = await res.json().catch(() => ({ error: 'error' }))
        const err = data?.error
        if (err === 'invalid') setState({ status: 'invalid' })
        else if (err === 'expired') setState({ status: 'expired' })
        else setState({ status: 'error' })
      } catch {
        if (!cancelled) setState({ status: 'error' })
      }
    })()
    return () => { cancelled = true }
  }, [router.isReady, router.query.token, router])

  return (
    <>
      <Head>
        <title>Verify Email — Birth Chart Library</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl tracking-wide mb-4">Verify Your Email</h1>
        {state.status === 'loading' && (
          <p className="text-slate-500">Verifying…</p>
        )}
        {state.status === 'success' && (
          <p className="text-slate-700 dark:text-slate-200">Your email is verified. Redirecting…</p>
        )}
        {state.status === 'invalid' && (
          <>
            <p className="text-slate-700 dark:text-slate-200 mb-4">This verification link is invalid or has already been used.</p>
            <Link href="/account" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Go to your account →</Link>
          </>
        )}
        {state.status === 'expired' && (
          <>
            <p className="text-slate-700 dark:text-slate-200 mb-4">This verification link has expired. Sign in and request a new one.</p>
            <Link href="/account" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Go to your account →</Link>
          </>
        )}
        {state.status === 'no-token' && (
          <p className="text-slate-700 dark:text-slate-200">Missing verification token. Check the link in your email.</p>
        )}
        {state.status === 'error' && (
          <>
            <p className="text-slate-700 dark:text-slate-200 mb-4">Something went wrong while verifying. Please try again.</p>
            <Link href="/account" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Go to your account →</Link>
          </>
        )}
      </main>
    </>
  )
}
