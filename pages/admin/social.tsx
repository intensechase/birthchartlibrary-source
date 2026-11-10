import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { withAdminAuth } from '@/lib/ssr'
import { getDailySky } from '@/lib/swisseph/daily-sky'
import { MOON_WEATHER, MOON_REFLECTIONS } from '@/lib/interpretations/daily'
import { SIGN_SYMBOLS, getElementColor } from '@/lib/zodiac-colors'
import { PLANET_SYMBOLS } from '@/lib/constants'
import DashboardLayout from '@/components/DashboardLayout'

const SIGN_ELEMENT: Record<string, string> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
}

const ELEMENT_HASHTAG: Record<string, string> = {
  Fire: '#FireSign', Earth: '#EarthSign', Air: '#AirSign', Water: '#WaterSign',
}

interface PlanetPos {
  planet: string
  sign: string
  retrograde: boolean
}

interface Props {
  moonSign: string
  planets: PlanetPos[]
  dateStr: string
  todayISO: string
  captions: {
    instagram: string
    twitter: string
    pinterest: string
    threads: string
  }
}

function CopyBox({ label, text, platform }: { label: string; text: string; platform: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const limit = platform === 'twitter' ? 280 : platform === 'threads' ? 500 : null
  const overLimit = limit && text.length > limit

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</p>
        <div className="flex items-center gap-3">
          <span className={`text-xs ${overLimit ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
            {text.length}{limit ? ` / ${limit}` : ''} chars
          </span>
          <button onClick={copy} className="text-xs btn-outline py-1 px-3">
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <textarea
        readOnly
        value={text}
        rows={Math.min(text.split('\n').length + 2, 12)}
        className="w-full text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 resize-none font-mono leading-relaxed"
      />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = withAdminAuth(async () => {
  const now = new Date()
  const sky = await getDailySky()
  const { moonSign, planets } = sky

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC',
  })
  const month = now.getUTCMonth() + 1
  const day = now.getUTCDate()
  const todayISO = `${now.getUTCFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const symbol = SIGN_SYMBOLS[moonSign] || '☽'
  const weather = MOON_WEATHER[moonSign] || ''
  const reflection = MOON_REFLECTIONS[moonSign] || ''
  const element = SIGN_ELEMENT[moonSign] || ''
  const elementTag = ELEMENT_HASHTAG[element] || ''
  const retrogrades = planets.filter(p => p.retrograde).map(p => p.planet)
  const retroNote = retrogrades.length > 0
    ? `\n\n${retrogrades.map(p => `${PLANET_SYMBOLS[p] || p} ${p} is retrograde`).join(' · ')}`
    : ''

  const url = `https://birthchartlibrary.com/daily/${todayISO}`
  const signTag = `#${moonSign}Moon #MoonIn${moonSign}`

  const instagram = `${symbol} Moon in ${moonSign} — ${dateStr}

${weather}${retroNote}

"${reflection}"

What does today's sky mean for your chart? Get your free birth chart at birthchartlibrary.com ✨

${signTag} #DailyMoon #MoonSign #Astrology #AstrologyDaily #BirthChart ${elementTag} #NatalChart #AstrologyMemes`

  const twitter = `${symbol} Moon in ${moonSign} today

${weather.length > 160 ? weather.slice(0, 157) + '...' : weather}${retroNote}

${url}`

  const threads = `${symbol} Moon in ${moonSign} — ${dateStr}

${weather}${retroNote}

"${reflection}"

Full daily sky → ${url}`

  const pinterest = `Moon in ${moonSign}: ${weather} "${reflection}" Explore what today's sky means for your birth chart — free natal chart calculator with 1,700+ interpretations. ${url}`

  return {
    props: {
      moonSign,
      planets,
      dateStr,
      todayISO,
      captions: { instagram, twitter, pinterest, threads },
    },
  }
})

export default function AdminSocialPage({ moonSign, planets, dateStr, todayISO, captions }: Props) {
  const ec = getElementColor(moonSign)
  const symbol = SIGN_SYMBOLS[moonSign] || '☽'
  const retrogrades = planets.filter(p => p.retrograde)
  const chipPlanets = planets.filter(p => ['SUN', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN'].includes(p.planet))

  return (
    <DashboardLayout>
      <Head><title>Social Post Generator — Admin</title></Head>
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Admin · Social</p>
          <h1 className="font-display text-3xl tracking-wide dark:text-slate-100">Daily Post Generator</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{dateStr}</p>
        </div>

        {/* Today's Sky summary */}
        <div className={`rounded-xl border p-5 mb-8 bg-gradient-to-br ${ec.gradient} ${ec.border}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{symbol}</span>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Moon in</p>
              <p className="font-display text-2xl tracking-wide dark:text-slate-100">{moonSign}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {chipPlanets.map(p => (
              <span key={p.planet} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/40">
                <span className="text-slate-400">{PLANET_SYMBOLS[p.planet]}</span>
                <span className="text-slate-600 dark:text-slate-300">{p.sign}</span>
                {p.retrograde && <span className="text-amber-500 font-medium">℞</span>}
              </span>
            ))}
          </div>
          {retrogrades.length > 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 font-medium">
              ℞ Retrograde: {retrogrades.map(p => p.planet).join(', ')}
            </p>
          )}
        </div>

        {/* Platform captions */}
        <div className="mb-2">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-5">Ready-to-post captions</p>
          <CopyBox label="Instagram / Facebook" text={captions.instagram} platform="instagram" />
          <CopyBox label="X / Twitter" text={captions.twitter} platform="twitter" />
          <CopyBox label="Threads" text={captions.threads} platform="threads" />
          <CopyBox label="Pinterest" text={captions.pinterest} platform="pinterest" />
        </div>

        {/* Canva reminder */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-5 py-4 mt-8">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Visual checklist</p>
          <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
            <li>☐ Update Canva template → Moon in <strong>{moonSign}</strong> {symbol}</li>
            <li>☐ Export image (1080×1080 for Instagram/Threads, 1000×1500 for Pinterest)</li>
            <li>☐ Schedule in Buffer with image attached</li>
            <li>☐ <a href={`/daily/${todayISO}`} target="_blank" rel="noreferrer" className="underline hover:text-slate-700 dark:hover:text-slate-200">Preview today&apos;s full sky page →</a></li>
          </ul>
        </div>
      </main>
    </DashboardLayout>
  )
}
