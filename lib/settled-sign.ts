// Short lists (the account page) show a body's sign in a few words. A chart with
// no birth time is drawn at noon, so a body near a sign's edge could be in the
// next sign: leave it out there. Margins are more than half a day's travel (Sun
// about 1 degree a day, Moon up to about 15).
const MARGIN: Record<string, number> = { SUN: 0.6, MOON: 8 }

export function settledSign(body: { planet: string; sign: string; signDegree: number } | undefined, timed: boolean): string | null {
  if (!body) return null
  if (timed) return body.sign
  const m = MARGIN[body.planet] ?? 8
  return body.signDegree >= m && body.signDegree <= 30 - m ? body.sign : null
}
