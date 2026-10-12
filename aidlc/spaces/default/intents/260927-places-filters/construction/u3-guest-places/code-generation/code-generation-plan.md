# Code Generation Plan: u3-guest-places

Unit: `u3-guest-places` (frontend, repo `guestguideiq-frontend`). Design: `../functional-design/functional-spec.md` (workflows W1–W7, scenarios S1–S20) and `frontend-components.md`. This unit holds no rules of its own: every rule is in the foundation unit (`u2-places-foundation`), whose built functions and controls are listed in that unit's `code-summary.md`.

## What This Plan Builds

The Places tab of the guest guide: a chip row (open, Host picks, Category, Filters), two sheets, a result line with left-out notes and "Clear filters", collapsible category sections, a distance and a "Host pick" label on place cards, and the guest's choices remembered per stay on the device.

The Overview and Events tabs, the day rail, and the rest of the place card do not change. The existing three tabs stay the only tab set.

## How the Open Review Points Are Resolved

| Point | Resolution in this plan |
|---|---|
| R-10: the guide view restores remembered choices but only the panel builds place values | One function builds the place values from the guest's places. The guide view calls it once per stay view and passes the values down, so the same values serve restoring and rendering |
| R-11: the place card always renders a level-three heading | The place card gains a heading-level input, default three. Sections pass four; the flat list passes nothing |
| R-12: the "Including places with no … listed" note can show when no place is actually unknown | The note is shown only while at least one place is unknown for that filter. The screen learns this by asking the foundation for the same result without that include choice and reading its left-out count. No rule is added to the screen |
| Foundation review R-05: the result count is not announced while the category sheet is open, because the page behind is inert | The category sheet shows the matching count inside itself, in a polite live region, updated after each tick |
| Foundation note: a sheet takes its colours from where it is rendered | Both sheets are rendered inside the guest surface |

## Working Branch

This unit builds on the foundation unit, which is committed locally on `feature/places-filters-foundation` and not yet merged. So this work happens on a new branch, `feature/places-filters-guest`, created from `feature/places-filters-foundation`. Commits stay local. Pushing and opening pull requests wait for your go-ahead.

**What this means for merging.** The foundation branch must merge to `main` first, as its own pull request. This branch is then rebased onto `main` before its own pull request, so each pull request shows only its own unit. Neither is merged from here.

## Steps

Scenario first, then implementation, then unit tests only where a logic unit has branching the scenarios do not reach, per the Testing Contract below. Scenario tests mount the real guide with its providers and substitute only at the network boundary and by passing a storage object in. No child component is mocked.

- [x] **Step 1. Branch and baseline.** Create `feature/places-filters-guest` from `feature/places-filters-foundation`. Run the checkout's own suite with coverage and record the baseline. No code changes. *(NFR6)*
- [x] **Step 2. Runner check.** Confirm the unit-scoped command in `unit-test-instructions.md` runs. *(Testing Contract)*
- [x] **Step 3. Scenarios first.** Add `src/guest/guide/guestPlaces.scenarios.test.tsx` with S1–S20, plus: the including note hidden when no place is unknown (R-12); card names at level four inside sections and level three in the flat list (R-11); the count announced inside the category sheet; a distance shown first on a card's practical row and absent when unknown (W7). Extend the mocks only through the switches the foundation already provides. Run and record the failures, which must be on behaviour, not on missing files. *(FR1.3, FR4.1, FR6.2, FR7.2, FR7.4, FR8.3, NFR1)*
- [x] **Step 4. State in the guide view.** `GuestGuideView` holds the filter state and the open sections beside the selected day; builds the place values once through the foundation's adapter; creates the storage store once per page load; prunes ended entries when the guide opens; reads remembered choices once when it first has places, a property id and stay dates, and restores what still applies; writes after every change. With no property or no stay, nothing is read or written. *(W1, W5; foundation BR7.1, BR8.1–BR8.6)*
- [x] **Step 5. Open mode.** The guide view builds the open context from `property.timezone`, the selected day (passed only when the day rail is shown) and the current moment, through the foundation's function, and takes the chip label from it. *(W1 step 2, W2; foundation BR2.7)*
- [x] **Step 6. Filter bar.** New component: the chip row with only the chips the foundation says can be offered; the category sheet with a tick per category, applied at once, with the count inside the sheet; the filter sheet with distance, price and sort, applied on confirm, with the count on the confirm button. Price levels are converted between numbers and the control's text values here. No chip row at all when nothing can be offered. *(W2; foundation BR5.1, BR5.2, BR7.2, BR10.7)*
- [x] **Step 7. Result line.** New component, a polite live region: the count; a left-out note and "Show them" per filter; the including note and "Hide them" (per R-12); "Clear filters" when any filter is active; "No places match" when nothing matches. *(W3; foundation BR3.6, BR7.3, BR10.6)*
- [x] **Step 8. Sections.** New component wrapping the shared collapsible header at level three: name, count, its cards when open; a zero-count section is dimmed, still operable, and shows "None match your filters" when open. A flat list when no place has a category. Changing filters never opens or closes a section. *(W4; foundation BR1.1–BR1.4)*
- [x] **Step 9. Place card.** `PlaceCard` gains the heading-level input, the "Host pick" label when the place's stance is featured (alongside the existing "Recommended by your host" label where both apply), and the formatted distance as the first item of its practical row. Nothing else on the card changes. *(W6, W7; foundation BR6.1)*
- [x] **Step 10. Wire the tab and retire the old grouping.** `GuideTabs` renders the new Places panel and passes the state and handlers through. Delete `placeGroups.ts` and its test once nothing imports it, first confirming each of its test cases is covered by the foundation's tests and adding any that is not to this unit's scenarios. Add the styles to `guest.css` using existing tokens, light and dark. *(spec section 3a, Grouping)*
- [x] **Step 11. Scenarios green.** Run the scenario file until it passes, and the existing guide tests until they pass unchanged in meaning. An existing test may be updated only where the design changes what it asserts (for example a section that is now closed by default); each such change is listed in the report. *(all)*
- [x] **Step 12. Unit tests.** Only where needed: the price-level conversion and any other logic in the new components that the scenarios do not reach. *(Testing Contract)*
- [x] **Step 13. Quality gates.** Type-check, lint, build, and the checkout's own suite with coverage. Floors (80% lines, 70% branches) hold and lines do not fall below the Step 1 baseline. No threshold or exclusion is changed. *(Testing Contract)*
- [x] **Step 14. Look at it.** Run the app against the mock backend and check the Places tab in a browser at 320 px and at desktop width, light and dark: chip row scrolls inside itself, sheets carry the guest colours, the page behind a sheet cannot be reached, focus returns to the chip. Record what was seen. *(NFR1, NFR2; foundation BR10.3, BR10.5)*
- [x] **Step 15. Record.** Commit in small single-concern commits. Write `source-manifest.json`, `code-summary.md` and `traceability.json` in this folder. *(traceability)*

Not applicable to this unit: backend changes, database work, deployment artifacts. The thin live-backend suite is not extended here, because the backend unit's branch is not deployed; that is noted for Build and Test.

## Requirement to Step Traceability

| Requirement | Steps |
|---|---|
| FR1.3 sections open and closed, first open, remembered | 3, 4, 8 |
| FR4.1 open chip follows the day rail and timezone | 3, 5, 6 |
| FR6.2 "Host pick" label | 3, 9 |
| FR7.2 active-filter count on the Filters chip | 3, 6 |
| FR7.4 Clear filters | 3, 7 |
| FR8.3 empty state, left-out notes, storage failure | 3, 4, 7 |
| NFR1 keyboard and screen-reader use | 3, 6, 7, 8, 14 |

## Files Expected to Change

- New, under `src/guest/guide/`: the filter bar, the result line, the category section, the Places panel, and `guestPlaces.scenarios.test.tsx`.
- Changed: `GuestGuideView.tsx`, `GuideTabs.tsx`, `PlaceCard.tsx`, `src/guest/guest.css`; existing guide tests only where the design changes what they assert.
- Deleted: `src/guest/guide/placeGroups.ts` and `placeGroups.test.ts`.
- Not changed: anything under `src/owner/`, `src/places/`, `src/api/`, or the design system. If a foundation function or control turns out to be missing something this screen needs, the developer stops and reports it instead of adding a rule to the screen.

File names follow the naming rule: PascalCase when the file's main export is a component, camelCase otherwise. Any difference from this list is recorded in `code-summary.md` and `source-manifest.json`.

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
**Date:** 2026-10-11T05:09:14Z
**Iteration:** 3
**Request Challenge:** review:5935669a8b43f56b5f96529b8d3f43ca

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Minor | aidlc/spaces/default/intents/260927-places-filters/construction/u3-guest-places/code-generation/source-manifest.json > writes (four moved files) | The manifest lists PlaceCategorySection.tsx, PlacesFilterBar.tsx, PlacesResultLine.tsx, placeFilterOptions.ts and placeFilterOptions.test.ts at their old src/guest/guide paths, which no longer exist. The new src/places-ui paths are claimed only by the host-panel unit's manifest. | None required to proceed. Optionally add a note in this unit's code-summary pointing to the host-panel unit's move record, or leave as is, since the move is owned and recorded there. | New |
| R-02 | Minor | aidlc/spaces/default/intents/260927-places-filters/construction/u3-guest-places/code-generation/traceability.json > targets for PlacesFilterBar.tsx and PlacesResultLine.tsx (lines 32 and 37) | Two traceability targets name src/guest/guide/PlacesFilterBar.tsx and PlacesResultLine.tsx, which were moved to src/places-ui/. The targets are stale. The other targets (usePlaceChoices, PlaceCard, PlacesPanel, guestPlaces.scenarios.test) still exist. | Optionally repoint the two targets to src/places-ui/. Documentation only, not blocking. | New |
| R-03 | Minor | aidlc/spaces/default/intents/260927-places-filters/construction/u3-guest-places/code-generation/code-summary.md | The summary predates the move and does not mention it. The u4-host-curation summary records it clearly (moved files, generic typing, renderList, notice). | Optionally add one line cross-referencing that summary. Not a defect in the code. | New |

### Verification performed

- Guest output unchanged: with `renderList` and `notice` absent, PlaceCategorySection renders the same tree as at c7ba213 — CollapsibleSection with the same props and heading level 3, the same `ggiq-psection__none` paragraph with the same text for an empty section, and otherwise `<div className="ggiq-pscroll">` around the same cards. The only change is that the card array is computed before the JSX, which does not change the output. The generic `P extends FilterablePlace` is erased at compile time; PlacesPanel passes `GuestFilterablePlace` and the call sites typecheck. PlacesResultLine adds one `{notice !== undefined && ...}` branch that renders nothing for the guest, which passes none. Its existing `ggiq-presult__note` class is the one already used for the left-out notes.
- Stylesheet reliance: the guest CSS keys on class names only (`ggiq-pscroll`, `ggiq-psection__none`, `ggiq-presult__note`, chip and sheet classes), none of which changed. The file location does not matter to CSS. The sheets still render inside whichever surface drew the bar, so they take the guest palette under `.ggiq-guest`. The moved header comments now state this contract (guest.css / owner.css per surface) accurately.
- Moved pieces are rule-free and layer-clean: a grep for imports from src/guest or src/owner inside src/places-ui finds none. They import only `../design-system` and `../places`. Filter rules stay in src/places. placeFilterOptions.ts is wording and price-level conversion only. Nothing in src/ imports an old path (no dangling references to the removed src/guest/guide files). PlacesPanel is the only guest file that changed, with three import lines.
- Tests: no guest test file changed since c7ba213, and the placeFilterOptions test differs only by one import path. `npx vitest run --exclude ".claude/**"`: 69 files, 920 tests, all pass. The guest scenarios mount the real guest surface and pass unchanged. The coverage run printed per-folder tables with no threshold failure, and src/places-ui is at 100% lines, branches, functions and statements.
- Nothing weakened: `git diff c7ba213..HEAD` shows no change to vite.config.ts, eslint.config.js or package.json. `tsc -p tsconfig.app.json --noEmit` is clean and `eslint src/places-ui src/guest` is clean. The coverage include/exclude set is unchanged.
- Working tree in guestguideiq-frontend was clean before and after; nothing was modified there.

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| tsc --noEmit (tsconfig.app.json) | PASS | Generic typing and moved imports resolve. |
| eslint src/places-ui src/guest | PASS | No rule changes; moved files comply. |
| vitest run (with coverage) | PASS, 69 files, 920 tests | Guest scenarios unchanged and green. |

### Summary

The guest Places tab is unchanged in markup, roles, names and classes; the move to src/places-ui is clean, rule-free, free of guest and owner imports, and no check was weakened. The only gaps are stale paths in this unit's source manifest and traceability file and a missing cross-reference in its summary, all documentation-only and recorded as Minor.
