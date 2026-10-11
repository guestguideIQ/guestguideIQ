# Scope Document: Places Filters, Collapsible Categories and Map View

Upstream: this scope builds on the intent-statement (`../intent-capture/intent-statement.md`) and the market research in `../market-research/`. Feasibility was skipped in the lighter plan, so no feasibility assessment or constraint register exists. The constraints that would have lived there are listed below. Answers are cited from `scope-definition-questions.md` as Q1–Q7.

## Goal

Help guests find a relevant, nearby place in a long list, and help hosts scan the places they curate. Both screens get filters and collapsible categories, and the guest tab also gets a map view.

## In Scope

| Capability | Guest Places tab | Host area/places panel | Priority |
|------------|------------------|------------------------|----------|
| Collapsible categories | Yes | Yes (Q2) | Must |
| Distance from the property, shown on each place, with a sort by distance | Yes | Yes (Q2) | Must |
| Category filter | Yes | Yes (Q2) | Must |
| Open now filter | Yes | Yes (Q2) | Must |
| Price level filter | Yes | Yes (Q2) | Must |
| Host picks only filter | Yes | Yes (Q2) | Must |
| Map view of the curated places | Yes (Q1) | No (Q1) | Should (Q3) |

The market research carries the positioning into this scope: host picks lead, and filters narrow within the curated places. It also sets two constraints on the whole scope: accessibility (keyboard and screen reader) and mobile-first.

## Out of Scope

- **Rating filter**: places hold no rating data. Recorded as a later idea (intent capture, Q10).
- **Map view on the host panel**: the map is for guests only (Q1).
- **Distance from the guest's device location**: distance is measured from the property or stay address only (intent capture, Q3).
- **Using the map provider's own place records**: the map plots your curated places, not Google's (market research, build-vs-buy).

## Constraints

| Constraint | Source |
|------------|--------|
| No deadline | Q5 |
| Map provider: Google Maps, kept after a cost model against Mapbox | Q7 |
| Map cost control: stay within the free allowance and add a billing alert. The free allowance is 10,000 map loads a month on Google's list pricing (checked on 2026-09-27) | Q6, Q7 |
| The browser map key is public by nature and must be restricted to your domains and to the maps API | Team rule on public frontend values; market research |
| Keep the lighter plan: the map is handled inside the remaining steps | Market research Q8 |
| Team practices apply unchanged: BDD scenario first, blocking CI, coverage floor | `aidlc/spaces/default/memory/team.md` |

## Map Cost Model (Summary)

This model comes from published list prices checked on 2026-09-27. The sources are in `scope-definition-questions.md` Q7.

| Monthly map loads | Google Maps | Mapbox |
|-------------------|-------------|--------|
| ~2,000 (expected, map opened on demand) | $0 | $0 |
| 25,000 | ~$105 | $0 |
| 50,000 | ~$280 | $0 |
| 100,000 | ~$630 | ~$250 |
| 250,000 | ~$1,470 | ~$800 |

Decision: Google Maps (Q7). Because costs are billed per load, the map should open on demand rather than load every time the Places tab opens. That keeps volume close to the expected figure. The billing alert should fire before usage reaches the 10,000-load free allowance.

## Value Stream

| Step | Who | Value delivered | Delivered by |
|------|-----|-----------------|--------------|
| 1. Opens the Places tab or host panel | Guest / host | Sees categories collapsed with counts, so the long list is scannable | Collapsible categories |
| 2. Checks what is close | Guest / host | Distance from the property on every place, with a sort by distance | Distance |
| 3. Narrows the list | Guest / host | Category, open now, price and host-picks filters, with a live result count | Filters |
| 4. Sees where places are | Guest | Curated places plotted on a map around the property | Map view |

## Sequencing

Value-first (Q4): collapsible categories and distance, then the remaining filters, then the map view. The map comes last because it is should-have and the only new third-party dependency. If time runs short, the must-have core still ships as a whole.

## Assumptions & Open Questions

- Success measure: still not defined (intent capture, Q5). Requirements should decide whether a usage signal is tracked.
- Place coordinates: distance and the map both need every place to have coordinates. The repository scan should confirm how many curated places do.
- "Open now" means open at the current time in the property's local timezone. Requirements should confirm this and pin the edge cases, such as places that close after midnight.
