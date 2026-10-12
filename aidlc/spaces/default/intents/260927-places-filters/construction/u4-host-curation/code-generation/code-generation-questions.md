# Code Generation Questions: u4-host-curation

## Plan Approval

Approve this exact Code Generation plan?

This covers `code-generation-plan.md`, the Testing Contract embedded in it, and `unit-test-instructions.md`.

Points to weigh before approving:

- After each curation action the picker re-reads the place list as well as the listings, so the filter and the row always agree. That is one more read per action.
- The guest tab's filter bar, result line, section and option labels move to a shared folder, `src/places-ui/`, used by both screens. The guest tab's behaviour must not change.
- The foundation's stance function gains an optional third input (the guide's picked ids), so a picked place with no listing counts as a host pick under an older backend.
- The branch is cut from the guest tab's branch. The three frontend branches merge in order: foundation, guest tab, host panel.
- Nothing is pushed without a further go-ahead.

[Approval Fingerprint]: sha256:bca653fdab7fedfef3ecc5263f1e24596060c10fa5599084836a8768d5c61264

- Approve Plan — proceed to code generation
- Request Changes — revise the plan

[Answer]: Approve Plan
