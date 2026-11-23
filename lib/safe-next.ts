// A same-site path from a ?next= or ?redirectTo= value, or null. "//host" and
// "/\\host" are other sites to a browser, so both are refused.
export function safeNext(v: unknown): string | null {
  return typeof v === 'string' && /^\/(?![\/\\])/.test(v) && !/[\t\r\n]/.test(v) ? v : null
}
