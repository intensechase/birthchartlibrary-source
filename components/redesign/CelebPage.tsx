import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import type { CelebView } from '@/lib/redesign/celeb-view'
import type { PhotoCredit as Credit } from '@/lib/photo-credit'
import PhotoCredit from '@/components/PhotoCredit'
import Icon from '@/components/Icon'
import { formatBirthDate, formatBirthTime } from '@/lib/format-birth'
import { BODY_ORDER, BODY_NAME, SIGN_NAMES, GROUP_COLOR } from '@/lib/redesign/astro'
import CardSheet from './CardSheet'
import { CardLink } from './cards'
import { Disc, GroupMark } from './Disc'
import { PlanetRow, HouseRow, AspectRow } from './Rows'
import SkyDiagram from './SkyDiagram'
import AdSlot from './AdSlot'
import { redesignOn } from '@/lib/redesign'
import { chineseYearOf, getChineseZodiac, ANIMAL_CHAR } from '@/lib/chinese-zodiac'

// The celebrity page, Planisphere layout (working model, build list step 4).
// Order: who and when, Big Three, the sky at birth, then Planets, Houses,
// Aspects and Details behind a sticky tab bar, then the written profile and
// people to read next. Ads only after the answer. Every card is in the HTML.
export interface CelebPageProps {
  view: CelebView
  celeb: { name: string; slug: string; birth_date: string; birth_time: string | null; birth_city: string; image_proxy: string | null; photo_credit: Credit | null; category: string | null }
  bio: string
  bornSameDay: { name: string; slug: string; image_url: string | null; year: number }[]
  chartTwins: { name: string; slug: string; image_url: string | null; matchLabel: string }[]
  couplePairs: { href: string; otherName: string; otherSign: string | null }[]
  // A visitor's own chart (stage 'mine'): same reading, no bio, photo or people.
  // line = under the Big Three, foot = after the chart, plain = no sentences (an
  // answer strip above already says them).
  personal?: { title: string; whose: string; top?: ReactNode; line?: ReactNode; foot?: ReactNode; plain?: boolean }
  // Disputed births (owner 11/19): one tab per other credible account.
  births?: CelebBirths | null
}

export interface CelebBirths {
  mainLabel: string
  alts: { key: string; label: string; date: string; time: string | null; reading: string; view: CelebView }[]
}

const parasOf = (t: string) => t.replace(/\r\n/g, '\n').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)

const TABS = [['planets', 'Planets'], ['houses', 'Houses'], ['aspects', 'Aspects'], ['details', 'Details']] as const
// Short reading of each grade, shown next to the letter.
const TIER_SHORT: Record<string, string> = { S: 'birth certificate', A: 'from the person or family', B: 'from a biography', C: 'source unknown', D: 'reports conflict' }
const ROLE: Record<string, string> = { sun: 'Sun', moon: 'Moon', rising: 'Rising' }
const signOf = (lon: number) => SIGN_NAMES[Math.floor((((lon % 360) + 360) % 360) / 30)]

// First sentence of the card text written for this exact sign (the same text
// the card opens to), so the two never disagree. A sentence ends at . ! or ?,
// not at an ellipsis, which is the site's voice pause mid sentence.
export function signLine(view: CelebView, card: string, sign: string): string {
  const part = view.cards[card]?.parts.find(p => p.sign === sign)
  const first = (part?.text ?? '').split(/\n+/)[0]
  const m = first.match(/^.*?[^.][.!?](?=\s|$)/)
  return (m ? m[0] : first).trim()
}

// "Sagittarius or Capricorn" breaks after "or" when the tile is narrow, never
// inside a sign name.
function SignName({ sign }: { sign: string }) {
  const [a, b] = sign.split(' or ')
  return b ? <><span className="sw">{a} or</span> <span className="sw">{b}</span></> : <>{sign}</>
}

function useExact(): [boolean, (v: boolean) => void] {
  const [exact, setExact] = useState(false)
  useEffect(() => { try { setExact(localStorage.getItem('bcl-exact') === '1') } catch { /* private mode */ } }, [])
  return [exact, (v: boolean) => { setExact(v); try { localStorage.setItem('bcl-exact', v ? '1' : '0') } catch { /* private mode */ } }]
}

function useActiveTab(ids: string[]) {
  const [cur, setCur] = useState('')
  useEffect(() => {
    const on = () => {
      let c = ''
      for (const id of ids) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < 140) c = id }
      setCur(c)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [ids.join()]) // eslint-disable-line react-hooks/exhaustive-deps
  return cur
}

export default function CelebPage({ view: baseView, celeb: baseCeleb, bio, bornSameDay, chartTwins, couplePairs, personal, births }: CelebPageProps) {
  // The registered chart is the default tab; ?birth=<key> opens another account.
  const [tab, setTab] = useState('main')
  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get('birth')
    if (k && births?.alts.some(a => a.key === k)) setTab(k)
  }, [births])
  const pick = (k: string) => {
    setTab(k)
    const u = new URL(window.location.href)
    if (k === 'main') u.searchParams.delete('birth'); else u.searchParams.set('birth', k)
    window.history.replaceState(window.history.state, '', u.pathname + u.search + u.hash)
  }
  const alt = births?.alts.find(a => a.key === tab) ?? null
  const view = alt ? alt.view : baseView
  const celeb = alt ? { ...baseCeleb, birth_date: alt.date, birth_time: alt.time } : baseCeleb
  const [exact, setExact] = useExact()
  const tabs = TABS.filter(([id]) => id !== 'houses' || view.cusps)
  const active = useActiveTab(tabs.map(t => t[0]))
  const first = celeb.name.split(' ')[0]
  const whose = personal ? personal.whose : `${first}’s`
  // Date and time on one line, the place on the next (owner, 11/20).
  const czYear = redesignOn('tools') && celeb.birth_date ? chineseYearOf(String(celeb.birth_date)) : null
  const cz = czYear ? { year: czYear, ...getChineseZodiac(czYear) } : null
  const when = [formatBirthDate(celeb.birth_date), celeb.birth_time ? formatBirthTime(celeb.birth_time) : null].filter(Boolean).join(', ')
  const cityShort = celeb.birth_city.split(',')[0]
  const bodies = BODY_ORDER.flatMap(id => view.bodies.filter(b => b.id === id))
  const up = bodies.filter(b => (b.house ?? 0) >= 7), down = bodies.filter(b => b.house && b.house < 7)
  const paras = bio.replace(/\r\n/g, '\n').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  // Opening paragraph goes up top only when there is more to read below it.
  const lead = !personal && paras.length > 1, start = lead ? 1 : 0
  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({ behavior: still ? 'auto' : 'smooth' })
  }
  const tierText = !view.tier ? '' : view.tier.tier === 'No time' ? 'No birth time' : view.tier.tier === 'Unrated' ? 'Time not graded yet' : `Time rated ${view.tier.tier}: ${TIER_SHORT[view.tier.tier] ?? 'graded'}`
  const tierCls = view.tier && (view.tier.tier === 'No time' || view.tier.tier === 'Unrated') ? 'tier none' : 'tier'

  return (
    <CardSheet view={view} key={tab}>
      <div className="wrap wide">
        {personal?.top}
        <div className={`herogrid${view.hasTime && view.asc != null ? '' : ' solo'}`}>
          <header className="hero">
            <div className="who">
              {celeb.image_proxy && !personal ? <img src={celeb.image_proxy} alt="" width={56} height={56} onError={e => { e.currentTarget.style.display = "none" }} /> : null}
              <div className="eyebrow">{view.hasTime ? `The sky over ${cityShort}` : `Born in ${cityShort}`}</div>
            </div>
            <h1>{personal ? personal.title : view.hasTime ? `The moment ${celeb.name} was born` : `${celeb.name}’s birth chart`}</h1>
            <p className="when">
              <span>{when}</span>
              <span>{celeb.birth_city}</span>
              {view.tier ? (
                <CardLink card="birth-time" className={tierCls} label={`${tierText}. What this means`}>
                  <b>{TIER_SHORT[view.tier.tier] ? view.tier.tier : '?'}</b>
                  {tierText}
                </CardLink>
              ) : null}
            </p>
            {births && !personal ? (
              <div className="births" role="group" aria-label={`Accounts of ${first}’s birth`}>
                <p>There is more than one account of {first}’s birth. Each one gives a different chart.</p>
                <div className="bchips">
                  {[{ key: 'main', label: births.mainLabel }, ...births.alts].map(t => (
                    <button key={t.key} type="button" aria-pressed={tab === t.key} onClick={() => pick(t.key)}>{t.label}</button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className={`big3${personal && !personal.plain ? ' said' : ''}`}>
              {view.bigThree.map(b => (
                <CardLink key={b.card} card={b.card} className="b3" label={b.label}>
                  <Disc disc={b.disc} size={32} />
                  <span>
                    <b><SignName sign={b.sign} /></b><small>{ROLE[b.card]}</small>
                    {personal && !personal.plain ? <em>{view.said?.[b.card] || signLine(view, b.card, b.sign) || 'It changed sign that day, so it could be either.'}</em> : null}
                  </span>
                </CardLink>
              ))}
            </div>
            {!view.hasTime ? (
              <p className="notime">
                {personal ? 'Without a birth time, the' : `No birth time is on record for ${celeb.name}, so the`} rising sign, houses and sky picture are left out rather than guessed. {view.signChanges.length
                  ? `${view.signChanges.map(c => `The ${c.name} changed sign that day (${c.when === 'later' ? `${c.noon} to ${c.alt}` : `${c.alt} to ${c.noon}`}), so it could be either.`).join(' ')} The chart shows noon.`
                  : 'Every planet below is by sign, which the birth date settles.'}{' '}
                <CardLink card="birth-time">Why</CardLink>
              </p>
            ) : null}
            {personal?.line}
          </header>
          {view.hasTime && view.asc != null ? (
            <div className="sky">
              <SkyDiagram bodies={bodies} asc={view.asc} mc={view.mc} slug={celeb.slug} city={cityShort} name={celeb.name} stellium={!!view.cards.stellium} />
              <p className="skynote">Choose a planet to read about it.</p>
            </div>
          ) : null}
          {/* Every account's reading is in the HTML (unique text); only the open tab's shows. */}
          {births?.alts.map(a => (
            <div className="lead altread" key={a.key} hidden={a.key !== tab}>
              {parasOf(a.reading).map((p, i) => <p key={i}>{p}</p>)}
              <a href="#profile" onClick={jump('profile')}>Keep reading about {first}</a>
            </div>
          ))}
          {lead && !alt ? (
            <div className="lead">
              <p>{paras[0]}</p>
              <a href="#profile" onClick={jump('profile')}>Keep reading about {first}</a>
            </div>
          ) : null}
        </div>
        <AdSlot label="Ad 1: after the answer" off={view.noAds} />
      </div>

      <nav className="tabs" aria-label="Chart sections">
        <div className="tabin">
          {tabs.map(([id, label]) => <a key={id} href={`#${id}`} onClick={jump(id)} aria-current={active === id ? 'true' : undefined}>{label}</a>)}
          {personal ? null : <a href="#profile" onClick={jump('profile')} aria-current={active === 'profile' ? 'true' : undefined}>Profile</a>}
        </div>
      </nav>

      <div className="wrap wide layout">
        <div className="main">
        <div className="cols">
          <section id="planets">
            <div className="shead">
              <h2>Planets</h2>
              <button className="toggle" aria-pressed={exact} onClick={() => setExact(!exact)}>
                Exact degrees <span className="knob" aria-hidden="true" />
              </button>
            </div>
            <p className="lede">{view.hasTime ? 'Where each one stood, and the sign and house it was in.' : 'The sign each planet was in on the day.'}</p>
            {view.hasTime ? (
              <>
                <h3 className="group">Up in the sky</h3>
                <div className="list">{up.map(b => <PlanetRow key={b.id} b={b} exact={exact} />)}</div>
                <h3 className="group">Below the horizon, out of sight</h3>
                <div className="list">{down.map(b => <PlanetRow key={b.id} b={b} exact={exact} />)}</div>
              </>
            ) : (
              <div className="list">{bodies.map(b => <PlanetRow key={b.id} b={b} exact={exact} />)}</div>
            )}
          </section>

          <AdSlot label="Ad 2: between Planets and Houses" off={view.noAds} />

          {view.cusps ? (
            <section id="houses">
              <h2>Houses</h2>
              <p className="lede">Twelve areas of life, each starting in a sign.</p>
              <div className="list">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                  <HouseRow key={h} h={h} sign={signOf(view.cusps![h])} cuspDeg={view.cusps![h] % 30} inside={bodies.filter(b => b.house === h)} exact={exact} />
                ))}
              </div>
            </section>
          ) : null}

          <section id="aspects">
            <h2>Aspects</h2>
            <p className="lede">The angles between {whose} planets, found with the site’s standard orbs.</p>
            {view.aspects.length ? (
              BODY_ORDER.filter(id => view.aspects.some(x => x.a === id)).map(id => (
                <div key={id}>
                  <h3 className="group">{BODY_NAME[id]}</h3>
                  {view.aspects.filter(x => x.a === id).map(x => <AspectRow key={x.key} x={x} exact={exact} />)}
                </div>
              ))
            ) : <p className="note">No major aspects within the standard orbs.</p>}
          </section>

          <section id="details">
            <h2>Details</h2>
            <p className="lede">The bigger patterns in the chart, and {whose} numbers.</p>
            <h3 className="sub">At a glance</h3>
            <div className="glance">
              {view.tiles.map(t => (
                <CardLink key={t.label} card={t.card} className="tile">
                  <small>{t.label}</small>
                  <span>{t.value}<span className="more" aria-hidden="true">›</span></span>
                </CardLink>
              ))}
            </div>
            {view.groups.map(g => (
              <div className="pat" key={g.name}>
                <h3 className="sub">{g.name}</h3>
                <div className="stack" aria-hidden="true">
                  {g.members.filter(m => m.n).map(m => (
                    <i key={m.m} style={{ flex: m.n, background: GROUP_COLOR[m.m] }}>{m.n >= 2 ? <GroupMark m={m.m} size={14} color="#12162E" sw={2.2} /> : null}</i>
                  ))}
                </div>
                <div className="list">
                  {g.members.map(m => (
                    <CardLink key={m.m} card={m.m.toLowerCase()} className="prow">
                      <span className="pmark" style={{ borderColor: GROUP_COLOR[m.m] }}><GroupMark m={m.m} size={18} color={GROUP_COLOR[m.m]} /></span>
                      <span className="pname2">{m.m}</span>
                      <span className={`pill ${m.status}`}>{m.n} of 10{m.status === 'lacking' ? ', missing' : m.status === 'dominant' ? ', strongest' : ''}</span>
                    </CardLink>
                  ))}
                </div>
              </div>
            ))}
            <p className="note">Counted from the ten planets, Sun to Pluto.</p>
            {view.numbers.length ? (
              <>
                <h3 className="sub">Numerology</h3>
                <p className="lede">{view.numbers.some(n => n.key === 'destiny') ? 'From the birth date and the full birth name.' : 'From the birth date.'}</p>
                <div className="nums">
                  {view.numbers.map(n => (
                    <CardLink key={n.key} card={n.key} className="ntile"><small>{n.name}</small><b>{n.value}</b><span>{n.keyword}</span></CardLink>
                  ))}
                </div>
              </>
            ) : null}
            {cz ? (
              <>
                <h3 className="sub">Chinese zodiac</h3>
                <p className="lede">From the birth date. The Chinese year starts at the new year in late January or February.</p>
                <div className="nums">
                  <Link href={`/chinese-zodiac/year/${cz.year}`} className="ntile cz"><small>{cz.year} Chinese year</small><b>{ANIMAL_CHAR[cz.animal]}</b><span>{cz.element} {cz.animal}</span></Link>
                </div>
              </>
            ) : null}
          </section>
        </div>

        {personal ? null : (<>
        <section id="profile">
          <h2>{lead ? `More about ${celeb.name}` : `About ${celeb.name}`}</h2>
          <div className="bio">
            {/* The first paragraph already sits under the name, so the profile picks up from the second. */}
            {paras.slice(start, start + 3).map((p, i) => <p key={i + start}>{p}</p>)}
            {paras.length - start > 4 ? <AdSlot label="Ad 3: inside the profile" off={view.noAds} /> : null}
            {paras.slice(start + 3).map((p, i) => <p key={i + start + 3}>{p}</p>)}
          </div>
          {celeb.image_proxy ? <PhotoCredit credit={celeb.photo_credit} className="credit" /> : null}
        </section>

        <AdSlot label="Ad 4: before Read next" off={view.noAds} />

        {bornSameDay.length || chartTwins.length || couplePairs.length ? (
          <section>
            <h2>Read next</h2>
            {chartTwins.length ? (
              <>
                <h3 className="sub">Similar Big Three</h3>
                <div className="people">
                  {chartTwins.map(p => (
                    <Link key={p.slug} href={`/celebrity-birth-charts/${p.slug}`} className="person">
                      <img src={`/api/img/${p.slug}`} alt="" width={48} height={48} loading="lazy" />
                      <span><b>{p.name}</b><small>Same {p.matchLabel.replace(' & ', ' and ')}</small></span>
                    </Link>
                  ))}
                </div>
              </>
            ) : null}
            {bornSameDay.length ? (
              <>
                <h3 className="sub">Born around the same day</h3>
                <div className="people">
                  {bornSameDay.map(p => (
                    <Link key={p.slug} href={`/celebrity-birth-charts/${p.slug}`} className="person">
                      <img src={`/api/img/${p.slug}`} alt="" width={48} height={48} loading="lazy" />
                      <span><b>{p.name}</b><small>Born {p.year}</small></span>
                    </Link>
                  ))}
                </div>
              </>
            ) : null}
            {couplePairs.length ? (
              <>
                <h3 className="sub">Couples</h3>
                <div className="people">
                  {couplePairs.map(c => (
                    <Link key={c.href} href={c.href} className="person">
                      <span className="disc" style={{ width: 48, height: 48, background: 'rgb(var(--rd-panel2))', color: 'rgb(var(--rd-ink))' }}><Icon name="venus" size={20} /></span>
                      <span><b>{first} and {c.otherName}</b><small>{c.otherSign ? `${c.otherSign} partner` : 'Compare the two charts'}</small></span>
                    </Link>
                  ))}
                </div>
              </>
            ) : null}
          </section>
        ) : null}

        {/* The reader's next step from someone they're curious about: how they
            match. Comparing collects their chart too (and fills it in for a
            signed in reader), so it leads; making a chart alone is the fallback. */}
        <div className="invite">
          <div>
            <h2>You and {celeb.name}</h2>
            <p>See where your chart and {celeb.name}’s meet, planet by planet. Free, and private unless you share it.</p>
          </div>
          <div className="invite-acts">
            <Link href={`/calculators/synastry?celebrity=${celeb.slug}`} className="btn">Compare our charts</Link>
            <Link href="/birth-chart?ref=celeb" className="tlink">Or just make my chart</Link>
          </div>
        </div>
        </>)}
        {personal?.foot}
        <p className="note">Planet positions from the Swiss Ephemeris. <Link className="tlink" href="/method">How charts are worked out</Link></p>
        </div>

        {/* Desktop only: the chart stays in view while the reading scrolls, with one tall ad under it. */}
        <aside className="rail" aria-label="Chart summary">
          <div className="railin">
            <p className="railname">{personal ? personal.title : celeb.name}</p>
            <div className="railchips">
              {view.bigThree.map(b => (
                <CardLink key={b.card} card={b.card} className="chip"><Disc disc={b.disc} size={28} iconSize={18} />{b.label}</CardLink>
              ))}
            </div>
            {view.tiles.slice(0, 4).length ? (
              <div className="railtiles">
                {view.tiles.slice(0, 4).map(t => (
                  <CardLink key={t.label} card={t.card} className="tile"><small>{t.label}</small><span>{t.value}</span></CardLink>
                ))}
              </div>
            ) : null}
            <AdSlot label="Ad 5: side rail, 300 by 600" tall off={view.noAds} />
          </div>
        </aside>
      </div>
    </CardSheet>
  )
}

