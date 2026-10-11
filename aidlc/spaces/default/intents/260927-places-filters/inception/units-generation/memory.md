<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-10-01T11:00:00Z — With user stories skipped, used the story map to assign functional requirements to units, one owning unit per requirement plus an "also touches" column for the unit that renders it.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-10-01T11:00:00Z — Carried the three accepted domain-design review findings (route ownership, timezone helper, fallback marker) into the backend unit's notes so functional design must answer them, since the user approved domain design without revising.

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-10-01T11:00:00Z — Made the frontend foundation independent of the backend unit: the dependency is on agreed response shapes, shown as a dotted line and an integration point, not a build edge. The cost is contract drift that only the live-backend check can catch.

## Open questions
<!-- example: 2026-10-01T11:00:00Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-10-01T11:00:00Z — The place picker inside the host panel is shared with onboarding; does onboarding get the filters or keep the plain picker?
