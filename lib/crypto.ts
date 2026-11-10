import crypto from 'crypto'

// App-level encryption for sensitive birth chart PII columns. Used by
// lib/db.ts read paths and the chart-creation API. See migration
// 0013_birth_charts_encrypted_columns.sql for the rollout strategy.
//
// Algorithm: AES-256-GCM (authenticated encryption — detects tampering).
// Key:       32 random bytes, base64-encoded in PII_ENCRYPTION_KEY env var.
// Format:    "v1:{base64(nonce|tag|ciphertext)}"
//            v1 = key version prefix, lets us add v2 later for rotation
//            nonce = 12 bytes (96 bits, GCM standard)
//            tag   = 16 bytes (128 bits, authentication tag)
//
// The key never leaves the app process — it does NOT ride along with
// Postgres queries the way pgcrypto would. A DB-only compromise (leaked
// backup, query log, replica) sees ciphertext only.

const KEY_VERSION = 'v1'
const ALGO = 'aes-256-gcm'
const NONCE_BYTES = 12
const TAG_BYTES = 16

let cachedKey: Buffer | null = null

function getKey(): Buffer {
  if (cachedKey) return cachedKey
  const b64 = process.env.PII_ENCRYPTION_KEY
  if (!b64) {
    // In dev (npm run build / NEXT_PHASE=phase-production-build) we
    // skip — the key only matters at runtime. lib/env.ts has the same
    // pattern for other required-at-runtime secrets.
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
      throw new Error('PII_ENCRYPTION_KEY env var is required in production')
    }
    // Test/dev fallback — predictable so tests are deterministic.
    cachedKey = Buffer.from('0'.repeat(64), 'hex')
    return cachedKey
  }
  const buf = Buffer.from(b64, 'base64')
  if (buf.length !== 32) {
    throw new Error(`PII_ENCRYPTION_KEY must decode to 32 bytes (got ${buf.length})`)
  }
  cachedKey = buf
  return cachedKey
}

// Encrypts a plaintext string. Pass null/undefined through unchanged so
// callers don't have to null-guard every field. Empty string is encrypted
// (an attacker shouldn't be able to distinguish "" from "secret value").
export function encryptField(plaintext: string | null | undefined): string | null {
  if (plaintext === null || plaintext === undefined) return null
  const nonce = crypto.randomBytes(NONCE_BYTES)
  const cipher = crypto.createCipheriv(ALGO, getKey(), nonce)
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  const payload = Buffer.concat([nonce, tag, ciphertext])
  return `${KEY_VERSION}:${payload.toString('base64')}`
}

// Decrypts a ciphertext string. Returns null for null/undefined input
// so read paths can use `decryptField(row.birth_time_enc) ?? row.birth_time`
// to fall back to plaintext during the migration window.
export function decryptField(ciphertext: string | null | undefined): string | null {
  if (ciphertext === null || ciphertext === undefined) return null
  const colon = ciphertext.indexOf(':')
  if (colon === -1) throw new Error('Invalid ciphertext format: missing version prefix')
  const version = ciphertext.slice(0, colon)
  const payload = Buffer.from(ciphertext.slice(colon + 1), 'base64')
  if (version !== KEY_VERSION) {
    throw new Error(`Unknown key version: ${version}`)
  }
  if (payload.length < NONCE_BYTES + TAG_BYTES) {
    throw new Error('Ciphertext too short')
  }
  const nonce = payload.subarray(0, NONCE_BYTES)
  const tag = payload.subarray(NONCE_BYTES, NONCE_BYTES + TAG_BYTES)
  const data = payload.subarray(NONCE_BYTES + TAG_BYTES)
  const decipher = crypto.createDecipheriv(ALGO, getKey(), nonce)
  decipher.setAuthTag(tag)
  const plaintext = Buffer.concat([decipher.update(data), decipher.final()])
  return plaintext.toString('utf8')
}

// Helper for numeric fields stored as text after encryption.
// birth_lat / birth_lng come back from Postgres as strings already (pg
// represents NUMERIC as string to preserve precision). We just round-trip
// them as strings.
export function encryptNumeric(n: number | string | null | undefined): string | null {
  if (n === null || n === undefined) return null
  return encryptField(typeof n === 'number' ? n.toString() : n)
}

export function decryptNumeric(ciphertext: string | null | undefined): number | null {
  const s = decryptField(ciphertext)
  if (s === null) return null
  const n = parseFloat(s)
  return Number.isFinite(n) ? n : null
}

// Read-path helper: prefers the encrypted column when present, falls
// back to the plaintext column for rows that haven't been backfilled
// yet. Callers SELECT both `birth_time` + `birth_time_enc` (etc.) and
// pass the row through this helper to get the canonical values.
//
// After the backfill is done and we drop the plaintext columns, the
// fallbacks become no-ops; the helper still works because the _enc
// columns are the source of truth.
interface RawChartRow {
  birth_time?: string | null
  birth_time_enc?: string | null
  birth_city?: string | null
  birth_city_enc?: string | null
  birth_lat?: number | string | null
  birth_lat_enc?: string | null
  birth_lng?: number | string | null
  birth_lng_enc?: string | null
}

export interface DecryptedBirthFields {
  birth_time: string | null
  birth_city: string | null
  birth_lat: number | null
  birth_lng: number | null
}

export function decryptBirthFields(row: RawChartRow): DecryptedBirthFields {
  const numOrNull = (v: number | string | null | undefined): number | null => {
    if (v === null || v === undefined) return null
    const n = typeof v === 'number' ? v : parseFloat(v)
    return Number.isFinite(n) ? n : null
  }
  return {
    birth_time: decryptField(row.birth_time_enc) ?? row.birth_time ?? null,
    birth_city: decryptField(row.birth_city_enc) ?? row.birth_city ?? null,
    birth_lat: decryptNumeric(row.birth_lat_enc) ?? numOrNull(row.birth_lat),
    birth_lng: decryptNumeric(row.birth_lng_enc) ?? numOrNull(row.birth_lng),
  }
}
