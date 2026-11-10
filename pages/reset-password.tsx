import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
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
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="card w-full max-w-md text-center py-10">
            <h1 className="font-display text-2xl tracking-wide mb-2">Invalid Link</h1>
            <p className="text-slate-500 text-sm mb-4">This reset link is missing or invalid.</p>
            <Link href="/forgot-password" className="btn-outline text-sm">Request a New Link</Link>
          </div>
        </main>
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
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="card w-full max-w-md">
          <h1 className="font-display text-2xl tracking-wide mb-2 text-center">Choose a New Password</h1>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label className="block text-sm mb-1 text-slate-500">New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                placeholder="At least 8 characters"
              />
            </div>
            {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading || password.length < 8} className="btn-primary w-full">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </main>
    </>
  )
}
