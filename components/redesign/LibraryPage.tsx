import Link from 'next/link'
import dynamic from 'next/dynamic'
import Icon from '@/components/Icon'
import type { HomePerson, HomeShelf } from '@/lib/redesign/home-view'
import type { FeaturedCeleb } from '@/lib/celebrities'
import { ELEMENT_OF, signIcon, SIGN_NAMES } from '@/lib/redesign/astro'
import { Face, Search, PersonCard } from './HomePage'
import AdSlot from './AdSlot'

// The library front page (stage 'library'): find someone first, then ways to
// browse (shelves, Sun signs), who has a birthday this week, the most read
// charts, and the full filter tool for anyone who wants to dig.
const CelebrityFilters = dynamic(() => import('@/components/CelebrityFilters'), { ssr: false })
const CelebrityRequestForm = dynamic(() => import('@/components/CelebrityRequestForm'))
const cleanName = (n: string) => n.replace(/\s*\([^)]*\)/g, '').trim()

export interface LibraryView {
  total: number
  shelves: HomeShelf[]
  week: HomePerson[]
  weekLabel: string
  popular: FeaturedCeleb[]
}

export default function LibraryPage({ view }: { view: LibraryView }) {
  return (
    <div className="wrap wide hm lib">
      <div className="open">
        <h1>Celebrity birth charts</h1>
        <p className="sub">{view.total.toLocaleString('en-US')} celebrity birth charts, each with a sourced birth date and a written reading. Find someone, or browse.</p>
        <Search />
      </div>

      <section className="band" aria-labelledby="shelves-h">
        <h2 id="shelves-h">Browse by what they do</h2>
        <div className="shelves">
          {view.shelves.map(s => (
            <Link key={s.title} className="shelf" href={s.href}>
              <span className="faces">{s.faces.map(p => <Face key={p.slug} name={p.name} slug={p.slug} size={34} />)}</span>
              <span><b>{s.title}</b><small>{s.count} charts</small></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="band" aria-labelledby="signs-h">
        <h2 id="signs-h">Browse by Sun sign</h2>
        <div className="signgrid">
          {SIGN_NAMES.map(s => (
            <Link key={s} className="signtile" href={`/celebrity-birth-charts/sign/${s.toLowerCase()}`}>
              <span className={`el-${ELEMENT_OF[s]}`}><Icon name={signIcon(s)} size={22} /></span>{s}
            </Link>
          ))}
        </div>
      </section>

      {view.week.length ? (
        <section className="band" aria-labelledby="week-h">
          <div className="bandhead"><h2 id="week-h">Birthdays this week</h2><Link className="more" href="/born-today">Born today</Link></div>
          <p className="lede">Charts with birthdays from {view.weekLabel}.</p>
          <div className="wkrow">{view.week.map(p => <PersonCard key={p.slug} p={p} />)}</div>
        </section>
      ) : null}

      <AdSlot label="Ad 1: between sections" />

      <section className="band" aria-labelledby="pop-h">
        <h2 id="pop-h">Most read</h2>
        <ul className="popgrid">
          {view.popular.map(c => (
            <li key={c.slug}>
              <Link href={`/celebrity-birth-charts/${c.slug}`}>
                <Face name={cleanName(c.name)} slug={c.slug} sign={c.sun_sign ?? undefined} size={56} />
                <span><b>{cleanName(c.name)}</b>{c.sun_sign ? <small>{c.sun_sign} Sun</small> : null}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="band" aria-labelledby="all-h">
        <h2 id="all-h">Filter the whole library</h2>
        <p className="lede">By Sun, Moon and Rising sign, by what they do, or by how well the birth time is sourced.</p>
        <div className="filters"><CelebrityFilters /></div>
      </section>

      <section className="band"><CelebrityRequestForm /></section>
    </div>
  )
}
