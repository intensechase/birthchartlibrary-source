import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { getUser, clearAuthCookie } from '@/lib/auth'
import { query, queryOne, parseJsonb } from '@/lib/db'
import { decryptBirthFields } from '@/lib/crypto'
import { formatBirthDate, formatBirthTime } from '@/lib/format-birth'
import { settledSign } from '@/lib/settled-sign'
import { DISC } from '@/lib/redesign/astro'
import type { VDisc } from '@/lib/redesign/celeb-view'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import { Disc } from '@/components/redesign/Disc'
import AccountShell from '@/components/redesign/AccountShell'
import PersonItem, { type PersonRow } from '@/components/redesign/AccountRows'

// Your charts (owner, 11/23): the reader's chart and their day first, then
// their people and comparisons. Settings have their own page.
interface Row { id: string; label: string | null; birth_date: string; birth_time?: string | null; birth_time_enc?: string | null; birth_city: string | null; birth_city_enc?: string | null; subject_name: string | null; chart_data: unknown }

interface Props {
  main: { id: string; when: string; city: string; signs: { role: string; sign: string }[]; today: string | null } | null
  people: PersonRow[]
  readings: { hash: string; names: string; sub: string }[]
}

const COLS = 'id, label, birth_date, birth_time, birth_time_enc, birth_city, birth_city_enc, subject_name, chart_data'

function read(row: Row) {
  const { birth_time, birth_city } = decryptBirthFields(row)
  const cd = parseJsonb<BirthChartData | null>(row.chart_data)
  const of = (id: string) => settledSign(cd?.planets.find(p => p.planet === id), !!birth_time)
  return { cd, time: birth_time, city: birth_city ?? '', sun: of('SUN'), moon: of('MOON'), rising: birth_time ? cd?.ascendantSign ?? null : null }
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const user = await getUser(context)
  if (!user) {
    // See daily-horoscope.tsx: without clearing here, an edge-valid but
    // DB-orphaned token loops forever between /login and this page.
    clearAuthCookie(context.res)
    return { redirect: { destination: '/login', permanent: false } }
  }
  // Email links land on /account with their result; that belongs to settings.
  const q = context.resolvedUrl.split('?')[1] ?? ''
  if (/(^|&)(emailChanged|emailError|emailVerifyError)=/.test(q)) {
    return { redirect: { destination: `/account/settings?${q}`, permanent: false } }
  }

  const [mainRow, otherRows, readingRows] = await Promise.all([
    queryOne<Row>(`SELECT ${COLS} FROM birth_charts WHERE user_id = $1 AND is_primary = true LIMIT 1`, [user.id]),
    query<Row>(`SELECT ${COLS} FROM birth_charts WHERE user_id = $1 AND is_primary = false ORDER BY created_at DESC`, [user.id]),
    query<{ hash: string; a: string | null; b: string | null; type: string; saved: string }>(
      `SELECT hash, person_a->>'name' AS a, person_b->>'name' AS b, relationship_type AS type, to_char(created_at, 'FMMonth FMDD, YYYY') AS saved
       FROM synastry_readings WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [user.id]
    ),
  ])

  let main: Props['main'] = null
  if (mainRow) {
    const r = read(mainRow)
    let today: string | null = null
    try {
      if (r.cd) {
        const { calculateDailyTransits } = await import('@/lib/swisseph/transits')
        const sign = (await calculateDailyTransits(r.cd)).moonSign
        today = sign === 'Unknown' ? null : sign
      }
    } catch { /* the line is left out */ }
    main = {
      id: mainRow.id,
      when: [formatBirthDate(mainRow.birth_date), r.time ? formatBirthTime(r.time) : 'no birth time'].join(', '),
      city: r.city,
      signs: ([['Sun', r.sun], ['Moon', r.moon], ['Rising', r.rising]] as const).flatMap(([role, sign]) => (sign ? [{ role, sign }] : [])),
      today,
    }
  }
  const people = otherRows.map(row => {
    const r = read(row)
    return { id: row.id, name: row.subject_name || row.label || 'Unnamed chart', sub: [r.sun && `${r.sun} Sun`, formatBirthDate(row.birth_date), r.city.split(',')[0]].filter(Boolean).join(' · ') }
  })
  // The reader's own side of a saved comparison reads "You".
  const who = (n: string | null, other: string) => (n && mainRow && !mainRow.subject_name && (n === mainRow.label || n === 'My Chart') ? 'You' : n || other)

  return {
    props: {
      main,
      people,
      readings: readingRows.map(r => ({ hash: r.hash, names: `${who(r.a, 'Person A')} and ${who(r.b, 'Person B')}`, sub: `${r.type[0].toUpperCase()}${r.type.slice(1)}, saved ${r.saved}` })),
    },
  }
}

const BIG: Record<string, VDisc> = { Sun: { color: DISC.SUN, icon: 'sun' }, Moon: { color: DISC.MOON, icon: 'moon' }, Rising: { color: DISC.RISING, icon: 'ascendant' } }

export default function AccountPage({ main, people, readings }: Props) {
  const fresh = !main && !people.length && !readings.length
  return (
    <>
      <Head>
        <title>Your charts | Birth Chart Library</title>
        <meta name="robots" content="noindex" />
      </Head>
      <AccountShell tab="charts" title="Your charts">
        {main ? (
          <section className="you">
            <div className="who2">
              <div>
                <h2>You</h2>
                <p>{main.when}</p>
                <p>{main.city}</p>
              </div>
              <ul className="trio">
                {main.signs.map(s => (
                  <li key={s.role}><Disc disc={BIG[s.role]} size={40} iconSize={22} /><span><b>{s.sign}</b><small>{s.role}</small></span></li>
                ))}
              </ul>
            </div>
            <div className="acts">
              <Link className="btn" href={`/birth-chart/${main.id}`}>Open my chart</Link>
              <Link className="tlink" href={`/birth-chart/${main.id}/reading`}>Full reading</Link>
              <Link className="tlink" href={`/birth-chart/${main.id}/edit`}>Edit birth details</Link>
            </div>
            {main.today ? <p className="day"><span>Today the Moon is in {main.today}.</span> <Link className="tlink" href="/daily-horoscope">Your day</Link></p> : null}
          </section>
        ) : (
          <section className="you">
            <h2>Make your chart</h2>
            <p>Your birth date, time and place are all it takes. Your chart stays private unless you share it.</p>
            <div className="acts"><Link className="btn" href="/birth-chart?new=1">Make my chart</Link></div>
          </section>
        )}

        {fresh ? null : (
          <>
            <section>
              <div className="shead"><h2 id="people">People</h2><Link className="tlink" href="/birth-chart?for=someone">Add someone</Link></div>
              {people.length
                ? <ul className="plist">{people.map(p => <PersonItem key={p.id} p={p} />)}</ul>
                : <p className="none">Nobody here yet. Make a chart for a friend, a partner, or anyone you are curious about.</p>}
            </section>
            <section>
              <div className="shead"><h2 id="comparisons">Comparisons</h2><Link className="tlink" href="/calculators/synastry">Compare two charts</Link></div>
              {readings.length ? (
                <ul className="plist">
                  {readings.map(r => (
                    <li key={r.hash}>
                      <div><b>{r.names}</b><small>{r.sub}</small></div>
                      <div className="pacts"><Link href={`/synastry/${r.hash}`} aria-label={`Open ${r.names}`}>Open</Link></div>
                    </li>
                  ))}
                </ul>
              ) : <p className="none">Compare any two charts, yours, a partner’s or a celebrity’s, and save the reading to find it here.</p>}
            </section>
          </>
        )}
      </AccountShell>
    </>
  )
}
