import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { getUser } from '@/lib/auth'
import { queryOne, parseJsonb } from '@/lib/db'
import { decryptBirthFields } from '@/lib/crypto'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import { buildInterpBundle } from '@/lib/chartInterp'
import ChartDetail from '@/components/ChartDetail'
import DashboardLayout from '@/components/DashboardLayout'
import type { Interpretations } from '@/components/chart/PlanetCard'

interface Props {
  notFound?: boolean
  noData?: boolean
  chartData?: BirthChartData
  label?: string
  birthDate?: string
  birthTime?: string | null
  birthCity?: string
  isOwner?: boolean
  isPublic?: boolean
  chartId?: string
  sunSign?: string | null
  moonSign?: string | null
  risingSign?: string | null
  mercurySign?: string | null
  venusSign?: string | null
  marsSign?: string | null
  interp?: Interpretations
  metaTitle?: string
  metaDescription?: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const id = context.params?.id as string

  const [user, chartRow] = await Promise.all([
    getUser(context),
    queryOne<{ id: string; user_id: string; label: string; birth_date: string; birth_time: string | null; birth_city: string; birth_lat: number; birth_lng: number; timezone: string; chart_data: unknown; is_public: boolean; is_primary: boolean; subject_name: string | null; birth_time_enc: string | null; birth_city_enc: string | null; birth_lat_enc: string | null; birth_lng_enc: string | null }>(
      'SELECT id, user_id, label, birth_date, birth_time, birth_city, birth_lat, birth_lng, timezone, chart_data, is_public, is_primary, subject_name, birth_time_enc, birth_city_enc, birth_lat_enc, birth_lng_enc FROM birth_charts WHERE id = $1',
      [id]
    ),
  ])

  if (!chartRow) return { notFound: true }

  // Verify access: owner or public
  if (!chartRow.is_public && (!user || user.id !== chartRow.user_id)) {
    return { notFound: true }
  }

  // Prefer encrypted columns; fall back to plaintext during the dual-write
  // window (migration 0013). After the backfill + drop, only _enc remains.
  const decrypted = decryptBirthFields(chartRow)
  const chart = { ...chartRow, ...decrypted }

  const chartData = parseJsonb<BirthChartData | null>(chart.chart_data)
  if (!chartData) {
    return {
      props: {
        noData: true,
        metaTitle: `${chart.label || 'Chart'} — Birth Chart`,
        metaDescription: 'Chart data is not available.',
      },
    }
  }

  const interp = buildInterpBundle(chartData)

  const isOwner = !!user && user.id === chart.user_id

  const sunSign     = chartData.planets.find(p => p.planet === 'SUN')?.sign     ?? null
  const moonSign    = chartData.planets.find(p => p.planet === 'MOON')?.sign    ?? null
  const risingSign  = chartData.ascendantSign ?? null
  const mercurySign = chartData.planets.find(p => p.planet === 'MERCURY')?.sign ?? null
  const venusSign   = chartData.planets.find(p => p.planet === 'VENUS')?.sign   ?? null
  const marsSign    = chartData.planets.find(p => p.planet === 'MARS')?.sign    ?? null

  return {
    props: {
      chartData,
      label: chart.label || 'My Chart',
      birthDate: chart.birth_date,
      birthTime: chart.birth_time ?? null,
      birthCity: chart.birth_city ?? '',
      isOwner,
      isPublic: chart.is_public,
      chartId: chart.id,
      sunSign,
      moonSign,
      risingSign,
      mercurySign,
      venusSign,
      marsSign,
      interp,
      metaTitle: `${chart.label || 'My Chart'} — Birth Chart`,
      metaDescription: `Birth chart for ${chart.label || 'this person'}, born ${chart.birth_date} in ${chart.birth_city}. Full natal chart with planet positions, house placements, and detailed interpretations.`,
    },
  }
}

export default function ChartDetailPage({ noData, chartData, label, birthDate, birthTime, birthCity, isOwner, isPublic: initialIsPublic, chartId, sunSign, moonSign, risingSign, mercurySign, venusSign, marsSign, interp, metaTitle, metaDescription }: Props) {
  const [isPublic, setIsPublic] = useState(initialIsPublic ?? false)
  const [shareLoading, setShareLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  async function togglePublic() {
    if (!chartId) return
    setShareLoading(true)
    const next = !isPublic
    const res = await fetch(`/api/birth-chart/${chartId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_public: next }),
    })
    if (res.ok) setIsPublic(next)
    setShareLoading(false)
  }

  function copyLink() {
    navigator.clipboard.writeText(`https://birthchartlibrary.com/birth-chart/${chartId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareUrl = `https://birthchartlibrary.com/birth-chart/${chartId}`

  function buildOgUrl(sq = false) {
    const p = new URLSearchParams({
      name:    label    || 'Birth Chart',
      sun:     sunSign  || '',
      moon:    moonSign || '',
      rising:  risingSign  || '',
      mercury: mercurySign || '',
      venus:   venusSign   || '',
      mars:    marsSign    || '',
      date:    birthDate   || '',
      city:    birthCity   || '',
    })
    if (sq) p.set('sq', '1')
    return `https://birthchartlibrary.com/api/og/chart?${p.toString()}`
  }

  const ogImageUrl = chartId ? buildOgUrl() : null

  async function downloadCard(sq = false) {
    if (!chartId) return
    setDownloading(true)
    try {
      const res = await fetch(buildOgUrl(sq))
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${(label || 'birth-chart').toLowerCase().replace(/\s+/g, '-')}${sq ? '-square' : ''}.png`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({
        title: `${label || 'My'} Birth Chart`,
        text: [sunSign && `${sunSign} Sun`, moonSign && `${moonSign} Moon`, risingSign && `${risingSign} Rising`].filter(Boolean).join(', '),
        url: shareUrl,
      }).catch(() => {})
    } else {
      copyLink()
    }
  }

  const head = (
    <Head>
      <title>{`${metaTitle || 'Birth Chart'} | Birth Chart Library`}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
      {!isPublic && <meta name="robots" content="noindex" />}
      {isPublic && ogImageUrl && (
        <>
          <meta property="og:title" content={metaTitle || 'Birth Chart'} />
          <meta property="og:description" content={metaDescription || ''} />
          <meta property="og:image" content={ogImageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content={shareUrl} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={metaTitle || 'Birth Chart'} />
          <meta name="twitter:description" content={metaDescription || ''} />
          <meta name="twitter:image" content={ogImageUrl} />
        </>
      )}
    </Head>
  )

  // Share strip shown at the top for owners
  const shareStrip = isOwner && chartId ? (
    <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={togglePublic}
          disabled={shareLoading}
          aria-label={isPublic ? 'Make chart private' : 'Make chart public'}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${isPublic ? 'bg-slate-800 dark:bg-slate-400' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {isPublic ? 'Public — anyone with the link can view' : 'Private — only you can see this'}
        </span>
      </div>
      {isPublic && (
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <input
            readOnly
            value={shareUrl}
            className="input text-xs text-slate-500 flex-1 sm:w-56"
            onClick={e => (e.target as HTMLInputElement).select()}
          />
          <button onClick={copyLink} className="btn-outline text-xs py-2 px-3 shrink-0">
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          <button onClick={() => downloadCard(false)} disabled={downloading} className="btn-outline text-xs py-2 px-3 shrink-0" title="Download 1200×630 card">
            {downloading ? '...' : '↓ Card'}
          </button>
          <button onClick={() => downloadCard(true)} disabled={downloading} className="btn-outline text-xs py-2 px-3 shrink-0" title="Download 1080×1080 for Instagram">
            □ Instagram
          </button>
          <button onClick={nativeShare} className="btn-outline text-xs py-2 px-3 shrink-0">
            Share
          </button>
        </div>
      )}
    </div>
  ) : null

  // CTA shown to guests viewing a public chart
  const guestCta = !isOwner && isPublic ? (
    <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-5">
      <div>
        <p className="font-semibold text-slate-800 text-base">Curious what your chart says?</p>
        <p className="text-slate-500 text-sm mt-1">Get your free birth chart — Sun, Moon, Rising, and 1,700+ interpretations.</p>
      </div>
      <Link href="/signup?ref=shared-chart" className="btn-primary shrink-0 px-6 py-2.5 text-sm whitespace-nowrap">
        Get My Free Chart
      </Link>
    </div>
  ) : null

  const content = (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {noData ? (
        <div className="card text-center py-10">
          <p className="text-slate-500">Chart data is not available. Please try generating your chart again.</p>
        </div>
      ) : chartData && interp ? (
        <>
          {shareStrip}
          <ChartDetail
            chartData={chartData}
            label={label!}
            birthDate={birthDate!}
            birthTime={birthTime!}
            birthCity={birthCity!}
            interp={interp}
          />
          {guestCta}
        </>
      ) : null}
    </main>
  )

  if (!isOwner) {
    // Public view: use the site's standard header/footer (via _app.tsx) without the dashboard sidebar
    return (
      <>
        {head}
        {content}
      </>
    )
  }

  return (
    <DashboardLayout>
      {head}
      {content}
    </DashboardLayout>
  )
}
