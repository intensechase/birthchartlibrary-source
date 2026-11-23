// People lists for the rebuilt learn pages: the same rows, order and card data
// as Born today (lib/redesign/home-view.ts), so every list of people on the site
// looks and sorts the same. Server only (dynamic import from getStaticProps).
import { getListableCelebrities } from '@/lib/celebrities'
import { CELEBRITY_RANK } from '@/lib/celebrity-rank'
import type { HomePerson } from './home-view'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const RANK = new Map(CELEBRITY_RANK.map((s, i) => [s, i]))
const rankOf = (slug: string) => RANK.get(slug) ?? 1e6

interface Row { name: string; slug: string; birth_date: string; birth_time: string | null; sun_sign: string | null; moon_sign: string | null; rising_sign: string | null }

// Public (written) pages matching `where`, best known first.
export async function peopleWhere(where: string, params: unknown[], limit = 12): Promise<HomePerson[]> {
  const rows = await getListableCelebrities<Row>({
    columns: 'name, slug, birth_date::text, birth_time, sun_sign, moon_sign, rising_sign',
    where, params, orderBy: 'name', requireImage: false,
  })
  return rows
    .sort((a, b) => rankOf(a.slug) - rankOf(b.slug) || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map(r => {
      const [y, m, d] = r.birth_date.split('-').map(Number)
      return { name: r.name, slug: r.slug, date: `${MONTHS[m - 1]} ${d}, ${y}`, sun: r.sun_sign ?? '', moon: r.moon_sign ?? '', rising: r.birth_time ? r.rising_sign : null }
    })
}
