'use client'

import { useState, useEffect } from 'react'

interface Props {
  email: string
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return '***'
  const visible = local.length <= 3 ? local[0] : local.substring(0, 3)
  return `${visible}${'•'.repeat(Math.max(local.length - visible.length, 3))}@${domain}`
}

const EMAIL_ERROR_MESSAGES: Record<string, string> = {
  invalid: 'That verification link is invalid.',
  expired: 'That verification link has expired. Please request a new one.',
  taken: 'That email address is already in use.',
}

export default function EmailSettings({ email }: Props) {
  const [editing, setEditing] = useState(false)
  const [showFull, setShowFull] = useState(false)
  const [newEmail, setNewEmail] = useState(email)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('emailChanged') === '1') {
      setMessage('Your email address has been updated.')
      window.history.replaceState({}, '', window.location.pathname)
    } else if (params.get('emailError')) {
      setError(EMAIL_ERROR_MESSAGES[params.get('emailError')!] || 'Something went wrong.')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  async function handleSave() {
    if (!newEmail || newEmail === email) { setEditing(false); return }

    setSaving(true)
    setError(null)
    setMessage(null)

    const res = await fetch('/api/auth/change-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
    } else {
      setMessage(data.message || 'Check your new email address for a confirmation link.')
      setEditing(false)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-3">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">Email Address</p>
            {editing ? (
              <input
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                inputMode="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                className="input text-sm py-1.5"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-slate-700">{showFull ? email : maskEmail(email)}</p>
                <button onClick={() => setShowFull(!showFull)} className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors">
                  {showFull ? 'Hide' : 'Show'}
                </button>
              </div>
            )}
          </div>
          {editing ? (
            <div className="flex gap-2 shrink-0 ml-4">
              <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-1.5 px-3 disabled:opacity-50">
                {saving ? 'Sending...' : 'Save'}
              </button>
              <button onClick={() => { setEditing(false); setNewEmail(email) }} disabled={saving} className="text-xs text-slate-400 hover:text-slate-800 disabled:opacity-40">
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="text-xs text-slate-500 hover:text-slate-800 transition-colors shrink-0 ml-4">
              Change
            </button>
          )}
        </div>
      </div>

      {message && <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">{message}</p>}
      {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
    </div>
  )
}
