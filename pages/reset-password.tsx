import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import AuthShell from '@/components/redesign/AuthShell'
import { useRouter } from 'next/router'

export default function ResetPasswordPage() {
  const router = useRouter()
  const token = router.query.token as string | undefined
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setLoading(true)
    setError(null)

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
      setLoading(false)
      return
    }

    router.push('/login?passwordReset=1')
  }

  if (!token) {
    return (
      <>
        <Head>
          <title>Reset Password | Birth Chart Library</title>
          <meta name="description" content="Reset your Birth Chart Library account password." />
          <meta name="robots" content="noindex" />
        </Head>
        <AuthShell title="This link does not work" sub="It is missing a piece or has been used already." after={<p><Link className="btn" href="/forgot-password">Get a new link</Link></p>} />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Reset Password | Birth Chart Library</title>
        <meta name="description" content="Set a new password for your Birth Chart Library account." />
        <meta name="robots" content="noindex" />
      </Head>
      <AuthShell title="Choose a new password">
        <form className="mform" onSubmit={handleSubmit}>
          <label className="field">
            <span>New password</span>
            <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" />
          </label>
          {error ? <p className="err" role="alert">{error}</p> : null}
          <button type="submit" className="btn wide" disabled={loading || password.length < 8}>{loading ? 'Saving…' : 'Save the new password'}</button>
        </form>
      </AuthShell>
    </>
  )
}
