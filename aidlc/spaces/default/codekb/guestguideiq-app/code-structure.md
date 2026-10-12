# Code Structure — `guestguideiq-app`

**Derived from** two passes:
- The **focused scan of 2026-09-30** at `ce69629`, which covered `prisma/schema.prisma`, `src/poi/`, `src/guide/`, `src/guestcontext/`, `src/destination/`, `src/locality/` and `src/guestaccess/`.
- The **prior full scan** at `76d190d`, preserved elsewhere and marked *(carried forward, not re-verified)*.

Component responsibilities are in `component-inventory.md`, and dependency relationships are in `dependencies.md`.

---

## Repository Layout

What changed since `76d190d` is marked **[new]**. Entries in analyzed paths are verified at `ce69629`; everything else is a directory listing or is carried forward.

```
guestguideiq-app/
├── package.json  tsconfig*.json  vitest.config.ts  .eslintrc.cjs  .prettierrc  Dockerfile   (carried forward)
├── .github/workflows/
│   ├── ci.yml
│   └── load-locality-content.yml      [new] manual OIDC ECS task running prisma/seedLocalityContent.ts
├── docs/                              [new, skimmed]
│   ├── frontend-contract-delta.md     hand-kept API contract (no OpenAPI)
│   └── csv-ingest-format.md           CSV ingest supports POI coordinates (:47)
├── prisma/
│   ├── schema.prisma                  32 models at ce69629 (count only; place/curation models analyzed)
│   ├── migrations/                    16 directories at ce69629 (was 1)
│   ├── seed.ts  seedData.ts           dev sample; the only source of POI coordinates; refuses production
│   ├── seedBlueRidge.ts               dev sample; the only writer of PlaceHours/PlaceProfile; refuses production
│   ├── seedLocalityContent.ts         production content loader
│   └── localityContent/sedona.ts      5 Sedona places, LocalityPOI type has no coordinates; "NO OPENING HOURS, NO PRICES" (:100)
├── src/
│   ├── app.ts  config.ts  wiring.ts  server.ts  internalApp.ts   (skimmed / carried forward)
│   ├── poi/          repository.ts service.ts routes.ts geo.ts propertyCoordinates.ts
│   ├── guide/        repository.ts service.ts routes.ts propertyLookup.ts
│   ├── guestcontext/ [new] repository.ts service.ts routes.ts poiCategories.ts hostContent.ts
│   ├── destination/  [new] repository.ts service.ts themes.ts   (no routes.ts)
│   ├── locality/     repository.ts service.ts routes.ts domainCache.ts tenantHost.ts
│   ├── guestaccess/  repository.ts service.ts routes.ts link.ts
│   ├── hostnote/     [new, not analyzed] repository.ts
│   ├── property/     [new, not analyzed] ownership.ts routes.ts service.ts
│   ├── jobs/         [new, not analyzed] expireEvents.ts
│   ├── lib/dayBoundary.ts             endOfDayInZone (skimmed)
│   └── identity/ onboarding/ event/ subscription/ chatmodule/ leadcapture/ auth/ ratelimit/ chat/ db/ internal/   (carried forward)
├── tests/            unit/ bdd/ integration/ (*.pg.test.ts against real Postgres) doubles/ factories/ helpers/
├── infra/            u1 CDK app (carried forward)
└── admin-api/        independent sibling project (carried forward; poi/routes.ts skimmed)
```

## The Module Pattern

The prior scan's **triad** still holds for the analyzed modules: `repository.ts` holds the port plus the Prisma adapter, `service.ts` holds the rules, and `routes.ts` holds the HTTP layer. `wiring.ts` is still the composition root; it was skimmed at `ce69629`. Three refinements were observed:

- **Pure helpers sit beside the triad.**
  - `poi/geo.ts`: `haversineMeters` (`:38-47`), `boundingBox` (`:61-82`) and `isValidLatLng` (`:85-94`). These are pure functions with their own unit tests, and `destination/service.ts` and `event/service.ts` reuse them.
  - `guestcontext/poiCategories.ts`: category resolution (`:194-247`).
  - `guestcontext/hostContent.ts`: the host-place vocabulary (`:28-37`).
- **Service-only modules.** `destination/` has no routes. It supplies area containment and themes to `guestcontext`.
- **Cross-module routes.** `guestcontext/routes.ts` serves routes under `/v1/properties/:id/...` (listings, host places, area) and `/v1/stays/:token/feedback`. Its URL space overlaps the `property/` module and the `guestaccess/` module. Ownership lives by capability, not by URL prefix.

## Where Place Data Is Projected

The chain matters because every new guest-facing field has to be added at the right step.

| Step | Code | What it adds or drops |
|---|---|---|
| Row → `GuestPOIView` | `toGuestPOI`, `src/guide/service.ts:231-254` | **Drops `latitude` and `longitude`.** Adds `categoryId`, `tier`, `placeGroup`, `address`, `attribution`, `hostAdded` and `recommended` (legacy HostNote). |
| Guest set selection | `src/guide/service.ts:378` | Sourced from the deprecated `GuideContent.favoritedPOIIds`. |
| `GuestPOIView` → `GuestPlace` | `enrichGuestGuide`, `src/guestcontext/service.ts:408`, with the spread at `:543-544` | Adds `stance`, `hostNote`, `hours` (through `hoursOf`, `:505-529`), `features`, `fit`, `profile`, `tips`, `media`, `poiCategory`, `advisoryIds` and `myFeedback`. Filters stance and re-sorts (`:417-422, 531-540`). |
| Response assembly | `src/guestaccess/routes.ts:188-298` | Wraps the result with `stay`, `property` (including `geo`) and `locality`. Adds no timezone. |
| Owner catalogue | `src/poi/service.ts:219-227`, `src/poi/routes.ts:158-192` | Six fields plus `hostAdded`. |

## Naming Conventions *(carried forward; consistent with the analyzed modules)*

- Files are `camelCase.ts`, named after what they export.
- Directories are single lowercase words. The new `guestcontext` continues the unseparated compound style (`guestaccess`, `chatmodule`) that `team.md` calls a wart not to repeat in the frontend.
- Types are `PascalCase`, for example `GuestPOIView`, `GuestPlace`, `GuestHours`, `OwnerListing` and `OwnerAreaView`.

## Code Patterns Observed

- **Explaining comments at every non-obvious decision** (verified at `ce69629`). The analyzed modules state *why* at length. Examples:
  - why `expiresAt` is withheld from the guest;
  - why owner stay routes key on the stay id, not the token;
  - why `propertyId` became required on `POST /v1/stays`;
  - why events are per stay but places are per host.
  This discipline is the strongest carried-forward trait.
- **Null means "not stated", never a default.** This is encoded in the type comments of `GuestPOIView`, `GuestHours` (days with no rule are omitted, which means unknown) and the arrival facts in the stay payload.
- **Paired-or-absent coordinates are enforced by the database.** `pois_geo_paired` and the paired CHECK on `Property` mean half a coordinate is refused by Postgres (tested in `tests/integration/places.pg.test.ts`). `PATCH /v1/properties/:id` mirrors the rule at the API.
- **Empty requests are refused on PATCH.** A PATCH that names no known field returns `400` (`src/guestaccess/routes.ts:152-163`), so a mis-keyed update never looks like a success.
- **Unvalidated `HH:MM` strings.** `PlaceHours.opens` and `closes` have no format CHECK or parser (TD-27).
- *(Carried forward, not re-verified.)* The prior scan found no Fastify JSON schemas on public routes, zero TODO/FIXME markers and zero `@ts-ignore` comments.

## Test Code Organisation

- **Verified by name at `ce69629`:** `tests/unit/`, `tests/bdd/`, `tests/integration/` (`*.pg.test.ts` against real Postgres, which is new since the prior scan's fake-DB-only integration tier), `tests/doubles/`, `tests/factories/` and `tests/helpers/`.
- **Tests for the intent's area:** see `code-quality-assessment.md` § Focused Test Inventory.
