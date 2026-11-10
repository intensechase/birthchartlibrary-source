'use client'

import { useState } from 'react'
import Link from 'next/link'

const ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig']
const ANIMAL_EMOJI: Record<string, string> = {
  Rat: '🐀', Ox: '🐂', Tiger: '🐅', Rabbit: '🐇', Dragon: '🐉', Snake: '🐍',
  Horse: '🐴', Goat: '🐐', Monkey: '🐒', Rooster: '🐓', Dog: '🐕', Pig: '🐖',
}
const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']
const ELEMENT_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  Wood: { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  Fire: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  Earth: { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  Metal: { text: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-300' },
  Water: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
}

const ANIMAL_DESCRIPTIONS: Record<string, string> = {
  Rat: `The Rat is clever, resourceful, and adaptable... the first animal in the zodiac cycle, representing new beginnings and quick thinking. Rats are natural problem-solvers who thrive in social situations and possess an instinctive ability to find opportunity where others see only obstacles.`,
  Ox: `The Ox is steady, reliable, and enormously hardworking... the backbone of any endeavor. Patient and methodical, the Ox achieves through persistence rather than flash. What they build is built to last... and they rarely start something they can't finish.`,
  Tiger: `The Tiger is bold, competitive, and magnetically confident... a natural leader who commands attention without asking for it. Tigers are passionate and driven, with a courage that inspires others. Their challenge is learning that not everything requires a fight.`,
  Rabbit: `The Rabbit is elegant, diplomatic, and quietly perceptive... the peacemaker of the zodiac. Rabbits navigate social situations with grace and possess a refined aesthetic sense. Their gentle exterior conceals a sharp mind and a surprising resilience.`,
  Dragon: `The Dragon is ambitious, charismatic, and larger than life... the most auspicious sign in Chinese astrology. Dragons carry a natural authority and an almost supernatural confidence. They aim high and often achieve what others consider impossible.`,
  Snake: `The Snake is wise, intuitive, and strategically brilliant... the deepest thinker in the zodiac. Snakes observe before they act, trust their instincts, and possess an almost uncanny ability to read people and situations. Their power lies in what they know but don't say.`,
  Horse: `The Horse is energetic, independent, and freedom-loving... always moving, always seeking the next horizon. Horses are natural adventurers with an infectious enthusiasm that draws others into their orbit. Their challenge is learning that standing still isn't the same as being stuck.`,
  Goat: `The Goat is creative, gentle, and deeply empathetic... the artist of the zodiac. Goats experience the world through feeling and imagination, producing beauty wherever they go. They need harmony in their environment and thrive when given space to create.`,
  Monkey: `The Monkey is clever, inventive, and endlessly entertaining... the most mentally agile sign in the zodiac. Monkeys solve problems through wit and innovation, often finding unconventional solutions that nobody else considered. Their charm is genuine and their intelligence is formidable.`,
  Rooster: `The Rooster is observant, hardworking, and refreshingly honest... the most straightforward sign in the zodiac. Roosters say what they see, organize what's chaotic, and hold themselves (and others) to high standards. Their directness is a gift... even when it's uncomfortable.`,
  Dog: `The Dog is loyal, honest, and deeply principled... the most trustworthy sign in the zodiac. Dogs fight for justice, protect those they love, and possess a moral compass that rarely wavers. Their loyalty is not blind... it's earned through integrity and reciprocated through devotion.`,
  Pig: `The Pig is generous, sincere, and genuinely kind... the most warm-hearted sign in the zodiac. Pigs enjoy life's pleasures without guilt and share their abundance freely. Their generosity is not naivety... it's a philosophy that the world becomes better when you give more than you take.`,
}

const ELEMENT_DESCRIPTIONS: Record<string, string> = {
  Wood: `Wood element adds growth, creativity, and idealism. You bend rather than break... flexible, expansive, and always reaching toward the light.`,
  Fire: `Fire element adds passion, enthusiasm, and dynamic energy. You light up whatever you touch... bold, inspiring, and impossible to ignore.`,
  Earth: `Earth element adds stability, practicality, and groundedness. You build on solid foundations... patient, reliable, and deeply rooted in what matters.`,
  Metal: `Metal element adds determination, precision, and moral clarity. You cut through confusion with sharp thinking... disciplined, principled, and uncompromising when it counts.`,
  Water: `Water element adds intuition, adaptability, and emotional depth. You flow around obstacles rather than fighting them... perceptive, diplomatic, and quietly powerful.`,
}

function getChineseZodiac(year: number): { animal: string; element: string } {
  const animalIndex = (year - 4) % 12
  const elementIndex = Math.floor(((year - 4) % 10) / 2)
  return { animal: ANIMALS[animalIndex], element: ELEMENTS[elementIndex] }
}

export default function ChineseZodiacCalculator() {
  const [year, setYear] = useState('')
  const [result, setResult] = useState<{ animal: string; element: string } | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const y = parseInt(year)
    if (isNaN(y) || y < 1900 || y > 2100) return
    setResult(getChineseZodiac(y))
  }

  const ec = result ? ELEMENT_COLORS[result.element] : null

  return (
    <div>
      {!result ? (
        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="block text-sm mb-1 text-slate-500">Birth Year *</label>
            <input
              type="number"
              min="1900"
              max="2100"
              required
              value={year}
              onChange={e => setYear(e.target.value)}
              className="input"
              placeholder="e.g. 1994"
            />
          </div>
          <button type="submit" disabled={!year} className="btn-primary w-full">
            Find My Chinese Zodiac
          </button>
        </form>
      ) : (
        <div>
          <div className={`${ec!.bg} border ${ec!.border} rounded-xl p-8 text-center mb-6`}>
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Year of the {result.animal}</p>
            <p className="text-6xl mb-2">{ANIMAL_EMOJI[result.animal]}</p>
            <h2 className="font-display text-4xl tracking-wide">{result.element} {result.animal}</h2>
            <p className="text-slate-500 text-sm mt-2">Born in {year}</p>
          </div>

          <div className="card mb-4">
            <h3 className="font-semibold mb-2">The {result.animal}</h3>
            <p className="text-slate-700 leading-relaxed text-sm">{ANIMAL_DESCRIPTIONS[result.animal]}</p>
          </div>

          <div className={`card mb-6 border-l-4 ${ec!.border}`}>
            <h3 className={`font-semibold mb-2 ${ec!.text}`}>{result.element} Element</h3>
            <p className="text-slate-700 leading-relaxed text-sm">{ELEMENT_DESCRIPTIONS[result.element]}</p>
          </div>

          <div className="flex gap-3 mb-8">
            <button onClick={() => setResult(null)} className="btn-outline flex-1">
              Calculate Another
            </button>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <p className="font-display text-xl tracking-wide mb-2">Discover what the rest of your chart reveals</p>
            <p className="text-slate-500 text-sm mb-4">Your results won&apos;t last forever... create a free account to save your chart and unlock your personalized daily horoscope.</p>
            <Link href="/signup?ref=calc-chinese-zodiac" className="btn-primary">Create Your Free Chart</Link>
          </div>
        </div>
      )}
    </div>
  )
}
