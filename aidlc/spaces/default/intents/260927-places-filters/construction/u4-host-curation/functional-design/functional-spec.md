# Functional Specification: u4-host-curation

Upstream: the unit definition (`../../../inception/units-generation/unit-of-work.md`, U4), its requirement map (`../../../inception/units-generation/unit-of-work-story-map.md`), the requirements (`../../../inception/requirements-analysis/requirements.md`: FR4.2, FR9.1, FR9.2, FR9.4, FR11.5) and the `HostCuration` component in `../../../inception/domain-design/components.md`. Answers in `functional-design-questions.md` are cited as FQ1 and FQ2. There is no contract-summary document.

This unit holds no rules of its own. Every rule it relies on is in the foundation unit's design (`construction/u2-places-foundation/functional-design/rules.md`), cited here as "foundation BRx.y". This document is self-contained for the screen's workflows and states. The component breakdown is in `frontend-components.md`.

## 1. Scope

The host's Local recommendations panel, in `guestguideiq-frontend`. It lists the whole catalogue of places for the property's locality. The actions it offers today, and keeps, are:
- add a place to the guide or remove it (the pick control on every row);
- feature a picked place or stop featuring it, which switches its stance between featured and listed;
- write a note and tips for a picked place;
- edit or delete a place the host added themselves;
- add a place of the host's own.

The panel has no control that hides a place. A hidden or offered stance can only arrive from the backend.

**Who owns the data.** The place picker component loads the place list, the guide's picked ids, the listings and the tips itself, and holds them, the pending toggles and the toggle error as its own state. That does not change. The filtering is added inside the picker, switched on by a new optional input that only this panel sets. With the input off, as in onboarding, the picker renders exactly as it does today.

This unit, inside the picker when filtering is on:
- builds the foundation's place values from the rows the picker already holds;
- holds the host's filter state and which sections are open, for the visit only;
- shows the chip row, the two sheets, the result line and the collapsible sections;
- keeps every existing action working on every visible row.

It does not change what guests see, the onboarding flow, host tips, events, or the plan controls on the same page.

## 2. Screen Layout

Top to bottom inside the places part of the panel:

1. **Chip row:** the "Open now" chip, the Host picks chip, the Category chip, the Filters chip. Each is shown only when the foundation says its filter can be offered (foundation BR5.2).
2. **Result line:** "N places", any left-out notes with "Show them", and "Clear filters" when a filter is active.
3. **Sections:** one collapsible section per shared category, in the same order and with the same "Other places" label as the guest tab (foundation BR1.1, BR1.2). A flat list when no place has a category (foundation BR1.3).
4. **Rows** inside each open section: the existing place row with its pick control and curation actions, plus a distance where known.

## 3. Workflows

### W1. Showing the panel

1. The picker loads the place list, the guide's picked ids, the listings and the tips, as today.
2. Get each row's stance through the foundation's stance function (foundation BR9.5). With an updated backend the stance comes from the place list. With an older backend it is joined from the listings, as today.
3. Build a foundation place value for each row, using the mapping in section 3a.
4. Build the open context: screen is the host panel; timezone from the place list's `timezone`; no selected day; the current moment (foundation BR2.7). With a known timezone the mode is now. With no timezone the mode is unavailable and the open chip is not shown (FR4.2). The current moment is taken each time the result is calculated: on load, on any filter change and after any action. There is no timer, so a list left open does not update by itself.
5. Start from default filters, with the first section open and the rest closed (foundation BR7.1). Nothing is read from storage (FR11.5).
6. Ask the foundation for the result and render it.

Error paths:
- **Place list fails to load:** the picker's existing error banner. No chip row.
- **Empty catalogue:** the existing server-supplied empty message. No chip row and no result line.
- **Guide read fails:** as today, the picker shows no place as picked and reports nothing. Filters still work. Under an updated backend, stance still comes from the place list, so Host picks still works.
- **Listings read fails:** as today, the picker carries on. Under an updated backend nothing changes for the filters, because stance comes from the place list. Under an older backend there is no stance to join, so a picked place counts as a host pick (see section 3a), which matches what its row shows.
- **Tips read fails:** as today, no tips show. Filters are unaffected.
- **Paused setup** (the picker's existing provisional state): every action control stays disabled with its existing reason, as today. The chips, sheets, result line and section headers stay usable, because they change nothing.
- **A pick fails:** the picker's existing error banner shows above the chip row and the pick reverts, as today. The result is recalculated after the revert.
- **Older backend** (rows carry none of the new fields): sections fall back to a flat list, because no row has a shared category; only the Host picks chip can be offered, from the joined stance. The panel still works as a curation list. Until the backend is updated, hosts lose the category headings they see today.

### 3a. From a host place row to a foundation place value

| Foundation value | Taken from the host row | Note |
|---|---|---|
| category | `poiCategory`: its `category` name, `icon` and `sortOrder` | Absent when null or missing. The row's older free-text `category` is not used for grouping here |
| hours | `hours` | Absent when null or missing |
| priceLevel | `priceLevel` | 0 to 4, where 0 is free |
| isFree | not available on a host row | Always absent |
| isHostPick | stance is `featured`, or the place is picked and has no stance | Stance from the foundation's stance function. A picked place with no listing shows as featured in its row today, and the backend treats it as featured for guests, so it counts as a host pick here too |
| distanceMeters | `distanceMeters` | Absent when null or missing |
| hostOrder | position after sorting rows by name | The panel lists places by name today. That stays the "host's order" here |

A place the host added themselves has no shared category today, so it appears under "Other places".

### W2. Filtering

1. The chips and sheets behave as on the guest tab: open and host picks toggle at once; category ticks apply at once; distance, price and sort apply when the filter sheet is confirmed.
2. Every row is treated alike, whatever its stance: featured, listed, hidden, offered or not picked (FQ2). A row whose stance arrives from the backend as hidden or offered is counted in its section and can match any filter. The panel offers no way to set those stances.
3. "Host picks" keeps only rows that are host picks under section 3a (foundation BR3.3). No other filter by stance is offered (FQ2).
4. The result line and left-out notes behave as on the guest tab (foundation BR3.6, BR5.1).

### W3. Curating while filtered (FR9.2, FR9.4)

1. Every action listed in section 1 works on a visible row exactly as it does today: add or remove, feature or stop featuring, notes and tips, edit or delete a host-added place, and adding a place.
2. A filter never sends a request. Only an action does.
3. After an action, the result is recalculated with the current filters. A row that no longer matches leaves the result. For example, with "Host picks" on, a host who stops featuring a place sees it leave the view, and the count drops by one.
4. When a row leaves the result because of the host's own action, focus moves to the add-or-remove button of the next row in the same section. If there is no next row, it moves to that button on the previous row. If the section is now empty, it moves to the section's header button. The result line announces the new count.
5. When an edit moves a host-added place to another section, focus follows the place to its add-or-remove button there, if it still matches the filters and its section is open. Otherwise step 4 applies.
6. When the host adds a place of their own, the picker re-reads the list, as today. If the new place matches the current filters it appears in its section. If it does not, the result line adds "Your new place is hidden by the current filters" beside "Clear filters", and the live region announces it. There is no confirmation message for an added place today, so this note is new.

### W4. Sections

1. Activating a header opens or closes its section.
2. A section with count 0 is dimmed and still operable. Opened, it shows "None match your filters".
3. Changing filters, or curating, never opens or closes a section.

### W5. Nothing is remembered (FR11.5)

1. The filter state and open sections are held in the picker for as long as it stays on screen. Re-reading the list after an action does not reset them.
2. Leaving the page and coming back starts from defaults.
3. The picker never calls the foundation's storage module.

### W6. Onboarding is unchanged (FQ1)

1. The place picker used inside this panel is also used by the onboarding flow.
2. The filters, result line and collapsible sections are switched on by a new optional input on the picker, which only this panel sets. It is separate from the picker's existing input that turns on the host's per-place controls.
3. Onboarding does not set it. It keeps the plain picker, with its existing grouping by the row's free-text category sorted by name. The existing grouping module stays in place for onboarding and is no longer used by this panel.
4. This departs from the foundation unit's functional specification, whose sections 5 and 8 say the host grouping module's logic is replaced when this unit switches to the shared rules. Because of FQ1 it is replaced for this panel only and kept for onboarding.

## 4. Screen States

| State | When | What the host sees |
|---|---|---|
| Loading | The place list is being fetched | The existing loading state. No chip row |
| Empty | The locality has no places | The existing empty message. No chip row |
| Populated, no filters | Places loaded | Chip row, "N places", sections with the first open |
| Populated, filtered | Any filter active | Counts updated; emptied sections dimmed at "0 places"; "Clear filters" shown |
| Nothing matches | Filters exclude every row | "No places match" and "Clear filters" |
| Some left out | An active filter has rows with no value | A note with the count and "Show them" |
| No timezone | The place list has no timezone | No open chip. Everything else works |
| Older backend | Rows carry none of the new fields | A flat list; Host picks chip only |
| Error | The place list failed to load | The existing error banner. No chip row |
| Guide read failed | The picked ids could not be read | No row shows as picked, as today. Filters work |
| Listings read failed | Stance, notes and feedback could not be read | Rows show as today. Filters work; under an older backend, picked rows count as host picks |
| Tips read failed | Tips could not be read | No tips, as today. Filters work |
| Paused setup | The property's setup is not yet confirmed | Action controls disabled with their existing reason. Chips, sheets, result line and headers usable |
| Pick failed | Adding or removing a place failed | The existing error banner above the chip row; the pick reverts |

## 5. Accessibility and Layout

- The panel's heading stays a level-two heading. Section headers are level-three headings containing the shared collapsible header button.
- Keyboard order: the panel's existing header actions, the chip row, the result-line actions, then each section header followed by its rows when open.
- Focus is never lost when a row leaves the result or moves (W3 steps 4 and 5). The element that receives focus is always named: a row's add-or-remove button, or a section's header button.
- The result line is a polite live region (foundation BR10.6).
- The panel sits in the page's existing main region. Nothing here adds a landmark.

## 6. Scenarios to Write First

Each mounts the real owner app with its providers and substitutes only at the network boundary, per team practice.

| # | Given | When | Then | Requirement |
|---|---|---|---|---|
| S1 | A catalogue with places in three shared categories | the panel opens | chips, result line, and three sections in the guest tab's order, first open | FR9.1 |
| S2 | A place list with a timezone | the panel opens | the open chip reads "Open now" | FR4.2 |
| S3 | A place list with no timezone | the panel opens | no open chip; other chips work | FR4.2 |
| S4 | Rows at several distances and prices | a distance band and a price are chosen and confirmed | only matching rows show; the Filters chip shows 2 | FR9.1 |
| S5 | Any filters set | the host filters | no request is sent | FR9.2 |
| S6 | "Host picks" on and a featured row | the host stops featuring it | the stance change is saved as today; the row leaves the result; the count drops by one; focus moves to the next row's add-or-remove button | FR9.2, FR9.4 |
| S7 | Any filters set | the host adds a place to the guide, removes one, features one, edits a host-added place and adds a place of their own | each action works as it does with no filters | FR9.4 |
| S8 | A place list in which one row arrives with stance hidden and one row is not picked | filters are applied | both are counted and filtered like any other row | FR9.1 |
| S9 | Filters set and two sections open | the host leaves the page and returns | defaults; first section open; nothing was written to storage | FR11.5 |
| S10 | The onboarding flow | its place picker is shown | no chips, no result line, no collapsible sections; grouping as before | FR9.1 |
| S11 | A place list from an older backend, and listings | the panel opens | a flat list; stance joined from the listings; Host picks works | FR9.1 |
| S12 | The same catalogue in a guest stay and in the panel | both are grouped | the section names and their order match | FR9.1 |
| S13 | The panel | operated by keyboard only | every chip, sheet, result-line action, section header and row action can be reached and used | FR9.4 |
| S14 | A picked place with no listing, under an updated backend | "Host picks" is turned on | the place matches, and its row shows as featured | FR9.1 |
| S15 | The listings read fails, under an older backend | "Host picks" is turned on | picked places match; no error is added | FR9.1 |
| S16 | A paused setup | the host uses the chips, sheets and section headers | they work; every action control stays disabled with its reason | FR9.4 |
| S17 | Filters set | a pick fails | the existing error banner shows above the chip row; the pick reverts; the result is recalculated | FR9.4 |
| S18 | A price filter set that a new place does not match | the host adds a place of their own | the list is re-read; the result line says the new place is hidden by the current filters; the filters and open sections are unchanged | FR9.4 |
| S19 | "Host picks" on and the only featured row in a section | the host stops featuring it | the section shows "0 places" and focus moves to its header button | FR9.4 |
| S20 | A host-added place | the panel opens under an updated backend | it appears under "Other places" | FR9.1 |

## 7. Open Points

- Hosts will see their list regroup once, from free-text categories sorted by name to the shared categories in their set order.
- "Host's order" on this panel is by name, because the catalogue has no host-chosen order. Requirements used the phrase for the guest tab's server order.
- Onboarding and this panel now group differently. That is the direct result of FQ1 and is accepted.


## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-10-02T14:15:58Z
**Iteration:** 2
**Request Challenge:** review:c5bba2fe5347ba3e33ff268bf536de4e

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | aidlc/spaces/default/intents/260927-places-filters/construction/u4-host-curation/functional-design/functional-spec.md > section 1 Who owns the data, W6; frontend-components.md > Place picker, Data Flow | Verified against src/owner/billing/PlacePicker.tsx: the picker does own pois, favoritedPOIIds, listings, tips, pending and toggleError and is mounted by OnboardingFlow without curate. The revised design keeps loading there and adds an optional filtering input only the panel sets; reads happen once. | None. | Resolved |
| R-02 | Major | functional-spec.md > section 1, W3 step 1, S7, S8 | The action list now matches ListingControls (featured/listed only), HostPlaceActions and the add form; the spec states there is no hide control, and S8 sets up hidden through the place list. | None. | Resolved |
| R-03 | Major | functional-spec.md > W1 Error paths, section 4 | Guide, listings and tips read failures, paused state and failed pick are covered, matching the non-gating loads in PlacePicker and the provisional/toggleError handling. | None. | Resolved |
| R-04 | Minor | functional-spec.md > section 3a isHostPick, S14, S15 | A picked place with no stance now counts as a host pick, matching ListingControls' default of featured. | None. | Resolved |
| R-05 | Minor | functional-spec.md > W3 steps 4-6, section 5 | Focus targets are named, the edit-moves-row case is covered, and the add confirmation is stated as new. | None. | Resolved |
| R-06 | Minor | functional-spec.md > W6 steps 3-4, W1 Older backend, section 7 | The divergence from the foundation spec and the older-backend flattening are recorded. | None. | Resolved |
| R-07 | Minor | functional-spec.md > W1 step 4, section 3a | The moment is taken on every calculation and host-added places land under "Other places". | None. | Resolved |
| R-08 | Major | functional-spec.md > W1 step 2, W3 step 3, S6, S14, S19; frontend-components.md > Data Flow step 4 | Under an updated backend the stance comes from the place list as sent (foundation BR9.5, foundation spec section 2), but the picker never re-reads the place list after a curation action: ListingControls onChanged only updates the listings state, and a pick toggle only calls loadListings. The place-list stance used by the filter is therefore stale after "stop featuring" (S6, S19: the row would not leave Host picks), after a first pick, and after a remove (an unpicked place still carrying featured). The row's own display reads listings, so row and filter can disagree. The spec says the result is recalculated but not from which stance. | State that once the picker holds a listings entry for a place (or the place is picked or unpicked), that live state overrides the place-list stance for the filters; or re-read the place list after each action. Add a scenario for unpick and first pick. | New |
| R-09 | Minor | functional-spec.md > section 1, W3 step 1 | In PlacePicker, feature, notes, tips and edit/delete render only on picked rows (curate and favourited). W3 says every action works on a visible row, which overstates; an unpicked host-added place has no edit or delete. | Say these controls appear on picked rows only. | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| Source check, commit 09edbf7 | PlacePicker, ListingControls, OnboardingFlow match the revised ownership and action claims | R-01 to R-03 resolved; stale-stance gap found in R-08 |

### Summary

All seven prior findings are fixed. One new Major (R-08, stale place-list stance after actions, which breaks S6 and S19 as written) and one Minor remain; zero Critical and one Major gives READY under the verdict rules, but R-08 should be fixed before build.
