import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import { Turnstile } from '@marsidev/react-turnstile'
import CityAutocomplete from '@/components/CityAutocomplete'
import { faqSchema, breadcrumbSchema, howToSchema, jsonLd } from '@/lib/schema'
import type { SynastryAspect, RelationshipType } from '@/lib/swisseph/synastry'
import { ASPECT_SYMBOLS } from '@/lib/swisseph/synastry'
import { safeSessionGet, safeSessionSet, safeSessionRemove } from '@/lib/safe-storage'
import { PlanetGlyph } from '@/components/Glyph'
import type { BirthChartData } from '@/lib/swisseph/calculate'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!

type Mode = 'manual' | 'library' | 'celebrity'

interface PersonForm {
  name: string
  birthDate: string
  birthTime: string
  birthCity: string
  birthLat: number
  birthLng: number
}

interface SavedChart {
  id: string
  label: string
  subjectName: string | null
  birthDate: string
  birthTime: string | null
  birthCity: string
  birthLat: number
  birthLng: number
  isPrimary: boolean
}

interface CelebResult {
  name: string
  slug: string
}

const emptyForm = (): PersonForm => ({
  name: '',
  birthDate: '',
  birthTime: '',
  birthCity: '',
  birthLat: 0,
  birthLng: 0,
})

const RELATIONSHIP_TYPES: { value: RelationshipType; label: string }[] = [
  { value: 'romantic',   label: 'Romantic' },
  { value: 'friendship', label: 'Friendship' },
  { value: 'work',       label: 'Work' },
  { value: 'family',     label: 'Family' },
  { value: 'siblings',   label: 'Siblings' },
  { value: 'rivals',     label: 'Rivals' },
]

interface Results {
  chartA: BirthChartData
  chartB: BirthChartData
  aspects: SynastryAspect[]
  score: { label: string; score: number }
  relationshipType: RelationshipType
}

// ── Sub-components ──────────────────────────────────────────────────────────

function ModeTab({ mode, active, onClick, label }: { mode: Mode; active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
        active
          ? 'border-slate-700 bg-slate-800 text-white'
          : 'border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-700'
      }`}
    >
      {label}
    </button>
  )
}

function SelectedCard({
  label,
  name,
  birthDate,
  birthCity,
  onClear,
}: {
  label: string
  name: string
  birthDate: string
  birthCity: string
  onClear: () => void
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-slate-800">{label}</h2>
        <button type="button" onClick={onClear} className="text-xs text-slate-400 hover:text-slate-600 underline">
          Change
        </button>
      </div>
      <p className="font-medium text-slate-700">{name || '—'}</p>
      <p className="text-sm text-slate-400">{birthDate}{birthCity ? ` · ${birthCity}` : ''}</p>
    </div>
  )
}

function ManualForm({
  label,
  form,
  onChange,
  onCitySelect,
}: {
  label: string
  form: PersonForm
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCitySelect: (city: string, lat: number, lng: number) => void
}) {
  return (
    <div className="card p-5 space-y-4">
      <h2 className="font-semibold text-slate-800">{label}</h2>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Name (optional)</label>
        <input type="text" name="name" value={form.name} onChange={onChange} placeholder={label} className="input w-full" />
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Birth Date</label>
        <input type="date" name="birthDate" value={form.birthDate} onChange={onChange} required className="input w-full" />
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">
          Birth Time <span className="text-slate-400">(optional but improves accuracy)</span>
        </label>
        <input type="time" name="birthTime" value={form.birthTime} onChange={onChange} className="input w-full" />
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Birth City</label>
        <CityAutocomplete value={form.birthCity} onChange={onCitySelect} />
      </div>
    </div>
  )
}

function LibraryPicker({
  label,
  charts,
  onSelect,
}: {
  label: string
  charts: SavedChart[]
  onSelect: (chart: SavedChart) => void
}) {
  return (
    <div className="card p-5">
      <h2 className="font-semibold text-slate-800 mb-3">{label}</h2>
      <label className="block text-xs text-slate-500 mb-1">Select a saved chart</label>
      <select
        className="input w-full"
        defaultValue=""
        onChange={e => {
          const chart = charts.find(c => c.id === e.target.value)
          if (chart) onSelect(chart)
        }}
      >
        <option value="" disabled>Choose from your library...</option>
        {charts.map(c => (
          <option key={c.id} value={c.id}>{c.label}</option>
        ))}
      </select>
    </div>
  )
}

function CelebrityPicker({
  label,
  onSelect,
}: {
  label: string
  onSelect: (name: string, slug: string) => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CelebResult[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.length < 2) { setResults([]); return }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search/celebrities?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setResults(data ?? [])
      } finally {
        setLoading(false)
      }
    }, 200)
  }, [])

  return (
    <div className="card p-5">
      <h2 className="font-semibold text-slate-800 mb-3">{label}</h2>
      <label className="block text-xs text-slate-500 mb-1">Search celebrities</label>
      <input
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); search(e.target.value) }}
        placeholder="Type a name..."
        className="input w-full mb-2"
      />
      {loading && <p className="text-xs text-slate-400">Searching...</p>}
      {results.length > 0 && (
        <ul className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-48 overflow-y-auto">
          {results.map(c => (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() => { onSelect(c.name, c.slug); setQuery(''); setResults([]) }}
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {query.length >= 2 && !loading && results.length === 0 && (
        <p className="text-xs text-slate-400">No results for &ldquo;{query}&rdquo;</p>
      )}
    </div>
  )
}

function AspectRow({ aspect }: { aspect: SynastryAspect }) {
  const sym = ASPECT_SYMBOLS[aspect.aspectType]
  const harmColor = aspect.isHarmonic ? 'text-emerald-600' : 'text-rose-500'
  return (
    <div className="border border-slate-100 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <PlanetGlyph planet={aspect.planet1} decorative className="font-mono text-base text-slate-700" />
        <span className="text-xs text-slate-400 capitalize">{aspect.planet1.toLowerCase()}</span>
        <span className={`text-lg font-bold ${harmColor}`}>{sym}</span>
        <span className="text-xs text-slate-400 capitalize">{aspect.aspectType}</span>
        <PlanetGlyph planet={aspect.planet2} decorative className="font-mono text-base text-slate-700" />
        <span className="text-xs text-slate-400 capitalize">{aspect.planet2.toLowerCase()}</span>
        <span className="ml-auto text-xs text-slate-400">{aspect.orb}° orb</span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{aspect.interpretation}</p>
    </div>
  )
}

function SunMoonLine({ chart, name }: { chart: BirthChartData; name: string }) {
  const sun = chart.planets.find(p => p.planet === 'SUN')
  const moon = chart.planets.find(p => p.planet === 'MOON')
  return (
    <div className="text-center">
      <p className="font-semibold text-slate-800">{name || 'Person'}</p>
      <p className="text-sm text-slate-500">
        {sun && <span>☉ {sun.sign}</span>}
        {moon && <span className="ml-2">☽ {moon.sign}</span>}
        {chart.ascendantSign && <span className="ml-2">↑ {chart.ascendantSign}</span>}
      </p>
    </div>
  )
}

const FAQ_ITEMS = [
  {
    question: 'What is synastry?',
    answer: 'Synastry is the astrology of relationships. It compares two birth charts to identify aspects — angular relationships — between one person\'s planets and another\'s. These aspects reveal attraction, friction, communication patterns, and growth potential between two people.',
  },
  {
    question: 'What aspects does the synastry calculator look for?',
    answer: 'The calculator checks for the five major aspects between all personal and social planets: conjunction (0°), sextile (60°), square (90°), trine (120°), and opposition (180°). Harmonious aspects (conjunction, trine, sextile) tend to create ease and flow. Tense aspects (square, opposition) create friction and growth edges.',
  },
  {
    question: 'Do I need birth time for synastry?',
    answer: 'Birth time improves accuracy — especially for Moon placement (which moves every 2–2.5 days) and house positions. But even without exact times, a synastry reading of Sun, Mercury, Venus, Mars, Jupiter, and Saturn placements gives meaningful insight into the relationship dynamic.',
  },
  {
    question: 'What is the most important aspect in synastry?',
    answer: 'Sun–Moon aspects are often considered the most important indicator of compatibility. Venus–Mars aspects reveal romantic and physical attraction. Sun–Venus shows appreciation and admiration. Moon–Moon aspects show emotional attunement. No single aspect tells the whole story.',
  },
]

// ── Main page ────────────────────────────────────────────────────────────────

export default function SynastryPage() {
  const router = useRouter()

  const [modeA, setModeA] = useState<Mode>('manual')
  const [modeB, setModeB] = useState<Mode>('manual')
  const [formA, setFormA] = useState<PersonForm>(emptyForm())
  const [formB, setFormB] = useState<PersonForm>(emptyForm())
  const [selectedA, setSelectedA] = useState<boolean>(false)
  const [selectedB, setSelectedB] = useState<boolean>(false)

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userCharts, setUserCharts] = useState<SavedChart[]>([])

  const [celebHasBirthTime, setCelebHasBirthTime] = useState<boolean | null>(null)
  const [celebNameB, setCelebNameB] = useState<string | null>(null)
  const [celebLoading, setCelebLoading] = useState(false)

  const [relationshipType, setRelationshipType] = useState<RelationshipType>('romantic')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<Results | null>(null)

  const [saving, setSaving] = useState(false)
  const [savedUrl, setSavedUrl] = useState<string | null>(null)
  const [saveBoth, setSaveBoth] = useState(false)

  // Detect login + load user charts
  useEffect(() => {
    const loggedIn = document.cookie.includes('bcl_logged_in=1')
    setIsLoggedIn(loggedIn)
    if (!loggedIn) return

    fetch('/api/user-charts')
      .then(r => r.ok ? r.json() : [])
      .then((charts: SavedChart[]) => {
        setUserCharts(charts)
        // Auto-preload Person A with primary chart
        const primary = charts.find(c => c.isPrimary) ?? charts[0]
        if (primary) {
          setFormA({
            name: primary.subjectName || primary.label,
            birthDate: primary.birthDate,
            birthTime: primary.birthTime || '',
            birthCity: primary.birthCity,
            birthLat: primary.birthLat,
            birthLng: primary.birthLng,
          })
          setModeA('library')
          setSelectedA(true)
        }
      })
  }, [])

  // Celebrity prefill from ?celebrity= query param
  useEffect(() => {
    const slug = router.query.celebrity as string | undefined
    if (!slug) return
    setCelebLoading(true)
    fetch(`/api/celebrity-lookup?slug=${encodeURIComponent(slug)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        setFormB({
          name: data.name,
          birthDate: data.birthDate,
          birthTime: data.birthTime || '',
          birthCity: data.birthCity,
          birthLat: data.birthLat,
          birthLng: data.birthLng,
        })
        setCelebNameB(data.name)
        setCelebHasBirthTime(data.hasBirthTime)
        setModeB('celebrity')
        setSelectedB(true)
      })
      .finally(() => setCelebLoading(false))
  }, [router.query.celebrity])

  // Restore from sessionStorage after signup redirect
  useEffect(() => {
    const stored = safeSessionGet('synastry_pending')
    if (!stored) return
    safeSessionRemove('synastry_pending')
    try {
      const { fA, fB, relType } = JSON.parse(stored)
      setFormA(fA)
      setFormB(fB)
      setRelationshipType(relType)
    } catch {}
  }, [])

  function makeHandler(setter: React.Dispatch<React.SetStateAction<PersonForm>>) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
  }

  function makeCityHandler(setter: React.Dispatch<React.SetStateAction<PersonForm>>) {
    return (city: string, lat: number, lng: number) => {
      setter(prev => ({ ...prev, birthCity: city, birthLat: lat, birthLng: lng }))
    }
  }

  function applyChart(chart: SavedChart, setter: React.Dispatch<React.SetStateAction<PersonForm>>, selectSetter: React.Dispatch<React.SetStateAction<boolean>>) {
    setter({
      name: chart.subjectName || chart.label,
      birthDate: chart.birthDate,
      birthTime: chart.birthTime || '',
      birthCity: chart.birthCity,
      birthLat: chart.birthLat,
      birthLng: chart.birthLng,
    })
    selectSetter(true)
  }

  async function applyCeleb(slug: string, modeSetter: React.Dispatch<React.SetStateAction<Mode>>, setter: React.Dispatch<React.SetStateAction<PersonForm>>, selectSetter: React.Dispatch<React.SetStateAction<boolean>>, isB: boolean) {
    const data = await fetch(`/api/celebrity-lookup?slug=${encodeURIComponent(slug)}`).then(r => r.ok ? r.json() : null)
    if (!data) return
    setter({
      name: data.name,
      birthDate: data.birthDate,
      birthTime: data.birthTime || '',
      birthCity: data.birthCity,
      birthLat: data.birthLat,
      birthLng: data.birthLng,
    })
    if (isB) {
      setCelebNameB(data.name)
      setCelebHasBirthTime(data.hasBirthTime)
    }
    selectSetter(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!turnstileToken) { setError('Please complete the verification'); return }
    if (!formA.birthLat || !formA.birthLng) { setError('Select a birth city for Person A from the dropdown'); return }
    if (!formB.birthLat || !formB.birthLng) { setError('Select a birth city for Person B from the dropdown'); return }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const res = await fetch('/api/synastry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personA: { name: formA.name, birthDate: formA.birthDate, birthTime: formA.birthTime || undefined, birthLat: formA.birthLat, birthLng: formA.birthLng },
          personB: { name: formB.name, birthDate: formB.birthDate, birthTime: formB.birthTime || undefined, birthLat: formB.birthLat, birthLng: formB.birthLng },
          turnstileToken,
          relationshipType,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); return }
      setResults(data)
    } catch {
      setError('Network error... please try again')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!results) return
    if (!isLoggedIn) {
      // Store form data and redirect to signup
      safeSessionSet('synastry_pending', JSON.stringify({ fA: formA, fB: formB, relType: relationshipType }))
      router.push('/auth/signup?return=/calculators/synastry')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/synastry-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personA: { name: formA.name, birthDate: formA.birthDate, birthCity: formA.birthCity },
          personB: { name: formB.name, birthDate: formB.birthDate, birthCity: formB.birthCity },
          chartA: results.chartA,
          chartB: results.chartB,
          aspects: results.aspects,
          score: results.score,
          relationshipType,
        }),
      })
      const data = await res.json()
      if (res.ok) setSavedUrl(data.url)
    } finally {
      setSaving(false)
    }
  }

  function resetAll() {
    setResults(null)
    setFormA(emptyForm())
    setFormB(emptyForm())
    setSelectedA(false)
    setSelectedB(false)
    setModeA('manual')
    setModeB('manual')
    setCelebNameB(null)
    setCelebHasBirthTime(null)
    setTurnstileToken(null)
    setSavedUrl(null)
  }

  const harmonious = results?.aspects.filter(a => a.isHarmonic) ?? []
  const tense = results?.aspects.filter(a => !a.isHarmonic) ?? []
  const nameA = formA.name || 'Person A'
  const nameB = formB.name || 'Person B'

  // ── Person panel renderer ──

  function renderPersonPanel(
    side: 'A' | 'B',
    mode: Mode,
    setMode: React.Dispatch<React.SetStateAction<Mode>>,
    form: PersonForm,
    setForm: React.Dispatch<React.SetStateAction<PersonForm>>,
    selected: boolean,
    setSelected: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    const label = side === 'A' ? 'Person A' : (celebNameB && selected ? `Person B — ${celebNameB}` : 'Person B')
    const isB = side === 'B'

    return (
      <div className="space-y-2">
        {/* Mode tabs — library only for logged-in users */}
        <div className="flex gap-1.5">
          <ModeTab mode="manual" active={mode === 'manual'} onClick={() => { setMode('manual'); setSelected(false) }} label="Manual" />
          {isLoggedIn && userCharts.length > 0 && (
            <ModeTab mode="library" active={mode === 'library'} onClick={() => { setMode('library'); setSelected(false) }} label="My Library" />
          )}
          <ModeTab mode="celebrity" active={mode === 'celebrity'} onClick={() => { setMode('celebrity'); setSelected(false); if (isB) { setCelebNameB(null); setCelebHasBirthTime(null) } }} label="Celebrity" />
        </div>

        {/* Selected state — show summary card */}
        {selected && (
          <SelectedCard
            label={label}
            name={form.name}
            birthDate={form.birthDate}
            birthCity={form.birthCity}
            onClear={() => { setSelected(false); setForm(emptyForm()); if (isB) { setCelebNameB(null); setCelebHasBirthTime(null) } }}
          />
        )}

        {/* Pickers — only shown when not yet selected */}
        {!selected && mode === 'manual' && (
          <ManualForm
            label={label}
            form={form}
            onChange={makeHandler(setForm)}
            onCitySelect={makeCityHandler(setForm)}
          />
        )}

        {!selected && mode === 'library' && (
          <LibraryPicker
            label={label}
            charts={userCharts}
            onSelect={chart => applyChart(chart, setForm, setSelected)}
          />
        )}

        {!selected && mode === 'celebrity' && (
          celebLoading && isB
            ? <div className="card p-5 flex items-center justify-center text-slate-400 text-sm">Loading celebrity data...</div>
            : <CelebrityPicker
                label={label}
                onSelect={(name, slug) => applyCeleb(slug, setMode, setForm, setSelected, isB)}
              />
        )}
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Synastry Calculator — Free Birth Chart Compatibility</title>
        <meta name="description" content="Free synastry calculator. Compare two birth charts to reveal relationship aspects, compatibility patterns, and growth edges. No account needed." />
        <link rel="canonical" href="https://birthchartlibrary.com/calculators/synastry" key="canonical" />
        <meta property="og:title" content="Synastry Calculator — Free Birth Chart Compatibility" />
        <meta property="og:description" content="Compare two birth charts to reveal relationship aspects, compatibility patterns, and growth edges. Free, no account needed." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://birthchartlibrary.com/calculators/synastry" />
        <meta property="og:site_name" content="Birth Chart Library" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Synastry Calculator — Free Birth Chart Compatibility" />
        <meta name="twitter:description" content="Compare two birth charts to reveal relationship aspects, compatibility patterns, and growth edges." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
          { name: 'Home', url: 'https://birthchartlibrary.com' },
          { name: 'Calculators', url: 'https://birthchartlibrary.com/calculators' },
          { name: 'Synastry Calculator', url: 'https://birthchartlibrary.com/calculators/synastry' },
        ])) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(FAQ_ITEMS)) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(howToSchema({
          name: 'How to Run a Synastry (Relationship Compatibility) Reading',
          description: 'Compare two birth charts to see how your planets interact and what the aspects between them reveal about the relationship.',
          totalTime: 'PT3M',
          url: 'https://birthchartlibrary.com/calculators/synastry',
          steps: [
            { name: 'Enter the first person’s birth details', text: 'Provide their name, birth date, exact birth time, and birth city. Accurate time matters because rising sign and houses depend on it.' },
            { name: 'Enter the second person’s birth details', text: 'Provide the same information for the second person. The comparison runs across all 10 planets plus the Ascendant.' },
            { name: 'Generate the synastry chart', text: 'Click Compare Charts to see the cross-chart aspects, the closest connections, and how the elements blend between you.' },
            { name: 'Read the interpretation', text: 'Review the aspect-by-aspect breakdown highlighting strengths, growth edges, and the dominant themes of the partnership.' },
          ],
        })) }} />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <AdminBreadcrumb crumbs={[
          { label: 'Calculators', href: '/calculators' },
          { label: 'Synastry' },
        ]} />

        <h1 className="font-display text-4xl tracking-wide mb-2">Synastry Calculator</h1>
        <p className="text-slate-500 mb-6">Compare two birth charts to see how your planets interact... no account needed.</p>

        {/* Relationship type selector */}
        {!results && (
          <div className="mb-6">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Relationship type</p>
            <div className="flex flex-wrap gap-2">
              {RELATIONSHIP_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setRelationshipType(t.value)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                    relationshipType === t.value
                      ? 'border-slate-700 bg-slate-800 text-white'
                      : 'border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        {!results && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {renderPersonPanel('A', modeA, setModeA, formA, setFormA, selectedA, setSelectedA)}
              {renderPersonPanel('B', modeB, setModeB, formB, setFormB, selectedB, setSelectedB)}
            </div>

            {celebHasBirthTime === false && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <span className="font-medium">Birth time unverified for {celebNameB}.</span> Aspects between Sun, Moon, Mercury, Venus, Mars, Jupiter, and Saturn are still accurate. Rising sign and house-based interpretations are excluded from these results.
              </div>
            )}

            {error && (
              <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-4 py-2">{error}</p>
            )}

            <div className="flex flex-col items-center gap-4">
              <Turnstile siteKey={SITE_KEY} onSuccess={setTurnstileToken} />
              <button
                type="submit"
                disabled={loading || !turnstileToken}
                className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Calculating...' : 'Compare Charts'}
              </button>
            </div>
          </form>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Summary header */}
            <div className="card p-6 text-center">
              <div className="flex items-center justify-center gap-6 mb-4">
                <SunMoonLine chart={results.chartA} name={nameA} />
                <span className="text-2xl text-slate-300">♥</span>
                <SunMoonLine chart={results.chartB} name={nameB} />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-sm">
                <span className="font-semibold text-slate-800">{results.score.label}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500">{harmonious.length} harmonious · {tense.length} tense</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 capitalize">{results.relationshipType}</span>
              </div>

              {(() => {
                const sunA = results.chartA.planets.find(p => p.planet === 'SUN')
                const sunB = results.chartB.planets.find(p => p.planet === 'SUN')
                if (!sunA?.sign || !sunB?.sign) return null
                const s1 = sunA.sign.toLowerCase()
                const s2 = sunB.sign.toLowerCase()
                const slug = s1 <= s2 ? `${s1}-and-${s2}` : `${s2}-and-${s1}`
                return (
                  <p className="text-xs text-slate-400 mt-3">
                    See the <Link href={`/compatibility/${slug}`} className="underline hover:text-slate-600">{sunA.sign} & {sunB.sign} compatibility guide</Link> for a deeper Sun-sign analysis.
                  </p>
                )
              })()}
            </div>

            {/* Unverified birth time warning */}
            {celebHasBirthTime === false && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <span className="font-medium">Birth time unverified for {celebNameB}.</span> Sun, Moon &amp; planetary aspects are accurate. Rising sign and house placements are excluded.
              </div>
            )}

            {/* Harmonious aspects */}
            {harmonious.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="text-emerald-500">△</span> Harmonious Aspects
                </h2>
                <div className="space-y-3">
                  {harmonious.map((a, i) => <AspectRow key={i} aspect={a} />)}
                </div>
              </div>
            )}

            {/* Tense aspects */}
            {tense.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="text-rose-400">□</span> Growth Edges
                </h2>
                <p className="text-xs text-slate-400 mb-3">Tense aspects aren&apos;t &ldquo;bad&rdquo; — they create the friction that drives growth and keeps relationships dynamic.</p>
                <div className="space-y-3">
                  {tense.map((a, i) => <AspectRow key={i} aspect={a} />)}
                </div>
              </div>
            )}

            {results.aspects.length === 0 && (
              <div className="card p-6 text-center text-slate-500">
                No major aspects found between these charts. This is unusual — try adding birth times for more accurate planet positions.
              </div>
            )}

            {/* Save / share */}
            <div className="card p-5 space-y-3">
              {savedUrl ? (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Reading saved — share this link:</p>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={`https://birthchartlibrary.com${savedUrl}`}
                      className="input flex-1 text-sm"
                      onFocus={e => e.target.select()}
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(`https://birthchartlibrary.com${savedUrl}`)}
                      className="text-xs border border-slate-300 px-3 py-2 rounded-lg hover:border-slate-500 transition-colors text-slate-600"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Save &amp; share this reading</p>
                      <p className="text-xs text-slate-400">
                        {isLoggedIn ? 'Creates a permanent shareable link.' : 'Create a free account to save and share.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="text-sm border border-slate-300 px-4 py-2 rounded-lg hover:border-slate-500 transition-colors text-slate-600 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : isLoggedIn ? 'Save reading' : 'Save — sign up free'}
                    </button>
                  </div>

                  {/* Optional: save Person B to library */}
                  {isLoggedIn && modeB !== 'library' && formB.name && (
                    <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveBoth}
                        onChange={e => setSaveBoth(e.target.checked)}
                        className="rounded"
                      />
                      Also save {formB.name}&apos;s chart to my library
                    </label>
                  )}
                </>
              )}
            </div>

            {/* Reset */}
            <div className="text-center pt-2">
              <button
                onClick={resetAll}
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors underline"
              >
                Compare different charts
              </button>
            </div>

            {/* CTA */}
            <div className="border-t border-slate-200 pt-8 text-center">
              <p className="text-sm text-slate-500 mb-3">
                Synastry shows planet-to-planet connections. A full composite chart reveals the relationship as its own entity.
              </p>
              <Link href="/birth-chart" className="btn-primary text-sm">
                Create Your Free Birth Chart
              </Link>
            </div>
          </div>
        )}

        {/* Love section cross-link */}
        <div className="mt-10 grid sm:grid-cols-2 gap-3">
          <Link href="/love/celebrity-couples" className="card hover:border-slate-400 dark:hover:border-slate-500 transition-colors group">
            <p className="font-medium text-sm text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Celebrity Couples</p>
            <p className="text-xs text-slate-400 mt-0.5">101 real couples with element compatibility scores</p>
          </Link>
          <Link href="/love" className="card hover:border-slate-400 dark:hover:border-slate-500 transition-colors group">
            <p className="font-medium text-sm text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Love &amp; Astrology</p>
            <p className="text-xs text-slate-400 mt-0.5">Sign-in-love profiles and couple deep-dives</p>
          </Link>
        </div>

        {/* FAQ */}
        <div className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="text-lg font-semibold mb-6">About Synastry</h2>
          <div className="space-y-5">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}>
                <h3 className="font-medium text-slate-800 mb-1">{item.question}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
