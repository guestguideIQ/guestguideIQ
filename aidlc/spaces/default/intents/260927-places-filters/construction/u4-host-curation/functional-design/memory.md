<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-10-02T09:00:00Z — u4-host-curation: read "host's order" on the host panel as the existing by-name order, since the catalogue has no host-chosen order; noted as an open point.
- 2026-10-02T09:00:00Z — u4-host-curation: recorded the user's "cpntinue" reply as a human turn that released the earlier "2A 3A" answers, quoting both in the receipt, rather than treating it as a new answer.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-10-02T09:00:00Z — u4-host-curation: kept the existing grouping module alive for onboarding only, because the user chose to leave onboarding's picker plain; the panel and onboarding now group differently, and the spec says so.

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-10-02T09:00:00Z — u4-host-curation: when a curation action makes a row stop matching, the row leaves the result at once and focus moves on, rather than keeping a stale row visible until the next filter change.

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-10-02T09:00:00Z — u4-host-curation: whether the filter bar, result line and category section are one shared set of components or built in the first screen unit and reused is left to build time.
