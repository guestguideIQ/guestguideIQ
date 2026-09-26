import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: once the domain is confirmed and DNS is pointed at GitHub Pages,
// keep this as the apex domain (see public/CNAME and README.md).
const SITE_URL = 'https://guestguideiq.com';

export default defineConfig({
  site: SITE_URL,
  outDir: './dist',
  integrations: [sitemap()],
  // /experiences/ was the pre-pivot guest-facing showcase; keep old links working.
  redirects: {
    '/experiences': '/how-it-works',
  },
  build: {
    // Astro defaults to /page/index.html which gives clean GitHub Pages URLs.
    format: 'directory',
  },
});
