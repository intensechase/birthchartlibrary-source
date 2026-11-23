// SERVER ONLY (the type is safe anywhere). The opening of the full reading for a
// reader without an account: At a glance and the first thing that stands out.
// Cut here so the rest of the reading is never sent.
import type { RAspect, Reading } from './build'

export interface ReadingTeaser {
  big: Reading['big']
  pair: Reading['pair']
  first: RAspect | null
  more: { feats: number; planets: number; houses: number }
}

export function teaserOf(r: Reading): ReadingTeaser {
  const first = r.feats.find(x => x.entry) ?? null
  return {
    big: r.big,
    pair: r.pair,
    first,
    more: { feats: r.feats.length - (first ? 1 : 0), planets: r.planets.length, houses: r.houses.length },
  }
}
