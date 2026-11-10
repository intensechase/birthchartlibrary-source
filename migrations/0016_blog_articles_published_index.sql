-- Speeds up the published-articles listing query used on the homepage and
-- /blog (WHERE published = true AND publish_date <= NOW() ORDER BY
-- publish_date DESC). Currently a no-op at 197 rows (sequential scan is
-- ~0.5ms either way) but the blog is actively being scheduled well into
-- the future, so this is ahead of the curve rather than reactive.
CREATE INDEX IF NOT EXISTS idx_blog_articles_published
  ON blog_articles (publish_date DESC)
  WHERE published = true;
