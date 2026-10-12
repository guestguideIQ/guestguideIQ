<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-10-02T06:00:00Z — u2-places-foundation: read the user's "choose all recommended options" as an answer for this unit's five questions only, recorded verbatim; it does not carry to later units.
- 2026-10-02T06:00:00Z — u2-places-foundation: defined "open on a day" as that day's own spans only, so an overnight spill-over from the previous night does not make the next day count as open.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-10-02T06:00:00Z — u2-places-foundation: transcribed the response shapes from the backend unit's functional spec rather than defining them here, and added a fallback so a host row with no stance field keeps using the existing listings join; this lets either repo deploy first.
- 2026-10-02T06:00:00Z — u2-places-foundation: extended filter hiding to the host picks filter (hidden when no place is featured), beyond the three filters the requirement names; flagged as an open point for the user.

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-10-02T06:00:00Z — u2-places-foundation: followed the existing theme-preference precedent for the storage lint allowance (storage only, network still forbidden) instead of placing the module under the session folder, since filter choices are not session state.

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-10-02T06:00:00Z — u2-places-foundation: the requirements' NFR4 wording ("existing storage boundary") no longer matches the design; it should be amended or read as "a dedicated storage module".
