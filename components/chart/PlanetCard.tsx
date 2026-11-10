'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { PlanetPosition } from '@/lib/swisseph/calculate'
import { getElementColor } from '@/lib/zodiac-colors'
import { SignGlyph } from '@/components/Glyph'
import { getDignity, DIGNITY_LABELS } from '@/lib/dignities'
import TextParagraphs from './TextParagraphs'

interface PlanetInfo { name: string; symbol: string; description: string }
interface SignInfo { symbol: string; element: string; modality: string; ruledBy: string; keywords: string[]; description: string }
interface HouseInfo { name: string; keywords: string[]; description: string }

export interface Interpretations {
  combined: Record<string, string>
  planetInSign: Record<string, string>
  planetInHouse: Record<string, string>
  planets: Record<string, PlanetInfo>
  signs: Record<string, SignInfo>
  houses: Record<number, HouseInfo>
}

interface Props {
  planet: PlanetPosition
  interp: Interpretations
  isOpen: boolean
  onToggle: () => void
  onPlanetClick: (planet: string) => void
  onSignClick: (sign: string) => void
}

export default function PlanetCard({ planet, interp, isOpen, onToggle, onPlanetClick, onSignClick }: Props) {
  const [showLearnMore, setShowLearnMore] = useState(false)
  const info = interp.planets[planet.planet]
  const combined = interp.combined[`${planet.planet}_${planet.sign}_H${planet.house}`] || ''
  const piSign = interp.planetInSign[`${planet.planet}_${planet.sign}`] || ''
  const piHouse = interp.planetInHouse[`${planet.planet}_H${planet.house}`] || ''
  const ec = getElementColor(planet.sign)
  const dignity = getDignity(planet.planet, planet.sign)
  const dignityStyle = dignity ? DIGNITY_LABELS[dignity] : null

  return (
    <div className={`card overflow-hidden border-l-4 ${ec.border}`}>
      <button onClick={onToggle} className="w-full text-left flex items-center justify-between p-0">
        <div className="flex items-center gap-3">
          <span className={`text-xl ${ec.text}`}>{info?.symbol || '•'}</span>
          <div>
            <span
              className="font-medium hover:text-slate-600 transition-colors cursor-help"
              onClick={e => { e.stopPropagation(); onPlanetClick(planet.planet) }}
            >
              {info?.name || planet.planet.replace('_', ' ')}
            </span>
            <div className="text-sm text-slate-500">
              <span className={`${ec.text} cursor-help`} onClick={e => { e.stopPropagation(); onSignClick(planet.sign) }}>
                <SignGlyph sign={planet.sign} decorative /> {planet.sign}
              </span>
              <span className="text-slate-400 ml-1.5">{Math.floor(planet.signDegree)}°</span>
              <span className="text-slate-400 ml-1.5">H{planet.house}</span>
              {planet.retrograde && <span className="text-amber-500 ml-1.5">℞</span>}
              {dignityStyle && <span className={`ml-1.5 text-[10px] px-1.5 py-px rounded-full ${dignityStyle.bg} ${dignityStyle.color}`}>{dignityStyle.label}</span>}
            </div>
          </div>
        </div>
        <span className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
          {combined && (
            <TextParagraphs html={combined} className="text-slate-600 leading-relaxed text-sm" />
          )}

          {(piSign || piHouse) && (
            <div>
              <button
                onClick={() => setShowLearnMore(!showLearnMore)}
                className={`text-xs ${ec.text} hover:opacity-80 transition-colors`}
              >
                {showLearnMore ? '▴ Hide details' : '▾ Learn more'}
              </button>

              {showLearnMore && (
                <div className={`mt-3 space-y-3 pl-3 border-l-2 ${ec.border}`}>
                  {piSign && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">
                        {info?.name || planet.planet} in {planet.sign}
                      </p>
                      <TextParagraphs html={piSign} className="text-slate-500 text-sm leading-relaxed" />
                    </div>
                  )}
                  {piHouse && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">
                        {info?.name || planet.planet} in House {planet.house}
                      </p>
                      <TextParagraphs html={piHouse} className="text-slate-500 text-sm leading-relaxed" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Forward links */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href={`/zodiac-signs/${planet.sign.toLowerCase()}`}
              className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              About {planet.sign} →
            </Link>
            <Link
              href={`/astrology-planets/${planet.planet.toLowerCase().replace('_', '-')}`}
              className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
            >
              About {info?.name || planet.planet} →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
