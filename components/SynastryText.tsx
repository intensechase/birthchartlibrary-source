// One synastry aspect's text. Full entries (lib/swisseph/synastry-text.ts) are
// "hook\n\nparagraph\n\nparagraph": the hook renders a step stronger. Older
// one line texts have no blank line and render as a single paragraph.
export default function SynastryText({ text, className = '' }: { text: string; className?: string }) {
  const blocks = text.split('\n\n')
  if (blocks.length === 1) return <p className={`text-sm leading-relaxed ${className}`}>{text}</p>
  const [hook, ...paras] = blocks
  return (
    <div className={`text-sm leading-relaxed space-y-2 ${className}`}>
      <p className="font-medium text-slate-700 dark:text-slate-200">{hook}</p>
      {paras.map((p, i) => <p key={i}>{p}</p>)}
    </div>
  )
}
