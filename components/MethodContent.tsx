import Link from 'next/link'
import type { ChartCoverage } from '@/lib/celebrities'
import { RATING_MEANINGS } from '@/lib/birth-time-source'

const headingClass = 'font-display text-2xl tracking-wide text-slate-800 dark:text-slate-100 mb-3'
const linkClass = 'underline hover:text-slate-800 dark:hover:text-slate-100 transition-colors'

function CoverageRow({ label, detail, count, total, fill }: { label: string; detail: string; count: number; total: number; fill: string }) {
  const share = total ? (count / total) * 100 : 0
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
        <span className="font-medium text-slate-800 dark:text-slate-100">{label}</span>
        <span className="tabular-nums text-slate-500 dark:text-slate-400">{count}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden="true">
        <div className={`h-2 rounded-full ${fill}`} style={{ width: `${share}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
    </div>
  )
}

export default function MethodContent({ coverage }: { coverage: ChartCoverage }) {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-3">How We Check Our Charts</h1>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-10">
        A birth chart is only as good as the birth time behind it, and a lot of what gets repeated online has no traceable
        source. This page shows where our data comes from, how much of it has been checked, and what we&apos;ve had to fix.
      </p>

      <section className="mb-12" aria-labelledby="coverage">
        <h2 id="coverage" className={headingClass}>Our featured charts, today</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
          These counts cover the {coverage.total} celebrity charts we feature and come straight from our database.
        </p>
        <div className="space-y-4">
          <CoverageRow label="Rated AA" detail={`Astro-Databank: ${RATING_MEANINGS.AA}.`} count={coverage.AA} total={coverage.total} fill="bg-emerald-600 dark:bg-emerald-500" />
          <CoverageRow label="Rated A" detail={`Astro-Databank: ${RATING_MEANINGS.A}.`} count={coverage.A} total={coverage.total} fill="bg-emerald-500 dark:bg-emerald-400" />
          <CoverageRow label="Rated B" detail={`Astro-Databank: ${RATING_MEANINGS.B}.`} count={coverage.B} total={coverage.total} fill="bg-emerald-400 dark:bg-emerald-300" />
          <CoverageRow label="Birth time, not yet verified" detail="We show a time but haven't recorded its source. These pages say so, and we're working through them." count={coverage.unverified} total={coverage.total} fill="bg-amber-500 dark:bg-amber-400" />
          <CoverageRow label="No birth time" detail="Rising sign and houses are noon estimates and are labeled that way. The Moon can also change signs during the day, so it may be off too." count={coverage.noTime} total={coverage.total} fill="bg-slate-400 dark:bg-slate-500" />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-5">
          <Link href="/celebrity-birth-charts/rated-birth-times" className={linkClass}>Browse the charts with a rated birth time</Link>
        </p>
      </section>

      <div className="space-y-10 text-slate-600 dark:text-slate-300 leading-relaxed">
        <section>
          <h2 className={headingClass}>Where birth data comes from</h2>
          <p>
            Most of our rated birth data comes from{' '}
            <a href="https://www.astro.com/astro-databank/Main_Page" target="_blank" rel="noopener noreferrer" className={linkClass}>Astro-Databank</a>,
            a public archive that rates each birth time by its source using the Rodden rating system. When we import from it,
            we only take AA, A and B times. Its own guidance says those are the ratings suitable for study, and rated pages here
            link to their entry so you can check it yourself. When a time looks wrong, we cross-check it against Astrotheme.
          </p>
          <p className="mt-3">
            Not everything has been through that process, which is why the counts above include times we haven&apos;t verified.
            We used to publish tens of thousands more celebrity pages that had a chart but only templated text. In November 2026
            we took those down. A person comes back only once they have a researched bio.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>How a chart is calculated</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="font-medium text-slate-800 dark:text-slate-100">Positions:</strong> Swiss Ephemeris software, using its
              built-in Moshier ephemeris. Its authors state a precision better than 0.1 arcseconds for planets and about 3 arcseconds for the Moon.
            </li>
            <li><strong className="font-medium text-slate-800 dark:text-slate-100">Zodiac:</strong> tropical.</li>
            <li>
              <strong className="font-medium text-slate-800 dark:text-slate-100">Houses:</strong> Placidus. It can&apos;t be calculated at very
              high latitudes, so those charts use Whole Sign houses.
            </li>
            <li><strong className="font-medium text-slate-800 dark:text-slate-100">Points:</strong> true North Node and mean Black Moon Lilith.</li>
            <li>
              <strong className="font-medium text-slate-800 dark:text-slate-100">Time zones:</strong> looked up from the birthplace. Older
              records can be tricky, because a modern time zone database may not match what a town actually observed that year. We&apos;ve
              corrected charts for this, as listed below.
            </li>
          </ul>
        </section>

        <section>
          <h2 className={headingClass}>How bios are written</h2>
          <p>
            Featured bios start from each person&apos;s calculated chart and public biography, and follow a written style guide. Drafts go
            through automated checks and a fact-check before publishing, and the site&apos;s owner spot-checks them on the live site.
            Mistakes can still get through, so please{' '}
            <Link href="/contact" className={linkClass}>tell us</Link> if you find one.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>What astrology can and can&apos;t tell you</h2>
          <p>
            Astrology is a symbolic tradition, not a science, and a chart doesn&apos;t explain or predict what a person does. When we say a
            birth time is accurate, we mean its record is reliable. That says nothing about whether the interpretation is true, so we
            suggest treating our readings as a way to reflect, and never as advice for medical, legal or financial decisions.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Photos</h2>
          <p>
            Celebrity photos come from Wikimedia Commons. Each one is credited to its author with its license under the photo, and
            the <Link href="/photo-credits" className={linkClass}>photo credits page</Link> lists them all. We remove a photo if it
            is deleted from Commons.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Corrections</h2>
          <dl className="space-y-3">
            <div className="grid sm:grid-cols-[7.5rem_1fr] gap-x-4">
              <dt className="text-sm tabular-nums text-slate-500 dark:text-slate-400">Oct 15, 2026</dt>
              <dd>1,236 charts had been drawn for noon instead of the stored birth time. All were recalculated.</dd>
            </div>
            <div className="grid sm:grid-cols-[7.5rem_1fr] gap-x-4">
              <dt className="text-sm tabular-nums text-slate-500 dark:text-slate-400">Oct 16, 2026</dt>
              <dd>
                Time zones for US summer births before 1967 were audited. Charts including Bill Clinton, George Clooney and Malcolm X
                were recalculated after a modern time zone rule had been applied to them by mistake.
              </dd>
            </div>
            <div className="grid sm:grid-cols-[7.5rem_1fr] gap-x-4">
              <dt className="text-sm tabular-nums text-slate-500 dark:text-slate-400">Nov 6, 2026</dt>
              <dd>Every chart page with a birth time began showing where that time came from, or saying that it isn&apos;t verified yet.</dd>
            </div>
            <div className="grid sm:grid-cols-[7.5rem_1fr] gap-x-4">
              <dt className="text-sm tabular-nums text-slate-500 dark:text-slate-400">Nov 10, 2026</dt>
              <dd>
                About 53,000 celebrity pages that had only templated text were taken down. Photos now credit their author and license,
                and five photos that had been deleted from Wikimedia Commons were removed.
              </dd>
            </div>
          </dl>
          <p className="mt-4">
            Found something wrong? <Link href="/contact" className={linkClass}>Send us a correction</Link>. It helps to include a source.
          </p>
        </section>
      </div>
    </main>
  )
}
