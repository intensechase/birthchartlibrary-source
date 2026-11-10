import { Pool, types } from 'pg'

// Return dates as ISO strings instead of Date objects
types.setTypeParser(1082, (val: string) => val) // date
types.setTypeParser(1083, (val: string) => val) // time
types.setTypeParser(1114, (val: string) => val) // timestamp
types.setTypeParser(1184, (val: string) => val) // timestamptz

import { env } from './env'

const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

if (typeof process !== 'undefined') {
  process.once('SIGTERM', () => pool.end())
  process.once('SIGINT', () => pool.end())
}

export async function query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(text, params)
  return result.rows as T[]
}

export async function queryOne<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T | null> {
  const result = await pool.query(text, params)
  return (result.rows[0] as T) ?? null
}

export async function queryCount(text: string, params?: unknown[]): Promise<number> {
  const result = await pool.query(text, params)
  return parseInt(result.rows[0]?.count ?? '0', 10)
}

export async function withTransaction<T>(fn: (client: import('pg').PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

// Safely cast a jsonb column (comes back as unknown from pg) to a typed value.
// Use at DB query boundaries so call sites never need `as unknown as T`.
export function parseJsonb<T>(value: unknown): T {
  return value as T
}

export default pool
