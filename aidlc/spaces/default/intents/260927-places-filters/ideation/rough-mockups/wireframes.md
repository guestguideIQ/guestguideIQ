# Wireframes: Places Filters, Collapsible Categories and Map View

Upstream:
- `../intent-capture/intent-statement.md` (the intent-statement): the problem is a long list and not knowing what is close.
- `../scope-definition/scope-document.md` (the scope-document): the in/out boundary per screen.
- `../scope-definition/intent-backlog.md` (the intent-backlog): items B1–B8.

Answers are cited from `rough-mockups-questions.md` as Q1–Q5. The visual references are the Mobbin screens linked in `../market-research/competitive-analysis.md`.

These are low-fidelity wireframes: structure and behaviour only, with no colour or final copy. The screens use the existing guest guide and host panel, the design system in `guestguideiq-frontend/src/design-system`, and mobile-first layout.

## Screen 1: Guest Places Tab, List View (default)

```
+--------------------------------------+
| [Day rail: Fri  Sat  (Sun)  Mon ]    |  <- existing radiogroup
| [ Overview | *Places* | Events ]     |  <- existing tablist (the only one)
|                                      |
| [ List | Map ]                       |  <- toggle, List selected (Q5)
|                                      |
| (Open on Sun) (Host picks) (Dining v)|  <- chip row, scrolls sideways (Q2)
| (Filters 2)                          |  <- opens sheet; badge = active count
|                                      |
| 14 places  - sorted: nearest first   |  <- live count + sort
|                                      |
| v Dining (6)                         |  <- first category open (Q3)
|  +--------------------------------+  |
|  | [photo] Harbour Cafe           |  |
|  | Host pick . $$ . 0.4 mi        |  |  <- distance from property (B2)
|  | Open 8:00-16:00 on Sun         |  |
|  +--------------------------------+  |
|  +--------------------------------+  |
|  | [photo] The Old Mill           |  |
|  | $$$ . 1.2 mi                   |  |
|  +--------------------------------+  |
|                                      |
| > Outdoors (5)                       |  <- collapsed, count visible
| > Culture (3)                        |
| > Shopping (0 places)                |  <- dimmed, filters emptied it (Q4)
| > Other places (0 places)            |
+--------------------------------------+
```

- **Open chip (Q1):** reads "Open now" when today is selected in the day rail, and "Open on [day]" for any other day.
- **Chip row (Q2):** category, open and host picks are one-tap chips. "Filters" opens the sheet (Screen 2) and shows how many filters are active.
- **Categories (Q3, B1):** the first category starts open and the rest collapsed. Every header shows its count, recalculated as filters change.
- **Empty categories (Q4):** a category that filters leave empty stays in place, dimmed, reading "0 places". It can still be opened and shows "None match your filters".
- **Order within a category:** the host's order (featured first) by default. Picking "nearest first" re-sorts within each category (B2). The host's order is not discarded: switching the sort back restores it.
- **Accessibility:** the page `h1` is the property name (existing). Each category header is an `h3` containing a button with `aria-expanded` and the count in its accessible name. The List/Map toggle is a two-option radiogroup or pressed-state buttons, never a second tablist, because the existing Places tabs are the only tablist on the page. The result count sits in a polite live region. Keyboard entry point: the List/Map toggle, then the chip row, then the first category header.

### States

| State | What the guest sees |
|-------|---------------------|
| Loading | Skeleton chips and three skeleton cards under a skeleton category header |
| Populated | As drawn above |
| Filters match nothing | Every category dimmed at "0 places", and a line above them: "No places match. Clear filters" (a button) |
| No categories assigned | The existing flat list, with the chip row and sort still shown but no category headers (the current behaviour, kept) |
| Place has no coordinates | Card shows no distance line. It sorts after places with a distance and never shows as "0 mi" |
| Error loading places | The existing guide error pattern; filters are hidden until places load |

## Screen 2: Filters Sheet (guest tab and host panel)

```
+--------------------------------------+
|  ___                                 |
| Filters                          [X] |
|                                      |
| Distance from the property           |
| ( Any ) ( < 0.5 mi ) ( < 1 mi )      |
| ( < 3 mi ) ( < 10 mi )               |
|                                      |
| Price                                |
| [ Free ] [ $ ] [ $$ ] [ $$$ ] [$$$$] |  <- multi-select
|                                      |
| Sort                                 |
| (o) Host's order   ( ) Nearest first |
|                                      |
| [ Clear all ]   [ Show 9 places ]    |  <- live count
+--------------------------------------+
```

- The distance bands and price levels are illustrative. Requirements will set the exact bands.
- The "Show N places" button updates live as options change, so a guest never applies filters blind (market research trend).
- **Accessibility:** the sheet is a modal dialog. Focus moves to the "Filters" heading when it opens, stays trapped inside while open, closes on Escape, and returns to the "Filters" chip when closed. Distance and sort are radio groups, and price is a group of checkboxes, each with a visible label.

## Screen 3: Guest Places Tab, Map View (should-have, B8)

```
+--------------------------------------+
| [Day rail ...]                       |
| [ Overview | *Places* | Events ]     |
| [ List | Map ]                       |  <- Map selected: map loads now
| (Open on Sun) (Host picks) (Filters) |  <- same filters apply
|+------------------------------------+|
||        o          (H)              ||  (H) = the property
||   o         o                      ||   o  = a place matching filters
||        *            o              ||   *  = selected place
||                                    ||
|+------------------------------------+|
| +----------------------------------+ |
| | Harbour Cafe  Host pick . 0.4 mi | |  <- selected place card
| | Open 8:00-16:00 on Sun  [Details]| |
| +----------------------------------+ |
+--------------------------------------+
```

- The map loads only when the guest picks "Map" (Q5). That keeps loads on demand, as the scope's cost control needs.
- Pins show only the curated places that match the current filters. The property is marked distinctly.
- Choosing a pin shows that place's card. "Details" opens the same full place card as the list.
- Places without coordinates are left off the map. A line reads "3 places aren't on the map", linking back to the list.
- **Accessibility:** the map is supplementary. Every place stays reachable from the list, and the map region is labelled "Map of places near the property". Pins are focusable, named after their place, and move with Tab. The Google attribution stays visible.

### States

| State | What the guest sees |
|-------|---------------------|
| Loading the map | A labelled placeholder: "Loading map…" |
| Map fails to load (key, network or quota) | "The map isn't available right now", with a "Show list" button; the list is unaffected |
| No places match the filters | The map with only the property pin, plus "No places match. Clear filters" |

## Screen 4: Host Area/Places Panel

```
+--------------------------------------+
| Your area's places        [+ Add]    |  <- existing panel header
|                                      |
| (Open now) (Host picks) (Dining v)   |  <- same chip row (scope Q2)
| (Filters)                            |
| 22 places - host's order             |
|                                      |
| v Dining (8)                         |
|  | Harbour Cafe   Featured  0.4 mi | |
|  |                 [Edit] [Hide]   | |  <- existing host actions
| > Outdoors (7)                       |
| > Culture (4)                        |
| > Shopping (0 places)                |
+--------------------------------------+
```

- These are the same filters and collapsible categories as the guest tab (scope Q2). There is no map (scope Q1).
- The open chip always reads "Open now", because the host panel has no day rail (Q1 as confirmed in the summary).
- The existing host actions (edit, hide, feature) stay on each row. Filters change what is shown, not what the guest sees.
- **Accessibility:** the panel heading is an `h2` (existing), and the category headers are `h3` disclosure buttons, as on the guest tab. Keyboard entry point: the chip row after the panel header actions.

## Information Architecture

- **Guest guide** > Places tab > [List / Map] > chip row + Filters sheet > category sections > place cards
- **Host panel** > Your area's places > chip row + Filters sheet > category sections > host place rows

## Assumptions & Open Questions

- The distance bands and price options in Screen 2 are illustrative. Requirements sets the final values.
- Distance unit (miles or kilometres) follows the property's locale. To be confirmed in requirements.
- Whether filter choices persist across visits (for example, per stay on the guest's device) is not decided. Requirements should settle it.

## Review

**Verdict:** READY
**Reviewer:** aidlc-product-lead-agent
**Date:** 2026-09-30T06:05:17Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | `wireframes.md` > all four screens' Accessibility bullets | The stage requires a per-screen accessibility note covering three named elements — heading level, primary landmark regions (header/main/nav/footer), and keyboard entry point. Heading level and keyboard entry point are stated for most screens, but **no screen's note names a primary landmark region**: Screen 1 covers h1/h3 headings, ARIA roles and a live region but never says which landmark (main/header/nav/footer) the Places tab content sits in; Screen 2's dialog note omits it entirely; Screen 3's "map region" label is the closest match but is not tied to header/main/nav/footer; Screen 4 omits it entirely. | Add the primary landmark region to each screen's accessibility bullet (e.g., "the Places list sits in the page's `main` landmark") so all three required elements are present on every screen. | New |
| R-02 | Major | `wireframes.md` > Screen 2 ("Filters Sheet") and Screen 4 ("Host Area/Places Panel") | Screens 1 and 3 each carry a States table covering loading/populated/empty/partial/error. Screens 2 and 4 — one of the two screens this stage must cover, and the shared filter sheet used by both — carry no States table at all. Screen 4's prose says it shares "the same filters and collapsible categories as the guest tab," but never says explicitly whether it also shares Screen 1's loading, error and empty-filter states, leaving the host panel's error/loading behaviour undocumented. | Add a States table (or an explicit "same states as Screen 1" cross-reference) for Screen 4, and at minimum a loading/error note for the Filters sheet in Screen 2 (e.g., what the sheet shows if the live count can't be computed because place data hasn't loaded). | New |
| R-03 | Minor | `wireframes.md` header note ("The visual references are the Mobbin screens linked in `../market-research/competitive-analysis.md`") | The intent-statement commits that "the chosen references are cited in the mockup steps" (`intent-statement.md` > Scope of the Change, `[desc][Q8]`). `wireframes.md` only points generically to the competitive-analysis file once, at the top; individual design decisions (e.g., Q2's chip-row-plus-sheet pattern, Q4's dimmed-empty-category pattern, Q5's on-demand map) don't carry their specific Mobbin screen name or link inline, even though `rough-mockups-questions.md` names some of them in prose ("as in the Reminders reference"). A reader of `wireframes.md` alone can't trace a given screen decision to its specific Mobbin precedent without cross-referencing two other files. | Inline the specific Mobbin reference (name and/or link) next to each decision it justifies in `wireframes.md`, not only in the questions file. | New |

### Summary

The wireframes faithfully reflect all five confirmed answers (Q1–Q5), cover every in-scope backlog item (B1–B8) across both the guest Places tab and the host panel, correctly keep every out-of-scope item (rating filter, host-panel map, device-location distance) out, and use pure-ASCII diagrams throughout. The two Major gaps are both completeness gaps against the stage's own explicit requirements — the landmark-region component of the accessibility note, and full state coverage on the host panel and filter sheet — rather than anything contradicting an upstream decision, so a developer could still build from this with minor clarifying follow-ups; the Minor finding is a traceability convenience rather than a missing fact.
