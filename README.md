# Ngoka Enterprise

Website for Ngoka Enterprise in Semorishi.

**Live site:** https://ngoka-enterprise.netlify.app/

**Staff page:** https://ngoka-enterprise.netlify.app/admin

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Update prices and stock

On the live site, open https://ngoka-enterprise.netlify.app/admin

The password is `ADMIN_PASSWORD`. On your computer it goes in `.env.local`. Copy `.env.example` to `.env.local` if that file is missing, set a password, and restart the site. On Netlify, set the same name under **Project configuration → Environment variables**, then deploy the site again.

Saving on your computer writes `data/catalog.json`. Saving on the live site stores the prices with Netlify.

Photos in `public/images` are placeholders. Replace the files and keep the same names.
