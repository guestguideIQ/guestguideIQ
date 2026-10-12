<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-10-01T14:00:00Z — u1-places-api: with no numbered acceptance criteria upstream (user stories skipped), traced the unit's functional requirement IDs to business rules in traceability.json instead of AC IDs.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-10-01T14:00:00Z — u1-places-api: made this unit's functional spec the single owner of the response shapes shared with the frontend foundation (section 2), standing in for the skipped contract design, as the units review asked.
- 2026-10-01T14:00:00Z — u1-places-api: superseded ADR-003 with ADR-007 inside the functional spec (timezone rule as a shared helper), on the user's answer, and corrected the domain design's "no cycle" claim by disclosing the existing route-level tie.

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-10-01T14:00:00Z — u1-places-api: a distance failure degrades the guest read (distances null, logged) but an enrichment failure fails the host read, because a half-enriched host list would mislead about stance.
- 2026-10-01T14:00:00Z — u1-places-api: the shared timezone helper skips the UTC default, which changes stay expiry only for a locality at the default whose property has its own zone; no product path sets that today, and a test pins it.

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-10-01T14:00:00Z — u1-places-api: production counts of located places, hours, prices and real locality zones are still unknown.
