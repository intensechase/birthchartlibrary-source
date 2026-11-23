import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MineForm, { type MineFormValues } from '@/components/redesign/MineForm'
import MinePage, { KeptLine } from '@/components/redesign/MinePage'
import ReadingTeaser from '@/components/redesign/ReadingTeaser'
import { PENDING_KEY, holdInTab, isSignedIn, keepOwn, readKept, readTab, removeKept, sayOwnChart, type HeldChart, type PendingChart } from '@/lib/kept-chart'
import { safeSessionSet } from '@/lib/safe-storage'
import { track } from '@/lib/track'
import Link from 'next/link'
import { signLine } from '@/components/redesign/CelebPage'
import type { CelebView, VDisc } from '@/lib/redesign/celeb-view'
import { DISC } from '@/lib/redesign/astro'
import { CardLink } from '@/components/redesign/cards'
import { Disc } from '@/components/redesign/Disc'

// The no-account chart flow: form, then the chart read like a celebrity chart,
// with a bar to save it. Used by /birth-chart (guests) and the calculator pages
// (stage 'tools'), which differ only in their copy and what sits around the form.
//
// Without an account (owner, 11/23): the reader's own chart is kept in this
// browser for 7 days, a chart for someone else until the tab closes, and the
// full reading's opening sits under the chart. Saving leaves the form in
// sessionStorage (lib/kept-chart) and goes to sign up, or for a signed in reader
// to /birth-chart?save=1.
export type ChartFocus = 'rising' | 'big3'

// Runs before the browser paints; on the server there is nothing to lay out.
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const ROLE: Record<string, string> = { sun: 'Sun', moon: 'Moon', rising: 'Rising' }

// The calculator's answer, said first: the rising sign (or the Big Three) big,
// one line each, then the whole chart below. Tapping opens the full card.
function AnswerStrip({ view, focus, whose }: { view: CelebView; focus: ChartFocus; whose: string }) {
  const items = view.bigThree.filter(b => focus === 'big3' || b.card === 'rising')
  if (!items.length) {
    return (
      <section className="ans none">
        <b>No birth time, so no rising sign.</b>
        <span>The rising sign changes about every two hours, so it is left out rather than guessed. Everything that does not need the time is below.</span>
      </section>
    )
  }
  return (
    <section className={`ans${items.length > 1 ? ' three' : ''}`} aria-label={focus === 'rising' ? `${whose} rising sign` : `${whose} Big Three`}>
      <p className="ak">{focus === 'rising' ? `${whose} rising sign` : `${whose} Big Three`}</p>
      <div className="ag">
        {items.map(b => (
          <CardLink key={b.card} card={b.card} className="ai" label={b.label}>
            <Disc disc={b.disc} size={items.length > 1 ? 48 : 64} />
            <span className="at">
              <b>{b.sign}<small>{ROLE[b.card]}</small></b>
              <span>{view.said?.[b.card] || signLine(view, b.card, b.sign) || 'It changed sign that day, so it could be either.'}</span>
              <em>Read more</em>
            </span>
          </CardLink>
        ))}
      </div>
      {focus === 'big3' && !view.hasTime ? <p className="an">No birth time, so no rising sign: it changes about every two hours and is left out rather than guessed.</p> : null}
    </section>
  )
}

// The other tools, as disc doors (calculators hub and the foot of each tool).
const DOORS: { href: string; title: string; sub: string; disc: VDisc }[] = [
  { href: '/calculators/synastry', title: 'Compare two charts', sub: 'How two people’s planets meet', disc: { color: DISC.NEPTUNE, icon: 'opposition' } },
  { href: '/calculators/chinese-zodiac', title: 'Chinese zodiac', sub: 'Your animal and element, from your birth date', disc: { color: '#FF8A65', text: '龍' } },
  { href: '/love/celebrity-couples', title: 'Famous couples', sub: 'Real couples’ charts, ranked by how they meet', disc: { color: DISC.VENUS, icon: 'venus' } },
  { href: '/calculators/rising-sign', title: 'Rising sign', sub: 'The sign coming up in the east when you were born', disc: { color: DISC.RISING, icon: 'ascendant' } },
  { href: '/calculators/sun-moon-rising', title: 'Sun, Moon and rising', sub: 'Your Big Three, said first', disc: { color: DISC.SUN, icon: 'sun' } },
]

export function ToolDoors({ title = 'More tools', only, skip }: { title?: string; only?: string[]; skip?: string }) {
  const list = DOORS.filter(d => (!only || only.includes(d.href)) && d.href !== skip)
  return (
    <section className="lsec doors">
      <h2>{title}</h2>
      <div className="dgrid">
        {list.map(d => (
          <Link key={d.href} href={d.href} className="door">
            <Disc disc={d.disc} size={44} iconSize={24} />
            <span><b>{d.title}</b><small>{d.sub}</small></span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function ChartTool({ head, title, sub, submitText, saveRef, top, after, focus, home }: {
  head: ReactNode       // <Head> for the form view (the result view is noindex)
  title: string
  sub: string
  submitText: string
  saveRef: string       // signup ?ref= for attribution, e.g. "guest-chart"
  top?: ReactNode
  after?: ReactNode
  focus?: ChartFocus    // calculators: say the answer first, above the chart
  home?: boolean        // /birth-chart: opens the reader's kept chart by itself
}) {
  const router = useRouter()
  const { query, isReady } = router
  const [held, setHeld] = useState<HeldChart | null>(null)
  const [kept, setKept] = useState(false)          // a chart of their own is on this device
  const [tabName, setTabName] = useState<string | null>(null) // someone else's chart, still in this tab
  const justMade = useRef(false)

  // What the address asks for: ?chart=mine or ?chart=someone (so refresh and
  // Back keep the chart), or on /birth-chart the reader's own chart if any.
  const want = typeof query.chart === 'string' ? query.chart : home && !query.new && !query.for ? 'home' : ''
  useBrowserLayoutEffect(() => {
    if (!isReady) return
    document.documentElement.classList.remove('kept-chart')
    const own = isSignedIn() ? null : readKept()
    const tab = readTab()
    setKept(!!own)
    setTabName(tab && !tab.isForSelf ? tab.chart.subjectName : null)
    if (justMade.current) { justMade.current = false; return }
    const show = want === 'someone' ? (tab && !tab.isForSelf ? tab : null)
      : want === 'mine' ? own ?? (tab?.isForSelf ? tab : null)
      : want === 'home' ? own : null
    setHeld(show)
    if (show?.isForSelf && want) track('my_chart_opened')
  }, [isReady, want, query.new, query.for])

  const ownOnScreen = !!held?.isForSelf
  useEffect(() => {
    if (!ownOnScreen) return
    sayOwnChart(true)
    return () => sayOwnChart(false)
  }, [ownOnScreen])

  async function submit(form: MineFormValues, isForSelf: boolean, turnstileToken: string): Promise<string | null> {
    const subjectName = isForSelf ? null : form.subjectName.trim()
    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate: form.birthDate, birthTime: form.birthTime || null, birthLat: form.birthLat, birthLng: form.birthLng, birthCity: form.birthCity, subjectName, turnstileToken }),
      })
      const data = await res.json()
      if (!res.ok) return data.error ?? 'That did not work. Check the details and try again.'
      if (!data.view) return 'That did not work. Try again in a moment.'
      const made: HeldChart = {
        form, isForSelf, teaser: data.teaser ?? null,
        chart: { view: data.view as CelebView, birthDate: form.birthDate, birthTime: form.birthTime || null, birthCity: form.birthCity, subjectName },
      }
      track('chart_made', isForSelf ? 'self' : 'someone')
      let stored: boolean
      if (isForSelf && !isSignedIn()) {
        const until = keepOwn(made)
        stored = until !== null
        if (until !== null) made.until = until
      } else stored = holdInTab(made)
      setHeld(made)
      if (stored) {
        const chart = isForSelf ? 'mine' : 'someone'
        if (want !== chart) justMade.current = true
        router.replace({ pathname: router.pathname, query: { chart } }, undefined, { shallow: true, scroll: false })
      }
      window.scrollTo(0, 0)
      return null
    } catch {
      return 'No connection. Check your internet and try again.'
    }
  }

  function save() {
    if (!held) return
    track('save_pressed', held.isForSelf ? 'self' : 'someone')
    const pending: PendingChart = { ...held.form, isForSelf: held.isForSelf }
    safeSessionSet(PENDING_KEY, JSON.stringify(pending))
    window.location.href = isSignedIn() ? '/birth-chart?save=1' : `/signup?ref=${encodeURIComponent(saveRef)}`
  }

  function remove() {
    removeKept()
    setHeld(null); setKept(false)
    router.replace(router.pathname, undefined, { shallow: true, scroll: false })
    window.scrollTo(0, 0)
  }

  if (held) {
    const subject = held.chart.subjectName
    const account = isSignedIn()
    return (
      <>
        {/* Plain on purpose: Analytics records page titles, and names are private. */}
        <Head><title>Birth chart | Birth Chart Library</title><meta name="robots" content="noindex" /></Head>
        <MinePage chart={held.chart} plain={!!focus}
          top={focus ? <AnswerStrip view={held.chart.view} focus={focus} whose={held.isForSelf ? 'Your' : `${subject}’s`} /> : null}
          line={<KeptLine until={held.until ?? null} isForSelf={held.isForSelf} account={account} inTab={!!readTab() && !held.until} onSave={save} onRemove={remove} />}
          foot={(
            <>
              {held.teaser && !account ? <ReadingTeaser t={held.teaser} subject={subject} onSave={save} saveText="Save free and read on" /> : null}
              <div className="mbar next">
                <Link className="btn" href="/calculators/synastry">{held.isForSelf ? 'Compare with someone' : 'Compare two charts'}</Link>
                <Link className="btn ghost" href="/birth-chart?for=someone">Make another chart</Link>
              </div>
            </>
          )} />
      </>
    )
  }
  return (
    <>
      {head}
      <div className="rdp">
        <MineForm key={`${want}|${query.for ?? ''}`} title={title} sub={sub} submitText={submitText} onSubmit={submit} top={top} after={after} keptOwn={kept}
          note={tabName ? <p className="hint still">{tabName}’s chart is still open in this tab. <Link className="tlink" href={{ pathname: router.pathname, query: { chart: 'someone' } }} shallow>Open it</Link></p> : null} />
      </div>
    </>
  )
}
