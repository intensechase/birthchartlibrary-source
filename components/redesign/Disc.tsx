import Icon from '@/components/Icon'
import type { VDisc } from '@/lib/redesign/celeb-view'

// A filled round badge: planet, sign, house number or term (build list: feature
// discs only on big standalone discs).
export function Disc({ disc, size, iconSize }: { disc: VDisc; size: number; iconSize?: number }) {
  const g = iconSize ?? (size >= 48 ? 32 : 20)
  return (
    <span className="disc" style={{ width: size, height: size, background: disc.color, fontSize: size >= 48 ? 20 : 14 }} aria-hidden="true">
      {disc.mark ? <GroupMark m={disc.mark} size={g} color="rgb(var(--rd-dark))" sw={2.2} /> : disc.icon ? <Icon name={disc.icon} size={g} /> : disc.text}
    </span>
  )
}

const circ = (x: number, y: number, r: number) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`
export const MARK: Record<string, [string, string]> = {
  Fire: ['M12 4L20 18H4Z', ''], Earth: ['M12 20L4 6H20ZM6.3 10H17.7', ''], Air: ['M12 4L20 18H4ZM6.3 14H17.7', ''], Water: ['M12 20L4 6H20Z', ''],
  Cardinal: ['M12 20V5M6 11L12 5L18 11', ''], Fixed: ['M6 6H18V18H6Z', ''], Mutable: ['M3.5 12C6 6.5 9.5 6.5 12 12S18 17.5 20.5 12', ''],
  Active: [circ(12, 12, 7), ''], Receptive: [circ(12, 12, 7), circ(12, 12, 7)],
}

// Element, mode and polarity marks (Icon and colour system board).
export function GroupMark({ m, size, color, sw = 1.9 }: { m: string; size: number; color: string; sw?: number }) {
  const x = MARK[m]
  if (!x) return null
  return (
    <svg className="ic" aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={x[0]} />
      {x[1] ? <path d={x[1]} fill={color} stroke="none" /> : null}
    </svg>
  )
}
