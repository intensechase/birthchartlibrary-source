import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { GetStaticProps } from 'next'
import { getListableCelebrities } from '@/lib/celebrities'
import { getElementColor } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'

const MONTH_NAMES = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
const MONTH_LABELS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

interface Celebrity {
  name: string
  slug: string
  birth_date: string
  birth_city: string
  category: string | null
  image_url: string | null
  sun_sign: string | null
  moon_sign: string | null
  rising_sign: string | null
}

interface Props {
  celebrities: Celebrity[]
  dateStr: string
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const now = new Date()
  const month = now.getUTCMonth() + 1
  const day = now.getUTCDate()

  const celebrities = await getListableCelebrities<Celebrity>({
    columns: 'name, slug, birth_date, birth_city, category, image_url, sun_sign, moon_sign, rising_sign',
    where: 'EXTRACT(MONTH FROM birth_date) = $1 AND EXTRACT(DAY FROM birth_date) = $2',
    params: [month, day],
    orderBy: 'name',
    requireImage: false,
  })

  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })

  return {
    props: { celebrities, dateStr },
    revalidate: 86400,
  }
}

function BirthdayLookup() {
  const router = useRouter()
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')

  const maxDays = month ? MONTH_DAYS[parseInt(month)] : 31

  function handleLookup() {
    const m = parseInt(month)
    const d = parseInt(day)
    if (!m || !d || d < 1 || d > MONTH_DAYS[m]) return
    router.push(`/born-on/${MONTH_NAMES[m]}-${d}`)
  }

  return (
    <div className="card mb-8">
      <p className="text-sm font-medium text-slate-700 mb-3">Look up any birthday</p>
      <div className="flex gap-2">
        <select
          value={month}
          onChange={e => { setMonth(e.target.value); setDay('') }}
          className="input text-sm flex-1"
        >
          <option value="">Month</option>
          {MONTH_LABELS.map((label, i) => (
            <option key={i} value={i}>{label}</option>
          ))}
        </select>
        <select
          value={day}
          onChange={e => setDay(e.target.value)}
          className="input text-sm w-20"
          disabled={!month}
        >
          <option value="">Day</option>
          {Array.from({ length: maxDays }, (_, i) => i + 1).map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button
          onClick={handleLookup}
          disabled={!month || !day}
          className="btn-primary text-sm px-4"
        >
          Go
        </button>
      </div>
    </div>
  )
}

export default function BornTodayPage({ celebrities, dateStr }: Props) {
  return (
    <>
      <Head>
        <title>Born Today — Celebrity Birthdays</title>
        <meta name="description" content="See which celebrities and famous people were born on today's date. Explore their birth charts, Sun signs, and astrological profiles." />
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display text-4xl tracking-wide mb-2">Born on {dateStr}</h1>
        <p className="text-slate-500 mb-6">
          {celebrities.length} {celebrities.length === 1 ? 'celebrity' : 'celebrities'} in our library {celebrities.length === 1 ? 'was' : 'were'} born on this date.
        </p>

        <BirthdayLookup />

        {celebrities.length > 0 ? (
          <div className="space-y-4">
            {celebrities.map((celeb) => {
              const sunEc = celeb.sun_sign ? getElementColor(celeb.sun_sign) : null
              const moonEc = celeb.moon_sign ? getElementColor(celeb.moon_sign) : null
              const risingEc = celeb.rising_sign ? getElementColor(celeb.rising_sign) : null

              return (
                <Link
                  key={celeb.slug}
                  href={`/celebrity-birth-charts/${celeb.slug}`}
                  className="card block hover:border-slate-400 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    {celeb.image_url ? (
                      <Image src={`/api/img/${celeb.slug}`} alt={celeb.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0" />
                    ) : (
                      <div className={`w-12 h-12 rounded-full ${sunEc?.bg || 'bg-slate-100'} flex items-center justify-center text-lg shrink-0`}>
                        {celeb.sun_sign ? <SignGlyph sign={celeb.sun_sign} decorative /> : '✦'}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-display text-xl tracking-wide group-hover:text-slate-600 transition-colors">{celeb.name}</p>
                      <p className="text-slate-500 text-sm mt-0.5">
                        {celeb.birth_date} · {celeb.birth_city}
                        {celeb.category && <span className="text-slate-400"> · {celeb.category}</span>}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {sunEc && celeb.sun_sign && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${sunEc.bg} ${sunEc.text}`}>☉ {celeb.sun_sign}</span>
                        )}
                        {moonEc && celeb.moon_sign && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${moonEc.bg} ${moonEc.text}`}>☽ {celeb.moon_sign}</span>
                        )}
                        {risingEc && celeb.rising_sign && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${risingEc.bg} ${risingEc.text}`}>↑ {celeb.rising_sign}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="card text-center py-10">
            <p className="text-slate-500">No celebrities in our library were born on {dateStr}... yet. Our directory grows daily.</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/celebrity-birth-charts" className="btn-outline">Browse All Celebrities</Link>
        </div>
      </main>
    </>
  )
}
