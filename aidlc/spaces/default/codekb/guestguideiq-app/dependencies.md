# Dependencies — `guestguideiq-app`

**Derived from** two passes:
- The **focused scan of 2026-09-30** at `ce69629`, for the internal module relationships inside the analyzed area.
- The **prior full scan** at `76d190d`, for packages, external systems and hygiene. That material is marked *(carried forward, not re-verified)*.

Versions are in `technology-stack.md`.

---

## Internal Package Dependencies *(carried forward, not re-verified)*

| From | To | Kind |
|---|---|---|
| `admin-api` | u1 internal API | Runtime only, over HTTP (`BACKEND_API_INTERNAL_URL`); no shared code or types |
| `infra/` | root `Dockerfile` | Build asset |
| `admin-api/infra/` | `infra/` | SSM parameters, which `infra/` did not publish at `76d190d` |

The developer confirmed at `ce69629` that the root package does not import `admin-api`.

## Internal Module Dependencies in the Places Area (verified at `ce69629`)

| From | To | Why |
|---|---|---|
| `guestaccess` | `guestcontext` | `enrichGuestGuide` on the guest read |
| `guestaccess` | `guide` | `getForGuest(propertyId, stayWindow)` |
| `guestaccess` | `locality` | Tenant resolution; the locality timezone for stay expiry |
| `guestaccess` | `property/ownership` | The ownership check on owner stay routes. The target module was not analyzed. |
| `guestcontext` | `guide` | Starts from `GuestPOIView` and spreads it into `GuestPlace` |
| `guestcontext` | `destination` | The area, themes and audiences for the area view and fit |
| `guide` routes | `guestcontext` (optional `listings` port) | Favourite to `PropertyListing` dual-write (`guide/routes.ts:65-96`) |
| `guide` | `poi` | POI rows for `GuestPOIView` |
| `guide` | `hostnote` | The legacy `recommended` stance (`toStances`). The target was not analyzed. |
| `destination` | `poi/geo.ts` | Haversine for area containment (`destination/service.ts:303-319`) |
| `event` | `poi/geo.ts` | The same helpers for events (`event/service.ts:322-330`) |
| `poi` | `poi/propertyCoordinates.ts` | Property coordinates for `nearProperty` |
| `guestaccess` | `src/lib/dayBoundary.ts` | `endOfDayInZone` (skimmed) |

**No cycle at service level.** The one bidirectional coupling, between `guide` and `guestcontext`, sits at the route layer through an optional port. The whole component graph is in `component-inventory.md`.

## External Runtime Dependencies *(carried forward from `76d190d`, not re-verified)*

| System | Consumed by |
|---|---|
| PostgreSQL | All domain modules through Prisma ports. It has **no PostGIS**, verified at `ce69629`. |
| Stripe | `subscription` |
| Chat provider | `chatmodule` (null provider at `76d190d`) |
| OTLP collector | `app-runtime` (opt-in) |
| AWS Secrets Manager | Container startup |

**Not depended on (verified at `ce69629` for this intent's needs):** no map or tile provider, no geocoding service, no timezone database service beyond runtime IANA support, and no search or spatial index.

## Dependencies for Intent `260927-places-filters`

These are the prerequisites the Places filters depend on, in the order a plan would need them:

| Filter or feature | Depends on | Owner | Status at `ce69629` |
|---|---|---|---|
| Category grouping and filter | `poiCategory` in `GuestPlace` | — | **Available** in the guest payload. Host-added places probably resolve to "Other". |
| Host picks filter | `stance` (and/or the legacy `recommended`) | — | **Available.** A field choice must be made (TD-23). |
| Price filter | `profile.priceLevel` | Backend data | **Field available; data absent.** No production writer exists, and the scale conflict (TD-22) is unresolved. |
| Open now or open on a day | `hours`, plus **a zone**, plus per-date evaluation | Backend API and data | **Zone absent** from the guest payload. **Data absent**: no writer. The evaluation logic does not exist on either side. |
| Distance sort or filter | Place coordinates or `distanceMeters` in `GuestPlace`, plus `property.geo` | Backend API and data | **API absent**: `toGuestPOI` drops the coordinates. **Data absent**: 0 of the 24 repository places are located. |
| Map view | Place coordinates, a frontend Maps key, frontend CSP, `attribution` rendering | Backend API and data, and the frontend | **Absent**, as for distance. `property.geo` can centre the map. |
| Host panel showing price, hours and category | A richer `GET /v1/pois` projection | Backend API | **Absent.** The projection has six fields plus `hostAdded`. |

This adds to the backend follow-up total. The frontend intent's backend follow-up had already grown three times (the `project.md` Corrections note on accumulation). This intent adds, at minimum:
- place coordinates or distance in the guest place view;
- a zone or `openNow` in the stay payload;
- a richer owner catalogue projection;
- a production write path for coordinates, hours and price.

## Dependency Hygiene *(carried forward, not re-verified)*

At `76d190d`:
- There were four independent lockfiles.
- `npm audit --audit-level=high` was blocking in CI.
- Every action was SHA-pinned.
- No Dependabot or Renovate was configured.
- Direct dependency counts were small: 12 runtime packages in u1 and 4 in u2.
