'use client'

import { useState, useEffect } from 'react'

export default function EmailVerificationBanner() {
  const [show, setShow] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    // Check URL params for verification result
    const params = new URLSearchParams(window.location.search)
    if (params.get('emailVerified') === '1') {
      setVerified(true)
      window.history.replaceState({}, '', window.location.pathname)
      return
    }

    // Check if user needs to verify — fetch from API
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.email_verified === false) setShow(true)
    }).catch(() => {})
  }, [])

  async function handleResend() {
    setSending(true)
    const res = await fetch('/api/auth/resend-verification', { method: 'POST' })
    setSending(false)
    if (res.ok) setSent(true)
  }

  if (verified) {
    return (
      <div className="bg-green-50 dark:bg-green-950 border-b border-green-200 dark:border-green-800 px-4 py-3 text-center text-sm text-green-700 dark:text-green-300">
        Your email address has been verified.
      </div>
    )
  }

  if (!show) return null

  return (
    <div className="bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800 px-4 py-3 flex flex-wrap items-center justify-center gap-3 text-sm text-amber-800 dark:text-amber-300">
      <span>Please verify your email address to secure your account.</span>
      {sent ? (
        <span className="text-amber-600 font-medium">Verification email sent... check your inbox.</span>
      ) : (
        <button
          onClick={handleResend}
          disabled={sending}
          className="underline hover:no-underline disabled:opacity-50 font-medium"
        >
          {sending ? 'Sending...' : 'Resend verification email'}
        </button>
      )}
    </div>
  )
}
