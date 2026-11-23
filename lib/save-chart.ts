import { query, queryOne, queryCount } from '@/lib/db'
import { validateCoordinates } from '@/lib/validate'
import { sendChartCreatedEmail } from '@/lib/emails'
import { buildChart } from '@/lib/swisseph/buildChart'
import { UNDER_AGE_MESSAGE, isUnderAge } from '@/lib/age'
import { encryptField, encryptNumeric } from '@/lib/crypto'

// Saving a birth chart to an account, shared by the chart form
// (/api/birth-chart) and sign up (/api/auth/signup, which saves the chart the
// reader just made in the same step as creating the account). Callers do the
// auth, rate limit and captcha; this checks the fields, builds and stores.

export interface ChartFields {
  label?: unknown
  birthDate?: unknown
  birthTime?: unknown
  birthCity?: unknown
  birthLat?: unknown
  birthLng?: unknown
  isForSelf?: unknown
  subjectName?: unknown
}

// YYYY-MM-DD and on the calendar (February 30 would roll into March).
function realDate(s: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const d = new Date(`${s}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

/** Returns an error message for bad input, or null when the fields are usable. */
export function checkChartFields(f: ChartFields): string | null {
  const { label, birthDate, birthCity, subjectName } = f
  const birthTime = f.birthTime || null
  if (!birthDate || !birthCity) return 'Missing required fields'
  const coordError = validateCoordinates(f.birthLat as number, f.birthLng as number)
  if (coordError) return coordError
  if (typeof birthDate !== 'string' || !realDate(birthDate)) return 'Invalid birth date'
  if (f.isForSelf !== false && isUnderAge(birthDate)) return UNDER_AGE_MESSAGE
  if (label && (typeof label !== 'string' || label.length > 200)) return 'Label too long'
  if (subjectName && (typeof subjectName !== 'string' || subjectName.length > 200)) return 'Name too long'
  if (typeof birthCity !== 'string' || birthCity.length > 500) return 'Invalid city'
  if (birthTime && (typeof birthTime !== 'string' || !/^\d{2}:\d{2}$/.test(birthTime))) return 'Invalid birth time format'
  return null
}

/** Builds and stores the chart (private). Call checkChartFields first. */
export async function saveChart(user: { id: string; email?: string | null }, f: ChartFields): Promise<string> {
  const birthDate = f.birthDate as string
  const birthTime = (f.birthTime as string) || null
  const birthCity = f.birthCity as string
  const birthLat = f.birthLat as number
  const birthLng = f.birthLng as number
  const subjectName = (f.subjectName as string) || null
  const label = (f.label as string) || null

  const { chartData, timezone } = await buildChart(birthDate, birthTime, birthLat, birthLng)

  const primaryCount = await queryCount('SELECT count(*) FROM birth_charts WHERE user_id = $1 AND is_primary = true', [user.id])
  const shouldBePrimary = f.isForSelf !== false && primaryCount === 0

  // Encrypted columns only (migration 0013 rollout, step 5). The plaintext
  // birth_time, birth_city, birth_lat and birth_lng columns are left NULL and
  // will be dropped; every read goes through decryptBirthFields (lib/crypto.ts).
  const chart = await queryOne<{ id: string }>(
    `INSERT INTO birth_charts (user_id, label, birth_date, birth_time, birth_city, birth_lat, birth_lng, timezone, chart_data, is_public, is_primary, subject_name, birth_time_enc, birth_city_enc, birth_lat_enc, birth_lng_enc)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
     RETURNING id`,
    [
      user.id,
      label || (f.isForSelf !== false ? 'My Chart' : subjectName || 'Chart'),
      birthDate,
      null, // birth_time (plaintext, retired)
      null, // birth_city
      null, // birth_lat
      null, // birth_lng
      timezone,
      JSON.stringify(chartData),
      false,
      shouldBePrimary,
      f.isForSelf !== false ? null : subjectName,
      encryptField(birthTime),
      encryptField(birthCity),
      encryptNumeric(birthLat),
      encryptNumeric(birthLng),
    ]
  )
  if (!chart) throw new Error('DB insert returned no row')

  if (shouldBePrimary && user.email) {
    const sunSign = chartData.planets.find((p: { planet: string }) => p.planet === 'SUN')?.sign || 'Unknown'
    const moonSign = chartData.planets.find((p: { planet: string }) => p.planet === 'MOON')?.sign || 'Unknown'
    const risingSign = chartData.ascendantSign || 'Unknown'
    sendChartCreatedEmail(user.email, sunSign, moonSign, risingSign).catch(() => {})
  }
  return chart.id
}

/** Corrects a saved chart's birth details in place: same id, link, name, main
 *  chart and private or public. Call checkChartFields first. Returns false when
 *  the chart is not this reader's. */
export async function updateChart(userId: string, id: string, f: ChartFields): Promise<boolean> {
  const birthTime = (f.birthTime as string) || null
  const lat = f.birthLat as number, lng = f.birthLng as number
  const { chartData, timezone } = await buildChart(f.birthDate as string, birthTime, lat, lng)
  // The plaintext columns are cleared too: an older row may still have one, and
  // decryptBirthFields would fall back to it when the new time is "unknown".
  const rows = await query<{ id: string }>(
    `UPDATE birth_charts SET birth_date = $1, timezone = $2, chart_data = $3,
       birth_time = NULL, birth_city = NULL, birth_lat = NULL, birth_lng = NULL,
       birth_time_enc = $4, birth_city_enc = $5, birth_lat_enc = $6, birth_lng_enc = $7
     WHERE id = $8 AND user_id = $9 RETURNING id`,
    [f.birthDate, timezone, JSON.stringify(chartData), encryptField(birthTime), encryptField(f.birthCity as string), encryptNumeric(lat), encryptNumeric(lng), id, userId],
  )
  return rows.length > 0
}
