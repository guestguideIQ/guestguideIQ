# Technology Stack — `guestguideiq-frontend`

Versions are the `package.json` ranges, with the installed version where the scan recorded it.

## Languages and runtime

| Item | Version | Notes |
|---|---|---|
| TypeScript | ^5.9.3 | `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`; solution-style `tsconfig.json` with `tsconfig.app.json` and `tsconfig.node.json` |
| Node | 22 in CI; `engines` >= 20 | |
| Package manager | npm | `package-lock.json`; no workspaces |

## Application

| Library | Version | Purpose |
|---|---|---|
| react, react-dom | ^19.2.0 (19.2.8) | UI |
| react-router-dom | ^7.9.4 (7.18.3) | **declared, never imported**; routing is a regex in `App.tsx` |

No state-management, data-fetching, map, geo or date/timezone library is present (no Google Maps loader, no date-fns-tz, Luxon or Temporal polyfill). Timezone arithmetic exists only in the test double (`src/mocks/backend.ts`: `endOfDayInZone`, `wallClockInZone`, using `Intl`).

## Build

| Tool | Version | Notes |
|---|---|---|
| vite | ^7.1.12 (7.3.6) | `@vitejs/plugin-react`; static bundle with hashed assets; `modulePreload.polyfill: false` so no inline script is emitted |

## Test

| Tool | Version | Purpose |
|---|---|---|
| vitest + @vitest/coverage-v8 | ^3.2.4 | runner and coverage (config in `vite.config.ts`) |
| jsdom | ^27 | test DOM |
| @testing-library/react | ^16.3 | component and scenario tests |
| @testing-library/user-event | ^14.6 | interaction |
| @testing-library/jest-dom | ^6.9 | matchers |
| msw | ^2.11.5 (2.15.0) | network-boundary substitution |
| playwright | ^1.63 | post-deploy check only |

## Quality

| Tool | Version | Notes |
|---|---|---|
| eslint | ^9.38 | flat config |
| typescript-eslint | ^8.46 | `strictTypeChecked` + `stylisticTypeChecked` (type-aware) |
| eslint-plugin-react-hooks | ^6.1 | `recommended-legacy`; `exhaustive-deps` is an error |
| eslint-plugin-react-refresh | | |
| prettier | ^3.6.2 | single quotes, semicolons, trailing commas, width 80 |

## Infrastructure and delivery

| Item | Version | Notes |
|---|---|---|
| aws-cdk-lib, aws-cdk | ^2.170 | `infra/` package |
| constructs | ^10.3 | |
| AWS | S3 (site, media), CloudFront (SPA function, response-headers policy) | one stack per environment |
| GitHub Actions | SHA-pinned actions | OIDC deploy credentials |
| gitleaks | pinned version and sha256 | source scan (action) and built-output scan (`gitleaks dir dist/`) |
| npm audit | `--audit-level=high` | dependency scan |

## Public build-time configuration (`VITE_*`, all public by design)

- `VITE_API_BASE_URL`: the API origin.
- `VITE_LOCALITY_DOMAIN`: development only; unset in production.
- `VITE_GOOGLE_CLIENT_ID`: optional Google sign-in client ID.

Any new public key (for example a Maps key) must be declared in `src/vite-env.d.ts` and, if gitleaks matches it, allowlisted with owner, reason and expiry under `SECURITY.md`.
