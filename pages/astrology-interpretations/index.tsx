import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { PLANETS } from '@/lib/interpretations'
import InterpretationLookup from '@/components/InterpretationLookup'
import { PLANET_KEYS, PLANET_SLUGS, SIGN_LIST } from '@/lib/constants'
import { redesignOn } from '@/lib/redesign'
import { BODY_ICON, DISC, ordinal } from '@/lib/redesign/astro'
import { Disc } from '@/components/redesign/Disc'
import { LearnHero, NextLinks } from '@/components/redesign/Learn'

export default function InterpretationsPage() {
  const router = useRouter()
  const [planet, setPlanet] = useState('')
  const [place, setPlace] = useState('')
  return (
    <>
      <Head>
        <title>Astrology Interpretation Library — Planets, Signs & Houses</title>
        <meta name="description" content="Explore detailed interpretations for every planet-sign-house combination in astrology. Look up any placement and understand what it means." />
      </Head>
      {redesignOn('hubs') ? (
        <main className="rdp"><div className="lrn">
          <LearnHero kicker="Learn" title="Interpretation library">
            <p>What any planet means in any sign or house. Look one up, or start from a planet.</p>
          </LearnHero>

          <form className="card lookup" onSubmit={e => { e.preventDefault(); if (planet && place) router.push(`/interpretations/${planet}-in-${place}`) }}>
            <h2>Look up a placement</h2>
            <div className="datein">
              <label className="sr-only" htmlFor="il-p">Planet</label>
              <select id="il-p" value={planet} onChange={e => setPlanet(e.target.value)}>
                <option value="">Planet</option>
                {PLANET_KEYS.map(k => <option key={k} value={PLANET_SLUGS[k]}>{PLANETS[k]?.name}</option>)}
              </select>
              <label className="sr-only" htmlFor="il-s">Sign or house</label>
              <select id="il-s" value={place} onChange={e => setPlace(e.target.value)}>
                <option value="">Sign or house</option>
                <optgroup label="Signs">{SIGN_LIST.map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}</optgroup>
                <optgroup label="Houses">{Array.from({ length: 12 }, (_, i) => i + 1).map(h => <option key={h} value={`house-${h}`}>{ordinal(h)} house</option>)}</optgroup>
              </select>
              <button className="btn" type="submit" disabled={!planet || !place}>Read it</button>
            </div>
          </form>

          <section className="lsec">
            <h2>Start from a planet</h2>
            <ul className="popgrid">
              {PLANET_KEYS.map(key => PLANETS[key] ? (
                <li key={key}>
                  <Link href={`/astrology-interpretations/${PLANET_SLUGS[key]}`}>
                    <Disc disc={{ color: DISC[key] ?? DISC.RISING, icon: BODY_ICON[key] }} size={44} iconSize={24} />
                    <span><b>{PLANETS[key].name}</b><small>24 placements</small></span>
                  </Link>
                </li>
              ) : null)}
            </ul>
          </section>

          <NextLinks links={[
            { href: '/birth-chart?ref=interp-index', title: 'Your free birth chart', sub: 'Every placement in your own chart, explained.' },
            { href: '/zodiac-signs', title: 'The signs', sub: 'All twelve, one page each.' },
            { href: '/astrology-houses', title: 'The houses', sub: 'The twelve areas of life.' },
            { href: '/astrology-aspects', title: 'The aspects', sub: 'How planets talk to each other.' },
          ]} />
        </div></main>
      ) : (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">Interpretation library</h1>
        <p className="text-slate-500 mb-10 max-w-2xl">
          Explore the meaning of any placement in a birth chart. Select a planet, sign, and house to see a detailed interpretation... or browse the reference pages below.
        </p>

        <section className="mb-12">
          <InterpretationLookup />
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Browse by Planet</h2>
          <p className="text-slate-500 text-sm mb-6">
            Each planet page lists all 24 interpretations... 12 signs and 12 houses.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {PLANET_KEYS.map(key => {
              const planet = PLANETS[key]
              if (!planet) return null
              return (
                <Link
                  key={key}
                  href={`/astrology-interpretations/${PLANET_SLUGS[key]}`}
                  className="card hover:border-slate-400 transition-colors group text-center py-5"
                >
                  <span className="text-2xl block mb-1">{planet.symbol}</span>
                  <p className="font-medium text-sm group-hover:text-slate-600 transition-colors">{planet.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">24 interpretations</p>
                </Link>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6">Browse by Category</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/zodiac-signs" className="card hover:border-slate-400 transition-colors text-center py-8">
              <span className="text-3xl block mb-3">{'♈'} {'♉'} {'♊'}</span>
              <p className="font-semibold text-lg">Zodiac signs</p>
              <p className="text-slate-500 text-sm mt-1">All 12 signs</p>
            </Link>
            <Link href="/astrology-planets" className="card hover:border-slate-400 transition-colors text-center py-8">
              <span className="text-3xl block mb-3">{'☉'} {'☽'} {'♂'}</span>
              <p className="font-semibold text-lg">Planets</p>
              <p className="text-slate-500 text-sm mt-1">12 celestial bodies</p>
            </Link>
            <Link href="/astrology-houses" className="card hover:border-slate-400 transition-colors text-center py-8">
              <span className="text-3xl block mb-3">H1 H7 H10</span>
              <p className="font-semibold text-lg">Houses</p>
              <p className="text-slate-500 text-sm mt-1">12 life domains</p>
            </Link>
            <Link href="/astrology-aspects" className="card hover:border-slate-400 transition-colors text-center py-8">
              <span className="text-3xl block mb-3">{'☌'} {'□'} {'△'}</span>
              <p className="font-semibold text-lg">Aspects</p>
              <p className="text-slate-500 text-sm mt-1">5 major aspects</p>
            </Link>
          </div>
        </section>
      </main>
      )}
    </>
  )
}
