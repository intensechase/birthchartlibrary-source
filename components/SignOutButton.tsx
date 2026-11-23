'use client'

import { useState } from 'react'
import { clearTab } from '@/lib/kept-chart'

export default function SignOutButton() {
  const [confirming, setConfirming] = useState(false)

  async function handleSignOut() {
    await fetch('/api/auth/signout', { method: 'POST' })
    clearTab()
    window.location.href = '/'
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleSignOut}
          className="text-xs text-red-500 hover:text-red-700 transition-colors border border-red-200 rounded-lg px-3 py-1.5"
        >
          Confirm
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-slate-400 hover:text-slate-800 transition-colors border border-slate-200 rounded-lg px-3 py-1.5"
    >
      Sign out
    </button>
  )
}
