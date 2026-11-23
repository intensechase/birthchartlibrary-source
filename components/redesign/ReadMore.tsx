import { useState } from 'react'

// Shows at least one full paragraph (about 70 words) and folds the rest behind
// Read more. The folded text is still in the HTML (build list SEO guardrail).
function split(text: string): [string[], string[]] {
  const paras = text.replace(/\r\n/g, '\n').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  const first: string[] = []
  let words = 0, i = 0
  while (i < paras.length && (i === 0 || words < 70)) { words += paras[i].split(/\s+/).length; first.push(paras[i]); i++ }
  let rest = paras.slice(i)
  // One long opening paragraph: break it at a sentence near 70 words.
  if (first.length === 1 && words > 130) {
    const s = first[0].split(/(?<=[.!?])\s+(?=[A-Z])/)
    let w = 0, k = 0
    while (k < s.length && w < 70) { w += s[k].split(/\s+/).length; k++ }
    if (k < s.length) { first[0] = s.slice(0, k).join(' '); rest = [s.slice(k).join(' '), ...rest] }
  }
  return [first, rest]
}

export default function ReadMore({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const [first, rest] = split(text)
  return (
    <>
      <div className="ex">
        {first.map((p, i) => <p key={i}>{p}</p>)}
        {rest.length ? <div className="ex" hidden={!open}>{rest.map((p, i) => <p key={i}>{p}</p>)}</div> : null}
      </div>
      {rest.length ? <button className="rm" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Show less' : 'Read more'}</button> : null}
    </>
  )
}
