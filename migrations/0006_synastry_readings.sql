-- Saved synastry readings with shareable hash URLs
CREATE TABLE IF NOT EXISTS synastry_readings (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  hash              TEXT        NOT NULL UNIQUE,
  user_id           UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  person_a          JSONB       NOT NULL,
  person_b          JSONB       NOT NULL,
  chart_a           JSONB       NOT NULL,
  chart_b           JSONB       NOT NULL,
  aspects           JSONB       NOT NULL,
  score             JSONB       NOT NULL,
  relationship_type TEXT        NOT NULL DEFAULT 'romantic',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS synastry_readings_hash_idx ON synastry_readings (hash);
CREATE INDEX IF NOT EXISTS synastry_readings_user_idx ON synastry_readings (user_id);
