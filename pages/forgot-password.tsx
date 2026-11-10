import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <>
        <Head>
          <title>Check Your Inbox | Birth Chart Library</title>
        </Head>
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="card w-full max-w-md text-center py-10">
            <div className="text-4xl mb-4">{'\u2726'}</div>
            <h1 className="font-display text-2xl tracking-wide mb-2">Check Your Inbox</h1>
            <p className="text-slate-500 text-sm">
              A password reset link has been sent to{' '}
              <span className="font-medium text-slate-700">{email}</span>.
            </p>
            <Link href="/login" className="inline-block mt-6 btn-outline text-sm">
              Back to Sign In
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Reset Password | Birth Chart Library</title>
        <meta name="description" content="Reset your Birth Chart Library password. Enter your email to receive a reset link." />
        <meta name="robots" content="noindex" />
      </Head>
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="card w-full max-w-md">
          <h1 className="font-display text-2xl tracking-wide mb-2 text-center">Reset Password</h1>
          <p className="text-slate-500 text-sm text-center mb-6">Enter your email and we&apos;ll send you a reset link.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-slate-500">
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
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
              />
            </div>

            {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-slate-500">
            Remember your password?{' '}
            <Link href="/login" className="text-slate-600 hover:text-slate-800">Sign in</Link>
          </p>
        </div>
      </main>
    </>
  )
}
