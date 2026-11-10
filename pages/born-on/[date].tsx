import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import Image from 'next/image'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getElementColor } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'
import { breadcrumbSchema, faqSchema, jsonLd } from '@/lib/schema'
import { getListableCelebrities } from '@/lib/celebrities'
import { NOINDEX_THIN } from '@/lib/thin-pages'

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
const MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const MONTH_LABELS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Sun sign date ranges (approximate — cusp dates vary by year)
const SIGN_DATES: { sign: string; startMonth: number; startDay: number; endMonth: number; endDay: number }[] = [
  { sign: 'Capricorn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { sign: 'Aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { sign: 'Pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  { sign: 'Aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { sign: 'Taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { sign: 'Gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { sign: 'Cancer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { sign: 'Leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { sign: 'Virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { sign: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { sign: 'Scorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { sign: 'Sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
]

const SUN_TRAITS: Record<string, { element: string; modality: string; ruler: string; traits: string }> = {
  Aries: { element: 'Fire', modality: 'Cardinal', ruler: 'Mars', traits: 'bold, energetic, competitive, and driven to lead. They meet the world head-on and thrive when they have something to fight for.' },
  Taurus: { element: 'Earth', modality: 'Fixed', ruler: 'Venus', traits: 'patient, loyal, sensual, and determined. They build slowly but what they create tends to last... comfort and beauty matter deeply.' },
  Gemini: { element: 'Air', modality: 'Mutable', ruler: 'Mercury', traits: 'curious, communicative, adaptable, and intellectually restless. They collect ideas the way others collect objects.' },
  Cancer: { element: 'Water', modality: 'Cardinal', ruler: 'Moon', traits: 'intuitive, nurturing, emotionally deep, and fiercely protective. Home and family are not just important... they are everything.' },
  Leo: { element: 'Fire', modality: 'Fixed', ruler: 'Sun', traits: 'warm, creative, generous, and naturally magnetic. They need to express themselves and feel most alive when they are creating or leading.' },
  Virgo: { element: 'Earth', modality: 'Mutable', ruler: 'Mercury', traits: 'analytical, practical, detail-oriented, and quietly dedicated. They improve everything they touch and find purpose through service.' },
  Libra: { element: 'Air', modality: 'Cardinal', ruler: 'Venus', traits: 'diplomatic, aesthetic, relationship-oriented, and fairness-driven. They seek beauty and balance in everything and everyone.' },
  Scorpio: { element: 'Water', modality: 'Fixed', ruler: 'Pluto', traits: 'intense, perceptive, transformative, and emotionally fearless. They see beneath surfaces and are drawn to what is hidden or taboo.' },
  Sagittarius: { element: 'Fire', modality: 'Mutable', ruler: 'Jupiter', traits: 'adventurous, philosophical, optimistic, and freedom-seeking. They chase meaning and believe life is an ongoing discovery.' },
  Capricorn: { element: 'Earth', modality: 'Cardinal', ruler: 'Saturn', traits: 'disciplined, ambitious, responsible, and built for the long game. They earn everything they have and respect the process.' },
  Aquarius: { element: 'Air', modality: 'Fixed', ruler: 'Uranus', traits: 'independent, innovative, humanitarian, and unapologetically different. They think in systems and value freedom above conformity.' },
  Pisces: { element: 'Water', modality: 'Mutable', ruler: 'Neptune', traits: 'compassionate, imaginative, intuitive, and emotionally absorbent. They feel everything and find meaning through creativity and empathy.' },
}

function getSunSign(month: number, day: number): string {
  for (const sd of SIGN_DATES) {
    if (sd.startMonth === sd.endMonth) {
      if (month === sd.startMonth && day >= sd.startDay && day <= sd.endDay) return sd.sign
    } else if (sd.startMonth > sd.endMonth) {
      // Wraps around year (Capricorn)
      if ((month === sd.startMonth && day >= sd.startDay) || (month === sd.endMonth && day <= sd.endDay)) return sd.sign
    } else {
      if ((month === sd.startMonth && day >= sd.startDay) || (month === sd.endMonth && day <= sd.endDay)) return sd.sign
    }
  }
  return 'Unknown'
}

function isCusp(month: number, day: number): { from: string; to: string } | null {
  for (const sd of SIGN_DATES) {
    // Check if within 2 days of a sign boundary
    if (month === sd.endMonth && day >= sd.endDay - 1 && day <= sd.endDay + 1) {
      const nextIdx = (SIGN_DATES.indexOf(sd) + 1) % SIGN_DATES.length
      return { from: sd.sign, to: SIGN_DATES[nextIdx].sign }
    }
  }
  return null
}

interface Celebrity {
  name: string
  slug: string
  category: string | null
  image_url: string | null
  sun_sign: string | null
}

interface Props {
  month: number
  day: number
  monthName: string
  dateLabel: string
  sunSign: string
  cusp: { from: string; to: string } | null
  celebrities: Celebrity[]
  prevDate: string
  nextDate: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { date: string } }[] = []
  for (let m = 0; m < 12; m++) {
    for (let d = 1; d <= MONTH_DAYS[m]; d++) {
      paths.push({ params: { date: `${MONTHS[m]}-${d}` } })
    }
  }
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const dateStr = params?.date as string
  const match = dateStr.match(/^([a-z]+)-(\d+)$/)
  if (!match) return { notFound: true }

  const monthIdx = MONTHS.indexOf(match[1])
  if (monthIdx === -1) return { notFound: true }
  const month = monthIdx + 1
  const day = parseInt(match[2])
  if (day < 1 || day > MONTH_DAYS[monthIdx]) return { notFound: true }

  const sunSign = getSunSign(month, day)
  const cusp = isCusp(month, day)

  // Quality-bio only (see lib/celebrities.ts) — previously unfiltered, no
  // LIMIT, so this returned and linked every celebrity born on a date
  // (avg ~147/day) regardless of bio_source. This page has no noindex
  // logic of its own, so it was fully-indexed and pointing almost entirely
  // at noindexed template pages.
  const celebrities = await getListableCelebrities<Celebrity>({
    columns: 'name, slug, category, image_url, sun_sign',
    where: 'EXTRACT(MONTH FROM birth_date) = $1 AND EXTRACT(DAY FROM birth_date) = $2',
    params: [month, day],
    orderBy: 'name',
    requireImage: false,
  })

  // Prev/next dates
  let prevM = monthIdx, prevD = day - 1
  if (prevD < 1) { prevM = (monthIdx - 1 + 12) % 12; prevD = MONTH_DAYS[prevM] }
  let nextM = monthIdx, nextD = day + 1
  if (nextD > MONTH_DAYS[monthIdx]) { nextM = (monthIdx + 1) % 12; nextD = 1 }

  return {
    props: JSON.parse(JSON.stringify({
      month, day,
      monthName: MONTH_LABELS[monthIdx],
      dateLabel: `${MONTH_LABELS[monthIdx]} ${day}`,
      sunSign,
      cusp,
      celebrities,
      prevDate: `${MONTHS[prevM]}-${prevD}`,
      nextDate: `${MONTHS[nextM]}-${nextD}`,
    })),
    revalidate: 604800,
  }
}

function BirthdayLookup() {
  const router = useRouter()
  const [selMonth, setSelMonth] = useState('')
  const [selDay, setSelDay] = useState('')

  const maxDays = selMonth ? MONTH_DAYS[parseInt(selMonth)] : 31

  function handleLookup() {
    const m = parseInt(selMonth)
    const d = parseInt(selDay)
    if (isNaN(m) || !d || d < 1 || d > MONTH_DAYS[m]) return
    router.push(`/born-on/${MONTHS[m]}-${d}`)
  }

  return (
    <div className="card mb-8">
      <p className="text-sm font-medium text-slate-700 mb-3">Look up another birthday</p>
      <div className="flex gap-2">
        <select
          value={selMonth}
          onChange={e => { setSelMonth(e.target.value); setSelDay('') }}
          className="input text-sm flex-1"
        >
          <option value="">Month</option>
          {MONTH_LABELS.map((label, i) => (
            <option key={i} value={i}>{label}</option>
          ))}
        </select>
        <select
          value={selDay}
          onChange={e => setSelDay(e.target.value)}
          className="input text-sm w-20"
          disabled={!selMonth}
        >
          <option value="">Day</option>
          {Array.from({ length: maxDays }, (_, i) => i + 1).map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button
          onClick={handleLookup}
          disabled={!selMonth || !selDay}
          className="btn-primary text-sm px-4"
        >
          Go
        </button>
      </div>
    </div>
  )
}

export default function BornOnDatePage({ month, day, monthName, dateLabel, sunSign, cusp, celebrities, prevDate, nextDate }: Props) {
  const signInfo = SUN_TRAITS[sunSign]
  const ec = getElementColor(sunSign)
  const withPhotos = celebrities.filter(c => c.image_url)
  const withoutPhotos = celebrities.filter(c => !c.image_url)

  const bornOnFaqs = [
    {
      question: `What zodiac sign is ${dateLabel}?`,
      answer: `${dateLabel} is a ${sunSign} birthday. ${sunSign} is a ${signInfo?.element ?? ''} sign known for being ${signInfo?.traits ?? ''}`,
    },
    ...(celebrities.length > 0 ? [{
      question: `Who are famous people born on ${dateLabel}?`,
      answer: `Notable people born on ${dateLabel} include ${celebrities.slice(0, 8).map(c => c.name).join(', ')}.`,
    }] : []),
  ]

  return (
    <>
      <Head>
        <title>{`Born on ${dateLabel} — ${sunSign} Birthdays & Astrology`}</title>
        {NOINDEX_THIN.bornOn && <meta name="robots" content="noindex,follow" />}
        <meta name="description" content={`Born on ${dateLabel}? Your Sun sign is ${sunSign}. Explore ${sunSign} traits, see ${celebrities.length} famous people born on this date, and discover what the stars say about ${dateLabel} birthdays.`} />
        <link rel="canonical" href={`https://birthchartlibrary.com/born-on/${MONTHS[month - 1]}-${day}`} key="canonical" />
        <meta property="og:title" content={`Born on ${dateLabel} — ${sunSign} Birthdays & Astrology`} />
        <meta property="og:description" content={`Born on ${dateLabel}? Your Sun sign is ${sunSign}. Explore ${sunSign} traits and see ${celebrities.length} famous people born on this date.`} />
        <meta property="og:url" content={`https://birthchartlibrary.com/born-on/${MONTHS[month - 1]}-${day}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://birthchartlibrary.com/api/og/blog?title=Born+on+${encodeURIComponent(dateLabel)}&category=${encodeURIComponent(sunSign)}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Born on ${dateLabel} — ${sunSign} Birthdays`} />
        <meta name="twitter:description" content={`${celebrities.length} famous ${sunSign} birthdays on ${dateLabel}.`} />
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
          { name: 'Home', url: 'https://birthchartlibrary.com' },
          { name: 'Born On', url: 'https://birthchartlibrary.com/born-on/january-1' },
          { name: dateLabel, url: `https://birthchartlibrary.com/born-on/${MONTHS[month - 1]}-${day}` },
        ])) }} />
        {bornOnFaqs.length >= 2 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema(bornOnFaqs)) }} />
        )}

        {/* Breadcrumb */}
        <AdminBreadcrumb crumbs={[
          { label: 'Home', href: '/' },
          { label: dateLabel },
        ]} />

        <BirthdayLookup />

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl tracking-wide mb-3">Born on {dateLabel}</h1>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${ec.bg} ${ec.text} text-sm font-medium`}>
            <SignGlyph sign={sunSign} decorative /> {sunSign} Sun
          </div>
          {cusp && (
            <p className="text-xs text-slate-400 mt-2">Near the {cusp.from}-{cusp.to} cusp</p>
          )}
        </div>

        {/* Sun Sign Overview */}
        {signInfo && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">{dateLabel} Sun Sign: {sunSign}</h2>
            <div className="card p-5">
              <p className="text-slate-600 leading-relaxed mb-3">
                If you were born on {dateLabel}, your Sun is in {sunSign}. {sunSign} is a {signInfo.modality} {signInfo.element} sign ruled by {signInfo.ruler}. People born under this sign are {signInfo.traits}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs px-2.5 py-1 rounded-full border border-slate-200 text-slate-500">{signInfo.element}</span>
                <span className="text-xs px-2.5 py-1 rounded-full border border-slate-200 text-slate-500">{signInfo.modality}</span>
                <span className="text-xs px-2.5 py-1 rounded-full border border-slate-200 text-slate-500">Ruled by {signInfo.ruler}</span>
              </div>
              <Link href={`/zodiac-signs/${sunSign.toLowerCase()}`} className="text-sm text-slate-400 hover:text-slate-600 transition-colors mt-3 inline-block">
                Full {sunSign} guide &rarr;
              </Link>
            </div>
          </section>
        )}

        {/* Beyond Sun Sign */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Your Sun sign is just the beginning</h2>
          <p className="text-slate-500 text-sm mb-4">
            Everyone born on {dateLabel} shares a {sunSign} Sun... but your Moon sign, Rising sign, and the rest of your chart make you unique. Create a free birth chart to see the full picture.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/birth-chart" className="btn-primary text-sm px-5 py-2">Create Your Chart</Link>
            <Link href={`/interpretations/sun-in-${sunSign.toLowerCase()}`} className="btn-outline text-sm px-5 py-2">Sun in {sunSign} Interpretation</Link>
          </div>
        </section>

        {/* Famous People */}
        {celebrities.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-2">Famous People Born on {dateLabel}</h2>
            <p className="text-slate-400 text-sm mb-4">{celebrities.length} {celebrities.length === 1 ? 'celebrity' : 'celebrities'} in our library</p>

            {withPhotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {withPhotos.map(c => (
                  <Link
                    key={c.slug}
                    href={`/celebrity-birth-charts/${c.slug}`}
                    className="card flex items-center gap-3 p-3 hover:border-slate-400 transition-colors group"
                  >
                    <Image
                      src={`/api/img/${c.slug}`}
                      alt={c.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors block truncate">{c.name}</span>
                      {c.category && <span className="text-xs text-slate-400">{c.category}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {withoutPhotos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {withoutPhotos.map(c => (
                  <Link
                    key={c.slug}
                    href={`/celebrity-birth-charts/${c.slug}`}
                    className="text-sm px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800 transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Browse by Sign */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">More {sunSign} Charts</h2>
          <div className="flex flex-wrap gap-2">
            <Link href={`/celebrity-birth-charts/sign/${sunSign.toLowerCase()}`} className="text-sm px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:border-slate-400 transition-colors">
              All {sunSign} celebrities
            </Link>
            <Link href={`/zodiac-signs/${sunSign.toLowerCase()}`} className="text-sm px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:border-slate-400 transition-colors">
              {sunSign} zodiac sign
            </Link>
            <Link href={`/interpretations/sun-in-${sunSign.toLowerCase()}`} className="text-sm px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:border-slate-400 transition-colors">
              Sun in {sunSign}
            </Link>
          </div>
        </section>

        {/* Explore more */}
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          <Link href="/compatibility" className="card hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600">{sunSign} Compatibility</p>
            <p className="text-xs text-slate-400 mt-0.5">How {sunSign} connects with other signs</p>
          </Link>
          <Link href="/celebrity-match" className="card hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600">Celebrity Match</p>
            <p className="text-xs text-slate-400 mt-0.5">Which celebrity shares your chart?</p>
          </Link>
          <Link href="/astrology-aspects" className="card hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600">Aspects Guide</p>
            <p className="text-xs text-slate-400 mt-0.5">How planets interact in your chart</p>
          </Link>
          <Link href="/reading-room" className="card hover:border-slate-400 transition-colors group">
            <p className="font-medium text-sm group-hover:text-slate-600">Reading Room</p>
            <p className="text-xs text-slate-400 mt-0.5">Curated astrology books</p>
          </Link>
        </div>

        {/* Prev / Next */}
        <div className="flex justify-between pt-6 border-t border-slate-200">
          <Link href={`/born-on/${prevDate}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            &larr; {prevDate.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
          </Link>
          <Link href={`/born-on/${nextDate}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            {nextDate.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())} &rarr;
          </Link>
        </div>
      </main>
    </>
  )
}
