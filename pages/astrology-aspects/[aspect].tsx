import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import { ASPECTS, ASPECT_ORDER } from '@/lib/interpretations/aspects'
import { breadcrumbSchema, faqSchema, jsonLd } from '@/lib/schema'
import { redesignOn } from '@/lib/redesign'
import { DISC } from '@/lib/redesign/astro'
import type { IconName } from '@/lib/icons/paths'
import { Facts, Fold, LearnHero, NextLinks, PrevNext, Prose, RealCharts } from '@/components/redesign/Learn'

const NATURE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  harmonious: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' },
  challenging: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' },
  neutral: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-300' },
}

interface AspectPageProps {
  slug: string
  prevSlug: string | null
  prevName: string | null
  nextSlug: string | null
  nextName: string | null
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ASPECT_ORDER.map(slug => ({ params: { aspect: slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<AspectPageProps> = async (context) => {
  const slug = context.params?.aspect as string
  const info = ASPECTS[slug]
  if (!info) return { notFound: true }

  const idx = ASPECT_ORDER.indexOf(slug as typeof ASPECT_ORDER[number])
  const prev = idx > 0 ? ASPECT_ORDER[idx - 1] : null
  const next = idx < ASPECT_ORDER.length - 1 ? ASPECT_ORDER[idx + 1] : null

  return {
    props: {
      slug,
      prevSlug: prev ?? null,
      prevName: prev ? ASPECTS[prev].name : null,
      nextSlug: next ?? null,
      nextName: next ? ASPECTS[next].name : null,
    },
    revalidate: 604800,
  }
}

export default function AspectDetailPage({ slug, prevSlug, prevName, nextSlug, nextName }: AspectPageProps) {
  const info = ASPECTS[slug]
  if (!info) return null

  const colors = NATURE_COLORS[info.nature]
  const title = `${info.name} in Astrology — Meaning, Interpretation & Planet Pairs`
  const description = `What does a ${info.name.toLowerCase()} mean in your birth chart? Learn about the ${info.degree}° aspect, how it shapes your personality, and what it means for specific planet combinations.`

  const descParagraphs = info.description.split('\n\n').filter(p => p.trim())
  const aspectFaqs = [
    {
      question: `What does a ${info.name.toLowerCase()} mean in astrology?`,
      answer: descParagraphs[0]?.trim().slice(0, 450) ?? description,
    },
    {
      question: `Is a ${info.name.toLowerCase()} good or bad in a birth chart?`,
      answer: `A ${info.name.toLowerCase()} is considered ${info.nature}. ${info.inYourChart.slice(0, 380).trim()}`,
    },
  ]

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
        { name: 'Home', url: 'https://birthchartlibrary.com' },
        { name: 'Aspects', url: 'https://birthchartlibrary.com/astrology-aspects' },
        { name: info.name, url: `https://birthchartlibrary.com/astrology-aspects/${slug}` },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(aspectFaqs)) }} />
      {redesignOn('hubs') ? (
        <main className="rdp"><div className="lrn">
          <LearnHero crumbs={[{ label: 'Aspects', href: '/astrology-aspects' }, { label: info.name }]} disc={{ color: DISC.RISING, icon: slug as IconName }} kicker="Astrology aspect" title={info.name}>
            <p>Two planets {info.degree}&deg; apart. A {info.nature} aspect, known for {info.keywords.slice(0, 2).join(' and ').toLowerCase()}.</p>
          </LearnHero>

          <Facts items={[
            { label: 'Angle', value: `${info.degree}\u00b0` },
            { label: 'Orb', value: `Up to ${info.orb}\u00b0` },
            { label: 'Nature', value: info.nature.charAt(0).toUpperCase() + info.nature.slice(1) },
            { label: 'Known for', value: info.keywords.slice(2, 4).join(', ') },
          ]} />

          <Prose title={`What a ${info.name.toLowerCase()} means`} text={info.description} />
          <RealCharts path={`/astrology-aspects/${slug}`} />
          <Prose title="In your chart" text={info.inYourChart} />
          <Prose title="Working with it" text={info.workingWithIt} />

          <section className="lsec">
            <h2>Planet pairs</h2>
            <p className="lede">How the {info.name.toLowerCase()} plays out between particular planets. Open one to read it.</p>
            {info.planetPairs.map(pair => (
              <Fold key={pair.planets} title={pair.planets.replace('\u2013', ' and ')}>
                {pair.interpretation.split(/\n\s*\n/).map((t, i) => <p key={i}>{t.trim()}</p>)}
              </Fold>
            ))}
          </section>

          <NextLinks links={[
            { href: '/birth-chart?ref=aspect-page', title: 'Your free birth chart', sub: `See every ${info.name.toLowerCase()} in your own chart.` },
            { href: '/calculators/synastry', title: 'Compare two charts', sub: 'The aspects between one chart and another.' },
            { href: '/astrology-planets', title: 'The planets', sub: 'What each planet brings to an aspect.' },
            { href: '/astrology-interpretations', title: 'Interpretation library', sub: 'Every planet in every sign and house.' },
          ]} />

          <PrevNext prev={prevSlug && prevName ? { href: `/astrology-aspects/${prevSlug}`, label: prevName } : null} next={nextSlug && nextName ? { href: `/astrology-aspects/${nextSlug}`, label: nextName } : null} />
        </div></main>
      ) : (
      <main className="max-w-3xl mx-auto px-4 py-12">

      {/* Breadcrumb */}
      <AdminBreadcrumb crumbs={[
        { label: 'Aspects', href: '/astrology-aspects' },
        { label: info.name },
      ]} />

      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <span className="text-5xl">{info.symbol}</span>
        <div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide">{info.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-slate-400">{info.degree}° · orb ±{info.orb}°</span>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${colors.bg} ${colors.text}`}>
              {info.nature}
            </span>
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap gap-2 mb-6 mt-4">
        {info.keywords.map(kw => (
          <span key={kw} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">{kw}</span>
        ))}
      </div>

      {/* Main description */}
      <div className="card mb-10">
        {info.description.split('\n\n').map((p, i) => (
          <p key={i} className="text-slate-700 leading-relaxed mb-4 last:mb-0">{p}</p>
        ))}
      </div>

      {/* In your chart */}
      <h2 className="text-xl font-semibold mb-4">The {info.name} in Your Chart</h2>
      <div className="card mb-10">
        <p className="text-slate-600 text-sm leading-relaxed">{info.inYourChart}</p>
      </div>

      {/* Working with it */}
      <h2 className="text-xl font-semibold mb-4">Working With the {info.name}</h2>
      <div className="card mb-10">
        <p className="text-slate-600 text-sm leading-relaxed">{info.workingWithIt}</p>
      </div>

      {/* Planet pairs */}
      <h2 className="text-xl font-semibold mb-4">Planet Pairs in {info.name}</h2>
      <p className="text-slate-500 text-sm mb-6">
        How the {info.name.toLowerCase()} plays out between specific planet combinations.
      </p>
      <div className="space-y-4 mb-10">
        {info.planetPairs.map((pair, i) => (
          <div key={i} className={`card border-l-4 ${colors.border}`}>
            <h3 className="font-medium mb-2 text-slate-800">{pair.planets} {info.name}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{pair.interpretation}</p>
          </div>
        ))}
      </div>

      {/* Related content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        <Link href="/astrology-planets" className="card hover:border-slate-400 transition-colors group">
          <p className="font-medium text-sm group-hover:text-slate-600">Planets</p>
          <p className="text-xs text-slate-400 mt-0.5">Learn what each planet governs</p>
        </Link>
        <Link href="/compatibility" className="card hover:border-slate-400 transition-colors group">
          <p className="font-medium text-sm group-hover:text-slate-600">Compatibility</p>
          <p className="text-xs text-slate-400 mt-0.5">Aspects drive sign compatibility</p>
        </Link>
        <Link href="/astrology-interpretations" className="card hover:border-slate-400 transition-colors group">
          <p className="font-medium text-sm group-hover:text-slate-600">Interpretation library</p>
          <p className="text-xs text-slate-400 mt-0.5">Every planet-sign-house combo</p>
        </Link>
        <Link href="/calculators/synastry" className="card hover:border-slate-400 transition-colors group">
          <p className="font-medium text-sm group-hover:text-slate-600">Synastry calculator</p>
          <p className="text-xs text-slate-400 mt-0.5">See these aspects between two real charts</p>
        </Link>
        <Link href="/love" className="card hover:border-slate-400 transition-colors group">
          <p className="font-medium text-sm group-hover:text-slate-600">Love &amp; Astrology</p>
          <p className="text-xs text-slate-400 mt-0.5">Celebrity couples and sign-in-love profiles</p>
        </Link>
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between pt-6 border-t border-slate-200">
        {prevSlug ? (
          <Link href={`/astrology-aspects/${prevSlug}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            &larr; {prevName}
          </Link>
        ) : <span />}
        {nextSlug ? (
          <Link href={`/astrology-aspects/${nextSlug}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            {nextName} &rarr;
          </Link>
        ) : <span />}
      </div>
    </main>
      )}
    </>
  )
}
