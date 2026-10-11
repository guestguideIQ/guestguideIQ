# Market Trends: Place Discovery UI

Upstream: this note serves the scope set in `../intent-capture/intent-statement.md` (the intent-statement), which covers place filters and collapsible categories on the guest Places tab and the host panel. It takes the answers in `market-research-questions.md` as given.

## Observed Pattern Trends

All of these come from Mobbin screens retrieved on 2026-09-27. The links are in `competitive-analysis.md`.

| Trend | Evidence | Implication for this work |
|-------|----------|---------------------------|
| Filter chips sit above the list, with a filter-settings icon leading the row | Google Maps, foodpanda, Gojek, Careem, TheFork | Quick filters (category, open now) belong in a chip row. Less-used ones (price, distance band) can go into a sheet |
| Filter sheets end with a "Show N results" button and a "Clear all" option | Tripadvisor, Viator, Vivino, Best Buy | Show a live count so guests never apply filters that leave nothing to see |
| Map above, list in a draggable bottom sheet | Snapchat, corner, Tabby, TheFork | This is the dominant map-plus-list pattern on mobile, and it fits the new map view (Q6) |
| Curated "picks" lead before the full list | Too Good To Go, Places, corner | Supports "host picks first" (Q3) |
| Status and distance shown on the card ("Open Now · 1.0 mi") | Snapchat, Too Good To Go, Swarm | Distance on every place is the expected baseline (Q2) |

## Constraints You Named

- **Mobile-first**: most guests read the guide on a phone (Q5). The bottom-sheet and chip-row patterns above are built for phone screens.
- **Accessibility**: collapsible sections and filter controls must work with a keyboard and a screen reader (Q5). A collapsible header has to announce whether it is open or closed and be reachable with the keyboard. The team already runs an automated accessibility check, but it only advises and does not block (see the project rules in `aidlc/spaces/default/memory/project.md`).

## Regulatory and Platform Notes

- A browser map key is visible to anyone who loads the page. It has to be restricted to your own domains and must never be treated as a secret. This matches the team rule that any value reachable from frontend code is public.
- Map providers attach terms of use to their tiles and data, such as showing attribution and limits on caching or storing results. Check these at domain design. Hypothesis: Google Maps' terms limit storing its place data, so the map should plot your own place coordinates rather than pull Google's place records.

## Assumptions & Open Questions

- Market size and addressable audience are not relevant to this in-product change, so they are not estimated.
- No usage data exists yet on how guests use the Places tab. The success measure is still undefined (intent capture Q5).
