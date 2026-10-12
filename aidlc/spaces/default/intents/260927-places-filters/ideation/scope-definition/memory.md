<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-09-27T23:10:00Z — With feasibility skipped, carried the constraints a constraint register would hold (map key, cost cap, team practices, lighter plan) into a Constraints section of the scope document so they are not lost.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-09-27T23:10:00Z — When the user answered the summary confirmation with a request for a Google Maps vs Mapbox cost model, did the research against live pricing pages instead of recording an answer, then recorded the provider decision as follow-up Q7 and re-presented the summary.

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-09-27T23:10:00Z — Recommended opening the map on demand rather than on every Places tab view, since per-load billing makes volume the cost driver and the user chose to stay within the free allowance.

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-09-27T23:10:00Z — How many curated places lack coordinates? Distance and the map both depend on it; the repository scan should measure it.
