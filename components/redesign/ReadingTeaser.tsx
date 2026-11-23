import { useEffect, useRef } from 'react'
import type { ReadingTeaser as Teaser } from '@/lib/reading/teaser'
import { Disc } from './Disc'
import { track } from '@/lib/track'

// The opening of the full reading, under a chart made without an account (owner,
// 11/23): At a glance and the first thing that stands out. The rest is not in
// the page at all; the server never sends it.
const parasOf = (t: string) => t.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)

function Short({ short, watch }: { short?: string[]; watch?: string }) {
  return (
    <>
      {short?.length ? <div className="short"><b>In short</b>{short.map(s => <span key={s}>{s}</span>)}</div> : null}
      {watch ? <p className="watch"><b>Watch for</b> {watch}</p> : null}
    </>
  )
}

export default function ReadingTeaser({ t, subject, onSave, saveText }: { t: Teaser; subject: string | null; onSave: () => void; saveText: string }) {
  const box = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = box.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { track('reading_teaser_seen'); io.disconnect() } }, { rootMargin: '0px 0px -20% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const rest = [
    t.more.feats ? `${t.more.feats} more ${t.more.feats === 1 ? 'thing' : 'things'} that ${t.more.feats === 1 ? 'stands' : 'stand'} out` : null,
    'every planet',
    t.more.houses ? 'all twelve houses' : null,
    'the patterns they make',
  ].filter((x): x is string => !!x)
  return (
    <section className="rdg teaser" id="reading" ref={box}>
      <h2>{subject ? 'The full reading starts here' : 'Your full reading starts here'}</h2>
      {subject ? <p className="lede">Every entry is written as if speaking to {subject}, so read “you” as {subject}.</p> : null}
      <h3 className="sub">At a glance</h3>
      <ul className="big">
        {t.big.map(b => (
          <li key={b.key}>
            <Disc disc={b.disc} size={40} iconSize={22} />
            <div><b>{b.label}</b><small>{b.sub}</small>{b.hook ? <p>{b.hook}</p> : b.either?.length ? b.either.map(e => <p key={e.sign}>If {e.sign}: {e.hook}</p>) : null}</div>
          </li>
        ))}
      </ul>
      {t.pair ? (
        <div className="pairx">
          <h3>{t.pair.title}</h3>
          <p>{t.pair.entry.hook}</p>
          {parasOf(t.pair.entry.text).map((p, i) => <p key={i}>{p}</p>)}
          <Short short={t.pair.entry.short} watch={t.pair.entry.watch} />
        </div>
      ) : null}
      {t.first?.entry ? (
        <>
          <h3 className="sub">What stands out</h3>
          <div className="pairx">
            <h3>{t.first.title}</h3>
            <p>{t.first.entry.hook}</p>
            {parasOf(t.first.entry.text).map((p, i) => <p key={i}>{p}</p>)}
            <Short short={t.first.entry.short} watch={t.first.entry.watch} />
          </div>
        </>
      ) : null}
      <div className="mbar">
        <div><b>The rest comes with a free account</b><span>{`${rest.slice(0, -1).join(', ')} and ${rest[rest.length - 1]}`.replace(/^./, c => c.toUpperCase())}, in plain words.</span></div>
        <button type="button" className="btn" onClick={onSave}>{saveText}</button>
      </div>
    </section>
  )
}
