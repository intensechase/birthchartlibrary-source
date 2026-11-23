import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { getUser } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import { decryptBirthFields } from '@/lib/crypto'
import { titleOf } from '@/components/redesign/MinePage'
import MineForm, { type MineFormValues } from '@/components/redesign/MineForm'

// Correct a saved chart's birth details. The same chart is worked out again:
// its link, name, and private or public stay as they are.
interface Props { id: string; form: MineFormValues; subject: string | null; own: boolean }

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const id = context.params?.id as string
  const user = await getUser(context)
  if (!user) return { redirect: { destination: `/login?redirectTo=${encodeURIComponent(`/birth-chart/${id}/edit`)}`, permanent: false } }
  const row = await queryOne<{ id: string; birth_date: string; subject_name: string | null; birth_time: string | null; birth_time_enc: string | null; birth_city: string | null; birth_city_enc: string | null; birth_lat: number | null; birth_lat_enc: string | null; birth_lng: number | null; birth_lng_enc: string | null }>(
    'SELECT id, birth_date, subject_name, birth_time, birth_time_enc, birth_city, birth_city_enc, birth_lat, birth_lat_enc, birth_lng, birth_lng_enc FROM birth_charts WHERE id = $1 AND user_id = $2',
    [id, user.id],
  )
  if (!row) return { notFound: true }
  const d = decryptBirthFields(row)
  const subject = row.subject_name?.trim() || null
  context.res.setHeader('Cache-Control', 'private, no-store')
  return {
    props: {
      id: row.id, subject, own: !subject,
      form: { label: '', subjectName: subject ?? '', birthDate: String(row.birth_date).slice(0, 10), birthTime: d.birth_time?.slice(0, 5) ?? '', birthCity: d.birth_city ?? '', birthLat: d.birth_lat ?? 0, birthLng: d.birth_lng ?? 0 },
    },
  }
}

export default function EditChart({ id, form, subject }: Props) {
  async function submit(f: MineFormValues): Promise<string | null> {
    try {
      const res = await fetch(`/api/birth-chart/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birth: { birthDate: f.birthDate, birthTime: f.birthTime || null, birthCity: f.birthCity, birthLat: f.birthLat, birthLng: f.birthLng } }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        return data?.error ?? 'That did not work. Check the details and try again.'
      }
    } catch {
      return 'No connection. Check your internet and try again.'
    }
    window.location.href = `/birth-chart/${id}`
    return null
  }
  return (
    <>
      <Head>
        {/* Plain on purpose: Analytics records page titles, and names are private. */}
        <title>Edit birth details | Birth Chart Library</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="rdp">
        <MineForm
          title="Edit birth details"
          sub={`${subject ? titleOf(subject).whose.replace(/^./, c => c.toUpperCase()) : 'Your'} chart is worked out again from these. The link stays the same. Comparisons you already saved keep the old details.`}
          submitText="Save and see the chart"
          onSubmit={submit}
          edit={{ form, forSomeone: !!subject }}
          after={<p className="editback"><Link className="tlink" href={`/birth-chart/${id}`}>Cancel</Link></p>}
        />
      </main>
    </>
  )
}
