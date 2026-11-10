-- Add columns for token-based email change verification flow
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS pending_email        TEXT,
  ADD COLUMN IF NOT EXISTS email_change_token   TEXT,
  ADD COLUMN IF NOT EXISTS email_change_expires TIMESTAMPTZ;
