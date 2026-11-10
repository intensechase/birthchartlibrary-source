'use client'

import { useState, useEffect } from 'react'
import { safeLocalGet, safeLocalSet } from '@/lib/safe-storage'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = safeLocalGet('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    safeLocalSet('cookie-consent', 'accepted')
    setVisible(false)
  }

  function decline() {
    safeLocalSet('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white border-t border-slate-200 shadow-lg">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-slate-600 text-sm flex-1">
          We use cookies for analytics and to support ads that keep this site free. See our{' '}
          <a href="/privacy" className="underline hover:text-slate-800">privacy policy</a>.
        </p>
        <div className="flex gap-2 shrink-0">
          <button onClick={decline} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
            Decline
          </button>
          <button onClick={accept} className="btn-primary text-sm py-2">
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
