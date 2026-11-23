import Head from 'next/head'
import AuthShell from '@/components/redesign/AuthShell'
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

const SAYS: Record<State['status'], string> = {
  loading: 'One moment…',
  success: 'Taking you to your account…',
  invalid: 'This link does not work, or it was used already.',
  expired: 'This link is too old. Sign in and ask for a new one.',
  error: 'Something went wrong. Try the link again in a moment.',
  'no-token': 'The link is missing a piece. Open it again from your email.',
}

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
        <title>Verify your email | Birth Chart Library</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AuthShell
        title={state.status === 'success' ? 'Your email is verified' : 'Verify your email'}
        sub={<span role="status">{SAYS[state.status]}</span>}
        after={['invalid', 'expired', 'error'].includes(state.status) ? <p><Link className="btn" href="/account">Go to your account</Link></p> : null}
      />
    </>
  )
}
