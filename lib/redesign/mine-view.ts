// SERVER ONLY. A visitor's own chart read exactly like a celebrity chart (stage
// 'mine'): the same view builder, in "your" voice when it is the visitor's own,
// no time grade, no ads. Nothing here stores anything.
import type { BirthChartData } from '@/lib/swisseph/calculate'
import { buildCelebView, type CelebView } from './celeb-view'
import { ENTRIES } from '@/lib/reading/entries'

export interface MineInput {
  chart: BirthChartData
  birthDate: string
  birthTime: string | null
  birthCity: string
  // With no time, used to check for a Sun or Moon that changed sign that day.
  lat?: number | null
  lng?: number | null
  // null = the visitor's own chart ("your"); a name = someone else's.
  subjectName: string | null
}

const KEY: Record<string, string> = { sun: 'SUN', moon: 'MOON', rising: 'ASC' }

export async function buildMineView(m: MineInput): Promise<CelebView> {
  const view = await buildCelebView({
    name: m.subjectName ?? 'You',
    slug: 'your-chart',
    birthDate: m.birthDate,
    birthTime: m.birthTime,
    birthCity: m.birthCity,
    lat: m.lat,
    lng: m.lng,
    birthName: null,
    chart: m.chart as never,
    tierSource: null,
    frontPageSkip: true, // no ads on a personal chart
    you: !m.subjectName,
  })
  // The reader's own Big Three use the full reading's opening lines, written to
  // "you". Someone else's chart keeps the third person card text (signLine).
  if (!m.subjectName) {
    view.said = {}
    for (const b of view.bigThree) {
      const hook = ENTRIES[`${KEY[b.card]}:${b.sign}`]?.hook
      if (hook) view.said[b.card] = hook
    }
  }
  return view
}
