import Head from 'next/head'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import Image from 'next/image'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getElementColor } from '@/lib/zodiac-colors'
import { SIGN_LIST_LOWER as SIGNS } from '@/lib/constants'
import { getListableCelebrities } from '@/lib/celebrities'
import { SignGlyph } from '@/components/Glyph'

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

interface Celebrity {
  name: string
  slug: string
  category: string | null
  image_url: string | null
  moon_sign: string | null
  rising_sign: string | null
}

interface CategorySection {
  key: string
  label: string
  icon: string
  celebrities: Celebrity[]
}

interface Props {
  sign: string
  signName: string
  sections: CategorySection[]
  otherNotable: Celebrity[]
  totalShown: number
  otherSigns: { slug: string; name: string }[]
}

// Category buckets — match how celebrities.category is stored. Order here
// determines section ordering on the page.
const CATEGORY_BUCKETS = [
  { key: 'Actor', label: 'Actors', icon: '🎬' },
  { key: 'Musician', label: 'Musicians', icon: '🎵' },
  { key: 'Athlete', label: 'Athletes', icon: '🏆' },
  { key: 'Entertainer', label: 'Entertainers', icon: '🎤' },
  { key: 'Public Figure', label: 'Public Figures', icon: '🌍' },
  { key: 'Creator', label: 'Creators', icon: '📱' },
  { key: 'Politician', label: 'Politicians', icon: '🏛️' },
  { key: 'Writer', label: 'Writers', icon: '✍️' },
  { key: 'Scientist', label: 'Scientists', icon: '🔬' },
  { key: 'Business', label: 'Business', icon: '💼' },
  { key: 'Model', label: 'Models', icon: '📸' },
  { key: 'Artist', label: 'Artists', icon: '🎨' },
]

// Lowered from 3 → 2 after first deploy showed that ~25 Tier-A celebs per
// sign spread across 12 categories almost never produces 3+ per bucket, so
// all sections were filtered out and only the "More Notable" tail rendered.
// With 2, most signs surface 4-8 themed sections.
const MIN_PER_SECTION = 2
const MAX_PER_SECTION = 6

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
})

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const sign = params?.sign as string
  const signName = capitalize(sign)

  // Quality-bio only (see lib/celebrities.ts) — this used to backfill with
  // template-bio celebrities once a sign ran out of quality ones, which
  // meant every sign page linked to noindexed pages (confirmed live: sun
  // sign has only ~25-37 quality bios on average, well under the old
  // LIMIT 80). Sort by bio_extended length as a fame proxy.
  const rows = await getListableCelebrities<Celebrity>({
    columns: 'name, slug, category, image_url, moon_sign, rising_sign',
    where: 'sun_sign = $1',
    params: [signName],
    orderBy: "LENGTH(COALESCE(bio_extended, '')) DESC, name ASC",
    limit: 80,
  })

  // Bucket each celeb into its first matching primary category. Rows whose
  // category doesn't map to any bucket (or is NULL) go into "otherNotable".
  const bucketed: Record<string, Celebrity[]> = {}
  const ungrouped: Celebrity[] = []
  for (const c of rows) {
    if (!c.category) { ungrouped.push(c); continue }
    const cat = c.category.toLowerCase()
    const bucket = CATEGORY_BUCKETS.find(b => cat.includes(b.key.toLowerCase()))
    if (!bucket) { ungrouped.push(c); continue }
    if (!bucketed[bucket.key]) bucketed[bucket.key] = []
    if (bucketed[bucket.key].length < MAX_PER_SECTION) bucketed[bucket.key].push(c)
  }

  // Only render sections with at least MIN_PER_SECTION celebs — avoids the
  // awkward "Politicians: 1 person" look.
  const sections: CategorySection[] = CATEGORY_BUCKETS
    .filter(b => (bucketed[b.key]?.length ?? 0) >= MIN_PER_SECTION)
    .map(b => ({ key: b.key, label: b.label, icon: b.icon, celebrities: bucketed[b.key] }))

  // Anything bucketed-but-below-threshold OR ungrouped becomes the
  // "More notable" tail row, capped at 12.
  const surfaced = new Set(sections.flatMap(s => s.celebrities.map(c => c.slug)))
  const otherNotable: Celebrity[] = []
  for (const c of rows) {
    if (otherNotable.length >= 12) break
    if (!surfaced.has(c.slug)) otherNotable.push(c)
  }

  const totalShown = sections.reduce((sum, s) => sum + s.celebrities.length, 0) + otherNotable.length

  const otherSigns = SIGNS.filter(s => s !== sign).map(s => ({
    slug: s,
    name: capitalize(s),
  }))

  return {
    props: { sign, signName, sections, otherNotable, totalShown, otherSigns },
    revalidate: 86400,
  }
}

function CelebCard({ celeb, signName, ec }: { celeb: Celebrity; signName: string; ec: { bg: string } }) {
  return (
    <Link
      href={`/celebrity-birth-charts/${celeb.slug}`}
      className="card flex flex-col items-center text-center p-4 hover:border-slate-400 transition-colors group"
    >
      {celeb.image_url ? (
        <Image
          src={`/api/img/${celeb.slug}`}
          alt={celeb.name}
          width={64}
          height={64}
          className="w-16 h-16 rounded-full object-cover border border-slate-200 mb-2"
        />
      ) : (
        <div className={`w-16 h-16 rounded-full ${ec.bg} flex items-center justify-center text-xl mb-2`}><SignGlyph sign={signName} decorative /></div>
      )}
      <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors truncate w-full">{celeb.name}</p>
      {celeb.category && (
        <p className="text-xs text-slate-400 truncate w-full">{celeb.category}</p>
      )}
    </Link>
  )
}

export default function SignFilterPage({ sign, signName, sections, otherNotable, totalShown, otherSigns }: Props) {
  const ec = getElementColor(signName)

  return (
    <>
      <Head>
        <title>{`${signName} Celebrity Birth Charts | Birth Chart Library`}</title>
        <meta name="description" content={`Explore notable ${signName} celebrities across acting, music, athletics, and more. Sun in ${signName} — see their full natal charts and planetary placements.`} />
        <link rel="canonical" key="canonical" href={`https://birthchartlibrary.com/celebrity-birth-charts/sign/${sign}`} />
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <AdminBreadcrumb crumbs={[
          { label: 'Celebrity Charts', href: '/celebrity-birth-charts' },
          { label: `${signName} Sun` },
        ]} />

        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl tracking-wide mb-2">
            <SignGlyph sign={signName} decorative className="mr-2 text-slate-900 dark:text-white" />Famous {signName} Birth Charts
          </h1>
          <p className="text-slate-500">{totalShown} notable {signName} celebrities, grouped by field.</p>
          <Link href={`/zodiac-signs/${sign}`} className="text-sm text-slate-400 hover:text-slate-600 transition-colors mt-1 inline-block">
            Learn about {signName} &rarr;
          </Link>
        </div>

        {/* Category sections */}
        {sections.map(section => (
          <section key={section.key} className="mb-10">
            <h2 className="font-display text-xl tracking-wide mb-4">
              <span className="mr-2">{section.icon}</span>
              {signName} {section.label}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {section.celebrities.map(c => <CelebCard key={c.slug} celeb={c} signName={signName} ec={ec} />)}
            </div>
          </section>
        ))}

        {/* Anything that didn't fit a category section, but still notable */}
        {otherNotable.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-xl tracking-wide mb-4">More Notable {signName}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {otherNotable.map(c => <CelebCard key={c.slug} celeb={c} signName={signName} ec={ec} />)}
            </div>
          </section>
        )}

        {/* Browse-all footer */}
        <div className="mb-12 text-center">
          <Link
            href={`/celebrity-birth-charts?sun=${signName}&tier=all`}
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            Browse all {signName} charts &rarr;
          </Link>
        </div>

        {/* Other signs */}
        <section className="border-t border-slate-200 pt-8">
          <h2 className="text-lg font-bold mb-4">Browse by Sun Sign</h2>
          <div className="flex flex-wrap gap-2">
            {otherSigns.map(s => (
              <Link
                key={s.slug}
                href={`/celebrity-birth-charts/sign/${s.slug}`}
                className="text-sm px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800 transition-colors"
              >
                <SignGlyph sign={s.name} decorative /> {s.name}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
