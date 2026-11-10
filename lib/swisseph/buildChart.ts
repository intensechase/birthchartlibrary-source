import tzlookup from 'tz-lookup'
import { fromZonedTime } from 'date-fns-tz'
import { calculateBirthChart, toJulianDay } from './calculate'
import type { BirthChartData } from './calculate'

export interface ChartResult {
  chartData: BirthChartData
  timezone: string
}

export async function buildChart(
  birthDate: string,
  birthTime: string | null | undefined,
  lat: number,
  lng: number,
): Promise<ChartResult> {
  const timezone = tzlookup(lat, lng)
  if (!timezone) throw new Error('Could not determine timezone for location')

  const localDateTimeStr = birthTime
    ? `${birthDate}T${birthTime}:00`
    : `${birthDate}T12:00:00`

  const utcDate = fromZonedTime(localDateTimeStr, timezone)
  const year = utcDate.getUTCFullYear()
  const month = utcDate.getUTCMonth() + 1
  const day = utcDate.getUTCDate()
  const utcHour = utcDate.getUTCHours() + utcDate.getUTCMinutes() / 60

  const jd = await toJulianDay(year, month, day, utcHour)
  const chartData = await calculateBirthChart(jd, lat, lng)

  return { chartData, timezone }
}
