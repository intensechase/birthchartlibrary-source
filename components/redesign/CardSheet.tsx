import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import type { CelebView, VCard } from '@/lib/redesign/celeb-view'
import { BODY_ORDER, bodySlug } from '@/lib/redesign/astro'
import { CardContext, CardLink, type CardApi } from './cards'
import { Disc, GroupMark } from './Disc'
import Chip from './Chip'
import ReadMore from './ReadMore'
import DignityTable from './DignityTable'
import ZodiacRing from './ZodiacRing'
import Icon from '@/components/Icon'
import { ELEMENT_OF, GROUP_COLOR } from '@/lib/redesign/astro'

// Middle ground (owner 11/21): every card's title and one line (the facts about
// this person, e.g. "Moon in Cancer") stay in the server HTML; the long body
// (general readings that repeat on thousands of pages and live on the library
// pages) renders only when the card is open. Shipping every body made ~88% of a
// celeb page's words shared text (Taylor Swift: 1,073 visible, 7,598 in cards).
// Opening a card is a shallow route change to ?card=key: the
// phone's Back closes it, a card's link can be shared, and the canonical tag
// (pages/_app.tsx strips the query) still points at the page.
const GROUP_MEMBERS: Record<string, string[]> = {
  Elements: ['fire', 'earth', 'air', 'water'], Modalities: ['cardinal', 'fixed', 'mutable'], Polarity: ['active', 'receptive'],
}

function Switcher({ card, view }: { card: VCard; view: CelebView }) {
  let keys: string[] = []
  if (card.switcher === 'planets') keys = BODY_ORDER.map(bodySlug).filter(k => view.cards[k]).concat(view.cards.rising ? ['rising'] : [])
  else if (card.switcher === 'numbers') keys = view.numbers.map(n => n.key)
  else if (card.switcher) keys = GROUP_MEMBERS[card.switcher]
  if (keys.length < 2) return null
  return (
    <nav className="switch" aria-label="Switch card">
      {keys.map(k => {
        const c = view.cards[k]
        const isGroup = !!c.disc.mark
        return (
          <CardLink key={k} card={k} swap current={k === card.key} label={c.title} className={isGroup ? 'gsw' : undefined}>
            {isGroup
              ? <span className="disc" style={{ width: 34, height: 34, borderColor: GROUP_COLOR[c.disc.mark!] }}><GroupMark m={c.disc.mark!} size={18} color={GROUP_COLOR[c.disc.mark!]} /></span>
              : <Disc disc={c.disc} size={34} iconSize={20} />}
          </CardLink>
        )
      })}
    </nav>
  )
}

function CardBody({ card, view }: { card: VCard; view: CelebView }) {
  return (
    <div className="sbody">
      {card.chips.length ? <div className="rulers">{card.chips.map((c, i) => <Chip key={i} chip={c} />)}</div> : null}
      {card.ring ? <ZodiacRing m={card.ring} bodies={view.bodies} asc={view.asc} /> : null}
      {card.parts.map((p, i) => (
        <div className="part" key={i}>
          <h3>
            {p.sign ? <span className={`el-${ELEMENT_OF[p.sign]}`}><Icon name={p.sign.toLowerCase() as never} size={20} /></span> : p.icon ? <Icon name={p.icon} size={20} /> : null}
            {p.head}
          </h3>
          <ReadMore text={p.text} />
          {p.dig && card.dignity ? <DignityTable cells={card.dignity.cells} /> : null}
          {p.more ? <Link className="go" href={p.more.href}>{p.more.label}</Link> : null}
        </div>
      ))}
      {card.people ? (
        <div className="part">
          <h3>{card.people.title}</h3>
          <div className="alsolist">
            {card.people.list.map(p => <Link key={p.slug} className="rchip" href={`/celebrity-birth-charts/${p.slug}`}>{p.name}</Link>)}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default function CardSheet({ view, children }: { view: CelebView; children: ReactNode }) {
  const router = useRouter()
  const q = router.query.card
  const current = typeof q === 'string' && view.cards[q] ? q : null
  const depth = useRef(0)
  const [trail, setTrail] = useState<string[]>([])
  const opener = useRef<HTMLElement | null>(null)
  const sheets = useRef<HTMLDivElement>(null)

  const base = () => router.asPath.split('?')[0].split('#')[0]
  const route = useCallback((key: string | null, replace: boolean) => {
    const query = { ...router.query }
    if (key) query.card = key
    else delete query.card
    // A chart made without an account lives at ?chart=mine or ?chart=someone.
    const held = typeof query.chart === 'string' ? `chart=${encodeURIComponent(query.chart)}` : ''
    const qs = [held, key ? `card=${key}` : ''].filter(Boolean).join('&')
    const as = base() + (qs ? `?${qs}` : '')
    const fn = replace ? router.replace : router.push
    fn({ pathname: router.pathname, query }, as, { shallow: true, scroll: false })
  }, [router]) // eslint-disable-line react-hooks/exhaustive-deps

  const api: CardApi = useMemo(() => ({
    has: (k: string) => !!view.cards[k],
    open: (k: string) => {
      if (k === current) return
      if (!current && typeof document !== 'undefined') opener.current = document.activeElement as HTMLElement
      setTrail(t => (current ? [...t, current] : []))
      depth.current += 1
      route(k, false)
    },
    swap: (k: string) => route(k, true),
  }), [current, route, view.cards])

  const close = useCallback(() => {
    if (depth.current > 0) { const n = depth.current; depth.current = 0; setTrail([]); window.history.go(-n) }
    else { setTrail([]); route(null, true) }
  }, [route])

  // Back to this same page (a card closing). The page's own history entry is not
  // marked shallow, so left alone Next would refetch the page and scroll to the
  // top; go there without either. Any other Back is Next's as usual.
  useEffect(() => {
    const path = (u: string) => u.split('?')[0].split('#')[0]
    router.beforePopState(({ url, as }) => {
      if (path(as) !== path(router.asPath)) return true
      router.replace(url, as, { shallow: true, scroll: false })
      return false
    })
    return () => router.beforePopState(() => true)
  }, [router])

  // Browser Back: one card fewer.
  useEffect(() => {
    const onPop = () => { depth.current = Math.max(0, depth.current - 1); setTrail(t => t.slice(0, -1)) }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Lock the page behind the sheet; focus the title; return focus on close.
  useEffect(() => {
    if (!current) {
      document.body.style.overflow = ''
      if (opener.current && document.contains(opener.current)) opener.current.focus({ preventScroll: true })
      return
    }
    document.body.style.overflow = 'hidden'
    const el = document.getElementById(`card-${current}`)
    if (el) { el.scrollTop = 0; el.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true }) }
    return () => { document.body.style.overflow = '' }
  }, [current])

  useEffect(() => {
    if (!current) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab') {
        const el = document.getElementById(`card-${current}`)
        const f = el?.querySelectorAll<HTMLElement>('a, button, [tabindex="-1"]')
        if (!f || !f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [current, close])

  const prev = trail.length ? view.cards[trail[trail.length - 1]] : null

  return (
    <CardContext.Provider value={api}>
      {children}
      <div className="scrim" hidden={!current} onClick={close} />
      <div ref={sheets}>
        {Object.values(view.cards).map(card => (
          <div key={card.key} id={`card-${card.key}`} className="sheet" role="dialog" aria-modal="true" aria-labelledby={`t-${card.key}`} hidden={card.key !== current}>
            <div className="grab" aria-hidden="true" />
            {card.key === current ? <Switcher card={card} view={view} /> : null}
            <div className="sbar">
              {prev && card.key === current ? (
                <button className="sbtn" onClick={() => window.history.back()}>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                  {prev.title}
                </button>
              ) : <span />}
              <button className="sbtn" aria-label="Close" onClick={close}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <div className="shead">
              {card.disc.mark
                ? <span className="disc" style={{ width: 52, height: 52, background: GROUP_COLOR[card.disc.mark] }}><GroupMark m={card.disc.mark} size={32} color="#12162E" sw={2.2} /></span>
                : <Disc disc={card.disc} size={52} />}
              <div>
                <h2 id={`t-${card.key}`} tabIndex={-1}>{card.title}</h2>
                {card.line ? <p>{card.line}</p> : null}
              </div>
            </div>
            {card.key === current ? <CardBody card={card} view={view} /> : null}
          </div>
        ))}
      </div>
    </CardContext.Provider>
  )
}
