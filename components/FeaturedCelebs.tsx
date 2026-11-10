import Link from 'next/link'
import Image from 'next/image'
import type { FeaturedCeleb } from '@/lib/celebrities'
import { SignGlyph } from '@/components/Glyph'
import { toneOf } from '@/components/NatalChartWheel'

export const cleanCelebName = (name: string) => name.replace(/\s*\([^)]*\)/g, '').trim()

// A round face in a ring of the Sun sign's wheel tone, outlined like the wheel.
export const faceRingStyle = (sign: string | null) => ({
  boxShadow: `0 0 0 3px var(--w-${sign ? toneOf(sign) : 'tone-3'}), 0 0 0 5.5px var(--outline)`,
})

export function CelebFace({ slug, sign, hasImage, size }: { slug: string; sign: string | null; hasImage: boolean; size: number }) {
  const box = { width: size, height: size, ...faceRingStyle(sign) }
  return hasImage ? (
    <Image src={`/api/img/${slug}`} alt="" width={size} height={size} className="rounded-full object-cover object-top shrink-0" style={box} />
  ) : (
    <span className="rounded-full bg-[var(--surface)] inline-flex items-center justify-center text-2xl shrink-0" style={box} aria-hidden="true">
      {sign && <SignGlyph sign={sign} decorative />}
    </span>
  )
}

// Plain links rendered on the server. The library's main grid (CelebrityFilters)
// loads in the browser, so without this the raw HTML of the home and library pages
// carries only one or two celebrity links.
export default function FeaturedCelebs({ celebs }: { celebs: FeaturedCeleb[] }) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-x-5 gap-y-7">
      {celebs.map(c => (
        <li key={c.slug} className="min-w-0">
          <Link href={`/celebrity-birth-charts/${c.slug}`} className="flex items-center gap-[18px] pl-[7px] text-slate-800 dark:text-slate-100 group">
            <CelebFace slug={c.slug} sign={c.sun_sign} hasImage={!!c.image_url} size={68} />
            <span className="min-w-0 leading-snug">
              <span className="block font-black text-[17px] group-hover:underline">{cleanCelebName(c.name)}</span>
              {c.sun_sign && <span className="block text-sm text-slate-500 dark:text-slate-400">{c.sun_sign} Sun</span>}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
