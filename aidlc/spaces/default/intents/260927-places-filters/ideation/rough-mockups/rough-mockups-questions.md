# Rough Mockups — Questions

Context:
- The intent statement, scope document and intent backlog set the scope: collapsible categories, distance from the property, filters (category, open now, price, host picks) and a filter sheet with a live count on both the guest Places tab and the host panel, plus an on-demand Google Maps view on the guest tab only.
- Already settled: mobile-first and accessibility (market research Q5), and the existing design system in the frontend.
- The Mobbin references are in `../market-research/competitive-analysis.md`.

## Q1. What should "Open now" mean, given the guest guide already has a day rail?

The Places tab already shows each place's hours for the day picked in the stay's day rail. A guest planning tomorrow might want "open on that day" rather than "open right now".

A. Open now: open at the current time, whatever day is selected in the rail
B. Open on the selected day: open at some point on the day picked in the rail
C. Both: "Open now" when today is selected, and "Open on [day]" when another day is selected
D. Not yet defined
X. Other (please specify)

[Answer]: C. Both: "Open now" when today is selected, and "Open on [day]" when another day is selected

## Q2. How should the filter controls be laid out?

The Mobbin references show a chip row for quick filters and a sheet for the rest, ending in "Show N results".

A. A chip row (category, open, host picks) plus a "Filters" chip that opens a sheet for distance and price, with a live result count
B. A chip row only, with every filter as a chip
C. A single "Filters" button that opens a sheet holding every filter
D. Not yet defined
X. Other (please specify)

[Answer]: A. A chip row (category, open, host picks) plus a "Filters" chip that opens a sheet for distance and price, with a live result count

## Q3. How do categories start: collapsed or open?

A. All collapsed, each showing its place count
B. The first category open and the rest collapsed
C. All open, and whatever the guest collapses is remembered
D. Not yet defined
X. Other (please specify)

[Answer]: B. The first category open and the rest collapsed

## Q4. What happens to a category when filters leave it with no places?

A. Hide it
B. Show it dimmed with "0 places", as in the Reminders reference
C. Show it collapsed with "None match your filters"
D. Not yet defined
X. Other (please specify)

[Answer]: B. Show it dimmed with "0 places", as in the Reminders reference

## Q5. How does a guest open the map on the Places tab?

The map opens on demand to keep usage inside the free allowance (scope document).

A. A List / Map toggle at the top of the Places tab
B. A floating "View map" button over the list, as in the Google Maps reference
C. A small map preview above the list that expands when tapped (this loads the map on every visit)
D. Not yet defined
X. Other (please specify)

[Answer]: A. A List / Map toggle at the top of the Places tab

## Consolidated Summary Confirmation

- Open filter follows the day rail: "Open now" when today is selected, and "Open on [day]" for another day (Q1). The host panel has no day rail, so it shows "Open now" only
- Filter layout: a chip row for category, open and host picks, plus a "Filters" chip that opens a sheet for distance and price, with a live result count (Q2)
- Categories start with the first one open and the rest collapsed, each header showing its place count (Q3)
- A category that filters leave empty stays visible, dimmed, showing "0 places" (Q4)
- The map opens from a List / Map toggle at the top of the guest Places tab, so it only loads when chosen (Q5)

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
