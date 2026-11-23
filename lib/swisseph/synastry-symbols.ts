import type { PlanetName } from './calculate'
import type { AspectType } from './synastry'

export const ASPECT_SYMBOLS: Record<AspectType, string> = {
  conjunction: '☌',
  sextile:     '⚹',
  square:      '□',
  trine:       '△',
  opposition:  '☍',
}

export const PLANET_SYMBOLS: Partial<Record<PlanetName, string>> = {
  SUN:     '☉',
  MOON:    '☽',
  MERCURY: '☿',
  VENUS:   '♀',
  MARS:    '♂',
  JUPITER: '♃',
  SATURN:  '♄',
}
