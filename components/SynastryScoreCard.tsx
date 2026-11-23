import { POINT_NAME, type Contact, type SynastryScoreV2 } from '@/lib/swisseph/synastry-score'

// One score block for every synastry screen (calculator, saved reading, celebrity
// compare): the tier, the two percentiles, the contacts behind them, and the
// entertainment note. Both numbers are percentiles against real pairs of charts.

const TIER_COLOR: Record<string, string> = {
  S: 'text-emerald-600 dark:text-emerald-400',
  A: 'text-emerald-500 dark:text-emerald-300',
  B: 'text-sky-600 dark:text-sky-400',
  C: 'text-amber-600 dark:text-amber-400',
  D: 'text-rose-500 dark:text-rose-400',
}

function says(c: Contact, a: string, b: string) {
  return `${a}'s ${POINT_NAME[c.a] ?? c.a} ${c.aspect} ${b}'s ${POINT_NAME[c.b] ?? c.b}`
}

// A pair can meet both ways (A's Venus trine B's Mars, A's Mars trine B's
// Venus): say it once, then keep the next distinct contact. At most `max` lines.
export function lines(cs: Contact[], a: string, b: string, max: number): string[] {
  const out: string[] = []
  const used = new Set<number>()
  cs.forEach((c, i) => {
    if (used.has(i) || out.length >= max) return
    const j = cs.findIndex((d, k) => k > i && !used.has(k) && d.aspect === c.aspect && d.a === c.b && d.b === c.a && c.a !== c.b)
    if (j >= 0) {
      used.add(j)
      out.push(`${POINT_NAME[c.a] ?? c.a} and ${POINT_NAME[c.b] ?? c.b} in ${c.aspect}, both ways`)
    } else out.push(says(c, a, b))
  })
  return out
}

export default function SynastryScoreCard({ score, nameA, nameB }: { score: SynastryScoreV2; nameA: string; nameB: string }) {
  if (score.version !== 2) return null
  return (
    <div className="text-left">
      <div className="flex items-end gap-3">
        <p className={`font-display text-6xl leading-none ${TIER_COLOR[score.tier]}`}>{score.tier}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 pb-1">tier, from S (rare) to D</p>
      </div>
      <dl className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Ease</dt>
          <dd className="text-2xl font-semibold text-slate-800 dark:text-slate-100 tabular-nums">{score.ease}</dd>
          <dd className="text-xs text-slate-500 dark:text-slate-400">Smoother than {score.ease}% of pairs</dd>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Spark</dt>
          <dd className="text-2xl font-semibold text-slate-800 dark:text-slate-100 tabular-nums">{score.spark}</dd>
          <dd className="text-xs text-slate-500 dark:text-slate-400">More contact than {score.spark}% of pairs</dd>
        </div>
      </dl>
      {score.helps.length > 0 && (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Helped most by</p>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-0.5">
            {lines(score.helps, nameA, nameB, 3).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}
      {score.strains.length > 0 && (
        <div className="mt-3">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Strained most by</p>
          <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-0.5">
            {lines(score.strains, nameA, nameB, 2).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}
      <p className="text-xs text-slate-400 mt-4">
        For entertainment. A score can&apos;t tell you whether a relationship will work, so please don&apos;t make big decisions from it.
      </p>
    </div>
  )
}
