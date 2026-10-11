# Developer Code Scan: guestguideiq-frontend

Repo: `guestguideiq-frontend/`, sibling of the workspace root. Scanned at HEAD `09edbf7f489adccb7a582d3251bb93fe0234ea46` on branch `brand/fraunces`. This is a merge of `origin/main` into the branch, and it contains `293f8af` "Group the guest Places tab by category" (#36). The scan was run on 2026-09-30 as a full first scan, because no CodeKB store exists yet for this repo.

Test baseline, taken during the scan: `npx vitest run --coverage --exclude ".claude/**"` gives 57 files and 643 tests, all passing. Coverage is 92.4% lines, 88.53% branches, 88.56% functions and 92.4% statements. See the Technical Debt Signals section for why `.claude/**` had to be excluded.

## Developer Code Scan Results

### Scan Coverage
- **Analyzed deeply**:
  - `src/guest/guide/GuestGuideView.tsx`
  - `src/guest/guide/GuideTabs.tsx`
  - `src/guest/guide/PlaceCard.tsx`
  - `src/guest/guide/placeGroups.ts`
  - `src/guest/guide/placeFormat.ts`
  - `src/guest/guide/stayDays.ts`
  - `src/guest/guide/DayRail.tsx`
  - `src/owner/billing/AreaPanel.tsx`
  - `src/owner/billing/LocalityCuration.tsx`
  - `src/owner/billing/curationView.ts`
  - `src/owner/billing/HostPlaceActions.tsx`
  - `src/owner/billing/PlacePicker.tsx`
  - `src/owner/billing/ListingControls.tsx` (first 80 lines)
  - `src/owner/guide/GuestPreviewFrame.tsx`
  - `src/api/client.ts` (header, `RequestOptions`, the whole `ApiClient` interface, and the `send` entry point)
  - `src/api/errors.ts` (the code union)
  - `src/api/replay.ts` (header)
  - `src/api/contract/entities.ts` (property, locality, guest guide, POI, hours, profile, owner listings, area and host places)
  - `src/api/contract/paths.ts`
  - `src/api/contract/primitives.ts`
  - `src/api/contract/index.ts`
  - `src/api/contract/PROVENANCE.md` (first 80 lines)
  - `src/design-system/index.ts`
  - `src/design-system/primitives/Dialog.tsx` (header)
  - `src/design-system/primitives/TabBar.tsx` (header)
  - `src/design-system/tokens/tokens.ts`
  - `src/design-system/tokens/tokens.css` (the custom property list)
  - `src/mocks/backend.ts` (header and state types)
  - `src/mocks/handlers.ts` (route table and the `guestPlace` / `MOCK_POI_CATEGORIES` construction)
  - `src/App.tsx`
  - `src/main.tsx`
  - `src/foundation.ts`
  - `src/vite-env.d.ts`
  - `src/test/setup.ts`
  - `package.json`
  - `vite.config.ts`
  - `eslint.config.js`
  - `tsconfig.json`
  - `tsconfig.app.json`
  - `tsconfig.node.json`
  - `.prettierrc`
  - `.prettierignore`
  - `.gitignore`
  - `.env.example`
  - `index.html`
  - `.github/workflows/ci.yml`
  - `.github/workflows/deploy.yml` (gating sections)
  - `infra/lib/frontend-stack.ts` (props, SPA function, media bucket, CSP and response-headers policy)
  - `infra/package.json`
  - `scripts/post-deploy-check.mjs` (header)
  - `README.md` (first 60 lines)
  - `SECURITY.md`
- **Skimmed only**:
  - `src/guest/` apart from `guide/`: `GuestSurface.tsx` (wiring lines only), `ChatWidget.tsx`, `AskPrompt.tsx`, `states.tsx` and `guest.css` (class names only)
  - `src/guest/guide/` other components: `Essentials.tsx` (the geo link only), `EventRow.tsx`, `DuskHeader.tsx`, `AdvisoryBanner.tsx`, `AreaKnownFor.tsx`, `ItineraryPanel.tsx`, `FeedbackButtons.tsx`, `IdentityBlock.tsx` and `icons.tsx`
  - `src/owner/` apart from `billing/`: `OwnerApp.tsx`, `shell/`, `links/`, `property/` (a grep for lat/lng only), `guide/` apart from `GuestPreviewFrame`, `owner.css` and `polish.css`
  - `src/owner/billing/`: `HostPlaceForm.tsx`, `HostTips.tsx`, `PlanControls.tsx`, `CancelConfirmDialog.tsx` and `ServerEmptyState.tsx`
  - `src/session/`
  - `src/theme/`
  - `src/dev/`
  - `src/design-system/primitives/*` other than `Dialog` and `TabBar`, and `primitives.css`
  - Every `*.test.ts(x)`: test names in `guestContent.test.tsx` and `LocalityCuration.test.tsx`, plus a count of `it(...)` calls
  - `infra/bin/frontend.ts` and the rest of `frontend-stack.ts`
  - `public/fonts/`
  - `src/assets/brand/`
- **Outside this repo (spot-checked, not scanned)**: `guestguideiq-app/prisma/schema.prisma` (POI and property coordinates, timezone columns), `src/guestaccess/repository.ts` and `src/guestaccess/routes.ts` (a grep for lat/lng and timezone). The checks were made only to confirm whether the data this intent needs exists on the backend.

### Packages Found
- `guestguideiq-frontend`: a web app written in TypeScript and React. It is a single SPA serving two surfaces, the Owner app and the Guest guide at `/s/<token>`. There are no workspaces.
- `infra` (`guestguideiq-frontend-infra`): an IaC package using TypeScript and AWS CDK. It defines one S3 site bucket, one S3 media bucket and one CloudFront distribution per environment. It has its own `package.json`, lockfile and tsconfig, is excluded from the app's lint, and is gated by its own CI job.

Source layout under `src/`, organised by unit (the IDs come from the `260907-frontend-app` design):

| Dir | Unit | Purpose |
|---|---|---|
| `api/contract/` | u1-api-contract | Hand-transcribed backend types and paths. Types only, apart from `ApiPaths`. Excluded from coverage. |
| `design-system/` | u2-design-system | 10 generic primitives and a token contract. Excluded from coverage (ADR-007). |
| `api/` (`client.ts`, `errors.ts`, `replay.ts`), `session/`, `theme/`, `foundation.ts` | u3-foundation | The only `fetch` call site, the error envelope mapped to a closed union of codes, the session and token store, and locality brand to tokens. |
| `owner/shell/`, `owner/OwnerApp.tsx` | u4 | Owner shell, auth screens and navigation. |
| `owner/guide/` | u5 | Guide editor, onboarding and guest preview frame. |
| `owner/billing/` | u6 | Plan controls and "Local recommendations" (curation, `AreaPanel`, host places and tips). |
| `owner/links/` | u7 | Guest links (stays). |
| `guest/` | u8 | Guest surface, chat and states. |
| `guest/guide/` | u9-guest-guide-view | One shared guide renderer. The owner's preview uses the same component. |
| `mocks/` | test doubles | Stateful MSW backend double. |
| `dev/` | dev-only | Design-system showcase. |

### Build System
- **Type**: Vite 7 (installed 7.3.6) with `@vitejs/plugin-react`, npm and Node 22 in CI (`engines` requires 20 or later). The output is a static bundle with hashed assets and `modulePreload.polyfill: false`, so no inline script is emitted and the strict CSP can stay static.
- **Config Files**: `package.json`, `package-lock.json`, `vite.config.ts` (which also holds the Vitest config), `tsconfig.json` (solution-style), `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `.env.example`, `index.html`, `infra/cdk.json`, `infra/package.json` and `infra/tsconfig.json`.
- **Build Dependencies**: the app and `infra` are independent. `infra` synthesises the hosting, and `deploy.yml` uploads `dist/` into the bucket resolved from the stack outputs. `npm run verify` runs format, lint, typecheck, test:coverage, build and audit in that order.
- **TS strictness**: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` and `verbatimModuleSyntax`. `exactOptionalPropertyTypes` is why the code uses the `{...(x === undefined ? {} : { x })}` spread idiom throughout. New props will have to follow it.
- **Path alias**: `@/` maps to `src/`. It is declared but the code mostly uses relative imports.

### APIs Discovered
- REST client in `src/api/client.ts`. There are about 45 typed methods on `ApiClient`, and every one returns `Result<T>` and never throws. The paths live in `src/api/contract/paths.ts`, which holds about 40 path constants and builders.
  - The client is the only module allowed to use `fetch`. ESLint `no-restricted-globals` enforces this, with overrides only for `src/api/**` and `src/session/**`.
  - Tenancy is sent through the `X-Locality-Domain` header on tenant-scoped calls. Auth is a bearer token from `SessionManager`, with a single-flight refresh and a replay registry for requests lost to an expired session.
  - Errors: `errors.ts` is the only module that reads an HTTP status. It maps 11 backend codes plus `TRANSPORT_FAILURE` and `UNRECOGNISED`.
- Places-relevant calls:
  - **Guest**: `getStay(token)` returns `GuestStayView` = `{ stay?, property: PropertyIdentity, locality, guide: GuestGuideView }`. Places arrive as `guide.favoritedPOIs: GuestPOI[]` in server order, featured first and then by host rank. `sendFeedback` is also available.
  - **Owner**: `listPois(propertyId)` returns `LocalityPOIList` (the whole locality catalogue, with no query parameters). `getGuide` returns `favoritedPOIIds`. `addFavorite` and `removeFavorite` are also available. `listListings(propertyId)` returns a stance, note, rank and feedback counts for each picked item. `updateListing` covers feature, list and hide. `getPropertyArea(propertyId)` returns an `OwnerAreaView`, and only this one carries `area.timezone`. There are also create, update and delete calls for host places and host tips, and `getPropertyDetails` (flat, with `latitude` and `longitude`).
- Contract provenance (`PROVENANCE.md`): types are written by hand from `api-documentation.md` plus `docs/frontend-contract-delta.md` in `guestguideiq-app`, with a pinned LF-normalised sha256 for each. The later additions (arrival facts, schema v2, `poiCategory` in delta §6d) were transcribed from backend source. There is no OpenAPI document or generated client (ADR-006 is still open).
- Guest-reachable data relevant to this intent (from `entities.ts`):
  - `GuestPOI`:
    - Identity: `id`, `name`, `description` and `category` (legacy free text).
    - Categorisation: `poiCategory?: { id, category, subcategory, slug, icon, sortOrder, imageUrl }`.
    - Hours: `hours?: { days[{dayOfWeek, closed, spans[{opens, closes, closesNextDay}]}], seasonal }`. The times are local wall clock, and a missing day means unknown.
    - Cost: `profile?.priceLevel` (1 to 4 or null), `isFree` and `admission`.
    - Host curation: `stance?: 'featured'|'listed'`, `recommended?`, `hostAdded?` and `hostNote`.
    - Location and other: `address`, `neighborhood`, `tier`, `features`, `fit`, `tips`, `media` and `advisoryIds`.
    - **There is no latitude or longitude.**
  - `PropertyIdentity.geo?: { latitude, longitude } | null`, which is paired or absent.
  - **There is no timezone anywhere in the guest payload.** `stayDays.ts:67-70` says so explicitly.
  - `LocalityPOI` (the owner catalogue row): `id`, `name`, `description?`, `category?` (free text), `localityIds`, `address?` and `hostAdded?`. **It has no hours, profile or price, `poiCategory`, coordinates or stance.**

### Frameworks & Libraries
- react and react-dom — ^19.2.0 (installed 19.2.8) — UI
- react-router-dom — ^7.9.4 (installed 7.18.3) — **declared but never imported**. Routing is a regex over `window.location.pathname` in `App.tsx`.
- typescript — ^5.9.3 — language
- vite — ^7.1.12 — build and dev server
- vitest with @vitest/coverage-v8 — ^3.2.4 — tests and coverage
- jsdom — ^27 — test DOM
- @testing-library/react ^16.3, user-event ^14.6 and jest-dom ^6.9 — component and scenario tests
- msw — ^2.11.5 (installed 2.15.0) — network-boundary substitution
- playwright — ^1.63 — used only by `scripts/post-deploy-check.mjs`
- eslint ^9.38, typescript-eslint ^8.46 (`strictTypeChecked` and `stylisticTypeChecked`), eslint-plugin-react-hooks ^6.1 (`recommended-legacy`, with `exhaustive-deps` as an error) and eslint-plugin-react-refresh — lint
- prettier — ^3.6.2 — formatting
- infra: aws-cdk-lib ^2.170, aws-cdk ^2.170 and constructs ^10.3
- **There is no map, geo or date/timezone library** (no Google Maps loader, date-fns-tz, Luxon or Temporal polyfill). Timezone arithmetic exists only in `src/mocks/backend.ts` (`endOfDayInZone`, `wallClockInZone`, using `Intl`).

### Test Coverage
- **Test Directories**: tests sit next to the code as `src/**/*.test.ts(x)` (57 files and 643 tests). `src/test/setup.ts` provides jest-dom and a `scrollIntoView` shim. The MSW double lives in `src/mocks/` (`backend.ts` is 346 lines and `handlers.ts` is 2,050).
- **Test Frameworks**: Vitest with jsdom and globals, React Testing Library, user-event and MSW. The test timeout is 15 seconds.
- **Coverage Config**: present, in `vite.config.ts`, and it is enforced in the runner itself.
  - Floors: lines, functions and statements 80, branches 70.
  - Included: `src/**/*.{ts,tsx}`.
  - Excluded: `src/design-system/**`, `src/api/contract/**`, `src/test/**`, `src/mocks/**`, `src/dev/**`, `src/main.tsx`, `*.d.ts` and the test files themselves.
- Intent-relevant existing tests:
  - `guest/guide/placeGroups.test.ts` (112 lines).
  - `guest/guide/guestContent.test.tsx`, which includes "a section per category, in sort order … Other last", "keeps the flat list … when no place is categorised", the picture fallback cases and the day-selected hours cases.
  - `guest/guide/GuestGuideView.test.tsx`, `DayRail.test.tsx` and `stayDays.test.ts`.
  - `owner/billing/curationView.test.ts`, `LocalityCuration.test.tsx` and `hostCuration.test.tsx` (760 lines).
  - `owner/guide/OnboardingFlow.places.test.tsx`, because `PlacePicker` is shared with onboarding.
- Mock data gap: `guestPlace()` in `handlers.ts` (around line 350) emits `hours: null`, `profile: null`, `isFree: null` and no coordinates. Only five mock categories exist (Dining, Outdoors, Sights, Culture, Shopping), and `stance` defaults to `featured`. Filters need richer fixtures, which can go in through `state.poiDetails` overrides.
- There is no live-backend E2E suite yet. Team practice Q5 requires a "thin live-backend suite", but Playwright appears only in the post-deploy smoke check.

### Code Quality Indicators
- **Linting**: `eslint.config.js` uses type-aware rules and blocking errors. It adds:
  - bans on raw-HTML sinks (`dangerouslySetInnerHTML`, `innerHTML` and `outerHTML` assignment, `insertAdjacentHTML`, `document.write`);
  - `no-restricted-globals` for `fetch`, `localStorage` and `sessionStorage` outside their owning modules;
  - `no-warning-comments` for TODO, FIXME and HACK;
  - `react-hooks/exhaustive-deps` as an error.
  Prettier settings: single quotes, semicolons, trailing commas, width 80.
- **CI/CD**:
  - `.github/workflows/ci.yml`. **verify** runs format:check, lint, typecheck (separate from build), test:coverage and build, then uploads `dist`. **infra** runs tsc and `cdk synth` for dev, staging and production, plus a certificate-guard negative test. **scan** runs `npm audit --audit-level=high` and a gitleaks source scan. **scan-built-output** runs gitleaks `dir dist/`, pinned by version and sha256. The accessibility job is **absent** (advisory, and deliberately not faked).
  - `.github/workflows/deploy.yml`. It is gated by `vars.DEPLOY_ENABLED`, and staging is skipped (`STAGING_ENABLED`) because no staging stack exists. Production runs **only through `workflow_dispatch`**, because environment protection rules are unavailable on the current GitHub plan and `environment: production` only scopes OIDC. The workflow keeps a rollback snapshot of the shell and runs a Playwright post-deploy check. Actions are pinned by SHA, permissions are set per job, and deploy credentials come through OIDC.
- **Documentation**: `README.md` is thorough on the gates and their history. `SECURITY.md` sets a suppression policy (owner, reason and expiry for each suppression; none are active). Source comments are unusually dense and traceable: each decision cites an AC, BR, ADR or team.md rule.

### Technical Debt Signals
- **Stale agent worktrees pollute the local test run.** `.claude/worktrees/` holds six stale worktrees, and `vite.config.ts` `test` has no `exclude` for `.claude/**`. A plain `npm test` therefore runs 153 files and 1,685 tests, and one of them fails: `.claude/worktrees/interesting-easley-f33cc7/src/brand.test.ts` expects "Bricolage Grotesque". The real suite is 57 of 57 green. ESLint already ignores `.claude/**`, but Vitest does not. CI is unaffected, because a fresh clone has no worktrees.
- **Unused dependency**: `react-router-dom` is in `dependencies` but no file under `src/` imports it.
- **Two divergent place-grouping modules**:
  - `guest/guide/placeGroups.ts` groups by `poiCategory.category`, orders sections by `sortOrder`, keeps the server order within a section, and returns `null` (a flat list) when nothing is categorised.
  - `owner/billing/curationView.ts` groups by the legacy free-text `category`, sorts sections alphabetically with "Other" last, and **sorts places by name within a group**.
  - The two surfaces use different category sources, heading text ("Other places" against "Other") and ordering. The intent needs "the same collapsible categories" on both surfaces.
- **Large files**: `mocks/handlers.ts` (2,050 lines), `guest/guest.css` (1,861), `api/contract/entities.ts` (1,221), `owner/owner.css` (1,181), `api/client.ts` (1,098) and `owner/polish.css` (836). Guest CSS repeats selectors across several responsive and theme blocks (`.ggiq-pscroll` and `.ggiq-pcard` are each defined four to six times).
- **Known, documented race** in `PlacePicker.tsx:19-32`: out-of-order favourite toggles can visibly revert. It is accepted and bounded.
- **`Dialog` does not make the background inert** (a documented gap in `Dialog.tsx`). This is relevant to the new modal filter sheet.
- **Deploy shape deviates from affirmed practice**: there is no staging stack and production is dispatched by hand without an enforced reviewer. It is documented in `deploy.yml` with "TO RESTORE" steps.
- Marker hygiene is clean: there are no TODO, FIXME or HACK markers in `src/`. The only suppression is one `eslint-disable-next-line` in `api/client.test.ts:274`. The `@ts-expect-error` lines in `contract.test.ts` are intentional compile-time contract assertions.

## Handoff Summary
- **Intent-relevant finding**: most of the filters need data the frontend does not receive today. Only category, price, "open on a selected day" and host picks can be computed on the guest side from the current payload. Distance, map pins and a true "open now" need backend contract additions, and the host panel needs much more.
  - **Distance and map (both surfaces)**: `GuestPOI` has no coordinates (`src/api/contract/entities.ts:527-584`), and neither does `LocalityPOI` (`:322-335`). The backend already stores them: `pois.latitude` and `pois.longitude` are paired, indexed and used for Haversine search (`guestguideiq-app/prisma/schema.prisma:428-439, 557`). They are not mapped into either response. The property origin is `PropertyIdentity.geo` on the guest side and `PropertyDetails.latitude/longitude` on the owner side. **No frontend screen collects property coordinates** (`PropertyDetailsForm.test.tsx:336-337` asserts that no lat/lng fields exist), so `geo` is probably null for most properties. That puts the "every place and the property need coordinates" assumption in the scope document at risk from both ends.
  - **Open now**: hours are local wall-clock `HH:mm` with `closesNextDay` (`entities.ts:615-628`). "Open now" needs the property's current local time, but **no guest-reachable response carries a timezone** (`stayDays.ts:67-70`). The backend has `Property.timezone` and the locality timezone (`schema.prisma:232-233`, and `guestaccess/repository.ts:130` resolves `localityTimezone`), but does not return them to the guest. The owner side can read `OwnerAreaView.area.timezone`, but only when an area is recorded (`area` may be null). "Open on [day]" is computable today through `hoursOn(poi.hours, day.iso)` (`placeFormat.ts:59-75`). Unknown hours must stay "unknown", not "open": this is the file's own rule.
  - **Day rail coupling**: `DayRail` renders only when the stay has 2 or more days (`GuestGuideView.tsx:183`, `DayRail.tsx:532`). With a one-day stay or no stay (the owner preview) there is no selected day, so the "Open on [day]" chip must fall back to "Open now". Selected-day state lives in `GuestGuideView` and is passed to `GuideTabs` as `day`. `GuideTabs.tsx:377-382` currently says places are "never filtered by" the day. The intent changes that, but only through an explicit chip.
  - **Host picks**: every guest place is already a host pick, because `favoritedPOIs` holds only chosen places. The distinguishing fields are `stance: 'featured'|'listed'` and `recommended`, which are separate from `hostAdded` ("Recommended by your host" on `PlaceCard.tsx:186-188`). The card currently shows no "Host pick" label. Requirements must define which field "Host picks" means. The mock sets `stance` from listings and defaults to `featured`, and never sets `recommended`.
  - **Price**: `profile.priceLevel` (1 to 4) plus `isFree` exist on `GuestPOI`, and `priceLabel()` in `placeFormat.ts:115-121` already renders `$`. The wireframe's "Free" option would come from `isFree`, which is tri-state.
  - **Categories**: the guest side already groups by `poiCategory` (`placeGroups.ts`) and renders `h3` headers with counts (`GuideTabs.tsx:434-463`). These are not collapsible, and the file falls back to a flat list when nothing is categorised. Its own comment says that is the state of production "before categories are assigned".
  - **Host panel reality versus the wireframe**: the host panel is `LocalityCuration` with `PlacePicker` (shared with onboarding, `OnboardingFlow.tsx:161`). It lists **the entire locality catalogue**, both picked and unpicked, from `listPois`, and joins `listListings` to get stance. `LocalityPOI` carries none of hours, price, `poiCategory` or coordinates, so open-now, price, category (by the shared taxonomy) and distance filters on the host panel all require backend additions to `GET /v1/pois`. Host picks can be derived client-side from `favoritedPOIIds` plus the listing stance. `PlacePicker.tsx:12-15` records that the endpoint takes no query parameters, so all filtering would be client-side.
  - **Owner preview**: `GuestPreviewFrame` renders the same `GuestGuideView` but passes no `favoritedPOIs`, `property` or `stay` (`GuestPreviewFrame.tsx:72-78`). Any new Places-tab UI renders there as the empty state, and must not add a preview-mode prop (`GuestGuideView.tsx:17-20` forbids it).
- **Risks / follow-up**:
  1. **CSP blocks Google Maps as deployed.** `infra/lib/frontend-stack.ts:263-277` sets `script-src 'self'`, `connect-src 'self' <api>`, `img-src 'self' data:`, `style-src 'self'` and `font-src 'self'`. The Maps JS API needs Google origins in `script-src`, `img-src`, `connect-src` and `font-src`. By its published CSP guidance it also needs inline styles (or a nonce) and possibly `worker-src blob:`; confirm the exact list against current Google documentation. The static-host decision (no nonce is possible) is recorded in the same file. Loosening `style-src` or `script-src` weakens the XSS defence that `eslint.config.js` ties to the 7-day non-revocable token. This needs an explicit security decision at design, not a quiet edit.
  2. **`Referrer-Policy: no-referrer` is applied globally** (`frontend-stack.ts:290-298`), because the guest URL holds a live credential. Google Maps keys restricted by HTTP referrer depend on the Referer header, so the scope's "restrict the key to your domains" constraint may conflict with this policy. The guest route `/s/<token>` must never leak to Google either way. Verify before choosing how to restrict the key.
  3. **A public Maps key will trip the blocking built-output secret scan.** A `VITE_GOOGLE_MAPS_*` value is compiled into `dist/`, and gitleaks' default rules match Google API keys. `scan-built-output` (`ci.yml`) would fail. The key must be declared in `src/vite-env.d.ts`, and it needs a documented allowlist entry with owner, reason and expiry under `SECURITY.md`. Weakening the gate is not an option, because project.md forbids treating a scanner as advisory.
  4. `Permissions-Policy: geolocation=()` is consistent with the out-of-scope "no device location", so keep it.
  5. There is no existing third-party script loading, map component or chip, sheet, disclosure, checkbox-group or radio-group primitive. The design system has 10 primitives, including `Dialog` (a focus trap, but not background-inert) and `TabBar`. `DayRail` is the only radiogroup implementation, with a roving tabindex, and it is a good pattern to reuse for the List/Map toggle and sort. The rule that the List/Map toggle must not be a second tablist (project.md, 2026-09-30) is consistent with `GuideTabs.tsx:226-229`.
  6. New filter logic, meaning pure functions such as distance, open-now, predicates and counts, falls under the 80/70 coverage floor and the custom BDD-first cadence. The mock `guestPlace()` needs richer fixtures for hours, price, coordinates and timezone once the contract adds them. Contract additions must also go through `src/api/contract/` with a `PROVENANCE.md` digest update.
  7. The local `npm test` is polluted by `.claude/worktrees/` (see Technical Debt Signals). Add `exclude: ['.claude/**', ...]` to the Vitest config before relying on a local baseline.
  8. The repo is on `brand/fraunces` (a merge of `origin/main`), not `main`. Pin the CodeKB snapshot commit accordingly, and rescan if `main` moves before publishing.
