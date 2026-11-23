import Link from 'next/link'
import type { ReactNode } from 'react'
import type { SynastryAspect } from '@/lib/swisseph/synastry'
import type { HouseOverlay } from '@/lib/swisseph/overlays'
import { DISC, BODY_ICON } from '@/lib/redesign/astro'
import { POINT_NAME, type SynastryScoreV2 } from '@/lib/swisseph/synastry-score'
import { lines } from '@/components/SynastryScoreCard'
import { Face, SignChip } from '@/components/redesign/HomePage'
import { LearnHero, Facts, Fold } from '@/components/redesign/Learn'

// Two charts compared (stage 'compare'): the celebrity compare pages and the
// synastry calculator result. Who the two are, the match letter with Ease and
// Spark, what helps and strains most, then each aspect with its text.
export interface SynSide {
  name: string
  slug?: string          // a celebrity: photo and a link to the chart
  sun: string | null
  moon: string | null
  rising: string | null
  city?: string | null
}

const first = (n: string) => n.split(' ')[0]

function Person({ p }: { p: SynSide }) {
  return (
    <div className="synp">
      <Face name={p.name} slug={p.slug} sign={p.sun ?? undefined} size={72} />
      <b>{p.name}</b>
      {p.city ? <small>{p.city}</small> : null}
      <span className="signs">
        {p.sun ? <SignChip sign={p.sun} role="Sun" /> : null}
        {p.moon ? <SignChip sign={p.moon} role="Moon" /> : null}
        {p.rising ? <SignChip sign={p.rising} role="rising" /> : null}
      </span>
      {p.slug ? <Link className="more" href={`/celebrity-birth-charts/${p.slug}`}>Full chart</Link> : null}
    </div>
  )
}

export function SynScore({ score, a, b }: { score: SynastryScoreV2; a: string; b: string }) {
  const helps = lines(score.helps, a, b, 3)
  const strains = lines(score.strains, a, b, 2)
  return (
    <section className="lsec synscore" id="match">
      <div className="synhead">
        <span className={`mbig t-${score.tier}`}><b>{score.tier}</b><small>match</small></span>
        <div>
          <h2>How well they fit</h2>
          <p className="lede">Smoother than {score.ease}% of pairs of charts. The letter runs from S, the rarest, to D.</p>
        </div>
      </div>
      <Facts items={[
        { label: 'Ease', value: <>{score.ease}<small className="of"> smoother than {score.ease}% of pairs</small></> },
        { label: 'Spark', value: <>{score.spark}<small className="of"> more contact than {score.spark}% of pairs</small></> },
      ]} />
      {helps.length ? <><h3>Helped most by</h3><ul className="pts">{helps.map((t, i) => <li key={i}>{t}</li>)}</ul></> : null}
      {strains.length ? <><h3>Strained most by</h3><ul className="pts">{strains.map((t, i) => <li key={i}>{t}</li>)}</ul></> : null}
      <p className="disclose">For entertainment. A score cannot tell you whether a relationship will work, so please do not make big decisions from it.</p>
    </section>
  )
}

function AspectText({ text }: { text: string }) {
  const [hook, ...rest] = text.split('\n\n')
  return <>{rest.length ? <p><b>{hook}</b></p> : <p>{hook}</p>}{rest.map((t, i) => <p key={i}>{t}</p>)}</>
}

export function SynAspects({ aspects, a, b, total, lede }: { aspects: SynastryAspect[]; a: string; b: string; total?: number; lede?: string }) {
  if (!aspects.length) return null
  return (
    <section className="lsec" id="aspects">
      <h2>How their planets meet</h2>
      <p className="lede">{lede ?? (total && total > aspects.length ? `The ${aspects.length} closest of ${total} contacts between the two charts.` : `${aspects.length} contacts between the two charts, closest first.`)}</p>
      <div className="synasp">
        {aspects.map((x, i) => (
          <Fold key={i} open={i === 0}
            disc={{ color: x.isHarmonic ? '#34D399' : '#FB7185', icon: x.aspectType }}
            title={`${first(a)}’s ${POINT_NAME[x.planet1] ?? x.planet1} ${x.aspectType} ${first(b)}’s ${POINT_NAME[x.planet2] ?? x.planet2}`}
            sub={`${x.isHarmonic ? 'Helps' : 'Strains'}, ${x.orb}° from exact`}>
            <AspectText text={x.interpretation} />
          </Fold>
        ))}
      </div>
    </section>
  )
}

const ORD = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th']

// Where each person's planets land in the other's houses (only when the house
// owner's birth time is known; see lib/swisseph/overlays.ts).
export function SynOverlays({ overlays, a, b }: { overlays: HouseOverlay[]; a: string; b: string }) {
  if (!overlays.length) return null
  return (
    <section className="lsec" id="houses">
      <h2>Where their planets land</h2>
      <p className="lede">Each house is a part of life. A planet in the other person’s house shows where that person feels it most.</p>
      <div className="synasp">
        {overlays.map((o, i) => {
          const [who, whose] = o.from === 'a' ? [a, b] : [b, a]
          return (
            <Fold key={i} disc={{ color: DISC[o.planet], icon: BODY_ICON[o.planet] }}
              title={`${first(who)}’s ${POINT_NAME[o.planet] ?? o.planet} in ${first(whose)}’s ${ORD[o.house]} house`}>
              <AspectText text={o.text} />
            </Fold>
          )
        })}
      </div>
    </section>
  )
}

export default function SynastryView({ a, b, score, aspects, overlays, total, crumbs, kicker, lead, children }: {
  a: SynSide; b: SynSide
  score: SynastryScoreV2 | null
  aspects: SynastryAspect[]
  overlays?: HouseOverlay[]
  total?: number
  crumbs?: { label: string; href?: string }[]
  kicker?: string
  lead?: ReactNode
  children?: ReactNode   // between the score and the aspects (notes, save bar)
}) {
  return (
    <>
      <LearnHero crumbs={crumbs} kicker={kicker} title={`${a.name} and ${b.name}`}>
        {lead ?? (score ? <p>{score.tier} match: their charts meet more smoothly than {score.ease}% of pairs.</p> : null)}
      </LearnHero>
      <div className="synpair"><Person p={a} /><span className="amp" aria-hidden="true">&amp;</span><Person p={b} /></div>
      {score ? <SynScore score={score} a={a.name} b={b.name} /> : null}
      {children}
      <SynAspects aspects={aspects} a={a.name} b={b.name} total={total} />
      {overlays ? <SynOverlays overlays={overlays} a={a.name} b={b.name} /> : null}
    </>
  )
}
