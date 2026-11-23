import { KEEP_MS, KEPT_KEY, KEPT_UNTIL_KEY, PENDING_KEY, clearWaiting, holdInTab, keepOwn, purgeKept, readKept, readTab, removeKept, waitingChart, type HeldChart } from '@/lib/kept-chart'
import { safeNext } from '@/lib/safe-next'
import { settledSign } from '@/lib/settled-sign'

class Store {
  m = new Map<string, string>()
  full = false
  getItem(k: string) { return this.m.get(k) ?? null }
  setItem(k: string, v: string) { if (this.full && v.length > 50) throw new Error('quota'); this.m.set(k, v) }
  removeItem(k: string) { this.m.delete(k) }
}
const g = globalThis as unknown as { localStorage: Store; sessionStorage: Store }
const held = (isForSelf: boolean): HeldChart => ({
  isForSelf, teaser: null,
  form: { label: '', subjectName: isForSelf ? '' : 'Sam', birthDate: '1990-07-04', birthTime: '08:15', birthCity: 'Denver', birthLat: 39.7, birthLng: -105 },
  chart: { view: { cards: {}, bigThree: [] } as never, birthDate: '1990-07-04', birthTime: '08:15', birthCity: 'Denver', subjectName: isForSelf ? null : 'Sam' },
})
const NOW = Date.UTC(2026, 10, 23)

beforeEach(() => { g.localStorage = new Store(); g.sessionStorage = new Store(); jest.useFakeTimers().setSystemTime(NOW) })
afterAll(() => { jest.useRealTimers() })

describe('a guest’s own chart', () => {
  it('is kept exactly 7 days from when it was made', () => {
    expect(keepOwn(held(true), NOW)).toBe(NOW + KEEP_MS)
    expect(readKept(NOW + KEEP_MS - 1)?.until).toBe(NOW + KEEP_MS)
  })
  it('is not extended by coming back', () => {
    keepOwn(held(true), NOW)
    readKept(NOW + KEEP_MS / 2)
    expect(readKept(NOW + KEEP_MS)).toBeNull()
  })
  it('is really deleted when the time is up', () => {
    keepOwn(held(true), NOW)
    purgeKept(NOW + KEEP_MS)
    expect(g.localStorage.m.size).toBe(0)
  })
  it('is deleted when its date is missing, unreadable or too far ahead', () => {
    for (const bad of [null, 'soon', String(NOW + KEEP_MS * 2)]) {
      keepOwn(held(true), NOW)
      if (bad === null) g.localStorage.removeItem(KEPT_UNTIL_KEY); else g.localStorage.setItem(KEPT_UNTIL_KEY, bad)
      purgeKept(NOW)
      expect(g.localStorage.m.size).toBe(0)
    }
  })
  it('leaves nothing behind when the browser has no room', () => {
    g.localStorage.full = true
    expect(keepOwn(held(true), NOW)).toBeNull()
    expect(g.localStorage.m.size).toBe(0)
  })
  it('drops a damaged or older copy instead of showing it', () => {
    keepOwn(held(true), NOW)
    g.localStorage.setItem(KEPT_KEY, '{"v":0}')
    expect(readKept(NOW)).toBeNull()
    expect(g.localStorage.m.size).toBe(0)
  })
  it('goes away with Remove', () => { keepOwn(held(true), NOW); removeKept(); expect(g.localStorage.m.size).toBe(0) })
})

describe('saving after sign in', () => {
  it('uses the chart Save was pressed on before the kept one', () => {
    keepOwn(held(true), NOW)
    g.sessionStorage.setItem(PENDING_KEY, JSON.stringify({ ...held(false).form, isForSelf: false }))
    expect(waitingChart()).toMatchObject({ isForSelf: false, subjectName: 'Sam' })
  })
  it('falls back to the kept chart, never to a friend’s tab chart', () => {
    holdInTab(held(false))
    expect(waitingChart()).toBeNull()
    keepOwn(held(true), NOW)
    expect(waitingChart()).toMatchObject({ isForSelf: true, birthDate: '1990-07-04' })
  })
  it('takes the saved chart off the device and leaves the other', () => {
    keepOwn(held(true), NOW); holdInTab(held(false))
    clearWaiting({ isForSelf: false })
    expect(readTab()).toBeNull()
    expect(readKept(NOW)).not.toBeNull()
    clearWaiting({ isForSelf: true })
    expect(readKept(NOW)).toBeNull()
  })
})

describe('safeNext', () => {
  it('allows paths on this site only', () => {
    expect(safeNext('/calculators/synastry?saving=1')).toBe('/calculators/synastry?saving=1')
    for (const bad of ['//evil.com', '/\\evil.com', '/\t/evil.com', 'https://evil.com', 'javascript:alert(1)', '', undefined, ['/a']]) expect(safeNext(bad)).toBeNull()
  })
})

describe('settledSign', () => {
  const moon = (signDegree: number) => ({ planet: 'MOON', sign: 'Leo', signDegree })
  it('always names the sign with a birth time', () => expect(settledSign(moon(29.9), true)).toBe('Leo'))
  it('leaves out a Moon near an edge without one', () => {
    expect(settledSign(moon(3), false)).toBeNull()
    expect(settledSign(moon(15), false)).toBe('Leo')
  })
})
