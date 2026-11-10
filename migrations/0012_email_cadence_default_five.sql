-- Per-user email cadence default was 1 (daily) when the column was
-- added in 0011_email_cadence.sql. Change to 5 (every 5 days) so new
-- signups land on a gentler cadence — fatigue concern outweighs the
-- "daily content" expectation per product call 2026-05-24.
--
-- Only affects NEW rows. Existing profiles keep their current cadence.
ALTER TABLE profiles
  ALTER COLUMN email_cadence_days SET DEFAULT 5;
