'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Turnstile } from '@marsidev/react-turnstile'
import CityAutocomplete from '@/components/CityAutocomplete'
import { getElementColor } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'

interface BigThree {
  sun: { sign: string; house: number }
  moon: { sign: string; house: number }
  rising: string
}

export default function BigThreeCalculator() {
  const [form, setForm] = useState({ birthDate: '', birthTime: '', birthCity: '', birthLat: 0, birthLng: 0 })
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [result, setResult] = useState<BigThree | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleCitySelect(city: string, lat: number, lng: number) {
    setForm(prev => ({ ...prev, birthCity: city, birthLat: lat, birthLng: lng }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!turnstileToken) return
    if (!form.birthLat || !form.birthLng) { setError('Please select a city from the dropdown'); return }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); setLoading(false); return }

      const chart = data.chart
      const sun = chart.planets.find((p: { planet: string }) => p.planet === 'SUN')
      const moon = chart.planets.find((p: { planet: string }) => p.planet === 'MOON')

      setResult({
        sun: { sign: sun.sign, house: sun.house },
        moon: { sign: moon.sign, house: moon.house },
        rising: chart.ascendantSign,
      })
    } catch {
      setError('Network error... please try again')
    }
    setLoading(false)
  }

  return (
    <div>
      {!result ? (
        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="block text-sm mb-1 text-slate-500">Birth Date *</label>
            <input type="date" name="birthDate" required value={form.birthDate} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-500">Birth Time</label>
            <input type="time" name="birthTime" value={form.birthTime} onChange={handleChange} className="input" />
            {!form.birthTime && <p className="text-xs text-slate-400 mt-1">Without birth time, your Rising sign and houses will be approximate (defaults to noon).</p>}
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-500">Birth City *</label>
            <CityAutocomplete value={form.birthCity} onChange={handleCitySelect} />
          </div>

          <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onSuccess={setTurnstileToken} />

          {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={loading || !turnstileToken || !form.birthLat} className="btn-primary w-full">
            {loading ? 'Calculating...' : 'Calculate My Big Three'}
          </button>
        </form>
      ) : (
        <div>
          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Sun', sign: result.sun.sign, symbol: '☉' },
              { label: 'Moon', sign: result.moon.sign, symbol: '☽' },
              { label: 'Rising', sign: result.rising, symbol: '↑' },
            ].map(item => {
              const ec = getElementColor(item.sign)
              return (
                <div key={item.label} className={`bg-gradient-to-br ${ec.gradient} border ${ec.border} rounded-xl p-5 text-center`}>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                  <SignGlyph sign={item.sign} decorative className={`text-3xl mb-1 ${ec.text} block`} />
                  <p className="font-display text-xl tracking-wide">{item.sign}</p>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="card mb-6">
            <p className="text-slate-700 leading-relaxed">
              Your Sun in {result.sun.sign} shapes your core identity... {result.sun.sign === 'Aries' ? 'bold, pioneering, and self-directed' : result.sun.sign === 'Taurus' ? 'steady, sensual, and grounded' : result.sun.sign === 'Gemini' ? 'curious, communicative, and adaptable' : result.sun.sign === 'Cancer' ? 'nurturing, intuitive, and deeply feeling' : result.sun.sign === 'Leo' ? 'confident, creative, and expressive' : result.sun.sign === 'Virgo' ? 'analytical, purposeful, and detail-oriented' : result.sun.sign === 'Libra' ? 'balanced, diplomatic, and relational' : result.sun.sign === 'Scorpio' ? 'intense, perceptive, and transformative' : result.sun.sign === 'Sagittarius' ? 'adventurous, philosophical, and freedom-loving' : result.sun.sign === 'Capricorn' ? 'ambitious, disciplined, and pragmatic' : result.sun.sign === 'Aquarius' ? 'independent, innovative, and visionary' : 'compassionate, intuitive, and imaginative'}.
              Your Moon in {result.moon.sign} reveals your emotional world... what you need to feel safe and how you process feelings beneath the surface.
              With {result.rising} rising, the world meets you as {result.rising === 'Aries' ? 'direct and energetic' : result.rising === 'Taurus' ? 'calm and dependable' : result.rising === 'Gemini' ? 'witty and approachable' : result.rising === 'Cancer' ? 'warm and protective' : result.rising === 'Leo' ? 'magnetic and confident' : result.rising === 'Virgo' ? 'composed and thoughtful' : result.rising === 'Libra' ? 'graceful and diplomatic' : result.rising === 'Scorpio' ? 'intense and mysterious' : result.rising === 'Sagittarius' ? 'open and enthusiastic' : result.rising === 'Capricorn' ? 'serious and capable' : result.rising === 'Aquarius' ? 'unique and forward-thinking' : 'gentle and perceptive'}... this is the lens through which everything else is expressed.
            </p>
          </div>

          <div className="flex gap-3 mb-8">
            <button onClick={() => { setResult(null); setTurnstileToken(null) }} className="btn-outline flex-1">
              Calculate Another
            </button>
          </div>

          {/* CTA */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <p className="font-display text-xl tracking-wide mb-2">Discover what the rest of your chart reveals</p>
            <p className="text-slate-500 text-sm mb-4">Your results won&apos;t last forever... create a free account to save your chart and unlock your personalized daily horoscope.</p>
            <Link href="/signup?ref=calc-sun-moon-rising" className="btn-primary">Create Your Free Chart</Link>
          </div>
        </div>
      )}
    </div>
  )
}
