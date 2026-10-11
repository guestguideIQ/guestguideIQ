# Code Generation Plan: u2-places-foundation

Unit: `u2-places-foundation` (frontend, repo `guestguideiq-frontend`). Design: `../functional-design/functional-spec.md` (scenarios S1–S48), `rules.md` (BR1.1–BR11.1) and `entities.md`. The response shapes it copies are in section 6e of the backend's `docs/frontend-contract-delta.md` on branch `feature/places-filters-api`, and in section 2 of the backend unit's functional specification.

## What This Plan Builds

The part of the frontend both screens share. It has no screen of its own, so nothing visible changes when it lands.

1. **Contract:** the new response fields in the types, the client mapping, the test mocks and the provenance record.
2. **Filtering rules:** a new module of pure functions for grouping, open evaluation, filters, sort, counts, distance display and which filters to offer.
3. **Remembered choices:** one new module, the only one in this feature allowed to touch browser storage.
4. **Shared controls:** chip, chip row, collapsible section header, filter sheet, checkbox group and radio group in the design system, plus the fix that makes the page behind a dialog inert.

## How the Open Review Points Are Resolved

| Point | Resolution in this plan |
|---|---|
| R-10: the format version lives in the stored value, so a newer entry at the same key would be overwritten, and old-version entries are never pruned | **Deviation from the design (entities, BR8.6).** The format version moves into the storage key. An entry in a newer format then sits at a different key and is never overwritten or removed. An entry in an older format is removed when the guide opens, since nothing can read it any more. S45 (a newer entry is left in place and reads as unusable for this version) still holds |
| R-08 (optional): how the dialog learns the application root | The dialog renders into the document body, outside the application root, and marks every other direct child of the body inert while it is open, restoring them on close. No root reference has to be passed in. Existing dialogs get the same behaviour, and their tests must stay green |
| Open point: host picks filter hidden when nothing is featured | Built as BR5.2 says. Already flagged at the design gate |
| Open point: storage outside the API and session modules | The new storage module gets a storage-only lint allowance, the same shape as the existing one for the theme preference (ADR-006). Network access stays forbidden in it. The lint configuration's own test is extended to pin this |

## Working Branch

The frontend checkout is on `brand/fraunces`. This plan does not touch that branch. Work happens on a new branch, `feature/places-filters-foundation`, created from the latest `origin/main`. Commits stay local. Pushing and opening a pull request wait for your go-ahead.

This unit does not depend on the backend unit being merged or deployed: every new field is optional, and the mocks supply them.

## Steps

Scenario first, then implementation, then unit tests for logic, per the Testing Contract below. Controls are covered by their scenario and keyboard tests; a control gets a separate unit test only where it has branching logic of its own.

- [x] **Step 1. Branch and baseline.** Fetch, create `feature/places-filters-foundation` from `origin/main`, install dependencies, run the full suite with coverage and record the baseline. No code changes. *(NFR6)*
- [x] **Step 2. Runner check.** Confirm the unit-scoped command in `unit-test-instructions.md` runs. *(Testing Contract)*
- [x] **Step 3. Structure.** Create the folder `src/places/` with its public entry file. No logic yet. *(spec section 5)*
- [x] **Step 4. Scenarios first: contract.** Add scenario tests for S29 and S38–S41 (guest stay with none of the new fields; host list with stance on every row, on no row, on some rows, and an empty list). Run and record the failure. *(BR9.1–BR9.5)*
- [x] **Step 5. Contract.** Add the new optional, nullable fields to the wire types in `src/api/contract/`, update `PROVENANCE.md` in the same commit, pass the fields through the client, and add them to the mocks: null by default, with per-test overrides and an option that leaves them out entirely. Add the one stance function (use as sent when any row carries the field, else join from listings, no join for an empty list). *(BR9.1–BR9.5, FR10.6)*
- [x] **Step 6. Scenarios first: filtering rules.** Add scenario tests for S1–S21, S32–S37, S42 and S43 against the module's public functions. Run and record the failure. *(BR1–BR7, BR11.1)*
- [x] **Step 7. Filtering rules.** Implement in `src/places/`: the entity types, grouping, open evaluation and mode, the five filters with AND and the left-out counts, sort, counts and availability, distance formatting, first-section-open and Clear all. Pure functions only: no network, no storage, no screen code, imports limited to contract types. Zone arithmetic uses the platform's built-in support; no new dependency. The existing hours display helpers are not changed. *(BR1.1–BR7.3, BR11.1)*
- [x] **Step 8. Scenarios first: remembered choices.** Add scenario tests for S22–S28 and S44–S46 using a substitute storage object, including one that throws. Run and record the failure. *(BR8.1–BR8.8, BR7.3)*
- [x] **Step 9. Remembered choices.** Implement the storage module in `src/places/`: key from property id, stay dates and format version, with no token and no guest name; reads returning found, none, unavailable or unusable; writes returning saved or failed; restore that drops what no longer applies; pruning of ended, invalid and older-format entries; one console warning per page load on failure. Add the storage-only lint allowance for this one file and extend the lint configuration test. *(BR8.1–BR8.8, NFR4, ADR-006)*
- [x] **Step 10. Scenarios first: shared controls.** Add scenario and keyboard-only tests for S30, S31, S47 and S48, and for chip pressed state, checkbox group and radio group naming and arrow-key behaviour. Run and record the failure. *(BR10.1–BR10.7)*
- [x] **Step 11. Shared controls.** Add to `src/design-system/primitives/`: chip, chip row, collapsible section header (a button inside a heading whose level the caller sets, default level three), filter sheet with draft, confirm, close and Clear all, checkbox group, radio group. Make the existing dialog render outside the application root and mark the rest of the page inert. No knowledge of places in any of them. No second tab set is introduced anywhere. Export them from the design system's entry file. *(BR10.1–BR10.7)*
- [x] **Step 12. Scenarios green.** Run every scenario file from steps 4, 6, 8 and 10 until they pass, and confirm the existing dialog tests still pass. *(all rules)*
- [x] **Step 13. Unit tests for logic.** Add unit tests, 5 to 8 per logic module, for cases the scenarios do not reach: time and span parsing, zone edge cases around midnight and daylight-saving changes, rounding boundaries, key building and value validation, the stance function. *(BR2, BR6.1, BR8, BR9.5)*
- [x] **Step 14. Coverage declaration.** Confirm the new modules fall inside the coverage `include` set in `vite.config.ts` and are not excluded. No threshold is changed. *(Testing Contract)*
- [x] **Step 15. Quality gates.** Run type-check, lint, format check, the build, and the full suite with coverage. Coverage stays at or above the configured floors (80% lines, 70% branches) and lines do not fall below the Step 1 baseline. *(Testing Contract)*
- [x] **Step 16. Record.** Commit in small single-concern commits. Write `source-manifest.json`, `code-summary.md` and `traceability.json` in this folder. *(traceability)*

Not applicable to this unit: database work, deployment artifacts, the live-backend end-to-end suite (no screen changes here; the screen units own that).

## Requirement to Step Traceability

| Requirement | Steps |
|---|---|
| FR1 collapsible categories (shared header, grouping, first open) | 6, 7, 10, 11 |
| FR2 distance (bands, display, nearest first) | 6, 7 |
| FR3 category filter | 6, 7, 10, 11 |
| FR4 open filter and its mode | 6, 7 |
| FR5 price filter | 6, 7 |
| FR6 host picks filter | 6, 7 |
| FR7 controls, counts, Clear all | 6, 7, 10, 11 |
| FR8 places with no value, filters not offered | 6, 7 |
| FR10.6 frontend copy of the response fields | 4, 5 |
| FR11 remembered choices | 8, 9 |
| NFR1, NFR2 accessibility and phone fit of the shared controls | 10, 11 |
| NFR3 speed | 6, 7 |
| NFR4 storage boundary, nothing sensitive stored | 8, 9 |
| NFR6 works against an older backend | 4, 5 |

## Files Expected to Change

- New: `src/places/` (entry file, filtering rules, remembered choices, their scenario and unit tests); new control files and tests under `src/design-system/primitives/`.
- Changed: `src/api/contract/entities.ts` and `PROVENANCE.md`; `src/api/client.ts` if the mapping needs it; `src/mocks/backend.ts` and `src/mocks/handlers.ts`; the existing dialog control and `src/design-system/index.ts`; `eslint.config.js` and `src/eslintConfig.test.ts`.
- Not changed: anything under `src/guest/` or `src/owner/`. The screens switch to the shared rules in the next two units.

File names follow the naming rule: PascalCase when a file's main export is a component, camelCase otherwise. The developer may find a file here does not need to change, or that a neighbouring file does. Any difference is recorded in `code-summary.md` and `source-manifest.json`.

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
**Date:** 2026-10-11T05:06:18Z
**Iteration:** 3
**Request Challenge:** review:1eda854e35bcf231073fe6e4bc8aa3a0

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Minor | aidlc/spaces/default/intents/260927-places-filters/construction/u2-places-foundation/functional-design/rules.md > BR9.5 and BR3.3 | The code now goes beyond BR9.5 as written. BR9.5 says that under an older backend stance is "joined from the listings call exactly as today", and a place with no listing has no stance. `withHostStance` in src/places/hostStance.ts now takes an optional `pickedIds` argument, and a picked place with no listing becomes `featured`. This matches the host panel's section 3a (a picked place with no stance counts as a host pick) and the backend treatment of picks for guests. But rules.md still says the older thing, and BR3.3 does not say what makes a host pick. | Record the departure: amend BR9.5 (picked place with no listing is featured, older shape only, listing wins, ignored for an enriched list) and add one line to BR3.3 saying a guest place with no stance counts as featured while a host row with no stance does not. A note in the code summary is enough if the design files are frozen. | New |
| R-02 | Minor | aidlc/spaces/default/intents/260927-places-filters/construction/u2-places-foundation/code-generation/code-summary.md | The unit's own summary does not mention the three later commits (126575b, 6105d54, 97db912 with cc62982). They are recorded in the guest tab and host panel summaries only. A reader of this unit's summary would not know the guest host-pick rule, the `countLabel` input or the `pickedIds` input exist. | Add a short "Changed after review" paragraph pointing to the two later summaries. This is a documentation gap, not a code problem. | New |

### What I checked

- **126575b, guest host pick.** `(place.stance ?? 'featured') === 'featured'` matches u3 section 3a (stance only; `recommended` and `hostAdded` excluded; no stance reads as featured, like `PlaceCard`). The host adapter keeps `stance === 'featured'`, so a null host stance is "not picked" (u4 section 3a). The comments state this asymmetry. Tests assert featured, no stance, listed with `recommended`, listed with `hostAdded`, and hidden/offered, plus a host row with null, listed, offered and featured. They would fail if the rule were wrong. The flipped scenario S29 (host picks offered with no stance, `hostPicks: true`) is correct: a missing stance has always counted as featured on the guest side, and the comment says so. The removed assertion (`recommended: true` makes a pick) was the old behaviour and is correctly replaced by its opposite.
- **6105d54, `countLabel`.** Optional, called only when `count` is given, and used for both visible text and accessible name. Dimming still depends on `count === 0`. Callers without it get the bare number as before (tested, including the dimmed zero case). The only caller using it is `src/places-ui/PlaceCategorySection.tsx`. This meets BR10.2.
- **97db912, `pickedIds`.** The parameter defaults to `[]`, so existing callers are unchanged (tested). It applies only in the older shape, a listing outranks it, and an enriched list ignores it (all tested). The one non-test caller is the host `PlacePicker`, which passes the guide's picked ids. Consistent with BR9.5's single-function intent and u4 section 3a.
- **Unit shape.** No file under src/places imports from src/guest, src/owner or src/places-ui. The only `localStorage` use under src/places is in placePreferences.ts, the one storage module. No network calls there. No screen code was added.
- **Nothing weakened.** eslint.config.js, src/eslintConfig.test.ts, src/dialogSurfaces.test.tsx, src/api and src/mocks have no diff since cf67513. The changes only add tests or change one expectation for a stated reason.
- **Manifest and traceability.** Every path in source-manifest.json exists in the repo, and the seven changed files are all listed. Traceability targets I sampled resolve to listed files.
- **Run results.** `tsc --noEmit` clean, eslint on src/places and src/design-system clean, 69 test files and 920 tests pass. Coverage for src/places is 99.75% lines and `hostStance.ts` and `filterablePlace.ts` are at 100%. The suite's coverage thresholds were not reported as failing.

### Summary

The three post-review changes are correct against the guest and host mapping tables, backwards compatible for callers that omit the new inputs, and covered by tests that assert behaviour. The unit's boundaries and manifest still hold. Two Minor notes remain: rules.md should record the BR9.5 and BR3.3 departure, and this unit's code summary should point to where the later changes are documented.
