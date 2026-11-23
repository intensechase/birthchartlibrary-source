// Real people shown on teaching pages, as examples of the idea on that page
// (pilot, owner approved 2026-11-23: five pages, named in TODO "Google + Bing game
// plan"). Picked by hand. Every placement was worked out with the site's engine:
// recheck it before adding or changing anyone, and use finished bios only.
// People without a birth time may only be used for aspects that hold all day.
// `other` makes it a pair: the link goes to their compare page.
export interface RealPerson { slug: string; name: string; sign: string; what: string; text: string; other?: { slug: string; name: string; sign: string; compare: string } }
export interface RealChartSet { lede: string; people: RealPerson[]; button: string; href?: string }

// Keyed by page path.
export const REAL_CHARTS: Record<string, RealChartSet> = {
  '/astrology-aspects/conjunction': {
    lede: 'Three people born with two planets in nearly the same spot.',
    button: 'See the conjunctions in your chart',
    people: [
      { slug: 'oprah-winfrey', name: 'Oprah Winfrey', sign: 'Aquarius', what: 'Sun and Venus in Aquarius, 0.1° apart',
        text: 'The Sun is who you are. Venus is what people like about you. Hers share one spot, so being herself was the job, and she did 25 years and 4,561 episodes of it.' },
      { slug: 'dolly-parton', name: 'Dolly Parton', sign: 'Capricorn', what: 'Mars and Saturn in Cancer, 0.1° apart',
        text: 'Mars fights. Saturn holds the line. When Elvis Presley’s manager asked for half the publishing on “I Will Always Love You,” she said no, and the song was still hers when Whitney Houston took it to the top of the charts.' },
      { slug: 'robin-williams', name: 'Robin Williams', sign: 'Cancer', what: 'Mars and Uranus in Cancer, 1.1° apart',
        text: 'Mars moves. Uranus changes direction and tells nobody. On a stage that was a dozen voices in a few minutes, with the audience running to keep up.' },
    ],
  },
  '/astrology-aspects/trine': {
    lede: 'Three people born with two planets a third of the sky apart.',
    button: 'See the trines in your chart',
    people: [
      { slug: 'prince-william', name: 'Prince William', sign: 'Cancer', what: 'Sun in Cancer, Jupiter in Scorpio, 0.4° from exact',
        text: 'Jupiter gives the Sun room to grow, and in a trine nobody has to ask for it. He was second in line to a throne the day he was born. He went and joined a helicopter crew: 156 rescue operations, 149 people brought to safety.' },
      { slug: 'tom-cruise', name: 'Tom Cruise', sign: 'Cancer', what: 'Sun in Cancer, Neptune in Scorpio, within 1° of exact all that day',
        text: 'Neptune blurs the line between the person and the picture. In a trine nothing puts up a fight. He said it himself: “Making films is not what I do. It is who I am.”' },
      { slug: 'lady-gaga', name: 'Lady Gaga', sign: 'Aries', what: 'Sun in Aries, Saturn in Sagittarius, within 3° of exact all that day',
        text: 'The Sun walks in. Saturn has been practicing. Everyone remembers the dress made of meat. The trine is the piano she had been playing since she was four.' },
    ],
  },
  '/astrology-houses/8': {
    lede: 'Three people with planets in the eighth house.',
    button: 'See your eighth house',
    people: [
      { slug: 'prince-harry', name: 'Prince Harry', sign: 'Virgo', what: 'Sun in Virgo in the eighth house',
        text: 'In 1647 William Lilly gave this house “Wills, Legacies,” and the question of who gets to be heir. Harry grew up as the spare, and put it on the cover of his book.' },
      { slug: 'jackie-kennedy', name: 'Jackie Kennedy', sign: 'Leo', what: 'Venus in Gemini and Pluto in Cancer in the eighth house, by the birth time she gave friends',
        text: 'This house asks what gets left behind, and who decides. A week after Dallas she gave an interview and compared those years to Camelot. That was that.' },
      { slug: 'bill-clinton', name: 'Bill Clinton', sign: 'Leo', what: 'Moon in Taurus in the eighth house, by the birth time his mother gave',
        text: 'A Taurus Moon wants things to hold still. The eighth house is where they don’t. His father died three months before he was born.' },
    ],
  },
  '/blog/synastry-relationship-astrology': {
    lede: 'Three pairs, and one line between their charts.',
    button: 'Compare two charts',
    href: '/calculators/synastry',
    people: [
      { slug: 'dolly-parton', name: 'Dolly Parton', sign: 'Capricorn', other: { slug: 'carl-dean', name: 'Carl Dean', sign: 'Cancer', compare: 'dolly-parton-vs-carl-dean' }, what: 'Her Venus opposite his Sun, within 2° of exact',
        text: 'An opposition puts you across the table from everything you aren’t. She loved to go. He tried one awards night and never went to another. They were married almost sixty years.' },
      { slug: 'prince-william', name: 'Prince William', sign: 'Cancer', other: { slug: 'prince-harry', name: 'Prince Harry', sign: 'Virgo', compare: 'prince-harry-vs-prince-william' }, what: 'William’s Moon opposite Harry’s Jupiter, 1.4° from exact',
        text: 'The Moon wants home. Jupiter wants to see what else there is. Set across from each other, each one gets a clear view of the road he didn’t take. One stayed. One moved to California.' },
      { slug: 'michael-jackson', name: 'Michael Jackson', sign: 'Virgo', other: { slug: 'prince', name: 'Prince', sign: 'Gemini', compare: 'michael-jackson-vs-prince' }, what: 'Michael’s Saturn opposite Prince’s Sun, 2.4° from exact',
        text: 'Saturn is the standard. Somebody’s Sun has to stand next to it. They were born twelve weeks apart in 1958, and neither one was ever going to be graded alone.' },
    ],
  },
  '/blog/pluto-in-your-birth-chart': {
    lede: 'Three people whose Pluto touches something personal.',
    button: 'Find Pluto in your chart',
    people: [
      { slug: 'barbra-streisand', name: 'Barbra Streisand', sign: 'Taurus', what: 'Sun square Pluto, 0.1° from exact',
        text: 'A square from Pluto is an argument about who is in charge. She took every chair at the table. In 1983 she wrote, produced, directed and starred in Yentl, the first woman to do all four on a major studio film.' },
      { slug: 'beyonce', name: 'Beyoncé', sign: 'Virgo', what: 'Venus and Pluto in Libra, 1.9° apart',
        text: 'Venus makes the beautiful thing. Pluto wants to see the paperwork. In 2011 she stopped being managed by her father and ran her career through her own company.' },
      { slug: 'prince', name: 'Prince', sign: 'Gemini', what: 'Moon opposite Pluto, 2.0° from exact',
        text: 'The Moon keeps things private. Pluto locks the door. After he died, the company handling his estate had to have his vault of recordings drilled open.' },
    ],
  },
}
