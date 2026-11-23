import Link from 'next/link'
import Head from 'next/head'
import { PLANETS } from '@/lib/interpretations'
import { PLANET_KEYS } from '@/lib/constants'
import { redesignOn } from '@/lib/redesign'
import { Disc } from '@/components/redesign/Disc'
import { LearnHero, NextLinks } from '@/components/redesign/Learn'
import { BODY_ICON, BODY_KEYS, DISC } from '@/lib/redesign/astro'

export default function AstrologyPlanetsPage() {
  return (
    <>
      <Head>
        <title>Astrology Planets — What Each Planet Means | Birth Chart Library</title>
        <meta name="description" content="Explore the 12 celestial bodies in birth chart astrology — from the Sun and Moon to Pluto and Chiron. What each planet governs and shapes in your chart." />
      </Head>
      {redesignOn('hubs') ? (
        <main className="rdp"><div className="lrn">
          <LearnHero kicker="Learn" title="The planets">
            <p>Each planet stands for one part of a person, from identity and feeling to drive and change. Knowing what each one governs is the start of reading a chart.</p>
          </LearnHero>
          <ul className="popgrid">
            {PLANET_KEYS.map(key => {
              const planet = PLANETS[key]
              if (!planet) return null
              return (
                <li key={key}>
                  <Link href={`/astrology-planets/${key.toLowerCase()}`}>
                    <Disc disc={{ color: DISC[key] ?? DISC.RISING, icon: BODY_ICON[key] }} size={44} iconSize={24} />
                    <span><b>{planet.name}</b><small>{BODY_KEYS[key]}</small></span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <NextLinks links={[
            { href: '/zodiac-signs', title: 'The signs', sub: 'How each sign colors a planet.' },
            { href: '/astrology-houses', title: 'The houses', sub: 'Where in life each planet plays out.' },
            { href: '/astrology-aspects', title: 'The aspects', sub: 'How planets talk to each other.' },
            { href: '/birth-chart?ref=planets-index', title: 'Your free birth chart', sub: 'Where your planets were when you were born.' },
          ]} />
        </div></main>
      ) : (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-2">Astrology planets</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-2xl">
        In astrology, each planet represents a fundamental dimension of human experience. Understanding what each planet governs is essential to reading any birth chart.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {PLANET_KEYS.map(key => {
          const planet = PLANETS[key]
          if (!planet) return null
          return (
            <Link
              key={key}
              href={`/astrology-planets/${key.toLowerCase()}`}
              className="card hover:border-slate-400 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{planet.symbol}</span>
                <p className="font-semibold text-lg group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{planet.name}</p>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">{planet.description}</p>
            </Link>
          )
        })}
      </div>
    </main>
      )}
    </>
  )
}
