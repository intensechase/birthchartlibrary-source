// Reading text written for the redesign model (11/19), not from the site's
// interpretation library. Build list: the owner reads these before anything
// ships. Server only: imported by lib/redesign/celeb-view.ts.

export type Dignity = 'rulership' | 'exaltation' | 'detriment' | 'fall' | 'peregrine'

export const RULER: Record<string, string> = {
  Aries: 'MARS', Taurus: 'VENUS', Gemini: 'MERCURY', Cancer: 'MOON', Leo: 'SUN', Virgo: 'MERCURY',
  Libra: 'VENUS', Scorpio: 'MARS', Sagittarius: 'JUPITER', Capricorn: 'SATURN', Aquarius: 'SATURN', Pisces: 'JUPITER',
}
// RULER above is traditional and drives dignities only (rulership, detriment),
// which every system keeps on the seven visible planets. Everything that names
// "the ruler" of a sign, house or chart uses the modern table (owner, 11/20),
// and names the traditional ruler too where the two differ.
export const MODERN_RULER: Record<string, string> = { ...RULER, Scorpio: 'PLUTO', Aquarius: 'URANUS', Pisces: 'NEPTUNE' }
export const coRuler = (sign: string): string | null => (RULER[sign] !== MODERN_RULER[sign] ? RULER[sign] : null)
export const EXALT: Record<string, string> = {
  SUN: 'Aries', MOON: 'Taurus', MERCURY: 'Virgo', VENUS: 'Pisces', MARS: 'Capricorn', JUPITER: 'Cancer', SATURN: 'Libra',
}

export const DIGNITY_LABEL: Record<Dignity, string> = {
  rulership: 'Rulership', exaltation: 'Exaltation', detriment: 'Detriment', fall: 'Fall', peregrine: 'No dignity',
}

export const DIGNITY_MEANING: Record<Dignity, string> = {
  rulership: 'Rulership is the strongest standing a planet can have. Astrologers read a planet in its own sign as confident and well supplied: it gets what it needs from the sign around it, and its themes show up plainly in the life.',
  exaltation: 'Exaltation is the second strongest standing. The planet is not at home, but the sign brings out its finest version, so its themes tend to arrive polished and are often where a person is admired.',
  detriment: 'Detriment does not make a placement bad. It means the planet works in a style that is foreign to it, so its themes take more effort and often show up in unusual, hard won ways.',
  fall: 'Fall does not make a placement bad. It means the planet is far from where it shines best, so its needs are harder to meet and the person often builds unusual strength around them.',
  peregrine: 'Most placements in most charts are like this. A planet with no dignity is neither helped nor hindered by its sign, so how it behaves depends on the house it is in and the planets it touches.',
}

export const OUTER_DIGNITY = 'Uranus, Neptune and Pluto were found long after the traditional dignities were set, so most astrologers give them none. Their sign shows the generation a person belongs to more than their own character; the house they sit in and the planets they touch say more about the individual.'

export const GROUP_TEXT: Record<string, [string, string]> = {
  Fire: ['Fire is the element of drive and spark. It acts first and asks questions later, and it runs on enthusiasm, courage and the need to make something happen. A chart with strong Fire wants to lead, perform, compete or create, and it gets restless when life goes quiet for too long.',
    'The Fire signs are Aries, Leo and Sagittarius. Aries starts the fire, Leo keeps it burning, and Sagittarius carries it somewhere new. All three are warm, direct and quick to act, and all three can burn out, or burn others, when the pace never drops.'],
  Earth: ['Earth is the element of the body and the material world. It trusts what it can touch, measure and build, and it values patience, skill and results that last. A chart with strong Earth is practical and steady, the person others rely on to make a plan actually happen.',
    'The Earth signs are Taurus, Virgo and Capricorn. Capricorn sets the goal, Taurus holds the ground, and Virgo refines the details. Together they cover building, keeping and improving, and their shared weak spot is getting stuck in routine or worry.'],
  Air: ['Air is the element of the mind and of connection. It lives in ideas, words, questions and the space between people, and it needs room to think and someone to talk to. A chart with strong Air reads situations quickly, sees several sides at once and often prefers to understand a feeling before having it.',
    'The Air signs are Gemini, Libra and Aquarius. Libra starts the conversation, Aquarius holds to an idea, and Gemini moves between many. They are sociable, curious and fair minded, and they can drift into detachment when emotions get heavy.'],
  Water: ['Water is the element of feeling and memory. It senses moods before they are spoken, bonds deeply and remembers what hurt. A chart with strong Water is intuitive, protective and emotionally brave, and it needs safe people and private time to refill.',
    'The Water signs are Cancer, Scorpio and Pisces. Cancer reaches out to care, Scorpio goes deep and holds on, and Pisces dissolves the edges between people. Their gift is empathy; their risk is being flooded by what they absorb.'],
  Cardinal: ['Cardinal is the mode of beginnings. Cardinal signs open each season, and they meet life by starting things: a plan, a project, a conversation that needed to happen. A chart with strong Cardinal energy takes the initiative and gets impatient waiting for permission.',
    'The Cardinal signs are Aries, Cancer, Libra and Capricorn, one from each element. Aries starts with action, Cancer with care, Libra with an invitation and Capricorn with a plan.'],
  Fixed: ['Fixed is the mode of staying power. Fixed signs sit in the middle of each season, when the weather has settled, and they meet life by holding on: to loyalties, values, habits and goals. A chart with strong Fixed energy finishes what it starts and is hard to move once decided.',
    'The Fixed signs are Taurus, Leo, Scorpio and Aquarius. Taurus holds to comfort, Leo to pride and heart, Scorpio to bonds and secrets, and Aquarius to ideas and principles.'],
  Mutable: ['Mutable is the mode of change. Mutable signs close each season and point toward the next, and they meet life by adapting: learning, adjusting, translating between people. A chart with strong Mutable energy is flexible and curious, and it can scatter when nothing holds it in place.',
    'The Mutable signs are Gemini, Virgo, Sagittarius and Pisces. Gemini adapts through talk, Virgo through skill, Sagittarius through exploring and Pisces through empathy.'],
  Active: ['Active signs, also called masculine or yang, push energy outward. They express, initiate and engage with the world directly, and they recharge through doing, moving and talking.',
    'The Fire and Air signs are active: Aries, Gemini, Leo, Libra, Sagittarius and Aquarius. A chart weighted this way tends to be outgoing and quick to respond, more at home acting and saying than waiting and sensing.'],
  Receptive: ['Receptive signs, also called feminine or yin, draw energy inward. They absorb, sustain and respond, working through patience and sensitivity rather than force, and they recharge through quiet and closeness.',
    'The Earth and Water signs are receptive: Taurus, Cancer, Virgo, Scorpio, Capricorn and Pisces. A chart weighted this way tends to be reflective and steady, more at home building, caring and reading the room than pushing into it.'],
}

export const NUM_KEYWORD: Record<number, string> = {
  1: 'Independence', 2: 'Partnership', 3: 'Expression', 4: 'Structure', 5: 'Freedom', 6: 'Care',
  7: 'Insight', 8: 'Power', 9: 'Compassion', 11: 'Intuition', 22: 'Master builder', 33: 'Master teacher',
}
export const NUM_MEANING: Record<number, string> = {
  1: 'One is the number of the self and of beginnings. It is independent, driven and original, happiest leading or working on its own idea. Its gift is courage; its risk is going it alone for so long that it forgets how to ask for help.',
  2: 'Two is the number of partnership. It is tactful, patient and tuned to other people, the one who notices the mood in a room and smooths it. Its gift is cooperation and quiet influence; its risk is shrinking itself to keep the peace.',
  3: 'Three is the number of expression. It is playful, social and creative, at its best with words, music, performance or anything that turns feeling into something others can enjoy. Its gift is joy that spreads; its risk is scattering talent across too many things.',
  4: 'Four is the number of structure. It is steady, careful and hardworking, the builder who makes things last. Its gift is reliability; its risk is rigidity, holding to the plan after the ground has changed.',
  5: 'Five is the number of freedom and change. It is curious, adaptable and restless, drawn to travel, variety and anything new. Its gift is the nerve to reinvent; its risk is never staying long enough for something to take root.',
  6: 'Six is the number of care and responsibility. It is warm, protective and devoted to home, family and community. Its gift is making people feel looked after; its risk is carrying everyone else’s load.',
  7: 'Seven is the number of the seeker. It is thoughtful, private and analytical, drawn to study, spirituality and the questions under the questions. Its gift is depth; its risk is retreating so far inward that others cannot reach it.',
  8: 'Eight is the number of power and results. It is ambitious, capable and at home with money, authority and large projects. Its gift is turning vision into something real; its risk is measuring everything, and everyone, by success.',
  9: 'Nine is the number of completion and compassion. It is generous, idealistic and broad minded, with a pull toward causes bigger than itself. Its gift is wisdom earned through experience; its risk is giving so much that nothing is left.',
  11: 'Eleven is a master number, a heightened two. It is intuitive, inspired and sensitive, often drawn to teach or lead by vision. Its gift is insight others can feel; its risk is nervous strain from carrying that much signal.',
  22: 'Twenty two is a master number, a heightened four: the master builder who can turn large dreams into lasting structures. Its risk is the pressure of its own potential.',
  33: 'Thirty three is a master number, a heightened six: the master teacher, devoted to healing and service. Its risk is self sacrifice.',
}
export const YEAR_THEME: Record<number, string> = {
  1: 'a year for new starts and planting seeds', 2: 'a year for patience, partnership and letting things grow',
  3: 'a year for expression, friends and creative work', 4: 'a year for hard work and building foundations',
  5: 'a year of change, travel and breaking old routines', 6: 'a year centered on home, family and responsibility',
  7: 'a year for rest, study and looking inward', 8: 'a year of ambition, money and stepping into authority',
  9: 'a year of endings, clearing out and getting ready for the next cycle',
}
export const NUM_WHAT: Record<string, string> = {
  'life-path': 'The life path number is the main number in numerology. It comes from the full birth date and describes the road a person travels: the lessons that keep returning, the strengths they grow into and the kind of life that feels right. Numerologists read it the way astrologers read the Sun.',
  destiny: 'The destiny number, also called the expression number, comes from every letter of the full birth name. It describes natural talents and the way a person puts them to use, the toolkit they were handed at birth.',
  'soul-urge': 'The soul urge number, also called the heart’s desire, comes from the vowels in the birth name. It points at private motivation: what a person wants underneath what they show, the thing that makes a life feel worth it from the inside.',
  personality: 'The personality number comes from the consonants in the birth name. It describes the outer layer, how other people read someone before they know them well. Numerology treats it the way astrology treats the rising sign.',
  'personal-year': 'The personal year number changes every year. It comes from the birth month and day plus the current year, and it sets the theme for the year ahead. The cycle runs from 1 to 9 and then starts again, so each year is one step in a longer story.',
}

export const TERM_TEXT = {
  day: 'Born with the Sun above the horizon. Traditional astrology then treats the Sun as the chart’s leading light, and Jupiter and Saturn act at their most generous and steady.',
  night: 'Born with the Sun below the horizon. Traditional astrology then treats the Moon as the chart’s leading light, and Venus and Mars are said to work at their best.',
  phase: 'The Moon’s phase at birth, read from the angle between the Sun and the Moon. Each of the eight phases is said to be a different way of meeting life, from the new Moon’s fresh start to the balsamic Moon’s letting go.',
  stellium: 'Three or more planets packed into one sign or house. That part of life carries extra weight, and the sign’s style colors much of the chart.',
  chartRuler: 'The planet that rules the rising sign. It acts as the chart’s captain: wherever it sits, by sign and house, is where the whole chart likes to put its energy.',
  retro: 'A planet is retrograde when, seen from Earth, it seems to move backward through the zodiac. Astrologers read a natal retrograde as energy turned inward: worked out privately, often late, and in a style of its own.',
  noTime: 'Without a birth time the rising sign, the houses and the sky picture can’t be worked out, since all three turn on the exact minute. Everything here is by sign, which the birth date settles.',
}

export const PHASES: [number, string, string][] = [
  [45, 'New Moon', 'New Moon births are said to act on instinct and start fresh, meeting life head on.'],
  [90, 'Waxing crescent', 'Crescent births are said to push forward and break from the past.'],
  [135, 'First quarter', 'First quarter births are said to build, decide and act under pressure.'],
  [180, 'Waxing gibbous', 'Gibbous births are said to refine and perfect, always asking how to make it better.'],
  [225, 'Full Moon', 'Full Moon births are said to see clearly and live through relationships.'],
  [270, 'Waning gibbous', 'Disseminating births are said to share what they know and teach.'],
  [315, 'Last quarter', 'Last quarter births are said to question old forms and turn in a new direction.'],
  [360, 'Balsamic', 'Balsamic births are said to finish cycles, with an eye on what comes next.'],
]
