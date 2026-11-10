import Head from 'next/head'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import fs from 'fs'
import path from 'path'
import { SIGN_ORDER, getElementCombo } from '@/lib/interpretations/compatibility-helpers'
import { SIGN_ELEMENTS, getElementColor } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'
import { breadcrumbSchema, jsonLd } from '@/lib/schema'
import { coupleNameToSlug } from '@/lib/couple-slugs'
import { getServedCelebritySlugs } from '@/lib/celebrities'

const FEATURED_ARTICLES = [
  { slug: 'zendaya-and-tom-holland', title: 'Zendaya & Tom Holland', subtitle: 'Virgo + Gemini — the Mercury connection', label: 'Couple Deep-Dive' },
  { slug: 'taylor-swift-and-travis-kelce', title: 'Taylor Swift & Travis Kelce', subtitle: 'Sagittarius + Scorpio — Fire meets Water', label: 'Couple Deep-Dive' },
  { slug: 'kim-kardashian-and-lewis-hamilton', title: 'Kim K & Lewis Hamilton', subtitle: 'Libra + Capricorn — two Cardinals, two empires', label: 'Couple Deep-Dive' },
  { slug: 'kendall-jenner-and-jacob-elordi', title: 'Kendall Jenner & Jacob Elordi', subtitle: 'Scorpio + Cancer — Water runs deep', label: 'Couple Deep-Dive' },
  { slug: 'ariana-grande-and-ethan-slater', title: 'Ariana Grande & Ethan Slater', subtitle: 'Cancer + Cancer — same-sign intensity', label: 'Couple Deep-Dive' },
  { slug: 'goldie-hawn-and-kurt-russell', title: 'Goldie Hawn & Kurt Russell', subtitle: 'Scorpio + Pisces — 40 years, no wedding', label: 'Couple Deep-Dive' },
  { slug: 'barack-and-michelle-obama', title: 'Barack & Michelle Obama', subtitle: 'Leo + Capricorn — what a square builds', label: 'Couple Deep-Dive' },
  { slug: 'beyonce-and-jay-z', title: 'Beyoncé & Jay-Z', subtitle: 'Virgo + Sagittarius — how they built an empire', label: 'Couple Deep-Dive' },
]

const GUIDE_ARTICLES = [
  { slug: 'moon-sign-compatibility', title: 'Moon Sign Compatibility', subtitle: 'The layer beneath Sun sign love' },
  { slug: 'red-flags-by-zodiac-sign', title: 'Red Flags by Zodiac Sign', subtitle: 'What each sign looks like in the shadow' },
]

const SIGN_LABELS: Record<string, string> = {
  Aries: 'The Passionate Pursuer', Taurus: 'The Devoted Builder',
  Gemini: 'The Curious Connector', Cancer: 'The Tender Nurturer',
  Leo: 'The Generous Heart', Virgo: 'The Devoted Craftsman',
  Libra: 'The Romantic Partner', Scorpio: 'The Intense Loyalist',
  Sagittarius: 'The Adventure Seeker', Capricorn: 'The Steady Commitment',
  Aquarius: 'The Independent Spirit', Pisces: 'The Empathic Dreamer',
}

interface Couple {
  name1: string; sign1: string; name2: string; sign2: string
  notes: string; compareSlug: string; score: number
}

interface Props { featuredCouples: Couple[] }

function scoreLabel(s: number) {
  return s >= 80 ? 'Excellent' : s >= 70 ? 'High' : s >= 55 ? 'Good' : s >= 45 ? 'Moderate' : 'Challenging'
}

function scoreColor(s: number) {
  return s >= 70 ? 'text-emerald-600' : s >= 50 ? 'text-amber-600' : 'text-rose-500'
}

const toSlug = coupleNameToSlug

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { ELEMENT_COMPAT } = await import('@/lib/interpretations/compatibility')
  const lines = fs.readFileSync(path.join(process.cwd(), 'data', 'celebrity-couples.csv'), 'utf-8').trim().split('\n').slice(1)
  const served = await getServedCelebritySlugs()
  const featuredCouples: Couple[] = lines
    .map(line => {
      const [name1, sign1, name2, sign2, status, ...rest] = line.split(',')
      if (!name1 || !sign1 || !name2 || !sign2 || status?.trim() !== 'current') return null
      const el1 = SIGN_ELEMENTS[sign1.trim()] || 'Fire'
      const el2 = SIGN_ELEMENTS[sign2.trim()] || 'Fire'
      const score = ELEMENT_COMPAT[getElementCombo(el1, el2)]?.score ?? 50
      return { name1: name1.trim(), sign1: sign1.trim(), name2: name2.trim(), sign2: sign2.trim(), notes: rest.join(',').trim(), compareSlug: `${toSlug(name1.trim())}-vs-${toSlug(name2.trim())}`, score }
    })
    .filter((c): c is Couple => c !== null)
    // Compare pages exist only when both people have a page (docs/TEMPLATE-CELEB-REMOVAL-PLAN.md).
    .filter(c => { const [a, b] = c.compareSlug.split('-vs-'); return served.has(a) && served.has(b) })
    .slice(0, 10)
  return { props: { featuredCouples }, revalidate: 2592000 }
}

export default function LoveIndex({ featuredCouples }: Props) {
  return (
    <>
      <Head>
        <title>Love &amp; Astrology — Zodiac Relationships &amp; Celebrity Couples | Birth Chart Library</title>
        <meta name="description" content="What astrology reveals about love and relationships. Celebrity couple deep-dives, sign-by-sign love profiles, and compatibility guides for every pairing." />
        <link rel="canonical" href="https://birthchartlibrary.com/love" />
        <meta property="og:title" content="Love & Astrology — Birth Chart Library" />
        <meta property="og:description" content="Celebrity couple breakdowns, sign-in-love profiles, and guides to zodiac compatibility." />
        <meta property="og:url" content="https://birthchartlibrary.com/love" />
        <meta property="og:image" content="https://birthchartlibrary.com/api/og/topic?title=Love+%26+Astrology&subtitle=Celebrity+Couples+%2B+Compatibility+Guides&symbol=%E2%99%A5&label=Birth+Chart+Library" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
        { name: 'Home', url: 'https://birthchartlibrary.com' },
        { name: 'Love & Astrology', url: 'https://birthchartlibrary.com/love' },
      ])) }} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-14">
          <p className="text-5xl mb-4">♥</p>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide text-slate-800 dark:text-slate-100 mb-4">Love &amp; Astrology</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
            Celebrity couple deep-dives, sign-by-sign love profiles, and everything astrology reveals about how we connect, clash, and commit.
          </p>
        </div>

        {/* Celebrity couple articles */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl tracking-wide text-slate-800 dark:text-slate-100">Celebrity Couple Deep-Dives</h2>
            <Link href="/love/celebrity-couples" className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Browse all 101 →</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURED_ARTICLES.map(a => (
              <Link key={a.slug} href={`/love/${a.slug}`} className="card hover:border-slate-400 dark:hover:border-slate-500 transition-colors group block">
                <p className="text-xs px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 inline-block mb-3">{a.label}</p>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors mb-1">{a.title}</h3>
                <p className="text-sm text-slate-400">{a.subtitle}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Sign in Love grid */}
        <section className="mb-14">
          <h2 className="font-display text-2xl tracking-wide text-slate-800 dark:text-slate-100 mb-6">Your Sign in Love</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {SIGN_ORDER.map(sign => {
              const ec = getElementColor(sign)
              return (
                <Link
                  key={sign}
                  href={`/love/${sign.toLowerCase()}-in-love`}
                  className="card hover:border-slate-400 dark:hover:border-slate-500 transition-colors group flex items-center gap-3"
                >
                  <SignGlyph sign={sign} decorative className="text-2xl flex-shrink-0 text-slate-900 dark:text-white" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{sign}</p>
                    <p className="text-xs text-slate-400 truncate">{SIGN_LABELS[sign]}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Guides */}
        <section className="mb-14">
          <h2 className="font-display text-2xl tracking-wide text-slate-800 dark:text-slate-100 mb-6">Relationship Guides</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {GUIDE_ARTICLES.map(a => (
              <Link key={a.slug} href={`/love/${a.slug}`} className="card hover:border-slate-400 dark:hover:border-slate-500 transition-colors group block">
                <p className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 inline-block mb-3">Guide</p>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors mb-1">{a.title}</h3>
                <p className="text-sm text-slate-400">{a.subtitle}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Live couples from CSV */}
        {featuredCouples.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl tracking-wide text-slate-800 dark:text-slate-100">Current Power Couples</h2>
              <Link href="/love/celebrity-couples" className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">See all →</Link>
            </div>
            <div className="space-y-2">
              {featuredCouples.map((c, i) => {
                const ec1 = getElementColor(c.sign1)
                const ec2 = getElementColor(c.sign2)
                return (
                  <Link key={i} href={`/celebrity-birth-charts/compare/${c.compareSlug}`} className="card flex items-center gap-4 hover:border-slate-400 dark:hover:border-slate-500 transition-colors group p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className="font-medium text-sm text-slate-800 dark:text-slate-100">{c.name1}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${ec1.bg} ${ec1.text}`}><SignGlyph sign={c.sign1} decorative /> {c.sign1}</span>
                        <span className="text-slate-300 dark:text-slate-600 text-xs">&amp;</span>
                        <span className="font-medium text-sm text-slate-800 dark:text-slate-100">{c.name2}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${ec2.bg} ${ec2.text}`}><SignGlyph sign={c.sign2} decorative /> {c.sign2}</span>
                      </div>
                      {c.notes && <p className="text-xs text-slate-400 truncate">{c.notes}</p>}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className={`text-sm font-semibold ${scoreColor(c.score)}`}>{scoreLabel(c.score)}</p>
                      <p className="text-xs text-slate-400">compatibility</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        <div className="card text-center">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Go deeper than Sun signs</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-sm mx-auto">A full synastry reading compares every planet in both charts — Moon, Venus, Mars, and more. Sun signs are the start of the story, not the whole thing.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/calculators/synastry" className="btn-primary text-sm px-6 py-2.5">Run a Synastry Reading</Link>
            <Link href="/compatibility" className="btn-outline text-sm px-6 py-2.5">Compatibility Guide</Link>
          </div>
        </div>
      </main>
    </>
  )
}
