# Code Quality Assessment — `guestguideiq-app`

**Derived from** two passes:
- The **focused scan of 2026-09-30** at `ce69629`. It covered the places, curation and stay area and the data model, including the test inventory for that area by file name and test title. **No tests were executed in this run.**
- The **prior full scan** at `76d190d`. Sections resting on it are marked *(carried forward, not re-verified)*. The test and coverage numbers in them were measured at `40c8aed`. **They no longer describe the current source**, which has since gained several modules, 15 migrations and a real-Postgres integration tier.

---

## Verdict

**Focused area, at `ce69629`.**
- The places and curation code is carefully written, and it is unusually explicit about *why*.
- Its geo core is well tested.
- It models "unknown" honestly throughout.
- Its weaknesses are **reachability and data**, not code quality: tested distance code that nothing routes to, a guest projection that drops coordinates, no production writer for coordinates, hours or price, and two stance systems running side by side.

**Whole repo, carried forward from `76d190d`.** A well-built backend with a small number of sharp gaps.

## Focused Test Inventory (verified by file name and test title at `ce69629`; not executed)

| Test file | Tests | Covers |
|---|---|---|
| `tests/unit/geo.test.ts` | 13 | Haversine, bounding box at every bearing, poles, coordinate validation |
| `tests/unit/poiPlaces.test.ts` | 27 | `nearby` nearest first, unlocated places excluded, truncation, `nearProperty` returning `located:false` |
| `tests/integration/places.pg.test.ts` | 14 | Half a coordinate refused by Postgres; `nearby` excludes far, suppressed and unlocated places |
| `tests/unit/guestContext.test.ts` | 23 | Hours by day with explicit closure (`:202`), seasonal rules (`:241`), featured before listed with hidden and offered never shown (`:399`), a favourite with no listing counted as featured (`:426`), category attachment (`:625-651`) |
| `tests/unit/poiCategories.test.ts` | 7 | Category-level and exact resolution |
| `tests/integration/guestContext.pg.test.ts` | 11 | Hours, features, fit and profile read (`:192`) |
| `tests/bdd/guest-context.test.ts` | 8 | Guest context scenarios |
| `tests/bdd/host-content.test.ts` | 13 | Host content scenarios |

**Gaps for the intent:**
- **No code and no test evaluates "open now"** or "open on a given date".
- **`closesNextDay` is only passed through.** No test exercises what it means: a span across midnight.
- **No test filters by price,** and none covers the `priceLevel = 0` case against the 1–4 documentation.
- **No endpoint-level distance test,** because no endpoint exposes distance.
- **Host-added places resolving to category "Other"** is an inference from the resolver and is untested.

**Coverage configuration** (skimmed at `ce69629`): `vitest.config.ts` includes `src/**/*.ts`, excludes `server.ts`, `db/prismaClient.ts`, `wiring.ts` and `jobs/**`, and sets `thresholds.lines: 80`. Whether the current source meets the floor was **not measured** in this run.

## Measured Results *(carried forward from the `40c8aed` measurement; historical)*

| Suite | Result then |
|---|---|
| u1 | 39 files and 137 tests passed, 1 skipped; lines 91.15 %, branches 76.53 % |
| u2 | 15 files and 49 tests passed |

These numbers predate the `guestcontext`, `destination`, `hostnote`, `property` and `jobs` modules and every migration after the initial one. Re-run the suites before citing any coverage figure for the current code.

## Linting, Formatting, CI/CD and Security *(carried forward from `76d190d`, not re-verified)*

**Linting and formatting.**
- ESLint uses `eslint:recommended`, `@typescript-eslint/recommended` and `prettier`.
- **No type-aware linting** (`parserOptions.project: false`). The developer re-noted this at `ce69629` from `team.md`; the config was not re-read.
- Prettier's `format:check` is blocking.

**CI chain at `76d190d`.** Every step was blocking: lint, format, typecheck distinct from build, build, migrate, coverage (80 %), `npm audit`, gitleaks, Semgrep, CDK synth and Checkov.
- Staging deploy and post-deploy tests were `echo` placeholders.
- Production deploy was real and gated on a required reviewer.
- A second workflow, `load-locality-content.yml`, now exists; only its name was observed.

**Security.**
- No hardcoded secrets.
- pino redaction was in place.
- Uniform failure responses on authentication and stay links.

The focused scan adds that **the guest payload now carries `wifi.password`**. The code comment states the response "must never be logged". The pino redaction list recorded at `76d190d` names `password` at field level; whether that list covers a nested `property.wifi.password` in a logged response body was **not verified**.

## Documentation Quality

- **Verified at `ce69629`.** The analyzed modules carry detailed, decision-level comments that cite business rules and acceptance criteria (BR8.x, AC4.1.1, AC1.9.5). `docs/frontend-contract-delta.md` is a hand-kept contract.
- **Contract drift, verified.** The hand-kept contract already disagrees with the schema on the price scale (TD-22). This is the drift risk `team.md` names for hand-written contracts.
- **Still absent.** There is no OpenAPI document.

---

## Technical Debt Register

Prior IDs keep their numbers so references stay stable. TD-1 to TD-19 come from the `76d190d` scan and are carried forward unless marked otherwise. TD-20 onward are new from the focused scan at `ce69629`.

### New at `ce69629` (the places-filters area; verified)

| ID | Signal | Impact on intent `260927-places-filters` |
|---|---|---|
| **TD-20** | **Place coordinates exist in the schema but not in production content or the guest payload.** `POI.latitude` and `longitude` are nullable, with the paired CHECK `pois_geo_paired` (`schema.prisma:426-439`; migration `20260918000000_poi_event_location_and_host_notes`, lines 260-282). The sources are all uncoordinated: the Traumeri import adds 19 POIs without coordinates (`migrations/20260912000000_import_traumeri_guidebook/migration.sql:34-142`); the production loader's `LocalityPOI` type has no coordinate field and adds 5 Sedona places (`prisma/localityContent/sedona.ts:11-16`); host-added places cannot have coordinates (`guestcontext/repository.ts:205-210`, `:556-573`). Only dev seed data has coordinates (`prisma/seedData.ts:167-283`). `toGuestPOI` drops them anyway (`guide/service.ts:231-254`). **0 of the 24 repository-defined places are located. The live count is unknown**; CSV ingest supports coordinates (`docs/csv-ingest-format.md:47`). | **Blocking** for distance and map |
| **TD-21** | **Hours and price have a schema and a guest projection, but nothing in the product writes them.** `PlaceHours` and `PlaceProfile` are only read in `src/` (`guestcontext/repository.ts:383-407`). `admin-api` has no writer. Only `prisma/seedBlueRidge.ts` writes them, and it is dev-sample only and refuses production (`:42-57, 110-116`). `sedona.ts:100` says "NO OPENING HOURS, NO PRICES". `docs/frontend-contract-delta.md:219` says "Nothing in this section is ingested by the product yet". | **Blocking** for open-now and price in production. These filters would render all "unknown". |
| **TD-22** | **The price-level scale is documented two ways.** The schema CHECK is 0–4 with 0 meaning free (`schema.prisma:1086, 1091-1092`). The guest type and the contract doc say 1–4 (`guestcontext/service.ts:101`, `docs/frontend-contract-delta.md:208`). `PlaceFeature free_entry` and the deprecated `POI.isFree` overlap with it. | The scale must be resolved before a price filter is specified. |
| **TD-23** | **Two stance systems run side by side.** Legacy `HostNote` drives `recommended` and ordering (`guide/service.ts:189-229, 377-406`). `PropertyListing.stance` drives `GuestPlace.stance`, filtering and sorting (`guestcontext/service.ts:417-422, 531-540`). The deprecated `GuideContent.favoritedPOIIds` is still the source of the guest set (`schema.prisma:333-334`; `guide/service.ts:378`). | "Host picks" has two candidate fields. Every guest-visible place is already a host choice. |
| **TD-24** | **Category has two precisions.** `POI.categoryId` points at `poi_categories` (created outside Prisma). Production places are labelled only at category level, through legacy text (`poiCategories.ts:163-166`). Host-added places use a closed vocabulary (`hostContent.ts:28-37`) that will probably resolve to `null`, which displays as "Other" (an inference from `:243-246`, untested). The `locality_category_counts` view counts legacy text and is unmodelled (`schema.prisma:578-581`). | Category groups may show "Other"; per-property counts must be computed from the payload. |
| **TD-25** | **Filtering and distance are not exposed server-side, and no timezone reaches the guest.** No read endpoint filters or sorts by category, hours, price or stance. `nearby` and `nearProperty` are unrouted (`poi/service.ts:97-99, 178-200, 257-261`). The owner catalogue is unpaginated with six fields (`poi/service.ts:219-227`; `poi/repository.ts:166-171`). The guest payload has no zone; `/v1/localities/current` omits it on purpose (`locality/routes.ts:29-31`). `hoursOf` evaluates against the stay window, not a date (`guestcontext/service.ts:505-529`). | Distance, map and open-now need backend API work. Client-side filtering is otherwise viable over a small, fully materialized set. |
| **TD-26** | **`browseByLocality` has a latent bug.** It calls `listByLocality`, which filters `status: 'published'` (`poi/repository.ts:166-171`), while the interface doc says the owner list "stays unfiltered" so that hosts can see suppressed rows (`:116-123`). | The host places panel may hide rows the design intends hosts to see. |
| **TD-27** | **Minor.** The bounding-box antimeridian clamp is a documented limit (`geo.ts:57-59`). `PlaceHours.opens` and `closes` have no `HH:MM` format CHECK or validation. `Property.timezone` has no writer in `src/`; only an out-of-band geocode path would set it (`schema.prisma:230-233`). | Open-now logic must tolerate malformed time strings. Zone resolution will usually fall to the locality or UTC. |

### Carried forward from `76d190d`, with status updates where the focused scan or architect spot-checks reached

| ID | Signal (at `76d190d`) | Status at `ce69629` |
|---|---|---|
| TD-1 | CORS merged; an `origin/HEAD` branch-hygiene issue | Not re-verified |
| TD-2 | Chat has no LLM vendor | Not re-verified |
| TD-3 | No machine-readable API contract | **Still true.** `docs/frontend-contract-delta.md` is hand-kept and already drifting (TD-22). |
| TD-4 | PDF import is client-side only | Not re-verified |
| TD-5 | Reset tokens are discarded | Not re-verified |
| TD-6 | `PATCH /v1/subscriptions` cancels on an unknown action; no GET | Not re-verified |
| TD-7 | `visualStyling` is an unschematized blob | Still `Record<string, unknown> \| null` in the guest payload (spot-check) |
| TD-8 | No correlation id in the error envelope | Not re-verified |
| TD-9 | The rate-limit `preHandler` is untested and uses string path matching | The path matching is still present at `src/app.ts:206` (grep); tests were not re-checked |
| TD-10 | `POST /v1/guides/:id/favorites` returns 500 on a missing body | **Resolved.** The handler now uses `request.body ?? {}` with a comment recording the fix (`guide/routes.ts:69-72`, spot-check). |
| TD-11 | Three Node majors | Not re-verified |
| TD-12 | Per-process refresh-token and rate-limit stores | Not re-verified |
| TD-13 | Staging bypassed in the real deploy path | Not re-verified |
| TD-14 | RDS deletion protection | Resolved at `76d190d` |
| TD-15 | No Route 53 record | Not re-verified |
| TD-16 | u2 CDK stack not deployable | Not re-verified |
| TD-17 | No type-aware linting | Believed unchanged; the config was not re-read |
| TD-18 | Untracked build artifacts on disk | Cosmetic; not re-verified |
| TD-19 | No endpoint creates a `Stay` | **Resolved.** `POST`, `GET`, `PATCH` and `DELETE /v1/stays` exist (`src/guestaccess/routes.ts:53-186`, spot-check within an analyzed path). |

## What a Places-Filters Design Should Preserve

- **Honest absence.** Null means unknown. Every filter needs an "unknown" state, never a coerced default.
- **Stay-scoped guest data.** Events are per stay; places are per host. Stance hides silently.
- **Tested geo helpers.** Reuse `poi/geo.ts` or route `nearProperty`; do not reimplement distance.
- **The database-enforced coordinate pairing.** Any new writer must satisfy it.
