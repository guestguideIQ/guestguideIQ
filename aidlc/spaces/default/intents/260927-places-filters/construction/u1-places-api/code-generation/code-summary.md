# Code Summary: u1-places-api

Repository: `guestguideiq-app`. Branch: `feature/places-filters-api`, cut from `origin/main` at `2f1dd72`. 15 local commits. Nothing pushed, no pull request opened. `main` and `fix/stable-migrate-image` are untouched.

## What Was Built

- The guest stay response sends `property.timezone` and a `distanceMeters` on each visible place.
- The host place list sends a top-level `timezone` and, per row, `poiCategory`, `hours`, `priceLevel`, `distanceMeters` and `stance`.
- Stay expiry uses the same timezone rule as the responses, with a UTC fallback.
- No schema change, no migration, no new endpoint or setting. No place coordinate is sent in any response.

## Files

32 files changed (+2484 / −54), none deleted. The full list is in `source-manifest.json`.

| Kind | Files |
|---|---|
| New source | `src/lib/propertyZone.ts` |
| Changed source | `src/app.ts`, `src/wiring.ts`, `src/lib/dayBoundary.ts`, `src/poi/{repository,service,routes}.ts`, `src/guestcontext/{repository,service}.ts`, `src/guestaccess/{repository,service,routes}.ts` |
| New tests | `tests/bdd/places-filters-guest.test.ts`, `tests/bdd/places-filters-host.test.ts`, `tests/unit/propertyZone.test.ts`, `tests/unit/placeDistance.test.ts`, `tests/unit/ownerCatalogue.test.ts`, `tests/unit/repositories/guestContextRepository.test.ts` |
| Changed tests and support | `tests/bdd/locality-timezone.test.ts`, `tests/integration/places.pg.test.ts`, `tests/unit/{dayBoundary,guestContext}.test.ts`, `tests/unit/repositories/{poiRepository,stayRepository}.test.ts`, four files under `tests/doubles/`, `tests/factories/poiEventFactory.ts`, `tests/helpers/buildTestApp.ts` |
| Docs and comments | `docs/frontend-contract-delta.md` (new section 6e; corrects 6b, which said price was 1 to 4), `prisma/schema.prisma` (comment only) |

## Key Implementation Decisions

- **Timezone rule** is one pure function, `resolvePropertyZone(localityZone, propertyZone)`: first real zone, else null. Missing, exactly `UTC`, and unrecognised names are not real.
- **Distance** comes from one read of coordinates for the place ids plus the existing `haversineMeters`, rounded to whole metres. The guest route passes in the property location it already holds.
- **Host enrichment** is `GuestContextService.ownerCatalogue(propertyId, placeIds)`. It reads the property's location and zones, each place's category, hours, price, listing and coordinates, and the guide's picked ids.
- **Host list failure** is all-or-nothing: any enrichment error is logged by the route and the list is returned in its previous shape.
- **Stance on the host list**: a picked place with no listing is `featured`; an unpicked place is null.

## Test Results

| | Before | After |
|---|---|---|
| Tests passing | 732 | 822 |
| Tests skipped | 99 | 101 |
| Line coverage | 88.7% | 89.1% |
| Branch coverage | 81.09% | 81.85% |

- Scenario-first evidence: before any source change, the guest scenarios ran 12 failed of 14, the host scenarios 21 failed of 27, and the stay-expiry additions 2 failed of 4 added. All 56 scenarios in the three files pass now.
- The unit-scoped command in `unit-test-instructions.md` runs 87 tests, all passing.
- Type-check and lint exit clean. The 80% line floor in `vitest.config.ts` is met and unchanged.

## Not Run or Not Verified

- **Integration case not run.** The two new cases in `tests/integration/places.pg.test.ts` are written and skip themselves; no database was reachable. The four new database reads have query-shape tests against a mocked client but have not executed against PostgreSQL.
- **Format check fails locally, for a reason that predates this work.** `npm run format:check` exits 1 on 153 files (150 on untouched `origin/main`) because this checkout has Windows line endings. With line endings ignored, and on the committed content, Prettier reports all files clean. No configuration was changed. CI is the real check.
- **UTC aliases.** Only the exact value `UTC` is treated as unknown. A value such as `Etc/UTC` would be sent as a real zone.
- **Production data** was not inspected for how many places and properties carry coordinates, hours, prices or a real zone.

## Deviations From the Plan

1. `src/wiring.ts` also changed: the enrichment is an explicit optional dependency set there. A deployment whose wiring omitted that line would silently return the previous shape.
2. `src/lib/dayBoundary.ts` also changed: it gains `calendarDateInZone` for "today at the property".
3. The stay repository keeps `localityTimezone` as it was and adds `propertyTimezone` beside it, rather than replacing the field, so an existing repository test stays unchanged.
4. "Hours in effect today" is a rule in the service applied to the existing hours read, not a new filtered database read. The integration case checks that pairing.
5. Three reads were added to the guest-context repository. One reads the guide's picked-place ids from a column the schema marks deprecated, because it is the only record of a pick with no listing.
6. Services in this repository do not log, so the guest distance failure is logged by the route through a callback. A future caller that omits the callback would get a silent degrade.
7. More tests than planned: extra unit cases for the date helper, the distance callback and the database adapters, and extra scenarios (distance zero, locality zone ahead of property zone, a non-zone value such as `EST`, another property's listing not leaking).
8. Step 14 is ticked in the plan as written, not as run (see above).

## For the Next Units

The frontend's copy of these response shapes is not yet updated. That belongs to `u2-places-foundation`, and section 6e of the backend contract note is its source.
