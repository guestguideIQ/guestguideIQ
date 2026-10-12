<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-10-11T06:30:00Z — treated "CI runs before merge" and "the dependency scan is a blocking gate" as measurable targets of this stage, even though no later stage owns them, so they were reported as unverified or not met instead of being left out of the matrix.
- 2026-10-11T06:30:00Z — read the strict cross-unit coverage check literally (19 of 64 IDs named directly) and reported the transitive coverage through design rules beside it, instead of rewriting reviewed traceability records to make the check pass.

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-10-11T06:30:00Z — the dependency audit failed on main in both repos on advisories unrelated to this work; with the human's go-ahead, fixed it in separate pull requests cut from main (backend and admin-api: typescript-eslint 8; frontend: vitest 5) rather than inside the feature branches.
- 2026-10-11T06:30:00Z — a statement made to the human and written into the record, that an automated accessibility check runs in CI, was wrong: the workflow has only a placeholder comment. Corrected in the record and to the human.

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-10-11T06:30:00Z — the human chose to accept the failed stage over a loop-back to Code Generation for one timezone-dependent test and three typing errors, because the loop-back would have cost a fresh plan approval and four more reviews; the fixes go onto the open pull requests instead.

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-10-11T06:30:00Z — what "Open now" should mean when the guest's device is in a different timezone from the property is undecided.
- 2026-10-11T06:30:00Z — whether to add an automated accessibility check, or accept keyboard scenarios and a hand check as meeting NFR1, is undecided.
- 2026-10-11T06:30:00Z — the 100 ms filtering target has never been measured on a phone.
