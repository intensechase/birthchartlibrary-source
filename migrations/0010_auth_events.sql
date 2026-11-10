-- Audit log of security-relevant account events. Append-only — never
-- updated, never deleted by the app. Lets us answer "did someone log in
-- to account X from a new IP?" or "when was this password changed?"
-- after the fact, without resorting to webserver logs.
--
-- user_id may be NULL for failed-login attempts on non-existent accounts
-- (we capture the email tried). Email may be NULL for actions on the
-- already-authenticated user.
--
-- Retention TODO: scheduled cleanup of rows older than 1 year via cron.

CREATE TABLE IF NOT EXISTS auth_events (
  id          BIGSERIAL PRIMARY KEY,
  event_type  TEXT NOT NULL,
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email       TEXT,
  ip          TEXT,
  user_agent  TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_events_user_created
  ON auth_events (user_id, created_at DESC) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_auth_events_email_created
  ON auth_events (LOWER(email), created_at DESC) WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_auth_events_type_created
  ON auth_events (event_type, created_at DESC);
