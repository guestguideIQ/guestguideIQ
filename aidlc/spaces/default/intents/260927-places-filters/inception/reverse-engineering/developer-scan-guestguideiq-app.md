# Developer Code Scan: guestguideiq-app (focused, intent 260927-places-filters)

Source: `guestguideiq-app` at HEAD `ce69629` ("Migrate on the exact image that ships, and check it"), clean working tree. Scan breadth: FOCUSED. The existing CodeKB at `aidlc/spaces/default/codekb/guestguideiq-app/` is STALE and was not relied on; every claim below was checked against source. All paths are repo-relative to `guestguideiq-app/`.

## Developer Code Scan Results

### Scan Coverage
- **Analyzed deeply**:
  - `prisma/schema.prisma`
  - `src/poi/`
  - `src/guide/`
  - `src/guestcontext/`
  - `src/destination/`
  - `src/locality/`
  - `src/guestaccess/`
- **Skimmed only** (integration points, not deeply analyzed):
  - `src/app.ts`, `src/config.ts`, `src/wiring.ts`, `src/internal/routes.ts` (route registration, config keys, CSP search)
  - `src/onboarding/propertyDetails.ts`, `src/onboarding/service.ts` (who writes property coordinates)
  - `src/lib/dayBoundary.ts` (`endOfDayInZone`)
  - `admin-api/src/` (directory level: whether it writes coordinates, hours or price)
  - `prisma/migrations/` (the Traumeri import, the POI location migration, the category backfill)
  - `prisma/seed.ts`, `prisma/seedData.ts`, `prisma/seedBlueRidge.ts`, `prisma/seedLocalityContent.ts`, `prisma/localityContent/sedona.ts` (what content exists and where it comes from)
  - `docs/frontend-contract-delta.md`, `docs/csv-ingest-format.md` (published contract notes)
  - `tests/` (file names and test titles only), `vitest.config.ts`, `.github/workflows/` (names only)

### Packages Found
- `guestguideiq-app` (root) — service — TypeScript (Fastify 5, Prisma 5) — the guest and owner API, including every endpoint in scope
- `admin-api/` — service — TypeScript — separate internal/ops API. Skimmed only. Its `poi/routes.ts` does not handle coordinates, hours or price.

### Build System
- **Type**: npm + `tsc` (`tsconfig.build.json`); Prisma for schema and migrations
- **Config Files**: `package.json`, `tsconfig.json`, `tsconfig.build.json`, `prisma/schema.prisma`, `vitest.config.ts`, `Dockerfile`
- **Build Dependencies**: `admin-api` is a separate package with its own `package.json`. The root does not import it.

### APIs Discovered
The API is REST (Fastify). The endpoints this intent uses are listed below.

**Guest (stay-token auth)**
- `GET /v1/stays/:token` (`src/guestaccess/routes.ts:188-298`). This is the guest's only read, and the Places tab is served inside it.
  - Response `property.geo` is `{ latitude, longitude } | null` (`routes.ts:257-260`). The property's own coordinates **do** reach the guest.
  - Response `guide.favoritedPOIs[]` is `GuestPlace` (`src/guestcontext/service.ts:81-114`), built from `GuestPOIView` (`src/guide/service.ts:29-73`). Fields relevant to this intent:
    - `category` (legacy free text), `categoryId`, and `poiCategory { id, category, subcategory, slug, icon, sortOrder, imageUrl } | null` (`poiCategories.ts:168-176`)
    - `stance: 'featured' | 'listed'` (`service.ts:82`)
    - `recommended: boolean` (legacy HostNote stance, `guide/service.ts:72`)
    - `tier`, `placeGroup`, `hostAdded`, `address`, `neighborhood`
    - `hours: { days[{ dayOfWeek, closed, spans[{ opens, closes, closesNextDay }] }], seasonal } | null` (`service.ts:53-62`)
    - `profile: { setting, priceLevel, typicalMinutes, effort } | null` (`service.ts:99-105`)
  - **No `latitude`/`longitude` on any place.** `toGuestPOI` (`guide/service.ts:231-254`) does not project them, and `enrichGuestGuide` spreads that view (`guestcontext/service.ts:543-544`).
  - **No timezone** anywhere in the payload (`routes.ts:211-295`).
  - **No distance** on any place.
- `POST /v1/stays/:token/feedback` (`guestcontext/routes.ts:144-150`). Not in scope.

**Owner (JWT + ownership)**
- `GET /v1/pois?propertyId=` (`src/poi/routes.ts:158-192`). This is the host's place picker and catalogue for the property's locality.
  - Items are projected to `{ id, name, description, category, localityIds, address }` (`poi/service.ts:219-227`), plus `hostAdded` (`poi/routes.ts:185-189`).
  - It returns **no coordinates, categoryId, hours, price or stance**.
- `GET /v1/properties/:id/listings` (`guestcontext/routes.ts:44-50`) returns `[{ kind, id, stance, hostNote, rank, feedback{ up, down, saved } }]` (`guestcontext/service.ts:185-193`). The client must join it to `/v1/pois` by id.
- `PATCH /v1/properties/:id/listings/:places|events/:itemId` sets `stance` and `hostNote` (`guestcontext/routes.ts:52-72`; validation at `service.ts:761-820`).
- `GET /v1/properties/:id/area` returns `area { name, kind, stateCode, timezone }` plus themes, audiences, notes and advisories (`guestcontext/service.ts:693-740`). This is the only response that carries a timezone, and it is the Area's zone.
- `GET /v1/guides/:id` returns `favoritedPOIIds` (`guide/routes.ts:22-29`).
- `POST|DELETE /v1/guides/:id/favorites` picks or unpicks a place. It dual-writes a `PropertyListing` with stance `featured` (`guide/routes.ts:65-96`; `guestcontext/service.ts:822-836`).
- `POST|PATCH|DELETE /v1/properties/:id/places[/:placeId]` adds, edits or removes a host's own place (`guestcontext/routes.ts:76-109`). Body is `{ name, description, category, address }`. There are no coordinates.
- `PATCH /v1/properties/:id` sets the property `latitude`/`longitude`. They must be set or cleared together (`src/onboarding/propertyDetails.ts:148-195`; `docs/frontend-contract-delta.md:135-136`).

**Public**
- `GET /v1/localities/current` (`src/locality/routes.ts:21-38`). It deliberately omits `timezone` (`:29-31`).

**Not exposed**
- `POIService.nearby` / `nearProperty` (`src/poi/service.ts:97-99, 178-200, 257-261`) implement radius search with distance and sort nearest first. No route calls them. A grep of `src/` for `nearProperty` or `.nearby(` outside `src/poi/` finds nothing.

### Frameworks & Libraries
- fastify — ^5.12.3 — HTTP server
- @fastify/cors — ^11.3.0 — CORS
- @prisma/client / prisma — ^5.18.0 — ORM and migrations (PostgreSQL on RDS; no PostGIS, `schema.prisma:433-437`)
- vitest — ^5.0.0 — tests and coverage
- typescript — ^5.5.4

### Test Coverage
- **Test Directories**: `tests/unit/`, `tests/bdd/`, `tests/integration/` (`*.pg.test.ts`, real Postgres), `tests/doubles/`, `tests/factories/`, `tests/helpers/`
- **Test Frameworks**: vitest
- **Coverage Config**: present. `vitest.config.ts` includes `src/**/*.ts`, excludes `server.ts`, `db/prismaClient.ts`, `wiring.ts` and `jobs/**`, and sets `thresholds.lines: 80`.
- **Tests for this intent's areas**:
  - `tests/unit/geo.test.ts` (13 tests): haversine, bounding box at every bearing, poles, coordinate validation
  - `tests/unit/poiPlaces.test.ts` (27): nearby nearest-first, unlocated places excluded, truncation, `nearProperty` with `located:false`
  - `tests/integration/places.pg.test.ts` (14): half a coordinate refused by the database; nearby excludes far, suppressed and unlocated places
  - `tests/unit/guestContext.test.ts` (23): hours by day with explicit closure (`:202`), seasonal hours rules (`:241`), featured before listed and hidden/offered never shown (`:399`), favourite without a listing treated as featured (`:426`), category attachment (`:625-651`)
  - `tests/unit/poiCategories.test.ts` (7): category-level and exact resolution
  - `tests/integration/guestContext.pg.test.ts` (11): hours, features, fit and profile read (`:192`)
  - `tests/bdd/guest-context.test.ts` (8), `tests/bdd/host-content.test.ts` (13)
- **Gaps**:
  - No test and no code evaluate "open now" (see Technical Debt).
  - No test covers the `closesNextDay` semantics beyond passing the flag through.
  - No test filters by price.
  - No endpoint-level test covers distance, because no endpoint exposes it.

### Code Quality Indicators
- **Linting**: ESLint (`.eslintrc.cjs`) and Prettier (`.prettierrc`). Type-aware linting is off (`parserOptions.project: false`, per `team.md`; not re-read here).
- **CI/CD**: `.github/workflows/ci.yml` and `.github/workflows/load-locality-content.yml`. The second is a manual loader that runs `prisma/seedLocalityContent.ts` as a one-off ECS task using OIDC.
- **Documentation**: very strong "why" comments throughout the scanned modules. `docs/frontend-contract-delta.md` is the hand-kept API contract. There is no OpenAPI document.

### Technical Debt Signals

**1. Place coordinates exist in the schema but not in production content or the guest payload.**
- `POI.latitude/longitude` are nullable. The `pois_geo_paired` CHECK requires both or neither (`schema.prisma:426-439`; migration `20260918000000_poi_event_location_and_host_notes` lines 260-282).
- Curated places from repository sources carry no coordinates. The Traumeri import inserts 19 POIs with only `id, name, description, category, localityIds, createdAt` (`prisma/migrations/20260912000000_import_traumeri_guidebook/migration.sql:34-142`). The production loader's `LocalityPOI` type has no coordinate field (`prisma/localityContent/sedona.ts:11-16`) and adds 5 more Sedona places. No migration backfills POI coordinates.
- Host-added places also have none: `HostPlaceFields` is `{ name, description, category, address }` (`src/guestcontext/repository.ts:205-210`; `createHostPlace` at `:556-573`).
- Only dev sample data has coordinates (`prisma/seedData.ts:167-283`, run by `seed.ts`, which refuses production).
- **So all 24 Sedona catalogue places defined in the repository lack coordinates.** The live count needs a query against production, because CSV or manual ingest may have added rows. The CSV format supports coordinates (`docs/csv-ingest-format.md:47`).

**2. Hours and price have a schema and a guest projection, but nothing in the product writes them.**
- `PlaceHours` and `PlaceProfile` are only read in `src/` (`guestcontext/repository.ts:383-407`). `admin-api/src` has no writer.
- Only `prisma/seedBlueRidge.ts` writes them, and it is `dev-sample`, refusing production (`:42-57`, `:110-116`).
- The Sedona content file says "NO OPENING HOURS, NO PRICES" (`localityContent/sedona.ts:100`).
- The contract doc confirms "Nothing in this section is ingested by the product yet" (`docs/frontend-contract-delta.md:219`).

**3. The price-level scale is documented two ways.**
- The schema says `0 free, 1 $, 2 $$, 3 $$$, 4 $$$$`, and a CHECK allows 0–4 (`schema.prisma:1086, 1091-1092`).
- The guest type comment says "1 (cheap) to 4 (splurge)" (`guestcontext/service.ts:101`), and the contract doc says `priceLevel 1–4` (`docs/frontend-contract-delta.md:208`).
- A price filter has to decide how 0 (free) displays. `PlaceFeature free_entry` and the deprecated `POI.isFree` overlap with it.

**4. Two stance systems run side by side.**
- Legacy `HostNote` (`recommended` / `not_recommended`) drives `GuestPOIView.recommended` and ordering in `guide/service.ts:189-229, 377-406`.
- `PropertyListing.stance` (`offered | featured | listed | hidden`, `schema.prisma:787-792, 939-963`) drives `GuestPlace.stance` and re-filters and re-sorts in `guestcontext/service.ts:417-422, 531-540`.
- `GuideContent.favoritedPOIIds` is DEPRECATED but still the source of the guest place set (`schema.prisma:333-334`; `guide/service.ts:378`).
- A "host picks" filter has two candidate fields today, `stance === 'featured'` and `recommended`.

**5. Category has two precisions.**
- `POI.categoryId` points at `poi_categories`, which was created outside Prisma (`schema.prisma:546-551, 566-600`).
- Production places are labelled only at category level through legacy text (`poiCategories.ts:163-166`).
- Host-added places use a different, closed vocabulary (`food`, `outdoors`, … in `hostContent.ts:28-37`). Those labels will not match `poi_categories` top-level names, so these places resolve to `poiCategory: null` and appear under "Other". This is an inference from the resolver logic at `poiCategories.ts:243-246`; it is not tested.
- The materialized view `locality_category_counts` counts over the legacy `pois.category` and is unmodelled (`schema.prisma:578-581`). It is not usable for the per-property counts the collapsible categories need.

**6. Server-side filtering is limited.**
- No filtering or sorting by category, hours, price or stance exists on any read endpoint.
- The guest set is small (the host's picks) and fully materialized in one payload.
- The owner catalogue is unpaginated (`poi/repository.ts:166-171`).

**7. `browseByLocality` has a latent bug.** It calls `listByLocality`, which filters `status: 'published'` (`poi/repository.ts:166-171`), while the interface doc says the owner list "stays unfiltered" so hosts can see suppressed rows (`:116-123`). The code and the comment disagree.

**8. Minor.**
- The bounding-box antimeridian clamp is a known limit, documented at `geo.ts:57-59`.
- There is no `@db.VarChar(5)` format CHECK on `PlaceHours.opens/closes`, and nothing validates the `HH:MM` string.
- `Property.timezone` has no writer in `src/`. Onboarding does not set it; only the out-of-band geocode path described at `schema.prisma:230-233` would.

## Answers to the Intent's Questions

### 1. The place data model

| Concern | Where | Detail |
|---|---|---|
| Coordinates | `POI.latitude/longitude Float?` (`schema.prisma:438-439`) | WGS84. Paired-or-absent CHECK and range CHECKs; `@@index([latitude, longitude])` (`:557`). |
| Coordinate coverage | See Technical Debt 1 | 0 of 24 repository-defined Sedona places have them; host-added places cannot have them. The production count is unknown and needs a DB query. |
| Category | `POI.categoryId` → `PoiCategory { category, subcategory, slug, icon, sortOrder, imageKey }` (`:583-600`) | Legacy `POI.category` text is still the production label. Guest resolution is in `src/guestcontext/poiCategories.ts:194-247`. |
| Opening hours | `PlaceHours` (`:971-990`) | `dayOfWeek` (0 = Sunday), `opens`/`closes` `HH:MM` strings, `closesNextDay` ("opens 20:00, closes 02:00"), `isClosed`, `validFrom`/`validUntil` dates. No row means unknown. Multiple spans per day are allowed. |
| Hours projection | `hoursOf` (`guestcontext/service.ts:505-529`) | Keeps only rules whose validity window touches the **stay** (not today), groups by day, and marks `seasonal`. |
| Price level | `PlaceProfile.priceLevel Int? SmallInt`, CHECK 0–4 (`:1086-1101`) | One-to-one and curated. No row or NULL means unknown. |
| Host curation | `PropertyListing { stance, hostNote, rank, addedBy }` (`:939-963`); `CurationStance` (`:787-792`) | `featured` = host pick or promoted; `listed` = available; `hidden` and `offered` never reach the guest. A favourite with no listing is treated as `featured` (`guestcontext/service.ts:416-422`). |
| Other curation fields | `POI.tier` (`classic` / `local_favorite` / `hidden_gem`), `POI.placeGroup` (`:524-529, 765-778`) | Legacy `HostNote.recommended` also still exists (see Technical Debt 4). |
| Property coordinates | `Property.latitude/longitude Float?`, paired CHECK (`:163-166`) | Owners set them via `PATCH /v1/properties/:id`. They reach the guest as `property.geo`. Also on `Property`: `geocodeQuality` and `geocodedAt` (`:237-240`). |

### 2. Endpoints, parameters and shapes
- **Guest Places tab**: `GET /v1/stays/:token`, in `guide.favoritedPOIs`. It has no query parameters. Places are pre-sorted featured first, then `rank`, then pick order (`guestcontext/service.ts:531-540`).
- **Host area and places panel**: `GET /v1/pois?propertyId=`, which gives the thin projection, joined to `GET /v1/properties/:id/listings` for stance, plus `GET /v1/properties/:id/area`.
- **Existing distance machinery**: `src/poi/geo.ts` provides `haversineMeters` (`:38-47`), `boundingBox` (`:61-82`) and `isValidLatLng` (`:85-94`). `POIService.nearby` does a two-stage box-then-haversine search, sorted before it is cut (`poi/service.ts:178-200`), with a 200 km maximum radius and a limit of 100 by default and 500 at most (`:108-110`). `nearProperty` returns `located:false` when the property has no coordinates (`:257-261`). `destination/service.ts:303-319` uses haversine for area containment. `event/service.ts:322-330` uses the same helpers for events.
- **Nothing computes distance for a guide or listing response today.**

### 3. Timezone for "open now"
There are three zone fields, and none of them reaches the guest.
- `LocalityEntity.timezone` (default `"UTC"`, `schema.prisma:1505`)
- `Property.timezone` (nullable IANA, "Stay expiry and 'today' use it", `:230-233`)
- `Area.timezone` (required, `:1118`)

The established resolution order is locality, then property, then UTC (`guestaccess/repository.ts:130`), used by `endOfDayInZone` (`src/lib/dayBoundary.ts:99`) for stay expiry.

The guest payload carries no zone. `/v1/localities/current` omits it on purpose (`locality/routes.ts:29-31`). The owner area view exposes only `area.timezone`.

"Open now" therefore needs one of two things: the backend adds a resolved zone (or an `openNow` flag) to the stay payload, or the client uses the device clock, which is wrong for a guest planning from another zone. There is also a semantic gap: `hoursOf` filters rules against the stay window, not "today", so a rule that is valid only on some days of the stay is still returned.

### 4. Google Maps view
- The backend has no map key or map config. `src/config.ts` has only Google OAuth keys, `:26-45`.
- There is no CSP or helmet in `src/app.ts`. Security headers belong to the frontend host (see `team.md` Deployment).
- The property coordinates are exposed to the guest, so the map can be centred. Place coordinates are **not** exposed, so a map cannot plot curated places without a backend change, and today there is no data to plot (Technical Debt 1).
- `POI.address` is exposed and could be geocoded, but that is exactly the "never guess, geocode quality visible" concern the schema raises (`:237-239`).
- Licence note: OSM-sourced rows carry `attribution`, which is already in `GuestPOIView` (`guide/service.ts:57`). Map attribution rendering has to keep it.

### 5. Tests and debt
See Test Coverage and Technical Debt Signals above.

## Handoff Summary
- **Intent-relevant finding**: The schema supports every requested filter (`POI.latitude/longitude`, `PoiCategory`, `PlaceHours` with `closesNextDay` and validity, `PlaceProfile.priceLevel`, `PropertyListing.stance`), and a tested haversine and nearby service exists (`src/poi/geo.ts`, `src/poi/service.ts:178-261`). The API and the data do not yet deliver it:
  - The guest place projection omits coordinates (`src/guide/service.ts:231-254`).
  - No endpoint exposes distance, because `nearby` and `nearProperty` are unrouted.
  - The owner `GET /v1/pois` returns only 6 fields (`src/poi/service.ts:219-227`).
  - No timezone reaches any client except the owner's `area.timezone`.
  - No production path writes place coordinates, hours or price. All 24 repository-defined Sedona places lack coordinates (`prisma/migrations/20260912000000_import_traumeri_guidebook/migration.sql:34-142`; `prisma/localityContent/sedona.ts:11-16, 100`), and `docs/frontend-contract-delta.md:219` states hours and profiles are not ingested.
- **Risks / follow-up**:
  1. **Backend follow-up.** Distance, map, open-now, price and host filters need a backend change first: add `latitude/longitude` (and/or `distanceMeters`) to the guest place view and a richer owner catalogue projection, and expose a resolved timezone or a server-computed `openNow`. This repeats the pattern from the frontend intent, where backend follow-ups grew; surface the running total.
  2. **Data gap.** A production DB query is needed before requirements: count published places with coordinates, `PlaceHours` rows and `PlaceProfile.priceLevel` values. If these are near zero, the filters render empty. Requirements must define the "unknown" state (no coordinates, no hours, no price) and decide whether a producer (ingest, geocoding, host entry) is in scope.
  3. **Price scale.** Resolve 0–4 (schema) against 1–4 (guest docs) before the price filter is specced.
  4. **Host picks.** Choose `stance === 'featured'`, not the legacy `recommended`, or state why. Note that every guest-visible place is already host-picked (`featured` or `listed`).
  5. **Host-added places.** They can have no coordinates and likely fall under "Other" for category. Either extend `addPlace` or accept this.
  6. **Hours semantics.** "Open now" and "open on a selected day" must handle `closesNextDay`, multiple spans, `isClosed`, and validity windows evaluated against the chosen date rather than the stay window that `hoursOf` uses.
  7. **Map.** The Google Maps key lives only in the frontend (public, domain-restricted); no backend CSP or config exists.
