import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import CityAutocomplete from '@/components/CityAutocomplete'
import { SignGlyph } from '@/components/Glyph'

const SIGN_TAGLINES: Record<string, string> = {
  Aries: 'Bold, driven, first in everything',
  Taurus: 'Grounded, sensual, built to last',
  Gemini: 'Quick-minded, curious, always connecting',
  Cancer: 'Deeply feeling, protective, home-oriented',
  Leo: 'Radiant, generous, born to shine',
  Virgo: 'Precise, dedicated, quietly brilliant',
  Libra: 'Harmonious, fair, drawn to beauty',
  Scorpio: 'Intense, perceptive, transformative',
  Sagittarius: 'Free, philosophical, seeker of truth',
  Capricorn: 'Disciplined, ambitious, built for the long game',
  Aquarius: 'Original, visionary, ahead of the curve',
  Pisces: 'Intuitive, compassionate, deeply creative',
}

interface Result {
  sunSign: string | null
  moonSign: string | null
  risingSign: string | null
}

export default function EmbedBirthChart() {
  const router = useRouter()
  const [dark, setDark] = useState(false)
  const [form, setForm] = useState({ birthDate: '', birthTime: '', birthCity: '', birthLat: 0, birthLng: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    const isDark = router.query.theme === 'dark'
    setDark(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [router.query.theme])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleCitySelect(city: string, lat: number, lng: number) {
    setForm(prev => ({ ...prev, birthCity: city, birthLat: lat, birthLng: lng }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.birthLat || !form.birthLng) {
      setError('Please select a city from the dropdown')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/embed/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: form.birthDate,
          birthTime: form.birthTime || null,
          birthLat: form.birthLat,
          birthLng: form.birthLng,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setResult(data)
      }
    } catch {
      setError('Network error... please try again')
    }
    setLoading(false)
  }

  function reset() {
    setResult(null)
    setError(null)
    setForm({ birthDate: '', birthTime: '', birthCity: '', birthLat: 0, birthLng: 0 })
  }

  const wrapperClass = `min-h-screen flex flex-col font-sans ${dark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-800'}`
  const cardClass = `flex-1 flex flex-col justify-between px-6 py-5`
  const inputClass = `w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-1 transition-colors ${dark ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-amber-400 focus:border-amber-400' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-slate-400 focus:border-slate-400'}`
  const labelClass = `block text-xs font-medium mb-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`
  const btnClass = `w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${dark ? 'bg-amber-400 hover:bg-amber-300 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-white'}`

  return (
    <div className={wrapperClass} style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <Head>
        <meta name="robots" content="noindex" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap" />
      </Head>

      <div className={cardClass}>
        {!result ? (
          /* Form state */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${dark ? 'text-amber-400' : 'text-slate-400'}`}>✦ Free</p>
              <h1 className={`text-xl font-bold ${dark ? 'text-slate-100' : 'text-slate-800'}`}>Your Birth Chart</h1>
              <p className={`text-xs mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Discover your Sun, Moon &amp; Rising sign</p>
            </div>

            <div>
              <label className={labelClass}>Date of birth</label>
              <input type="date" name="birthDate" required value={form.birthDate} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Time of birth <span className={`font-normal ${dark ? 'text-slate-600' : 'text-slate-300'}`}>(for Rising sign)</span></label>
              <input type="time" name="birthTime" value={form.birthTime} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Birth city</label>
              <CityAutocomplete value={form.birthCity} onChange={handleCitySelect} />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? 'Calculating...' : 'Calculate My Chart →'}
            </button>
          </form>
        ) : (
          /* Results state */
          <div className="flex flex-col gap-4">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${dark ? 'text-amber-400' : 'text-slate-400'}`}>✦ Your Big Three</p>
              <h1 className={`text-xl font-bold ${dark ? 'text-slate-100' : 'text-slate-800'}`}>Birth Chart</h1>
            </div>

            <div className={`rounded-xl border divide-y ${dark ? 'border-slate-800 divide-slate-800' : 'border-slate-100 divide-slate-100'}`}>
              {[
                { label: 'Sun', symbol: '☉', sign: result.sunSign },
                { label: 'Moon', symbol: '☽', sign: result.moonSign },
                { label: 'Rising', symbol: '↑', sign: result.risingSign },
              ].map(({ label, symbol, sign }) => (
                sign ? (
                  <div key={label} className="flex items-start gap-3 px-4 py-3">
                    <span className={`text-lg shrink-0 mt-0.5 ${dark ? 'text-amber-400' : 'text-slate-400'}`}>{symbol}</span>
                    <div className="min-w-0">
                      <p className={`text-xs font-medium uppercase tracking-wider ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{label} in {sign} <SignGlyph sign={sign} decorative /></p>
                      <p className={`text-sm mt-0.5 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{SIGN_TAGLINES[sign] || ''}</p>
                    </div>
                  </div>
                ) : label === 'Rising' ? (
                  <div key={label} className="flex items-start gap-3 px-4 py-3">
                    <span className={`text-lg shrink-0 mt-0.5 ${dark ? 'text-slate-600' : 'text-slate-300'}`}>{symbol}</span>
                    <div>
                      <p className={`text-xs font-medium uppercase tracking-wider ${dark ? 'text-slate-600' : 'text-slate-300'}`}>Rising — add birth time for Rising sign</p>
                    </div>
                  </div>
                ) : null
              ))}
            </div>

            <a
              href="https://birthchartlibrary.com/birth-chart?ref=widget"
              target="_blank"
              rel="noopener noreferrer"
              className={`${btnClass} text-center block`}
            >
              See your full chart free →
            </a>

            <button onClick={reset} className={`text-xs text-center ${dark ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'} transition-colors`}>
              ← Start over
            </button>
          </div>
        )}

        {/* Footer */}
        <div className={`mt-4 pt-3 border-t text-center ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
          <a
            href="https://birthchartlibrary.com?ref=widget-footer"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[10px] transition-colors ${dark ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500'}`}
          >
            Powered by Birth Chart Library
          </a>
        </div>
      </div>
    </div>
  )
}
