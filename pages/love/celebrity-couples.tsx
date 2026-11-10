import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { GetStaticProps } from 'next'
import { useState } from 'react'
import fs from 'fs'
import path from 'path'
import { query } from '@/lib/db'
import { getElementCombo } from '@/lib/interpretations/compatibility-helpers'
import { SIGN_ELEMENTS, getElementColor } from '@/lib/zodiac-colors'
import { breadcrumbSchema, jsonLd } from '@/lib/schema'
import { SignGlyph } from '@/components/Glyph'
import { coupleNameToSlug, COUPLE_LOVE_ARTICLES } from '@/lib/couple-slugs'
import { getServedCelebritySlugs } from '@/lib/celebrities'


interface Couple {
  name1: string; sign1: string; slug1: string; image1: string | null
  name2: string; sign2: string; slug2: string; image2: string | null
  status: string; notes: string
  compareSlug: string; loveSlug: string | null
  score: number; scoreLabel: string
  element1: string; element2: string
}

interface Props { current: Couple[]; past: Couple[] }


function sl(s: number) {
  return s >= 80 ? 'Excellent' : s >= 70 ? 'High' : s >= 55 ? 'Good' : s >= 45 ? 'Moderate' : 'Challenging'
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { ELEMENT_COMPAT } = await import('@/lib/interpretations/compatibility')
  const lines = fs.readFileSync(path.join(process.cwd(), 'data', 'celebrity-couples.csv'), 'utf-8').trim().split('\n').slice(1)

  // Fetch slugs that have images — uses /api/img/[slug] S3 proxy
  const rows = await query<{ slug: string }>(
    'SELECT slug FROM celebrities WHERE image_url IS NOT NULL'
  ).catch(() => [] as { slug: string }[])
  const imageSet = new Set(rows.map(r => r.slug))

  function parse(line: string): Couple | null {
    const [name1, sign1, name2, sign2, status, ...rest] = line.split(',')
    if (!name1?.trim() || !sign1?.trim() || !name2?.trim() || !sign2?.trim()) return null
    const el1 = SIGN_ELEMENTS[sign1.trim()] || 'Fire'
    const el2 = SIGN_ELEMENTS[sign2.trim()] || 'Fire'
    const score = ELEMENT_COMPAT[getElementCombo(el1, el2)]?.score ?? 50
    const s1 = coupleNameToSlug(name1)
    const s2 = coupleNameToSlug(name2)
    const cSlug = `${s1}-vs-${s2}`
    return {
      name1: name1.trim(), sign1: sign1.trim(), slug1: s1, image1: imageSet.has(s1) ? `/api/img/${s1}` : null,
      name2: name2.trim(), sign2: sign2.trim(), slug2: s2, image2: imageSet.has(s2) ? `/api/img/${s2}` : null,
      status: status?.trim() ?? '', notes: rest.join(',').trim(),
      compareSlug: cSlug, loveSlug: COUPLE_LOVE_ARTICLES[cSlug] ?? null,
      score, scoreLabel: sl(score),
      element1: el1, element2: el2,
    }
  }

  // A couple is shown if it has a /love article, or both people have a page for the
  // compare link (docs/TEMPLATE-CELEB-REMOVAL-PLAN.md).
  const served = await getServedCelebritySlugs()
  const all = lines.map(parse).filter((c): c is Couple => c !== null)
    .filter(c => !!c.loveSlug || (served.has(c.slug1) && served.has(c.slug2)))
  return {
    props: { current: all.filter(c => c.status === 'current'), past: all.filter(c => c.status === 'past') },
    revalidate: 2592000,
  }
}

function Avatar({ name, image, sign }: { name: string; image: string | null; sign: string }) {
  const ec = getElementColor(sign)
  if (image) {
    return (
      <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white dark:ring-slate-800 flex-shrink-0">
        <Image src={image} alt={name} fill className="object-cover" sizes="48px" unoptimized loading="lazy" />
      </div>
    )
  }
  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ring-2 ring-white dark:ring-slate-800 flex-shrink-0 ${ec.bg} ${ec.text}`}>
      {name.split(' ').map(w => w[0]).slice(0, 2).join('')}
    </div>
  )
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-emerald-400' : score >= 50 ? 'bg-amber-400' : 'bg-rose-400'
  return (
    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1 mt-1">
      <div className={`${color} h-1 rounded-full`} style={{ width: `${score}%` }} />
    </div>
  )
}

function CoupleCard({ c }: { c: Couple }) {
  const ec1 = getElementColor(c.sign1)
  const ec2 = getElementColor(c.sign2)
  const href = c.loveSlug ? `/love/${c.loveSlug}` : `/celebrity-birth-charts/compare/${c.compareSlug}`

  return (
    <Link href={href} className="card group hover:border-slate-300 dark:hover:border-slate-600 transition-colors flex flex-col gap-3">
      {/* Avatars + names row */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Avatar name={c.name1} image={c.image1} sign={c.sign1} />
          <div className="min-w-0">
            <p className="font-medium text-sm text-slate-800 dark:text-slate-100 leading-tight truncate group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{c.name1}</p>
            <span className={`inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full ${ec1.bg} ${ec1.text}`}><SignGlyph sign={c.sign1} decorative /> {c.sign1}</span>
          </div>
        </div>

        <div className="flex-shrink-0 text-center">
          <span className="text-slate-300 dark:text-slate-600 text-lg leading-none">♥</span>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0 flex-row-reverse">
          <Avatar name={c.name2} image={c.image2} sign={c.sign2} />
          <div className="min-w-0 text-right">
            <p className="font-medium text-sm text-slate-800 dark:text-slate-100 leading-tight truncate group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{c.name2}</p>
            <span className={`inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full ${ec2.bg} ${ec2.text}`}><SignGlyph sign={c.sign2} decorative /> {c.sign2}</span>
          </div>
        </div>
      </div>

      {/* Score */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">{c.element1} + {c.element2}</span>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{c.scoreLabel} · {c.score}%</span>
        </div>
        <ScoreBar score={c.score} />
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between pt-0.5">
        <span className="text-xs text-slate-400 truncate">{c.notes}</span>
        <span className="text-xs text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex-shrink-0 ml-2">
          {c.loveSlug ? 'Read article →' : 'Compare charts →'}
        </span>
      </div>
    </Link>
  )
}

const ELEMENTS = ['All', 'Fire', 'Earth', 'Air', 'Water'] as const
type ElementFilter = typeof ELEMENTS[number]

export default function CelebrityCouplesPage({ current, past }: Props) {
  const [tab, setTab] = useState<'current' | 'past'>('current')
  const [elFilter, setElFilter] = useState<ElementFilter>('All')
  const couples = tab === 'current' ? current : past

  const filtered = elFilter === 'All'
    ? couples
    : couples.filter(c => c.element1 === elFilter || c.element2 === elFilter)

  const articleCount = couples.filter(c => c.loveSlug).length

  return (
    <>
      <Head>
        <title>Celebrity Couples Astrology — Zodiac Compatibility Ratings | Birth Chart Library</title>
        <meta name="description" content={`Browse ${current.length + past.length} celebrity couples with their zodiac sign compatibility scores and in-depth astrological analysis. See how real power couples align — by element, aspect, and synastry.`} />
        <link rel="canonical" href="https://birthchartlibrary.com/love/celebrity-couples" />
        <meta property="og:title" content="Celebrity Couples Astrology" />
        <meta property="og:description" content={`${current.length + past.length} celebrity couples with compatibility scores, element breakdowns, and in-depth astrological analysis.`} />
        <meta property="og:url" content="https://birthchartlibrary.com/love/celebrity-couples" />
        <meta property="og:image" content="https://birthchartlibrary.com/api/og/topic?title=Celebrity+Couples&subtitle=Zodiac+Compatibility+Ratings&symbol=%E2%99%A5&label=Birth+Chart+Library" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
        { name: 'Home', url: 'https://birthchartlibrary.com' },
        { name: 'Love & Astrology', url: 'https://birthchartlibrary.com/love' },
        { name: 'Celebrity Couples', url: 'https://birthchartlibrary.com/love/celebrity-couples' },
      ])) }} />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <nav className="text-sm text-slate-400 mb-8">
          <Link href="/love" className="hover:text-slate-600 dark:hover:text-slate-300">Love &amp; Astrology</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-600 dark:text-slate-300">Celebrity Couples</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl tracking-wide text-slate-800 dark:text-slate-100 mb-3">Celebrity Couples</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {current.length + past.length} couples with element compatibility scores. {articleCount} have full astrological deep-dives — click any couple to read the analysis or compare birth charts.
          </p>
        </div>

        {/* Tab + filter row */}
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          <div className="flex gap-2">
            {(['current', 'past'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                  tab === t
                    ? 'bg-slate-800 dark:bg-slate-600 text-white border-slate-800 dark:border-slate-600'
                    : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                {t === 'current' ? `Current (${current.length})` : `Past (${past.length})`}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 ml-auto flex-wrap">
            {ELEMENTS.map(el => (
              <button
                key={el}
                onClick={() => setElFilter(el)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  elFilter === el
                    ? 'bg-slate-700 dark:bg-slate-600 text-white border-slate-700'
                    : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                {el === 'All' ? 'All elements' : el}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
          {filtered.length} couple{filtered.length !== 1 ? 's' : ''} · {filtered.filter(c => c.loveSlug).length} with articles
          <span className="ml-4 inline-flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" /> High ≥70%
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 ml-2" /> Moderate
            <span className="inline-block w-2 h-2 rounded-full bg-rose-400 ml-2" /> Challenging
          </span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((c, i) => <CoupleCard key={i} c={c} />)}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-400 py-16">No couples match that filter.</p>
        )}

        <div className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Element compatibility is the starting point. A full synastry reading compares every planet in both charts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/calculators/synastry" className="btn-primary text-sm px-6 py-2.5">Run Your Own Synastry Reading</Link>
            <Link href="/love" className="btn-outline text-sm px-6 py-2.5">← Love &amp; Astrology</Link>
          </div>
        </div>
      </main>
    </>
  )
}
