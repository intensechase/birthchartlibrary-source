'use client'

import { useState } from 'react'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import { getElementColor } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'
import NatalChartWheel from './NatalChartWheel'
import { ASC_IN_SIGN, MC_IN_SIGN, DSC_IN_SIGN, IC_IN_SIGN, VERTEX_IN_SIGN, PART_OF_FORTUNE_IN_SIGN, ANGLE_GENERAL } from '@/lib/interpretations/angles'
import { SIGN_LIST } from '@/lib/constants'
import TextParagraphs from './chart/TextParagraphs'
import PlanetCard from './chart/PlanetCard'
import type { Interpretations } from './chart/PlanetCard'
import { SIGN_BOOKS } from '@/lib/interpretations/sign-books'
import { bookCoverUrl } from '@/lib/book-cover'

interface Props {
  chartData: BirthChartData
  label: string
  birthDate: string
  birthTime: string | null
  birthCity: string
  interp: Interpretations
}

function InfoSheet({ content, onClose }: { content: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
      <div
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-t-2xl sm:rounded-2xl p-5 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="sm:hidden w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4" />
        {content}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}


export default function ChartDetail({ chartData, label, birthDate, birthTime, birthCity, interp }: Props) {
  const [activeTab, setActiveTab] = useState<'wheel' | 'planets' | 'houses'>('wheel')
  const [openPlanets, setOpenPlanets] = useState<Set<string>>(new Set(['SUN']))
  const [openAngleLearnMore, setOpenAngleLearnMore] = useState<Set<string>>(new Set())
  const [tooltip, setTooltip] = useState<React.ReactNode | null>(null)
  const [houseSystem, setHouseSystem] = useState<'placidus' | 'whole-sign'>('placidus')
  const [selectedWheelPlanet, setSelectedWheelPlanet] = useState<string | null>(null)
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null)
  const [selectedSign, setSelectedSign] = useState<string | null>(null)
  const [expandedInlinePlanets, setExpandedInlinePlanets] = useState<Set<string>>(new Set())
  const [selectedAngle, setSelectedAngle] = useState<string | null>(null)

  const sun = chartData.planets.find(p => p.planet === 'SUN')
  const moon = chartData.planets.find(p => p.planet === 'MOON')
  const risingSign = chartData.ascendantSign

  // Whole Sign house calculation
  const ascSignIndex = SIGN_LIST.indexOf(risingSign)

  function getWholeSignHouse(sign: string): number {
    const signIndex = SIGN_LIST.indexOf(sign)
    return ((signIndex - ascSignIndex + 12) % 12) + 1
  }

  // Get the effective house for a planet based on selected system
  function getHouse(planet: { sign: string; house: number }): number {
    return houseSystem === 'whole-sign' ? getWholeSignHouse(planet.sign) : planet.house
  }

  // Remap planets with effective houses
  const effectivePlanets = chartData.planets.map(p => ({
    ...p,
    house: getHouse(p),
  }))

  const sunSign = sun?.sign || 'Unknown'
  const moonSign = moon?.sign || 'Unknown'
  const sunEc = getElementColor(sunSign)
  const moonEc = getElementColor(moonSign)
  const risingEc = getElementColor(risingSign)

  const summary = `The Sun in ${sunSign} sets the core ... ${interp.signs[sunSign]?.element?.toLowerCase() || ''} energy that runs ${sunSign === 'Aries' ? 'bold and direct' : sunSign === 'Taurus' ? 'steady and grounded' : sunSign === 'Gemini' ? 'curious and quick' : sunSign === 'Cancer' ? 'nurturing and intuitive' : sunSign === 'Leo' ? 'confident and expressive' : sunSign === 'Virgo' ? 'analytical and purposeful' : sunSign === 'Libra' ? 'balanced and relational' : sunSign === 'Scorpio' ? 'intense and perceptive' : sunSign === 'Sagittarius' ? 'adventurous and philosophical' : sunSign === 'Capricorn' ? 'ambitious and disciplined' : sunSign === 'Aquarius' ? 'independent and visionary' : 'compassionate and intuitive'}. The Moon in ${moonSign} is the inner weather underneath it, pulled toward ${moonSign === 'Aries' ? 'action and independence' : moonSign === 'Taurus' ? 'comfort and stability' : moonSign === 'Gemini' ? 'conversation and variety' : moonSign === 'Cancer' ? 'home and deep connection' : moonSign === 'Leo' ? 'warmth and recognition' : moonSign === 'Virgo' ? 'order and usefulness' : moonSign === 'Libra' ? 'harmony and partnership' : moonSign === 'Scorpio' ? 'depth and emotional truth' : moonSign === 'Sagittarius' ? 'freedom and meaning' : moonSign === 'Capricorn' ? 'structure and achievement' : moonSign === 'Aquarius' ? 'community and ideas' : 'imagination and empathy'} whenever safety is what is needed. And with ${risingSign} rising, the first thing the world meets is someone ${risingSign === 'Aries' ? 'direct and energetic' : risingSign === 'Taurus' ? 'calm and dependable' : risingSign === 'Gemini' ? 'witty and approachable' : risingSign === 'Cancer' ? 'warm and protective' : risingSign === 'Leo' ? 'magnetic and confident' : risingSign === 'Virgo' ? 'composed and thoughtful' : risingSign === 'Libra' ? 'graceful and diplomatic' : risingSign === 'Scorpio' ? 'intense and mysterious' : risingSign === 'Sagittarius' ? 'open and enthusiastic' : risingSign === 'Capricorn' ? 'serious and capable' : risingSign === 'Aquarius' ? 'unique and forward looking' : 'gentle and perceptive'}... the lens the rest of the chart gets expressed through.`

  function showPlanetTooltip(planet: string) {
    const info = interp.planets[planet]
    if (!info) return
    setTooltip(
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{info.symbol}</span>
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{info.name}</h3>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{info.description}</p>
      </div>
    )
  }

  function showSignTooltip(sign: string) {
    const info = interp.signs[sign]
    if (!info) return
    const ec = getElementColor(sign)
    setTooltip(
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-2xl ${ec.text}`}>{info.symbol}</span>
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{sign}</h3>
        </div>
        <div className="flex gap-2 mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full ${ec.bg} ${ec.text}`}>{info.element}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{info.modality}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">Ruled by {info.ruledBy}</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{info.description}</p>
      </div>
    )
  }

  function showHouseTooltip(house: number) {
    const info = interp.houses[house]
    if (!info) return
    setTooltip(
      <div>
        <h3 className="font-semibold text-lg mb-1 text-slate-800 dark:text-slate-100">{info.name}</h3>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {info.keywords.map(k => (
            <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{k}</span>
          ))}
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{info.description}</p>
      </div>
    )
  }

  // Build houses view data
  const housesData = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1
    const planetsInHouse = effectivePlanets.filter(p => p.house === houseNum)

    if (houseSystem === 'whole-sign') {
      // In Whole Sign, each house = one sign starting from the Ascendant sign
      const cuspSignIndex = (ascSignIndex + i) % 12
      const cuspSign = SIGN_LIST[cuspSignIndex]
      return { houseNum, cuspSign, cuspDeg: cuspSignIndex * 30, planetsInHouse }
    }

    // Placidus
    const cuspDeg = chartData.houseCusps[houseNum] ?? 0
    const cuspSignIndex = Math.floor(cuspDeg / 30) % 12
    const cuspSign = SIGN_LIST[cuspSignIndex]
    return { houseNum, cuspSign, cuspDeg, planetsInHouse }
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl sm:text-4xl tracking-wide mb-1">{label}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {birthDate}{birthTime ? ` at ${birthTime}` : ''} · {birthCity}
        </p>
        {!birthTime && (
          <p className="text-amber-600 dark:text-amber-500 text-xs mt-1">
            Birth time unknown... chart calculated using noon. House placements and Rising sign may differ from your actual chart.
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          <span
            className={`text-sm px-3 py-1 rounded-full ${sunEc.bg} ${sunEc.text} cursor-help`}
            onClick={() => showSignTooltip(sunSign)}
          >
            ☉ {sunSign}
          </span>
          <span
            className={`text-sm px-3 py-1 rounded-full ${moonEc.bg} ${moonEc.text} cursor-help`}
            onClick={() => showSignTooltip(moonSign)}
          >
            ☽ {moonSign}
          </span>
          <span
            className={`text-sm px-3 py-1 rounded-full ${risingEc.bg} ${risingEc.text} cursor-help`}
            onClick={() => showSignTooltip(risingSign)}
          >
            ↑ {risingSign} Rising
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className={`bg-gradient-to-br ${sunEc.gradient} border ${sunEc.border} rounded-xl p-6 mb-8`}>
        <h2 className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">Your Cosmic Blueprint</h2>
        <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{summary}</p>
      </div>

      {/* House system toggle */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-slate-400 dark:text-slate-500">House System:</span>
        <div role="radiogroup" aria-label="House system" className="inline-flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-full">
          <button
            role="radio"
            aria-checked={houseSystem === 'placidus'}
            onClick={() => setHouseSystem('placidus')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              houseSystem === 'placidus'
                ? 'bg-white dark:bg-slate-200 text-slate-900 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Placidus
          </button>
          <button
            role="radio"
            aria-checked={houseSystem === 'whole-sign'}
            onClick={() => setHouseSystem('whole-sign')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              houseSystem === 'whole-sign'
                ? 'bg-white dark:bg-slate-200 text-slate-900 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Whole Sign
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('wheel')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'wheel'
              ? 'border-slate-700 dark:border-slate-300 text-slate-800 dark:text-slate-100'
              : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-100'
          }`}
        >
          Chart
        </button>
        <button
          onClick={() => setActiveTab('planets')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'planets'
              ? 'border-slate-700 dark:border-slate-300 text-slate-800 dark:text-slate-100'
              : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-100'
          }`}
        >
          Planets
        </button>
        <button
          onClick={() => setActiveTab('houses')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'houses'
              ? 'border-slate-700 dark:border-slate-300 text-slate-800 dark:text-slate-100'
              : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-100'
          }`}
        >
          Houses
        </button>
      </div>

      {/* Chart Wheel Tab */}
      {activeTab === 'wheel' && (
        <div className="mb-8">
          <NatalChartWheel
            chartData={chartData}
            hasBirthTime={!!birthTime}
            houseSystem={houseSystem}
            selectedPlanet={selectedWheelPlanet}
            onPlanetClick={(p) => { setSelectedWheelPlanet(prev => prev === p ? null : p); setSelectedHouse(null); setSelectedSign(null); setSelectedAngle(null) }}
            onHouseClick={(h) => { setSelectedHouse(prev => prev === h ? null : h); setSelectedWheelPlanet(null); setSelectedSign(null); setSelectedAngle(null) }}
            onSignClick={(s) => { setSelectedSign(prev => prev === s ? null : s); setSelectedWheelPlanet(null); setSelectedHouse(null); setSelectedAngle(null) }}
            onAngleClick={(a) => { setSelectedAngle(prev => prev === a ? null : a); setSelectedWheelPlanet(null); setSelectedHouse(null); setSelectedSign(null) }}
          />

          {/* Planet blurb panel */}
          {selectedWheelPlanet && (() => {
            const planet = chartData.planets.find(p => p.planet === selectedWheelPlanet)
            if (!planet) return null
            const info = interp.planets[planet.planet]
            const key = `${planet.planet}_${planet.sign}_H${planet.house}`
            const combined = interp.combined[key]
            const piSign = interp.planetInSign[`${planet.planet}_${planet.sign}`]

            // Get first 2-3 sentences as blurb
            const fullText = combined || piSign || ''
            const sentences = fullText.replace(/<[^>]*>/g, '').split(/(?<=\.)\s+/)
            const blurb = sentences.slice(0, 3).join(' ')

            return (
              <div className="mt-6 card border-l-4" style={{ borderLeftColor: 'var(--color-coral, #D85A30)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">
                    {info?.symbol} {info?.name || planet.planet} in {planet.sign}
                    <span className="text-slate-400 dark:text-slate-500 font-normal"> · House {planet.house}</span>
                  </p>
                  <button
                    onClick={() => setSelectedWheelPlanet(null)}
                    className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" /></svg>
                  </button>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{blurb}</p>
                <button
                  onClick={() => { setActiveTab('planets'); setOpenPlanets(new Set([planet.planet])); setSelectedWheelPlanet(null) }}
                  className="text-xs mt-3 inline-block"
                  style={{ color: 'var(--color-coral, #D85A30)' }}
                >
                  Read full interpretation →
                </button>
              </div>
            )
          })()}

          {/* House blurb panel */}
          {selectedHouse && (() => {
            const planetsInHouse = chartData.planets.filter(p => p.house === selectedHouse)
            const houseInfo = interp.houses[selectedHouse]
            return (
              <div className="mt-6 card border-l-4" style={{ borderLeftColor: '#475569' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">
                    House {selectedHouse}
                    {houseInfo && <span className="text-slate-400 font-normal"> · {houseInfo.name}</span>}
                  </p>
                  <button onClick={() => setSelectedHouse(null)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" /></svg></button>
                </div>
                {houseInfo && <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-2">{houseInfo.description}</p>}
                {planetsInHouse.length > 0 ? (
                  <div className="space-y-2 mt-3">
                    {planetsInHouse.map(p => {
                      const pi = interp.planets[p.planet]
                      const isExpanded = expandedInlinePlanets.has(p.planet)
                      const key = `${p.planet}_${p.sign}_H${p.house}`
                      const text = interp.combined[key] || interp.planetInSign[`${p.planet}_${p.sign}`] || ''
                      const blurb = text.replace(/<[^>]*>/g, '').split(/(?<=\.)\s+/).slice(0, 3).join(' ')
                      return (
                        <div key={p.planet}>
                          <button
                            onClick={() => setExpandedInlinePlanets(prev => {
                              const next = new Set(prev)
                              if (next.has(p.planet)) next.delete(p.planet); else next.add(p.planet)
                              return next
                            })}
                            className="text-xs font-medium flex items-center gap-1 hover:opacity-70"
                            style={{ color: '#D85A30' }}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform shrink-0" style={{ transform: isExpanded ? 'rotate(90deg)' : '' }}><path d="M9 18l6-6-6-6" /></svg>
                            {pi?.symbol} {pi?.name || p.planet} in {p.sign}
                          </button>
                          {isExpanded && (
                            <p className="text-slate-600 text-xs leading-relaxed mt-1 ml-4">{blurb}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">No planets placed here</p>
                )}
              </div>
            )
          })()}

          {/* Sign blurb panel */}
          {selectedSign && (() => {
            const planetsInSign = chartData.planets.filter(p => p.sign === selectedSign)
            const signInfo = interp.signs[selectedSign]
            return (
              <div className="mt-6 card border-l-4" style={{ borderLeftColor: signInfo ? '#64748b' : '#94a3b8' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">
                    <SignGlyph sign={selectedSign} decorative /> {selectedSign}
                    {signInfo && <span className="text-slate-400 font-normal"> · {signInfo.element} · {signInfo.modality}</span>}
                  </p>
                  <button onClick={() => setSelectedSign(null)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" /></svg></button>
                </div>
                {signInfo && <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-2">{signInfo.description}</p>}
                {planetsInSign.length > 0 ? (
                  <div className="space-y-2 mt-3">
                    {planetsInSign.map(p => {
                      const pi = interp.planets[p.planet]
                      const isExpanded = expandedInlinePlanets.has(p.planet)
                      const key = `${p.planet}_${p.sign}_H${p.house}`
                      const text = interp.combined[key] || interp.planetInSign[`${p.planet}_${p.sign}`] || ''
                      const blurb = text.replace(/<[^>]*>/g, '').split(/(?<=\.)\s+/).slice(0, 3).join(' ')
                      return (
                        <div key={p.planet}>
                          <button
                            onClick={() => setExpandedInlinePlanets(prev => {
                              const next = new Set(prev)
                              if (next.has(p.planet)) next.delete(p.planet); else next.add(p.planet)
                              return next
                            })}
                            className="text-xs font-medium flex items-center gap-1 hover:opacity-70"
                            style={{ color: '#D85A30' }}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform shrink-0" style={{ transform: isExpanded ? 'rotate(90deg)' : '' }}><path d="M9 18l6-6-6-6" /></svg>
                            {pi?.symbol} {pi?.name || p.planet} in House {p.house}
                          </button>
                          {isExpanded && (
                            <p className="text-slate-600 text-xs leading-relaxed mt-1 ml-4">{blurb}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">No planets placed in {selectedSign}</p>
                )}
              </div>
            )
          })()}

          {/* Angle blurb panel (ASC/DSC/MC/IC) */}
          {selectedAngle && (() => {
            const dscSign = SIGN_LIST[(SIGN_LIST.indexOf(chartData.ascendantSign) + 6) % 12]
            const icSign = SIGN_LIST[(SIGN_LIST.indexOf(chartData.midheavenSign) + 6) % 12]
            const ANGLE_INFO: Record<string, { name: string; sign: string; general: string; personal: string }> = {
              ASC: {
                name: 'Ascendant (Rising Sign)',
                sign: chartData.ascendantSign,
                general: 'The Ascendant is the zodiac sign that was rising on the eastern horizon at the exact moment of your birth. It shapes how the world sees you... your first impression, your social presence, and the lens through which your entire chart is expressed. It determines which signs rule which houses, making it the framework everything else hangs on.',
                personal: ASC_IN_SIGN[chartData.ascendantSign] || '',
              },
              DSC: {
                name: 'Descendant',
                sign: dscSign,
                general: 'The Descendant sits on the cusp of the 7th house, directly opposite your Ascendant. It represents what you seek in partnerships and close relationships... the qualities you are drawn to in others, often because they complement or balance your Rising sign energy.',
                personal: DSC_IN_SIGN[dscSign] || '',
              },
              MC: {
                name: 'Midheaven (Medium Coeli)',
                sign: chartData.midheavenSign,
                general: 'The Midheaven is the highest point in your chart, sitting at the cusp of the 10th house. It represents your career, public reputation, and the legacy you are building. The sign here describes how the world knows you professionally.',
                personal: MC_IN_SIGN[chartData.midheavenSign] || '',
              },
              IC: {
                name: 'Imum Coeli (IC)',
                sign: icSign,
                general: 'The IC is the lowest point of your chart, at the cusp of the 4th house. It represents your roots, home life, family, and the most private part of who you are. This is where you came from and where you retreat to when you need to feel safe.',
                personal: IC_IN_SIGN[icSign] || '',
              },
              VX: {
                name: 'Vertex',
                sign: chartData.vertexSign || '',
                general: 'The Vertex is a calculated point in the western hemisphere of your chart, sometimes called the "third angle." It represents fated encounters, karmic relationships, and the people and events that seem to arrive from outside your control and redirect the course of your life. Transits and other people\'s planets activating your Vertex often coincide with meetings or moments that feel destined rather than chosen.',
                personal: chartData.vertexSign ? (VERTEX_IN_SIGN[chartData.vertexSign] || '') : '',
              },
              POF: {
                name: 'Part of Fortune',
                sign: chartData.partOfFortuneSign || '',
                general: 'The Part of Fortune (Lot of Fortune) is an Arabic Part — a calculated point that synthesizes the positions of the Sun, Moon, and Ascendant into a single indicator of natural abundance and wellbeing. It marks the area of life and the energetic quality through which joy, vitality, and material flourishing flow most freely and naturally for you.',
                personal: chartData.partOfFortuneSign ? (PART_OF_FORTUNE_IN_SIGN[chartData.partOfFortuneSign] || '') : '',
              },
            }
            const info = ANGLE_INFO[selectedAngle]
            if (!info) return null
            return (
              <div className="mt-6 space-y-3">
                {/* General meaning */}
                <div className="card border-l-4" style={{ borderLeftColor: '#94a3b8' }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">
                      What is the {info.name}?
                    </p>
                    <button onClick={() => setSelectedAngle(null)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" /></svg></button>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{info.general}</p>
                </div>
                {/* Personal reading */}
                {info.personal && (
                  <div className="card border-l-4" style={{ borderLeftColor: '#D85A30' }}>
                    <p className="font-semibold text-sm mb-2">
                      Your {selectedAngle} in {info.sign}
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed">{info.personal}</p>
                  </div>
                )}
              </div>
            )
          })()}

          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">Tap a planet, house, sign, or angle to explore</p>
        </div>
      )}

      {/* Planets Tab */}
      {activeTab === 'planets' && (
        <div className="space-y-3">
          {effectivePlanets.map(p => (
            <PlanetCard
              key={p.planet}
              planet={p}
              interp={interp}
              isOpen={openPlanets.has(p.planet)}
              onToggle={() => setOpenPlanets(prev => {
                const next = new Set(prev)
                if (next.has(p.planet)) next.delete(p.planet); else next.add(p.planet)
                return next
              })}
              onPlanetClick={showPlanetTooltip}
              onSignClick={showSignTooltip}
            />
          ))}

          {/* Chart Angles — ASC, DSC, MC, IC */}
          {(() => {
            const dscSign = SIGN_LIST[(SIGN_LIST.indexOf(chartData.ascendantSign) + 6) % 12]
            const icSign = SIGN_LIST[(SIGN_LIST.indexOf(chartData.midheavenSign) + 6) % 12]
            const angles = [
              { key: 'ASC', label: 'Ascendant (Rising)', symbol: '↑', sign: chartData.ascendantSign, degree: chartData.ascendant % 30, house: 1, text: ASC_IN_SIGN[chartData.ascendantSign] },
              { key: 'DSC', label: 'Descendant', symbol: '↓', sign: dscSign, degree: (chartData.ascendant + 180) % 360 % 30, house: 7, text: DSC_IN_SIGN[dscSign] },
              { key: 'MC', label: 'Midheaven', symbol: 'MC', sign: chartData.midheavenSign, degree: chartData.midheaven % 30, house: 10, text: MC_IN_SIGN[chartData.midheavenSign] },
              { key: 'IC', label: 'Imum Coeli', symbol: 'IC', sign: icSign, degree: (chartData.midheaven + 180) % 360 % 30, house: 4, text: IC_IN_SIGN[icSign] },
              ...(chartData.vertex != null && chartData.vertexSign ? [{ key: 'VX', label: 'Vertex', symbol: 'Vx', sign: chartData.vertexSign, degree: chartData.vertex % 30, house: null as number | null, text: VERTEX_IN_SIGN[chartData.vertexSign] ?? '' }] : []),
              ...(chartData.partOfFortune != null && chartData.partOfFortuneSign ? [{ key: 'POF', label: 'Part of Fortune', symbol: '⊕', sign: chartData.partOfFortuneSign, degree: chartData.partOfFortune % 30, house: null as number | null, text: PART_OF_FORTUNE_IN_SIGN[chartData.partOfFortuneSign] ?? '' }] : []),
            ]
            return (
              <>
                <h3 className="font-display text-lg tracking-wide text-slate-500 dark:text-slate-400 mt-6 mb-1">Chart Angles</h3>
                {angles.map(a => {
                  const ec = getElementColor(a.sign)
                  const isOpen = openPlanets.has(a.key)
                  return (
                    <div key={a.key} className={`card border-l-4 ${ec.border}`}>
                      <button
                        onClick={() => setOpenPlanets(prev => {
                          const next = new Set(prev)
                          if (next.has(a.key)) next.delete(a.key); else next.add(a.key)
                          return next
                        })}
                        className="w-full flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-lg ${ec.text}`}>{a.symbol}</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">{a.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium text-sm ${ec.text}`}><SignGlyph sign={a.sign} decorative /> {a.sign}</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">{Math.floor(a.degree)}°{a.house != null ? ` · H${a.house}` : ''}</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-slate-300 dark:text-slate-600 transition-transform ${isOpen ? 'rotate-90' : ''}`}><path d="M9 18l6-6-6-6" /></svg>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="mt-3 space-y-3">
                          {ANGLE_GENERAL[a.key] && (
                            <TextParagraphs html={ANGLE_GENERAL[a.key]} className="text-slate-600 text-sm leading-relaxed" />
                          )}
                          {a.text && (
                            <div>
                              <button
                                onClick={() => setOpenAngleLearnMore(prev => {
                                  const next = new Set(prev)
                                  if (next.has(a.key)) next.delete(a.key); else next.add(a.key)
                                  return next
                                })}
                                className={`text-xs ${ec.text} font-medium hover:opacity-70 transition-opacity`}
                              >
                                {openAngleLearnMore.has(a.key) ? '↑ Hide details' : '↓ Learn more'}
                              </button>
                              {openAngleLearnMore.has(a.key) && (
                                <div className={`mt-3 pl-3 border-l-2 ${ec.border}`}>
                                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{a.label} in {a.sign}</p>
                                  <TextParagraphs html={a.text} className="text-slate-600 text-sm leading-relaxed" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </>
            )
          })()}
        </div>
      )}

      {/* Houses Tab */}
      {activeTab === 'houses' && (
        <div className="space-y-2">
          {housesData.map(h => {
            const hec = getElementColor(h.cuspSign)
            return (
              <div key={h.houseNum} className={`card border-l-4 ${hec.border}`}>
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => showHouseTooltip(h.houseNum)}
                    className="text-lg font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-colors min-w-[2.5rem] cursor-help"
                  >
                    H{h.houseNum}
                  </button>
                  <div className="flex-1">
                    <span
                      className={`text-sm font-medium cursor-help ${hec.text}`}
                      onClick={() => showSignTooltip(h.cuspSign)}
                    >
                      <SignGlyph sign={h.cuspSign} decorative /> {h.cuspSign}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">{Math.floor(h.cuspDeg % 30)}°</span>
                    {h.planetsInHouse.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {h.planetsInHouse.map(p => {
                          const pec = getElementColor(p.sign)
                          const isExpanded = expandedInlinePlanets.has(`house-${h.houseNum}-${p.planet}`)
                          return (
                            <button
                              key={p.planet}
                              className={`text-xs px-2 py-0.5 rounded-full ${pec.bg} border ${pec.border} ${pec.text} transition-colors ${isExpanded ? 'ring-1 ring-offset-1 ring-slate-300' : ''}`}
                              onClick={() => setExpandedInlinePlanets(prev => {
                                const next = new Set(prev)
                                const key = `house-${h.houseNum}-${p.planet}`
                                if (next.has(key)) next.delete(key); else next.add(key)
                                return next
                              })}
                            >
                              {interp.planets[p.planet]?.symbol} {interp.planets[p.planet]?.name || p.planet}
                              {p.retrograde && ' ℞'}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
                {/* Expanded planet interpretations within this house */}
                {h.planetsInHouse.filter(p => expandedInlinePlanets.has(`house-${h.houseNum}-${p.planet}`)).map(p => {
                  const pi = interp.planets[p.planet]
                  const key = `${p.planet}_${p.sign}_H${h.houseNum}`
                  const text = interp.combined[key] || interp.planetInHouse[`${p.planet}_H${h.houseNum}`] || ''
                  return text ? (
                    <div key={p.planet} className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                        {pi?.symbol} {pi?.name || p.planet} in {p.sign} · House {h.houseNum}
                      </p>
                      <TextParagraphs html={text} className="text-slate-600 text-sm leading-relaxed" />
                    </div>
                  ) : null
                })}
              </div>
            )
          })}
        </div>
      )}

      {/* Further Reading */}
      {(() => {
        const sunSign = chartData.planets.find(p => p.planet === 'SUN')?.sign
        const books = sunSign ? SIGN_BOOKS[sunSign] : null
        if (!books || books.length === 0) return null
        return (
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">Further Reading</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Picked for your {sunSign} Sun</p>
              </div>
              <a href="/reading-room" className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                Full library →
              </a>
            </div>
            <div className="space-y-2">
              {books.map((book, i) => (
                <a
                  key={i}
                  href={book.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-colors group"
                >
                  {bookCoverUrl(book.amazonUrl) && (
                    <img
                      src={bookCoverUrl(book.amazonUrl)!}
                      alt={`${book.title} cover`}
                      loading="lazy"
                      className="w-12 h-auto flex-shrink-0 rounded shadow-sm"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors leading-snug">{book.title}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">by {book.author}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{book.blurb}</p>
                  </div>
                </a>
              ))}
            </div>
            <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-3">
              As an Amazon Associate, Birth Chart Library earns from qualifying purchases.
            </p>
          </div>
        )
      })()}

      {tooltip && <InfoSheet content={tooltip} onClose={() => setTooltip(null)} />}
    </div>
  )
}
