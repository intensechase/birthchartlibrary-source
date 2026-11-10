import Head from 'next/head'
import Link from 'next/link'
import AdminBreadcrumb from '@/components/AdminBreadcrumb'
import Image from 'next/image'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getElementColor } from '@/lib/zodiac-colors'
import { getListableCelebrities } from '@/lib/celebrities'
import { SignGlyph } from '@/components/Glyph'

const CATEGORIES = [
  { slug: 'actor', label: 'Actors', icon: '🎬' },
  { slug: 'musician', label: 'Musicians', icon: '🎵' },
  { slug: 'athlete', label: 'Athletes', icon: '🏆' },
  { slug: 'entertainer', label: 'Entertainers', icon: '🎤' },
  { slug: 'public-figure', label: 'Public Figures', icon: '🌍' },
  { slug: 'creator', label: 'Creators', icon: '📱' },
  { slug: 'politician', label: 'Politicians', icon: '🏛️' },
  { slug: 'writer', label: 'Writers', icon: '✍️' },
  { slug: 'scientist', label: 'Scientists', icon: '🔬' },
  { slug: 'business', label: 'Business', icon: '💼' },
  { slug: 'model', label: 'Models', icon: '📸' },
  { slug: 'artist', label: 'Artists', icon: '🎨' },
]

function slugToDbCategory(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

interface Celebrity {
  name: string
  slug: string
  sun_sign: string | null
  image_url: string | null
  category: string | null
}

interface Props {
  categorySlug: string
  categoryLabel: string
  categoryIcon: string
  celebrities: Celebrity[]
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
})

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const categorySlug = params?.category as string
  const catInfo = CATEGORIES.find(c => c.slug === categorySlug)
  if (!catInfo) return { notFound: true }

  const dbCategory = slugToDbCategory(categorySlug)

  // Match celebrities whose category contains this category (handles dual/triple categories).
  // Quality-bio only (see lib/celebrities.ts) — this used to backfill with
  // template-bio celebrities to pad out to 36, which meant categories with
  // few quality bios (Writer: 3, Scientist: 2) linked mostly to noindexed
  // pages. Categories with fewer than 36 quality bios now just show fewer
  // results rather than backfilling with noindexed links. LIMIT 36 still
  // keeps the page payload bounded for well-stocked categories (Actor,
  // Musician, Athlete all clear 36 quality bios on their own).
  const celebrities = await getListableCelebrities<Celebrity>({
    columns: 'name, slug, sun_sign, image_url, category',
    where: 'category ILIKE $1',
    params: [`%${dbCategory}%`],
    orderBy: "LENGTH(COALESCE(bio_extended, '')) DESC, name ASC",
    limit: 36,
  })

  return {
    props: {
      categorySlug,
      categoryLabel: catInfo.label,
      categoryIcon: catInfo.icon,
      celebrities,
    },
    revalidate: 86400,
  }
}

export default function CategoryFilterPage({ categorySlug, categoryLabel, categoryIcon, celebrities }: Props) {
  // Group by sun sign for a nice breakdown
  const signGroups: Record<string, Celebrity[]> = {}
  for (const c of celebrities) {
    const sign = c.sun_sign || 'Unknown'
    if (!signGroups[sign]) signGroups[sign] = []
    signGroups[sign].push(c)
  }
  const signOrder = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

  return (
    <>
      <Head>
        <title>{`Famous ${categoryLabel} Birth Charts | Birth Chart Library`}</title>
        <meta name="description" content={`Explore birth charts of ${celebrities.length} famous ${categoryLabel.toLowerCase()}. See their sun signs, full natal charts, and planetary placements.`} />
        <link rel="canonical" key="canonical" href={`https://birthchartlibrary.com/celebrity-birth-charts/category/${categorySlug}`} />
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <AdminBreadcrumb crumbs={[
          { label: 'Celebrity Charts', href: '/celebrity-birth-charts' },
          { label: categoryLabel },
        ]} />

        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl tracking-wide mb-2">
            <span className="mr-2">{categoryIcon}</span>Famous {categoryLabel} Birth Charts
          </h1>
          <p className="text-slate-500">{celebrities.length} {categoryLabel.toLowerCase()} with birth charts in our library.</p>
        </div>

        {/* Sign breakdown nav */}
        <div className="flex flex-wrap gap-2 mb-8">
          {signOrder.filter(s => signGroups[s]?.length).map(sign => {
            const ec = getElementColor(sign)
            return (
              <a key={sign} href={`#${sign.toLowerCase()}`} className={`text-xs px-2.5 py-1 rounded-full ${ec.bg} ${ec.text}`}>
                <SignGlyph sign={sign} decorative /> {sign} ({signGroups[sign].length})
              </a>
            )
          })}
        </div>

        {/* Grouped by sign */}
        {signOrder.filter(s => signGroups[s]?.length).map(sign => {
          const ec = getElementColor(sign)
          return (
            <section key={sign} id={sign.toLowerCase()} className="mb-10">
              <h2 className="text-lg font-bold mb-3">
                <SignGlyph sign={sign} decorative className="mr-1" />{sign} {categoryLabel}
                <span className="text-sm font-normal text-slate-400 ml-2">({signGroups[sign].length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {signGroups[sign].map(c => (
                  <Link
                    key={c.slug}
                    href={`/celebrity-birth-charts/${c.slug}`}
                    className="card flex items-center gap-3 p-3 hover:border-slate-400 transition-colors group"
                  >
                    {c.image_url ? (
                      <Image
                        src={`/api/img/${c.slug}`}
                        alt={c.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-full ${ec.bg} flex items-center justify-center text-sm shrink-0`}><SignGlyph sign={sign} decorative /></div>
                    )}
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors truncate">{c.name}</span>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {/* Other categories */}
        <section className="border-t border-slate-200 pt-8">
          <h2 className="text-lg font-bold mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.filter(c => c.slug !== categorySlug).map(c => (
              <Link
                key={c.slug}
                href={`/celebrity-birth-charts/category/${c.slug}`}
                className="text-sm px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800 transition-colors"
              >
                {c.icon} {c.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
