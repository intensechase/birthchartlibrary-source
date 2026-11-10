import Redis from 'ioredis'
import * as Sentry from '@sentry/nextjs'

// --- Redis client (singleton, only constructed if REDIS_URL is set) ---
let redis: Redis | null = null

function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null
  if (redis) return redis
  try {
    // enableOfflineQueue:false (previously set, alongside lazyConnect:true)
    // rejects any command issued before the socket is fully connected
    // instead of queueing it — and the very first INCR always arrives
    // before that, since connecting is inherently async even without
    // lazyConnect. Every cold client failed its first command with "Stream
    // isn't writeable" and silently fell back to memory, forever, on every
    // deploy. Offline queueing (the default) lets that first command wait
    // for the connection instead of failing outright; maxRetriesPerRequest
    // + connectTimeout still bound how long a genuinely-down Redis takes to
    // fail rather than hanging.
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
    })
    redis.on('error', () => { /* suppress — fallback to memory */ })
    return redis
  } catch {
    return null
  }
}

// --- In-memory fallback ---
// Per-instance bucket — not safe across replicas. In multi-instance deploys
// the effective limit is N × maxRequests. Acceptable when Redis is available;
// see fallbackAlert() for visibility when Redis is missing.
const memoryLimits = new Map<string, { count: number; resetAt: number }>()
const PRUNE_INTERVAL = 1000 // prune at most once per 1000 calls
let callsSincePrune = 0

function pruneExpired(now: number) {
  for (const [key, entry] of memoryLimits) {
    if (entry.resetAt < now) memoryLimits.delete(key)
  }
}

function rateLimitMemory(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  if (++callsSincePrune >= PRUNE_INTERVAL) {
    pruneExpired(now)
    callsSincePrune = 0
  }
  const entry = memoryLimits.get(key)
  if (!entry || entry.resetAt < now) {
    memoryLimits.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= maxRequests) return false
  entry.count++
  return true
}

// --- Redis sliding window via INCR + EXPIRE ---
async function rateLimitRedis(client: Redis, key: string, maxRequests: number, windowMs: number): Promise<boolean> {
  const redisKey = `rl:${key}`
  const windowSecs = Math.ceil(windowMs / 1000)
  const count = await client.incr(redisKey)
  if (count === 1) await client.expire(redisKey, windowSecs)
  return count <= maxRequests
}

// Warn once when we fall back to memory in production, so missing/broken
// Redis surfaces in Sentry instead of silently weakening rate limits.
let fallbackAlerted = false
function fallbackAlert(reason: 'missing' | 'error') {
  if (fallbackAlerted) return
  if (process.env.NODE_ENV !== 'production') return
  fallbackAlerted = true
  Sentry.captureMessage(
    `rate-limit: falling back to in-memory bucket (${reason}). Distributed rate limits are not enforced.`,
    'warning'
  )
}

export async function rateLimit(key: string, maxRequests: number, windowMs: number): Promise<boolean> {
  const client = getRedis()
  if (client) {
    try {
      return await rateLimitRedis(client, key, maxRequests, windowMs)
    } catch {
      fallbackAlert('error')
    }
  } else if (process.env.REDIS_URL === undefined) {
    fallbackAlert('missing')
  }
  return rateLimitMemory(key, maxRequests, windowMs)
}
