-- Step 5 of the 0013 encryption rollout, part 1 (2026-11-19).
-- New charts stop writing plaintext birth time, city and coordinates; only the
-- _enc columns are written. These three were NOT NULL, so relax that first.
-- Non-destructive: existing values are untouched here. The plaintext values are
-- cleared separately after a server-side check that every _enc value decrypts
-- to the same value; the columns themselves are dropped in a later migration.
ALTER TABLE birth_charts
  ALTER COLUMN birth_city DROP NOT NULL,
  ALTER COLUMN birth_lat DROP NOT NULL,
  ALTER COLUMN birth_lng DROP NOT NULL;
