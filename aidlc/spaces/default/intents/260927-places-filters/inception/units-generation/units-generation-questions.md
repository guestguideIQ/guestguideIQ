# Units Generation — Questions

Context: the component catalogue (`../domain-design/components.md`) has eleven components across two repos, and the decision records (`../domain-design/decisions.md`) fix how they relate. The requirements are in `../requirements-analysis/requirements.md`. A unit is a piece of work that is designed, built and tested as one. Each unit gets its own functional design and its own build pass, so more units means more separate passes.

Already fixed, so not asked:
- The two repos deploy separately, and the backend change is backwards compatible, so it can go out first.
- The order in which units are built is not decided at this step.

## Q1. How finely should the work be split into units?

A. Four units: the backend API additions; a frontend foundation (types, API client, test mocks, the filtering rules, remembered choices, and the shared controls); the guest Places tab; the host panel
B. Six units: the backend API additions; frontend types, client and mocks; the filtering rules and remembered choices; the shared controls; the guest Places tab; the host panel
C. Two units: one per repo (backend, frontend)
D. Not yet defined
X. Other (please specify)

[Answer]: A. Four units: the backend API additions; a frontend foundation (types, API client, test mocks, the filtering rules, remembered choices, and the shared controls); the guest Places tab; the host panel

## Q2. Can frontend units be built before the backend unit is finished?

The frontend's tests already replace the backend at the network boundary with mocks. If the response shapes are agreed first, frontend work does not have to wait for the backend code.

A. Yes: frontend units depend on the agreed response shapes, not on the finished backend, so they can be built alongside it
B. No: every frontend unit waits for the backend unit to be finished
C. Not yet defined
X. Other (please specify)

[Answer]: A. Yes: frontend units depend on the agreed response shapes, not on the finished backend, so they can be built alongside it

## Consolidated Summary Confirmation

- Four units (Q1):
  - `u1-places-api` (kind: service): the backend additions. Distance per place, the property's timezone on the guest response, and the host's enriched place list
  - `u2-places-foundation` (kind: library): frontend types, API client and test mocks for the new response shapes, the shared filtering rules, remembered choices, and the shared controls
  - `u3-guest-places` (kind: ui): the guest Places tab with filters, collapsible categories and the "Host pick" label
  - `u4-host-curation` (kind: ui): the host panel with the same filters and collapsible categories
- Frontend units depend on the agreed response shapes, not on the finished backend, so they can be built alongside it (Q2)
- Dependencies: the guest tab and the host panel each depend on the foundation. The backend unit and the foundation depend on nothing. The two screens do not depend on each other
- The repos deploy separately, and the backend change is backwards compatible

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
