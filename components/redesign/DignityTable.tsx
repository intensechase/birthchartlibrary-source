// The four traditional dignities for a planet, with the one that applies outlined.
export default function DignityTable({ cells }: { cells: { label: string; value: string; on: boolean }[] }) {
  return (
    <div className="dig">
      {cells.map(c => (
        <div key={c.label} className={c.on ? 'on' : undefined}>
          <small>{c.label}{c.on ? ' (this one)' : ''}</small>
          {c.value}
        </div>
      ))}
    </div>
  )
}
