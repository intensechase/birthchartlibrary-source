-- Performance indexes identified in code review
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_profiles_email
  ON profiles (email);

CREATE INDEX IF NOT EXISTS idx_birth_charts_user_primary
  ON birth_charts (user_id, created_at DESC);

-- Trigram index for celebrity name ILIKE search
CREATE INDEX IF NOT EXISTS idx_celebrities_name_trgm
  ON celebrities USING GIN (name gin_trgm_ops);
