import { useEffect, useState } from 'react'
import { REDESIGN_ANY } from '@/lib/redesign'

// Contents strip for long learn pages (sign, planet): one row of short section
// names that sticks to the top of the screen while the reader scrolls, and
// marks the section they're in. Sections are passed in, not read from the
// page, so the strip is in the HTML from the first paint.
// narrowOnly: the section sits in a side column on wide screens, already in view,
// so its chip shows only once the columns stack (CSS .sstrip .narrow).
export type Section = { id: string; label: string; narrowOnly?: boolean }

export default function SectionStrip({ sections, label }: { sections: Section[]; label: string }) {
  const [current, setCurrent] = useState<string | null>(null)
  const ids = sections.map(s => s.id).join(' ')

  useEffect(() => {
    const els = ids.split(' ').map(id => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    if (!els.length) return
    let frame = 0
    const pick = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        // The lowest heading that has passed the top third of the screen; hidden
        // chips (side column on wide screens) never count.
        let id: string | null = null, best = -Infinity
        for (const el of els) {
          const top = el.getBoundingClientRect().top
          const chip = document.querySelector<HTMLElement>(`.sstrip a[href="#${el.id}"]`)
          if (top < innerHeight / 3 && top > best && chip?.offsetParent) { best = top; id = el.id }
        }
        setCurrent(id)
      })
    }
    addEventListener('scroll', pick, { passive: true })
    pick()
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', pick) }
  }, [ids])

  // Keep the marked chip in view inside the strip as the reader moves down the page.
  useEffect(() => {
    if (!current) return
    const chip = document.querySelector<HTMLElement>(`.sstrip a[href="#${current}"]`)
    const row = chip?.parentElement
    if (!chip || !row) return
    const out = chip.offsetLeft < row.scrollLeft || chip.offsetLeft + chip.offsetWidth > row.scrollLeft + row.clientWidth
    if (out) row.scrollLeft = chip.offsetLeft - 16
  }, [current])

  if (!REDESIGN_ANY || sections.length < 3) return null
  return (
    <nav className="sstrip" aria-label={label}>
      <div className="row">
        {sections.map(s => (
          <a key={s.id} href={`#${s.id}`} className={s.narrowOnly ? 'narrow' : undefined} aria-current={current === s.id ? 'location' : undefined}>{s.label}</a>
        ))}
      </div>
    </nav>
  )
}
