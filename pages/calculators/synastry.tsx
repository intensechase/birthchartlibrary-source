import { formatBirthDate } from '@/lib/format-birth'
import type { HouseOverlay } from '@/lib/swisseph/overlays'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import { Turnstile } from '@marsidev/react-turnstile'
import CityAutocomplete from '@/components/CityAutocomplete'
import { faqSchema, breadcrumbSchema, howToSchema, jsonLd } from '@/lib/schema'
import type { SynastryAspect, RelationshipType } from '@/lib/swisseph/synastry'
import { ASPECT_SYMBOLS } from '@/lib/swisseph/synastry-symbols'
import SynastryText from '@/components/SynastryText'
import { type SynastryScoreV2 } from '@/lib/swisseph/synastry-score'
import SynastryScoreCard from '@/components/SynastryScoreCard'
import { safeSessionGet, safeSessionSet, safeSessionRemove } from '@/lib/safe-storage'
import { PENDING_COMPARE_KEY, TAB_COMPARE_KEY, readKept } from '@/lib/kept-chart'
import { track } from '@/lib/track'
import { PlanetGlyph } from '@/components/Glyph'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import { redesignOn } from '@/lib/redesign'
import SynastryView, { type SynSide } from '@/components/redesign/SynastryView'
import { LearnHero, NextLinks } from '@/components/redesign/Learn'

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
  overlays?: HouseOverlay[]
  score: SynastryScoreV2
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
        <label className="block text-xs text-slate-500 mb-1">Birth date</label>
        <input type="date" name="birthDate" value={form.birthDate} onChange={onChange} required className="input w-full" />
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">
          Birth time <span className="text-slate-400">(optional but improves accuracy)</span>
        </label>
        <input type="time" name="birthTime" value={form.birthTime} onChange={onChange} className="input w-full" />
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Birth city</label>
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

const pName = (p: string) => p.charAt(0) + p.slice(1).toLowerCase()

function AspectRow({ aspect, nameA, nameB }: { aspect: SynastryAspect; nameA: string; nameB: string }) {
  const sym = ASPECT_SYMBOLS[aspect.aspectType]
  const harmColor = aspect.isHarmonic ? 'text-emerald-600' : 'text-rose-500'
  return (
    <div className="border border-slate-100 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <PlanetGlyph planet={aspect.planet1} decorative className="font-mono text-base text-slate-700" />
        <span className="text-xs text-slate-500">{nameA}&apos;s {pName(aspect.planet1)}</span>
        <span className={`text-lg font-bold ${harmColor}`}>{sym}</span>
        <span className="text-xs text-slate-400 capitalize">{aspect.aspectType}</span>
        <PlanetGlyph planet={aspect.planet2} decorative className="font-mono text-base text-slate-700" />
        <span className="text-xs text-slate-500">{nameB}&apos;s {pName(aspect.planet2)}</span>
        <span className="ml-auto text-xs text-slate-400">{aspect.orb}° orb</span>
      </div>
      <SynastryText text={aspect.interpretation} className="text-slate-600" />
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
    answer: 'Synastry is the astrology of relationships. It compares two birth charts and finds the aspects, or angles, between one person\'s planets and the other\'s. Those aspects describe attraction, friction, communication and room to grow between two people. It\'s for entertainment, so please don\'t make big decisions from it.',
  },
  {
    question: 'What aspects does the synastry calculator look for?',
    answer: 'The calculator checks for the five major aspects between all personal and social planets: conjunction (0°), sextile (60°), square (90°), trine (120°), and opposition (180°). Trines and sextiles tend to bring ease; squares and oppositions bring friction and growth edges. A conjunction depends on the two planets: Venus on Jupiter is easy, Mars on Saturn is not. We follow William Lilly\'s Christian Astrology (1647) for which pairs help and which strain.',
  },
  {
    question: 'Do I need birth time for synastry?',
    answer: 'Birth time improves accuracy, especially for the Moon (which changes sign every two to two and a half days) and the rising sign. But even without exact times, a synastry reading of Sun, Mercury, Venus, Mars, Jupiter, and Saturn placements gives meaningful insight into the relationship dynamic.',
  },
  {
    question: 'What is the most important aspect in synastry?',
    answer: 'Lilly calls the Sun of one person on the Moon of the other the surest sign of unity, so Sun and Moon contacts lead. Venus and Mars show attraction, Sun and Venus admiration, Moon and Moon emotional attunement. No single aspect tells the whole story.',
  },
]

// Stage 'compare': celebrity search for one side of the comparison.
function CelebSearch({ onPick }: { onPick: (slug: string) => void }) {
  const [q, setQ] = useState('')
  const [list, setList] = useState<CelebResult[]>([])
  const [busy, setBusy] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(null)
  const search = (v: string) => {
    setQ(v)
    if (timer.current) clearTimeout(timer.current)
    if (v.trim().length < 2) { setList([]); return }
    timer.current = setTimeout(async () => {
      setBusy(true)
      try { const r = await fetch(`/api/search/celebrities?q=${encodeURIComponent(v)}`); setList(r.ok ? await r.json() : []) } catch { setList([]) } finally { setBusy(false) }
    }, 200)
  }
  return (
    <div className="field">
      <span>Search the library</span>
      <input value={q} onChange={e => search(e.target.value)} placeholder="Type a name" autoComplete="off" />
      {list.length ? (
        <div className="synlist">
          {list.slice(0, 8).map(c => <button key={c.slug} type="button" onClick={() => { onPick(c.slug); setQ(''); setList([]) }}><b>{c.name}</b></button>)}
        </div>
      ) : q.trim().length >= 2 && !busy ? <p className="hint">Nobody by that name in the library yet.</p> : null}
    </div>
  )
}

// A finished comparison, held in the tab (and, when Save is pressed without an
// account, waiting for one). Nothing is sent anywhere until it is saved.
interface HeldCompare {
  formA: PersonForm; formB: PersonForm; modeB: Mode
  celebNameB: string | null; celebHasBirthTime: boolean | null
  relationshipType: RelationshipType; results: Results; savedUrl?: string | null
}
const hold = (h: HeldCompare) => safeSessionSet(TAB_COMPARE_KEY, JSON.stringify(h))
function readCompare(key: string): HeldCompare | null {
  const raw = safeSessionGet(key)
  if (!raw) return null
  try {
    const h = JSON.parse(raw) as HeldCompare
    if (h.results?.chartA && h.results.chartB && Array.isArray(h.results.aspects) && h.results.score && h.formA && h.formB) return h
  } catch { /* fall through */ }
  safeSessionRemove(key)
  return null
}

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
  const [saveBoth, setSaveBoth] = useState(true)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [stillHere, setStillHere] = useState(false) // a comparison from earlier in this tab
  const restored = useRef(false)

  function restore(h: HeldCompare) {
    setFormA(h.formA); setFormB(h.formB); setModeB(h.modeB)
    setSelectedA(true); setSelectedB(true)
    setCelebNameB(h.celebNameB); setCelebHasBirthTime(h.celebHasBirthTime)
    setRelationshipType(h.relationshipType); setResults(h.results); setSavedUrl(h.savedUrl ?? null)
  }

  // A comparison lasts while the tab is open: ?result=1 brings it back after a
  // refresh or Back, and one waiting to be saved saves now that there is an account.
  useEffect(() => {
    if (!router.isReady) return
    const loggedIn = document.cookie.includes('bcl_logged_in=1')
    const waiting = loggedIn ? readCompare(PENDING_COMPARE_KEY) : null
    if (waiting) {
      safeSessionRemove(PENDING_COMPARE_KEY)
      restored.current = true
      restore(waiting)
      saveCompare(waiting, null)
      router.replace({ pathname: router.pathname, query: { result: 1 } }, undefined, { shallow: true, scroll: false })
      return
    }
    const tab = readCompare(TAB_COMPARE_KEY)
    if (tab && router.query.result) { restored.current = true; restore(tab); setStillHere(false) }
    else {
      if (!router.query.result && restored.current) { restored.current = false; setResults(null) }
      setStillHere(!!tab)
    }
  }, [router.isReady, router.query.result]) // eslint-disable-line react-hooks/exhaustive-deps

  // Detect login + load user charts
  useEffect(() => {
    const loggedIn = document.cookie.includes('bcl_logged_in=1')
    setIsLoggedIn(loggedIn)
    if (!loggedIn) {
      // No account, but their own chart is on this device: it goes first.
      const own = readKept()
      if (own && !new URLSearchParams(window.location.search).has('result')) {
        setFormA({ name: 'You', birthDate: own.form.birthDate, birthTime: own.form.birthTime, birthCity: own.form.birthCity, birthLat: own.form.birthLat, birthLng: own.form.birthLng })
        setSelectedA(true)
      }
      return
    }

    fetch('/api/user-charts')
      .then(r => r.ok ? r.json() : [])
      .then((charts: SavedChart[]) => {
        setUserCharts(charts)
        if (restored.current) return // a finished comparison is on screen
        // Person A: the chart the reader came from (?chart=id, from "Compare
        // with someone" on a chart page), else their own chart.
        const fromChart = typeof router.query.chart === 'string' ? charts.find(c => c.id === router.query.chart) : undefined
        const mine = charts.find(c => c.isPrimary)
        // "Compare" on someone else's chart means with me: me first, them second.
        const them = fromChart && mine && fromChart.id !== mine.id && !router.query.celebrity ? fromChart : undefined
        const primary = them ? mine : fromChart ?? mine ?? charts[0]
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
        // Second person: their saved people first, when there are any. A
        // celebrity link (?celebrity=) keeps its own choice.
        if (!router.query.celebrity && charts.length > 1) setModeB('library')
        if (them) {
          setFormB({ name: them.subjectName || them.label, birthDate: them.birthDate, birthTime: them.birthTime || '', birthCity: them.birthCity, birthLat: them.birthLat, birthLng: them.birthLng })
          setSelectedB(true)
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
      setStillHere(false)
      setSavedUrl(null)
      safeSessionRemove(PENDING_COMPARE_KEY)
      restored.current = true
      hold({ formA, formB, modeB, celebNameB, celebHasBirthTime, relationshipType, results: data })
      router.replace({ pathname: router.pathname, query: { result: 1 } }, undefined, { shallow: true, scroll: false })
      window.scrollTo(0, 0)
    } catch {
      setError('Network error... please try again')
    } finally {
      setLoading(false)
    }
  }

  // Sends one comparison to the account. saveB = the second person's chart too.
  async function saveCompare(h: HeldCompare, saveB: object | null) {
    setSaving(true); setSaveError(null)
    try {
      const res = await fetch('/api/synastry-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personA: { name: h.formA.name, birthDate: h.formA.birthDate, birthCity: h.formA.birthCity },
          personB: { name: h.formB.name, birthDate: h.formB.birthDate, birthCity: h.formB.birthCity },
          saveB,
          chartA: h.results.chartA,
          chartB: h.results.chartB,
          aspects: h.results.aspects,
          score: h.results.score,
          relationshipType: h.relationshipType,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error()
      setSavedUrl(data.url)
      hold({ ...h, savedUrl: data.url })
    } catch {
      setSaveError('That did not save. Try again in a moment.')
    } finally {
      setSaving(false)
    }
  }

  async function handleSave() {
    if (!results) return
    track('save_pressed', 'comparison')
    const h: HeldCompare = { formA, formB, modeB, celebNameB, celebHasBirthTime, relationshipType, results }
    if (!isLoggedIn) {
      // Saved by this page after sign up or sign in.
      safeSessionSet(PENDING_COMPARE_KEY, JSON.stringify(h))
      router.push('/signup?ref=synastry&next=/calculators/synastry')
      return
    }
    await saveCompare(h, saveBoth && modeB === 'manual' && formB.name
      ? { subjectName: formB.name, birthDate: formB.birthDate, birthTime: formB.birthTime || null, birthCity: formB.birthCity, birthLat: formB.birthLat, birthLng: formB.birthLng }
      : null)
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
    setSaveError(null)
    setStillHere(false)
    restored.current = false
    safeSessionRemove(TAB_COMPARE_KEY)
    safeSessionRemove(PENDING_COMPARE_KEY)
    if (router.query.result) router.replace(router.pathname, undefined, { shallow: true, scroll: false })
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

  const head = (
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
  )

  // ── Stage 'compare': the same state and handlers, the redesign layout ──
  if (redesignOn('compare')) {
    const signOf = (c: BirthChartData, id: string) => c.planets.find(p => p.planet === id)?.sign ?? null
    const sideOf = (c: BirthChartData, f: PersonForm, fallback: string): SynSide => ({
      name: f.name || fallback, sun: signOf(c, 'SUN'), moon: signOf(c, 'MOON'),
      rising: f.birthTime ? c.ascendantSign ?? null : null, city: f.birthCity || null,
    })
    const relLabel = RELATIONSHIP_TYPES.find(t => t.value === relationshipType)?.label ?? 'Romantic'
    const sunPair = (() => {
      if (!results) return null
      const s1 = signOf(results.chartA, 'SUN'), s2 = signOf(results.chartB, 'SUN')
      if (!s1 || !s2) return null
      const [x, y] = [s1.toLowerCase(), s2.toLowerCase()].sort()
      return { href: `/compatibility/${x}-and-${y}`, title: `${s1} and ${s2}`, }
    })()

    const panel = (
      side: 'A' | 'B', mode: Mode, setMode: React.Dispatch<React.SetStateAction<Mode>>,
      form: PersonForm, setForm: React.Dispatch<React.SetStateAction<PersonForm>>,
      selected: boolean, setSelected: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
      const isB = side === 'B'
      const title = isB ? 'Second person' : 'First person'
      const pick = (m: Mode) => { setMode(m); setSelected(false); if (isB && m !== 'celebrity') { setCelebNameB(null); setCelebHasBirthTime(null) } }
      const modes: [Mode, string][] = [['manual', 'Type it in'], ...(isLoggedIn && userCharts.length ? [['library', 'My charts'] as [Mode, string]] : []), ['celebrity', 'A celebrity']]
      const set = (k: keyof PersonForm) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }))
      return (
        <fieldset className="synside">
          <legend>{title}</legend>
          <div className={`seg n${modes.length}`} role="radiogroup" aria-label={`How to add the ${title.toLowerCase()}`}>
            {modes.map(([m, l]) => <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => pick(m)}>{l}</button>)}
          </div>
          {selected ? (
            <div className="synsel">
              <span><b>{form.name || title}</b><small>{[form.birthDate && formatBirthDate(form.birthDate), form.birthCity].filter(Boolean).join(', ')}</small></span>
              <button type="button" className="more" onClick={() => { setSelected(false); setForm(emptyForm()); if (isB) { setCelebNameB(null); setCelebHasBirthTime(null) } }}>Change</button>
            </div>
          ) : mode === 'library' ? (
            <div className="synlist">
              {userCharts.map(c => (
                <button key={c.id} type="button" onClick={() => applyChart(c, setForm, setSelected)}><b>{c.subjectName || c.label}</b><small>{formatBirthDate(c.birthDate)}{c.birthCity ? `, ${c.birthCity}` : ''}</small></button>
              ))}
            </div>
          ) : mode === 'celebrity' ? (
            celebLoading && isB ? <p className="hint">Loading the chart…</p> : <CelebSearch onPick={slug => applyCeleb(slug, setMode, setForm, setSelected, isB)} />
          ) : (
            <>
              <label className="field"><span>Name</span><input value={form.name} onChange={set('name')} placeholder={isB ? 'Sam, Mom, a new crush' : 'You, or anyone'} autoComplete="off" /></label>
              <div className="two">
                <label className="field"><span>Birth date</span><input type="date" value={form.birthDate} onChange={set('birthDate')} required /></label>
                <label className="field"><span>Birth time</span><input type="time" value={form.birthTime} onChange={set('birthTime')} /></label>
              </div>
              <p className="hint">The time is optional. Without it the Moon can be a little off and the rising sign is left out.</p>
              <div className="field"><span>Birth place</span><CityAutocomplete value={form.birthCity} onChange={makeCityHandler(setForm)} /></div>
            </>
          )}
        </fieldset>
      )
    }

    return (
      <>
        {head}
        <main className="rdp"><div className="lrn">
          {results ? (
            <>
              <SynastryView
                a={sideOf(results.chartA, formA, 'First person')} b={sideOf(results.chartB, formB, 'Second person')}
                score={results.score} aspects={results.aspects} overlays={results.overlays}
                crumbs={[{ label: 'Calculators', href: '/calculators' }, { label: 'Compare two charts', href: '/calculators/synastry' }]}
                kicker={`${relLabel} comparison`}
              >
                {celebHasBirthTime === false ? <p className="synnote">No verified birth time for {celebNameB}, so the rising sign and houses are left out. Every planet aspect still counts.</p> : null}
                <div className="mbar">
                  {savedUrl ? (
                    <>
                      <div><b>Saved. Anyone with this link can see it:</b><span>{`birthchartlibrary.com${savedUrl}`}</span></div>
                      <button type="button" className="btn" onClick={() => navigator.clipboard.writeText(`https://birthchartlibrary.com${savedUrl}`)}>Copy link</button>
                    </>
                  ) : (
                    <>
                      <div>
                        <b>Save this comparison</b>
                        <span>{isLoggedIn ? 'Keep it in your account, with a link you can share.' : 'Here until you close this tab. Save it free to keep it, with a link you can share.'}</span>
                        {saveError ? <span role="alert">{saveError}</span> : null}
                        {isLoggedIn && modeB === 'manual' && formB.name ? (
                          <label className="check"><input type="checkbox" checked={saveBoth} onChange={e => setSaveBoth(e.target.checked)} /><span>Also save {formB.name}’s chart</span></label>
                        ) : null}
                      </div>
                      <button type="button" className="btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : isLoggedIn ? 'Save' : 'Save it free'}</button>
                    </>
                  )}
                </div>
              </SynastryView>
              <NextLinks id="next" links={[
                ...(sunPair ? [{ href: sunPair.href, title: `${sunPair.title}`, sub: 'The two Sun signs together' }] : []),
                { href: '/love/celebrity-couples', title: 'Famous couples', sub: 'Real couples, scored the same way' },
              ]} />
              <p className="synreset"><button type="button" className="more" onClick={resetAll}>Compare two different charts</button></p>
            </>
          ) : (
            <>
              <LearnHero crumbs={[{ label: 'Calculators', href: '/calculators' }, { label: 'Compare two charts' }]} title="Compare two charts">
                <p>Two birth charts side by side: a match letter from S to D, what helps, what strains, and every contact between the two read plainly.{isLoggedIn ? '' : ' Free, no account.'}</p>
              </LearnHero>
              {stillHere ? <p className="hint still">Your last comparison is still open in this tab. <Link className="tlink" href="/calculators/synastry?result=1" shallow>Open it</Link></p> : null}
              <form className="mform synform" onSubmit={handleSubmit}>
                <div className="chips filt" role="group" aria-label="What kind of relationship">
                  {RELATIONSHIP_TYPES.map(t => <button key={t.value} type="button" className="chip" aria-pressed={relationshipType === t.value} onClick={() => setRelationshipType(t.value)}>{t.label}</button>)}
                </div>
                <div className="synsides">
                  {panel('A', modeA, setModeA, formA, setFormA, selectedA, setSelectedA)}
                  {panel('B', modeB, setModeB, formB, setFormB, selectedB, setSelectedB)}
                </div>
                {celebHasBirthTime === false ? <p className="hint">No verified birth time for {celebNameB}: the rising sign and houses are left out, every planet aspect still counts.</p> : null}
                {error ? <p className="err" role="alert">{error}</p> : null}
                <div className="ts"><Turnstile siteKey={SITE_KEY} onSuccess={setTurnstileToken} options={{ theme: 'dark' }} /></div>
                <button type="submit" className="btn wide" disabled={loading || !turnstileToken}>{loading ? 'Working out the sky…' : 'Compare the charts'}</button>
              </form>
            </>
          )}
          <section className="lsec" id="about">
            <h2>About comparing charts</h2>
            {FAQ_ITEMS.map((f, i) => <div key={i}><h3>{f.question}</h3><p>{f.answer}</p></div>)}
          </section>
        </div></main>
      </>
    )
  }

  return (
    <>
      {head}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <AdminBreadcrumb crumbs={[
          { label: 'Calculators', href: '/calculators' },
          { label: 'Synastry' },
        ]} />

        <h1 className="font-display text-4xl tracking-wide mb-2">Synastry calculator</h1>
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
                {loading ? 'Working out the sky…' : 'Compare charts'}
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
                <span className="text-slate-500">{harmonious.length} harmonious · {tense.length} tense</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 capitalize">{results.relationshipType}</span>
              </div>
              <div className="mt-6 max-w-md mx-auto"><SynastryScoreCard score={results.score} nameA={nameA} nameB={nameB} /></div>

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
                  <span className="text-emerald-500">△</span> Harmonious aspects
                </h2>
                <div className="space-y-3">
                  {harmonious.map((a, i) => <AspectRow key={i} aspect={a} nameA={nameA} nameB={nameB} />)}
                </div>
              </div>
            )}

            {/* Tense aspects */}
            {tense.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="text-rose-400">□</span> Growth edges
                </h2>
                <p className="text-xs text-slate-400 mb-3">Tense aspects aren&apos;t &ldquo;bad.&rdquo; They&apos;re the friction that drives growth and keeps a relationship alive.</p>
                <div className="space-y-3">
                  {tense.map((a, i) => <AspectRow key={i} aspect={a} nameA={nameA} nameB={nameB} />)}
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
                  {isLoggedIn && modeB === 'manual' && formB.name && (
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
                Create your free birth chart
              </Link>
            </div>
          </div>
        )}

        {/* Love section cross-link */}
        <div className="mt-10 grid sm:grid-cols-2 gap-3">
          <Link href="/love/celebrity-couples" className="card hover:border-slate-400 dark:hover:border-slate-500 transition-colors group">
            <p className="font-medium text-sm text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Celebrity couples</p>
            <p className="text-xs text-slate-400 mt-0.5">101 real couples with element compatibility scores</p>
          </Link>
          <Link href="/love" className="card hover:border-slate-400 dark:hover:border-slate-500 transition-colors group">
            <p className="font-medium text-sm text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Love &amp; Astrology</p>
            <p className="text-xs text-slate-400 mt-0.5">Sign-in-love profiles and couple deep-dives</p>
          </Link>
        </div>

        {/* FAQ */}
        <div className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="text-lg font-semibold mb-6">About synastry</h2>
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
