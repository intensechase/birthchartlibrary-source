'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Turnstile } from '@marsidev/react-turnstile'
import CityAutocomplete from '@/components/CityAutocomplete'
import { getElementColor } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'

const SIGN_DESCRIPTIONS: Record<string, string> = {
  Aries: `Aries rising... the world sees you as direct, energetic, and ready to engage. You make a strong first impression... someone who leads with action and doesn't wait for permission. Your presence is bold and immediate.`,
  Taurus: `Taurus rising... the world sees you as calm, grounded, and reassuringly steady. People trust you almost immediately. Your presence is solid and sensual... you carry a quiet authority rooted in physical comfort and patience.`,
  Gemini: `Gemini rising... the world sees you as quick, curious, and socially adaptable. You put people at ease through conversation and wit. Your presence is lively and versatile... people sense a mind that's always moving.`,
  Cancer: `Cancer rising... the world sees you as warm, approachable, and quietly protective. You feel like home to others. Your presence is nurturing and intuitive... people sense emotional depth before you say a word.`,
  Leo: `Leo rising... the world sees you as magnetic, confident, and impossible to overlook. You light up a room without trying. Your presence radiates warmth and creative energy... people are drawn to your natural charisma.`,
  Virgo: `Virgo rising... the world sees you as composed, thoughtful, and detail-oriented. You appear to have everything together. Your presence is precise and helpful... people sense someone who notices what others miss.`,
  Libra: `Libra rising... the world sees you as graceful, charming, and aesthetically attuned. Every interaction feels balanced and considered. Your presence is diplomatic and beautiful... people feel more elegant around you.`,
  Scorpio: `Scorpio rising... the world sees you as intense, mysterious, and deeply perceptive. Your presence is felt before you speak. People sense that you see through surfaces... and that there's far more to you than what's visible.`,
  Sagittarius: `Sagittarius rising... the world sees you as open, enthusiastic, and infectiously optimistic. Everything feels like an adventure when you're around. Your presence expands the room... people feel more possible near you.`,
  Capricorn: `Capricorn rising... the world sees you as serious, capable, and quietly authoritative. You command respect without demanding it. Your presence is mature and strategic... people sense ambition backed by discipline.`,
  Aquarius: `Aquarius rising... the world sees you as unique, forward-thinking, and slightly unconventional. You defy easy categorization. Your presence is independent and intellectual... people sense someone who thinks differently.`,
  Pisces: `Pisces rising... the world sees you as gentle, empathic, and slightly ethereal. You seem to exist in a world slightly more beautiful than the one everyone else sees. Your presence is soft and intuitive... people feel understood around you.`,
}

export default function RisingSignCalculator() {
  const [form, setForm] = useState({ birthDate: '', birthTime: '', birthCity: '', birthLat: 0, birthLng: 0 })
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [result, setResult] = useState<{ sign: string } | null>(null)
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
    if (!form.birthTime) { setError('Birth time is required for rising sign calculation'); return }

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

      setResult({ sign: data.chart.ascendantSign })
    } catch {
      setError('Network error... please try again')
    }
    setLoading(false)
  }

  const ec = result ? getElementColor(result.sign) : null

  return (
    <div>
      {!result ? (
        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="block text-sm mb-1 text-slate-500">Birth Date *</label>
            <input type="date" name="birthDate" required value={form.birthDate} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-500">Birth Time *</label>
            <input type="time" name="birthTime" required value={form.birthTime} onChange={handleChange} className="input" />
            <p className="text-xs text-slate-400 mt-1">Birth time is required... your rising sign changes every ~2 hours.</p>
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-500">Birth City *</label>
            <CityAutocomplete value={form.birthCity} onChange={handleCitySelect} />
          </div>

          <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onSuccess={setTurnstileToken} />

          {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={loading || !turnstileToken || !form.birthLat} className="btn-primary w-full">
            {loading ? 'Calculating...' : 'Calculate My Rising Sign'}
          </button>
        </form>
      ) : (
        <div>
          <div className={`bg-gradient-to-br ${ec!.gradient} border ${ec!.border} rounded-xl p-8 text-center mb-6`}>
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Your Rising Sign</p>
            <SignGlyph sign={result.sign} decorative className={`text-6xl mb-2 ${ec!.text} block`} />
            <h2 className="font-display text-4xl tracking-wide">{result.sign}</h2>
          </div>

          <div className="card mb-6">
            <p className="text-slate-700 leading-relaxed">{SIGN_DESCRIPTIONS[result.sign]}</p>
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
            <Link href="/signup?ref=calc-rising-sign" className="btn-primary">Create Your Free Chart</Link>
          </div>
        </div>
      )}
    </div>
  )
}
