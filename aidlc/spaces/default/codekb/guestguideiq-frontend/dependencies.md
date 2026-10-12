# Dependencies — `guestguideiq-frontend`

Library versions are recorded once in `technology-stack.md`. This file records the relationships.

## External runtime dependencies

| Dependency | Kind | How it is reached | Notes |
|---|---|---|---|
| `guestguideiq-app` REST API | HTTP, cross-origin | `src/api/client.ts` only | bearer auth, `X-Locality-Domain` tenancy; contract hand-transcribed (see `api-documentation.md`) |
| Google OAuth (optional) | browser redirect | `VITE_GOOGLE_CLIENT_ID` | secret stays in the backend |
| AWS S3 + CloudFront | hosting | `infra/` | static site; media bucket |
| React, React DOM | npm | bundled | only runtime UI dependency in use |

No third-party script is loaded at runtime today. The CSP (`script-src 'self'`) forbids it; see `architecture.md` § Security posture.

## Unused dependency

- `react-router-dom` is in `dependencies` but no file under `src/` imports it.

## Build and CI dependencies

- The app build (`vite`) and `infra` (`aws-cdk`) are independent packages. `deploy.yml` uploads `dist/` to the bucket resolved from the stack outputs.
- `npm run verify` runs format, lint, typecheck, test:coverage, build and audit, in that order.
- `scripts/post-deploy-check.mjs` depends on Playwright and a deployed URL.

## Internal cross-module dependencies

| From | To | Rule |
|---|---|---|
| any UI module | `src/api/client.ts` | the only allowed network path (ESLint `no-restricted-globals`) |
| `src/api/client.ts` | `src/api/errors.ts`, `src/session/`, `src/api/contract/` | errors parsed only in `errors.ts` |
| `src/session/`, `src/api/` | `localStorage`, `sessionStorage` | the only modules allowed browser storage |
| `owner/guide/GuestPreviewFrame` | `guest/guide/GuestGuideView` | preview uses the real guest renderer |
| `owner/guide/OnboardingFlow` | `owner/billing/PlacePicker` | shared picker; changes affect onboarding (`OnboardingFlow.places.test.tsx`) |
| `guest/guide/GuideTabs` | `placeGroups`, `PlaceCard` -> `placeFormat` | pure logic beside components |
| `guest/guide/GuestGuideView` | `DayRail`, `stayDays` | selected-day state lives here |
| `owner/billing/LocalityCuration` | `PlacePicker`, `curationView` | owner-side grouping differs from guest `placeGroups` |
| all UI | `src/design-system/` | primitives and tokens |

Full component graph: `component-inventory.md` § Component dependency graph.

## Cross-repository dependency

The frontend depends on backend contract changes it cannot make itself. For the Places-filters intent the needed additions are:

- place coordinates on `GuestPOI` and `LocalityPOI`;
- a property or locality timezone reachable by the guest;
- hours, price and `poiCategory` on `LocalityPOI` (the owner catalogue).

The data already exists in the backend schema but is not exposed. Each addition must be transcribed into `src/api/contract/` with a `PROVENANCE.md` digest update.
