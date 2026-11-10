# Swiss Ephemeris Data Files

This directory holds the binary `.se1` data files required by the `swisseph` Node.js package.
These files are **not committed to git** (see `.gitignore`) due to their size.

## Required Files

For dates between 1800–2400 AD (covers all modern birth charts):

```
seas_18.se1   — asteroid data (optional but recommended)
sepl_18.se1   — planet data    ← required
semo_18.se1   — moon data      ← required
```

## Download

1. Go to: https://www.astro.com/ftp/swisseph/ephe/
2. Download `sepl_18.se1` and `semo_18.se1` (and optionally `seas_18.se1`)
3. Place them in this `ephe/` directory

## Vercel Deployment

For production, upload the `.se1` files to a storage bucket (e.g., Supabase Storage or S3)
and update `SWISSEPH_DATA_PATH` in your Vercel environment variables to point to the downloaded path,
or bundle the files in the repo if file size permits (each is ~7 MB).

## Without Data Files

`swisseph` will fall back to the built-in Moshier ephemeris, which is less accurate
(~1 arcminute error vs. 0.001 arcseconds) but functional for most astrological purposes.
