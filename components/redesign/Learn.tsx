import type { ReactNode } from 'react'
import Link from 'next/link'
import type { VDisc } from '@/lib/redesign/celeb-view'
import type { HomePerson } from '@/lib/redesign/home-view'
import { Disc } from './Disc'
import { Face, PersonCard } from './HomePage'
import { REAL_CHARTS } from '@/lib/real-charts'
import { redesignOn } from '@/lib/redesign'

// Shared pieces for the rebuilt learn pages (Chinese zodiac, compatibility,
// glossary, hubs). Every learn page is built from these so they match by
// construction: one header, one fact tile, one reading column, one person card,
// one "where next" card. Reference look: the celebrity page and /reading.

export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((c, i) => (
        <span key={c.label}>
          {i ? <span className="sep" aria-hidden="true">›</span> : null}
          {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
        </span>
      ))}
    </nav>
  )
}

// One disc, or two overlapping (a sign pair).
export function LearnHero({ crumbs, disc, kicker, title, children }: { crumbs?: { label: string; href?: string }[]; disc?: VDisc | VDisc[]; kicker?: string; title: string; children?: ReactNode }) {
  return (
    <header className="lhero">
      {crumbs ? <Crumbs items={crumbs} /> : null}
      <div className="lhead">
        {Array.isArray(disc)
          ? <span className="discs">{disc.map((d, i) => <Disc key={i} disc={d} size={56} />)}</span>
          : disc ? <Disc disc={disc} size={56} /> : null}
        <div>
          {kicker ? <p className="kicker">{kicker}</p> : null}
          <h1>{title}</h1>
        </div>
      </div>
      {children ? <div className="lead">{children}</div> : null}
    </header>
  )
}

export function Facts({ items }: { items: { label: string; value: ReactNode; href?: string }[] }) {
  return (
    <div className="glance lfacts">
      {items.map(t => t.href
        ? <Link key={t.label} href={t.href} className="tile"><small>{t.label}</small><span>{t.value}</span></Link>
        : <div key={t.label} className="tile"><small>{t.label}</small><span>{t.value}</span></div>)}
    </div>
  )
}

// A titled block of reading text. Paragraphs split on blank lines.
export function Prose({ id, title, text, children }: { id?: string; title?: string; text?: string; children?: ReactNode }) {
  return (
    <section className="lsec" id={id}>
      {title ? <h2>{title}</h2> : null}
      {text ? text.split(/\n\s*\n/).map(t => t.trim()).filter(Boolean).map((t, i) => <p key={i}>{t}</p>) : null}
      {children}
    </section>
  )
}

export function People({ title, lede, people, more }: { title: string; lede?: string; people: HomePerson[]; more?: { href: string; label: string } }) {
  if (!people.length) return null
  return (
    <section className="lsec">
      <div className="bandhead"><h2>{title}</h2>{more ? <Link className="more" href={more.href}>{more.label}</Link> : null}</div>
      {lede ? <p className="lede">{lede}</p> : null}
      <div className="pgrid">{people.map(p => <PersonCard key={p.slug} p={p} />)}</div>
    </section>
  )
}

// Real people as examples on a teaching page, then the reader's own chart.
// Shows nothing on a page that has no set (lib/real-charts.ts).
export function RealCharts({ path }: { path: string }) {
  const set = REAL_CHARTS[path]
  if (!set) return null
  return (
    <section className="lsec" aria-labelledby="real-h">
      <h2 id="real-h">In real charts</h2>
      <p className="lede">{set.lede}</p>
      <ul className="reals">
        {set.people.map(p => (
          <li key={p.slug} className={p.other ? 'duo' : undefined}>
            <span className="rfaces">
              <Face name={p.name} slug={p.slug} sign={p.sign} size={p.other ? 48 : 56} />
              {p.other ? <Face name={p.other.name} slug={p.other.slug} sign={p.other.sign} size={48} /> : null}
            </span>
            <div>
              <h3>{p.other
                ? <Link href={`/celebrity-birth-charts/compare/${p.other.compare}`}>{p.name} and {p.other.name}</Link>
                : <Link href={`/celebrity-birth-charts/${p.slug}`}>{p.name}</Link>}</h3>
              <small>{p.what}</small>
              <p>{p.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="realgo">
        <Link className="btn" href={set.href ?? '/birth-chart?ref=real-charts'}>{set.button}</Link>
        <Link className="more" href="/celebrity-match">Find who shares your signs</Link>
      </div>
    </section>
  )
}

// Link cards. Also used for lists of couples and articles, with a lede.
export function NextLinks({ id, title = 'Where to go next', lede, links }: { id?: string; title?: string; lede?: string; links: { href: string; title: string; sub?: string }[] }) {
  if (!links.length) return null
  return (
    <section className="lsec" id={id}>
      <h2>{title}</h2>
      {lede ? <p className="lede">{lede}</p> : null}
      <div className="nexts">
        {links.map(l => <Link key={l.href} className="nx" href={l.href}><b>{l.title}</b>{l.sub ? <small>{l.sub}</small> : null}</Link>)}
      </div>
    </section>
  )
}

// A folding card, the same look and chevron as the house and aspect cards on /reading.
export function Fold({ title, sub, disc, open, children }: { title: string; sub?: string; disc?: VDisc; open?: boolean; children: ReactNode }) {
  return (
    <details className="fold" open={open}>
      <summary>
        {disc ? <Disc disc={disc} size={32} /> : null}
        <span className="ft"><b>{title}</b>{sub ? <small>{sub}</small> : null}</span>
        <svg className="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </summary>
      <div className="fb">{children}</div>
    </details>
  )
}

// Small link tiles in a grid (years, signs): a bold label and a quiet line under it.
export function TileGrid({ items }: { items: { href: string; label: string; sub?: string; dot?: string }[] }) {
  return (
    <div className="tgrid">
      {items.map(t => (
        <Link key={t.href} href={t.href}>
          <b>{t.label}</b>
          {t.sub ? <small>{t.dot ? <i style={{ background: t.dot }} aria-hidden="true" /> : null}{t.sub}</small> : null}
        </Link>
      ))}
    </div>
  )
}

export function PrevNext({ prev, next }: { prev?: { href: string; label: string } | null; next?: { href: string; label: string } | null }) {
  return (
    <nav className="pnav" aria-label="Previous and next">
      {prev ? <Link href={prev.href} rel="prev"><small>Previous</small>{prev.label}</Link> : <span />}
      {next ? <Link href={next.href} rel="next" className="nxt"><small>Next</small>{next.label}</Link> : <span />}
    </nav>
  )
}

// Plain text pages (about, method, privacy, terms, contact). The page body is
// written once; this picks the frame. In the redesign it is the learn header
// plus the article reading column; otherwise the old narrow main.
export function TextPage({ title, lead, narrow, art = true, after, children }: { title: string; lead?: ReactNode; narrow?: boolean; art?: boolean; after?: ReactNode; children: ReactNode }) {
  if (!redesignOn('hubs')) {
    return (
      <main className={`${narrow ? 'max-w-xl' : 'max-w-2xl'} mx-auto px-4 py-12`}>
        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">{title}</h1>
        {lead ? <p className="text-slate-500 mb-10">{lead}</p> : null}
        {children}
      </main>
    )
  }
  return (
    <main className="rdp"><div className="lrn">
      <LearnHero title={title}>{lead ? <p>{lead}</p> : null}</LearnHero>
      {art ? <article className="art">{children}</article> : <div className="tp">{children}</div>}
      {after}
    </div></main>
  )
}
