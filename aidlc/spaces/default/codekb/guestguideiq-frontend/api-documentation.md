# API Documentation — `guestguideiq-frontend`

This repo exposes no API. It consumes one external contract: the `guestguideiq-app` REST API. This document records how the frontend consumes it and what data it receives.

## Consumed API: the client boundary

- **Module**: `src/api/client.ts`, the only `fetch` call site (enforced by ESLint `no-restricted-globals`; overrides only for `src/api/**` and `src/session/**`).
- **Surface**: about 45 typed methods on the `ApiClient` interface. Each returns `Result<T>` and never throws.
- **Paths**: `src/api/contract/paths.ts`, about 40 path constants and builders (`ApiPaths`).
- **Base URL**: `VITE_API_BASE_URL` (public by design).
- **Tenancy**: the `X-Locality-Domain` header on tenant-scoped calls. In production the value is `window.location.host`; `VITE_LOCALITY_DOMAIN` overrides it in development only.
- **Auth**: bearer token from `SessionManager`; single-flight refresh on 401; replay registry for requests lost to an expired session (`api/replay.ts`).
- **Google sign-in (optional)**: `VITE_GOOGLE_CLIENT_ID`; when unset no Google button renders. The redirect URI is the page origin plus `/auth/google/callback`. Observed in `.env.example` only.

## Error envelope

`src/api/errors.ts` is the only module that reads an HTTP status. It parses `{ code, message, details? }` into a closed union of the backend's 11 codes, plus two frontend codes:

- `TRANSPORT_FAILURE`: network failure or a non-envelope response.
- `UNRECOGNISED`: an envelope with an unknown code.

## Contract provenance

`src/api/contract/PROVENANCE.md` records that the types are hand-transcribed from `guestguideiq-app`'s `api-documentation.md` and `docs/frontend-contract-delta.md`, each pinned by an LF-normalised sha256. Later additions (arrival facts, schema v2, `poiCategory` in delta §6d) were transcribed from backend source. There is no OpenAPI document and no generated client (ADR-006 open). **Any contract addition must update `entities.ts`, the client method and the `PROVENANCE.md` digest together.**

## Places-relevant calls

### Guest

| Method | Returns | Notes |
|---|---|---|
| `getStay(token)` | `GuestStayView = { stay?, property: PropertyIdentity, locality, guide: GuestGuideView }` | places arrive as `guide.favoritedPOIs: GuestPOI[]`, in server order: featured first, then host rank |
| `sendFeedback` | Result | per-place thumbs feedback |

### Owner

| Method | Returns | Notes |
|---|---|---|
| `listPois(propertyId)` | `LocalityPOIList` | the whole locality catalogue; `GET /v1/pois` takes **no query parameters** (`PlacePicker.tsx:12-15`), so all filtering is client-side |
| `getGuide` | includes `favoritedPOIIds` | picked set |
| `addFavorite` / `removeFavorite` | Result | toggle a pick |
| `listListings(propertyId)` | stance, note, rank, feedback counts per picked item | |
| `updateListing` | Result | feature, list or hide |
| `getPropertyArea(propertyId)` | `OwnerAreaView` | the only response carrying `area.timezone`; `area` may be null |
| `getPropertyDetails` | flat object with `latitude`, `longitude` | no screen collects them (`PropertyDetailsForm.test.tsx:336-337` asserts no lat/lng fields) |
| host places, host tips | create, update, delete | |

## Data shapes the frontend receives (from `src/api/contract/entities.ts`)

### `GuestPOI` (guest, `entities.ts:527-584`)

| Group | Fields |
|---|---|
| Identity | `id`, `name`, `description`, `category` (legacy free text) |
| Category | `poiCategory?: { id, category, subcategory, slug, icon, sortOrder, imageUrl }` |
| Hours | `hours?: { days: [{ dayOfWeek, closed, spans: [{ opens, closes, closesNextDay }] }], seasonal }`: local wall-clock `HH:mm`; a missing day means unknown (`entities.ts:615-628`) |
| Cost | `profile?.priceLevel` (1-4 or null), `isFree` (tri-state), `admission` |
| Host curation | `stance?: 'featured' \| 'listed'`, `recommended?`, `hostAdded?`, `hostNote` |
| Other | `address`, `neighborhood`, `tier`, `features`, `fit`, `tips`, `media`, `advisoryIds` |
| **Absent** | **no `latitude` / `longitude`** |

### `PropertyIdentity` (guest)

- `geo?: { latitude, longitude } | null`: paired or absent. Probably null for most properties, since no screen collects coordinates.

### `LocalityPOI` (owner catalogue row, `entities.ts:322-335`)

- `id`, `name`, `description?`, `category?` (free text), `localityIds`, `address?`, `hostAdded?`.
- **Absent**: hours, profile or price, `poiCategory`, coordinates and stance.

### Timezone

- **No guest-reachable response carries a timezone** (`stayDays.ts:60-72`).
- Owner side: only `OwnerAreaView.area.timezone`, when an area exists.

## Backend facts spot-checked outside this repo (not scanned)

From `guestguideiq-app`, checked only to confirm whether the data exists:

- `pois.latitude` / `pois.longitude` are stored, paired and indexed, and used for Haversine search (`prisma/schema.prisma:428-439, 557`), but are not mapped into either POI response.
- `Property.timezone` and the locality timezone exist (`schema.prisma:232-233`; `guestaccess/repository.ts:130` resolves `localityTimezone`), but are not returned to the guest.

Consequence: distance, map pins and a true "open now" need backend contract additions. See `guestguideiq-app`'s own CodeKB for the authoritative backend surface.

## Mock contract (tests)

`src/mocks/handlers.ts` implements the routes above for MSW. `guestPlace()` (around line 350) emits `hours: null`, `profile: null`, `isFree: null`, no coordinates, and `stance` defaulting to `featured`; it never sets `recommended`. Only five categories are mocked (Dining, Outdoors, Sights, Culture, Shopping). Richer fixtures can go in through `state.poiDetails` overrides.
