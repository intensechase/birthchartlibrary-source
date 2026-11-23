// The privacy page says the site is not for children under 13, so a "For me"
// chart with a birth date under 13 stops here. Charts for someone else (a
// parent making one for a child) are fine.
export const MIN_AGE = 13
export const UNDER_AGE_MESSAGE = 'This site is for people 13 and older. Making a chart for a child? Choose For someone else.'

/** True when the date (YYYY-MM-DD) is less than 13 years before today, by the calendar. Unreadable dates: false. */
export function isUnderAge(birthDate: string, today: Date = new Date()): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(birthDate)
  if (!m) return false
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  let age = today.getFullYear() - y
  const mon = today.getMonth() + 1
  if (mon < mo || (mon === mo && today.getDate() < d)) age--
  return age < MIN_AGE
}
