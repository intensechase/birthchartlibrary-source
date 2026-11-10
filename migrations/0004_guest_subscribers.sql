-- Guest subscribers: users who want daily horoscope emails without creating an account
CREATE TABLE IF NOT EXISTS guest_subscribers (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT        NOT NULL UNIQUE,
  sun_sign          TEXT        NOT NULL,
  birth_month       SMALLINT    NOT NULL CHECK (birth_month BETWEEN 1 AND 12),
  birth_day         SMALLINT    NOT NULL CHECK (birth_day BETWEEN 1 AND 31),
  unsubscribe_token TEXT        NOT NULL UNIQUE,
  subscribed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS guest_subscribers_active_idx
  ON guest_subscribers (subscribed_at)
  WHERE unsubscribed_at IS NULL;
