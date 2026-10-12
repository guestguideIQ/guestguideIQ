# Intent Backlog: Places Filters, Collapsible Categories and Map View

Upstream: these items break down the intent-statement (`../intent-capture/intent-statement.md`) using the boundary in `scope-document.md`. Priorities use MoSCoW (Q3). The order is value-first (Q4). The items are proto-units: Units Generation turns them into units of work later.

## Backlog (MoSCoW, in build order)

| # | Item | Screens | MoSCoW | Depends on | Notes |
|---|------|---------|--------|-----------|-------|
| B1 | Collapsible categories with a place count in each header | Guest tab, host panel | Must | none | Accessible disclosure: announces open or closed, works with the keyboard. The Mobbin patterns are in `../market-research/competitive-analysis.md` |
| B2 | Distance from the property on each place, plus a sort by distance | Guest tab, host panel | Must | Place coordinates | Measured from the stay address, never the device |
| B3 | Category filter | Guest tab, host panel | Must | B1 | Quick-filter chip row |
| B4 | Open now filter | Guest tab, host panel | Must | Opening hours data | Property's local time. Requirements must pin the edge cases |
| B5 | Price level filter | Guest tab, host panel | Must | Price level data | Uses the existing price level (free to $$$$) |
| B6 | Host picks only filter | Guest tab, host panel | Must | Host curation data | Supports the "host picks first" positioning |
| B7 | Filter sheet with a live result count and a "clear all" option | Guest tab, host panel | Must | B3–B6 | Stops guests from filtering down to an empty list |
| B8 | Map view of the curated places around the property, opened on demand | Guest tab only | Should | B2, Google Maps key set up and restricted | Should-have. Needs a billing alert and a key restricted to your domains |

## Won't Have (this time)

| Item | Reason |
|------|--------|
| Rating filter | No rating data exists (intent capture, Q10) |
| Map on the host panel | Guest-only map (Q1) |
| Distance from the device location | Distance is from the property only (intent capture, Q3) |

## Dependencies

- B2 and B8 need coordinates on every curated place. The repository scan checks coverage.
- B4, B5 and B6 rely on data that already exists on places: opening hours, price level and host curation.
- B8 needs a Google Maps browser key restricted to your domains, and a billing alert (Q6, Q7).

## Assumptions & Open Questions

- The sizes of these items are unknown until units generation.
- The success measure is still undefined (intent capture, Q5).
