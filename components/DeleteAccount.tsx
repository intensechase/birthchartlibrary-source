'use client'

import { useState } from 'react'

export default function DeleteAccount() {
  const [step, setStep] = useState<'idle' | 'confirm' | 'deleting'>('idle')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (!password) { setError('Enter your password to confirm'); return }
    setStep('deleting')
    setError(null)

    const res = await fetch('/api/auth/delete-account', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Something went wrong')
      setStep('confirm')
      return
    }

    window.location.href = '/'
  }

  if (step === 'idle') {
    return (
      <button
        onClick={() => setStep('confirm')}
        className="text-xs text-red-400 hover:text-red-600 transition-colors"
      >
        Delete my account
      </button>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-sm text-red-700 mb-1 font-medium">Are you sure?</p>
      <p className="text-xs text-red-500 mb-3">
        This will permanently delete your account, birth charts, and all data. This cannot be undone.
      </p>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="input text-sm py-1.5 mb-3"
        placeholder="Enter your password to confirm"
        autoComplete="current-password"
      />
      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={step === 'deleting' || !password}
          className="text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {step === 'deleting' ? 'Deleting...' : 'Yes, delete everything'}
        </button>
        <button
          onClick={() => { setStep('idle'); setPassword(''); setError(null) }}
          className="text-xs px-3 py-1.5 text-slate-500 hover:text-slate-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
