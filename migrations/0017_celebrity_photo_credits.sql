-- Photo attribution for celebrity images from Wikimedia Commons.
-- Most Commons photos are CC BY / CC BY-SA, which require the author's name,
-- the license and a link. Values come from the Commons API (extmetadata) and
-- are loaded separately; NULL means "not yet credited" and the page falls
-- back to a generic "Wikimedia Commons" label linking to /photo-credits.
ALTER TABLE celebrities
  ADD COLUMN IF NOT EXISTS image_author TEXT,
  ADD COLUMN IF NOT EXISTS image_license TEXT,
  ADD COLUMN IF NOT EXISTS image_license_url TEXT,
  ADD COLUMN IF NOT EXISTS image_file_page TEXT;
