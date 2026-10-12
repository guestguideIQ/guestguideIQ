# Code Generation Plan: u1-places-api

Unit: `u1-places-api` (backend, repo `guestguideiq-app`). Design: `../functional-design/functional-spec.md`, `rules.md` (BR1.1–BR5.1) and `entities.md`. Requirements: FR2.2, FR10.1–FR10.5, NFR6.

## What This Plan Builds

Three additive changes, with no new table, address or environment variable:

1. Each place in the guest stay response gains `distanceMeters`.
2. The guest stay response gains `property.timezone`, and the host place list gains `timezone`.
3. Each host place-list row gains `poiCategory`, `hours`, `priceLevel`, `distanceMeters` and `stance`.

## How the Review Findings Are Resolved

The design passed review with eight points left open. This plan settles each. Two of them change what the design said, and are marked **Deviation**.

| Finding | Resolution in this plan |
|---|---|
| R-01: no named source for the timezone or category on the host path | The host enrichment reads everything it needs itself, from the property id and the place ids: the property's location and zone, the locality's zone, and each place's category, hours, price, listing and coordinates. It does not rely on fields the projected rows have dropped. The zone is resolved first, because "hours in effect today" needs it |
| R-02: an enrichment failure fails the whole host list | **Deviation from the design (W2 error path).** If enrichment fails, the route logs the error and returns the list in its previous shape, with none of the new fields. The existing host picker keeps working, and the frontend then joins stance from the listings as it does today. The design said the request should fail; the review showed that would break a screen that ignores the new fields |
| R-03: "UTC only ever means never set" is not strictly true | An explicit UTC is treated the same as an unset zone: unknown. The contract note says so. A property that is really in UTC gets no "open now" filter, which is accepted |
| R-04: the shared shapes lack inner types | The backend contract note lists every inner field with its type and nullability, including that a category's `id`, `subcategory` and `slug` can be null |
| R-05: failure paths and date boundaries have no scenario | Scenarios are added for the guest distance failure, the host enrichment failure, and hours rules that start today, end today, ended yesterday and start tomorrow. Validity dates are inclusive and compared as dates only |
| R-06: a second read of the property's location | The guest route already holds the property's location. It passes it in, so no extra read is made |
| R-07: which connection the route uses | The place-list route gains one new optional connection for enrichment, separate from the existing one for host-added places. With it absent, the previous shape is returned (BR4.2) |
| R-08: a picked place with no listing shows stance null | **Clarification of the design (section 2.2).** A place the host has picked that has no listing is sent as `featured`, the same rule the guest side uses. Null then means only "not picked" |

## Working Branch

The backend checkout is on `fix/stable-migrate-image`, which is ahead of the local `main`. This plan does not touch that branch. Work happens on a new branch, `feature/places-filters-api`, created from the latest `origin/main`. Commits stay local. Pushing and opening a pull request wait for your go-ahead.

## Steps

Scenario first, then implementation, then unit tests, per the Testing Contract below.

- [x] **Step 1. Branch and baseline.** Fetch, create `feature/places-filters-api` from `origin/main`, install dependencies, and run the full existing suite with coverage to record the baseline (tests passing, line and branch coverage). No code changes. *(FR10.4, NFR6)*
- [x] **Step 2. Runner check.** Confirm the unit-scoped command in `unit-test-instructions.md` runs (with no matching files it reports none found). *(Testing Contract)*
- [x] **Step 3. Scenarios first: guest stay.** Add `tests/bdd/places-filters-guest.test.ts` with the guest scenarios: distance known, place unlocated, property unlocated, zone from the locality, zone unknown, zone from the property, explicit UTC treated as unknown, hidden place absent, no coordinate in the body, existing fields unchanged, distance failure degrades to null. Run them and record that they fail. *(FR2.2, FR10.1, FR10.2, FR10.4; BR1.1–BR1.4, BR2.1, BR2.2, BR3.3, BR4.1)*
- [x] **Step 4. Scenarios first: host place list.** Add `tests/bdd/places-filters-host.test.ts` with the host scenarios: enriched row fields, stance for featured, listed, hidden, picked-without-listing and unpicked, price 0, hours in effect and the four date boundaries, `timezone` at the top level, non-owner refused, previous shape when the connection is absent, previous shape when enrichment throws, a host-added place, the empty locality. Run them and record that they fail. *(FR10.3, FR10.4, FR10.5; BR3.1–BR3.5, BR4.2, BR5.1)*
- [x] **Step 5. Scenario first: stay expiry.** Extend `tests/bdd/locality-timezone.test.ts` with: no real zone gives UTC expiry; a default-UTC locality with a zoned property uses the property's zone. Run and record the failure of the second. *(BR2.3)*
- [x] **Step 6. Timezone helper.** Add `src/lib/propertyZone.ts`: one pure function taking the locality's zone and the property's zone and returning the first real zone or null, where missing, `UTC` and unrecognised names are not real. *(BR2.1, BR2.2)*
- [x] **Step 7. Distance.** In `src/poi/`: a repository read of coordinates for a set of place ids, and a service function returning distance in whole metres per place id from a given location, using the existing `haversineMeters`. Update the in-memory place repository double. *(BR1.1–BR1.4)*
- [x] **Step 8. Guest access.** `src/guestaccess/repository.ts` returns the locality's and the property's zones separately. Stay expiry uses the helper with a UTC fallback. The guest read sends `property.timezone` and passes the property's location to the enrichment. *(BR2.1–BR2.3)*
- [x] **Step 9. Guest enrichment.** `enrichGuestGuide` in `src/guestcontext/service.ts` accepts the property's location and adds `distanceMeters` to each visible place. A failure computing distance is logged and leaves every distance null. *(BR1.1–BR1.3, FR10.1)*
- [x] **Step 10. Host enrichment.** Add an owner-catalogue enrichment to `src/guestcontext/`: for a property and a set of place ids, return category, hours in effect today, price level, distance, stance and the timezone. Add the repository reads it needs (one query per kind of data for the whole list) and update the in-memory double. *(BR3.1, BR3.3, BR3.4, BR3.5)*
- [x] **Step 11. Place-list route.** `src/poi/routes.ts` takes the new optional enrichment connection, merges its fields into the rows it already returns, and adds `timezone`. Absent connection or a thrown error gives the previous shape, with the error logged. Wire the connection in the application's composition root. *(BR3.2, BR4.1, BR4.2)*
- [x] **Step 12. Scenarios green.** Run the three scenario files until they pass. *(all rules)*
- [x] **Step 13. Unit tests.** Add `tests/unit/propertyZone.test.ts`, `tests/unit/placeDistance.test.ts` and `tests/unit/ownerCatalogue.test.ts`, 5 to 8 tests each, for the cases the scenarios do not reach: zone edge cases, rounding and zero distance, hours grouping and the date boundaries, stance precedence. *(BR1.3, BR2.2, BR3.4)*
- [x] **Step 14. Integration test.** Add a case to `tests/integration/places.pg.test.ts` for the coordinates-by-ids read and the hours-in-effect read against a real database, following that file's existing skip-when-unavailable pattern. *(BR1.1, BR3.4)*
- [x] **Step 15. Contract and comments.** Update `docs/frontend-contract-delta.md` with section 2 of the design and the inner types. Make the price scale read "0 to 4, 0 is free" in the schema comment, the guest type comment and the contract note. No schema change, so no migration. *(FR10.5, BR5.1)*
- [x] **Step 16. Quality gates.** Run type-check, lint, format check and the full suite with coverage. Coverage must stay at or above the configured floors and not fall below the Step 1 baseline for lines. No threshold is changed. *(NFR6, Testing Contract)*
- [x] **Step 17. Record.** Commit in small single-concern commits. Write `source-manifest.json`, `code-summary.md` and `traceability.json` in this folder. *(traceability)*

Not applicable to this unit: database migrations, configuration files, deployment artifacts.

## Requirement to Step Traceability

| Requirement | Steps |
|---|---|
| FR2.2 straight-line distance from the property | 3, 7, 9 |
| FR10.1 distance in the guest response | 3, 7, 9, 12 |
| FR10.2 timezone in the guest response | 3, 6, 8, 12 |
| FR10.3 enriched host place list | 4, 10, 11, 12 |
| FR10.4 additions optional and nullable | 3, 4, 11, 16 |
| FR10.5 price scale documented | 4, 15 |
| NFR6 backwards compatible | 1, 4, 11, 16 |

## Files Expected to Change

- New: `src/lib/propertyZone.ts`; `tests/bdd/places-filters-guest.test.ts`; `tests/bdd/places-filters-host.test.ts`; `tests/unit/propertyZone.test.ts`; `tests/unit/placeDistance.test.ts`; `tests/unit/ownerCatalogue.test.ts`.
- Changed: `src/poi/repository.ts`, `src/poi/service.ts`, `src/poi/routes.ts`; `src/guestcontext/repository.ts`, `src/guestcontext/service.ts`; `src/guestaccess/repository.ts`, `src/guestaccess/service.ts`, `src/guestaccess/routes.ts`; `src/app.ts`; the in-memory doubles for places, guest context and stays under `tests/doubles/`; `tests/bdd/locality-timezone.test.ts`; `tests/integration/places.pg.test.ts`; `docs/frontend-contract-delta.md`; a comment in `prisma/schema.prisma`.

The developer may find a file here does not need to change, or that a neighbouring file does. Any difference is recorded in `code-summary.md` and `source-manifest.json`.

## Testing Contract

```json
{
  "version": 1,
  "methodology": "custom",
  "source": "team",
  "ordering": "write the BDD scenario (given/when/then) first, implement the",
  "scope": "feature",
  "test_strategy": "standard",
  "project_type": "brownfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    },
    {
      "layer": "team",
      "text": "- **Methodology**: custom\n- **Ordering**: write the BDD scenario (given/when/then) first, implement the\n  code to satisfy it, then add lower-level unit tests after implementation.\n  This carries over unchanged from the backend (Q4 in the original backend\n  interview) — the methodology choice was never backend-specific reasoning,\n  and re-affirming it for frontend work required no new interview question\n  this round beyond the Q3 carry-over confirmation.\n- **Frontend specialisation of the Ordering clause (additive, does not\n  weaken the affirmed cadence)**: \"lower-level unit tests after\n  implementation\" applies to **logic units** — hooks, state reducers, the\n  API client, validators, formatters — where a unit test adds coverage the\n  scenario test does not already provide. For **presentational components**,\n  the scenario test that exercises them is the primary coverage; a\n  component-level unit test is written only when the component carries\n  branching logic of its own, not by default. Writing a component test purely\n  to hit a coverage number, when the scenario already exercised every branch,\n  produces exactly the \"meaningless assertions\" pattern the team's testing\n  standards guard against.\n- **The frontend's substitution boundary is the network, not the\n  component.** The backend's own scenario tests (`tests/bdd/signup.test.ts`)\n  wire the real application end-to-end and substitute doubles only at the\n  outermost port (the database), never inside the call graph. The frontend\n  equivalent: scenario tests mount the real router/providers/state and\n  substitute only at the network boundary (request interception), never by\n  mocking child components. A scenario test that mocks a component's children\n  inverts the pyramid and couples the test to markup rather than behaviour —\n  this is the failure mode to avoid, named now so it is not rediscovered the\n  hard way in `functional-design`.\n- **What tests run against (confirmed, Q5): both.** Mocked/intercepted\n  network for unit and component tests, plus a thin live-backend end-to-end\n  suite as the drift detector. Every option has a real prerequisite that does\n  not exist today — see Deployment/backend-follow-up below and `evidence.md`\n  Q-J — so \"thin\" is deliberate: the live-backend suite is scoped narrowly,\n  not the primary gate.\n- **Contract drift is a real, currently-unaddressed risk, not yet a settled\n  practice.** There is no OpenAPI document, no schema export, and no\n  generated client for the backend API, so hand-written frontend fixtures for\n  the mocked-network tests can drift from the real API with no test failing.\n  The live-backend E2E suite (the \"both\" half of Q5's answer) is the\n  team's chosen compensating control for this, consistent with the human's\n  framing that contract tests matter here specifically to stop mocks\n  drifting. Which mechanism formalises contract verification beyond that\n  — a machine-readable contract added to the backend, or a recorded-response\n  suite re-verified on a schedule — is not yet decided; see `evidence.md`.\n- **Coverage floor**: the org default 80% line-coverage floor for `classic`\n  scope carries over unchanged as the floor — this is additive per `org.md`\n  and is not weakened here. Which coverage tool enforces it depends on the\n  frontend framework, not yet chosen.\n- **The floor needs a declared `include`/`exclude` set to have teeth, and\n  that declaration is a required `domain-design` deliverable, not an\n  afterthought.** The backend's own measured split — 91.15% lines against\n  76.53% branches — shows line coverage overstates rigour even on plain\n  service code; on component/template code the gap is wider still, because a\n  single render assertion executes every line of a template. `domain-design`\n  must state explicitly which paths count (and which are excluded —\n  generated route files, design-system primitives, story files, mock-service\n  definitions) rather than inheriting whatever a framework scaffold ships.\n  Enforce the floor in the test runner's own config (as the backend does in\n  `vitest.config.ts`), not only in the CI workflow, so the same gate fires\n  locally and cannot be bypassed by editing the workflow.\n- **CI gate**: a green CI check — build, lint, type-check, test, coverage —\n  is required before any pull request touching the frontend can merge,\n  matching the backend's practice and now stated to apply team-wide per Q3.\n- **Type-checking as a blocking gate**: whichever frontend language is\n  chosen, the CI gate must include a distinct type-check step separate from\n  build, continuing the explicit fix for the `astro build`-vs-`astro check`\n  gap the marketing site never closed.\n- **Post-deploy verification must be real, not a placeholder.** The\n  backend's `integration-test-staging` and `smoke-test-production` CI jobs\n  are `echo` no-ops today — the backend currently reaches production with no\n  automated post-deploy check of any kind, which is a live instance of the\n  team's own \"installed but not enforced\" anti-pattern (Q7/Q8's enforcement\n  discipline, applied to deployment verification rather than scanning). The\n  frontend's pipeline must define and run a genuine post-deploy check (at\n  minimum, that the deployed build serves and its core routes respond) as\n  part of its gate — not copy the placeholder shape.\n- **Test pyramid, component/E2E tooling choice, and test-data/fixture\n  strategy**: not decided — correctly deferred to `domain-design`/\n  `functional-design` once the frontend framework is chosen. The backend's\n  test-doubles pattern (one shared fixture module, per-entity factories,\n  every test builds a fresh, independent harness) is a proven asset worth\n  translating deliberately rather than reinventing; it should not be\n  inherited as a constraint (it was itself a deviation forced by no\n  Docker/Postgres in the backend's original generation environment).\n- **Accessibility, flake policy, and NFR/perf testing**: raised by review as\n  genuinely new ground with no workspace precedent, but not yet asked of the\n  human this round. Recorded as open candidates for the next testing-related\n  gate (`domain-design`/`nfr-requirements`) rather than affirmed here — see\n  `evidence.md`."
    },
    {
      "layer": "project",
      "text": "- When a practice requires a coverage include/exclude declaration before the framework is chosen, declare the boundary in component-category terms rather than file globs — the component catalogue makes that expressible, and the concrete globs follow once the framework exists. A declaration deferred for want of globs is a floor with no teeth (learned 2026-09-08)"
    }
  ],
  "obligations": {
    "strategy": "standard",
    "strategy_volume": [
      "Five to eight tests per component.",
      "Unit tests plus integration tests for key boundaries.",
      "Add E2E, performance, or security tests when requirements demand them."
    ],
    "scope_floor": [
      "Meet an 80% line-coverage floor.",
      "Run the selected tests in CI before merge."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "custom",
    "runner_step": "Verify the existing test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Verify the existing test runner/configuration and record the exact unit-scoped command.",
      "Custom ordering - write the BDD scenario (given/when/then) first, implement the",
      "Implementation and tests - preserve that exact ordering; do not convert it to layer-local TDD.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:4fc90a2fb9754cc4921c60a6e763d6d33e83ec02ecc4373d78c664d2dc79f0c4",
  "contract_sha256": "sha256:f29de6ac4ec6a301ff8471d8ebd353a1d0da06332a3822e154b72e20ef4e2c1f"
}
```

The contract's `ordering` line is cut short by the tool. The full team ordering, quoted in the contract's team note, applies: write the scenario first, implement the code to satisfy it, then add lower-level unit tests after implementation.

## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Iteration:** 1

Reviewed 2026-10-10 against `feature/places-filters-api` (15 commits on `origin/main`). I read the full source diff, ran type-check, lint, and the full suite with coverage, and sampled the tests. Type-check and lint are clean. The suite passes: 822 passed, 101 skipped, 78 files passed and 9 skipped. Line coverage is 89.1% and branch coverage 81.85%. `vitest.config.ts`, the eslint config and `package.json` are untouched, and the diff adds no TODO, suppression comment or secret. `source-manifest.json` matches the changed-file list exactly, and every `traceability.json` target exists. `npm run format:check` fails here only because of CRLF line endings, which also affect unchanged files, as `code-summary.md` says.

### How the eight design findings stand in the code

- **R-01 (named sources):** done. `ownerCatalogue` reads the property's placement and zones, then hours, profiles, listings, picked ids, categories, category refs and coordinates for the place ids. The zone is resolved before "today" (`src/guestcontext/service.ts`).
- **R-02 (failure degrades):** done. The route catches the error, logs it, and sends the previous shape, all or nothing (`src/poi/routes.ts`). A scenario forces both a property read failure and a coordinate read failure.
- **R-03 (explicit UTC is unknown):** done in `src/lib/propertyZone.ts`, with a scenario and a unit test.
- **R-04 (inner types):** done. `docs/frontend-contract-delta.md` lists the inner fields, including null `id`, `subcategory` and `slug` on a category-level match.
- **R-05 (failure and date-boundary scenarios):** done. Scenarios cover the guest distance failure, the host enrichment failure, and rules that end today, ended yesterday and start tomorrow. Dates are compared as `YYYY-MM-DD` strings in the property's zone, inclusive at both ends.
- **R-06 (no second property read):** done. The guest route passes the `geo` it already holds.
- **R-07 (separate optional connection):** done. `placeEnrichment` is separate from `hostContent`. When it is absent the previous shape is returned.
- **R-08 (picked without a listing):** done. A listing wins, a pick without a listing is `featured`, and anything else is null.

### Findings

| ID | Severity | File and line | What is wrong | What would fix it |
|---|---|---|---|---|
| R-01 | Minor | `code-generation-plan.md` Step 14; `tests/integration/places.pg.test.ts` | Step 14 is ticked, but the two new real-database cases skip themselves and never ran, so the coordinates, picked-ids, placement and category-ref queries have not executed against PostgreSQL. `code-summary.md` discloses this honestly. Impact is limited: a runtime query fault in the guest path is caught and degrades to null distances, and in the host path it is caught and the old shape is sent. | Run the integration file against a real database in CI before merge, and record the result. Alternatively annotate Step 14 as "written, not run". |
| R-02 | Minor | `src/wiring.ts` line 205 | Production only gets the host enrichment through one added line, `placeEnrichment: guestContext`. No test builds the production wiring. The test helper turns it on by default, so removing the line would leave every test green and silently return the old shape in production. `code-summary.md` deviation 1 notes the risk but no test covers it. | Add a small test that the production dependencies expose `placeEnrichment`, or make the field required on the production dependency type so that omitting it fails type-check. |
| R-03 | Minor | `src/guestcontext/service.ts` `ownerCatalogue` (`pickedPlaceIds`, repository line about 296) | A picked place with no listing is detected by reading `GuideContent.favoritedPOIIds`, a column the schema marks deprecated. If that column is ever dropped, such places silently turn from `featured` to null, which is the misreading R-08 was meant to prevent. This is disclosed as deviation 5. | Record in the contract note or a backlog item that dropping that column needs a listing backfill first. |
| R-04 | Minor | `src/lib/propertyZone.ts` `realZone` | Only the exact string `UTC` is treated as unknown. `Etc/UTC` or `GMT` would be sent as real zones, and the client would then show an "open now" filter that may be wrong. This is disclosed, and the design's own R-03 acknowledged the `UTC` trade-off. | No change needed to approve. Consider treating the other UTC aliases as unknown, or note in the contract that they are passed through. |
| R-05 | Minor | `src/guestaccess/service.ts` `expiryZone` | Stay expiry now lets a property's own zone apply when the locality is on the `UTC` default, which was previously hidden. The commit comment says no product path writes the property column today, so no issued link changes, and a scenario pins it. This is a behaviour change on a code path the plan describes as unchanged for existing links. | Keep the disclosure at the approval gate. If a deployed property row could carry a zone, check production data first. |

### Checks that held

- **Backwards compatibility (NFR6):** no existing field is renamed or changed. The host row fields `id`, `name`, `description`, `category`, `localityIds` and `address` do not collide with the new keys. Both new response sets are additive and nullable. An absent connection and a thrown enrichment both return the old shape. A scenario asserts every existing guest field is unchanged.
- **Ownership and exposure:** `assertOwned` runs before any enrichment. Enrichment runs after the host-added filter, so another host's place is never queried. Stance comes only from `listingsFor(propertyId)`. A scenario covers another property's listing not leaking. No place coordinate is sent: the guest test asserts neither field name nor value appears in the guide, and the property's `geo` was already in the response.
- **Timezone and dates:** `calendarDateInZone` is compared as a date string against `@db.Date` values cut to their date. Zone fallback to UTC for "today" is explicit. Distance is rounded to whole metres, 0 is kept distinct from null, and invalid coordinates are skipped.
- **Query cost:** each kind of data is read once for the whole list, in one `Promise.all`, after a single sequential property read. Nothing is read per row. The guest path adds one coordinates query.
- **Test strength:** the scenarios use the real app and doubles only at the repository boundary. The failure cases force a real read failure rather than asserting a constant. The git history shows scenario commits (`36541ec`, `d4d5a52`, `af27c15`) before the matching implementation commits, and unit tests last. The one scenario-file edit in an implementation commit is a prettier reformat, with no behaviour change.

### Summary

The code does what the plan promises for all eight findings, stays backwards compatible, leaks no coordinate or cross-property data, and passes type-check, lint and the suite with coverage above the unchanged floor. Only Minor items remain: real-database cases not yet run, one unprotected wiring line, a deprecated column dependency, UTC aliases, and a disclosed expiry edge case.
