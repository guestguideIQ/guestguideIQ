# Code Summary: u4-host-curation

Repository: `guestguideiq-frontend`. Branch: `feature/places-filters-host`, cut from `feature/places-filters-guest` at `c7ba213`. 10 local commits. Nothing pushed, no pull request opened. No other branch touched.

## What Was Built

The host's Local recommendations panel now has the same chip row, sheets, result line and collapsible sections as the guest tab, in the same section order, with a distance on each row. Every curation action still works while filtered. The filtering is switched on by a new optional input on the place picker (`filtering`), which only this panel sets. Onboarding keeps the plain picker and its existing grouping. Nothing is remembered between visits, and the host panel has no timer.

## Files

21 paths changed relative to the guest tab's branch. The full list is in `source-manifest.json`.

| Kind | Files |
|---|---|
| Moved to `src/places-ui/` | `PlacesFilterBar.tsx`, `PlacesResultLine.tsx`, `PlaceCategorySection.tsx`, `placeFilterOptions.ts` and its test, from `src/guest/guide/` |
| New | `src/owner/billing/hostPlaces.scenarios.test.tsx`, `curationFocus.ts`, `curationFocus.test.ts` |
| Changed | `src/owner/billing/PlacePicker.tsx`, `LocalityCuration.tsx`, `LocalityCuration.test.tsx`, `hostCuration.test.tsx`; `src/owner/owner.css`; `src/places/hostStance.ts`, `src/places/contract.scenarios.test.ts`; three import lines in `src/guest/guide/PlacesPanel.tsx` |

Not changed: `OnboardingFlow.tsx`, the existing host grouping module, `src/api/`, `src/mocks/`, the design system, the guest stylesheet, any configuration. No dependency added.

## Changes Outside the Screen, as the Plan Authorised

- **Foundation addition.** The stance function takes the guide's picked ids as an optional third input. Under an older backend, a picked place with no listing is `featured`. A listing still wins, and an updated backend's stance is used as sent.
- **Shared pieces moved.** Two of the moved pieces gained one optional input each for the host panel: the section can be told how to wrap its rows (the host's rows need a list wrapper), and the result line can carry one extra note. Without those inputs the guest tab's markup is identical. The filter bar and option labels are unchanged.

## Test Results

For this checkout's own tests (untracked working copies excluded on the command line).

| | Guest tab's branch | This unit |
|---|---|---|
| Tests passing | 856 of 856 | 908 of 908 |
| Line coverage | 93.56% | 94.25% |
| Branch coverage | 91.07% | 91.57% |

- 36 host scenarios, 4 stance cases and 12 focus unit tests added.
- Type-check and build exit clean. Lint reports 0 errors and the 1 warning that predates this work.
- No threshold, exclusion or lint rule was changed.
- `npm run test:coverage` and `npm run format:check` were not run as scripted, for the reasons recorded in the foundation unit. The changed files pass Prettier with line endings ignored.

### Scenario-first evidence

- **Panel scenarios:** before any implementation, 31 failed and 5 passed of 36. All 31 failed on behaviour against the real owner app (for example no group named "Filter places", no button named "Outdoors 2 places", no text "0.4 mi"). The 5 that passed assert absence or unchanged behaviour, including both onboarding cases. The committed file is a corrected version of the first run: the onboarding scenario's setup and two queries were fixed before committing.
- **Stance cases:** 1 of the 4 new cases failed on behaviour before the change. The other 3 are guards that already passed and were never seen failing.

## Existing Tests Changed

1. `hostCuration.test.tsx`, the feature and stop-featuring test: its stand-in backend always answered "featured" on the listings read. The picker now re-reads after a stance change, so the stand-in returns what was last saved. Assertions unchanged.
2. `LocalityCuration.test.tsx`, the category grouping test: its data was in the older response shape, which this panel now shows as a flat list. The rows gain a shared category and the test reads the new headers, opening the second section before looking in it.

No guest test changed. No onboarding test changed. The guest tab's only edits are three import lines.

## A Bug Found by Looking, Not by the Tests

In a real browser, after "stop featuring" under Host picks, the row left and the count dropped, but focus fell to the page body. A flag that marked "the re-reads have landed" was read too early. It was fixed in the first round, but no automated test would have caught it coming back. The first review made that its one Major finding; see the next section.

## First Review and What Changed

The first review was not ready. Six more commits followed (16 in total on this branch, 23 paths changed); the new tests were committed before the fixes.

| Finding | Outcome |
|---|---|
| R-01 (Major): the focus fix rested on timing no test exercised, and a second action on the same place could be released early by the first action's reads | Fixed. The "follow an action until its reads are shown" logic is now a hook of its own, `useFollowAction.ts`, keyed on an action number, with 10 tests that drive the render sequences directly. With the old timing put back, one of those tests fails; with matching by place put back, another fails. Re-checked in a browser: focus landed on the next row, on the next row again after two actions on one place in the same instant, and on the section header when the last row left |
| R-02 (Minor): a late answer from an older re-read could overwrite a newer one | Fixed. Each read of the place list and of the listings is numbered, and an answer is dropped once a later read of the same kind has started. A scenario releases two reads out of order |
| R-03 (Minor): comments in the moved files still called them guest-only | Fixed, comments only |
| R-04 (Minor): under an updated backend, a picked place whose stance arrives as null is left out of Host picks while its row shows as featured, until the re-read lands or if it fails | Not changed. The backend sends `featured` for such a place, so this is a brief or failure-only state. Recorded |
| R-05 (Minor): the sort option reads "Host's order" where it means by name | Not changed. The design accepted it. Follow-up |
| R-06 (Minor): the duplicated glue, S16's mounting, "Show them" wrapping at 320 px, and the top bar under a sheet's scrim | Not changed. The reviewer confirmed the top bar is the translucent scrim over the bar, as existing owner dialogs already behave, not a new layering fault |

After the fixes: 920 of 920 tests passing, 94.26% lines, 91.59% branches. Type-check and build clean; lint unchanged.

Still true after the fixes:
- A scenario at the panel level was added for the focus bug as the reviewer suggested, but it passes with or without the bug, because the test environment runs each render's effects before the held read is released. The hook's own tests are what would catch it.
- If a newer re-read fails, an older successful answer arriving after it is still dropped, so the rows stay as they were with the banner showing.
- The tips read and the guide read have no ordering guard.
- The out-of-order guard was verified by a scenario only, not in a browser. The browser re-check drove actions by script and read results from the page; no real pointer clicks or screen reader were used.

## Checked by Hand in a Browser

- **320 px, light and dark:** no sideways scroll; the chip row scrolls inside itself; chips 44 px tall; owner colours on chips, sections, rows and the filter sheet; distance under each row's name.
- **1280 px:** mostly measured, not seen, because the browser pane could only capture a cropped view at that width. Two-column rows, no overflow, owner colours in both schemes, the category sheet centred.
- **Onboarding picker at 320 px:** plain list, no chips, no result line, no collapsible headers, no distance.
- **Guest tab after the move, 320 px:** looks as before.
- **Older backend shape:** flat list with only the Host picks chip.

Seen and not fixed:
- At 320 px, "Show them" wraps onto its own line with a small indent.
- The sticky top bar shows through above a sheet's scrim.

Not checked: reduced motion, a screen reader, a touch device, widths between 320 and 1280, the guest tab in dark or at desktop width, onboarding in dark, and the edit, add-a-place and delete flows in a browser (tests only).

## Behaviours Worth Knowing

1. **One more read per action.** Add, remove, feature and stop featuring re-read the place list as well as the listings. Delete and edit keep their existing reads. Saving a note re-reads nothing.
2. **A failed re-read** shows the picker's existing error banner above the chip row. Until the next successful read, a row and the filter can disagree. A scenario pins this.
3. **Focus is moved only when it has been lost.** If the host has already moved elsewhere, they are not pulled back. In a flat list, or when the section is no longer shown, focus goes to the result count; the design did not name that case.
4. **Hosts on an older backend lose the category headings they see today** until the backend is updated: the panel shows a flat list with only the Host picks chip. This was accepted at the design gate.
5. The sort option still reads "Host's order" on the host panel, where it means by name.

## Deviations From the Plan

1. Two files beyond the plan's list: the focus choice as a small pure function, and its unit test.
2. Steps 6 to 9 all land in the picker and were made as one commit, not four.
3. **About 15 lines of glue are duplicated** between the picker and the guest panel (which left-out notes to show, and whether anything is clearable). It calls only foundation functions and holds no rule, but the two copies could drift. Sharing it would have meant changing guest code beyond imports.
4. The paused-setup scenario (S16) mounts the panel directly with the real client, not through the whole owner app, because the app sends an unconfirmed setup to the wizard and the panel cannot be reached paused that way.
5. The thin live-backend suite was not extended, as planned.

## Found and Left Alone

The owner app starts the onboarding wizard at its first step before the server's saved step arrives, so a returning owner mid-wizard starts at step one. This predates this work.

## For Merging

The three frontend branches form one line and merge in order: foundation, guest tab, host panel, each rebased onto `main` first.
