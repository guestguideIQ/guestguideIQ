# GuestGuideIQ — Marketing Site

The pre-launch marketing site for GuestGuideIQ. Built with [Astro](https://astro.build) as a
fully static site, deployed to GitHub Pages. See [docs/SPEC.md](docs/SPEC.md) for the full
product/site specification this was built from.

## Quick start

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to ./dist
npm run preview   # serve the built ./dist locally
```

## Project structure

```
src/
  layouts/BaseLayout.astro   shared <head>, header, footer for every page
  components/                Header, Footer, Logo, forms, GuidePhone (mock guest guide), PricingCards
  data/pricing.ts            plan tiers + upsell fee (shared by Home + /pricing)
  pages/                     one file per route (index, how-it-works, pricing,
                              partners, about, contact, thank-you, 404)
  site.config.ts             the handful of values you edit before launch (below)
  styles/global.css          design tokens (palette/type) + shared component styles
```

## Before this goes live

Everything below is also tracked as an open item in [docs/SPEC.md §13](docs/SPEC.md).

### 1. Forms

The waitlist, partner, and investor forms submit directly to the GuestGuideIQ backend's
lead-capture API (`POST /v1/leads/{waitlist,partner,investor}` — see
`aidlc/spaces/default/intents/260905-backend-services-spec/inception/contract-design/contract-summary.md`,
Contract 3) via `fetch`, as JSON matching each endpoint's documented request body.

1. Set the `PUBLIC_API_BASE_URL` env var to the backend's base URL (e.g.
   `https://api.guestguideiq.com`) — see [`.env.example`](.env.example). It's read in
   [`src/site.config.ts`](src/site.config.ts) and falls back to a local dev placeholder
   (`http://localhost:8080`) when unset, so `npm run dev`/`npm run build` don't require it.
2. The production build (`.github/workflows/deploy.yml`) sets this at build time — override it by
   adding a repository variable named `PUBLIC_API_BASE_URL` under **Settings → Secrets and
   variables → Actions → Variables** if the backend's URL ever changes.
3. The backend must allow cross-origin requests (CORS) from this site's origin
   (`https://guestguideiq.com`) — that's a backend-side configuration item, not something this
   repo controls.

Each form redirects to `/thank-you/` on success via the shared client-side handler in
`BaseLayout.astro`; on any non-2xx response or network failure it shows a generic inline error and
keeps the visitor's entered data, per the contract's documented failure behavior. This now
requires JavaScript (the backend only accepts JSON bodies, so the earlier no-JS
`<form action>` fallback no longer applies).

### 2. Contact email

Update `SITE.contactEmail` in `src/site.config.ts` to a real inbox — it currently defaults to
`hello@guestguideiq.com`, a placeholder.

### 3. Domain

The site assumes `https://guestguideiq.com` (set in `astro.config.mjs` and
`src/site.config.ts`). Once the domain is confirmed:

1. Add a `public/CNAME` file containing just the domain, e.g. `guestguideiq.com`.
2. In the repo's **Settings → Pages**, set the custom domain and enable **Enforce HTTPS** once
   DNS has propagated.
3. At your DNS provider, point the domain at GitHub Pages:
   - Apex domain (`guestguideiq.com`): four `A` records to GitHub Pages' IPs (see
     [GitHub's current IP list](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).
   - `www` subdomain: a `CNAME` record to `<username>.github.io`.

If the domain changes, update `site` in `astro.config.mjs` and `SITE.url` in
`src/site.config.ts` to match — both drive canonical URLs, the sitemap, and Open Graph tags.

### 4. Analytics

Set `ANALYTICS.plausibleDomain` or `ANALYTICS.ga4MeasurementId` in `src/site.config.ts`. Leave
both `null` to ship without tracking.

### 5. Social preview image

`og:image` currently uses the square brand avatar (`public/brand/social-avatar-800.png`) with a
`summary` Twitter card. Once a wide 1200×630 social card exists, add it to `public/` and switch
the tag and card type in [`BaseLayout.astro`](src/layouts/BaseLayout.astro).

### 6. Content review

Page copy is drafted from the GuestGuideIQ Business Plan (positioning, pricing tiers, upsell
engine, roadmap). Read it over before launch — especially pricing in `src/data/pricing.ts` and
the About page's founding story, which could use your actual voice.

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which
builds the site and deploys it to GitHub Pages via GitHub Actions. One-time setup: in the repo's
**Settings → Pages**, set **Source** to **GitHub Actions**.

## Design direction

Brand comes from logo pack A1a ("Talking Pin, Sunset Clay"): Terracotta `#B8472E`, Marigold
`#F2B544`, Cream `#FBF3EA`, Espresso `#2B1D17`, Warm grey `#6B5347`; Fraunces for display and
Instrument Sans for body. Logo files live in `public/brand/`, favicons in `public/`. All tokens
live in `src/styles/global.css`. Voice, per the business plan: editorial, intelligent, refined —
an automated digital concierge, not a binder replacement.
