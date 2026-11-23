// Where an ad may appear: after the answer, never inside a card, never above the
// Big Three (build list). BCL runs AdSense auto ads with no slot ids, so on the
// live site this is an empty spacer that auto ads can use; on the preview it is
// a labelled outline so the owner can see the placement.
const PREVIEW = (process.env.NEXT_PUBLIC_APP_URL ?? '').includes('preview.')

export default function AdSlot({ label = 'Ad', off, tall }: { label?: string; off?: boolean; tall?: boolean }) {
  if (off) return null
  if (PREVIEW) return <div className={`ad mark${tall ? ' tall' : ''}`} aria-hidden="true">{label}</div>
  return null
}
