'use client'

import { useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export default function GuestHoroscopeSignup() {
  const [email, setEmail] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ sunSign: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const maxDay = birthMonth ? DAYS_IN_MONTH[parseInt(birthMonth, 10) - 1] : 31
  const validDay = birthDay && parseInt(birthDay, 10) >= 1 && parseInt(birthDay, 10) <= maxDay
  const canSubmit = email && birthMonth && validDay && turnstileToken && !loading

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/guest-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, birthMonth: parseInt(birthMonth, 10), birthDay: parseInt(birthDay, 10), turnstileToken }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong... please try again.')
      } else {
        setResult({ sunSign: data.sunSign })
      }
    } catch {
      setError('Something went wrong... please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="card text-center py-6">
        <p className="text-2xl mb-2">☉</p>
        <h3 className="font-display text-xl tracking-wide mb-1">You&apos;re subscribed</h3>
        <p className="text-slate-500 text-sm">
          Daily horoscope emails start tomorrow morning.{' '}
          <span className="text-slate-700 font-medium">{result.sunSign} Sun</span> — check your inbox for a welcome note.
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-base font-semibold text-slate-700 mb-1">Daily horoscope emails</h3>
      <p className="text-slate-500 text-sm mb-4">
        No account needed. Enter your birthday and we&apos;ll send you a daily cosmic briefing — Moon sign, energy forecast, and a reflection to start the day.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Your email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          inputMode="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          maxLength={254}
          className="input w-full"
        />
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Your birthday</label>
          <div className="flex gap-2">
            <select
              value={birthMonth}
              onChange={e => { setBirthMonth(e.target.value); setBirthDay('') }}
              required
              aria-label="Birth month"
              className="input flex-1"
            >
              <option value="">Month</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={birthDay}
              onChange={e => setBirthDay(e.target.value)}
              required
              disabled={!birthMonth}
              aria-label="Birth day"
              className="input w-20"
            >
              <option value="">Day</option>
              {Array.from({ length: maxDay }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={setTurnstileToken}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-primary w-full"
        >
          {loading ? 'Subscribing...' : "Subscribe — it's free"}
        </button>
      </form>
      <p className="text-xs text-slate-400 mt-3 text-center">
        Want a personalized chart?{' '}
        <a href="/signup" className="underline hover:text-slate-600 transition-colors">Create a free account</a>
      </p>
    </div>
  )
}
