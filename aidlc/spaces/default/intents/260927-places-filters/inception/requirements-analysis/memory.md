<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-09-30T14:00:00Z — Read "places missing a value are never wrongly excluded" as: left out of the matches for an active filter, but counted and recoverable from the result line. Recorded as assumption A3 and flagged for the user at approval, since showing unknown-hours places under "Open now" would mislead.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-09-30T14:00:00Z — With user stories skipped, wrote Given/When/Then acceptance criteria under each functional requirement so the BDD-first practice has scenarios to start from.
- 2026-09-30T14:00:00Z — With contract design skipped, put the backend API additions into the requirements as FR10 rather than leaving them implied by the frontend requirements.

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-09-30T14:00:00Z — Framed the questions around the facts the code scan forced (backend scope, missing data, map blockers) rather than re-asking scope; left coordinates-versus-distance and timezone-versus-computed as open questions for domain design instead of deciding them in requirements.

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-09-30T14:00:00Z — Production counts of places with coordinates, hours and price, and properties with a location, are still unknown; the filters may ship hidden.
