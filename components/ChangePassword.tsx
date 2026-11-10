'use client'

import { useState } from 'react'

export default function ChangePassword() {
  const [editing, setEditing] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (!oldPassword) {
      setError('Enter your current password')
      return
    }
    if (!password || password.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }

    setSaving(true)
    setError(null)
    setMessage(null)

    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, password }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
    } else {
      setMessage('Password updated.')
      setEditing(false)
      setOldPassword('')
      setPassword('')
    }
    setSaving(false)
  }

  if (!editing) {
    return (
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">Password</p>
            <p className="text-slate-700">••••••••</p>
          </div>
          <button
            onClick={() => { setEditing(true); setMessage(null); setError(null) }}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors shrink-0 ml-4"
          >
            Change
          </button>
        </div>
        {message && <p className="text-green-700 text-sm mt-3">{message}</p>}
      </div>
    )
  }

  return (
    <div className="card space-y-2">
      <div>
        <p className="text-xs text-slate-400 mb-1">Current Password</p>
        <input
          type="password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          className="input text-sm py-1.5 w-full"
          autoFocus
          autoComplete="current-password"
        />
      </div>
      <div>
        <p className="text-xs text-slate-400 mb-1">New Password</p>
        <div className="flex items-center gap-2">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input text-sm py-1.5 flex-1"
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-xs py-1.5 px-3 shrink-0"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => { setEditing(false); setOldPassword(''); setPassword(''); setError(null) }}
            className="text-xs text-slate-400 hover:text-slate-800 shrink-0"
          >
            Cancel
          </button>
        </div>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  )
}
