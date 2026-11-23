import { useEffect, useState } from 'react'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Turnstile } from '@marsidev/react-turnstile'
import CityAutocomplete from '@/components/CityAutocomplete'
import DashboardLayout from '@/components/DashboardLayout'
import ChartDetail from '@/components/ChartDetail'
import { getUser, clearAuthCookie, COOKIE_NAME } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import { decryptBirthFields } from '@/lib/crypto'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import type { Interpretations } from '@/components/chart/PlanetCard'
import { redesignOn } from '@/lib/redesign'
import MineForm, { type MineFormValues } from '@/components/redesign/MineForm'
import ChartTool from '@/components/redesign/ChartTool'
import SaveWaiting from '@/components/redesign/SaveWaiting'
import { KEPT_KEY, KEPT_UNTIL_KEY, PENDING_KEY, clearWaiting, waitingChart, type PendingChart } from '@/lib/kept-chart'
import { safeNext } from '@/lib/safe-next'
import { track } from '@/lib/track'


interface FormState {
  label: string
  subjectName: string
  birthDate: string
  birthTime: string
  birthCity: string
  birthLat: number
  birthLng: number
}

interface Props {
  isLoggedIn: boolean
  hasMain: boolean
  // ?save=1 only: the main chart's own details, so the same chart is not offered twice.
  mainBirth: { date: string; time: string | null; lat: number | null; lng: number | null } | null
}

// Auth is no longer edge-gated for this route (see middleware.ts) — a
// visitor can compute and see a full chart with zero account. Signing up
// is the *save* step, not the entry fee. Logged-in users keep the
// original save-immediately-and-redirect behavior unchanged.
export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const user = await getUser(context)
  if (!user) {
    // A token for a deleted account: clear it, or /login would keep sending
    // the reader back here.
    if (context.req.cookies[COOKIE_NAME]) clearAuthCookie(context.res)
    return { props: { isLoggedIn: false, hasMain: false, mainBirth: null } }
  }
  // "My chart" for everyone: the reader's chart when there is one, else the
  // form. These reach the form anyway: ?new=1 and ?for= (another chart),
  // ?save=1 (a chart made as a guest, waiting to be saved), ?welcome.
  const main = await queryOne<{ id: string; birth_date: string; birth_time: string | null; birth_time_enc: string | null; birth_lat: number | null; birth_lat_enc: string | null; birth_lng: number | null; birth_lng_enc: string | null }>('SELECT id, birth_date, birth_time, birth_time_enc, birth_lat, birth_lat_enc, birth_lng, birth_lng_enc FROM birth_charts WHERE user_id = $1 AND is_primary = true LIMIT 1', [user.id])
  const q = context.query
  if (main && redesignOn('mine') && !q.new && !q.for && !q.save && !q.welcome) {
    return { redirect: { destination: `/birth-chart/${main.id}`, permanent: false } }
  }
  let mainBirth: Props['mainBirth'] = null
  if (main && q.save) {
    const d = decryptBirthFields(main)
    const num = (v: unknown) => (v == null || !Number.isFinite(Number(v)) ? null : Number(v))
    mainBirth = { date: main.birth_date, time: d.birth_time?.slice(0, 5) ?? null, lat: num(d.birth_lat), lng: num(d.birth_lng) }
  }
  return { props: { isLoggedIn: true, hasMain: !!main, mainBirth } }
}

export default function ChartPage({ isLoggedIn, hasMain, mainBirth }: Props) {
  const router = useRouter()
  const { query } = router
  const isWelcome = query.welcome === 'true'
  // A chart made before signing in, waiting for the account. Read after the
  // first render (the server cannot see it); ?save=1 shows nothing until then.
  const look = isLoggedIn && !query.new && !query.for && (!hasMain || !!query.save)
  const [pending, setPending] = useState<PendingChart | null | undefined>(undefined)
  useEffect(() => {
    if (!look) { setPending(null); return }
    const w = waitingChart()
    // Already in the account as the main chart (same moment, same place): nothing to ask.
    const near = (a: number | null | undefined, b: number) => a != null && Math.abs(a - b) < 0.1
    if (w?.isForSelf && mainBirth && mainBirth.date === w.birthDate && (mainBirth.time ?? '') === (w.birthTime || '') && near(mainBirth.lat, w.birthLat) && near(mainBirth.lng, w.birthLng)) {
      clearWaiting(w)
      window.location.replace(safeNext(query.next) ?? '/birth-chart')
      return
    }
    if (!w && query.save) { window.location.replace(safeNext(query.next) ?? (hasMain ? '/birth-chart' : '/birth-chart?new=1')); return }
    setPending(w)
  }, [look]) // eslint-disable-line react-hooks/exhaustive-deps

  if (redesignOn('mine')) {
    if (!isLoggedIn) return <MineGuest />
    if (look && pending) {
      return (
        <SaveWaiting pending={pending} hasMain={hasMain} next={safeNext(query.next)} onSkip={() => {
          // "Not now" drops the waiting save; a chart kept on the device stays its 7 days.
          try { sessionStorage.removeItem(PENDING_KEY) } catch { /* blocked */ }
          window.location.href = safeNext(query.next) ?? (hasMain ? '/birth-chart' : '/birth-chart?new=1')
        }} />
      )
    }
    if (look && pending === undefined && query.save) return <main className="rdp"><div className="wrap mine" aria-busy="true" /></main>
    return <MineAuthed hasMain={hasMain} />
  }

  if (!isLoggedIn) return <GuestChartForm />
  return (
    <DashboardLayout>
      <AuthedChartForm isWelcome={isWelcome} />
    </DashboardLayout>
  )
}

function emptyForm(): FormState {
  return { label: '', subjectName: '', birthDate: '', birthTime: '', birthCity: '', birthLat: 0, birthLng: 0 }
}

// Shared by the guest and authed flows below — same fields, same Turnstile
// widget, same Me/Someone Else toggle. Owns all form + submission UI state;
// callers only supply what actually differs between them (copy, whether the
// optional Chart Label field shows, and what submitting actually does).
interface ChartRequestFormProps {
  showLabelField?: boolean
  submitText: string
  loadingText: string
  onSubmit: (form: FormState, isForSelf: boolean, turnstileToken: string) => Promise<string | null>
  // Only AuthedChartForm needs this — its description paragraph above the
  // form changes copy based on the live toggle state, which otherwise isn't
  // visible outside this component.
  onIsForSelfChange?: (isForSelf: boolean) => void
}

function ChartRequestForm({ showLabelField, submitText, loadingText, onSubmit, onIsForSelfChange }: ChartRequestFormProps) {
  const [isForSelf, setIsForSelfState] = useState(true)
  const [form, setForm] = useState<FormState>(emptyForm())

  function setIsForSelf(next: boolean) {
    setIsForSelfState(next)
    onIsForSelfChange?.(next)
  }
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
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
    if (!form.birthLat || !form.birthLng) {
      setError('Please select a city from the dropdown')
      return
    }

    setLoading(true)
    setError(null)
    const errorMessage = await onSubmit(form, isForSelf, turnstileToken)
    if (errorMessage) setError(errorMessage)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <div>
        <label className="block text-sm mb-2 text-slate-500 dark:text-slate-400">Who is this chart for?</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsForSelf(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
              isForSelf
                ? 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100'
                : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'
            }`}
          >
            Me
          </button>
          <button
            type="button"
            onClick={() => setIsForSelf(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
              !isForSelf
                ? 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100'
                : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'
            }`}
          >
            Someone else
          </button>
        </div>
      </div>

      {!isForSelf && (
        <div>
          <label className="block text-sm mb-1 text-slate-500 dark:text-slate-400">Their Name *</label>
          <input
            name="subjectName"
            required
            value={form.subjectName}
            onChange={handleChange}
            className="input"
            placeholder="e.g. Sarah, Mom, The Guy From Tuesday"
          />
        </div>
      )}

      {showLabelField && (
        <div>
          <label className="block text-sm mb-1 text-slate-500">Chart Label (optional)</label>
          <input
            name="label"
            value={form.label}
            onChange={handleChange}
            className="input"
            placeholder={isForSelf ? 'e.g. My Chart' : `e.g. ${form.subjectName || "Mom's"} Chart`}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1 text-slate-500 dark:text-slate-400">
            Birth date <span aria-hidden="true" className="text-rose-600">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            type="date"
            name="birthDate"
            required
            value={form.birthDate}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-slate-500 dark:text-slate-400">Birth time</label>
          <input
            type="time"
            name="birthTime"
            value={form.birthTime}
            onChange={handleChange}
            className="input"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {form.birthTime
              ? 'Use local time at the birth place (we handle the timezone).'
              : 'Defaults to noon if unknown. Use local time at the birth place.'}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1 text-slate-500">
          Birth city <span aria-hidden="true" className="text-rose-600">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <CityAutocomplete
          value={form.birthCity}
          onChange={handleCitySelect}
        />
        {form.birthLat !== 0 && (
          <p className="text-xs text-slate-400 mt-1">
            {form.birthLat.toFixed(4)}, {form.birthLng.toFixed(4)}
          </p>
        )}
      </div>

      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={setTurnstileToken}
      />

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !turnstileToken || !form.birthLat || (!isForSelf && !form.subjectName)}
        className="btn-primary w-full"
      >
        {loading ? loadingText : submitText}
      </button>
    </form>
  )
}

function GuestChartForm() {
  const [result, setResult] = useState<{ form: FormState; isForSelf: boolean; chartData: BirthChartData; interp: Interpretations } | null>(null)

  async function handleSubmit(form: FormState, isForSelf: boolean, turnstileToken: string): Promise<string | null> {
    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: form.birthDate,
          birthTime: form.birthTime || null,
          birthLat: form.birthLat,
          birthLng: form.birthLng,
          turnstileToken,
        }),
      })
      const data = await res.json()
      if (!res.ok) return data.error ?? 'Something went wrong'
      setResult({ form, isForSelf, chartData: data.chart, interp: data.interp })
      return null
    } catch {
      return 'Network error... please try again'
    }
  }

  function saveChart() {
    if (!result) return
    const pending: PendingChart = { ...result.form, isForSelf: result.isForSelf }
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending))
    window.location.href = '/signup?ref=guest-chart'
  }

  if (result) {
    const { form, isForSelf } = result
    const label = isForSelf ? (form.label || 'My Chart') : (form.label || form.subjectName || 'Chart')
    return (
      <>
        <Head>
          <title>Your Birth Chart | Birth Chart Library</title>
          <meta name="robots" content="noindex" />
        </Head>
        <main className="max-w-3xl mx-auto px-4 py-12">
          <div className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">This chart isn&apos;t saved yet.</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Create a free account to save it, revisit it anytime, and unlock your daily horoscope.</p>
            </div>
            <button onClick={saveChart} className="btn-primary shrink-0 px-6 py-2.5 whitespace-nowrap">
              Save This Chart — Free
            </button>
          </div>
          <ChartDetail
            chartData={result.chartData}
            label={label}
            birthDate={form.birthDate}
            birthTime={form.birthTime || null}
            birthCity={form.birthCity}
            interp={result.interp}
          />
        </main>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Free Birth Chart Calculator | Birth Chart Library</title>
        <meta name="description" content="Calculate your free birth chart instantly — no account required. See your Sun, Moon, Rising, and full planetary placements with detailed interpretations." />
      </Head>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">Get your free birth chart</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Enter your birth details below and see your full chart instantly. No account needed — you can save it afterward if you want to keep it.
        </p>

        <ChartRequestForm submitText="See My Chart" loadingText="Calculating…" onSubmit={handleSubmit} />
      </main>
    </>
  )
}

// ---------------------------------------------------------------------
// Authed flow — unchanged from before: save immediately, redirect to the
// chart's own page.
// ---------------------------------------------------------------------
function AuthedChartForm({ isWelcome }: { isWelcome: boolean }) {
  const [showWelcome, setShowWelcome] = useState(isWelcome)
  // Mirrors ChartRequestForm's internal toggle state — needed here because
  // the description paragraph above the form changes copy based on it.
  const [isForSelf, setIsForSelf] = useState(true)

  async function handleSubmit(form: FormState, isForSelf: boolean, turnstileToken: string): Promise<string | null> {
    let data: { error?: string; chart?: { id: string; chart_data: unknown } }
    try {
      const res = await fetch('/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          turnstileToken,
          isForSelf,
          subjectName: isForSelf ? null : form.subjectName,
          label: isForSelf ? (form.label || 'My Chart') : (form.label || form.subjectName || 'Chart'),
        }),
      })
      data = await res.json()
      if (!res.ok) return data.error ?? 'Something went wrong'
    } catch {
      return 'Network error... please try again'
    }

    if (!data.chart?.id) {
      return 'Chart was saved but something went wrong. Please try again.'
    }

    if (typeof window !== 'undefined' && (window as any).pintrk) {
      (window as any).pintrk('track', 'lead', {
        event_id: `bcl-chart-${data.chart.id}`,
        lead_type: 'Birth Chart',
      })
    }
    window.location.href = `/birth-chart/${data.chart.id}`
    return null
  }

  return (
    <>
      <Head>
        <title>Generate a Birth Chart | Birth Chart Library</title>
        <meta name="description" content="Generate a personalized birth chart with planet positions, house placements, and detailed interpretations." />
      </Head>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {showWelcome && (
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-8 text-center relative">
            <button
              type="button"
              onClick={() => setShowWelcome(false)}
              className="absolute top-3 right-3 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-300 transition-colors text-lg"
              aria-label="Dismiss"
            >
              &times;
            </button>
            <div className="text-3xl mb-3">&#10022;</div>
            <h2 className="text-xl font-semibold mb-2">Welcome to Birth Chart Library</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
              Your account is confirmed... now let&apos;s build your birth chart. This becomes the foundation of everything... your daily horoscope, your cosmic blueprint, your self-discovery tool.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-400 dark:text-slate-500">
              <span>1. Enter your birth details</span>
              <span className="text-slate-300 dark:text-slate-600">&rarr;</span>
              <span>2. See your natal chart</span>
              <span className="text-slate-300 dark:text-slate-600">&rarr;</span>
              <span>3. Get daily horoscopes</span>
            </div>
          </div>
        )}

        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">
          {isWelcome ? 'Create Your Birth Chart' : 'Generate a Birth Chart'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          {isWelcome
            ? 'Enter your birth details below. This is the only chart you need to unlock your personalized daily horoscope.'
            : isForSelf
              ? 'Enter your birth details below. Birth time is optional but improves accuracy for houses and your rising sign.'
              : 'Enter their birth details below. This chart will be saved to your Chart Library.'
          }
        </p>

        <ChartRequestForm
          showLabelField
          submitText="Generate Chart"
          loadingText="Calculating…"
          onSubmit={handleSubmit}
          onIsForSelfChange={setIsForSelf}
        />
      </main>
    </>
  )
}

// ---------------------------------------------------------------------
// Stage 'mine': the redesigned form and result. Same endpoints, same
// save-after-signup handoff; the result is read like a celebrity chart.
// ---------------------------------------------------------------------
const MINE_HEAD = (
  <Head>
    <title>Free Birth Chart: your sky at birth, read plainly | Birth Chart Library</title>
    <meta name="description" content="Make your birth chart free, no account needed. Your Sun, Moon and Rising, every planet and house, read the same way as every celebrity chart in the library." />
    {/* Back with a chart on this device: hold the form back so it does not flash first. */}
    <script dangerouslySetInnerHTML={{ __html: `try{var k=+localStorage.getItem('${KEPT_UNTIL_KEY}');if(k>Date.now()&&localStorage.getItem('${KEPT_KEY}')&&!/[?&](new|for)=/.test(location.search)&&!/bcl_logged_in=/.test(document.cookie))document.documentElement.classList.add('kept-chart')}catch(e){}` }} />
  </Head>
)

function MineGuest() {
  return (
    <ChartTool head={MINE_HEAD} title="Your birth chart" sub="The sky at the moment you were born, read the same way as every chart in the library. Free, and no account needed." submitText="See my chart" saveRef="guest-chart" home />
  )
}

function MineAuthed({ hasMain }: { hasMain: boolean }) {
  async function submit(form: MineFormValues, isForSelf: boolean, turnstileToken: string): Promise<string | null> {
    const subjectName = isForSelf ? null : form.subjectName.trim()
    let data: { error?: string; chart?: { id: string } }
    try {
      const res = await fetch('/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, birthTime: form.birthTime || null, turnstileToken, isForSelf, subjectName, label: isForSelf ? (hasMain ? 'Another chart for me' : 'My Chart') : subjectName }),
      })
      data = await res.json()
      if (!res.ok) return data.error ?? 'That did not work. Check the details and try again.'
    } catch {
      return 'No connection. Check your internet and try again.'
    }
    track('chart_made', isForSelf ? 'self' : 'someone')
    if (!data.chart?.id) return 'The chart was saved, but opening it failed. Find it on your account page.'
    window.location.href = `/birth-chart/${data.chart.id}`
    return null
  }
  return (
    <>
      {MINE_HEAD}
      <div className="rdp">
        <MineForm title="Make a birth chart" sub="Yours, or someone else’s. It is saved to your account and private unless you share it." submitText="Make the chart" onSubmit={submit} hasMain={hasMain} />
      </div>
    </>
  )
}
