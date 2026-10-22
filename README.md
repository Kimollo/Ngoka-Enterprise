# Ngoka Enterprise

Single-page website for Ngoka Enterprise in Semorishi.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Update prices and stock

Open http://localhost:3000/admin

The password is `ADMIN_PASSWORD` in `.env.local`. Copy `.env.example` to `.env.local` if that file is missing, set a password, and restart the site.

Saved changes are written to `data/catalog.json`.

Photos in `public/images` are placeholders. Replace the files and keep the same names.
