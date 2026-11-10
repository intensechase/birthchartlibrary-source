// The wheel's scalloped edge, used where one colored band meets another.
// `top` fills the space between the circles (the band above); the element's
// own background shows below them. Each use needs its own pattern id.
const RING = ['#E8591D', '#3F9D4F', '#F2B632', '#2B8FD0']

export default function Scallop({ id, top, className }: { id: string; top: string; className: string }) {
  return (
    <svg aria-hidden="true" className={`block w-full h-6 ${className}`}>
      <defs>
        <pattern id={id} width="112" height="24" patternUnits="userSpaceOnUse">
          <rect width="112" height="24" fill={top} />
          {RING.map((color, i) => (
            <circle key={color} cx={14 + i * 28} cy="4" r="14" strokeWidth="3" fill={color} stroke="var(--outline)" />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="24" fill={`url(#${id})`} />
    </svg>
  )
}
