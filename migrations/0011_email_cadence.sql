-- Per-user email cadence. The cron still fires daily (idempotent) but
-- only sends to a given user when their last email was at least
-- `email_cadence_days` days ago. Default is 1 (daily) so the existing
-- "Daily email" toggle UX stays accurate for new signups.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS email_cadence_days INTEGER NOT NULL DEFAULT 1
    CHECK (email_cadence_days BETWEEN 1 AND 30),
  ADD COLUMN IF NOT EXISTS last_email_sent_at TIMESTAMPTZ;

-- Lets the cron skip recently-sent users with an index lookup instead
-- of a full scan once the subscriber base grows.
CREATE INDEX IF NOT EXISTS idx_profiles_daily_email_eligible
  ON profiles (last_email_sent_at NULLS FIRST)
  WHERE daily_email = true AND email IS NOT NULL;
