import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { getUser } from '@/lib/auth'
import { queryOne, parseJsonb } from '@/lib/db'
import { decryptBirthFields } from '@/lib/crypto'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import { redesignOn } from '@/lib/redesign'
import type { Reading } from '@/lib/reading/build'
import type { VBody } from '@/lib/redesign/celeb-view'
import ReadingPage from '@/components/redesign/ReadingPage'

// The full reading of a chart the visitor owns: their own, or one they saved for
// someone else (subject name set; the page names that person and notes the
// entries are written as if to them). Everyone else goes back to the chart
// page. Private: never indexed.
interface Props { r: Reading; chartId: string; sky: { bodies: VBody[]; asc: number | null; mc: number | null }; subject: string | null; own: boolean }

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const id = context.params?.id as string
  const back = { redirect: { destination: `/birth-chart/${encodeURIComponent(id)}`, permanent: false } }
  if (!redesignOn('mine')) return back
  const [user, row] = await Promise.all([
    getUser(context),
    queryOne<{ id: string; user_id: string; birth_date: string; birth_time: string | null; birth_city: string; chart_data: unknown; subject_name: string | null; birth_time_enc: string | null; birth_city_enc: string | null; birth_lat_enc: string | null; birth_lng_enc: string | null; birth_lat: number; birth_lng: number }>(
      'SELECT id, user_id, birth_date, birth_time, birth_city, birth_lat, birth_lng, chart_data, subject_name, birth_time_enc, birth_city_enc, birth_lat_enc, birth_lng_enc FROM birth_charts WHERE id = $1',
      [id],
    ),
  ])
  if (!row) return { notFound: true }
  if (!user || user.id !== row.user_id) return back
  const subject = row.subject_name?.trim() || null
  const chart = { ...row, ...decryptBirthFields(row) }
  const data = parseJsonb<BirthChartData | null>(chart.chart_data)
  if (!data) return back

  const { buildMineView } = await import('@/lib/redesign/mine-view')
  const { buildReading } = await import('@/lib/reading/build')
  const view = await buildMineView({ chart: data, birthDate: chart.birth_date, birthTime: chart.birth_time ?? null, birthCity: chart.birth_city ?? '', subjectName: subject, lat: chart.birth_lat, lng: chart.birth_lng })
  const r = buildReading(view, { date: chart.birth_date, time: chart.birth_time ?? null, city: chart.birth_city ?? '' }, subject)
  context.res.setHeader('Cache-Control', 'private, no-store')
  return { props: JSON.parse(JSON.stringify({ r, chartId: chart.id, sky: { bodies: view.bodies, asc: view.asc, mc: view.mc }, subject, own: !subject })) }
}

export default function ReadingRoute({ r, chartId, sky, subject }: Props) {
  return (
    <>
      <Head>
        {/* Plain on purpose: Analytics records page titles, and names are private. */}
        <title>Full reading | Birth Chart Library</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <ReadingPage r={r} chartId={chartId} sky={sky} subject={subject} />
    </>
  )
}
