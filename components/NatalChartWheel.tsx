'use client'

import type { CSSProperties } from 'react'
import type { BirthChartData } from '@/lib/swisseph/calculate'

// Colors come from the .chart-wheel tokens in styles/globals.css, which cover day and night.
const CENTER = 350
const OUTER_R = 310
const SIGN_INNER_R = 270
const HUB_R = 108
const PLANET_R = 212
const DEGREE_RADII = [172, 156, 140, 126]
const DEGREE_NUDGES = [0, -5, 5, -10, 10, -15, 15, -20, 20, -25, 25]
const HOUSE_NUM_R = 136
const INK = '#1A1622'

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

// Drawn rather than typed, so every device shows the same shapes. About 24 units wide, centered on 0,0.
const SIGN_PATHS: Record<string, string> = {
  Aries: 'M0 10V-3C0 -9 -7 -10 -9 -6C-10 -3 -7 -1 -5 -3M0 -3C0 -9 7 -10 9 -6C10 -3 7 -1 5 -3',
  Taurus: 'M6 3A6 6 0 1 1 -6 3A6 6 0 1 1 6 3M-8 -10C-6 -5 -3 -3 0 -3C3 -3 6 -5 8 -10',
  Gemini: 'M-8 -9C-4 -7 4 -7 8 -9M-8 9C-4 7 4 7 8 9M-4 -8V8M4 -8V8',
  Cancer: 'M-3 -3A3 3 0 1 1 -9 -3A3 3 0 1 1 -3 -3M9 3A3 3 0 1 1 3 3A3 3 0 1 1 9 3M-8 -6C-3 -10 5 -9 9 -5M8 6C3 10 -5 9 -9 5',
  Leo: 'M-3 3A3.2 3.2 0 1 1 -9.4 3A3.2 3.2 0 1 1 -3 3M-3.2 2C-4 -2 -7 -5 -3 -8C1 -11 7 -8 5 -3C4 1 2 5 4 8C5 10 8 9 9 7',
  Virgo: 'M-10 -8C-8 -8 -7 -6 -7 -4V8M-7 -5C-6 -8 -2 -9 -2 -5V8M-2 -5C-1 -8 3 -9 3 -5V5C3 8 5 10 8 10M3 -2C7 -5 10 -2 8 2C7 5 3 8 0 9',
  Libra: 'M-10 9H10M-10 4H-3C-6 2 -7 -1 -7 -3A7 7 0 0 1 7 -3C7 -1 6 2 3 4H10',
  Scorpio: 'M-10 -8C-8 -8 -7 -6 -7 -4V8M-7 -5C-6 -8 -2 -9 -2 -5V8M-2 -5C-1 -8 3 -9 3 -5V6C3 9 6 9 10 5M10 5L6.5 4.5M10 5L10 8.5',
  Sagittarius: 'M-9 9L9 -9M1 -9H9V-1M-7 -1L2 8',
  Capricorn: 'M-10 -8C-8 -8 -7 -5 -7 -2V5M-7 -3C-6 -7 -1 -9 0 -4V5C0 8 -2 10 -4 10M0 3A4 4 0 1 1 5 7C3 8 1 6 0 4',
  Aquarius: 'M-10 -2L-6 -6L-2 -2L2 -6L6 -2L10 -6M-10 6L-6 2L-2 6L2 2L6 6L10 2',
  Pisces: 'M-8 -10C-3 -5 -3 5 -8 10M8 -10C3 -5 3 5 8 10M-6 0H6',
}

export const PLANET_PATHS: Record<string, string> = {
  SUN: 'M9 0A9 9 0 1 1 -9 0A9 9 0 1 1 9 0M1 0A1 1 0 1 1 -1 0A1 1 0 1 1 1 0',
  MOON: 'M4 -9A10 10 0 1 0 4 9A8 8 0 0 1 4 -9Z',
  MERCURY: 'M5 -1A5 5 0 1 1 -5 -1A5 5 0 1 1 5 -1M0 4V11M-3 8H3M-5 -11C-4 -7 4 -7 5 -11',
  VENUS: 'M6 -3A6 6 0 1 1 -6 -3A6 6 0 1 1 6 -3M0 3V11M-4 7H4',
  MARS: 'M3 3A6 6 0 1 1 -9 3A6 6 0 1 1 3 3M1.5 -1.5L9 -9M3 -9H9V-3',
  JUPITER: 'M-8 -6C-6 -11 3 -10 2 -4C1 0 -5 3 -9 3H9M4 -10V10',
  SATURN: 'M-5 -11V4M-8 -8H-2M-5 -3C-2 -7 4 -7 5 -2C6 2 1 5 1 8C1 10 3 11 5 10',
  URANUS: 'M-8 -10V-1M8 -10V-1M-8 -5.5H8M0 -10V5M3 8A3 3 0 1 1 -3 8A3 3 0 1 1 3 8',
  NEPTUNE: 'M-8 -9C-8 -1 -4 3 0 3C4 3 8 -1 8 -9M0 -10V10M-4 7H4M-10 -6L-8 -9L-6 -6M10 -6L8 -9L6 -6',
  PLUTO: 'M-5 -10V10H5M-5 -10H1A5 5 0 0 1 1 0H-5',
  NORTH_NODE: 'M-6 8A3 3 0 1 1 -6.5 2C-9 -4 -4 -10 0 -10C4 -10 9 -4 6.5 2A3 3 0 1 1 6 8',
  CHIRON: 'M0 -11V3M0 -5L6 -10M0 -5L6 -1M4 8A4 4 0 1 1 -4 8A4 4 0 1 1 4 8',
  LILITH: 'M3 -11A7.5 7.5 0 1 0 3 3A6 6 0 0 1 3 -11ZM-2 4V11M-5.5 7.5H1.5',
}

const n = (v: number) => v.toFixed(2)
const toAngle = (longitude: number, ascendant: number) => 180 + longitude - ascendant
const isLuminary = (planet: string) => planet === 'SUN' || planet === 'MOON'
const paint = (name: string): CSSProperties => ({ fill: `var(--w-${name})` })
const line = (name: string): CSSProperties => ({ stroke: `var(--w-${name})` })

// The ring colors repeat every four signs.
export const toneOf = (sign: string) => `tone-${SIGNS.indexOf(sign) % 4}`
const shadeOf = (sign: string) => `shade-${SIGNS.indexOf(sign) % 4}`

function toXY(angle: number, radius: number) {
  const t = (angle * Math.PI) / 180
  return { x: CENTER + radius * Math.cos(t), y: CENTER - radius * Math.sin(t) }
}

function arc(a1: number, a2: number, r1: number, r2: number) {
  const p1 = toXY(a1, r1), p2 = toXY(a2, r1), p3 = toXY(a2, r2), p4 = toXY(a1, r2)
  return `M${n(p1.x)} ${n(p1.y)}A${r1} ${r1} 0 0 0 ${n(p2.x)} ${n(p2.y)}L${n(p3.x)} ${n(p3.y)}A${r2} ${r2} 0 0 1 ${n(p4.x)} ${n(p4.y)}Z`
}

export function formatDegree(deg: number) {
  const d = Math.floor(deg)
  const m = Math.floor((deg - d) * 60)
  return `${d}°${m.toString().padStart(2, '0')}'`
}

// Pushes crowded planets apart. A line from each one still marks its true position on the ring.
export function spreadPlanets<T extends { planet: string; longitude: number }>(planets: T[], ascendant: number) {
  const items = planets
    .map(planet => ({ planet, angle: toAngle(planet.longitude, ascendant) }))
    .sort((a, b) => a.angle - b.angle)
  for (let pass = 0; pass < 200; pass++) {
    for (let i = 0; i < items.length; i++) {
      const last = i === items.length - 1
      const next = items[last ? 0 : i + 1]
      const min = isLuminary(items[i].planet.planet) || isLuminary(next.planet.planet) ? 16 : 14.5
      // The sort order never changes, so a negative gap means two planets were pushed past
      // each other and must keep separating. Only the last pair crosses the 360 degree seam.
      const gap = next.angle + (last ? 360 : 0) - items[i].angle
      if (gap < min) {
        items[i].angle -= (min - gap) / 2
        next.angle += (min - gap) / 2
      }
    }
  }
  return items
}

function degreeText(planet: { signDegree: number; retrograde: boolean }) {
  return `${formatDegree(planet.signDegree)}${planet.retrograde ? ' ℞' : ''}`
}

function houseNumberPosition(cusps: number[], index: number, ascendant: number) {
  const cusp = cusps[index + 1]
  const span = (cusps[index === 11 ? 1 : index + 2] - cusp + 360) % 360
  return toXY(toAngle(cusp + span / 2, ascendant), HOUSE_NUM_R)
}

interface Box { x: number; y: number; w: number; h: number }
const overlaps = (a: Box, b: Box) => Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2

// Level text can't follow the ring, so each label is tried at a few spots near its
// planet and takes the first one clear of the planets, house numbers and earlier labels.
export function placeDegreeLabels<T extends { planet: string; signDegree: number; retrograde: boolean }>(
  spread: { planet: T; angle: number }[],
  houseNumbers: { x: number; y: number }[],
) {
  const taken: Box[] = [
    ...houseNumbers.map(p => ({ ...p, w: 20, h: 18 })),
    ...spread.map(({ planet, angle }) => {
      const size = isLuminary(planet.planet) ? 54 : 44
      return { ...toXY(angle, PLANET_R), w: size, h: size }
    }),
  ]
  const placed = new Map<string, { x: number; y: number }>()
  for (const { planet, angle } of spread) {
    const big = isLuminary(planet.planet)
    const w = degreeText(planet).length * 6.6 + 4
    const options = DEGREE_RADII.flatMap(radius => DEGREE_NUDGES.map(nudge => {
      const a = angle + nudge
      return toXY(a, radius - Math.abs(Math.cos((a * Math.PI) / 180)) * 10 - (big ? 5 : 0))
    }))
    const clashes = (p: { x: number; y: number }) => taken.filter(box => overlaps({ ...p, w, h: 16 }, box)).length
    // In a tight cluster nothing may be clear, so take the spot with the fewest clashes.
    const spot = options.reduce((best, p) => (clashes(p) < clashes(best) ? p : best))
    taken.push({ ...spot, w, h: 16 })
    placed.set(planet.planet, spot)
  }
  return placed
}

function Glyph({ d, x, y, scale, color, width }: { d: string; x: number; y: number; scale: number; color: string; width: number }) {
  return (
    <path
      transform={`translate(${n(x)} ${n(y)}) scale(${scale})`}
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={n(width / scale)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

const ACTION_LINES = Array.from({ length: 48 }, (_, i) => {
  const a = toXY(i * 7.5, HUB_R + 4)
  const b = toXY(i * 7.5, HUB_R + (i % 2 ? 11 : 18))
  return `M${n(a.x)} ${n(a.y)}L${n(b.x)} ${n(b.y)}`
}).join('')

function HubRow({ row, label, value, path }: { row: number; label: string; value: string | null; path?: string }) {
  const y = CENTER + (row - 1) * 56
  const x = CENTER - 62
  return (
    <g>
      <circle cx={x} cy={y} r={19} style={{ ...paint(value ? toneOf(value) : 'soft') }} stroke={INK} strokeWidth="3.6" />
      <circle cx={x} cy={y} r={13} style={paint('paper')} />
      {path
        ? <Glyph d={path} x={x} y={y} scale={0.74} color={INK} width={2.3} />
        : <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="900" fill={INK}>AC</text>}
      {/* Above the sm breakpoint a small label sits over the value; on phones the value stands alone, larger. */}
      <text className="hidden sm:inline" x={CENTER - 34} y={y - 9} dominantBaseline="central" fontSize="11" fontWeight="700" letterSpacing="1.4" fill="#5F5868">{label}</text>
      <text className="hidden sm:inline" x={CENTER - 34} y={y + 9} dominantBaseline="central" fontSize={value ? 18 : 12.5} fontWeight="900" fill={INK}>{value ?? 'Needs birth time'}</text>
      <text className="sm:hidden" x={CENTER - 36} y={y} dominantBaseline="central" fontSize={value ? 20 : 12.5} fontWeight="900" fill={INK}>{value ?? 'Needs birth time'}</text>
    </g>
  )
}

interface Props {
  chartData: BirthChartData
  hasBirthTime: boolean
  houseSystem?: 'placidus' | 'whole-sign'
  selectedPlanet?: string | null
  onPlanetClick?: (planet: string) => void
  onPlanetHover?: (planet: string) => void
  onHouseClick?: (house: number) => void
  onSignClick?: (sign: string) => void
  onAngleClick?: (angle: string) => void
}

export default function NatalChartWheel({
  chartData, hasBirthTime, houseSystem = 'placidus', selectedPlanet, onPlanetClick, onPlanetHover, onHouseClick, onSignClick, onAngleClick,
}: Props) {
  const { planets, midheaven, ascendantSign } = chartData
  // Without a birth time there are no houses or Rising sign to show, so the ring simply starts at Aries.
  const ascendant = hasBirthTime ? chartData.ascendant : 0
  const sun = planets.find(p => p.planet === 'SUN')
  const moon = planets.find(p => p.planet === 'MOON')

  // Index 1 is house 1, matching chartData.houseCusps.
  const cusps = houseSystem === 'whole-sign'
    ? [0, ...Array.from({ length: 12 }, (_, i) => Math.floor(ascendant / 30) * 30 + i * 30)]
    : chartData.houseCusps

  const label = [
    'Birth chart wheel',
    sun && `Sun in ${sun.sign}`,
    moon && `Moon in ${moon.sign}`,
    hasBirthTime && `${ascendantSign} rising`,
  ].filter(Boolean).join(', ')

  const spread = spreadPlanets(planets, ascendant)
  const houseNumbers = hasBirthTime ? Array.from({ length: 12 }, (_, i) => houseNumberPosition(cusps, i, ascendant)) : []
  const degreeSpots = placeDegreeLabels(spread, houseNumbers)

  return (
    <svg viewBox="-30 -30 760 760" className="chart-wheel block w-full max-w-3xl mx-auto rounded-xl" role="img" aria-label={label}>
      {/* Scalloped edge */}
      {SIGNS.flatMap((sign, i) => Array.from({ length: 5 }, (_, k) => {
        const p = toXY(toAngle(i * 30 + 3 + k * 6, ascendant), OUTER_R - 2)
        return <circle key={`${sign}-${k}`} cx={n(p.x)} cy={n(p.y)} r="17.5" style={{ ...paint(toneOf(sign)), ...line('outline') }} strokeWidth="5.5" />
      }))}

      <circle cx={CENTER} cy={CENTER} r={SIGN_INNER_R} style={paint('field')} />

      {/* Sign ring */}
      {SIGNS.map((sign, i) => {
        const a1 = toAngle(i * 30, ascendant)
        const a2 = toAngle((i + 1) * 30, ascendant)
        const g = toXY(toAngle(i * 30 + 15, ascendant), (OUTER_R + SIGN_INNER_R) / 2 + 3)
        const d1 = toXY(a1, OUTER_R)
        const d2 = toXY(a1, SIGN_INNER_R)
        return (
          <g key={sign} onClick={onSignClick ? () => onSignClick(sign) : undefined} style={{ cursor: onSignClick ? 'pointer' : undefined }}>
            <path d={arc(a1, a2, OUTER_R, SIGN_INNER_R)} style={paint(toneOf(sign))} />
            <path d={arc(a1, a2, SIGN_INNER_R + 11, SIGN_INNER_R)} style={paint(shadeOf(sign))} />
            <line x1={n(d1.x)} y1={n(d1.y)} x2={n(d2.x)} y2={n(d2.y)} style={line('outline')} strokeWidth="4" />
            <Glyph d={SIGN_PATHS[sign]} x={g.x} y={g.y} scale={1.02} color="var(--w-outline)" width={6.4} />
            <Glyph d={SIGN_PATHS[sign]} x={g.x} y={g.y} scale={1.02} color="var(--w-paper)" width={2.8} />
          </g>
        )
      })}

      <circle cx={CENTER} cy={CENTER} r={OUTER_R} fill="none" style={line('outline')} strokeWidth="2" />
      <circle cx={CENTER} cy={CENTER} r={SIGN_INNER_R} fill="none" style={line('outline')} strokeWidth="5.5" />
      <path d={ACTION_LINES} fill="none" style={line('soft')} strokeWidth="3" strokeLinecap="round" />

      {!hasBirthTime && Array.from({ length: 12 }, (_, i) => {
        const a = toAngle(i * 30, ascendant)
        const p1 = toXY(a, SIGN_INNER_R)
        const p2 = toXY(a, HUB_R)
        return <line key={i} x1={n(p1.x)} y1={n(p1.y)} x2={n(p2.x)} y2={n(p2.y)} style={line('soft')} strokeWidth="1.8" />
      })}

      {hasBirthTime && (
        <>
          {/* House lines */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = toAngle(cusps[i + 1], ascendant)
            const p1 = toXY(a, SIGN_INNER_R)
            const p2 = toXY(a, HUB_R)
            return <line key={i} x1={n(p1.x)} y1={n(p1.y)} x2={n(p2.x)} y2={n(p2.y)} style={line('soft')} strokeWidth="1.8" />
          })}

          {/* The four angles stay in place under either house system */}
          {[['ASC', ascendant], ['DSC', ascendant + 180], ['MC', midheaven], ['IC', midheaven + 180]].map(([name, lon]) => {
            const a = toAngle(lon as number, ascendant)
            const p1 = toXY(a, OUTER_R)
            const p2 = toXY(a, HUB_R)
            const t = toXY(a, OUTER_R + 34)
            return (
              <g key={name} onClick={onAngleClick ? () => onAngleClick(name as string) : undefined} style={{ cursor: onAngleClick ? 'pointer' : undefined }}>
                <line x1={n(p1.x)} y1={n(p1.y)} x2={n(p2.x)} y2={n(p2.y)} style={line('line')} strokeWidth="4" />
                <text x={n(t.x)} y={n(t.y)} textAnchor="middle" dominantBaseline="central" fontWeight="900" className="text-[18px] sm:text-[14px]" style={paint('line')}>{name}</text>
              </g>
            )
          })}

          {/* House numbers */}
          {houseNumbers.map((p, i) => (
            <text
              key={i}
              x={n(p.x)} y={n(p.y)}
              textAnchor="middle" dominantBaseline="central" fontWeight="900"
              className="text-[17px] sm:text-[13px]"
              onClick={onHouseClick ? () => onHouseClick(i + 1) : undefined}
              style={{ ...paint('text'), ...line('field'), strokeWidth: 4, paintOrder: 'stroke', cursor: onHouseClick ? 'pointer' : undefined }}
            >
              {i + 1}
            </text>
          ))}
        </>
      )}

      {/* Center: Sun, Moon and Rising */}
      <circle cx={CENTER} cy={CENTER} r={HUB_R} style={{ ...paint('paper'), ...line('outline') }} strokeWidth="5.5" />
      <HubRow row={0} label="SUN" value={sun?.sign ?? null} path={PLANET_PATHS.SUN} />
      <HubRow row={1} label="MOON" value={moon?.sign ?? null} path={PLANET_PATHS.MOON} />
      <HubRow row={2} label="RISING" value={hasBirthTime ? ascendantSign : null} />

      {/* Planets */}
      {spread.map(({ planet, angle }) => {
        const big = isLuminary(planet.planet)
        const radius = big ? 25 : 20
        const p = toXY(angle, PLANET_R)
        const tick = toXY(toAngle(planet.longitude, ascendant), SIGN_INNER_R)
        const deg = degreeSpots.get(planet.planet) ?? p
        const path = PLANET_PATHS[planet.planet]
        const selected = selectedPlanet === planet.planet
        return (
          <g key={planet.planet} onClick={onPlanetClick ? () => onPlanetClick(planet.planet) : undefined} onMouseEnter={onPlanetHover ? () => onPlanetHover(planet.planet) : undefined} style={{ cursor: onPlanetClick ? 'pointer' : undefined }}>
            <line x1={n(p.x)} y1={n(p.y)} x2={n(tick.x)} y2={n(tick.y)} style={line('line')} strokeWidth="1.6" opacity=".8" />
            <circle cx={n(tick.x)} cy={n(tick.y)} r="3.4" style={paint('line')} />
            {selected && <circle cx={n(p.x)} cy={n(p.y)} r={radius + 7} fill="none" style={line('tone-2')} strokeWidth="6" />}
            {selected && <circle cx={n(p.x)} cy={n(p.y)} r={radius + 11} fill="none" style={line('outline')} strokeWidth="3" />}
            <circle cx={n(p.x)} cy={n(p.y)} r={radius} style={{ ...paint(toneOf(planet.sign)), ...line('outline') }} strokeWidth="4.5" />
            <circle cx={n(p.x)} cy={n(p.y)} r={radius - (big ? 6 : 5.5)} style={paint('paper')} />
            {path
              ? <Glyph d={path} x={p.x} y={p.y} scale={big ? 1.1 : 0.86} color={INK} width={2.6} />
              : <text x={n(p.x)} y={n(p.y)} textAnchor="middle" dominantBaseline="central" fontSize="16" fontWeight="900" fill={INK}>{planet.planet[0]}</text>}
            {/* Too small to read on a phone, where the list under the wheel carries the same numbers. */}
            <text
              x={n(deg.x)} y={n(deg.y)}
              textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="700"
              className="hidden sm:inline"
              style={{ ...paint('text'), ...line('field'), strokeWidth: 4, paintOrder: 'stroke' }}
            >
              {degreeText(planet)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
