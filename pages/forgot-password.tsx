import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import AuthShell from '@/components/redesign/AuthShell'

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
          <title>Check your inbox | Birth Chart Library</title>
          <meta name="robots" content="noindex" />
        </Head>
        <AuthShell
          title="Check your inbox"
          sub={<>If there is an account for <b>{email}</b>, a link to reset the password is on its way. It can take a few minutes; look in spam too.</>}
          after={<p><Link className="tlink" href="/login">Back to sign in</Link></p>}
        />
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
      <AuthShell title="Reset your password" sub="Enter your email and we will send you a link to choose a new one." after={<p>Remembered it? <Link className="tlink" href="/login">Sign in</Link></p>}>
        <form className="mform" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input type="email" required autoComplete="email" autoCapitalize="none" autoCorrect="off" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          {error ? <p className="err" role="alert">{error}</p> : null}
          <button type="submit" className="btn wide" disabled={loading}>{loading ? 'Sending…' : 'Send the link'}</button>
        </form>
      </AuthShell>
    </>
  )
}
