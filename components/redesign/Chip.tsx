import Icon from '@/components/Icon'
import type { VChip } from '@/lib/redesign/celeb-view'
import { CardLink } from './cards'

// Small round chip inside a card: Ruler, Rules, an aspect, a planet in a sign.
export default function Chip({ chip }: { chip: VChip }) {
  if (chip.tone === 'dominant' || chip.tone === 'lacking') return <span className={`pill ${chip.tone}`}>{chip.label}</span>
  const inner = (
    <>
      {chip.small && !chip.icons?.length ? <small>{chip.small}</small> : null}
      {chip.icons?.map((n, i) => (
        <span key={i} className={i === 0 && chip.icons!.length > 1 ? 'asp' : undefined}><Icon name={n} size={16} /></span>
      ))}
      {chip.label}
      {chip.small && chip.icons?.length ? <small>{chip.small}</small> : null}
    </>
  )
  return chip.card ? <CardLink card={chip.card} className="rchip">{inner}</CardLink> : <span className="rchip">{inner}</span>
}
