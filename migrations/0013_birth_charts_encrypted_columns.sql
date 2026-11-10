-- App-level encryption of sensitive birth chart PII.
--
-- Threat model: limit blast radius of a database-only compromise. With
-- these columns encrypted, an attacker who reads the DB tables (via SQL
-- injection, leaked backup, compromised replica, stolen Postgres
-- credentials, etc.) sees ciphertext rather than the user's exact birth
-- coordinates, time, and city.
--
-- Encryption is AES-256-GCM at the application layer (lib/crypto.ts).
-- The key never enters Postgres — it lives only in the app process's
-- environment, loaded once at startup. That means pg_stat_activity,
-- query logs, and process listings cannot expose it.
--
-- Migration strategy is the standard "expand → migrate → contract":
-- step 1 (this migration): add nullable encrypted columns alongside the
-- existing plaintext ones.
-- step 2 (application change): dual-write to both columns on INSERT.
-- step 3 (backfill script): populate _enc columns from plaintext for
-- existing rows.
-- step 4 (application change): switch read path to prefer _enc, fall
-- back to plaintext for any row that isn't backfilled yet.
-- step 5 (separate migration, after verification): drop the plaintext
-- columns and the fallback code.
--
-- Steps 2-4 ship in a single deploy with this migration so writes start
-- producing encrypted data immediately. Step 5 is deliberately deferred
-- to a follow-up session — dropping columns is destructive.

ALTER TABLE birth_charts
  ADD COLUMN IF NOT EXISTS birth_time_enc TEXT,
  ADD COLUMN IF NOT EXISTS birth_lat_enc TEXT,
  ADD COLUMN IF NOT EXISTS birth_lng_enc TEXT,
  ADD COLUMN IF NOT EXISTS birth_city_enc TEXT;
