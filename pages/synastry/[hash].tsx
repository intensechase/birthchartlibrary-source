import Head from 'next/head'
import Link from 'next/link'
import type { GetServerSideProps } from 'next'
import { queryOne } from '@/lib/db'
import { ASPECT_SYMBOLS } from '@/lib/swisseph/synastry'
import { PlanetGlyph } from '@/components/Glyph'
import type { SynastryAspect } from '@/lib/swisseph/synastry'
import type { BirthChartData } from '@/lib/swisseph/calculate'

interface Person {
  name: string
  birthDate: string
  birthCity: string
}

interface Reading {
  hash: string
  personA: Person
  personB: Person
  chartA: BirthChartData
  chartB: BirthChartData
  aspects: SynastryAspect[]
  score: { label: string; score: number }
  relationshipType: string
  createdAt: string
}

function AspectRow({ aspect }: { aspect: SynastryAspect }) {
  const sym = ASPECT_SYMBOLS[aspect.aspectType]
  const harmColor = aspect.isHarmonic ? 'text-emerald-600' : 'text-rose-500'

  return (
    <div className="border border-slate-100 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <PlanetGlyph planet={aspect.planet1} decorative className="font-mono text-base text-slate-700" />
        <span className="text-xs text-slate-400 capitalize">{aspect.planet1.toLowerCase()}</span>
        <span className={`text-lg font-bold ${harmColor}`}>{sym}</span>
        <span className="text-xs text-slate-400 capitalize">{aspect.aspectType}</span>
        <PlanetGlyph planet={aspect.planet2} decorative className="font-mono text-base text-slate-700" />
        <span className="text-xs text-slate-400 capitalize">{aspect.planet2.toLowerCase()}</span>
        <span className="ml-auto text-xs text-slate-400">{aspect.orb}° orb</span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{aspect.interpretation}</p>
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

export default function SynastryReadingPage({ reading }: { reading: Reading }) {
  const harmonious = reading.aspects.filter(a => a.isHarmonic)
  const tense = reading.aspects.filter(a => !a.isHarmonic)
  const nameA = reading.personA.name || 'Person A'
  const nameB = reading.personB.name || 'Person B'

  const title = `${nameA} & ${nameB} Synastry Reading`

  return (
    <>
      <Head>
        <title>{`${title} — Birth Chart Library`}</title>
        <meta name="description" content={`Synastry compatibility reading between ${nameA} and ${nameB}. ${reading.score.label} — ${harmonious.length} harmonious aspects, ${tense.length} growth edges.`} />
        <meta name="robots" content="noindex" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={`${reading.score.label} · ${harmonious.length} harmonious · ${tense.length} tense · ${reading.relationshipType}`} />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Link href="/calculators/synastry" className="text-sm text-slate-400 hover:text-slate-600">
            ← Synastry Calculator
          </Link>
        </div>

        <h1 className="font-display text-3xl tracking-wide mb-1">{nameA} &amp; {nameB}</h1>
        <p className="text-slate-400 text-sm mb-8 capitalize">{reading.relationshipType} compatibility reading</p>

        <div className="space-y-8">
          {/* Summary */}
          <div className="card p-6 text-center">
            <div className="flex items-center justify-center gap-6 mb-4">
              <SunMoonLine chart={reading.chartA} name={nameA} />
              <span className="text-2xl text-slate-300">♥</span>
              <SunMoonLine chart={reading.chartB} name={nameB} />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-sm">
              <span className="font-semibold text-slate-800">{reading.score.label}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">{harmonious.length} harmonious · {tense.length} tense</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 capitalize">{reading.relationshipType}</span>
            </div>

            {(() => {
              const sunA = reading.chartA.planets.find(p => p.planet === 'SUN')
              const sunB = reading.chartB.planets.find(p => p.planet === 'SUN')
              if (!sunA || !sunB) return null
              const s1 = sunA.sign.toLowerCase()
              const s2 = sunB.sign.toLowerCase()
              const slug = s1 <= s2 ? `${s1}-and-${s2}` : `${s2}-and-${s1}`
              return (
                <p className="text-xs text-slate-400 mt-3">
                  See the <Link href={`/compatibility/${slug}`} className="underline hover:text-slate-600">{sunA.sign} & {sunB.sign} compatibility guide</Link>
                </p>
              )
            })()}
          </div>

          {/* Harmonious aspects */}
          {harmonious.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <span className="text-emerald-500">△</span> Harmonious Aspects
              </h2>
              <div className="space-y-3">
                {harmonious.map((a, i) => <AspectRow key={i} aspect={a} />)}
              </div>
            </div>
          )}

          {/* Tense aspects */}
          {tense.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <span className="text-rose-400">□</span> Growth Edges
              </h2>
              <p className="text-xs text-slate-400 mb-3">Tense aspects aren&apos;t &ldquo;bad&rdquo; — they create the friction that drives growth and keeps relationships dynamic.</p>
              <div className="space-y-3">
                {tense.map((a, i) => <AspectRow key={i} aspect={a} />)}
              </div>
            </div>
          )}

          {reading.aspects.length === 0 && (
            <div className="card p-6 text-center text-slate-500">
              No major aspects found between these charts.
            </div>
          )}

          {/* CTA */}
          <div className="border-t border-slate-200 pt-8 text-center">
            <p className="text-sm text-slate-500 mb-3">Run your own synastry reading — free, no account needed.</p>
            <Link href="/calculators/synastry" className="btn-primary text-sm">
              Open Synastry Calculator
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const hash = params?.hash as string
  if (!hash || !/^[a-f0-9]{12}$/.test(hash)) return { notFound: true }

  const row = await queryOne<{
    hash: string
    person_a: Person
    person_b: Person
    chart_a: BirthChartData
    chart_b: BirthChartData
    aspects: SynastryAspect[]
    score: { label: string; score: number }
    relationship_type: string
    created_at: string
  }>(
    `SELECT hash, person_a, person_b, chart_a, chart_b, aspects, score, relationship_type, created_at
     FROM synastry_readings WHERE hash = $1`,
    [hash]
  )

  if (!row) return { notFound: true }

  return {
    props: {
      reading: {
        hash: row.hash,
        personA: row.person_a,
        personB: row.person_b,
        chartA: row.chart_a,
        chartB: row.chart_b,
        aspects: row.aspects,
        score: row.score,
        relationshipType: row.relationship_type,
        createdAt: row.created_at,
      },
    },
  }
}
