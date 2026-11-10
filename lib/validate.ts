const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidId(id: unknown): id is string {
  return typeof id === 'string' && UUID_RE.test(id)
}

export function validateCoordinates(lat: unknown, lng: unknown): string | null {
  if (typeof lat !== 'number' || typeof lng !== 'number') return 'Invalid coordinates'
  if (isNaN(lat) || isNaN(lng)) return 'Invalid coordinates'
  if (lat < -90 || lat > 90) return 'Invalid coordinates'
  if (lng < -180 || lng > 180) return 'Invalid coordinates'
  return null
}
