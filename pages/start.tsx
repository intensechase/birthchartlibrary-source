import Head from 'next/head'
import Link from 'next/link'
import Icon from '@/components/Icon'
import { Disc } from '@/components/redesign/Disc'
import { LearnHero, NextLinks } from '@/components/redesign/Learn'
import { DISC, ELEMENT_OF, signIcon } from '@/lib/redesign/astro'
import type { VDisc } from '@/lib/redesign/celeb-view'

// Learn's front door (owner, 11/19): the start of the beginner path. Your sign,
// your chart, the four parts, then a real person's chart.
const SIGNS: [name: string, dates: string][] = [
  ['Aries', 'Mar 21 to Apr 19'], ['Taurus', 'Apr 20 to May 20'], ['Gemini', 'May 21 to Jun 20'], ['Cancer', 'Jun 21 to Jul 22'],
  ['Leo', 'Jul 23 to Aug 22'], ['Virgo', 'Aug 23 to Sep 22'], ['Libra', 'Sep 23 to Oct 22'], ['Scorpio', 'Oct 23 to Nov 21'],
  ['Sagittarius', 'Nov 22 to Dec 21'], ['Capricorn', 'Dec 22 to Jan 19'], ['Aquarius', 'Jan 20 to Feb 18'], ['Pisces', 'Feb 19 to Mar 20'],
]

const PARTS: { href: string; title: string; sub: string; disc: VDisc }[] = [
  { href: '/astrology-planets', title: 'Planets', sub: 'What is acting: the Sun, the Moon and the rest', disc: { color: DISC.SUN, icon: 'sun' } },
  { href: '/zodiac-signs', title: 'Signs', sub: 'How it acts: the twelve styles', disc: { color: DISC.VENUS, icon: 'taurus' } },
  { href: '/astrology-houses', title: 'Houses', sub: 'Where in life it shows up', disc: { color: DISC.MOON, text: '10' } },
  { href: '/astrology-aspects', title: 'Aspects', sub: 'How two planets get along', disc: { color: DISC.NEPTUNE, icon: 'trine' } },
]

export default function StartPage() {
  return (
    <>
      <Head>
        <title>Learn Astrology: Start Here | Birth Chart Library</title>
        <meta name="description" content="New to astrology? Find your sign, make your birth chart free, learn the four parts of a chart, then read a real person’s chart." />
        <link rel="canonical" key="canonical" href="https://birthchartlibrary.com/start" />
      </Head>
      <main className="rdp"><div className="lrn steps">
        <LearnHero kicker="Start here" title="Learn to read a birth chart">
          <p>A birth chart is the sky at one moment, seen from one place. Four steps and you can read one.</p>
        </LearnHero>

        <section className="lsec">
          <p className="stepn">Step 1</p>
          <h2>Find your sign</h2>
          <p>The sign you already know is your Sun sign. Pick yours.</p>
          <div className="signgrid">
            {SIGNS.map(([s, dates]) => (
              <Link key={s} className="signtile" href={`/zodiac-signs/${s.toLowerCase()}`}>
                <span className={`el-${ELEMENT_OF[s]}`}><Icon name={signIcon(s)} size={22} /></span>
                <span>{s}<small>{dates}</small></span>
              </Link>
            ))}
          </div>
          <p className="disclose">The day the Sun changes sign moves a little from year to year. Born on an edge? Your chart settles it.</p>
        </section>

        <section className="lsec">
          <p className="stepn">Step 2</p>
          <h2>Make your chart</h2>
          <p>Your Sun is one of three signs to know first. The Moon is how you feel, and the rising sign is how you come across. Enter your birth date, time and place to see all three, and everything after them.</p>
          <div className="btnrow">
            <Link className="btn" href="/birth-chart?ref=start">Make your chart</Link>
            <span className="disclose">Free. No account needed.</span>
          </div>
        </section>

        <section className="lsec doors">
          <p className="stepn">Step 3</p>
          <h2>Learn the four parts</h2>
          <p>Every line in a chart is one planet, in one sign, in one house. Aspects say how two planets meet.</p>
          <div className="dgrid">
            {PARTS.map(d => (
              <Link key={d.href} href={d.href} className="door">
                <Disc disc={d.disc} size={44} iconSize={24} />
                <span><b>{d.title}</b><small>{d.sub}</small></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="lsec">
          <p className="stepn">Step 4</p>
          <h2>Read a real person’s chart</h2>
          <p>Pick someone you know well. It is easier to see what a placement means when you already know the person.</p>
          <div className="btnrow">
            <Link className="btn" href="/celebrity-birth-charts">Browse the library</Link>
            <Link className="tlink" href="/celebrity-match">Find your celebrity twins</Link>
          </div>
        </section>

        <NextLinks title="Keep going" links={[
          { href: '/blog/what-is-a-birth-chart', title: 'What is a birth chart?', sub: 'The longer answer' },
          { href: '/compatibility', title: 'Sign compatibility', sub: 'How two signs get along' },
          { href: '/chinese-zodiac', title: 'Chinese zodiac', sub: 'Your animal and element' },
          { href: '/glossary', title: 'Glossary', sub: 'Every term in plain words' },
          { href: '/reading-room', title: 'The reading room', sub: 'Astrology books worth owning' },
          { href: '/method', title: 'How charts are made', sub: 'Where the numbers come from' },
        ]} />
      </div></main>
    </>
  )
}
