-- Dedup the interpretations table and add a unique index to prevent recurrence.
--
-- The content seed (scripts/seed-content-to-db.ts) used INSERT ... ON CONFLICT
-- DO NOTHING against a table with NO unique constraint, so the arbiter never
-- fired and every re-run inserted duplicate rows. As of 2026-06-11 the table
-- held 4,701 rows for 2,638 distinct logical keys (~2,063 redundant copies):
-- combined 3456/1728, planet_house 288/144, planet_sign 288/133, and the
-- *_info types each 24/12. (Other types -- transit, dignity, element, modality,
-- retrograde -- were already distinct.)
--
-- The logical key spans the discriminating columns across all interpretation
-- types; different types populate different subsets and leave the rest NULL.
-- PG16 NULLS NOT DISTINCT treats those NULLs as equal so a single index covers
-- every type.
--
-- Safe: only exact logical-key duplicates are removed (identical seed content),
-- keeping the lowest physical row (ctid) in each group. migrate.ts runs this
-- file inside a transaction, so if any residual non-identical duplicate existed,
-- the unique index creation below would fail and roll the whole migration back
-- with no rows lost.

-- 1. Remove duplicate rows, keeping exactly one per logical key.
DELETE FROM interpretations a
USING interpretations b
WHERE a.ctid > b.ctid
  AND a.type          IS NOT DISTINCT FROM b.type
  AND a.planet        IS NOT DISTINCT FROM b.planet
  AND a.sign          IS NOT DISTINCT FROM b.sign
  AND a.house         IS NOT DISTINCT FROM b.house
  AND a.aspect_planet IS NOT DISTINCT FROM b.aspect_planet
  AND a.aspect_type   IS NOT DISTINCT FROM b.aspect_type;

-- 2. Enforce one row per logical key going forward. This is also what makes the
--    seed's ON CONFLICT DO NOTHING finally take effect on future runs.
CREATE UNIQUE INDEX IF NOT EXISTS interpretations_logical_key_uniq
  ON interpretations (type, planet, sign, house, aspect_planet, aspect_type)
  NULLS NOT DISTINCT;
