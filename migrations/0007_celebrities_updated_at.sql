-- Track when a celebrity's indexable content actually changes.
-- Used as the sitemap <lastmod> signal so Google recrawls enriched pages.
-- Trigger only fires on changes to columns that affect rendered content,
-- so admin housekeeping (e.g. metadata updates) does not bump the timestamp.

ALTER TABLE celebrities
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE celebrities SET updated_at = COALESCE(created_at, NOW());

CREATE OR REPLACE FUNCTION celebrities_bump_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.chart_data    IS DISTINCT FROM OLD.chart_data
  OR NEW.bio_extended  IS DISTINCT FROM OLD.bio_extended
  OR NEW.description   IS DISTINCT FROM OLD.description
  OR NEW.bio           IS DISTINCT FROM OLD.bio
  OR NEW.birth_time    IS DISTINCT FROM OLD.birth_time
  OR NEW.image_url     IS DISTINCT FROM OLD.image_url
  THEN
    NEW.updated_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_celebrities_updated_at ON celebrities;
CREATE TRIGGER trg_celebrities_updated_at
  BEFORE UPDATE ON celebrities
  FOR EACH ROW
  EXECUTE FUNCTION celebrities_bump_updated_at();

CREATE INDEX IF NOT EXISTS idx_celebrities_updated_at
  ON celebrities (updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_celebrities_bio_extended_not_null
  ON celebrities (name) WHERE bio_extended IS NOT NULL;
