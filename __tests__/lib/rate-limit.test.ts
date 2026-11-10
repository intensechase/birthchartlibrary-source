// Tests run against the in-memory fallback (no REDIS_URL set in test env)

// Clear module cache so each test gets a fresh memoryLimits Map
beforeEach(() => {
  jest.resetModules()
  delete process.env.REDIS_URL
})

async function getRateLimit() {
  const mod = await import('@/lib/rate-limit')
  return mod.rateLimit
}

describe('rateLimit (in-memory fallback)', () => {
  it('allows requests up to the limit', async () => {
    const rateLimit = await getRateLimit()
    const key = `test:${Date.now()}`
    expect(await rateLimit(key, 3, 60000)).toBe(true)
    expect(await rateLimit(key, 3, 60000)).toBe(true)
    expect(await rateLimit(key, 3, 60000)).toBe(true)
  })

  it('blocks the request that exceeds the limit', async () => {
    const rateLimit = await getRateLimit()
    const key = `test:${Date.now()}`
    await rateLimit(key, 2, 60000)
    await rateLimit(key, 2, 60000)
    expect(await rateLimit(key, 2, 60000)).toBe(false)
  })

  it('resets after the window expires', async () => {
    jest.useFakeTimers()
    const rateLimit = await getRateLimit()
    const key = `test:${Date.now()}`

    await rateLimit(key, 1, 1000)
    expect(await rateLimit(key, 1, 1000)).toBe(false)

    jest.advanceTimersByTime(1001)
    expect(await rateLimit(key, 1, 1000)).toBe(true)
    jest.useRealTimers()
  })

  it('tracks different keys independently', async () => {
    const rateLimit = await getRateLimit()
    const ts = Date.now()
    await rateLimit(`key-a:${ts}`, 1, 60000)
    expect(await rateLimit(`key-a:${ts}`, 1, 60000)).toBe(false)
    expect(await rateLimit(`key-b:${ts}`, 1, 60000)).toBe(true)
  })
})
