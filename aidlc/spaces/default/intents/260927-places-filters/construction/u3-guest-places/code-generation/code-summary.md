# Code Summary: u3-guest-places

Repository: `guestguideiq-frontend`. Branch: `feature/places-filters-guest`, cut from `feature/places-filters-foundation` at `6105d54`. 9 local commits. Nothing pushed, no pull request opened. No other branch touched by this unit's own work.

## What Was Built

The Places tab of the guest guide now has:

- a chip row with the open chip, Host picks, Category and Filters, showing only the chips the data supports;
- a category sheet (ticks apply at once, with the matching count shown inside the sheet) and a filter sheet for distance, price and sort (applies on confirm);
- a result line with the count, left-out notes with "Show them" and "Hide them", and "Clear filters";
- collapsible category sections, first one open, each header reading "N places";
- a distance and a "Host pick" label on place cards;
- the guest's filters and open sections kept across tab switches and remembered per stay on the device.

Overview, Events and the day rail are unchanged. The three existing tabs are still the only tab set.

## Two Corrections Made to the Foundation First

The first attempt at this build stopped before writing anything, because the foundation's code disagreed with this unit's approved design in two places. Both were corrected on the foundation branch (two commits, `126575b` and `6105d54`), after that unit's review had passed. They are claimed in this unit's `source-manifest.json` and should be checked by this unit's review.

| Mismatch | Correction |
|---|---|
| The foundation counted a guest place as a host pick when it was featured or carried the older `recommended` flag. This unit's design says only `stance` counts, and a place with no stance is treated as featured | The guest adapter now uses stance alone, with no stance meaning featured. The host adapter was already stance-only, where null means not picked; that is unchanged and now pinned by a test |
| The shared section header showed a bare number ("Dining 0"). The design and today's guide read "0 places" | The header takes an optional label for its count. Without it the control behaves as before |

Consequence of the first correction: a guest response in which no place carries a stance offers the Host picks filter, and it matches every place. The current backend always sends a stance for guests. A scenario pins this.

After these two commits the foundation's own suite was 812 of 812 passing.

## Files

Relative to the reviewed foundation (`cf67513`): 21 files. The full list is in `source-manifest.json`.

| Kind | Files |
|---|---|
| New, in `src/guest/guide/` | `PlacesPanel.tsx`, `PlacesFilterBar.tsx`, `PlacesResultLine.tsx`, `PlaceCategorySection.tsx`, `usePlaceChoices.ts`, `placeFilterOptions.ts`, `placeFilterOptions.test.ts`, `guestPlaces.scenarios.test.tsx` |
| Changed | `src/guest/GuestSurface.tsx`, `src/guest/guest.css`, `GuestGuideView.tsx`, `GuideTabs.tsx`, `PlaceCard.tsx`, `guestContent.test.tsx` |
| Deleted | `src/guest/guide/placeGroups.ts`, `placeGroups.test.ts` |
| Foundation corrections | `src/places/filterablePlace.ts`, `placeFilters.test.ts`, `placeFilters.scenarios.test.ts`; `src/design-system/primitives/CollapsibleSection.tsx`, `filterControls.scenarios.test.tsx` |

This unit's own commits changed nothing under `src/places/`, `src/api/`, `src/mocks/`, `src/owner/` or the design system. No dependency was added.

## Test Results

For this checkout's own tests (untracked working copies excluded on the command line).

| | Foundation tip | This unit |
|---|---|---|
| Tests passing | 812 of 812 | 848 of 848 |
| Line coverage | 93.17% | 93.52% |
| Branch coverage | 90.28% | 90.98% |

- 34 scenarios and 8 unit tests added; 6 old grouping tests removed with their module.
- Type-check and build exit clean. Lint reports 0 errors and the 1 warning that predates this work.
- No threshold, exclusion or lint rule was changed.
- `npm run test:coverage` and `npm run format:check` were not run as scripted; both fail on this machine for the reasons recorded in the foundation unit. The changed files pass Prettier with line endings ignored.

### Scenario-first evidence

Before any implementation, the scenario file ran 30 failed and 1 passed of 31. All 30 failed on behaviour against the real guide (for example, no button named "Dining 2 places", no group named "Filter places", no text "Host pick"). Limits:

- S10 (owner's preview) passed beforehand, because it asserts things that are absent.
- Two queries were corrected after implementation (S4 and S18 were matching the wrong element).
- Three scenarios were added after the screen existed and were never seen failing: the grouping case carried over from the old module, the stale remembered category, and the no-chip-row case.
- The first commit holds the corrected scenario file, not the byte-exact first failing version.

## Existing Tests Changed

Four assertions in `guestContent.test.tsx` changed, each because the design changes the markup they read: sections are now collapsible with only the first open; the old section landmarks and class names are gone; and an "Open on Wednesday" chip now exists on the page, so a check that no text says "open" is scoped to the card.

The six cases of the deleted grouping test: four were already covered by the foundation's tests; two (a later row lowering a category's sort order, and exact and category-level rows sharing a section) were not, and are now scenarios in this unit.

## Checked by Hand in a Browser

Against the mock backend, with a temporary page that was deleted afterwards:

- **320 px, light and dark:** the page does not scroll sideways; the chip row scrolls inside itself; chips are 44 px tall; cards show "Host pick" and distance; emptied sections are dimmed, read "0 places" and show "None match your filters" when open.
- **Sheets:** carry the guest colours; the filter sheet's confirm button read "Show 4 places" after choosing a distance band; the page behind could not be focused or clicked.
- **Focus:** returned to the opening chip after confirm and after Escape.
- **1280 px, light and dark:** card grid and sheet looked right.
- **Storage:** the key held the property id and stay dates; no token or guest name in key or value.

Two layout faults were found this way and fixed: extra top padding on every section, and "Clear filters" misaligned with the count.

Not checked: reduced motion, a real screen reader, a real touch device, widths between 320 and 1280, a locality with a brand accent, the owner's preview in a browser, and full Tab-key traversal in a browser (covered by a test, in an environment that does not implement inertness). Unticked checkboxes in dark mode look like dark-grey browser defaults; that styling belongs to the foundation and was left.

## Behaviours Worth Knowing

1. **"Open now" follows the clock.** The current moment is read again when a filter or section changes, when a day is picked, when the Places tab is shown again, when the page returns to the front, and as each minute turns over while the tab is on screen. A refresh never writes to storage, and nothing re-renders or is re-announced when the result has not changed. The timer exists only while the tab is shown and the open filter can be offered. This was the first review's one Major finding (see below).
2. **"Clear filters" does not appear for a changed sort alone**, since sort is not a filter. A guest with only "Nearest first" chosen resets it in the sheet.
3. **"Clear all" inside the filter sheet resets every filter**, including open, Host picks and categories, when confirmed.
4. A remembered filter that can no longer be offered is not shown as on, and is dropped at the next change.
5. Remembered choices are read during the first render that has places, so the guest never sees defaults flash before their choices.
6. With no stay (the owner's preview), storage is never touched, including pruning.
7. A pressed chip is ink on paper, inverted. The locality accent is not used for it.

## First Review and What Changed

The first review was not ready. Four more commits followed (13 in total on this branch); the scenarios that move the clock were committed before the fix.

| Finding | Outcome |
|---|---|
| R-01 (Major): "Open now" was judged against a moment refreshed only when a filter or section changed, so a guide left open past closing time or midnight showed closed places as open | Fixed, as described in item 1 above, in a new file `useMomentRefresh.ts`. Five new scenarios failed on behaviour before the fix (for example a closed cafe still listed after the day rail went away and back). Three more are guards that already passed. The real one-minute timer was checked once by hand in a browser: at closing time the place dropped out, the count updated once, and focus stayed put |
| R-02 (Minor): a changed test no longer proved a section's cards belong to its header | Fixed. The test now follows the header button to the panel it controls and finds the card inside |
| R-03 (Minor): three scenarios never seen failing | Two of the three were broken on purpose, seen to fail, and restored. The carried-over grouping scenario was not |
| R-04 (Minor): with no stance on any place, the Host picks chip is offered and keeps every place | No change. Recorded as known |

After the fix: 856 of 856 tests passing, 93.56% lines, 91.03% branches. Type-check and build clean; lint unchanged.

Still open after the fix:
- The day rail's "today" marker is worked out once per stay in code this unit did not touch. After midnight the chip label is right, but the rail keeps marking the old day as today until the page reloads. This predates this work.
- The page-returns-to-front and across-midnight refreshes were checked in tests only.
- The timer scenarios intercept the browser's timer for delays between one second and one minute. That is a seam on a browser function, not a mocked component.

## Deviations From the Plan

1. Three files beyond the plan's list: a hook holding the guide view's filter state and open mode; a small file for labels and the price conversion; and `GuestSurface.tsx`, which gained an optional storage input passed to the guide so scenarios can supply one.
2. `GuideTabs` now takes one places object in place of the raw list. It has one caller.
3. The "Host pick" label is taken from the foundation's value, not re-derived from stance in the card, so the label and the filter cannot disagree.
4. The first commit does not type-check on its own. This disappears under squash-merge.
5. The thin live-backend suite was not extended, as planned.

## For Merging

The foundation branch must merge to `main` first. This branch is then rebased onto `main` before its own pull request. The two foundation corrections above travel with the foundation branch.
