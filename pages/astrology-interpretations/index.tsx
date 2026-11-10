import Head from 'next/head'
import Link from 'next/link'
import { PLANETS } from '@/lib/interpretations'
import InterpretationLookup from '@/components/InterpretationLookup'
import { PLANET_KEYS, PLANET_SLUGS } from '@/lib/constants'

export default function InterpretationsPage() {
  return (
    <>
      <Head>
        <title>Astrology Interpretation Library — Planets, Signs & Houses</title>
        <meta name="description" content="Explore detailed interpretations for every planet-sign-house combination in astrology. Look up any placement and understand what it means." />
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">Interpretation Library</h1>
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
              <p className="font-semibold text-lg">Zodiac Signs</p>
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
    </>
  )
}
