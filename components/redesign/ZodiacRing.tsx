import type { VBody } from '@/lib/redesign/celeb-view'
import { SIGN_NAMES, ELEMENT_OF, MODE_OF, DISC, BODY_NAME, GROUP_COLOR } from '@/lib/redesign/astro'

// The zodiac with one element, mode or side lit, and the planets placed in it.
// Rising sign on the left when the birth time is known, Aries otherwise.
const ELEMENTS = ['Fire', 'Earth', 'Air', 'Water']
const MODES = ['Cardinal', 'Fixed', 'Mutable']
const of = (m: string, s: string) =>
  ELEMENTS.includes(m) ? ELEMENT_OF[s] === m
    : MODES.includes(m) ? MODE_OF[s] === m
      : (['Fire', 'Air'].includes(ELEMENT_OF[s]) ? 'Active' : 'Receptive') === m
const ELC: Record<string, string> = { Fire: '#FF8A65', Earth: '#8FCB8F', Air: '#F2D16B', Water: '#5FA8F0' }
const f = (v: number) => Math.round(v * 10) / 10

export default function ZodiacRing({ m, bodies, asc }: { m: string; bodies: VBody[]; asc: number | null }) {
  const A = asc ?? 0, cx = 160, cy = 160, R1 = 146, R2 = 114
  const pt = (lon: number, r: number) => { const a = ((180 + lon - A) * Math.PI) / 180; return [cx + r * Math.cos(a), cy - r * Math.sin(a)] }
  const ps = bodies.filter(b => !['NORTH_NODE', 'CHIRON'].includes(b.id) && of(m, b.sign)).sort((a, b) => a.lon - b.lon)
  let prev = -99, lvl = 0
  return (
    <div className="ring">
      <svg role="img" aria-label={`${m} signs lit on the zodiac, with ${ps.length ? ps.map(b => BODY_NAME[b.id]).join(', ') : 'no planets'} in them`} viewBox="0 0 320 320" fontFamily="inherit">
        {SIGN_NAMES.map((s, i) => {
          const on = of(m, s), a1 = pt(i * 30, R1), a2 = pt(i * 30 + 30, R1), b2 = pt(i * 30 + 30, R2), b1 = pt(i * 30, R2), mid = pt(i * 30 + 15, (R1 + R2) / 2)
          return (
            <g key={s}>
              <path d={`M${f(a1[0])} ${f(a1[1])}A${R1} ${R1} 0 0 0 ${f(a2[0])} ${f(a2[1])}L${f(b2[0])} ${f(b2[1])}A${R2} ${R2} 0 0 1 ${f(b1[0])} ${f(b1[1])}Z`} fill={on ? GROUP_COLOR[m] : '#1C2245'} fillOpacity={on ? 0.3 : 1} stroke="#2E3663" />
              <svg x={f(mid[0] - 9)} y={f(mid[1] - 9)} width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={ELC[ELEMENT_OF[s]]} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" opacity={on ? 1 : 0.35}>
                <use href={`/icons.svg?v=1#${s.toLowerCase()}`} />
              </svg>
            </g>
          )
        })}
        <circle cx={cx} cy={cy} r={R2} fill="#151A38" stroke="#2E3663" />
        {asc != null ? (
          <>
            <line x1={6} y1={cy} x2={314} y2={cy} stroke="#9AA8FF" strokeWidth={1.25} />
            <text x={24} y={cy - 8} fontSize={11} fill="#9AA8FF">Rising</text>
            <text x={296} y={cy - 8} fontSize={11} fill="#9AA8FF" textAnchor="end">Setting</text>
          </>
        ) : null}
        {ps.map(b => {
          lvl = b.lon - prev < 9 ? lvl + 1 : 0
          prev = b.lon
          const c = pt(b.lon, 96 - lvl * 23), t1 = pt(b.lon, R2), t2 = pt(b.lon, R2 - 7)
          return (
            <g key={b.id}>
              <line x1={f(t1[0])} y1={f(t1[1])} x2={f(t2[0])} y2={f(t2[1])} stroke={GROUP_COLOR[m]} strokeWidth={1.5} />
              <circle cx={f(c[0])} cy={f(c[1])} r={11} fill={DISC[b.id]} />
              <svg x={f(c[0] - 7.5)} y={f(c[1] - 7.5)} width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#12162E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" overflow="visible">
                <use href={`/icons.svg?v=1#${b.id === 'NORTH_NODE' ? 'north-node' : b.id.toLowerCase()}`} />
              </svg>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
