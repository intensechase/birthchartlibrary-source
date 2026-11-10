const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// "1956-07-09" -> "July 9, 1956". Anything else is returned unchanged.
export function formatBirthDate(date: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date)
  if (!m) return date
  const month = MONTHS[Number(m[2]) - 1]
  if (!month) return date
  return `${month} ${Number(m[3])}, ${Number(m[1])}`
}

// "11:17:00" -> "11:17 a.m.", "00:05" -> "12:05 a.m.". Anything else is returned unchanged.
export function formatBirthTime(time: string): string {
  const m = /^(\d{1,2}):(\d{2})/.exec(time)
  if (!m) return time
  const h = Number(m[1])
  if (h > 23) return time
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${m[2]} ${h < 12 ? 'a.m.' : 'p.m.'}`
}
