<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->


- 2026-10-01T14:00:00Z — u1-places-api: with no numbered acceptance criteria upstream (user stories skipped), traced the unit's functional requirement IDs to business rules in traceability.json instead of AC IDs.
<!-- aidlc-wave-memory:u1-places-api:d7166bef2eaf9560517ad056ad7cccbf6436d86ff80624ab9a22eccbc8c4563f -->

- 2026-10-02T06:00:00Z — u2-places-foundation: read the user's "choose all recommended options" as an answer for this unit's five questions only, recorded verbatim; it does not carry to later units.
<!-- aidlc-wave-memory:u2-places-foundation:5318ebcaccc35f1f67f6cf54dee0c1cc90a2d044e31e9905683bf1ff50b26c61 -->

- 2026-10-02T06:00:00Z — u2-places-foundation: defined "open on a day" as that day's own spans only, so an overnight spill-over from the previous night does not make the next day count as open.
<!-- aidlc-wave-memory:u2-places-foundation:db0a6d060434b687ce70f2c6ef8979c7777f9fc4115823338c8a536fad384bf0 -->

- 2026-10-02T07:30:00Z — u3-guest-places: for a ui unit with no rules file, traced each requirement to the spec's workflows and scenarios, naming the foundation rule it relies on, as the earlier frontend work did.
<!-- aidlc-wave-memory:u3-guest-places:97f52ad2eaabbbc8ae63e037f7d9cb7b49aa02d45e69065e29b38a3e0ac19d6e -->

- 2026-10-02T09:00:00Z — u4-host-curation: read "host's order" on the host panel as the existing by-name order, since the catalogue has no host-chosen order; noted as an open point.
<!-- aidlc-wave-memory:u4-host-curation:e4e9e3171bae56b0e44958de88681a1434c09b17a50521ab9c6ab709968ece23 -->

- 2026-10-02T09:00:00Z — u4-host-curation: recorded the user's "cpntinue" reply as a human turn that released the earlier "2A 3A" answers, quoting both in the receipt, rather than treating it as a new answer.
<!-- aidlc-wave-memory:u4-host-curation:85ef19a86023a17cdace4b88b8dcf7a72c9635807d5523664b8ff2284a41c086 -->
## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->


- 2026-10-01T14:00:00Z — u1-places-api: made this unit's functional spec the single owner of the response shapes shared with the frontend foundation (section 2), standing in for the skipped contract design, as the units review asked.
<!-- aidlc-wave-memory:u1-places-api:4d5fcc2dbdcb6f0558a3f0a21a5c8316a37acaefbde1e01b968ba6907108a2b7 -->

- 2026-10-01T14:00:00Z — u1-places-api: superseded ADR-003 with ADR-007 inside the functional spec (timezone rule as a shared helper), on the user's answer, and corrected the domain design's "no cycle" claim by disclosing the existing route-level tie.
<!-- aidlc-wave-memory:u1-places-api:6b5253cd9450de7d1dfc912ebdc2bc1100460b840f0c6aea927f758c53a7df41 -->

- 2026-10-02T06:00:00Z — u2-places-foundation: transcribed the response shapes from the backend unit's functional spec rather than defining them here, and added a fallback so a host row with no stance field keeps using the existing listings join; this lets either repo deploy first.
<!-- aidlc-wave-memory:u2-places-foundation:c0dfa6bdc486acb17a5d7125acae8a03be58f5d1a201964afce15de9c2c51c6b -->

- 2026-10-02T06:00:00Z — u2-places-foundation: extended filter hiding to the host picks filter (hidden when no place is featured), beyond the three filters the requirement names; flagged as an open point for the user.
<!-- aidlc-wave-memory:u2-places-foundation:af5eca9844ce4513ce639f4f3ec5e18f71a4855bf9e5b7341824e45c5e348dc4 -->

- 2026-10-02T07:30:00Z — u3-guest-places: asked only one question, because the foundation unit's design had already settled the filtering, open-mode and storage behaviour this screen wires up.
<!-- aidlc-wave-memory:u3-guest-places:ecab396a2d7b11af182ce1fdde815ad4241c7aaadb58b7cd62ee3c3991c6727f -->

- 2026-10-02T07:30:00Z — u3-guest-places: logged the two screen units' question prompts back to back, and the second unit's answer receipt was refused twice for want of a new human reply; one human turn carries one answer receipt, even across units.
<!-- aidlc-wave-memory:u3-guest-places:81d4872ca52d205bd6e94c369d10cbdf7ada588036cb6894109312ff648b700f -->

- 2026-10-02T09:00:00Z — u4-host-curation: kept the existing grouping module alive for onboarding only, because the user chose to leave onboarding's picker plain; the panel and onboarding now group differently, and the spec says so.
<!-- aidlc-wave-memory:u4-host-curation:56939617717f1446b3cabc70e4421b81ccda362900c695e1ded9eed6a4cf65cd -->
## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->


- 2026-10-01T14:00:00Z — u1-places-api: a distance failure degrades the guest read (distances null, logged) but an enrichment failure fails the host read, because a half-enriched host list would mislead about stance.
<!-- aidlc-wave-memory:u1-places-api:e33635f7e1039bbb9d291e2beddd479634ce45f02cd2b203c75b053b59d270e4 -->

- 2026-10-01T14:00:00Z — u1-places-api: the shared timezone helper skips the UTC default, which changes stay expiry only for a locality at the default whose property has its own zone; no product path sets that today, and a test pins it.
<!-- aidlc-wave-memory:u1-places-api:281a9c09e94284f015fff85832a6af53c5ec4bc7fb19b2e9bdb3d1daf5aac427 -->

- 2026-10-02T06:00:00Z — u2-places-foundation: followed the existing theme-preference precedent for the storage lint allowance (storage only, network still forbidden) instead of placing the module under the session folder, since filter choices are not session state.
<!-- aidlc-wave-memory:u2-places-foundation:8b207f9482d4a45846bb0775500d8606167f39171b2b6e306bf8e273ec6e7bfc -->

- 2026-10-02T07:30:00Z — u3-guest-places: kept all screen state in the Places panel and made the bar, result line and sections stateless, so the foundation's functions stay the only place behaviour is decided.
<!-- aidlc-wave-memory:u3-guest-places:070cb6355878c45c363256787caf3d9b0cc817d36d3121f74a0bab10ce5c7053 -->

- 2026-10-02T09:00:00Z — u4-host-curation: when a curation action makes a row stop matching, the row leaves the result at once and focus moves on, rather than keeping a stale row visible until the next filter change.
<!-- aidlc-wave-memory:u4-host-curation:1c9cf54a1be6bc9b7ad687f12eeb6f6db44834ecadeadb235a03fdf98a233518 -->
## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->

- 2026-10-01T14:00:00Z — u1-places-api: production counts of located places, hours, prices and real locality zones are still unknown.
<!-- aidlc-wave-memory:u1-places-api:23d1a4c9f235cb6508dfe784ec60d9d83e90e51fa8eb4c2184180d6c285c73f2 -->

- 2026-10-02T06:00:00Z — u2-places-foundation: the requirements' NFR4 wording ("existing storage boundary") no longer matches the design; it should be amended or read as "a dedicated storage module".
<!-- aidlc-wave-memory:u2-places-foundation:c4830a626b77bb3d6cdf94c95a239f23ebea7c8be2098f36cb4f7a023832bdaf -->

- 2026-10-02T07:30:00Z — u3-guest-places: final wording of the left-out notes and the "Host pick" label is left to build time.
<!-- aidlc-wave-memory:u3-guest-places:020e268c2c145db041e2eba6329b5e53d2dd895adbba2b2d65896d71451e135c -->

- 2026-10-02T09:00:00Z — u4-host-curation: whether the filter bar, result line and category section are one shared set of components or built in the first screen unit and reused is left to build time.
<!-- aidlc-wave-memory:u4-host-curation:39ea51037567b71975199d3d5ba114944d11f3596642fd279397ba1c60b3ba6e -->
