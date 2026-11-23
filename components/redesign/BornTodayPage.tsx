import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import type { HomePerson } from '@/lib/redesign/home-view'
import { PersonCard } from './HomePage'
import AdSlot from './AdSlot'

// Born today (stage 'library'): today's birthdays as person cards; when a day
// has few, the rest of the week fills in so the page is never one lonely card.
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function Lookup() {
  const router = useRouter()
  const [m, setM] = useState(0) // 1 to 12; 0 = not picked
  const [d, setD] = useState(0)
  const go = (e: React.FormEvent) => {
    e.preventDefault()
    if (m && d && d <= DAYS[m - 1]) router.push(`/born-on/${MONTHS[m - 1].toLowerCase()}-${d}`)
  }
  return (
    <form className="card lookup" onSubmit={go}>
      <h2 id="look-h">Look up any birthday</h2>
      <div className="datein">
        <label className="sr-only" htmlFor="lk-m">Month</label>
        <select id="lk-m" value={m} onChange={e => { setM(Number(e.target.value)); setD(0) }}>
          <option value={0}>Month</option>
          {MONTHS.map((x, i) => <option key={x} value={i + 1}>{x}</option>)}
        </select>
        <label className="sr-only" htmlFor="lk-d">Day</label>
        <select id="lk-d" value={d} onChange={e => setD(Number(e.target.value))} disabled={!m}>
          <option value={0}>Day</option>
          {Array.from({ length: m ? DAYS[m - 1] : 31 }, (_, i) => i + 1).map(x => <option key={x} value={x}>{x}</option>)}
        </select>
        <button className="btn" type="submit" disabled={!m || !d}>Show charts</button>
      </div>
    </form>
  )
}

const names = (ps: HomePerson[]) => ps.map(p => p.name).join(', ').replace(/, ([^,]*)$/, ' and $1')

function intro(today: HomePerson[], thin: boolean): string {
  const week = thin ? ' Here is everyone else born within three days of it, too.' : ''
  if (today.length === 0) return `No one in the library has a birthday today.${thin ? ' Here is everyone born within three days of it.' : ''}`
  if (today.length < 4) return `${names(today)} ${today.length === 1 ? 'has a birthday' : 'have birthdays'} today.${week}`
  return `${today.length} charts in the library have a birthday today.`
}

export default function BornTodayPage({ dateLabel, people }: { dateLabel: string; people: HomePerson[] }) {
  const today = people.filter(p => p.offset === 0)
  const rest = people.filter(p => p.offset !== 0)
  const thin = today.length < 4 && rest.length > 0
  return (
    <div className="wrap wide hm lib">
      <div className="open">
        <h1>Born on {dateLabel}</h1>
        <p className="sub">{intro(today, thin)}</p>
      </div>
      {/* A thin day reads better as one grid, today's birthdays first, than as a
          lone card above a second list. */}
      {thin || today.length ? <div className="pgrid">{(thin ? [...today, ...rest] : today).map(p => <PersonCard key={p.slug} p={p} />)}</div> : null}

      <AdSlot label="Ad 1: after the birthdays" />

      <section className="band" aria-labelledby="look-h"><Lookup /></section>
      <p className="lede more-link"><Link className="more" href="/celebrity-birth-charts">Browse the whole library</Link></p>
    </div>
  )
}
