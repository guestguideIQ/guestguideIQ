# Code Generation Plan: u4-host-curation

Unit: `u4-host-curation` (frontend, repo `guestguideiq-frontend`). Design: `../functional-design/functional-spec.md` (workflows W1–W6, section 3a, scenarios S1–S20) and `frontend-components.md`. This unit holds no rules of its own: every rule is in the foundation unit (`u2-places-foundation`).

## What This Plan Builds

Filtering inside the host's Local recommendations panel: the chip row ("Open now", Host picks, Category, Filters), the two sheets, the result line, collapsible sections in the same order as the guest tab, and a distance on each row. Every existing action (add or remove, feature or stop featuring, notes and tips, edit or delete a host-added place, add a place) keeps working on every visible row.

The filtering is switched on by a new optional input on the existing place picker, which only this panel sets. The onboarding flow keeps the plain picker, unchanged. Nothing is remembered between visits.

## How the Open Review Points Are Resolved

| Point | Resolution in this plan |
|---|---|
| R-08 (Major): under an updated backend the filter reads stance from the place list, but the picker never re-reads the place list after an action, so the filter and the row could disagree | After any action that can change a stance or a pick (add, remove, feature, stop featuring, delete), the picker re-reads the place list as well as the listings, then recalculates. The backend stays the single source of stance, and no stance rule is added to the screen. Cost: one more read per action. If that re-read fails, the rows shown stay as they were and the picker's existing error banner is shown |
| R-09 (Minor): "every action works on a visible row" overstates | Feature, notes, tips, edit and delete appear on picked rows only, as today. The scenarios are written to that |
| Section 3a: a picked place with no stance counts as a host pick. The foundation's stance function takes the place list and the listings only, so under an older backend a picked place with no listing would have no stance | **Addition to the foundation, made in this unit.** The stance function takes the guide's picked ids as a third, optional input: under an older backend, a picked place with no listing gets `featured`, and an unpicked place gets none. Under an updated backend nothing changes; stance is used as sent. Scenario first, in the foundation's own tests |
| Whether the filter bar, result line and section are shared or built twice (left to build time by the design) | **Shared.** The guest tab's filter bar, result line, category section and option labels move from the guest folder to a new neutral folder, `src/places-ui/`, and both screens use them. They hold no rules. The guest tab's behaviour and tests must not change. Each screen styles them within its own surface |
| Foundation review: the count is not announced while the category sheet is open | Already handled inside the shared filter bar built for the guest tab |

## Working Branch

This unit uses the shared pieces built for the guest tab, so its branch, `feature/places-filters-host`, is created from `feature/places-filters-guest`. Commits stay local. Pushing and opening pull requests wait for your go-ahead.

**What this means for merging.** The three frontend branches form one line: foundation, then guest tab, then host panel. They merge to `main` in that order, each rebased onto `main` first so each pull request shows only its own unit. The small foundation addition above and the move to `src/places-ui/` travel with this branch.

## Steps

Scenario first, then implementation, then unit tests only where logic is not reached by scenarios, per the Testing Contract below. Scenario tests mount the real owner app with its providers and substitute only at the network boundary. No child component is mocked.

- [x] **Step 1. Branch and baseline.** Create `feature/places-filters-host` from `feature/places-filters-guest`. Run the checkout's own suite with coverage and record the baseline. No code changes. *(NFR6)*
- [x] **Step 2. Runner check.** Confirm the unit-scoped command in `unit-test-instructions.md` runs. *(Testing Contract)*
- [x] **Step 3. Move the shared pieces.** Move the guest tab's filter bar, result line, category section and option labels (with their unit test) to `src/places-ui/`, and update the guest tab's imports. No behaviour change: the guest scenarios and the full suite must pass unchanged, with no test edited beyond import paths. *(frontend-components: shared pieces)*
- [x] **Step 4. Scenario first, then the foundation addition.** In the foundation's tests, add cases for the stance function with picked ids: older backend with a picked place and no listing gives featured; unpicked gives none; a listing still wins; an updated backend ignores the picked ids. See them fail, then add the optional third input. *(spec section 3a; foundation BR9.5)*
- [x] **Step 5. Scenarios first: the panel.** Add `src/owner/billing/hostPlaces.scenarios.test.tsx` with S1–S20, written to R-09 (controls on picked rows only), plus: after stop-featuring under an updated backend the place list is re-read and the row leaves Host picks (R-08); after a first pick and after a remove the filter and the row agree (R-08); a failed re-read keeps the rows and shows the existing banner. S9 asserts browser storage is never touched. S10 mounts onboarding and asserts no chips, no result line, no collapsible sections. Run and record the failures, which must be on behaviour. *(FR4.2, FR9.1, FR9.2, FR9.4, FR11.5)*
- [x] **Step 6. The filtering input.** `PlacePicker` gains one optional input that turns filtering on, separate from its existing input for per-place controls. With it off, the picker renders exactly as today and keeps its existing grouping module. `LocalityCuration` sets it. *(W6)*
- [x] **Step 7. Place values and open mode.** With filtering on, the picker gets each row's stance through the foundation's stance function (place list, listings, picked ids), builds place values through the foundation's host adapter with rows in name order, and builds the open context for the host panel from the place list's `timezone` and the current moment, taken each time the result is calculated. No timer. *(W1, section 3a; foundation BR2.7, BR9.5)*
- [x] **Step 8. Filter state and rendering.** The picker holds the filter state and open sections for the visit only, starts from defaults with the first section open, and renders the shared filter bar, result line and sections around its existing rows. A row gains its formatted distance. The existing error banner sits above the chip row. With a paused setup the chips, sheets and headers stay usable while action controls stay disabled. The picker never calls the storage module. *(W1, W2, W4, W5; foundation BR5.2, BR7.1)*
- [x] **Step 9. Curating while filtered.** After an action the picker re-reads as in R-08 and recalculates with the current filters; filters and open sections are not reset by a re-read. When a row leaves the result through the host's own action, focus moves to the next row's add-or-remove button, else the previous row's, else the section's header button, and the result line announces the new count. When an edit moves a host-added place to another section, focus follows it if it still shows. When a newly added place does not match, the result line says "Your new place is hidden by the current filters". *(W3)*
- [x] **Step 10. Styles.** Style the shared pieces inside the owner surface using the owner tokens, light and dark, in the owner stylesheet. Section headers are level-three headings under the panel's level-two heading. *(spec section 5)*
- [x] **Step 11. Scenarios green.** Run the new scenario file, the onboarding tests, the existing picker and panel tests and the guest scenarios until all pass. An existing test may change only where the design changes what it asserts; each change is listed in the report. *(all)*
- [x] **Step 12. Unit tests.** Only where needed, for logic the scenarios do not reach, such as choosing the focus target. *(Testing Contract)*
- [x] **Step 13. Quality gates.** Type-check, lint, build, and the checkout's own suite with coverage. Floors (80% lines, 70% branches) hold and lines do not fall below the Step 1 baseline. No threshold or exclusion is changed. *(Testing Contract)*
- [x] **Step 14. Look at it.** Run the app against the mock backend and check the panel in a browser at 320 px and desktop width, light and dark: owner styling on chips, sheets and sections; a row leaving the result after stop-featuring with focus landing on the next row; the onboarding picker unchanged; the guest tab unchanged after the move. Record what was seen. *(FR9.4, NFR1, NFR2)*
- [x] **Step 15. Record.** Commit in small single-concern commits. Write `source-manifest.json`, `code-summary.md` and `traceability.json` in this folder. *(traceability)*

Not applicable to this unit: backend changes, database work, deployment artifacts. The thin live-backend suite is not extended here, because the backend unit's branch is not deployed; that is noted for Build and Test.

## Requirement to Step Traceability

| Requirement | Steps |
|---|---|
| FR4.2 "Open now" from the property's timezone; no chip without one | 5, 7 |
| FR9.1 the same filters, sections and order on the host panel | 3, 4, 5, 6, 7, 8 |
| FR9.2 filtering sends no request and never changes curation | 5, 8, 9 |
| FR9.4 every curation action works while filtered | 5, 9 |
| FR11.5 nothing remembered on the host panel | 5, 8 |

## Files Expected to Change

- New: `src/places-ui/` (the four moved files and their test); `src/owner/billing/hostPlaces.scenarios.test.tsx`.
- Changed: `src/owner/billing/PlacePicker.tsx` and `LocalityCuration.tsx`; the owner stylesheet; `src/places/hostStance.ts` and its tests (the foundation addition); import lines in the guest tab's files.
- Not changed: `OnboardingFlow.tsx`, the existing host grouping module (kept for onboarding), `src/api/`, `src/mocks/`, the design system, and the guest tab's behaviour. If a foundation function or control turns out to be missing something else, the developer stops and reports it instead of adding a rule to the screen.

File names follow the naming rule: PascalCase when the file's main export is a component, camelCase otherwise; multi-word folders are kebab-case. Any difference from this list is recorded in `code-summary.md` and `source-manifest.json`.

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
**Date:** 2026-10-11T04:58:01Z
**Iteration:** 2
**Request Challenge:** review:54eafa64fe4f4805364bc917e03d59ef

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | guestguideiq-frontend/src/owner/billing/useFollowAction.ts and useFollowAction.test.tsx | Closed. The follow logic is now a hook keyed on an action number, and "this render has seen the reads" is state, not a ref flag. I checked the effect order, strict-mode double effects, unmount, an action on a place not shown, and a failed re-read (it still settles, because the re-reads never throw); none of them breaks it. The 10 tests drive real renders of the real hook through a thin harness, including reads landing between a commit and its effects. I put the old behaviours back in throwaway copies outside the tracked files (since deleted; the working tree is clean). With the settled marker on a ref, the "reads land before effects" test failed. With settling that ignores the action number (it marks whichever action is newest as settled), the "second action on the same place" test failed. The hook tests do catch the bug. | None. Relying on the hook tests is acceptable because the panel-level scenario cannot interleave renders in this test environment. The summary says so plainly. | Resolved |
| R-02 | Minor | guestguideiq-frontend/src/owner/billing/PlacePicker.tsx, load / reloadPlaces / loadListings | Closed for the two kinds of read that decide what rows show. The place list shares one counter between the full load and the re-read, so any later start of either kind drops an older answer. The listings have their own counter. A scenario releases two reads out of order and checks the rows and Host picks. The stated consequence (a newer failed read drops an older good answer, leaving the rows as they were under the banner) is accurate and safe. Leaving the tips and guide reads unguarded is acceptable for tips (context only, nothing filters on them). The guide half of load is a smaller gap, see R-07. | None | Resolved |
| R-03 | Minor | guestguideiq-frontend/src/places-ui/ | Closed. The three files changed in comments only. | None | Resolved |
| R-04 | Minor | code-summary.md, First Review and What Changed | Recorded accurately as an unchanged brief or failure-only state, with the reason (the backend sends featured for such a place). Enough for a Minor. | None | Resolved |
| R-05 | Minor | code-summary.md, Behaviours Worth Knowing item 5 | Recorded in two places as an accepted design point and a follow-up. | None | Resolved |
| R-06 | Minor | code-summary.md, Deviations From the Plan items 3 and 4, and Seen and not fixed | Glue duplication, S16 mounting and 320 px wrapping are all recorded; the top bar point is recorded as seen and not fixed. | None | Resolved |
| R-07 | Minor | guestguideiq-frontend/src/owner/billing/PlacePicker.tsx, load: setFavoritedPOIIds(guideResult.data.favoritedPOIIds) | New. Only the place-list half of load is guarded. If an older full load is overtaken, its guide answer still sets the picked ids, so they can come from an older read than the place list beside them. These ids feed the stance join for a pick with no listing. This only affects overlapping edits or deletes, and it existed before this round. Also, a dropped full load returns no new-place ids, so "new place" highlighting can be missed if a re-read overtakes it. | Record in code-summary.md's "Still true after the fixes" list, or number the guide read too. Not blocking. | New |

### Checks run

| Check | Result | Interpretation |
|---|---|---|
| Revert mutants of the hook (marker on a ref; settle ignoring the action number) in throwaway copies | Both caught by the new hook tests | R-01 tests have teeth |
| Full suite with coverage (`npx vitest run --coverage --exclude ".claude/**"`) | 69 files, 920 of 920 pass; 94.26% lines, 91.59% branches | Matches the summary |
| Type-check, and lint on src/owner/billing and src/places-ui | Clean | No new warnings |
| Diff c32b8e0..HEAD against package files, vitest and eslint config, src/guest, src/places, src/api, src/mocks, design system | No changes | No dependency, threshold, exclusion or lint-rule change; places-ui is comments only |
| Existing tests in the fix round | Only import lines changed in hostPlaces.scenarios.test.tsx; nothing removed | No test weakened |
| Onboarding (filtering off) | noteAction returns 0 and settleAction does nothing, so the hook is never driven; the only change is that the guarded reads also apply with filtering off, which is correct | Behaviour unchanged |
| source-manifest.json against git for c7ba213..HEAD | 23 paths, all present, moved files at both paths | Complete |
| traceability.json targets | All target files exist in the diff | Resolves |

### Summary

The Major finding from iteration 1 is genuinely fixed: the hook is correct, tested through real render sequences, and the tests fail when the bug is put back. The ordering guard is sound for the reads that matter, nothing was weakened, and the records are accurate. One new Minor (the unguarded guide read inside load) is noted and does not block.
