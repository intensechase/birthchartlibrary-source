import Link from 'next/link'
import type { PhotoCredit as Credit } from '@/lib/photo-credit'

// Short attribution line under a celebrity photo: "Photo: Author · CC BY-SA 4.0".
// Author links to the Commons file page, license to its deed. Without stored
// credit data it falls back to the generic label, linked to /photo-credits.
export default function PhotoCredit({ credit, className }: { credit: Credit | null; className?: string }) {
  if (!credit) {
    return (
      <p className={className}>
        <Link href="/photo-credits" className="hover:underline">Wikimedia Commons</Link>
      </p>
    )
  }
  const author = credit.author || 'Wikimedia Commons'
  return (
    <p className={className}>
      Photo:{' '}
      {credit.filePage
        ? <a href={credit.filePage} target="_blank" rel="noopener noreferrer" className="hover:underline">{author}</a>
        : author}
      {credit.license && (
        <>
          {' · '}
          {credit.licenseUrl
            ? <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer license" className="hover:underline">{credit.license}</a>
            : credit.license}
        </>
      )}
    </p>
  )
}
