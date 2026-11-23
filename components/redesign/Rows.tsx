import Icon from '@/components/Icon'
import type { IconName } from '@/lib/icons/paths'
import type { VBody, VAspect } from '@/lib/redesign/celeb-view'
import { BODY_NAME, BODY_ICON, ELEMENT_OF, HOUSE_KEYS, bodySlug, signIcon, ordinal, degText } from '@/lib/redesign/astro'
import { CardLink } from './cards'

const TAGS: Record<string, string> = { rulership: 'Rulership', exaltation: 'Exaltation', fall: 'Fall', detriment: 'Detriment' }

// One planet: name (opens the planet card), sign + degree (sign card), house (house card).
export function PlanetRow({ b, exact }: { b: VBody; exact: boolean }) {
  const tag = [b.dignity && TAGS[b.dignity], b.retro && b.id !== 'NORTH_NODE' ? 'Retrograde' : ''].filter(Boolean).join(', ')
  return (
    <div className={`row${b.house ? '' : ' notime'}`}>
      <CardLink card={bodySlug(b.id)} className="pname">
        <span className="disc"><Icon name={BODY_ICON[b.id]} size={20} /></span>
        <span><b>{BODY_NAME[b.id]}</b>{tag ? <span className="tag">{tag}</span> : null}</span>
      </CardLink>
      <CardLink card={b.sign.toLowerCase()} className="psign">
        <span className={`el-${ELEMENT_OF[b.sign]}`}><Icon name={signIcon(b.sign)} size={16} /></span>
        {b.sign} <span className="deg">{degText(b.deg, exact)}</span>
      </CardLink>
      {b.house ? <CardLink card={`house-${b.house}`} className="phouse" label={`${ordinal(b.house)} house`}>{ordinal(b.house)}</CardLink> : null}
    </div>
  )
}

// One house: number, the sign on its cusp, what it covers, the planets inside.
export function HouseRow({ h, sign, cuspDeg, inside, exact }: { h: number; sign: string; cuspDeg: number; inside: VBody[]; exact: boolean }) {
  return (
    <CardLink card={`house-${h}`} className="hrow">
      <span className="hnum">{h}</span>
      <span>
        <span className="hsign">
          <span className={`el-${ELEMENT_OF[sign]}`}><Icon name={signIcon(sign)} size={16} /></span>
          {sign}{exact ? <span className="deg"> {degText(cuspDeg, true)}</span> : null}
        </span>
        <span className="hkeys">{HOUSE_KEYS[h]}</span>
      </span>
      <span className="hplan">
        {inside.map(b => <Icon key={b.id} name={BODY_ICON[b.id]} size={16} label={BODY_NAME[b.id]} />)}
      </span>
      <span className="chev" aria-hidden="true">›</span>
    </CardLink>
  )
}

export function AspectRow({ x, exact }: { x: VAspect; exact: boolean }) {
  const orb = exact ? degText(x.orb, true) : `${Math.round(x.orb * 10) / 10}°`
  return (
    <CardLink card={x.key} className="arow">
      <span className="trio">
        <Icon name={BODY_ICON[x.a]} size={20} />
        <span className="asp"><Icon name={x.type as IconName} size={16} /></span>
        <Icon name={BODY_ICON[x.b]} size={20} />
      </span>
      <span className="aname">{BODY_NAME[x.a]} {x.type} {BODY_NAME[x.b]}</span>
      <span className="deg">{orb}</span>
    </CardLink>
  )
}
