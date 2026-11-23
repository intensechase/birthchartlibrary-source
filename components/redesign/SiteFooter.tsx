import Link from 'next/link'

// Footer for the redesign, grouped by the three pillars plus the site's own pages.
const COLS: { title: string; links: [string, string][] }[] = [
  { title: 'Library', links: [['/celebrity-birth-charts', 'Celebrity charts'], ['/born-today', 'Born today'], ['/celebrity-match', 'Celebrity twins'], ['/love/celebrity-couples', 'Famous couples']] },
  { title: 'Learn', links: [['/start', 'Start here'], ['/zodiac-signs', 'Signs'], ['/astrology-planets', 'Planets'], ['/astrology-houses', 'Houses'], ['/astrology-aspects', 'Aspects'], ['/compatibility', 'Sign compatibility'], ['/chinese-zodiac', 'Chinese zodiac'], ['/glossary', 'Glossary'], ['/blog', 'Articles']] },
  { title: 'You', links: [['/birth-chart', 'My chart'], ['/calculators/synastry', 'Compare two charts'], ['/daily-horoscope', 'Your horoscope'], ['/calculators', 'Calculators'], ['/account', 'Your account']] },
  { title: 'About', links: [['/about', 'About the library'], ['/method', 'How charts are made'], ['/photo-credits', 'Photo credits'], ['/contact', 'Contact'], ['/privacy', 'Privacy'], ['/terms', 'Terms']] },
]

export default function SiteFooter() {
  return (
    <footer className="rdp rdp-foot">
      <div className="in">
        {COLS.map(c => (
          <div key={c.title}>
            <h2>{c.title}</h2>
            <ul>{c.links.map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
          </div>
        ))}
        <p className="fine">Birth Chart Library. Charts from the Swiss Ephemeris; birth data from public records and published sources. Readings are for entertainment, not medical, legal or financial advice. <a className="tlink" href="https://github.com/intensechase/birthchartlibrary-source" target="_blank" rel="noopener noreferrer">Source code</a> under AGPL-3.0.</p>
      </div>
    </footer>
  )
}
