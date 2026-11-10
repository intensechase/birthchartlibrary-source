-- Token columns for new-account email verification flow
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS email_verification_token   TEXT,
  ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMPTZ;
