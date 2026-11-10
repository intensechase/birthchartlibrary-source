import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { readFileSync } from 'fs'
import path from 'path'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { query } from '@/lib/db'
import { isServedCelebrity } from '@/lib/celebrities'
import type { BirthChartData } from '@/lib/swisseph/calculate'
import { computeSynastryAspects, synastryScore, ASPECT_SYMBOLS, PLANET_SYMBOLS } from '@/lib/swisseph/synastry'
import type { SynastryAspect } from '@/lib/swisseph/synastry'
import { breadcrumbSchema, jsonLd } from '@/lib/schema'
import { SignGlyph } from '@/components/Glyph'

interface CelebData {
  name: string
  slug: string
  image_url: string | null
  bio: string | null
  sun_sign: string | null
  moon_sign: string | null
  rising_sign: string | null
  birth_date: string
  birth_city: string
  category: string | null
}

interface Props {
  personA: CelebData
  personB: CelebData
  aspects: SynastryAspect[]
  score: { label: string; score: number }
  missingChart?: string
  loveSlug?: string
  loveTitle?: string
}

// Known couple → love article lookup (compare slug → article slug + title)
const COUPLE_ARTICLES: Record<string, { slug: string; title: string }> = {
  'beyonce-vs-jay-z':                          { slug: 'beyonce-and-jay-z',                        title: 'Beyoncé & Jay-Z' },
  'blake-lively-vs-ryan-reynolds':             { slug: 'blake-lively-and-ryan-reynolds',           title: 'Blake Lively & Ryan Reynolds' },
  'chrissy-teigen-vs-john-legend':             { slug: 'chrissy-teigen-and-john-legend',           title: 'Chrissy Teigen & John Legend' },
  'taylor-swift-vs-travis-kelce':             { slug: 'taylor-swift-and-travis-kelce',            title: 'Taylor Swift & Travis Kelce' },
  'priyanka-chopra-vs-nick-jonas':             { slug: 'priyanka-chopra-and-nick-jonas',           title: 'Priyanka Chopra & Nick Jonas' },
  'hailey-bieber-vs-justin-bieber':           { slug: 'justin-and-hailey-bieber',                 title: 'Justin & Hailey Bieber' },
  'emily-blunt-vs-john-krasinski':             { slug: 'emily-blunt-and-john-krasinski',           title: 'Emily Blunt & John Krasinski' },
  'penelope-cruz-vs-javier-bardem':           { slug: 'penelope-cruz-and-javier-bardem',          title: 'Penélope Cruz & Javier Bardem' },
  'victoria-beckham-vs-david-beckham':         { slug: 'david-and-victoria-beckham',              title: 'David & Victoria Beckham' },
  'catherine-middleton-vs-prince-william': { slug: 'kate-and-prince-william',             title: 'Kate & Prince William' },
  'meghan-markle-vs-prince-harry':             { slug: 'prince-harry-and-meghan-markle',          title: 'Prince Harry & Meghan Markle' },
  'amal-clooney-vs-george-clooney':           { slug: 'george-and-amal-clooney',                 title: 'George & Amal Clooney' },
  'mila-kunis-vs-ashton-kutcher':              { slug: 'mila-kunis-and-ashton-kutcher',           title: 'Mila Kunis & Ashton Kutcher' },
  'kristen-bell-vs-dax-shepard':               { slug: 'kristen-bell-and-dax-shepard',            title: 'Kristen Bell & Dax Shepard' },
  'katy-perry-vs-orlando-bloom':               { slug: 'katy-perry-and-orlando-bloom',            title: 'Katy Perry & Orlando Bloom' },
  'nicole-kidman-vs-keith-urban':              { slug: 'nicole-kidman-and-keith-urban',           title: 'Nicole Kidman & Keith Urban' },
  'faith-hill-vs-tim-mcgraw':                  { slug: 'faith-hill-and-tim-mcgraw',               title: 'Faith Hill & Tim McGraw' },
  'pink-vs-carey-hart':                        { slug: 'pink-and-carey-hart',                     title: 'Pink & Carey Hart' },
  'elton-john-vs-david-furnish':               { slug: 'elton-john-and-david-furnish',            title: 'Elton John & David Furnish' },
  'rihanna-vs-asap-rocky':                     { slug: 'rihanna-and-asap-rocky',                  title: 'Rihanna & ASAP Rocky' },
  'kourtney-kardashian-vs-travis-barker':      { slug: 'kourtney-kardashian-and-travis-barker',   title: 'Kourtney Kardashian & Travis Barker' },
  'selena-gomez-vs-benny-blanco':              { slug: 'selena-gomez-and-benny-blanco',           title: 'Selena Gomez & Benny Blanco' },
  'ariana-grande-vs-ethan-slater':             { slug: 'ariana-grande-and-ethan-slater',          title: 'Ariana Grande & Ethan Slater' },
  'goldie-hawn-vs-kurt-russell':               { slug: 'goldie-hawn-and-kurt-russell',            title: 'Goldie Hawn & Kurt Russell' },
  'dolly-parton-vs-carl-dean':                 { slug: 'dolly-parton-and-carl-dean',              title: 'Dolly Parton & Carl Dean' },
  'barack-obama-vs-michelle-obama':            { slug: 'barack-and-michelle-obama',               title: 'Barack & Michelle Obama' },
  'chris-pratt-vs-katherine-schwarzenegger':   { slug: 'chris-pratt-and-katherine-schwarzenegger', title: 'Chris Pratt & Katherine Schwarzenegger' },
  'adele-vs-rich-paul':                        { slug: 'adele-and-rich-paul',                     title: 'Adele & Rich Paul' },
  'cardi-b-vs-offset':                         { slug: 'cardi-b-and-offset',                      title: 'Cardi B & Offset' },
  'jennifer-lopez-vs-ben-affleck':             { slug: 'jennifer-lopez-and-ben-affleck',          title: 'Jennifer Lopez & Ben Affleck' },
  'brad-pitt-vs-angelina-jolie':               { slug: 'brad-pitt-and-angelina-jolie',            title: 'Brad Pitt & Angelina Jolie' },
  'brad-pitt-vs-jennifer-aniston':             { slug: 'jennifer-aniston-and-brad-pitt',          title: 'Jennifer Aniston & Brad Pitt' },
  'princess-diana-vs-prince-charles':          { slug: 'princess-diana-and-prince-charles',       title: 'Princess Diana & Prince Charles' },
  'marilyn-monroe-vs-joe-dimaggio':            { slug: 'marilyn-monroe-and-joe-dimaggio',         title: 'Marilyn Monroe & Joe DiMaggio' },
  'marilyn-monroe-vs-arthur-miller':           { slug: 'marilyn-monroe-and-arthur-miller',        title: 'Marilyn Monroe & Arthur Miller' },
  'elizabeth-taylor-vs-richard-burton':        { slug: 'elizabeth-taylor-and-richard-burton',     title: 'Elizabeth Taylor & Richard Burton' },
  'johnny-cash-vs-june-carter-cash':           { slug: 'johnny-cash-and-june-carter-cash',        title: 'Johnny Cash & June Carter Cash' },
  'paul-newman-vs-joanne-woodward':            { slug: 'paul-newman-and-joanne-woodward',         title: 'Paul Newman & Joanne Woodward' },
  'lucille-ball-vs-desi-arnaz':                { slug: 'lucille-ball-and-desi-arnaz',             title: 'Lucille Ball & Desi Arnaz' },
  'john-lennon-vs-yoko-ono':                   { slug: 'john-lennon-and-yoko-ono',                title: 'John Lennon & Yoko Ono' },
  'ryan-gosling-vs-eva-mendes':                { slug: 'ryan-gosling-and-eva-mendes',             title: 'Ryan Gosling & Eva Mendes' },
  'justin-timberlake-vs-jessica-biel':         { slug: 'justin-timberlake-and-jessica-biel',      title: 'Justin Timberlake & Jessica Biel' },
  'julia-roberts-vs-danny-moder':              { slug: 'julia-roberts-and-danny-moder',           title: 'Julia Roberts & Danny Moder' },
  'steph-curry-vs-ayesha-curry':               { slug: 'steph-and-ayesha-curry',                  title: 'Steph & Ayesha Curry' },
  'patrick-mahomes-vs-brittany-mahomes':       { slug: 'patrick-and-brittany-mahomes',            title: 'Patrick & Brittany Mahomes' },
  'lebron-james-vs-savannah-james':            { slug: 'lebron-and-savannah-james',               title: 'LeBron & Savannah James' },
  'dwyane-wade-vs-gabrielle-union':            { slug: 'dwyane-wade-and-gabrielle-union',         title: 'Dwyane Wade & Gabrielle Union' },
  'serena-williams-vs-alexis-ohanian':         { slug: 'serena-williams-and-alexis-ohanian',      title: 'Serena Williams & Alexis Ohanian' },
  'lionel-messi-vs-antonela-roccuzzo':         { slug: 'lionel-messi-and-antonela-roccuzzo',      title: 'Lionel Messi & Antonela Roccuzzo' },
  'cristiano-ronaldo-vs-georgina-rodriguez':   { slug: 'cristiano-ronaldo-and-georgina-rodriguez', title: 'Cristiano Ronaldo & Georgina Rodríguez' },
  'simone-biles-vs-jonathan-owens':            { slug: 'simone-biles-and-jonathan-owens',         title: 'Simone Biles & Jonathan Owens' },
  'benedict-cumberbatch-vs-sophie-hunter':     { slug: 'benedict-cumberbatch-and-sophie-hunter',  title: 'Benedict Cumberbatch & Sophie Hunter' },
  'chris-martin-vs-dakota-johnson':            { slug: 'chris-martin-and-dakota-johnson',         title: 'Chris Martin & Dakota Johnson' },
  'gwyneth-paltrow-vs-brad-falchuk':           { slug: 'gwyneth-paltrow-and-brad-falchuk',        title: 'Gwyneth Paltrow & Brad Falchuk' },
  'kanye-west-vs-bianca-censori':              { slug: 'kanye-west-and-bianca-censori',           title: 'Kanye West & Bianca Censori' },
  'ellen-degeners-vs-portia-de-rossi':         { slug: 'ellen-degeners-and-portia-de-rossi',      title: 'Ellen DeGeneres & Portia de Rossi' },
  'oprah-winfrey-vs-stedman-graham':           { slug: 'oprah-and-stedman-graham',                title: 'Oprah & Stedman Graham' },
  'king-charles-iii-vs-camilla-queen-consort': { slug: 'king-charles-and-camilla',                title: 'King Charles & Camilla' },
  'roger-federer-vs-mirka-federer':            { slug: 'roger-federer-and-mirka-federer',         title: 'Roger Federer & Mirka Federer' },
  'rafael-nadal-vs-xisca-perello':             { slug: 'rafael-nadal-and-xisca-perello',          title: 'Rafael Nadal & Xisca Perelló' },
  'sonny-bono-vs-cher':                        { slug: 'sonny-and-cher',                          title: 'Sonny & Cher' },
  'elvis-presley-vs-priscilla-presley':        { slug: 'elvis-and-priscilla-presley',             title: 'Elvis & Priscilla Presley' },
  'john-f-kennedy-vs-jackie-kennedy':          { slug: 'jfk-and-jackie-kennedy',                 title: 'JFK & Jackie Kennedy' },
  'paul-mccartney-vs-linda-mccartney':         { slug: 'paul-mccartney-and-linda-mccartney',      title: 'Paul McCartney & Linda McCartney' },
  'kurt-cobain-vs-courtney-love':              { slug: 'kurt-cobain-and-courtney-love',           title: 'Kurt Cobain & Courtney Love' },
  'martin-luther-king-jr-vs-coretta-scott-king': { slug: 'martin-luther-king-and-coretta-scott-king', title: 'MLK & Coretta Scott King' },
  'tom-hanks-vs-rita-wilson':                  { slug: 'tom-hanks-and-rita-wilson',               title: 'Tom Hanks & Rita Wilson' },
  'zoe-saldana-vs-marco-perego':               { slug: 'zoe-saldana-and-marco-perego',            title: 'Zoë Saldana & Marco Perego' },
  'chip-gaines-vs-joanna-gaines':              { slug: 'chip-and-joanna-gaines',                  title: 'Chip & Joanna Gaines' },
  'blake-shelton-vs-gwen-stefani':             { slug: 'blake-shelton-and-gwen-stefani',          title: 'Blake Shelton & Gwen Stefani' },
  'idris-elba-vs-sabrina-dhowre':              { slug: 'idris-elba-and-sabrina-dhowre',           title: 'Idris Elba & Sabrina Dhowre' },
  'kevin-hart-vs-eniko-hart':                  { slug: 'kevin-hart-and-eniko-hart',               title: 'Kevin Hart & Eniko Hart' },
  'tina-fey-vs-jeff-richmond':                 { slug: 'tina-fey-and-jeff-richmond',              title: 'Tina Fey & Jeff Richmond' },
  'sarah-jessica-parker-vs-matthew-broderick': { slug: 'sarah-jessica-parker-and-matthew-broderick', title: 'Sarah Jessica Parker & Matthew Broderick' },
  'will-smith-vs-jada-pinkett-smith':          { slug: 'will-smith-and-jada-pinkett-smith',       title: 'Will Smith & Jada Pinkett Smith' },
  'tom-brady-vs-gisele-bundchen':              { slug: 'tom-brady-and-gisele-bundchen',           title: 'Tom Brady & Gisele Bündchen' },
  'garth-brooks-vs-trisha-yearwood':           { slug: 'garth-brooks-and-trisha-yearwood',        title: 'Garth Brooks & Trisha Yearwood' },
  'bill-clinton-vs-hillary-clinton':           { slug: 'bill-clinton-and-hillary-clinton',        title: 'Bill Clinton & Hillary Clinton' },
  'ronald-reagan-vs-nancy-reagan':             { slug: 'ronald-reagan-and-nancy-reagan',          title: 'Ronald Reagan & Nancy Reagan' },
  'jimmy-carter-vs-rosalynn-carter':           { slug: 'jimmy-carter-and-rosalynn-carter',        title: 'Jimmy Carter & Rosalynn Carter' },
  'humphrey-bogart-vs-lauren-bacall':          { slug: 'humphrey-bogart-and-lauren-bacall',       title: 'Humphrey Bogart & Lauren Bacall' },
  'spencer-tracy-vs-katharine-hepburn':        { slug: 'spencer-tracy-and-katharine-hepburn',     title: 'Spencer Tracy & Katharine Hepburn' },
  'zendaya-vs-tom-holland':                    { slug: 'zendaya-and-tom-holland',                 title: 'Zendaya & Tom Holland' },
  'kendall-jenner-vs-jacob-elordi':            { slug: 'kendall-jenner-and-jacob-elordi',         title: 'Kendall Jenner & Jacob Elordi' },
  'kylie-jenner-vs-timothee-chalamet':         { slug: 'kylie-jenner-and-timothee-chalamet',      title: 'Kylie Jenner & Timothée Chalamet' },
  'megan-fox-vs-machine-gun-kelly':            { slug: 'megan-fox-and-machine-gun-kelly',         title: 'Megan Fox & MGK' },
  'harry-styles-vs-olivia-wilde':              { slug: 'harry-styles-and-olivia-wilde',           title: 'Harry Styles & Olivia Wilde' },
  'sabrina-carpenter-vs-barry-keoghan':        { slug: 'sabrina-carpenter-and-barry-keoghan',     title: 'Sabrina Carpenter & Barry Keoghan' },
  'miley-cyrus-vs-liam-hemsworth':             { slug: 'miley-cyrus-and-liam-hemsworth',          title: 'Miley Cyrus & Liam Hemsworth' },
  'ariana-grande-vs-pete-davidson':            { slug: 'ariana-grande-and-pete-davidson',         title: 'Ariana Grande & Pete Davidson' },
  'khloe-kardashian-vs-tristan-thompson':      { slug: 'khloe-kardashian-and-tristan-thompson',   title: 'Khloe Kardashian & Tristan Thompson' },
  'shawn-mendes-vs-camila-cabello':            { slug: 'shawn-mendes-and-camila-cabello',         title: 'Shawn Mendes & Camila Cabello' },
  'joe-jonas-vs-sophie-turner':                { slug: 'joe-jonas-and-sophie-turner',             title: 'Joe Jonas & Sophie Turner' },
  'gigi-hadid-vs-zayn-malik':                  { slug: 'gigi-hadid-and-zayn-malik',               title: 'Gigi Hadid & Zayn Malik' },
  'kim-kardashian-vs-lewis-hamilton':          { slug: 'kim-kardashian-and-lewis-hamilton',       title: 'Kim Kardashian & Lewis Hamilton' },
  'kim-kardashian-vs-kanye-west':              { slug: 'kim-kardashian-and-kanye-west',           title: 'Kim Kardashian & Kanye West' },
  'kim-kardashian-vs-pete-davidson':           { slug: 'kim-kardashian-and-pete-davidson',        title: 'Kim Kardashian & Pete Davidson' },
  'maya-hawke-vs-christian-lee-hutson':        { slug: 'maya-hawke-and-christian-lee-hutson',     title: 'Maya Hawke & Christian Lee Hutson' },
  'aja-wilson-vs-bam-adebayo':                 { slug: 'aja-wilson-and-bam-adebayo',              title: 'A\'ja Wilson & Bam Adebayo' },
  'kaia-gerber-vs-lewis-pullman':              { slug: 'kaia-gerber-and-lewis-pullman',           title: 'Kaia Gerber & Lewis Pullman' },
  'madeleine-petsch-vs-tyga':                  { slug: 'madeleine-petsch-and-tyga',               title: 'Madeleine Petsch & Tyga' },
  'venus-williams-vs-andrea-preti':            { slug: 'venus-williams-and-andrea-preti',         title: 'Venus Williams & Andrea Preti' },
}

const ELEMENT_MAP: Record<string, string> = {
  Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
  Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
  Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water',
}

function synastryBlurb(sunA: string | null, sunB: string | null, scoreLabel: string, scoreNum: number): string {
  const elA = sunA ? ELEMENT_MAP[sunA] ?? '' : ''
  const elB = sunB ? ELEMENT_MAP[sunB] ?? '' : ''
  const same = elA === elB
  const combo = same ? `${elA} + ${elA}` : `${elA} + ${elB}`
  const comboText: Record<string, string> = {
    'Fire + Fire': 'Two Fire signs share drive, spontaneity, and a mutual appetite for life — the risk is burning too bright, too fast. When they channel that energy in the same direction, few pairings are more alive.',
    'Earth + Earth': 'Two Earth signs build on solid ground. Both value loyalty, consistency, and the real over the romantic — which makes for one of astrology\'s most durable combinations when both people are committed.',
    'Air + Air': 'Two Air signs produce genuine intellectual rapport and social ease. The conversation never stops; both people understand each other\'s need for ideas and independence. The challenge is finding the emotional depth beneath all the thinking.',
    'Water + Water': 'Two Water signs offer each other a depth of emotional resonance that most combinations only approximate. The attunement is immediate; the risk is that two people who both feel everything can amplify each other\'s intensity.',
    'Fire + Earth': 'Fire and Earth are different speeds: Fire charges forward, Earth consolidates and holds. At their best, one ignites the vision while the other builds the foundation. At their most strained, one feels held back and the other feels destabilized.',
    'Earth + Fire': 'Fire and Earth are different speeds: Fire charges forward, Earth consolidates and holds. At their best, one ignites the vision while the other builds the foundation. At their most strained, one feels held back and the other feels destabilized.',
    'Fire + Air': 'Fire and Air are natural companions — Air feeds Fire, which grows brighter in return. These two signs tend to inspire each other, keep each other energized, and find the other genuinely fun to be around.',
    'Air + Fire': 'Fire and Air are natural companions — Air feeds Fire, which grows brighter in return. These two signs tend to inspire each other, keep each other energized, and find the other genuinely fun to be around.',
    'Fire + Water': 'Fire and Water are drawn to each other and can exhaust each other simultaneously. Fire wants to move and express; Water wants to feel and deepen. When this tension is productive, each person gets something they can\'t find alone.',
    'Water + Fire': 'Fire and Water are drawn to each other and can exhaust each other simultaneously. Fire wants to move and express; Water wants to feel and deepen. When this tension is productive, each person gets something they can\'t find alone.',
    'Earth + Air': 'Earth and Air process the world differently — Earth through what is tangible, Air through what is possible. The gap requires translation, but pairings that span this divide often produce something neither person could build alone.',
    'Air + Earth': 'Earth and Air process the world differently — Earth through what is tangible, Air through what is possible. The gap requires translation, but pairings that span this divide often produce something neither person could build alone.',
    'Earth + Water': 'Earth and Water are naturally supportive — Water needs Earth to give it shape; Earth needs Water to stay alive. This combination tends toward emotional depth and practical durability, one of astrology\'s more quietly solid pairings.',
    'Water + Earth': 'Earth and Water are naturally supportive — Water needs Earth to give it shape; Earth needs Water to stay alive. This combination tends toward emotional depth and practical durability, one of astrology\'s more quietly solid pairings.',
    'Air + Water': 'Air and Water speak different languages — one through ideas, the other through feeling. The gap is real, but it can produce a pairing where each person offers exactly what the other doesn\'t naturally have.',
    'Water + Air': 'Air and Water speak different languages — one through ideas, the other through feeling. The gap is real, but it can produce a pairing where each person offers exactly what the other doesn\'t naturally have.',
  }
  const scoreContext = scoreNum >= 75 ? 'This is a high-resonance pairing.' : scoreNum >= 55 ? 'This pairing has real strengths alongside its friction.' : 'This pairing requires more navigation than most.'
  return (comboText[combo] ?? '') + (comboText[combo] ? ` ${scoreContext}` : scoreContext)
}

function BigThree({ sun, moon, rising }: { sun: string | null; moon: string | null; rising: string | null }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {sun && (
        <span className="inline-flex items-center gap-1 text-sm bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1">
          <SignGlyph sign={sun} decorative />
          <span className="text-slate-500 dark:text-slate-400">{sun} Sun</span>
        </span>
      )}
      {moon && (
        <span className="inline-flex items-center gap-1 text-sm bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1">
          <SignGlyph sign={moon} decorative />
          <span className="text-slate-500 dark:text-slate-400">{moon} Moon</span>
        </span>
      )}
      {rising && (
        <span className="inline-flex items-center gap-1 text-sm bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1">
          <SignGlyph sign={rising} decorative />
          <span className="text-slate-500 dark:text-slate-400">{rising} Rising</span>
        </span>
      )}
    </div>
  )
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-emerald-500' : score >= 45 ? 'bg-amber-400' : 'bg-rose-500'
  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
      <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${score}%` }} />
    </div>
  )
}

export default function CelebCompare({ personA, personB, aspects, score, missingChart, loveSlug, loveTitle }: Props) {
  const title = `${personA.name} & ${personB.name} — Birth Chart Comparison`
  const description = `How do ${personA.name} and ${personB.name} compare astrologically? ${personA.name} is a ${personA.sun_sign} Sun with ${personA.rising_sign} Rising. ${personB.name} is a ${personB.sun_sign} Sun with ${personB.rising_sign} Rising. Compatibility score: ${score.label}.`
  const ogImage = `https://birthchartlibrary.com/api/og/compare?nameA=${encodeURIComponent(personA.name)}&sunA=${encodeURIComponent(personA.sun_sign || '')}&moonA=${encodeURIComponent(personA.moon_sign || '')}&risingA=${encodeURIComponent(personA.rising_sign || '')}&nameB=${encodeURIComponent(personB.name)}&sunB=${encodeURIComponent(personB.sun_sign || '')}&moonB=${encodeURIComponent(personB.moon_sign || '')}&risingB=${encodeURIComponent(personB.rising_sign || '')}&score=${encodeURIComponent(score.label)}&pct=${score.score}`
  const canonicalUrl = `https://birthchartlibrary.com/celebrity-birth-charts/compare/${personA.slug}-vs-${personB.slug}`

  const topAspects = aspects.slice(0, 8)

  return (
    <>
      <Head>
        <title>{`${title} | Birth Chart Library`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([
          { name: 'Celebrity Birth Charts', url: 'https://birthchartlibrary.com/celebrity-birth-charts' },
          { name: `${personA.name} vs ${personB.name}`, url: canonicalUrl },
        ])) }} />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-400 mb-8">
          <Link href="/celebrity-birth-charts" className="hover:text-slate-600 dark:hover:text-slate-300">Celebrity Charts</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-600 dark:text-slate-300">Chart Comparison</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-slate-800 dark:text-slate-100 mb-3">
            {personA.name} <span className="text-slate-300 dark:text-slate-600">&</span> {personB.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Birth chart compatibility analysis</p>
        </div>

        {/* Two-up celeb cards */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {[personA, personB].map(person => (
            <div key={person.slug} className="card flex flex-col items-center text-center">
              {person.image_url && (
                <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-slate-200 dark:ring-slate-700">
                  <Image src={person.image_url} alt={person.name} fill className="object-cover" sizes="80px" />
                </div>
              )}
              <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-base leading-tight">{person.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{person.birth_city}</p>
              <BigThree sun={person.sun_sign} moon={person.moon_sign} rising={person.rising_sign} />
              <Link href={`/celebrity-birth-charts/${person.slug}`} className="mt-4 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-2">
                Full chart →
              </Link>
            </div>
          ))}
        </div>

        {/* Element/score interpretation */}
        {!missingChart && (personA.sun_sign || personB.sun_sign) && (
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 text-base">
            {synastryBlurb(personA.sun_sign, personB.sun_sign, score.label, score.score)}
          </p>
        )}

        {/* Love article cross-link */}
        {loveSlug && loveTitle && !missingChart && (
          <Link
            href={`/love/${loveSlug}`}
            className="flex items-center justify-between gap-4 card mb-8 hover:border-slate-400 dark:hover:border-slate-500 transition-colors group"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">In-Depth Analysis</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{loveTitle}: Astrological Deep-Dive</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">History, compatibility context, and what their charts say about their dynamic →</p>
            </div>
            <span className="text-slate-400 flex-shrink-0 text-lg">→</span>
          </Link>
        )}

        {/* Missing chart notice */}
        {missingChart && (
          <div className="card mb-10 border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              We don&apos;t have a full birth chart for {missingChart} yet — synastry analysis isn&apos;t available. Check back soon, or{' '}
              <Link href="/celebrity-birth-charts" className="underline underline-offset-2">explore other celebrity charts</Link>.
            </p>
          </div>
        )}

        {/* Compatibility score */}
        {!missingChart && <div className="card mb-10">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Compatibility</h2>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{score.label} · {score.score}%</span>
          </div>
          <ScoreBar score={score.score} />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
            Based on {aspects.length} synastry aspects between personal planets — Sun through Saturn.
          </p>
        </div>}

        {/* Key aspects */}
        {topAspects.length > 0 && (
          <div className="card mb-10">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-5">Key Aspects</h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {topAspects.map((a, i) => {
                const p1 = PLANET_SYMBOLS[a.planet1] ?? a.planet1
                const p2 = PLANET_SYMBOLS[a.planet2] ?? a.planet2
                const sym = ASPECT_SYMBOLS[a.aspectType]
                const harmonic = a.isHarmonic
                return (
                  <div key={i} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {personA.name.split(' ')[0]}'s {p1} {sym} {personB.name.split(' ')[0]}'s {p2}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${harmonic ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                        {a.aspectType} · {a.orb}°
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{a.interpretation}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Bottom CTAs */}
        <div className="flex flex-wrap gap-3 justify-center text-sm">
          <Link href={`/celebrity-birth-charts/${personA.slug}`} className="btn-outline">
            {personA.name}&apos;s Full Chart
          </Link>
          <Link href={`/celebrity-birth-charts/${personB.slug}`} className="btn-outline">
            {personB.name}&apos;s Full Chart
          </Link>
          <Link href="/calculators/synastry" className="btn-outline">
            Compare Your Chart
          </Link>
        </div>
        <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-6">
          Curious what your own chart looks like?{' '}
          <Link href="/birth-chart?ref=compare" className="underline underline-offset-2 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Get yours free &rarr;
          </Link>
        </p>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Pre-generate featured celebrity couples
  const csvPath = path.join(process.cwd(), 'data', 'celebrity-couples.csv')
  const lines = readFileSync(csvPath, 'utf8').trim().split('\n').slice(1)

  const slugify = (name: string) =>
    name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const paths: string[] = []
  for (const line of lines) {
    const [name1, , name2] = line.split(',')
    if (name1 && name2) paths.push(`${slugify(name1.trim())}-vs-${slugify(name2.trim())}`)
  }

  return {
    paths: paths.map(pair => ({ params: { pair } })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const pair = params?.pair as string
  const vsIndex = pair.lastIndexOf('-vs-')
  if (vsIndex === -1) return { notFound: true }

  const slug1 = pair.slice(0, vsIndex)
  const slug2 = pair.slice(vsIndex + 4)

  const [rows1, rows2] = await Promise.all([
    query<CelebData & { chart_data: unknown; bio_source: string | null }>(
      `SELECT name, slug, image_url, bio, sun_sign, moon_sign, rising_sign,
              to_char(birth_date, 'YYYY-MM-DD') AS birth_date, birth_city, category, chart_data, bio_source
       FROM celebrities WHERE slug = $1 LIMIT 1`,
      [slug1]
    ),
    query<CelebData & { chart_data: unknown; bio_source: string | null }>(
      `SELECT name, slug, image_url, bio, sun_sign, moon_sign, rising_sign,
              to_char(birth_date, 'YYYY-MM-DD') AS birth_date, birth_city, category, chart_data, bio_source
       FROM celebrities WHERE slug = $1 LIMIT 1`,
      [slug2]
    ),
  ])

  const rawA = rows1[0]
  const rawB = rows2[0]
  if (!rawA || !rawB) return { notFound: true }
  // Both people need a public page (docs/TEMPLATE-CELEB-REMOVAL-PLAN.md); a compare
  // page of template-bio celebrities is the same thin content we removed.
  if (!isServedCelebrity(rawA) || !isServedCelebrity(rawB)) return { notFound: true, revalidate: 86400 }

  const chartA = (typeof rawA.chart_data === 'string' ? JSON.parse(rawA.chart_data) : rawA.chart_data) as BirthChartData | null
  const chartB = (typeof rawB.chart_data === 'string' ? JSON.parse(rawB.chart_data) : rawB.chart_data) as BirthChartData | null

  const clean = (r: typeof rawA): CelebData => ({
    name: r.name, slug: r.slug, image_url: r.image_url, bio: r.bio,
    sun_sign: r.sun_sign, moon_sign: r.moon_sign, rising_sign: r.rising_sign,
    birth_date: r.birth_date, birth_city: r.birth_city, category: r.category,
  })

  if (!chartA || !chartB) {
    const missing = !chartA ? rawA.name : rawB.name
    return {
      props: { personA: clean(rawA), personB: clean(rawB), aspects: [], score: { label: 'Unknown', score: 0 }, missingChart: missing },
      revalidate: 86400,
    }
  }

  const aspects = computeSynastryAspects(chartA, chartB, 'romantic')
  const score   = synastryScore(aspects)

  const article = COUPLE_ARTICLES[pair]

  return {
    props: {
      personA: clean(rawA), personB: clean(rawB), aspects, score,
      ...(article ? { loveSlug: article.slug, loveTitle: article.title } : {}),
    },
    revalidate: 604800,
  }
}
