# Integration Test Instructions: Places Filters

The test strategy for this work is Standard: unit and scenario tests per unit, plus integration tests at the key boundaries. There are three boundaries.

## Boundary 1: Backend Code to the Database

**What it proves.** The four new database reads return what the code expects from a real PostgreSQL: place coordinates by id, a property's location and timezones, each place's category, and the guide's picked ids. Also that "hours in effect today" works on real hours rows.

**Where.** `guestguideiq-app/tests/integration/places.pg.test.ts` (two cases added by this work) and the existing files beside it.

**How to run.** With PostgreSQL 16 reachable and `DATABASE_URL` set to a test database:

```bash
npx vitest run tests/integration
```

**In CI.** The backend workflow starts a PostgreSQL 16 service and sets `DATABASE_URL`, so these run on every pull request.

**Without a database** the tests skip themselves and report as skipped, not failed.

**Test data.** Each test seeds its own rows and cleans up. No shared fixture database is needed.

## Boundary 2: Frontend to the Backend's Response Shapes

**What it proves.** The frontend reads the new fields correctly, and still works when they are absent.

**Where.** `guestguideiq-frontend/src/places/contract.scenarios.test.ts` and `src/api/contract/contract.test.ts`. The mock backend under `src/mocks/` can send the new fields, leave them out entirely (an older backend), or send stance on some rows only.

**How to run.**

```bash
npx vitest run src/places src/api --exclude ".claude/**"
```

**Limit.** These tests run against hand-written mocks, not the real backend. The two repositories share no generated contract, so a mock can drift from the real response without any test failing. The source for the mocks is section 6e of `guestguideiq-app/docs/frontend-contract-delta.md`. The frontend's thin live-backend suite is the team's guard against that drift, and it has not been extended for these fields because the backend branch is not deployed.

## Boundary 3: The Two Screens to the Shared Rules

**What it proves.** The guest tab and the host panel group and order the same catalogue the same way, and each screen works end to end with its real providers.

**Where.** `src/guest/guide/guestPlaces.scenarios.test.tsx` and `src/owner/billing/hostPlaces.scenarios.test.tsx`. Scenario S12 in the host file mounts both screens on one catalogue and compares section names and order.

**How to run.**

```bash
npx vitest run src/guest src/owner src/places-ui --exclude ".claude/**"
```

## Coverage Expectations

- Each repository keeps its 80% line-coverage floor. The frontend also keeps its 70% branch floor. Both are enforced in the test runner's own configuration.
- No threshold is lowered and nothing is excluded to pass.

## What Still Needs a Deployed Backend

Once `feature/places-filters-api` is merged and deployed to staging, extend the frontend's live-backend suite with one guest stay read and one host place-list read that assert the new fields are present with the documented types. Until then the cross-repository contract is checked by review only.
