-- Idempotency for daily cron jobs. The cron handler inserts a row at the
-- start of each run; a unique (job, run_date) prevents double execution
-- when the scheduler fires twice in the same UTC day.

CREATE TABLE IF NOT EXISTS cron_runs (
  job TEXT NOT NULL,
  run_date DATE NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  sent INTEGER,
  failed INTEGER,
  PRIMARY KEY (job, run_date)
);
