import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import type { GetServerSideProps } from 'next'
import { getUser } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import { breadcrumbSchema, jsonLd } from '@/lib/schema'
import { SIGN_SYMBOLS } from '@/lib/zodiac-colors'
import { SIGN_LIST } from '@/lib/constants'
import { SignGlyph } from '@/components/Glyph'

interface ChartPlanet {
  planet: string
  sign: string
}

interface MatchResult {
  name: string
  slug: string
  image_url: string | null
  sun_sign: string | null
  moon_sign: string | null
  rising_sign: string | null
  score: number
  maxScore: number
  percentage: number
  matches: string[]
}

interface Props {
  initialSun: string | null
  initialMoon: string | null
  initialRising: string | null
  initialVenus: string | null
  initialMars: string | null
  initialMercury: string | null
  isLoggedIn: boolean
  hasChart: boolean
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const user = await getUser(context)
  const defaults: Props = {
    initialSun: null, initialMoon: null, initialRising: null,
    initialVenus: null, initialMars: null, initialMercury: null,
    isLoggedIn: false, hasChart: false,
  }

  if (!user) return { props: defaults }

  const chart = await queryOne<{ chart_data: { planets?: ChartPlanet[]; ascendantSign?: string } }>(
    'SELECT chart_data FROM birth_charts WHERE user_id = $1 AND is_primary = true',
    [user.id]
  )

  if (!chart?.chart_data?.planets) return { props: { ...defaults, isLoggedIn: true } }

  const planets = chart.chart_data.planets
  const findSign = (name: string) => planets.find(p => p.planet === name)?.sign ?? null

  return {
    props: {
      initialSun: findSign('SUN'),
      initialMoon: findSign('MOON'),
      initialRising: chart.chart_data.ascendantSign ?? null,
      initialVenus: findSign('VENUS'),
      initialMars: findSign('MARS'),
      initialMercury: findSign('MERCURY'),
      isLoggedIn: true,
      hasChart: true,
    },
  }
}

export default function CelebrityMatchPage({ initialSun, initialMoon, initialRising, initialVenus, initialMars, initialMercury, isLoggedIn, hasChart }: Props) {
  const [sun, setSun] = useState(initialSun || '')
  const [moon, setMoon] = useState(initialMoon || '')
  const [rising, setRising] = useState(initialRising || '')
  const [results, setResults] = useState<MatchResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [autoSearched, setAutoSearched] = useState(false)

  // Auto-search for logged-in users with a chart
  useEffect(() => {
    if (hasChart && initialSun && initialMoon && initialRising && !autoSearched) {
      setAutoSearched(true)
      doSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function doSearch() {
    if (!sun || !moon || !rising) return
    setLoading(true)
    try {
      const body: Record<string, string> = { sun, moon, rising }
      if (initialVenus) body.venus = initialVenus
      if (initialMars) body.mars = initialMars
      if (initialMercury) body.mercury = initialMercury
      const res = await fetch('/api/celebrity-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      setResults(data.results || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const title = 'Which Celebrity Shares Your Chart? — Birth Chart Library'
  const description = 'Find out which celebrities share your astrological placements. Enter your Sun, Moon, and Rising signs to discover your celebrity chart twins.'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
          { name: 'Home', url: 'https://birthchartlibrary.com' },
          { name: 'Celebrity Match', url: 'https://birthchartlibrary.com/celebrity-match' },
        ])) }} />

        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">Which Celebrity Shares Your Chart?</h1>
        <p className="text-slate-500 mb-8 max-w-2xl">
          {hasChart
            ? 'We matched your birth chart against 550+ researched celebrity charts. Here are your closest cosmic twins.'
            : 'Enter your Big Three to find out which celebrities share your astrological DNA.'}
        </p>

        {/* Sign selector for guests (or anyone who wants to change) */}
        <div className="card mb-8">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Sun Sign</label>
              <select
                value={sun}
                onChange={e => { setSun(e.target.value); setResults(null) }}
                className="input w-full text-sm"
              >
                <option value="">Select...</option>
                {SIGN_LIST.map(s => <option key={s} value={s}>{SIGN_SYMBOLS[s]} {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Moon Sign</label>
              <select
                value={moon}
                onChange={e => { setMoon(e.target.value); setResults(null) }}
                className="input w-full text-sm"
              >
                <option value="">Select...</option>
                {SIGN_LIST.map(s => <option key={s} value={s}>{SIGN_SYMBOLS[s]} {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Rising Sign</label>
              <select
                value={rising}
                onChange={e => { setRising(e.target.value); setResults(null) }}
                className="input w-full text-sm"
              >
                <option value="">Select...</option>
                {SIGN_LIST.map(s => <option key={s} value={s}>{SIGN_SYMBOLS[s]} {s}</option>)}
              </select>
            </div>
          </div>

          {hasChart && (
            <p className="text-xs text-slate-400 mb-3">
              Auto-filled from your chart. {initialVenus && initialMars && initialMercury && 'Venus, Mars, and Mercury are also factored in for deeper matching.'}
            </p>
          )}

          <button
            onClick={doSearch}
            disabled={!sun || !moon || !rising || loading}
            className="btn-primary w-full text-sm"
          >
            {loading ? 'Searching...' : 'Find My Celebrity Twins'}
          </button>

          {!isLoggedIn && (
            <p className="text-xs text-slate-400 mt-3 text-center">
              <Link href="/signup" className="text-slate-600 hover:text-slate-800 transition-colors">Create a free account</Link>
              {' '}to get deeper matching with Venus, Mars, and Mercury.
            </p>
          )}

          {isLoggedIn && !hasChart && (
            <p className="text-xs text-slate-400 mt-3 text-center">
              <Link href="/birth-chart" className="text-slate-600 hover:text-slate-800 transition-colors">Create your birth chart</Link>
              {' '}for automatic matching with all your placements.
            </p>
          )}
        </div>

        {/* Don't know your signs? */}
        {!hasChart && (
          <div className="text-center mb-8">
            <p className="text-sm text-slate-500">
              Don&apos;t know your Moon or Rising sign?{' '}
              <Link href="/calculators/sun-moon-rising" className="text-slate-700 hover:text-slate-900 transition-colors underline underline-offset-2">
                Find out here
              </Link>
            </p>
          </div>
        )}

        {/* Results */}
        {results && results.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Celebrity Chart Twins</h2>
            <div className="space-y-3">
              {results.map((r, i) => (
                <Link
                  key={r.slug}
                  href={`/celebrity-birth-charts/${r.slug}`}
                  className="card flex items-center gap-4 hover:border-slate-400 transition-colors group"
                >
                  {/* Rank */}
                  <span className="text-lg font-bold text-slate-300 w-6 text-center shrink-0">
                    {i + 1}
                  </span>

                  {/* Photo */}
                  {r.image_url ? (
                    <Image
                      src={`/api/img/${r.slug}`}
                      alt={r.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-lg shrink-0">
                      {r.sun_sign ? <SignGlyph sign={r.sun_sign} decorative /> : '?'}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm group-hover:text-slate-600 transition-colors truncate">{r.name}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {r.matches.map(m => (
                        <span key={m} className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Match percentage */}
                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold text-slate-800">{r.percentage}%</span>
                    <p className="text-[10px] text-slate-400">match</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {results && results.length === 0 && (
          <div className="card text-center py-10">
            <p className="text-slate-500 text-sm">No matches found with that combination. Try adjusting your signs.</p>
          </div>
        )}

        {/* How it works */}
        {!results && !loading && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <div className="card">
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  We compare your chart placements against 550+ researched celebrity birth charts to find the closest matches.
                </p>
                <p>
                  <strong className="text-slate-800">Sun sign</strong> and <strong className="text-slate-800">Moon sign</strong> matches carry the most weight, followed by your <strong className="text-slate-800">Rising sign</strong>. If you have a full chart on file, we also factor in <strong className="text-slate-800">Venus</strong>, <strong className="text-slate-800">Mars</strong>, and <strong className="text-slate-800">Mercury</strong> for deeper matching.
                </p>
                <p>
                  A 100% match means every compared placement is in the same sign... true cosmic twins.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
