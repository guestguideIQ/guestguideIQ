<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-10-01T09:00:00Z — For a brownfield change, catalogued only the components this work adds or changes across both repos, reusing the existing inventory names, rather than re-cataloguing every existing component.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-10-01T09:00:00Z — Recorded the storage module's lint allowance as an ADR (ADR-006) that names the affirmed "no storage outside api/session" practice it widens, instead of treating it as an implementation detail.

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-10-01T09:00:00Z — Moved timezone resolution into Locality rather than calling GuestAccess from GuestContext or duplicating the rule; GuestAccess already depends on GuestContext, so the other direction would be a cycle.
- 2026-10-01T09:00:00Z — Put the host's enriched place list in GuestContext, composed at the HTTP edge at the existing address, because Poi sits below GuestContext and cannot depend on it.

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-10-01T09:00:00Z — The locality timezone defaults to UTC in the database, so "unset" and "set to UTC" are indistinguishable; functional design must define the fallback marker's rule.
