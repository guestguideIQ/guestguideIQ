# Functional Specification: u3-guest-places

Upstream: the unit definition (`../../../inception/units-generation/unit-of-work.md`, U3), its requirement map (`../../../inception/units-generation/unit-of-work-story-map.md`), the requirements (`../../../inception/requirements-analysis/requirements.md`: FR1.3, FR4.1, FR6.2, FR7.2, FR7.4, FR8.3) and the `GuestPlaces` component in `../../../inception/domain-design/components.md`. The answer in `functional-design-questions.md` is cited as FQ1. There is no contract-summary document.

This unit holds no rules of its own. Every rule it relies on is in the foundation unit's design (`construction/u2-places-foundation/functional-design/rules.md`), cited here as "foundation BRx.y". This document is self-contained for the screen's workflows and states. The component breakdown is in `frontend-components.md`.

## 1. Scope

The Places tab of the guest guide, in `guestguideiq-frontend`. The same guide renderer is used in the owner's preview, where it receives no places, no property and no stay.

This unit:
- builds the foundation's place values from the guest's places;
- holds the guest's filter state and which sections are open, in the guide view beside the selected day, so they survive switching tabs;
- shows the chip row, the two sheets, the result line and the collapsible sections;
- sets the open filter's mode from the day rail and the property's timezone;
- adds the "Host pick" label to place cards;
- restores and saves the guest's choices through the foundation's storage module.

It does not change the Overview or Events tabs, the day rail, or anything else on a place card.

## 2. Screen Layout

Top to bottom inside the Places tab panel:

1. **Chip row:** the open chip, the Host picks chip, the Category chip, the Filters chip. A chip is shown only when the foundation says its filter can be offered (foundation BR5.2). When none can be offered, the row is not shown.
2. **Result line:** "N places", then any left-out notes, each with a "Show them" action, and "Clear filters" when any filter is active. When nothing matches: "No places match" and "Clear filters".
3. **Sections:** one collapsible section per category, each header showing the name and matching count. Or one flat list when no place has a category.
4. **Place cards** inside each open section, as today, with a distance line and the "Host pick" label where they apply.

The existing Overview / Places / Events tabs stay the only tab set on the page. The List / Map toggle from the wireframes is not built, because the map is out of this work.

## 3. Workflows

### W1. Showing the Places tab

1. Take the guest's places in the order received. Build a foundation place value for each, using the mapping in section 3a.
2. Build the open context: screen is the guest tab; timezone from `property.timezone` on the stay view; the selected day; the current moment (foundation BR2.7). The selected day is passed only when the day rail is shown, which is for stays of two days or more. On a one-day stay and in the owner's preview the guide still has a day value internally, but no rail, so the screen passes no selected day.
3. Ask the foundation which filters can be offered.
4. If the screen has a property id and stay dates, read the remembered choices and restore what still applies (foundation BR8.1, BR8.3, BR8.5). Otherwise start from defaults (foundation BR8.2).
5. With nothing remembered, the first section is open and the rest are closed (foundation BR7.1).
6. Ask the foundation for the result and render it.

Error paths:
- **No places** (including the owner's preview): the existing empty state is shown, with no chip row and no result line (FR8.3).
- **No property or no stay:** filters work in memory. Nothing is read or written (foundation BR8.2).
- **Storage unavailable or unusable:** defaults are used and nothing is shown to the guest. The outcome is returned by the storage module and noted for developers there (foundation BR8.3, BR8.8).

**Where the state lives.** The tab set shows only the active tab's panel, so anything held inside the Places panel is lost when the guest switches to Overview or Events. The filter state and the open sections are therefore held in the guide view, next to the selected day it already holds, and passed down to the Places panel. Remembered choices are read once, when the guide view first has places, not each time the tab is shown. Switching tabs and coming back keeps the guest's filters and open sections, with or without storage.

### 3a. From a guest place to a foundation place value

| Foundation value | Taken from the guest place | Note |
|---|---|---|
| category | `poiCategory`: its `category` name, `icon` and `sortOrder` | Absent when `poiCategory` is null |
| hours | `hours` | Absent when null |
| priceLevel | `profile.priceLevel` | 0 to 4, where 0 is free. The guest type's note says 1 to 4; a 0 must be accepted |
| isFree | `isFree` | Used by the foundation only when there is no price level |
| isHostPick | `stance` is `featured` | Only `stance` is used. The older `recommended` field and `hostAdded` do not make a host pick. A place with no `stance` is treated as featured, as the place card already does |
| distanceMeters | `distanceMeters` | Absent when null or missing |
| hostOrder | position in the received list | The server's order: featured first, then the host's rank |

**Grouping.** The Places tab stops using its own grouping module and uses the foundation's grouping (foundation BR1.1–BR1.4). The old module and its tests are retired in this unit, with their cases carried over to the foundation's tests where not already covered.

### W2. Using the chip row

1. **Open chip.** Its label comes from the mode: "Open now", or "Open on [weekday]". Activating it toggles the filter. When the day rail's selection changes, the label and the result update, and the filter stays on.
2. **Host picks chip.** Toggles the filter.
3. **Category chip.** Opens the category sheet. Each tick applies at once. The chip shows how many categories are chosen.
4. **Filters chip.** Opens the filter sheet with distance, price and sort. It shows the foundation's active sheet-filter count when that is above zero (foundation BR7.2).
5. After any change, the result is recalculated, the result line is announced, and the choices are saved (W5).

### W3. Result line and left-out places

1. The line shows the total matching count.
2. For each of open, price and distance with a left-out count above zero, it adds a note and an action:
   - open: "N places have no hours listed", "Show them";
   - price: "N places have no price listed", "Show them";
   - distance: "N places have no distance", "Show them".
3. "Show them" includes unknown places for that filter (foundation BR3.6). The note is then replaced by "Including places with no [hours / price / distance] listed" and a "Hide them" action. This note carries no number: once such places are included they count as matches, and the foundation's left-out count for that filter is 0.
4. "Clear filters" resets every filter and the sort to defaults (foundation BR7.3). Which sections are open does not change.

### W4. Sections

1. Activating a header opens or closes its section. Nothing else changes.
2. A header with count 0 is dimmed and still operable. Opened, it shows "None match your filters".
3. With a flat list there are no headers, and the cards are listed directly.
4. Changing filters never opens or closes a section.

### W5. Saving choices

1. After any change to filters, sort, include-unknown choices or open sections, the guide view asks the storage module to write the entry, when it has a property id and stay dates.
2. On a failed write the screen carries on with the state it holds in the guide view and shows nothing.

### W6. "Host pick" label (FQ1)

1. A place whose stance is featured shows a "Host pick" label near its name.
2. A place the host added themselves keeps its existing "Recommended by your host" label.
3. A place that is both shows both.
4. The label is text, not colour alone.

### W7. Distance on a card

A place with a known distance shows it as formatted by the foundation (foundation BR6.1). It appears as the first item on the card's existing row of practical chips, the row that already shows price, time needed, effort and setting. A place with no distance shows nothing in its place, and a card with no other chip and no distance has no such row, as today.

## 4. Screen States

| State | When | What the guest sees |
|---|---|---|
| Loading | The stay is being fetched | The existing guide loading state. No chip row |
| Empty | No places, or the owner's preview | The existing empty state. No chip row, no result line |
| Populated, no filters | Places loaded | Chip row, "N places", sections with the first open |
| Populated, filtered | Any filter active | Counts updated; emptied sections dimmed at "0 places"; "Clear filters" shown |
| Nothing matches | Filters exclude every place | "No places match" and "Clear filters"; every section at "0 places" |
| Some left out | An active filter has places with no value | A note with the count and "Show them" |
| Flat | No place has a category | No headers and no Category chip; the other chips, the result line and the list |
| Few filters available | Places lack data | Only the chips whose data exists. For example, with no distances there is no distance section in the sheet and no nearest-first sort |
| Error | The stay failed to load | The existing guide error state. No chip row |

### Open chip label

| Timezone | Day rail | Selected day | Label |
|---|---|---|---|
| Known | Shown | Today | Open now |
| Known | Shown | Another day | Open on [weekday] |
| Known | Not shown (one-day stay) | not passed | Open now |
| Unknown | Shown | Any day | Open on [weekday] |
| Unknown | Not shown | not passed | Open on [today's weekday on the device] |

The chip is not shown when no place has hours.

## 5. Accessibility and Layout

- Section headers are level-three headings containing the shared collapsible header button, as the existing section headings are. A place card's name inside a section is one level below, a level-four heading. In the flat list, with no section headers, card names stay at level three. The Places tab panel keeps its existing place in the page's main region; nothing here adds a landmark.
- Keyboard order inside the panel: chip row, result line actions, then each section header followed by its cards when open.
- The result line is a polite live region (foundation BR10.6).
- Both sheets are modal, and return focus to their chip (foundation BR10.3, BR10.7).
- At 320 CSS pixels the chip row scrolls sideways within itself (foundation BR10.5).

## 6. Scenarios to Write First

Each mounts the real guide with its providers and substitutes only at the network boundary, per team practice.

| # | Given | When | Then | Requirement |
|---|---|---|---|---|
| S1 | A stay with places in three categories and nothing remembered | the Places tab opens | the first section is open, the other two are closed, and each header shows its count | FR1.3 |
| S2 | A stay with a known timezone; the day rail on today | the tab opens | the open chip reads "Open now" | FR4.1 |
| S3 | The same stay | another day is picked in the day rail | the chip reads "Open on [that weekday]" and the result updates | FR4.1 |
| S4 | A one-day stay on a future date, with a known timezone | the tab opens | no day rail; the chip reads "Open now" | FR4.1 |
| S5 | A stay with no timezone | the tab opens | the chip reads "Open on [selected weekday]" | FR4.1 |
| S6 | Three featured and five listed places | the tab opens | the three featured cards show "Host pick"; the five do not | FR6.2 |
| S7 | A featured place the host added themselves | the tab opens | its card shows both labels | FR6.2 |
| S8 | A distance band and one price level chosen in the sheet | the sheet is confirmed | the Filters chip shows 2 | FR7.2 |
| S9 | Several filters active and two sections open | "Clear filters" is chosen | every filter and the sort are at defaults; the same two sections are still open | FR7.4 |
| S10 | The owner's preview, with no places, property or stay | the Places tab is shown | the existing empty state; no chip row; nothing read from or written to storage | FR8.3 |
| S11 | A stay with places and storage that throws | the tab is used | filters work; no error is shown | FR8.3 |
| S12 | Choices set on a stay | the same stay link is reopened | the choices and open sections are restored | FR1.3 |
| S13 | The Places tab | operated by keyboard only | every chip, sheet, result-line action and section header can be reached and used | NFR1 |
| S14 | Filters set and two sections open, with storage that throws | the guest switches to Events and back to Places | the filters and the two open sections are unchanged | FR8.3 |
| S15 | The open filter on and four places with no hours | the tab shows the result | the line reads "4 places have no hours listed" with "Show them"; choosing it lists them and the note reads "Including places with no hours listed" with "Hide them" | FR8.3 |
| S16 | Filters that match nothing | the result is shown | "No places match" and "Clear filters"; every section reads "0 places" | FR7.4 |
| S17 | No place has a category | the tab opens | one flat list; no Category chip; the other chips work | FR8.3 |
| S18 | A section with count 0 | its header is activated | it opens and shows "None match your filters"; the filters do not change | FR1.3 |
| S19 | A listed place with `recommended` true, and a featured place with it false | the tab opens | only the featured place shows "Host pick" | FR6.2 |
| S20 | A place with price level 0 | Free is chosen in the sheet | the place matches | FR7.2 |

## 7. Open Points

- The exact wording of the left-out notes and the "Host pick" label can change at build time without changing behaviour.
- The owner's preview shows the Places tab in its empty state, as today. Showing real places in the preview is not part of this work.

## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-10-02T06:18:00Z
**Iteration:** 2
**Request Challenge:** review:76cbf11a324edb1dc844986b07af961e

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | functional-spec.md > W1 "Where the state lives", W5, S14; frontend-components.md > Components, Guide view | Verified against `GuestGuideView.tsx` (holds `selected` and `selectedTab`, renders `GuideTabs`) and `GuideTabs.tsx`: state now lives in the guide view, is read once, and survives tab switches with or without storage. S14 covers the storage-throws case. | None. | Resolved |
| R-02 | Major | functional-spec.md > W3 step 3, S15 | The included note carries no count. This is consistent with foundation BR3.6, under which an included unknown place is a pass and the left-out count falls to 0. No foundation output is invented. | None. | Resolved |
| R-03 | Major | functional-spec.md > W1 step 2, Open chip label table, S4 | The selected day is passed only when the day rail is shown. This matches `GuestGuideView.tsx` (`days.length > 1`), where `day` is defined even for a one-day stay. The label table has a "Not shown" row for it. S4 covers a future one-day stay. | None. | Resolved |
| R-04 | Minor | functional-spec.md > section 3a isHostPick row, W6, S19 | The source field is now `stance` only. `recommended` and `hostAdded` are excluded, and S19 covers it. An absent `stance` is treated as featured, matching `PlaceCard.tsx` (`poi.stance ?? 'featured'`). `stance` is a pre-existing guest field, not a new one, so foundation BR9.2 does not govern it. The choice is stated and testable. | None. | Resolved |
| R-05 | Minor | functional-spec.md > section 3a | A field-to-value table now exists. It covers category, hours, price, free flag, distance and host order, and states that price 0 must be accepted despite the guest type's 1 to 4 note. S20 covers price 0. | None. | Resolved |
| R-06 | Minor | functional-spec.md > section 3a "Grouping"; frontend-components.md > Data Flow step 4 | The old grouping module (`placeGroups.ts`, called by `GuideTabs.tsx`) is stated as retired, with its tests carried to the foundation. | None. | Resolved |
| R-07 | Minor | functional-spec.md > section 6 | S14 to S20 now cover W3 (left-out note, Show and Hide), nothing matching, the flat list, a section toggle with a 0 count, and the host-pick and price-0 mappings. W7 (distance on the card) has no dedicated scenario, but it is covered at the foundation formatting level and is low risk. | None. | Resolved |
| R-08 | Minor | functional-spec.md > section 5, W7; frontend-components.md > Accessibility | Section headers are h3, card names inside sections are h4, and flat-list cards stay h3. The distance is named as the first item of the existing practical-chips row, which matches `PlaceCard.tsx` (`ul.ggiq-chips`, aria-label "At a glance"). | None. | Resolved |
| R-09 | Minor | functional-spec.md > W1 step 2; frontend-components.md > Data Flow step 1 | Timezone is now read from `property.timezone`. | None. | Resolved |
| R-10 | Minor | functional-spec.md > W1 steps 1 and 4 versus "Where the state lives"; frontend-components.md > Components | W1 lists "restore what still applies" (foundation BR8.5, which needs the availability and category set from the places) under showing the Places tab. The state section says the guide view reads once. The guide view, not the panel, therefore needs the foundation place values to prune stale choices, but the spec says only the panel builds them. A developer can resolve this by sharing one mapping function, so it is not blocking. | At build time, state that the place-value mapping is a shared function called by the guide view for restore and by the panel for results. | New |
| R-11 | Minor | functional-spec.md > section 5; frontend-components.md > Place card | `PlaceCard` is shared and today always renders `h3`. The spec needs h4 inside sections and h3 in the flat list, but does not name how the card is told which level to use. | Name a heading-level input on the card, with h3 as its default. | New |
| R-12 | Minor | functional-spec.md > W3 step 3 | The "Including places with no X listed" note is driven by the include-unknown choice. If no place is actually unknown for that filter, for example after the day changes, the note still appears and describes places that do not exist. | Show the including note only when at least one place is unknown for that filter, or accept and document the behaviour. | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| Source cross-check against `guestguideiq-frontend` (`GuestGuideView.tsx`, `GuideTabs.tsx`, `PlaceCard.tsx`, `entities.ts`) | Claims match | The day-rail condition, tab unmounting, `stance` default, heading levels and chip row are as described. |
| traceability.json | Valid, six requirement rows | FR1.3, FR4.1, FR6.2, FR7.2, FR7.4 and FR8.3 map to existing workflows and scenarios. |
| Foundation cross-check (BR3.6, BR8.1 to BR8.5, BR9.1, BR9.2, BR9.5) | Consistent | No rule is invented in this unit. |

### Summary

All nine prior findings are genuinely resolved against the real frontend source and the foundation rules. The revision introduced only three minor implementation clarifications, so a developer can build the unit without architectural guidance.
