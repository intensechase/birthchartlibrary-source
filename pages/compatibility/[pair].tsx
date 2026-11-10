import Head from 'next/head'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import { GetStaticPaths, GetStaticProps } from 'next'
import fs from 'fs'
import path from 'path'
import { SIGN_ORDER, getPairSlug, getElementCombo, getModalityCombo } from '@/lib/interpretations/compatibility-helpers'
import type { PairData } from '@/lib/interpretations/compatibility'
import { SIGNS } from '@/lib/interpretations/signs'

type ElementData = { nature: string; score: number; description: string; communication: string; loveStyle: string }
type ModalityData = { dynamic: string; tension: string }
import { getElementColor, SIGN_SYMBOLS } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'
import { breadcrumbSchema, faqSchema, jsonLd } from '@/lib/schema'
import { coupleNameToSlug } from '@/lib/couple-slugs'
import { getServedCelebritySlugs } from '@/lib/celebrities'

// ─── Shared ───────────────────────────────────────────────────────────────────

const toSlug = coupleNameToSlug

function scoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 70) return 'High'
  if (score >= 55) return 'Good'
  if (score >= 45) return 'Moderate'
  return 'Challenging'
}

// ─── Hub types ────────────────────────────────────────────────────────────────

const SIGN_IN_LOVE: Record<string, { brings: string; needs: string; tip: string }> = {
  Aries:       { brings: 'passion, directness, and the thrill of pursuit', needs: 'independence, excitement, and a partner who can hold their own', tip: 'Signs that can match Aries\' energy without being overwhelmed — or who offer the grounding they don\'t know they need — tend to go the distance.' },
  Taurus:      { brings: 'loyalty, sensuality, and a love that deepens with time', needs: 'stability, physical connection, and a partner who means what they say', tip: 'Taurus thrives with signs who appreciate consistency and build something real, not signs who mistake their steadiness for complacency.' },
  Gemini:      { brings: 'wit, adaptability, and a mind that never stops exploring', needs: 'intellectual stimulation, variety, and space to evolve', tip: 'The best matches for Gemini are signs who can keep up — or who offer a center of gravity Gemini actually wants to return to.' },
  Cancer:      { brings: 'deep emotional attunement, loyalty, and a love that feels like home', needs: 'security, emotional reciprocity, and a partner who shows up', tip: 'Cancer does best with signs who honor emotional depth — not those who call it "too much." The right match makes Cancer feel safe enough to stop protecting their heart.' },
  Leo:         { brings: 'warmth, generosity, and a love that makes their partner feel like the only person in the room', needs: 'genuine admiration, loyalty, and a partner who celebrates them', tip: 'Leo needs a partner who is secure enough to let them shine — and who shines in return. Insecurity triggers Leo\'s worst behavior; genuine appreciation brings out their best.' },
  Virgo:       { brings: 'devotion, attentiveness, and a love expressed through acts of care', needs: 'respect for their standards, emotional reliability, and space to be imperfect', tip: 'Virgo\'s best matches are those who see the love behind the criticism and offer the warmth that softens Virgo\'s tendency toward self-criticism.' },
  Libra:       { brings: 'charm, fairness, and a genuine commitment to making the relationship beautiful', needs: 'harmony, intellectual connection, and a partner who makes decisions with them', tip: 'Libra does best with signs who can hold the tension of a real disagreement without Libra having to disappear from conflict entirely.' },
  Scorpio:     { brings: 'intensity, unwavering loyalty, and a love that transforms both people', needs: 'trust, emotional honesty, and a partner who can handle real depth without flinching', tip: 'Scorpio\'s best matches are those who understand that the intensity is the love — not a red flag. Signs who run from depth will always disappoint Scorpio.' },
  Sagittarius: { brings: 'adventure, honesty, and a love that expands both people\'s world', needs: 'freedom, philosophical alignment, and a partner who is genuinely curious about life', tip: 'Sagittarius thrives with signs who want to grow together — not those who try to contain them. The right match is a fellow adventurer, not a warden.' },
  Capricorn:   { brings: 'commitment, stability, and a love that builds something real over time', needs: 'ambition, reliability, and a partner who respects what they\'re building', tip: 'Capricorn opens slowly but loves for keeps. The best matches are those patient enough to earn that trust — and grounded enough to meet Capricorn in their world.' },
  Aquarius:    { brings: 'originality, intellectual depth, and a love that never loses its sense of possibility', needs: 'freedom, mental connection, and a partner who sees them as an individual first', tip: 'Aquarius does best with signs who value ideas and independence — and who understand that emotional distance doesn\'t mean absence of love.' },
  Pisces:      { brings: 'empathy, romantic imagination, and a love that makes their partner feel truly seen', needs: 'gentleness, emotional safety, and a partner who grounds without controlling', tip: 'Pisces thrives with signs who can hold space for deep feeling without taking advantage of Pisces\' openness. The right match is a soft landing, not another wound.' },
}

interface HubCouple {
  name: string; slug: string; partner_name: string; partner_slug: string; status: string
}

interface PairingRow {
  partner: string; summary: string; score: number; scoreLabel: string; slug: string
}

// ─── Pair types ───────────────────────────────────────────────────────────────

interface CelebCouple {
  name1: string; slug1: string; sign1: string
  name2: string; slug2: string; sign2: string
  status: string; notes: string
}

function loadPairCouples(sign1: string, sign2: string, served: Set<string>): CelebCouple[] {
  const csvPath = path.join(process.cwd(), 'data', 'celebrity-couples.csv')
  const lines = fs.readFileSync(csvPath, 'utf-8').trim().split('\n').slice(1)
  return lines
    .map(line => {
      const [p1Name, p1Sign, p2Name, p2Sign, status, ...rest] = line.split(',')
      return { p1Name: p1Name.trim(), p1Sign: p1Sign.trim(), p2Name: p2Name.trim(), p2Sign: p2Sign.trim(), status: status.trim(), notes: rest.join(',').trim() }
    })
    .filter(({ p1Sign, p2Sign }) => (p1Sign === sign1 && p2Sign === sign2) || (p1Sign === sign2 && p2Sign === sign1))
    // Only couples where both people have a page (docs/TEMPLATE-CELEB-REMOVAL-PLAN.md).
    .filter(({ p1Name, p2Name }) => served.has(toSlug(p1Name)) && served.has(toSlug(p2Name)))
    .map(({ p1Name, p1Sign, p2Name, p2Sign, status, notes }) => ({
      name1: p1Name, slug1: toSlug(p1Name), sign1: p1Sign,
      name2: p2Name, slug2: toSlug(p2Name), sign2: p2Sign,
      status, notes,
    }))
}

function loadHubCouples(sign: string, served: Set<string>): HubCouple[] {
  const csvPath = path.join(process.cwd(), 'data', 'celebrity-couples.csv')
  const lines = fs.readFileSync(csvPath, 'utf-8').trim().split('\n').slice(1)
  return lines
    .map(line => {
      const [p1Name, p1Sign, p2Name, p2Sign, status] = line.split(',')
      return { p1Name: p1Name?.trim(), p1Sign: p1Sign?.trim(), p2Name: p2Name?.trim(), p2Sign: p2Sign?.trim(), status: status?.trim() }
    })
    .filter(({ p1Sign, p2Sign }) => p1Sign === sign || p2Sign === sign)
    .filter(({ p1Name, p2Name }) => !!p1Name && !!p2Name && served.has(toSlug(p1Name)) && served.has(toSlug(p2Name)))
    .slice(0, 6)
    .map(({ p1Name, p1Sign, p2Name, p2Sign, status }) => {
      const isP1 = p1Sign === sign
      return { name: isP1 ? p1Name : p2Name, slug: toSlug(isP1 ? p1Name : p2Name), partner_name: isP1 ? p2Name : p1Name, partner_slug: toSlug(isP1 ? p2Name : p1Name), status: status ?? '' }
    })
}

// ─── Combined props ────────────────────────────────────────────────────────────

type Props =
  | { mode: 'hub'; sign: string; pairings: PairingRow[]; hubCouples: HubCouple[]; topMatches: string[]; challengingMatches: string[] }
  | {
      mode: 'pair'
      sign1: string
      sign2: string
      slug: string
      isSame: boolean
      couples: CelebCouple[]
      pairKey: string
      pairData: PairData
      elemData: ElementData | null
      modData: ModalityData | null
    }

// ─── Static generation ────────────────────────────────────────────────────────

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { pair: string } }[] = []
  // Hub paths: /compatibility/scorpio
  SIGN_ORDER.forEach(s => paths.push({ params: { pair: s.toLowerCase() } }))
  // Pair paths: /compatibility/scorpio-and-libra
  for (let i = 0; i < SIGN_ORDER.length; i++) {
    for (let j = i; j < SIGN_ORDER.length; j++) {
      paths.push({ params: { pair: getPairSlug(SIGN_ORDER[i], SIGN_ORDER[j]) } })
    }
  }
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  // Dynamic import keeps the ~100KB raw / 31KB gzip compatibility data
  // out of any client chunk that webpack might otherwise group it into
  // (see TODO P8 / [[feedback-webpack-chunking]]).
  const { PAIRS, ELEMENT_COMPAT, MODALITY_COMPAT } = await import('@/lib/interpretations/compatibility')

  const pair = params?.pair as string

  // Hub route: single sign name
  const singleSign = SIGN_ORDER.find(s => s.toLowerCase() === pair)
  if (singleSign) {
    const signInfo = SIGNS[singleSign]
    if (!signInfo) return { notFound: true }

    const pairings: PairingRow[] = SIGN_ORDER.map(partner => {
      const i = SIGN_ORDER.indexOf(singleSign as typeof SIGN_ORDER[number])
      const j = SIGN_ORDER.indexOf(partner as typeof SIGN_ORDER[number])
      const key = i <= j ? `${singleSign}+${partner}` : `${partner}+${singleSign}`
      const pairData = PAIRS[key]
      const partnerInfo = SIGNS[partner]
      const elemCombo = getElementCombo(signInfo.element, partnerInfo?.element ?? 'Fire')
      const score = ELEMENT_COMPAT[elemCombo]?.score ?? 50
      return { partner, summary: pairData?.summary ?? '', score, scoreLabel: scoreLabel(score), slug: getPairSlug(singleSign, partner) }
    }).sort((a, b) => b.score - a.score)

    const topMatches = pairings.filter(p => p.score >= 70 && p.partner !== singleSign).slice(0, 4).map(p => p.partner)
    const challengingMatches = pairings.filter(p => p.score < 55 && p.partner !== singleSign).slice(-3).map(p => p.partner)
    const hubCouples = loadHubCouples(singleSign, await getServedCelebritySlugs())

    return { props: { mode: 'hub', sign: singleSign, pairings, hubCouples, topMatches, challengingMatches }, revalidate: 2592000 }
  }

  // Pair route: sign-and-sign
  const match = pair.match(/^([a-z]+)-and-([a-z]+)$/)
  if (!match) return { notFound: true }

  const sign1 = match[1].charAt(0).toUpperCase() + match[1].slice(1)
  const sign2 = match[2].charAt(0).toUpperCase() + match[2].slice(1)
  if (!SIGN_ORDER.includes(sign1 as typeof SIGN_ORDER[number]) || !SIGN_ORDER.includes(sign2 as typeof SIGN_ORDER[number])) return { notFound: true }

  const info1 = SIGNS[sign1]
  const info2 = SIGNS[sign2]
  if (!info1 || !info2) return { notFound: true }

  const pairKey = SIGN_ORDER.indexOf(sign1 as typeof SIGN_ORDER[number]) <= SIGN_ORDER.indexOf(sign2 as typeof SIGN_ORDER[number])
    ? `${sign1}+${sign2}` : `${sign2}+${sign1}`
  const pairData = PAIRS[pairKey]
  if (!pairData) return { notFound: true }

  const elemCombo = getElementCombo(info1.element, info2.element)
  const modCombo = getModalityCombo(info1.modality, info2.modality)

  return {
    props: {
      mode: 'pair',
      sign1,
      sign2,
      slug: pair,
      isSame: sign1 === sign2,
      couples: loadPairCouples(sign1, sign2, await getServedCelebritySlugs()),
      pairKey,
      pairData,
      elemData: ELEMENT_COMPAT[elemCombo] ?? null,
      modData: MODALITY_COMPAT[modCombo] ?? null,
    },
    revalidate: 604800,
  }
}

// ─── Hub view ─────────────────────────────────────────────────────────────────

function HubPage({ sign, pairings, hubCouples, topMatches, challengingMatches }: Extract<Props, { mode: 'hub' }>) {
  const signInfo = SIGNS[sign]!
  const ec = getElementColor(sign)
  const inLove = SIGN_IN_LOVE[sign]!
  const canonicalUrl = `https://birthchartlibrary.com/compatibility/${sign.toLowerCase()}`
  const title = `${sign} Compatibility — Best & Worst Matches for ${sign}`
  const description = `Who is ${sign} most compatible with? Explore all 12 zodiac pairings for ${sign} — love strengths, challenges, and famous ${sign} couples. Ranked by compatibility.`

  const faqs = [
    { question: `Who is ${sign} most compatible with?`, answer: `${sign}'s best matches are typically ${topMatches.join(', ')}. ${inLove.tip}` },
    { question: `Who is ${sign} least compatible with?`, answer: `${sign} tends to face the most friction with ${challengingMatches.join(', ')}, though every pairing has growth potential with self-awareness and communication.` },
    { question: `What does ${sign} need in a relationship?`, answer: `${sign} needs ${inLove.needs}. They bring ${inLove.brings} to any partnership.` },
    { question: `Is ${sign} compatible with ${sign}?`, answer: `Two ${sign}s understand each other deeply and share the same core values — but also amplify each other's blind spots. It can work beautifully or intensify challenges, depending on individual charts.` },
  ]

  return (
    <>
      <Head>
        <title>{`${title} | Birth Chart Library`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://birthchartlibrary.com/api/og/topic?title=${encodeURIComponent(sign + ' Compatibility')}&subtitle=${encodeURIComponent(signInfo.element + ' · ' + signInfo.modality)}&symbol=${encodeURIComponent(SIGN_SYMBOLS[sign] ?? '')}&label=Zodiac+Compatibility`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ name: 'Home', url: 'https://birthchartlibrary.com' }, { name: 'Compatibility', url: 'https://birthchartlibrary.com/compatibility' }, { name: `${sign} Compatibility`, url: canonicalUrl }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(faqs)) }} />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-slate-400 mb-8">
          <Link href="/compatibility" className="hover:text-slate-600 dark:hover:text-slate-300">Compatibility</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-600 dark:text-slate-300">{sign}</span>
        </nav>

        <div className="text-center mb-10">
          <SignGlyph sign={sign} decorative className="text-6xl block mb-3 text-slate-900 dark:text-white" />
          <h1 className="font-display text-4xl md:text-5xl tracking-wide text-slate-800 dark:text-slate-100 mb-3">{sign} Compatibility</h1>
          <div className="flex justify-center gap-2 mb-4">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${ec.bg} ${ec.text}`}>{signInfo.element}</span>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{signInfo.modality}</span>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Ruled by {signInfo.ruledBy}</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            {sign} brings {inLove.brings}. In love, they need {inLove.needs}.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="card border-l-4 border-emerald-400">
            <p className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Best Matches</p>
            <div className="flex flex-wrap gap-2">
              {topMatches.map(s => (
                <Link key={s} href={`/compatibility/${getPairSlug(sign, s)}`} className={`inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full ${getElementColor(s).bg} ${getElementColor(s).text} hover:opacity-80 transition-opacity`}>
                  <SignGlyph sign={s} decorative /> {s}
                </Link>
              ))}
            </div>
          </div>
          <div className="card border-l-4 border-rose-300">
            <p className="text-xs uppercase tracking-widest text-rose-500 mb-2">Most Challenging</p>
            <div className="flex flex-wrap gap-2">
              {challengingMatches.map(s => (
                <Link key={s} href={`/compatibility/${getPairSlug(sign, s)}`} className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-80 transition-opacity">
                  <SignGlyph sign={s} decorative /> {s}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className={`rounded-xl border p-6 mb-10 ${ec.border} bg-gradient-to-br ${ec.gradient}`}>
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Compatibility Key</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{inLove.tip}</p>
        </div>

        <h2 className="font-display text-2xl tracking-wide text-slate-800 dark:text-slate-100 mb-6">{sign} With Every Sign</h2>
        <div className="space-y-3 mb-12">
          {pairings.map(p => {
            const barColor = p.score >= 70 ? 'bg-emerald-500' : p.score >= 50 ? 'bg-amber-400' : 'bg-rose-400'
            const badgeClass = p.score >= 70 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : p.score >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
            return (
              <Link key={p.partner} href={`/compatibility/${p.slug}`} className="card flex items-center gap-4 hover:border-slate-400 dark:hover:border-slate-500 transition-colors group block">
                <SignGlyph sign={p.partner} decorative className="flex-shrink-0 text-3xl" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{sign} &amp; {p.partner}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${badgeClass}`}>{p.scoreLabel}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed truncate">{p.summary}</p>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1.5">
                    <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${p.score}%` }} />
                  </div>
                </div>
                <span className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0">→</span>
              </Link>
            )
          })}
        </div>

        {hubCouples.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl tracking-wide text-slate-800 dark:text-slate-100 mb-6">Famous {sign} Couples</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {hubCouples.map(c => (
                <div key={c.slug} className="card flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-100 text-sm truncate">
                      <Link href={`/celebrity-birth-charts/${c.slug}`} className="hover:underline">{c.name}</Link>
                      <span className="text-slate-400 mx-1">&amp;</span>
                      <Link href={`/celebrity-birth-charts/${c.partner_slug}`} className="hover:underline">{c.partner_name}</Link>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 capitalize">{c.status}</p>
                  </div>
                  <Link href={`/celebrity-birth-charts/compare/${c.slug}-vs-${c.partner_slug}`} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0">Compare →</Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Love profile cross-link */}
        <Link href={`/love/${sign.toLowerCase()}-in-love`} className="card flex items-center justify-between gap-4 hover:border-slate-400 dark:hover:border-slate-500 transition-colors group mb-12">
          <div>
            <p className="font-medium text-sm text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{sign} in Love</p>
            <p className="text-xs text-slate-400 mt-0.5">What {sign} brings, needs, and looks like in a relationship</p>
          </div>
          <span className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors flex-shrink-0 text-sm">→</span>
        </Link>

        <div className="mb-12">
          <h2 className="font-display text-2xl tracking-wide text-slate-800 dark:text-slate-100 mb-6">{sign} Compatibility — Common Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="card">
                <p className="font-semibold text-slate-800 dark:text-slate-100 mb-2">{faq.question}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-10">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-5">Sun sign compatibility is just the start. A full synastry reading compares every planet in both charts.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/calculators/synastry" className="btn-primary px-6 py-2.5 text-sm">Run Your Synastry Reading</Link>
            <Link href={`/zodiac-signs/${sign.toLowerCase()}`} className="btn-outline px-6 py-2.5 text-sm">{sign} Sign Profile</Link>
            <Link href={`/love/${sign.toLowerCase()}-in-love`} className="btn-outline px-6 py-2.5 text-sm">{sign} in Love</Link>
            <Link href="/compatibility" className="btn-outline px-6 py-2.5 text-sm">All Compatibility Pairings</Link>
          </div>
        </div>
      </main>
    </>
  )
}

// ─── Pair → love article lookup ──────────────────────────────────────────────

const PAIR_LOVE_ARTICLES: Partial<Record<string, { slug: string; label: string }[]>> = {
  'Gemini+Virgo':          [{ slug: 'zendaya-and-tom-holland', label: 'Zendaya & Tom Holland' }, { slug: 'paul-mccartney-and-linda-mccartney', label: 'Paul McCartney & Linda McCartney' }],
  'Scorpio+Sagittarius':   [{ slug: 'taylor-swift-and-travis-kelce',  label: 'Taylor Swift & Travis Kelce' }],
  'Virgo+Sagittarius':     [{ slug: 'beyonce-and-jay-z', label: 'Beyoncé & Jay-Z' }, { slug: 'gwyneth-paltrow-and-brad-falchuk', label: 'Gwyneth Paltrow & Brad Falchuk' }],
  'Sagittarius+Aquarius':  [{ slug: 'jennifer-aniston-and-brad-pitt', label: 'Jennifer Aniston & Brad Pitt' }],
  'Libra+Capricorn':       [{ slug: 'kim-kardashian-and-lewis-hamilton', label: 'Kim Kardashian & Lewis Hamilton' }, { slug: 'dwyane-wade-and-gabrielle-union', label: 'Dwyane Wade & Gabrielle Union' }],
  'Cancer+Scorpio':        [
    { slug: 'kendall-jenner-and-jacob-elordi',    label: 'Kendall Jenner & Jacob Elordi' },
    { slug: 'princess-diana-and-prince-charles',  label: 'Princess Diana & Prince Charles' },
    { slug: 'maya-hawke-and-christian-lee-hutson', label: 'Maya Hawke & Christian Lee Hutson' },
  ],
  'Cancer+Cancer':         [{ slug: 'ariana-grande-and-ethan-slater', label: 'Ariana Grande & Ethan Slater' }],
  'Scorpio+Pisces':        [{ slug: 'goldie-hawn-and-kurt-russell', label: 'Goldie Hawn & Kurt Russell' }, { slug: 'ryan-gosling-and-eva-mendes', label: 'Ryan Gosling & Eva Mendes' }, { slug: 'elizabeth-taylor-and-richard-burton', label: 'Elizabeth Taylor & Richard Burton' }],
  'Leo+Capricorn':         [{ slug: 'barack-and-michelle-obama', label: 'Barack & Michelle Obama' }, { slug: 'kylie-jenner-and-timothee-chalamet', label: 'Kylie Jenner & Timothée Chalamet' }],
  'Cancer+Leo':            [{ slug: 'selena-gomez-and-benny-blanco', label: 'Selena Gomez & Benny Blanco' }, { slug: 'tom-brady-and-gisele-bundchen', label: 'Tom Brady & Gisele Bündchen' }, { slug: 'aja-wilson-and-bam-adebayo', label: 'A\'ja Wilson & Bam Adebayo' }],
  'Gemini+Sagittarius':    [
    { slug: 'brad-pitt-and-angelina-jolie',   label: 'Brad Pitt & Angelina Jolie' },
    { slug: 'marilyn-monroe-and-joe-dimaggio', label: 'Marilyn Monroe & Joe DiMaggio' },
    { slug: 'rafael-nadal-and-xisca-perello',  label: 'Rafael Nadal & Xisca Perelló' },
  ],
  'Virgo+Scorpio':         [{ slug: 'blake-lively-and-ryan-reynolds', label: 'Blake Lively & Ryan Reynolds' }],
  'Cancer+Capricorn':      [
    { slug: 'dolly-parton-and-carl-dean',       label: 'Dolly Parton & Carl Dean' },
    { slug: 'kate-and-prince-william',           label: 'Kate & Prince William' },
    { slug: 'kristen-bell-and-dax-shepard',      label: 'Kristen Bell & Dax Shepard' },
  ],
  'Leo+Leo':               [{ slug: 'jennifer-lopez-and-ben-affleck', label: 'Jennifer Lopez & Ben Affleck' }],
  'Libra+Pisces':          [
    { slug: 'rihanna-and-asap-rocky',         label: 'Rihanna & ASAP Rocky' },
    { slug: 'emily-blunt-and-john-krasinski',  label: 'Emily Blunt & John Krasinski' },
    { slug: 'chris-martin-and-dakota-johnson', label: 'Chris Martin & Dakota Johnson' },
  ],
  'Pisces+Pisces':         [{ slug: 'steph-and-ayesha-curry',         label: 'Steph & Ayesha Curry' }],
  'Virgo+Virgo':           [{ slug: 'patrick-and-brittany-mahomes',   label: 'Patrick & Brittany Mahomes' }],
  'Taurus+Taurus':         [{ slug: 'megan-fox-and-machine-gun-kelly', label: 'Megan Fox & MGK' }],
  'Aries+Taurus':          [{ slug: 'david-and-victoria-beckham', label: 'David & Victoria Beckham' }, { slug: 'spencer-tracy-and-katharine-hepburn', label: 'Spencer Tracy & Katharine Hepburn' }],
  'Aries+Scorpio':         [{ slug: 'kourtney-kardashian-and-travis-barker', label: 'Kourtney Kardashian & Travis Barker' }, { slug: 'elton-john-and-david-furnish', label: 'Elton John & David Furnish' }, { slug: 'chip-and-joanna-gaines', label: 'Chip & Joanna Gaines' }],
  'Leo+Virgo':             [{ slug: 'prince-harry-and-meghan-markle',  label: 'Prince Harry & Meghan Markle' }],
  'Virgo+Libra':           [{ slug: 'will-smith-and-jada-pinkett-smith', label: 'Will Smith & Jada Pinkett Smith' }],
  'Cancer+Virgo':          [{ slug: 'priyanka-chopra-and-nick-jonas', label: 'Priyanka Chopra & Nick Jonas' }, { slug: 'pink-and-carey-hart', label: 'Pink & Carey Hart' }],
  'Scorpio+Capricorn':     [{ slug: 'katy-perry-and-orlando-bloom', label: 'Katy Perry & Orlando Bloom' }, { slug: 'julia-roberts-and-danny-moder', label: 'Julia Roberts & Danny Moder' }],
  'Sagittarius+Capricorn': [
    { slug: 'chrissy-teigen-and-john-legend',  label: 'Chrissy Teigen & John Legend' },
    { slug: 'miley-cyrus-and-liam-hemsworth',  label: 'Miley Cyrus & Liam Hemsworth' },
  ],
  'Cancer+Pisces':         [
    { slug: 'johnny-cash-and-june-carter-cash',   label: 'Johnny Cash & June Carter Cash' },
    { slug: 'lionel-messi-and-antonela-roccuzzo', label: 'Lionel Messi & Antonela Roccuzzo' },
    { slug: 'kurt-cobain-and-courtney-love',       label: 'Kurt Cobain & Courtney Love' },
  ],
  'Taurus+Sagittarius':    [{ slug: 'adele-and-rich-paul',             label: 'Adele & Rich Paul' }],
  'Gemini+Libra':          [
    { slug: 'marilyn-monroe-and-arthur-miller',     label: 'Marilyn Monroe & Arthur Miller' },
    { slug: 'kim-kardashian-and-kanye-west',         label: 'Kim Kardashian & Kanye West' },
    { slug: 'blake-shelton-and-gwen-stefani',       label: 'Blake Shelton & Gwen Stefani' },
  ],
  'Libra+Aquarius':        [{ slug: 'john-lennon-and-yoko-ono',        label: 'John Lennon & Yoko Ono' }],
  'Gemini+Capricorn':      [
    { slug: 'elvis-and-priscilla-presley',           label: 'Elvis & Priscilla Presley' },
    { slug: 'kanye-west-and-bianca-censori',        label: 'Kanye West & Bianca Censori' },
  ],
  'Gemini+Leo':            [{ slug: 'jfk-and-jackie-kennedy',          label: 'JFK & Jackie Kennedy' }],
  'Taurus+Aquarius':       [
    { slug: 'sonny-and-cher',                        label: 'Sonny & Cher' },
    { slug: 'george-and-amal-clooney',               label: 'George & Amal Clooney' },
  ],
  'Aquarius+Pisces':       [
    { slug: 'paul-newman-and-joanne-woodward',       label: 'Paul Newman & Joanne Woodward' },
    { slug: 'harry-styles-and-olivia-wilde',         label: 'Harry Styles & Olivia Wilde' },
    { slug: 'justin-timberlake-and-jessica-biel',   label: 'Justin Timberlake & Jessica Biel' },
  ],
  'Virgo+Capricorn':       [
    { slug: 'humphrey-bogart-and-lauren-bacall',    label: 'Humphrey Bogart & Lauren Bacall' },
    { slug: 'lebron-and-savannah-james',             label: 'LeBron & Savannah James' },
    { slug: 'idris-elba-and-sabrina-dhowre',        label: 'Idris Elba & Sabrina Dhowre' },
  ],
  'Taurus+Capricorn':      [
    { slug: 'gigi-hadid-and-zayn-malik',             label: 'Gigi Hadid & Zayn Malik' },
    { slug: 'martin-luther-king-and-coretta-scott-king', label: 'MLK & Coretta Scott King' },
  ],
  'Sagittarius+Pisces':    [{ slug: 'justin-and-hailey-bieber',        label: 'Justin & Hailey Bieber' }],
  'Gemini+Scorpio':        [{ slug: 'nicole-kidman-and-keith-urban',    label: 'Nicole Kidman & Keith Urban' }],
  'Leo+Pisces':            [
    { slug: 'joe-jonas-and-sophie-turner',           label: 'Joe Jonas & Sophie Turner' },
    { slug: 'shawn-mendes-and-camila-cabello',       label: 'Shawn Mendes & Camila Cabello' },
    { slug: 'lucille-ball-and-desi-arnaz',           label: 'Lucille Ball & Desi Arnaz' },
  ],
  'Taurus+Libra':          [{ slug: 'serena-williams-and-alexis-ohanian', label: 'Serena Williams & Alexis Ohanian' }],
  'Aquarius+Aquarius':     [
    { slug: 'cristiano-ronaldo-and-georgina-rodriguez', label: 'Cristiano Ronaldo & Georgina Rodríguez' },
    { slug: 'ellen-degeners-and-portia-de-rossi',   label: 'Ellen DeGeneres & Portia de Rossi' },
  ],
  'Leo+Aquarius':          [{ slug: 'mila-kunis-and-ashton-kutcher',    label: 'Mila Kunis & Ashton Kutcher' }],
  'Cancer+Aquarius':       [{ slug: 'ronald-reagan-and-nancy-reagan',   label: 'Ronald Reagan & Nancy Reagan' }],
  'Leo+Scorpio':           [{ slug: 'bill-clinton-and-hillary-clinton', label: 'Bill Clinton & Hillary Clinton' }, { slug: 'madeleine-petsch-and-tyga', label: 'Madeleine Petsch & Tyga' }],
  'Leo+Libra':             [{ slug: 'jimmy-carter-and-rosalynn-carter',  label: 'Jimmy Carter & Rosalynn Carter' }],
  'Aries+Leo':             [{ slug: 'roger-federer-and-mirka-federer',   label: 'Roger Federer & Mirka Federer' }],
  'Aries+Libra':           [
    { slug: 'elton-john-and-david-furnish',          label: 'Elton John & David Furnish' },
    { slug: 'sabrina-carpenter-and-barry-keoghan',   label: 'Sabrina Carpenter & Barry Keoghan' },
  ],
  'Virgo+Aquarius':        [{ slug: 'garth-brooks-and-trisha-yearwood', label: 'Garth Brooks & Trisha Yearwood' }, { slug: 'kaia-gerber-and-lewis-pullman', label: 'Kaia Gerber & Lewis Pullman' }],
  'Taurus+Virgo':          [{ slug: 'faith-hill-and-tim-mcgraw',         label: 'Faith Hill & Tim McGraw' }],
  'Taurus+Pisces':         [{ slug: 'penelope-cruz-and-javier-bardem',   label: 'Penélope Cruz & Javier Bardem' }],
  'Taurus+Gemini':         [{ slug: 'zoe-saldana-and-marco-perego',      label: 'Zoë Saldana & Marco Perego' }],
  'Cancer+Sagittarius':    [{ slug: 'chris-pratt-and-katherine-schwarzenegger', label: 'Chris Pratt & Katherine Schwarzenegger' }],
  'Cancer+Libra':          [{ slug: 'tom-hanks-and-rita-wilson',         label: 'Tom Hanks & Rita Wilson' }],
  'Taurus+Cancer':         [{ slug: 'tina-fey-and-jeff-richmond',        label: 'Tina Fey & Jeff Richmond' }],
  'Aries+Pisces':          [{ slug: 'sarah-jessica-parker-and-matthew-broderick', label: 'Sarah Jessica Parker & Matthew Broderick' }],
  'Libra+Scorpio':         [{ slug: 'kim-kardashian-and-pete-davidson',  label: 'Kim Kardashian & Pete Davidson' }],
  'Libra+Sagittarius':     [{ slug: 'cardi-b-and-offset',               label: 'Cardi B & Offset' }],
  'Gemini+Gemini':         [{ slug: 'venus-williams-and-andrea-preti',  label: 'Venus Williams & Andrea Preti' }],
}

// ─── Pair view ────────────────────────────────────────────────────────────────

function ordinalScore(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Very High', color: 'text-emerald-600' }
  if (score >= 65) return { label: 'High', color: 'text-emerald-500' }
  if (score >= 50) return { label: 'Moderate', color: 'text-amber-600' }
  return { label: 'Challenging', color: 'text-red-500' }
}

function PairPage({ sign1, sign2, slug, isSame, couples, pairKey, pairData, elemData, modData }: Extract<Props, { mode: 'pair' }>) {
  const info1 = SIGNS[sign1]
  const info2 = SIGNS[sign2]
  if (!info1 || !info2) return null

  const ec1 = getElementColor(sign1)
  const ec2 = getElementColor(sign2)
  const score = elemData?.score ?? 50
  const scoreInfo = ordinalScore(score)
  const canonicalUrl = `https://birthchartlibrary.com/compatibility/${slug}`

  const title = isSame ? `${sign1} and ${sign2} Compatibility — When Two ${sign1}s Unite` : `${sign1} and ${sign2} Compatibility — Love, Communication & Growth`
  const description = isSame
    ? `Two ${sign1}s in love: what double ${info1.element} energy produces — strengths, shared blind spots, and famous ${sign1} couples.`
    : `Are ${sign1} and ${sign2} compatible? ${info1.element} meets ${info2.element} — dynamic, strengths, challenges, growth edge, and famous ${sign1}–${sign2} couples.`

  const faqItems = [
    { question: `Are ${sign1} and ${sign2} compatible?`, answer: pairData.summary + (elemData ? ` From an elemental perspective, ${info1.element} and ${info2.element} ${elemData.nature === 'explosive' || elemData.nature === 'electric' ? 'create a naturally energizing dynamic' : elemData.nature === 'nurturing' || elemData.nature === 'stable' ? 'form one of the more naturally compatible pairings' : 'bring contrasting energies that require understanding'}.` : '') },
    { question: `What are the strengths of a ${sign1}–${sign2} relationship?`, answer: pairData.strengths.join(' ') },
    { question: `What are the challenges for ${sign1} and ${sign2}?`, answer: pairData.challenges.join(' ') + ` The key growth edge: ${pairData.tip}` },
    ...(elemData ? [{ question: `How do ${info1.element} and ${info2.element} signs communicate?`, answer: elemData.communication }] : []),
  ]

  return (
    <>
      <Head>
        <title>{`${title} | Birth Chart Library`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://birthchartlibrary.com/api/og/topic?title=${encodeURIComponent(sign1 + ' & ' + sign2)}&subtitle=Zodiac+Compatibility+Guide&symbol=${encodeURIComponent(SIGN_SYMBOLS[sign1] + ' ' + SIGN_SYMBOLS[sign2])}&label=Compatibility`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ name: 'Home', url: 'https://birthchartlibrary.com' }, { name: 'Compatibility', url: 'https://birthchartlibrary.com/compatibility' }, { name: `${sign1} Compatibility`, url: `https://birthchartlibrary.com/compatibility/${sign1.toLowerCase()}` }, { name: `${sign1} & ${sign2}`, url: canonicalUrl }])) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(faqItems)) }} />

        <AdminBreadcrumb crumbs={[{ label: 'Compatibility', href: '/compatibility' }, { label: `${sign1} Compatibility`, href: `/compatibility/${sign1.toLowerCase()}` }, { label: `${sign1} & ${sign2}` }]} />

        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="text-center">
            <Link href={`/zodiac-signs/${sign1.toLowerCase()}`} className="text-5xl block hover:opacity-80 transition-opacity text-slate-900 dark:text-white"><SignGlyph sign={sign1} decorative /></Link>
            <p className={`text-sm font-medium mt-1 ${ec1.text}`}>{sign1}</p>
          </div>
          <span className="text-2xl text-slate-300">&amp;</span>
          <div className="text-center">
            <Link href={`/zodiac-signs/${sign2.toLowerCase()}`} className="text-5xl block hover:opacity-80 transition-opacity text-slate-900 dark:text-white"><SignGlyph sign={sign2} decorative /></Link>
            <p className={`text-sm font-medium mt-1 ${ec2.text}`}>{sign2}</p>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">{sign1} and {sign2} Compatibility</h1>
        <div className="flex justify-center gap-4 text-xs text-slate-500 mb-6">
          <span className={`px-2 py-0.5 rounded-full ${ec1.bg} ${ec1.text}`}>{info1.element}</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 dark:text-slate-300">{info1.modality} + {info2.modality}</span>
          <span className={`px-2 py-0.5 rounded-full ${ec2.bg} ${ec2.text}`}>{info2.element}</span>
        </div>

        <div className="card mb-8 text-center">
          <p className="text-slate-700 leading-relaxed italic">&ldquo;{pairData.summary}&rdquo;</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-sm text-slate-500">Element compatibility:</span>
            <span className={`text-sm font-semibold ${scoreInfo.color}`}>{scoreInfo.label}</span>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">The Dynamic</h2>
        <div className="card mb-8">
          {pairData.dynamic.split('\n\n').map((p, i) => <p key={i} className="text-slate-600 leading-relaxed mb-4 last:mb-0">{p}</p>)}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="card border-l-4 border-emerald-300">
            <h3 className="font-semibold text-emerald-700 mb-3">Strengths</h3>
            <ul className="space-y-2">{pairData.strengths.map((s, i) => <li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-emerald-500 shrink-0">+</span><span>{s}</span></li>)}</ul>
          </div>
          <div className="card border-l-4 border-red-300">
            <h3 className="font-semibold text-red-700 mb-3">Challenges</h3>
            <ul className="space-y-2">{pairData.challenges.map((c, i) => <li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-red-400 shrink-0">!</span><span>{c}</span></li>)}</ul>
          </div>
        </div>

        {/* Mid-page CTA */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">Know your side of the equation</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Get your free birth chart to see what you actually bring to this pairing.</p>
          </div>
          <Link href="/birth-chart?ref=compat-mid" className="btn-primary text-sm px-5 py-2 whitespace-nowrap shrink-0">
            Get My Chart
          </Link>
        </div>

        {elemData && (
          <>
            <h2 className="text-xl font-semibold mb-4">{info1.element} + {info2.element} Elements</h2>
            <div className="card mb-8">
              <p className="text-slate-600 leading-relaxed mb-4">{elemData.description}</p>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                <h3 className="font-medium text-sm text-slate-800 mb-2">Communication Style</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{elemData.communication}</p>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                <h3 className="font-medium text-sm text-slate-800 mb-2">Love &amp; Intimacy</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{elemData.loveStyle}</p>
              </div>
            </div>
          </>
        )}

        {modData && (
          <>
            <h2 className="text-xl font-semibold mb-4">{info1.modality} + {info2.modality} Modalities</h2>
            <div className="card mb-8">
              <p className="text-slate-600 leading-relaxed mb-4">{modData.dynamic}</p>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                <h3 className="font-medium text-sm text-slate-800 mb-2">Key Tension</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{modData.tension}</p>
              </div>
            </div>
          </>
        )}

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-xl">✦</span>
            <div>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-1">Growth Edge</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{pairData.tip}</p>
            </div>
          </div>
        </div>

        {couples.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Famous {sign1}–{sign2} Couples</h2>
            <div className="card mb-8">
              <p className="text-xs text-slate-400 mb-4">Real couples from the Birth Chart Library database</p>
              <div className="space-y-1">
                {couples.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link href={`/celebrity-birth-charts/${c.slug1}`} className="font-medium text-sm hover:underline truncate">{c.name1}</Link>
                        <span className="text-slate-300 text-xs">&amp;</span>
                        <Link href={`/celebrity-birth-charts/${c.slug2}`} className="font-medium text-sm hover:underline truncate">{c.name2}</Link>
                      </div>
                      {c.notes && <p className="text-xs text-slate-400 mt-0.5">{c.notes}</p>}
                    </div>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${c.status === 'current' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{c.status === 'current' ? 'Together' : 'Past'}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Love article cross-links */}
        {PAIR_LOVE_ARTICLES[pairKey] && (
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Real Couple Deep-Dives</p>
            <div className="space-y-2">
              {PAIR_LOVE_ARTICLES[pairKey]!.map(a => (
                <Link key={a.slug} href={`/love/${a.slug}`} className="card flex items-center justify-between gap-4 hover:border-slate-400 dark:hover:border-slate-500 transition-colors group">
                  <div>
                    <p className="font-medium text-sm text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{a.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Astrological breakdown of this {sign1}–{sign2} pairing</p>
                  </div>
                  <span className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors flex-shrink-0 text-sm">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-lg font-semibold mb-4">Explore Other {sign1} Pairings</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {SIGN_ORDER.filter(s => s !== sign1 && s !== sign2).map(s => (
            <Link key={s} href={`/compatibility/${getPairSlug(sign1, s)}`} className="text-xs px-2.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400 hover:text-slate-800 dark:hover:border-slate-500 dark:hover:text-slate-200 transition-colors">
              <SignGlyph sign={s} decorative /> {sign1} &amp; {s}
            </Link>
          ))}
        </div>

        {!isSame && (
          <>
            <h2 className="text-lg font-semibold mb-4">Explore Other {sign2} Pairings</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {SIGN_ORDER.filter(s => s !== sign1 && s !== sign2).map(s => (
                <Link key={s} href={`/compatibility/${getPairSlug(sign2, s)}`} className="text-xs px-2.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400 hover:text-slate-800 dark:hover:border-slate-500 dark:hover:text-slate-200 transition-colors">
                  <SignGlyph sign={s} decorative /> {sign2} &amp; {s}
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <Link href="/calculators/synastry" className="card hover:border-slate-400 transition-colors group"><p className="font-medium text-sm group-hover:text-slate-600">Synastry Calculator</p><p className="text-xs text-slate-400 mt-0.5">Compare full birth charts</p></Link>
          <Link href="/love/celebrity-couples" className="card hover:border-slate-400 transition-colors group"><p className="font-medium text-sm group-hover:text-slate-600">♥ Celebrity Couples</p><p className="text-xs text-slate-400 mt-0.5">Real charts, real compatibility scores</p></Link>
          <Link href="/celebrity-birth-charts" className="card hover:border-slate-400 transition-colors group"><p className="font-medium text-sm group-hover:text-slate-600">Celebrity Charts</p><p className="text-xs text-slate-400 mt-0.5">550+ researched charts</p></Link>
          <Link href="/astrology-interpretations" className="card hover:border-slate-400 transition-colors group"><p className="font-medium text-sm group-hover:text-slate-600">Interpretation Library</p><p className="text-xs text-slate-400 mt-0.5">Every placement explained</p></Link>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
          <div className="card mb-4 text-center">
            <h3 className="font-semibold mb-2">See the full picture</h3>
            <p className="text-sm text-slate-500 mb-5">Sun signs are the starting point. Your Moon, Venus, Mars, and rising sign all shape how you love — a full chart comparison reveals every connection.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/birth-chart" className="btn-primary text-sm">Create Your Free Birth Chart</Link>
              <Link href="/calculators/synastry" className="border border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-800 text-sm px-4 py-2 rounded-lg transition-colors">Compare Two Charts</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export default function CompatibilityPage(props: Props) {
  if (props.mode === 'hub') return <HubPage {...props} />
  return <PairPage {...props} />
}
