# Technology Stack — `guestguideiq-app`

**Derived from** two passes:
- The **prior full scan** at `76d190d` (2026-09-07). Most of this file comes from it and is *carried forward, not re-verified*.
- The **focused scan of 2026-09-30** at `ce69629`. It re-confirmed the versions and the data-layer facts marked "(verified at `ce69629`)".

Dependency relationships are in `dependencies.md`.

---

## Languages and Runtimes *(carried forward, not re-verified)*

| Item | Value at `76d190d` |
|---|---|
| Language | TypeScript (both services and both CDK apps) |
| Declared engine | `engines.node >= 18.18` |
| Container base | `node:20-slim` |
| CI runtime | Node 24 |
| Compile target | ES2022, CommonJS |

At `76d190d` three Node major versions were in play: 18.18 declared, 20 shipped and 24 tested.

## Core Libraries (verified at `ce69629` by the developer scan)

| Package | Version | Purpose |
|---|---|---|
| `fastify` | ^5.12.3 | HTTP server |
| `@fastify/cors` | ^11.3.0 | CORS |
| `@prisma/client` / `prisma` | ^5.18.0 | ORM and migrations |
| `vitest` | ^5.0.0 | Tests and coverage |
| `typescript` | ^5.5.4 | Compiler |

The other runtime dependencies are carried forward from `76d190d`: `jsonwebtoken` ^9.0.2, `bcryptjs` ^3.0.3, `pino` ^9.3.2, `stripe` ^16.8.0 and the OpenTelemetry packages. The dev toolchain is also carried forward: ESLint 8 with `@typescript-eslint` 7, Prettier 3, `supertest`, `tsx` and `@vitest/coverage-v8`. u2 adds `axios` ^1.7.4 and `nock`.

## Data Layer (verified at `ce69629`)

| Concern | Technology | Relevance to `260927-places-filters` |
|---|---|---|
| Database | PostgreSQL (RDS in production) | — |
| Spatial support | **None. There is no PostGIS extension** (`schema.prisma:433-437`). | Distance and nearby are computed in TypeScript (`src/poi/geo.ts`: haversine plus a bounding box), backed by a plain `@@index([latitude, longitude])`. That is fine for a host's small pick list and for a 200 km locality search. It is not a spatial index. |
| Taxonomy table | `poi_categories`, created outside Prisma | Category filters read it through `PoiCategory`. |
| Materialized view | `locality_category_counts` (unmodelled) | Counts legacy `pois.category`. It is not usable for per-property category counts. |
| Time handling | IANA zone strings on `LocalityEntity`, `Property` and `Area`; `src/lib/dayBoundary.ts` `endOfDayInZone` | No date library dependency was reported. `PlaceHours` times are plain `HH:MM` strings with no parser. |

## Integrations Relevant to the Intent (verified or skimmed at `ce69629`)

- **Maps: none in the backend.** There is no map SDK, map key or geocoding client. `src/config.ts` has only Google OAuth keys (`:26-45`). A Google Maps JavaScript key would live only in the frontend: it is public and must be domain-restricted.
- **No CSP or helmet in `src/app.ts`.** Map script and tile origins must be allowed by the frontend host's security headers (see `team.md` Deployment).
- **Geocoding** is referenced only as an out-of-band path in schema comments (`Property.geocodeQuality`, `geocodedAt`, `schema.prisma:230-240`). No geocoder is wired in `src/`.
- **Content loading.** `.github/workflows/load-locality-content.yml` runs `prisma/seedLocalityContent.ts` as a one-off ECS task with OIDC. It is the only production content producer found, and its `LocalityPOI` type has no coordinate field.

## Build, CI and AWS *(carried forward from `76d190d`, not re-verified)*

- npm with four independent lockfiles, `tsc` and no bundler.
- Multi-stage Docker.
- AWS CDK v2.
- One CI workflow at `76d190d`. A second one (`load-locality-content.yml`) now exists; only its name was observed.
- AWS services in use: VPC, ECS Fargate, ALB, RDS PostgreSQL 16, Secrets Manager, CloudWatch, ACM, SSM, WAF and GitHub OIDC.
- Not present at `76d190d`: Route 53, SES, Redis, S3 and API Gateway. The guest `GuestMedia.url` comment mentions a "media bucket" served at `/media/<key>`, so S3 may now exist. That is unverified.

## Version Risks *(carried forward, not re-verified)*

- ESLint 8 has reached end of life.
- `@types/node` ^24 is ahead of the shipped Node 20.
- Three Node major versions are in play.

## Relevance to the Frontend

The backend stack does not constrain the frontend framework. There is still **no machine-readable contract**; the hand-kept `docs/frontend-contract-delta.md` is the nearest thing. New guest place fields added for this intent (coordinates, distance, zone or `openNow`) will have to be mirrored by hand in the frontend's API-client types. That is a contract-drift point for the team's live-backend E2E suite to guard.
