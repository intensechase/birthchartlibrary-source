// Planet-specific book recommendations for planet detail pages
// Amazon affiliate tag: birthchartlib-20

export interface PlanetBook {
  title: string
  author: string
  amazonUrl: string
  blurb: string
}

export const PLANET_BOOKS: Record<string, PlanetBook[]> = {
  SUN: [
    { title: 'The Inner Sky', author: 'Steven Forrest', amazonUrl: 'https://www.amazon.com/dp/0979067715?tag=birthchartlib-20', blurb: 'The best introduction to Sun sign astrology that treats it as psychology rather than personality typing.' },
    { title: 'You Were Born for This', author: 'Chani Nicholas', amazonUrl: 'https://www.amazon.com/dp/0062820729?tag=birthchartlib-20', blurb: 'Builds your self-understanding through Sun, Moon, and Rising... a practical guide to living your chart.' },
    { title: 'The Only Astrology Book You\'ll Ever Need', author: 'Joanna Martine Woolfolk', amazonUrl: 'https://www.amazon.com/dp/1589796535?tag=birthchartlib-20', blurb: 'Comprehensive Sun sign profiles with deep coverage of personality, compatibility, and life themes.' },
  ],
  MOON: [
    { title: 'Astrology for the Soul', author: 'Jan Spiller', amazonUrl: 'https://www.amazon.com/dp/0553378384?tag=birthchartlib-20', blurb: 'The definitive guide to the lunar nodes... essential reading for understanding your emotional karmic path.' },
    { title: 'The Inner Sky', author: 'Steven Forrest', amazonUrl: 'https://www.amazon.com/dp/0979067715?tag=birthchartlib-20', blurb: 'Rich Moon sign interpretations that go beyond pop astrology into real emotional psychology.' },
    { title: 'Astrology and the Authentic Self', author: 'Demetra George', amazonUrl: 'https://www.amazon.com/dp/0892541490?tag=birthchartlib-20', blurb: 'Explores the Moon\'s role in chart synthesis... how your emotional needs shape every other placement.' },
  ],
  MERCURY: [
    { title: 'Astrology and the Authentic Self', author: 'Demetra George', amazonUrl: 'https://www.amazon.com/dp/0892541490?tag=birthchartlib-20', blurb: 'Mercury\'s role in communication, mind, and chart synthesis handled with scholarly depth.' },
    { title: 'The Inner Sky', author: 'Steven Forrest', amazonUrl: 'https://www.amazon.com/dp/0979067715?tag=birthchartlib-20', blurb: 'Forrest\'s approach to Mercury as a thinking style rather than just a communication planet.' },
    { title: 'Chart Interpretation Handbook', author: 'Stephen Arroyo', amazonUrl: 'https://www.amazon.com/dp/0916360490?tag=birthchartlib-20', blurb: 'A practical guide to integrating Mercury\'s sign and house into your full chart picture.' },
  ],
  VENUS: [
    { title: 'Astrology and the Authentic Self', author: 'Demetra George', amazonUrl: 'https://www.amazon.com/dp/0892541490?tag=birthchartlib-20', blurb: 'Venus as a lens for values, beauty, and relationship — treated with the nuance it deserves.' },
    { title: 'You Were Born for This', author: 'Chani Nicholas', amazonUrl: 'https://www.amazon.com/dp/0062820729?tag=birthchartlib-20', blurb: 'Accessible, relationship-aware astrology that takes Venus\'s placement seriously.' },
    { title: 'Aspects in Astrology', author: 'Sue Tompkins', amazonUrl: 'https://www.amazon.com/dp/0892819650?tag=birthchartlib-20', blurb: 'How Venus aspects shape love styles, self-worth, and what you find beautiful in the world.' },
  ],
  MARS: [
    { title: 'The Inner Sky', author: 'Steven Forrest', amazonUrl: 'https://www.amazon.com/dp/0979067715?tag=birthchartlib-20', blurb: 'Mars as drive and desire — Forrest brings depth to how this planet energizes your chart.' },
    { title: 'Aspects in Astrology', author: 'Sue Tompkins', amazonUrl: 'https://www.amazon.com/dp/0892819650?tag=birthchartlib-20', blurb: 'Essential for understanding how Mars aspects modify assertion, ambition, and anger.' },
    { title: 'Chart Interpretation Handbook', author: 'Stephen Arroyo', amazonUrl: 'https://www.amazon.com/dp/0916360490?tag=birthchartlib-20', blurb: 'Arroyo\'s method for reading Mars in context of the full chart... practical and grounded.' },
  ],
  JUPITER: [
    { title: 'Cosmos and Psyche', author: 'Richard Tarnas', amazonUrl: 'https://www.amazon.com/dp/0452288592?tag=birthchartlib-20', blurb: 'Jupiter as historical force and personal expansion... a sweeping, philosophically rich read.' },
    { title: 'Planets in Transit', author: 'Robert Hand', amazonUrl: 'https://www.amazon.com/dp/0924608269?tag=birthchartlib-20', blurb: 'The standard reference for Jupiter transits — when opportunity opens and where to look for it.' },
    { title: 'The Inner Sky', author: 'Steven Forrest', amazonUrl: 'https://www.amazon.com/dp/0979067715?tag=birthchartlib-20', blurb: 'Forrest frames Jupiter as the planet of meaning and luck... how it expresses through each sign.' },
  ],
  SATURN: [
    { title: 'Planets in Transit', author: 'Robert Hand', amazonUrl: 'https://www.amazon.com/dp/0924608269?tag=birthchartlib-20', blurb: 'The definitive resource on Saturn transits... indispensable when Saturn is active in your chart.' },
    { title: 'Astrology and the Authentic Self', author: 'Demetra George', amazonUrl: 'https://www.amazon.com/dp/0892541490?tag=birthchartlib-20', blurb: 'Saturn as structure and soul task — George brings ancient perspectives to bear on this challenging planet.' },
    { title: 'The Inner Sky', author: 'Steven Forrest', amazonUrl: 'https://www.amazon.com/dp/0979067715?tag=birthchartlib-20', blurb: 'Forrest\'s compassionate take on Saturn — where discipline and limitation become mastery.' },
  ],
  URANUS: [
    { title: 'Cosmos and Psyche', author: 'Richard Tarnas', amazonUrl: 'https://www.amazon.com/dp/0452288592?tag=birthchartlib-20', blurb: 'Uranus as revolutionary force through history and in the individual chart... Tarnas at his best.' },
    { title: 'Planets in Transit', author: 'Robert Hand', amazonUrl: 'https://www.amazon.com/dp/0924608269?tag=birthchartlib-20', blurb: 'What to expect when Uranus transits your chart — the disruptions, breakthroughs, and liberations.' },
    { title: 'Hellenistic Astrology', author: 'Chris Brennan', amazonUrl: 'https://www.amazon.com/dp/0998588903?tag=birthchartlib-20', blurb: 'Understanding Uranus in its historical and traditional context, alongside modern interpretation.' },
  ],
  NEPTUNE: [
    { title: 'Cosmos and Psyche', author: 'Richard Tarnas', amazonUrl: 'https://www.amazon.com/dp/0452288592?tag=birthchartlib-20', blurb: 'Neptune as collective yearning and spiritual dissolution — beautifully handled by Tarnas.' },
    { title: 'Planets in Transit', author: 'Robert Hand', amazonUrl: 'https://www.amazon.com/dp/0924608269?tag=birthchartlib-20', blurb: 'Neptune transit interpretations — where boundaries blur, imagination expands, and clarity returns slowly.' },
    { title: 'The Inner Sky', author: 'Steven Forrest', amazonUrl: 'https://www.amazon.com/dp/0979067715?tag=birthchartlib-20', blurb: 'Forrest\'s poetic treatment of Neptune across the signs and houses.' },
  ],
  PLUTO: [
    { title: 'Cosmos and Psyche', author: 'Richard Tarnas', amazonUrl: 'https://www.amazon.com/dp/0452288592?tag=birthchartlib-20', blurb: 'Pluto as transformative historical force — the most compelling account of this planet\'s power.' },
    { title: 'Planets in Transit', author: 'Robert Hand', amazonUrl: 'https://www.amazon.com/dp/0924608269?tag=birthchartlib-20', blurb: 'Pluto transit interpretations — slow, deep, and often felt years before the exact hit.' },
    { title: 'Astrology and the Authentic Self', author: 'Demetra George', amazonUrl: 'https://www.amazon.com/dp/0892541490?tag=birthchartlib-20', blurb: 'Pluto in the chart as a generational and personal marker of what must be transformed.' },
  ],
  NORTH_NODE: [
    { title: 'Astrology for the Soul', author: 'Jan Spiller', amazonUrl: 'https://www.amazon.com/dp/0553378384?tag=birthchartlib-20', blurb: 'The essential North Node book — what your soul is growing toward and what you\'re learning to release.' },
    { title: 'Astrology and the Authentic Self', author: 'Demetra George', amazonUrl: 'https://www.amazon.com/dp/0892541490?tag=birthchartlib-20', blurb: 'The nodal axis in traditional and modern synthesis... rigorous and rewarding.' },
    { title: 'The Inner Sky', author: 'Steven Forrest', amazonUrl: 'https://www.amazon.com/dp/0979067715?tag=birthchartlib-20', blurb: 'Forrest frames the nodes as the soul\'s evolutionary direction — readable and transformative.' },
  ],
  CHIRON: [
    { title: 'Astrology and the Authentic Self', author: 'Demetra George', amazonUrl: 'https://www.amazon.com/dp/0892541490?tag=birthchartlib-20', blurb: 'Chiron as wounded healer — its placement as the key to your deepest wound and your most meaningful gift.' },
    { title: 'The Inner Sky', author: 'Steven Forrest', amazonUrl: 'https://www.amazon.com/dp/0979067715?tag=birthchartlib-20', blurb: 'Forrest\'s psychologically grounded approach to Chiron across the signs and houses.' },
    { title: 'Aspects in Astrology', author: 'Sue Tompkins', amazonUrl: 'https://www.amazon.com/dp/0892819650?tag=birthchartlib-20', blurb: 'How Chiron aspects the rest of your chart and what they reveal about healing and mentorship.' },
  ],
}
