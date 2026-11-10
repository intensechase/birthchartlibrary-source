-- Drop the Astrologer's Corner feature tables.
--
-- The /astrologers-corner public route was retired 2026-05-21 (redirect
-- to /blog kept in next.config.ts for any inbound links). The admin UI
-- and API surface come out in the same change as this migration; with
-- nothing left writing to these tables and no plans to revive the
-- monthly-readings format, this drop finalizes the removal.
--
-- Data destroyed: 36 rows in guest_readings authored under the single
-- astrologers entry "C.H. Hendricks" (slug ch-hendricks). The user
-- explicitly chose the full-removal path; archive was offered and
-- declined.
--
-- Order: guest_readings first (it carries a FK to astrologers), then
-- astrologers. IF EXISTS so the migration is idempotent on environments
-- where the rollback was already manually applied.

DROP TABLE IF EXISTS guest_readings;
DROP TABLE IF EXISTS astrologers;
