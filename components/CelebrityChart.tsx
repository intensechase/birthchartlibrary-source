'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import NatalChartWheel, { PLANET_PATHS, formatDegree, toneOf } from '@/components/NatalChartWheel'
import { ASC_IN_SIGN, MC_IN_SIGN, DSC_IN_SIGN, IC_IN_SIGN } from '@/lib/interpretations/angles'
import { SIGN_LIST, PLANET_SLUGS, PLANET_SLUG_LIST } from '@/lib/constants'

interface PlanetInfo {
  name: string
  symbol: string
}

// Placement data plus a lookup key for its interpretation text. No text is
// server-rendered: each paragraph is shared verbatim by every celebrity with
// that placement (it was ~70% of the page — see [slug].tsx). Text is fetched
// from /api/interpretations-bulk when the reader opens the interpretations.
// `wholeSign` is only set when the WS house actually differs from Placidus
// AND birth time is known.
export interface ChartPlacement {
  planet: string
  sign: string
  signDegree: number
  retrograde: boolean
  placidusHouse: number
  textKey: string
  wholeSign?: {
    house: number
  }
}

interface Props {
  chartData: BirthChartData
  planetInfos: Record<string, PlanetInfo>
  placements: ChartPlacement[]
  hasBirthTime?: boolean
  // Rendered between the wheel and the interpretations (the bio), and beside
  // the interpretations (related people). Both stay server-rendered.
  middle?: ReactNode
  aside?: ReactNode
}

type HouseSystem = 'placidus' | 'whole-sign'

const wsKey = (planet: string, sign: string, house: number) => `${planet}_${sign}_H${house}`

const INK = 'text-slate-800 dark:text-slate-100'
const MUTED = 'text-slate-500 dark:text-slate-400'
const RULE = 'border-slate-300 dark:border-slate-600'

// A planet glyph in a ring of its sign's wheel color, matching the wheel.
export function PlanetBadge({ planet, sign, size = 30 }: { planet: string; sign: string; size?: number }) {
  const path = PLANET_PATHS[planet]
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center rounded-full border-[2.5px] border-[#1A1622] shrink-0"
      style={{ width: size, height: size, background: `var(--w-${toneOf(sign)})` }}
    >
      <span className="inline-flex items-center justify-center rounded-full bg-[#FFF9EA]" style={{ width: size - 10, height: size - 10 }}>
        {path
          ? <svg viewBox="-13 -13 26 26" width={size / 2} height={size / 2}><path d={path} fill="none" stroke="#1A1622" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          : <span className="text-[10px] font-black text-[#1A1622]">{planet[0]}</span>}
      </span>
    </span>
  )
}

export default function CelebrityChart({ chartData, planetInfos, placements, hasBirthTime = false, middle, aside }: Props) {
  const [houseSystem, setHouseSystem] = useState<HouseSystem>('placidus')
  const [active, setActive] = useState<string>(placements[0]?.planet ?? 'SUN')
  const [showText, setShowText] = useState(false)
  const [texts, setTexts] = useState<Record<string, string>>({})
  const [textState, setTextState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [wsTexts, setWsTexts] = useState<Record<string, string>>({})
  const [wsLoading, setWsLoading] = useState(false)
  const fetchedRef = useRef(false)

  // Fetch every placement's text in one request the first time the reader
  // opens the interpretations; later toggles read from state.
  useEffect(() => {
    if (!showText || textState !== 'idle') return
    const keys = [...new Set(placements.map(p => p.textKey))]
    if (keys.length === 0) { setTextState('done'); return }
    setTextState('loading')
    fetch(`/api/interpretations-bulk?keys=${encodeURIComponent(keys.join(','))}`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: Record<string, string>) => setTexts(data))
      .catch(err => Sentry.captureException(err, { tags: { component: 'CelebrityChart', op: 'text-fetch' } }))
      .finally(() => setTextState('done'))
  }, [showText, textState, placements])

  // Lazily resolve Whole-Sign interpretation text the first time the user
  // flips to WS. One bulk request to /api/interpretations-bulk; subsequent
  // toggles read from local state. Missing keys render a graceful fallback
  // (no card hidden, no error visible to the user).
  useEffect(() => {
    if (!showText || houseSystem !== 'whole-sign' || fetchedRef.current) return
    const targets = placements
      .filter(p => p.wholeSign)
      .map(p => wsKey(p.planet, p.sign, p.wholeSign!.house))
    if (targets.length === 0) {
      fetchedRef.current = true
      return
    }
    fetchedRef.current = true
    setWsLoading(true)
    fetch(`/api/interpretations-bulk?keys=${encodeURIComponent(targets.join(','))}`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: Record<string, string>) => setWsTexts(data))
      .catch(err => Sentry.captureException(err, { tags: { component: 'CelebrityChart', op: 'ws-fetch' } }))
      .finally(() => setWsLoading(false))
  }, [showText, houseSystem, placements])

  const houseOf = (p: ChartPlacement) => (p.wholeSign && houseSystem === 'whole-sign' ? p.wholeSign.house : p.placidusHouse)
  const nameOf = (planet: string) => planetInfos[planet]?.name || planet.replace('_', ' ')
  const describe = (p: ChartPlacement) =>
    `${nameOf(p.planet)} in ${p.sign} at ${formatDegree(p.signDegree)}${p.retrograde ? ', retrograde' : ''}${hasBirthTime ? `, House ${houseOf(p)}` : ''}`
  const current = placements.find(p => p.planet === active)

  const toggleClass = (on: boolean) =>
    `min-h-9 px-3.5 rounded-full border-2 border-[var(--outline)] dark:border-slate-100 text-sm font-bold transition-colors ${
      on ? 'bg-[var(--gold)] text-[#1A1622]' : `bg-transparent ${INK} hover:bg-[var(--surface)]`
    }`

  return (
    <div className="flex flex-col gap-14" data-house-system={houseSystem}>
      <section aria-labelledby="chart-title">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2.5 mb-4">
          <h2 id="chart-title" className="text-3xl sm:text-4xl">The chart</h2>
          {/* House system toggle — only meaningful when birth time is known */}
          {hasBirthTime && (
            <div role="radiogroup" aria-label="House system" className="flex items-center gap-2">
              <button type="button" role="radio" aria-checked={houseSystem === 'placidus'} onClick={() => setHouseSystem('placidus')} className={toggleClass(houseSystem === 'placidus')}>
                Placidus
              </button>
              <button type="button" role="radio" aria-checked={houseSystem === 'whole-sign'} onClick={() => setHouseSystem('whole-sign')} className={toggleClass(houseSystem === 'whole-sign')}>
                Whole Sign
              </button>
              {wsLoading && <span className={`text-xs ${MUTED} ml-1`}>loading…</span>}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-5">
          <div className="flex-[1_1_520px] min-w-0 -mx-4 sm:mx-0">
            <NatalChartWheel
              chartData={chartData}
              hasBirthTime={hasBirthTime}
              houseSystem={houseSystem}
              selectedPlanet={active}
              onPlanetClick={setActive}
              onPlanetHover={setActive}
            />
            <p aria-live="polite" className={`mt-2 px-4 text-center font-bold ${INK}`}>
              {current ? describe(current) : ''}
            </p>
          </div>

          <div className="flex-[1_1_320px] min-w-0">
            <h3 className="sr-only">Planetary positions</h3>
            <ul>
              {placements.map(p => {
                const on = p.planet === active
                return (
                  <li key={p.planet}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(p.planet)}
                      onFocus={() => setActive(p.planet)}
                      onClick={() => setActive(p.planet)}
                      aria-pressed={on}
                      className={`flex items-center gap-3 w-full min-h-11 px-2 text-left border-b ${
                        on ? 'bg-[var(--gold)] text-[#1A1622] rounded-[10px] border-transparent' : `${INK} ${RULE}`
                      }`}
                    >
                      <PlanetBadge planet={p.planet} sign={p.sign} />
                      <span className="font-black flex-auto whitespace-nowrap">{nameOf(p.planet)}</span>
                      <span className="text-[15px] text-right">
                        {p.sign} {formatDegree(p.signDegree)}
                        {hasBirthTime && `, House ${houseOf(p)}`}
                        {p.retrograde && <span title="Retrograde"> ℞</span>}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <p className={`mt-3 text-sm ${MUTED}`}>
              Rising: {chartData.ascendantSign}{!hasBirthTime && ' (est.)'} · Midheaven: {chartData.midheavenSign}{!hasBirthTime && ' (est.)'}
            </p>
          </div>
        </div>
      </section>

      {middle}

      <div className="flex flex-wrap items-start gap-x-14 gap-y-12">
        <section className="flex-[1_1_480px] min-w-0 max-w-[40em]" aria-labelledby="interp-title">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <h2 id="interp-title" className="text-3xl sm:text-4xl">Chart interpretations</h2>
            <button
              type="button"
              onClick={() => setShowText(v => !v)}
              aria-expanded={showText}
              className="btn-outline text-sm px-4 py-1.5"
            >
              {showText ? 'Hide interpretations' : 'Show interpretations'}
            </button>
          </div>
          {!showText && (
            <p className={`text-sm ${MUTED} mb-2`}>
              What each placement means. Open them here, or follow a placement to its full page in the interpretation library.
            </p>
          )}
          <div>
            {placements.map(p => {
              const info = planetInfos[p.planet]
              const wsTextKey = p.wholeSign ? wsKey(p.planet, p.sign, p.wholeSign.house) : null
              const wsText = wsTextKey ? wsTexts[wsTextKey] : null

              // Placidus item. Shown whenever the user is in Placidus mode, and
              // also in Whole-Sign mode when this planet has no WS variant
              // (matching houses). Hidden if we're in WS mode AND a WS variant
              // exists (the WS item below will show instead).
              const planetSlug = PLANET_SLUGS[p.planet] || p.planet.toLowerCase()
              const signSlug = p.sign.toLowerCase()
              const signLink = `/interpretations/${planetSlug}-in-${signSlug}`
              const houseLink = `/interpretations/${planetSlug}-in-house-${p.placidusHouse}`
              // /interpretations only exists for PLANET_SLUG_LIST planets — Lilith
              // etc. linked to 404s (36 broken links across featured pages).
              const hasInterp = (PLANET_SLUG_LIST as readonly string[]).includes(planetSlug)
              const signLabel = `${info?.name || p.planet} in ${p.sign}`
              const itemClass = `py-4 border-b-2 ${RULE}`
              const headClass = `flex items-center gap-2.5 text-lg sm:text-xl font-black ${INK} ${showText ? 'mb-2' : ''}`

              const placidusText = texts[p.textKey]
              const placidusItem = (
                <div
                  key={`${p.planet}-placidus`}
                  data-house={p.wholeSign ? 'placidus' : 'both'}
                  className={`${itemClass} ${p.wholeSign && houseSystem === 'whole-sign' ? 'hidden' : ''}`}
                >
                  <h3 className={headClass}>
                    <PlanetBadge planet={p.planet} sign={p.sign} size={26} />
                    <span>
                      {hasInterp ? <Link href={signLink} className="hover:underline">{signLabel}</Link> : signLabel}
                      {hasBirthTime && <> in {hasInterp ? <Link href={houseLink} className="hover:underline">House {p.placidusHouse}</Link> : `House ${p.placidusHouse}`}</>}
                      {!hasBirthTime && <span className={`${MUTED} font-normal text-xs ml-1`}>House {p.placidusHouse} (est.)</span>}
                      {p.retrograde && <span className="font-normal text-base" title="Retrograde"> ℞</span>}
                    </span>
                  </h3>
                  {showText && (
                    textState === 'loading'
                      ? <p className={`${MUTED} text-sm`}>Loading…</p>
                      : placidusText && <p className="leading-relaxed">{placidusText}</p>
                  )}
                </div>
              )

              // Whole-Sign item. Shown only when the WS house differs from
              // Placidus and we're in WS mode. Text comes from the lazy fetch;
              // if it hasn't arrived (or the API failed), fall back to the
              // Placidus text so the user always sees something coherent.
              const wsHouseLink = p.wholeSign ? `/interpretations/${planetSlug}-in-house-${p.wholeSign.house}` : ''
              const wholeSignItem = p.wholeSign ? (
                <div
                  key={`${p.planet}-whole-sign`}
                  data-house="whole-sign"
                  className={`${itemClass} ${houseSystem === 'placidus' ? 'hidden' : ''}`}
                >
                  <h3 className={headClass}>
                    <PlanetBadge planet={p.planet} sign={p.sign} size={26} />
                    <span>
                      {hasInterp ? <Link href={signLink} className="hover:underline">{signLabel}</Link> : signLabel}
                      {' in '}
                      {hasInterp ? <Link href={wsHouseLink} className="hover:underline">House {p.wholeSign.house}</Link> : `House ${p.wholeSign.house}`}
                      {p.retrograde && <span className="font-normal text-base" title="Retrograde"> ℞</span>}
                    </span>
                  </h3>
                  {showText && (wsLoading || textState === 'loading'
                    ? <p className={`${MUTED} text-sm`}>Loading…</p>
                    : (wsText || placidusText) && <p className="leading-relaxed">{wsText || placidusText}</p>)}
                </div>
              ) : null

              return (
                <div key={p.planet} className="contents">
                  {placidusItem}
                  {wholeSignItem}
                </div>
              )
            })}

            {/* Chart Angles */}
            {(() => {
              const dscSign = SIGN_LIST[(SIGN_LIST.indexOf(chartData.ascendantSign) + 6) % 12]
              const icSign = SIGN_LIST[(SIGN_LIST.indexOf(chartData.midheavenSign) + 6) % 12]
              const angles = [
                { key: 'ASC', label: 'Ascendant (Rising)', sign: chartData.ascendantSign, text: ASC_IN_SIGN[chartData.ascendantSign] },
                { key: 'DSC', label: 'Descendant', sign: dscSign, text: DSC_IN_SIGN[dscSign] },
                { key: 'MC', label: 'Midheaven', sign: chartData.midheavenSign, text: MC_IN_SIGN[chartData.midheavenSign] },
                { key: 'IC', label: 'Imum Coeli', sign: icSign, text: IC_IN_SIGN[icSign] },
              ]
              return angles.map(a => {
                if (!a.text) return null
                return (
                  <div key={a.key} className={`py-4 border-b-2 ${RULE}`}>
                    <h3 className={`flex items-center gap-2.5 text-lg sm:text-xl font-black ${INK} ${showText ? 'mb-2' : ''}`}>
                      <span
                        aria-hidden="true"
                        className="inline-flex items-center justify-center w-[26px] h-[26px] rounded-full border-[2.5px] border-[#1A1622] text-[9px] font-black text-[#1A1622] shrink-0"
                        style={{ background: `var(--w-${toneOf(a.sign)})` }}
                      >
                        {a.key === 'ASC' ? 'AC' : a.key === 'DSC' ? 'DC' : a.key}
                      </span>
                      <span>
                        {a.label} in {a.sign}{!hasBirthTime && <span className={`${MUTED} font-normal text-xs ml-1`}>(est.)</span>}
                      </span>
                    </h3>
                    {showText && <p className="leading-relaxed">{a.text}</p>}
                  </div>
                )
              })
            })()}
          </div>
        </section>

        {aside && <div className="flex-[1_1_300px] min-w-0">{aside}</div>}
      </div>
    </div>
  )
}
