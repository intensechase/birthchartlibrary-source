import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import type { CelebView } from '@/lib/redesign/celeb-view'
import CelebPage from './CelebPage'

// A visitor's chart in the celebrity layout (stage 'mine'). What sits under the
// Big Three and after the chart depends on who is looking: a guest who has not saved it yet, the owner
// (private or public, share), or someone opening a shared link.
export interface MineChart {
  view: CelebView
  birthDate: string
  birthTime: string | null
  birthCity: string
  subjectName: string | null
}

export function titleOf(subjectName: string | null) {
  if (!subjectName) return { title: 'Your birth chart', whose: 'your' }
  const p = subjectName.endsWith('s') ? `${subjectName}’` : `${subjectName}’s`
  return { title: `${p} birth chart`, whose: p }
}

export default function MinePage({ chart, top, line, foot, plain, heading }: { chart: MineChart; top?: ReactNode; line?: ReactNode; foot?: ReactNode; plain?: boolean; heading?: { title: string; whose: string } }) {
  const t = heading ?? titleOf(chart.subjectName)
  return (
    <main className="rdp">
      <CelebPage
        view={chart.view}
        celeb={{ name: chart.subjectName ?? 'You', slug: 'your-chart', birth_date: chart.birthDate, birth_time: chart.birthTime, birth_city: chart.birthCity, image_proxy: null, photo_credit: null, category: null }}
        bio=""
        bornSameDay={[]}
        chartTwins={[]}
        couplePairs={[]}
        personal={{ ...t, top, line, foot, plain }}
      />
    </main>
  )
}

// Made without an account: how long it lasts here, and how to keep it.
export function KeptLine({ until, isForSelf, account, inTab, onSave, onRemove }: { until: number | null; isForSelf: boolean; account: boolean; inTab: boolean; onSave: () => void; onRemove: () => void }) {
  const day = until ? new Date(until).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : null
  const keep = account ? 'Save it to your account to keep it.' : 'Save it free to keep it.'
  return (
    <div className="mbar">
      <div>
        <b>{day ? `Kept on this device until ${day}.` : inTab ? 'Here until you close this tab.' : 'This chart is not saved yet.'}</b>
        <span>{keep}{isForSelf && !account ? ' The full reading and your daily horoscope come with it.' : ''}</span>
      </div>
      <div className="acts">
        <button type="button" className="btn" onClick={onSave}>Save this chart</button>
        {day ? <button type="button" className="tlink" onClick={onRemove}>Remove</button> : null}
      </div>
    </div>
  )
}

// A shared link, opened by someone else.
export function SharedBar() {
  return (
    <div className="mbar">
      <div><b>A chart someone shared with you.</b><span>Yours is free, read the same way.</span></div>
      <Link className="btn" href="/birth-chart?ref=shared-chart">Make my chart</Link>
    </div>
  )
}

const readLabel = (own?: boolean, subject?: string | null) => (own || !subject ? 'Read your full reading' : `Read ${titleOf(subject).whose} full reading`)

// Owner, under the Big Three: the reading, and today's horoscope for their own chart.
export function OwnerLine({ chartId, own, subject }: { chartId: string; own: boolean; subject?: string | null }) {
  return (
    <div className="mbtns">
      <Link className="btn" href={`/birth-chart/${chartId}/reading`}>{readLabel(own, subject)}</Link>
      {own ? <Link className="btn ghost" href="/daily-horoscope">Today’s horoscope</Link> : null}
      <Link className="tlink" href={`/birth-chart/${chartId}/edit`}>Edit birth details</Link>
    </div>
  )
}

// Owner, after the chart: where to go next, then who can see it. Private by
// default; public gives a link and share images.
export function OwnerFoot({ chartId, isPublic: start, shareText, ogUrl, fileBase, own, subject }: { chartId: string; isPublic: boolean; shareText: string; ogUrl: (sq: boolean) => string; fileBase: string; own?: boolean; subject?: string | null }) {
  const [isPublic, setIsPublic] = useState(start)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const url = `https://birthchartlibrary.com/birth-chart/${chartId}`
  const toggle = async () => {
    setBusy(true)
    const res = await fetch(`/api/birth-chart/${chartId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_public: !isPublic }) })
    if (res.ok) setIsPublic(!isPublic)
    setBusy(false)
  }
  const copy = () => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const share = async () => {
    if (navigator.share) await navigator.share({ title: 'My birth chart', text: shareText, url }).catch(() => {})
    else copy()
  }
  const download = async (sq: boolean) => {
    const blob = await (await fetch(ogUrl(sq))).blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${fileBase}${sq ? '-square' : ''}.png`
    a.click()
    URL.revokeObjectURL(a.href)
  }
  return (
    <>
    <div className="mbar next">
      <Link className="btn" href={`/birth-chart/${chartId}/reading`}>{readLabel(own, subject)}</Link>
      <Link className="btn ghost" href={`/calculators/synastry?chart=${chartId}`}>{own ? 'Compare with someone' : 'Compare charts'}</Link>
      <Link className="btn ghost" href="/birth-chart?for=someone">Make another chart</Link>
      <Link className="tlink" href="/account">All your charts</Link>
    </div>
    <div className="mbar owner">
      <button type="button" className="toggle" aria-pressed={isPublic} disabled={busy} onClick={toggle}>
        {isPublic ? 'Public: anyone with the link can see it' : 'Private: only you can see it'} <span className="knob" aria-hidden="true" />
      </button>
      {isPublic ? (
        <div className="shares">
          <button type="button" className="btn" onClick={share}>Share</button>
          <button type="button" className="btn ghost" onClick={copy}>{copied ? 'Link copied' : 'Copy link'}</button>
          <button type="button" className="btn ghost" onClick={() => download(true)}>Square image</button>
          <button type="button" className="btn ghost" onClick={() => download(false)}>Wide image</button>
        </div>
      ) : null}
    </div>
    </>
  )
}
