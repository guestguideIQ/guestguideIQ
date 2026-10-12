<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-09-30T09:00:00Z — Chose the backend focus paths (schema plus poi, guide, guestcontext, destination, locality, guestaccess) from the stale store's recorded paths and a directory listing, without reading source, so the snapshot could be taken before the developer scan as the stage requires.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-09-30T09:00:00Z — The frontend scan ran on the checked-out branch brand/fraunces (HEAD 09edbf7), not main; recorded honestly in the knowledge base rather than switching branches mid-stage.

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-09-30T09:00:00Z — Ran both repos' scans in parallel since each codekb is independent; the backend architect started as soon as its scan returned rather than waiting for the frontend.

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-09-30T09:00:00Z — How many production places actually have coordinates, hours and price? The scans suggest near zero; a production count should precede requirements.
- 2026-09-30T09:00:00Z — The Google Maps view conflicts with the current CSP, the no-referrer policy (key restriction) and the built-output secret scan; each needs a security decision before the map is specified.
