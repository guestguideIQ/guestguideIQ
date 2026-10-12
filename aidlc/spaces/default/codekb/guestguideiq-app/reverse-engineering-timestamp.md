# Reverse Engineering Timestamp — `guestguideiq-app`

## Run Record (current — focused merge)

| Field | Value |
|---|---|
| **Repo analyzed** | `guestguideiq-app`, the sibling of `aidlc/` at the workspace root (`C:\Projects\guestguideIQ\guestguideiq-app`) |
| **Reverse engineering performed** | 2026-09-30 |
| **Analysis commit** | `ce696291ac9493578dd356d189437b941199645d` ("Migrate on the exact image that ships, and check it", committed 2026-09-27). The working tree was clean. |
| **Source fingerprint at snapshot** | `git:49135e73b66e6e3474163f359e2e5db57cb52dd5`, over the seven analyzed paths below. The minted fingerprint matches it. |
| **Scan breadth** | **Focused scan.** The pre-scan snapshot paths were `prisma/schema.prisma`, `src/poi/`, `src/guide/`, `src/guestcontext/`, `src/destination/`, `src/locality/` and `src/guestaccess/`. |
| **Prior store verdict** | **STALE.** The previous store was a full scan at `76d190d` for intent `260907-frontend-app`, and its analyzed paths have changed since. The human chose **Focused scan** over Full rescan. |
| **Intent** | `260927-places-filters`: filters, distance, "open now", price and a map view for the guest Places tab, plus the host's places panel |
| **Pipeline** | Link 1 is the developer focused scan (`intents/260927-places-filters/inception/reverse-engineering/developer-scan-guestguideiq-app.md`). Link 2 is the architect synthesis (this run), merged into the existing store. |

## How This Store Was Merged

This is a **focused merge into a STALE store**. Per the stage rules:

- **Updated or extended from this run.** These sections are verified at `ce69629`: every section about places, POI categories, opening hours, price profiles, host curation (`PropertyListing` stance), the guest stay payload, the owner catalogue (`GET /v1/pois`), the owner stay-link supply side, timezone resolution, the geo helpers, and the data model in `prisma/schema.prisma`.
- **Preserved from the prior store.** Sections outside the scanned area describe the repository **as of `76d190d` (2026-09-07)**. They were not re-verified. The repository has changed a lot since then: the module list, the model count and the migration count have all grown. Each preserved section therefore carries a banner. The Scope of Analysis block below demotes the prior deep coverage to `shallow`.
- **Known-superseded prior claims are corrected in place, not silently kept.** The main ones are these:
  - "No endpoint creates a `Stay`" (old TD-19 and old A.9). **This is superseded:** `POST /v1/stays` exists at `src/guestaccess/routes.ts:53`.
  - "The guest cannot resolve favourited items". **This is superseded:** the guest payload now carries full `favoritedPOIs[]`.
  - "11 entities, one migration". **This is superseded:** the architect counted 32 `model` blocks and 16 migration directories at `ce69629`. That is a count only; the models outside the scanned area were not analyzed.
  - The old `GET /v1/pois` shape. **This is superseded:** the endpoint now takes `?propertyId=` and adds `address` and `hostAdded`.

## Verification Depth

**1. Analyzed deeply by the developer at `ce69629`:** `prisma/schema.prisma`, `src/poi/`, `src/guide/`, `src/guestcontext/`, `src/destination/`, `src/locality/` and `src/guestaccess/`. Every claim was checked against source; the developer did not rely on the stale store.

**2. Architect spot-checks at `ce69629`,** made inside the analyzed paths to correct superseded preserved prose:
- `src/guestaccess/routes.ts`, lines 1–300: the owner stay routes (`POST`, `GET`, `PATCH` and `DELETE /v1/stays`) and the full `GET /v1/stays/:token` response.
- The `GuestPOIView` type (`src/guide/service.ts`).
- The `GuestPlace`, `GuestHours`, `EnrichedGuestGuide`, `OwnerListing` and `OwnerAreaView` types (`src/guestcontext/service.ts`).

The architect also made three observations **outside** the analyzed paths. These are directory listings or counts only, not analysis:
- the `src/` directory listing (new modules `destination`, `guestcontext`, `hostnote`, `property` and `jobs`);
- the `prisma/migrations/` directory count (16);
- the `model` count in the schema (32).

**3. Skimmed by the developer,** as integration points only: `src/app.ts`, `src/config.ts`, `src/wiring.ts`, `src/internal/routes.ts`, `src/onboarding/propertyDetails.ts`, `src/onboarding/service.ts`, `src/lib/dayBoundary.ts`, `admin-api/src/` (at directory level), `prisma/migrations/`, the `prisma/seed*.ts` files, `prisma/localityContent/sedona.ts`, `docs/frontend-contract-delta.md`, `docs/csv-ingest-format.md`, `tests/` (file names and test titles only), `vitest.config.ts` and `.github/workflows/` (names only).

**4. Not executed in this run:** the test suites and coverage. The numbers in `code-quality-assessment.md` were measured at `40c8aed` and **no longer describe the current source**. The source has changed substantially since then, so treat them as historical.

**5. Carried forward from `76d190d` and not re-verified:** everything else. That covers authentication and tokens, CORS, onboarding, subscription, lead capture, chat, rate limiting, the internal API, `admin-api`, both CDK apps, CI/CD, Dockerfile and the dependency inventory.

## Freshness Caveat

- The backend is under active development. A merge that touches the seven analyzed paths invalidates this store's deep coverage; the rerun guard will then report STALE.
- **Production data was not queried.** Place coordinate coverage, `PlaceHours` row counts and `PlaceProfile.priceLevel` values in the live database are **unknown**. The claim "0 of 24 places have coordinates" covers the **repository-defined** Sedona catalogue only. Rows ingested by CSV or by hand may differ.

## Scope of Analysis

```yaml
scope_version: 1
kind: partial
intent: 260927-places-filters
fingerprint: 49135e73b66e6e3474163f359e2e5db57cb52dd5
analyzed:
  paths:
    - prisma/schema.prisma
    - src/poi/
    - src/guide/
    - src/guestcontext/
    - src/destination/
    - src/locality/
    - src/guestaccess/
  components:
    - persistence
    - poi
    - guide
    - guestcontext
    - destination
    - locality
    - guestaccess
shallow:
  paths:
    - ./
    - README.md
    - package.json
    - tsconfig.json
    - tsconfig.build.json
    - vitest.config.ts
    - .eslintrc.cjs
    - .prettierrc
    - .env.example
    - Dockerfile
    - docker-entrypoint.sh
    - .github/workflows/ci.yml
    - .github/workflows/
    - src/
    - src/app.ts
    - src/config.ts
    - src/wiring.ts
    - src/auth/
    - src/ratelimit/
    - src/lib/
    - src/lib/dayBoundary.ts
    - src/chat/
    - src/internal/
    - src/internal/routes.ts
    - src/identity/
    - src/onboarding/
    - src/onboarding/propertyDetails.ts
    - src/onboarding/service.ts
    - src/event/
    - src/subscription/
    - src/chatmodule/
    - src/leadcapture/
    - tests/
    - tests/integration/
    - tests/bdd/
    - tests/unit/
    - tests/doubles/
    - tests/factories/
    - tests/helpers/
    - infra/
    - docs/frontend-contract-delta.md
    - docs/csv-ingest-format.md
    - prisma/migrations/
    - prisma/seed.ts
    - prisma/seedData.ts
    - prisma/seedBlueRidge.ts
    - prisma/seedLocalityContent.ts
    - prisma/localityContent/sedona.ts
    - admin-api/
    - admin-api/README.md
    - admin-api/package.json
    - admin-api/.env.example
    - admin-api/vitest.config.ts
    - admin-api/src/
    - admin-api/src/app.ts
    - admin-api/src/auth/middleware.ts
    - admin-api/src/internal/
    - admin-api/src/poi/
    - admin-api/src/events/
    - admin-api/src/accounts/
    - admin-api/src/localities/
    - admin-api/tests/
    - admin-api/src/config.ts
    - admin-api/src/server.ts
    - admin-api/src/wiring.ts
    - admin-api/src/lib/
    - admin-api/src/auth/jwt.ts
    - admin-api/infra/
    - src/db/
    - src/auth/password.ts
    - src/auth/refreshTokenStore.ts
    - src/lib/ids.ts
```

`./` appears under `shallow.paths` only as the literal demotion of the prior store's full-repo deep coverage. That coverage can no longer be re-verified, so it is recorded here and not dropped. It does **not** claim that the whole repository was skimmed in this run.
