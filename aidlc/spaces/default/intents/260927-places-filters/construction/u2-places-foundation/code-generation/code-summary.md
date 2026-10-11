# Code Summary: u2-places-foundation

Repository: `guestguideiq-frontend`. Branch: `feature/places-filters-foundation`, cut from `origin/main` at `77625b4`. 14 local commits (10 in the first round, 4 fixing the first review). Nothing pushed, no pull request opened. `main` and `brand/fraunces` are untouched.

## What Was Built

- **Contract:** the new optional response fields in the wire types, the provenance record, and the mocks.
- **Filtering rules:** a new `src/places/` module of pure functions for grouping, open evaluation and mode, the five filters, left-out counts, sort, availability, counts and distance display.
- **Remembered choices:** `src/places/placePreferences.ts`, the only file in this feature that touches browser storage.
- **Shared controls** in the design system: `Chip`, `ChipRow`, `CollapsibleSection`, `CheckboxGroup`, `RadioGroup`, `FilterSheet`.
- **Dialog change:** while any dialog is open, the rest of the page is now inert. The dialog stays where it is placed in the page.

Nothing under `src/guest/` or `src/owner/` changed. Existing dialogs look the same as before; the one behavioural change to existing screens is that the page behind an open dialog can no longer be reached.

## Files

35 files changed (+6442 / −40), none deleted. The full list is in `source-manifest.json`.

| Kind | Files |
|---|---|
| New logic | `src/places/`: `index.ts`, `types.ts`, `hostStance.ts`, `filterablePlace.ts`, `openHours.ts`, `distance.ts`, `placeFilters.ts`, `sections.ts`, `placePreferences.ts` |
| New controls | `src/design-system/primitives/`: `Chip.tsx`, `ChipRow.tsx`, `CollapsibleSection.tsx`, `CheckboxGroup.tsx`, `RadioGroup.tsx`, `OptionText.tsx`, `FilterSheet.tsx`, `inertBackground.ts` |
| New tests | Three scenario files and three unit-test files in `src/places/`; `filterControls.scenarios.test.tsx` in the design system; `src/dialogSurfaces.test.tsx` |
| Changed | `src/api/contract/entities.ts`, `PROVENANCE.md`, `contract.test.ts`; `src/mocks/backend.ts`, `handlers.ts`; `Dialog.tsx`, `primitives.css`, `src/design-system/index.ts`; `eslint.config.js`, `src/eslintConfig.test.ts` |

`src/api/client.ts` needed no change: it passes the response through.

## Test Results

Counts are for this checkout's own tests (see "Gates That Do Not Pass as Scripted").

| | Before | After |
|---|---|---|
| Tests passing | 643 of 643 | 806 of 806 |
| Line coverage | 92.4% | 93.17% |
| Branch coverage | 88.53% | 90.2% |

- `src/places/` alone: 99.75% lines, 98.27% branches.
- Type-check and build exit clean. Lint reports 0 errors and 1 warning that was there before this work.
- The seven existing dialog tests pass unchanged.

### Scenario-first evidence, stated honestly

Scenarios were written before each implementation and run to see them fail. In the first round only the contract run (8 failed of 9) failed on behaviour. The runs for the filtering rules (31 of 31), remembered choices (13 of 13) and controls (20 of 20) failed because the modules did not exist yet, which shows the order of work but not that each assertion can fail. The fix round's failing runs were on behaviour: 8 for the dialog tests and 6 for the minor fixes. Scenarios and implementation were committed together, so the commit history does not show the order, and squash-merge would erase it in any case.

## First Review and What Changed

The first review was not ready. Its findings and their outcomes:

| Finding | Outcome |
|---|---|
| R-01 (Major): rendering dialogs into the document body took the existing owner dialogs out of the owner styling | Fixed. The dialog no longer moves. It renders where it is placed, and everything around it (each sibling of the dialog and of each of its ancestors, up to the body) is marked inert. A new test renders two real owner dialogs and fails if either leaves the owner surface. Checked once in a browser against `origin/main`: computed styles and the panel's position were identical |
| R-02 (Major): the guest tab had no way to give its sheets the guest palette | Fixed by the same change. A sheet inherits the surface it is rendered in. A test covers a sheet inside the guest surface. No new input on any control |
| R-03 (Minor): distance rounded down at exact half-tenths | Fixed, with boundary tests (1.75 mi now shows "1.8 mi") |
| R-04 (Minor): weak scenario-first evidence | Not a code change. Stated above |
| R-05 (Minor): the result count is not announced while the category sheet is open, because the page behind is inert | For the two screen units. The dialog accepts content and a footer, so the count can be shown and announced inside the sheet |
| R-06 (Minor): a test stub not restored; a real category named "Other places"; loose timezone check | The stub was already restored after each test; a comment now says so. A real category with that exact name joins the one catch-all section. A timezone is known only if it has a Region/City name the platform recognises, outside the `Etc/` area |

## Gates That Do Not Pass as Scripted

Both fail the same way on untouched `origin/main`. No configuration was changed to work around either.

- **`npm run test:coverage` exits 1.** The test runner also picks up test files from untracked local working copies under `.claude/worktrees/` inside the frontend folder, and one of those fails (an old typeface test). No test in the checkout fails. With that folder excluded on the command line, the run exits 0 and the floors hold.
- **`npm run format:check` exits 1.** This checkout has Windows line endings. With line endings ignored, every file in the checkout passes. This has not been confirmed in CI.

## Not Verifiable by the Automated Tests

- **The inert page behind a dialog.** The test environment does not implement inertness, so tests assert the attribute is set. Checked by hand in a browser: a button behind the dialog refused focus.
- **Touch-target size and 320 px fit (BR10.5).** No automated test. Checked once by hand in the first round at 320 px wide, light and dark; not re-checked after the fix, whose styling is unchanged. Reduced motion was not exercised.
- **The owner-dialog look** was compared in dark scheme only.
- **The speed guard (S32)** takes the fastest of five runs. It is a regression guard, not a phone measurement.

## Deviations From the Plan or Design

1. **The dialog does not render into the document body.** The approved plan said it would. The review showed that breaks existing dialogs' styling, so the dialog stays in place and the page around it is made inert instead. The design's goal (BR10.3: the page behind cannot be reached) is met.
2. Limits of that approach: an element added beside the dialog while it is open is not inert until the next open or close. A dialog must not be placed inside an element that uses a transform, a filter or clipped overflow, as was already true before this work. Whether any existing dialog sits inside the two blurred bars in the owner styling was not checked.
3. **Timezone check is stricter than the design's wording.** `UTC`, `GMT`, `Etc/UTC`, raw offsets and abbreviations all count as unknown. A property genuinely on UTC gets no "Open now".
4. A real category named exactly "Other places" is merged into the catch-all section and loses its icon.
5. A write has a third outcome, `skipped`, for the no-stay case. The design named only saved and failed.
6. The format version is in the storage key (the plan's resolution) and also kept in the stored value.
7. A newer-format entry sits at a different key, so a read looks for one for the same stay and reports `unusable` when it finds it (S45).
8. Stored keys under this feature's prefix with no readable version are left alone by pruning.
9. The lint allowance was added to the existing theme-preference block's file list, not as a second block, so both files get the identical rule.
10. Two helper files beyond the six controls: a shared option type, and the inert-page bookkeeping, which keeps the page inert until the last of several stacked dialogs closes.
11. Small adapters turn a guest place or a host row into a filterable place, and one function gives the open chip's label. The design said each screen builds its own; these keep the price rule and the label in one place.
12. A day marked closed that also lists hours is treated as closed. The existing place card shows the hours in that case. The backend contract says this combination does not occur.
13. In the mocks, a host row's stance follows the listings rather than defaulting to null, and the property timezone defaults to null.
14. One commit (`a47a47e`) fails lint on its own; the storage allowance arrives in the next commit. This disappears under squash-merge.
15. A comment on the guest price level was corrected from "1 to 4" to "0 to 4".

## What the Next Two Units Need to Know

- Import the rules from `src/places` and the controls from `src/design-system`.
- `applyPlaceFilters(places, state, openContext)` is the whole of workflow W1; run it on the sheet's draft for the confirm count.
- `withHostStance(items, listings)` and `hostListNeedsListings(items)` decide stance for the host panel.
- `createPlacePreferenceStore()` is created once per page load; only the guest tab uses it.
- A sheet takes its colours from wherever it is rendered, so render guest sheets inside the guest surface and host sheets inside the owner surface.
- Show and announce the result count inside the category sheet, since the page behind it is inert.
- `CheckboxGroup` values are text, so price levels need converting at the call site.
- Mock switches for tests: leave the new fields out entirely, set the property timezone, and set per-place details and distances.
