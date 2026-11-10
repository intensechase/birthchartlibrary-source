import Link from 'next/link'
import Scallop from '@/components/Scallop'

const linkClass = 'text-sm text-[#D5DBEC] hover:text-white hover:underline'
const headingClass = 'text-sm font-black text-[#F2E6C8] mb-3'

export default function Footer() {
  return (
    <footer className="mt-auto">
      <Scallop id="footer-scallops" top="var(--background)" className="bg-[#14203F] dark:bg-[#0E1730]" />
      <div className="py-10 px-4 bg-[#14203F] dark:bg-[#0E1730]">
      {/* Reading Room callout */}
      <div className="max-w-5xl mx-auto mb-8 pb-8 border-b border-[#34467C]">
        <Link href="/reading-room" className="flex items-center justify-center gap-2 group">
          <span className="text-sm text-[#D5DBEC]">Explore our curated astrology book collection</span>
          <span className="text-sm font-bold text-[#F4BE3C] group-hover:underline">The Reading Room &rarr;</span>
        </Link>
      </div>

      {/* 3-column nav */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-8 mb-8">
        <div>
          <p className={headingClass}>Explore</p>
          <nav className="flex flex-col gap-2.5">
            <Link href="/horoscope" className={linkClass}>Horoscope</Link>
            <Link href="/celebrity-birth-charts" className={linkClass}>Celebrity Charts</Link>
            <Link href="/love" className={linkClass}>Love &amp; Astrology</Link>
            <Link href="/compatibility" className={linkClass}>Compatibility</Link>
            <Link href="/calculators" className={linkClass}>Calculators</Link>
            <Link href="/born-today" className={linkClass}>Born Today</Link>
          </nav>
        </div>
        <div>
          <p className={headingClass}>Learn</p>
          <nav className="flex flex-col gap-2.5">
            <Link href="/zodiac-signs" className={linkClass}>Zodiac Signs</Link>
            <Link href="/astrology-planets" className={linkClass}>Planets</Link>
            <Link href="/astrology-interpretations" className={linkClass}>Interpretation Library</Link>
            <Link href="/glossary" className={linkClass}>Glossary</Link>
            <Link href="/chinese-zodiac" className={linkClass}>Chinese Zodiac</Link>
            <Link href="/start" className={linkClass}>New Here? Start &rarr;</Link>
          </nav>
        </div>
        <div>
          <p className={headingClass}>Read</p>
          <nav className="flex flex-col gap-2.5">
            <Link href="/blog" className={linkClass}>Blog</Link>
            <Link href="/reading-room" className={linkClass}>Reading Room</Link>
            <a href="https://www.reddit.com/r/CelebBirthCharts/" target="_blank" rel="noopener noreferrer" className={linkClass}>Reddit</a>
            <Link href="/about" className={linkClass}>About</Link>
            <Link href="/method" className={linkClass}>How We Check Charts</Link>
            <Link href="/contact" className={linkClass}>Contact</Link>
            <Link href="/embed" className={linkClass}>For Publishers</Link>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-5xl mx-auto pt-6 border-t border-[#34467C] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#B4BEDA]">
        <p>&copy; {new Date().getFullYear()} Birth Chart Library. Open source under AGPL-3.0. As an Amazon Associate we earn from qualifying purchases.</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link href="/privacy" className="hover:text-white hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:text-white hover:underline">Terms</Link>
          <Link href="/photo-credits" className="hover:text-white hover:underline">Photo credits</Link>
          <Link href="/search" className="hover:text-white hover:underline">Search</Link>
        </div>
      </div>
      </div>
    </footer>
  )
}
