# Birth Chart Library: source code

This is the source code for [birthchartlibrary.com](https://birthchartlibrary.com), a free natal chart calculator and celebrity chart archive.

It's published here because the site uses the [Swiss Ephemeris](https://www.astro.com/swisseph/) (through `sweph-wasm`), which is licensed under the GNU Affero General Public License v3. The AGPL asks that anyone who uses the site over a network can get its source, so this repository holds the code running on the site.

## What's here

- A Next.js (Pages Router) app in TypeScript, with Tailwind CSS
- Chart calculation: `lib/swisseph/`
- Database migrations (PostgreSQL): `migrations/`
- `data/celebrity-couples.csv`, the one data file the site reads at runtime

The database contents (celebrity records, user accounts) are not included.

## License

- **Code:** GNU AGPL v3. See [LICENSE](LICENSE).
- **Written content** (interpretation texts, articles, bios and other prose) is not covered by the AGPL. See [NOTICE](NOTICE).

## Running it

You need Node.js 20+, PostgreSQL, and the environment variables listed in `.env.example`.

```
npm install
npm run dev
```

## Contact

librarian@birthchartlibrary.com
