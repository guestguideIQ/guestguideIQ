# Unit Test Instructions: u1-places-api

Repository: `guestguideiq-app`. Runner: Vitest (already configured in `vitest.config.ts`, which also enforces the coverage floors). All commands run from the repository root.

## Prerequisites

- Node and the repository's dependencies installed (`npm ci`).
- No database is needed for the scenario and unit tests: they use the in-memory doubles under `tests/doubles/`.
- The integration test needs a PostgreSQL database reachable through the repository's usual test connection setting. Without one it skips itself, as the other tests in that file do.

## Unit-Scoped Command

Runs only this unit's tests:

```bash
npx vitest run tests/bdd/places-filters-guest.test.ts tests/bdd/places-filters-host.test.ts tests/bdd/locality-timezone.test.ts tests/unit/propertyZone.test.ts tests/unit/placeDistance.test.ts tests/unit/ownerCatalogue.test.ts
```

Integration case, when a database is available:

```bash
npx vitest run tests/integration/places.pg.test.ts
```

## Full Gates

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run format:check
```

```bash
npm run test:coverage
```

## What the Tests Cover

| File | Kind | Covers |
|---|---|---|
| `tests/bdd/places-filters-guest.test.ts` | Scenario | Distance and timezone in the guest stay response; hidden places; no coordinates sent; existing fields unchanged; distance failure degrades to null |
| `tests/bdd/places-filters-host.test.ts` | Scenario | Enriched host place list; stance values; hours in effect today and date boundaries; previous shape when enrichment is absent or fails; ownership refusal |
| `tests/bdd/locality-timezone.test.ts` | Scenario (extended) | Stay expiry uses the same zone rule, falling back to UTC |
| `tests/unit/propertyZone.test.ts` | Unit | The zone rule: missing, `UTC`, unrecognised, locality before property |
| `tests/unit/placeDistance.test.ts` | Unit | Whole-metre rounding, zero distance, missing coordinates, empty input |
| `tests/unit/ownerCatalogue.test.ts` | Unit | Hours grouping and date boundaries, stance precedence, price pass-through |
| `tests/integration/places.pg.test.ts` | Integration (extended) | Coordinates-by-ids and hours-in-effect reads against a real database |

## Pass Criteria

- Every scenario and unit test above passes, and the full existing suite stays green.
- Line coverage stays at or above the 80% floor and the floors configured in `vitest.config.ts`. No threshold is lowered.
- Type-check, lint and format check report no errors.

## Order of Work

Scenarios are written and seen to fail before the implementation. Unit tests are added after the implementation. This follows the Testing Contract in `code-generation-plan.md`.
