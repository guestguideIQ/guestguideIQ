# Test Results: Places Filters

Run on 2026-10-11 on the development machine (Windows, no database, no container runtime). Backend at `8784bde` on `feature/places-filters-api`. Frontend at `e2bc275` on `feature/places-filters-host`, which contains all three frontend units. Both working trees were clean before and after.

## Outcome

**Not passed.** Every build and test command that could run on this machine passed. CI, run afterwards, confirmed the backend's database reads and found one guest-tab test that depends on the machine's timezone. Three quality targets are not met and two cannot be verified. The local results come first below; the CI results follow them.

## Build

| Repository | Command | Result |
|---|---|---|
| Backend | `npm run typecheck` | Exit 0 |
| Backend | `npm run lint` | Exit 0, no findings |
| Backend | `npm run build` | Exit 0 |
| Frontend | `npm run typecheck` | Exit 0 |
| Frontend | `npm run lint` | Exit 0; 0 errors, 1 warning that predates this work |
| Frontend | `npm run build` | Exit 0; bundle 351 kB script (108 kB compressed), 76 kB styles |

## Tests

| Repository | Command | Passed | Failed | Skipped |
|---|---|---|---|---|
| Backend | `npm run test:coverage` | 822 | 0 | 101 |
| Frontend | `npx vitest run --coverage --exclude ".claude/**"` | 920 | 0 | 0 |

- The backend's 101 skipped tests are its database-backed tests, which skip without a database. They include the two cases this work added.
- The per-unit commands in each unit's `unit-test-instructions.md` name subsets of these two runs. They were not run again separately; every file they name ran inside the full runs above.
- The frontend's scripted `npm run test:coverage` was not used. It also collects tests from untracked working copies under `.claude/worktrees/`, one of which fails for an unrelated reason. That was established during Code Generation and is the same on untouched `main`.

## Coverage

| Repository | Lines | Branches | Functions | Floor | Result |
|---|---|---|---|---|---|
| Backend | 89.1% | 81.85% | 85.25% | 80% lines | Above the floor |
| Frontend | 94.26% | 91.59% | 91.57% | 80% lines, 70% branches | Above both floors |

No threshold was changed in either repository.

## Formatting

| Repository | Command | Result |
|---|---|---|
| Backend | `npx prettier --check --end-of-line auto` over `src`, `tests`, `prisma` | All files pass |
| Frontend | `npx prettier --check --end-of-line auto` over the checkout's own files | All files pass |

The scripted `npm run format:check` fails in both repositories on this machine because the checkouts have Windows line endings. It fails the same way on untouched `main`.

## Dependency Audit

The exact command both CI workflows run as a blocking step:

| Repository | Command | Result |
|---|---|---|
| Backend | `npm audit --audit-level=high` | **Exit 1.** 14 advisories: 12 high, 2 moderate |
| Frontend | `npm audit --audit-level=high` | **Exit 1.** 6 advisories: 2 critical, 2 high, 2 moderate |

- **This work did not cause these.** Neither lockfile changed on any of the four branches. The advisories were published against versions already on `main`.
- **Backend, in what ships:** `@grpc/grpc-js` 1.14.4 (high), pulled in by the telemetry exporter; `fastify` below 5.12.5 (moderate); `fast-uri` (moderate). The other high findings (`brace-expansion`, `braces`, `source-map-js`) are in development tooling.
- **Frontend:** nothing in what ships (`npm audit --omit=dev` reports 0). The findings are in the test and build tooling: `tinypool` (critical), `brace-expansion` and `source-map-js` (high), `@vitest/mocker` (moderate).
- `npm audit fix` alone did not clear either repository. The backend also needed its lint tooling moved from typescript-eslint 7 to 8, and the frontend its test runner from vitest 3 to 5. Both are in the dependency pull requests described under CI Results.
- **Consequence:** as things stand, the dependency-scan step would fail on any pull request to either repository, including the four from this work.

## CI Results

After the local run, the human chose to run CI. Six pull requests were opened on 2026-10-11. Nothing is merged; the four feature pull requests are drafts.

| Pull request | Contents | Result |
|---|---|---|
| guestguideiq-app#69 | Dependency updates, backend and admin-api | First run: backend job passed; admin-api job failed its own audit step. The same updates were then applied to admin-api and pushed. The re-run had not finished when this was written |
| guestguideiq-app#70 | Backend feature (draft) | Lint, format check, type-check, build, migrations against real PostgreSQL, seed check, and all tests with the coverage gate: **pass**. Then fails at the dependency audit, as `main` does. Secret scan, static analysis and the infrastructure scans come after that step and were skipped |
| guestguideiq-frontend#38 | Dependency updates, frontend | All four jobs **pass** |
| guestguideiq-frontend#39 | Foundation (draft) | Verify (format, lint, type-check, build, tests with coverage): **pass**. Built-output scan: pass. Scan: fails at the dependency audit, as `main` does |
| guestguideiq-frontend#40 | Guest Places tab (draft) | Verify: **fails, one test.** Scan: fails at the dependency audit |
| guestguideiq-frontend#41 | Host panel (draft) | Verify: **fails, the same one test.** Scan: fails at the dependency audit |

### What CI settled

- **The backend's database reads work against a real database.** `tests/integration/places.pg.test.ts` ran its 16 tests and passed on #70. This was the largest unverified item from Code Generation.
- **The scripted format and coverage checks pass in CI** for the backend and for the foundation, confirming that their local failures were this machine's line endings and stray working copies.
- **The dependency updates clear the audit** in the frontend (#38 is green) and in the backend's main package.

### What CI found

**One guest-tab scenario depends on the machine's timezone.** In `src/guest/guide/guestPlaces.scenarios.test.tsx`: "given a remembered Open now, when the stay link is reopened after closing time, then the restored filter is judged at the time of reopening". It expects a chip named "Open now" and finds "Open on Thursday".

- **Why.** The test reopens the guide at 20:30 on the 14th in the property's zone, which is 03:30 on the 15th in UTC. The day rail, in code that predates this work, picks "today" from the device's calendar. On a UTC machine that is the 15th, which is not today at the property, so the chip correctly reads "Open on Thursday". On this development machine the device date is still the 14th, so the test passed.
- **Reproduced locally** by running that file with the clock zone set to UTC: the same single failure.
- **Is the product wrong?** The screen follows its rule: "Open now" applies only when the selected day is today at the property. A guest whose device is in a different zone from the property, during the hours when the two dates differ, sees "Open on [weekday]" for the device's day. That is coherent with the day rail beside it. It is worth a product decision, but it is not what failed here. What failed is a test that assumed the machine's zone.
- **The other 919 tests pass in CI.**

### Corrections to earlier statements

- **There is no automated accessibility check.** Requirement NFR1 says the work is "verified by the existing automated accessibility check". The frontend's CI workflow has only a comment where that job would go, saying it is deliberately absent until there are screens to check. Earlier in this record, and to the human, it was described as a CI job that had not run. That was wrong. Nothing runs it anywhere.

### A knock-on from the frontend dependency update

Applied to the tip of the feature work, the updated test runner passes all 920 tests but lint reports 3 errors in two foundation test files (`placePreferences.scenarios.test.ts` lines 248 and 264, `placePreferences.test.ts` line 190), where a console spy is now typed more loosely. The foundation branch needs that small fix once #38 merges.

## Target Verification Matrix

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|---|---|---|---|---|---|---|
| T-01 | Testing Contract, scope floor; NFR5 | Backend line coverage at least 80% | 89.1% | Local run; coverage gate passed in CI on #70 | Build and Test | Met |
| T-02 | Testing Contract, scope floor; NFR5 | Frontend line coverage at least 80% | 94.26% | Local run; coverage gate passed in CI on #39 | Build and Test | Met |
| T-03 | NFR5; `vite.config.ts` | Frontend branch coverage at least 70% | 91.59% | Local run | Build and Test | Met |
| T-04 | Testing Contract; NFR5 | Build, lint, type-check and all tests pass, existing suites included | Backend: all pass, locally and in CI. Frontend: all pass locally; in CI one guest-tab test fails on #40 and #41 | CI Results above | Build and Test | Not Met |
| T-05 | Testing Contract, Standard strategy | Integration tests run at the key boundaries | Backend database boundary ran in CI and passed (16 tests). Frontend boundaries pass | #70, tests step | Build and Test | Met |
| T-06 | Testing Contract, scope floor; NFR5; team rule | The selected tests run in CI before merge, and every pull request passes build, lint, type-check, test and coverage | CI ran. No feature pull request is green: all four stop at the dependency audit, and two also fail one test | CI Results above | Build and Test | Not Met |
| T-07 | Team rule: dependency scan is a blocking gate | `npm audit --audit-level=high` passes | Still fails on `main` in both repositories. Fixes are open as #69 and #38; #38 is green, #69 was re-running | Dependency Audit and CI Results above | Build and Test | Not Met |
| T-08 | NFR3; foundation rule BR11.1 | Every filter over 200 places within 25 ms in the test environment, with no request | Passes, locally and in CI | Scenario S32 | Build and Test | Met |
| T-09 | NFR1 | The automated accessibility check passes, and each new control has a keyboard-only scenario | Keyboard-only scenarios pass on both screens and the shared controls. No automated accessibility check exists to run | Guest S13, host S13; the CI workflow's placeholder comment | None scheduled | Unverified |
| T-10 | NFR3 | List and counts update within 100 ms for 200 places on a mid-range phone | Never measured on a device | `performance-test-instructions.md` describes how | None scheduled | Unverified |
| T-11 | NFR4 | Nothing sensitive in browser storage; one storage boundary; no place coordinate sent; ownership checked | All pass. The secret scan did not run on #70 because the audit step failed first; it passed on the frontend pull requests' built output | Guest S12, foundation S27, host S9, lint configuration test, backend scenarios | Build and Test | Met |

Six met, three not met, two unverified.

## What the Failures Are, and Are Not

- **T-04 (not met)** is one test in the generated test code that assumed the machine's timezone. The fix is small and belongs in the guest tab unit. The foundation test files also need a three-line typing fix once the frontend dependency update lands. These two are defects in generated test code.
- **T-07 (not met)** would block any change to either repository today. The fixes are open and passing or re-running. It clears when #69 and #38 merge, which needs a person.
- **T-06 (not met)** follows from the other two: once the dependency fixes merge and the test is fixed, the feature pull requests need to be brought up to date and re-run. Only then do the secret scan and static analysis run on the backend feature.
- **T-09 (unverified)** cannot be settled by anything that exists. It needs either an automated accessibility check to be added, or the requirement's wording to be accepted as met by keyboard scenarios and a hand check.
- **T-10 (unverified)** needs a person with a phone or a throttled browser. No stage in this plan owns it.

## Decision

Offered a return to Code Generation to fix the failing test and the three typing errors, the human chose **Accept failure** on 2026-10-11. The stage is recorded as not passed. The fixes are to be made as ordinary follow-up commits on the open pull requests, where CI will check them. No loop-back was made, so there is no Loop-Back Log. The ordered follow-up list is in `build-and-test-summary.md`.

## Review Notes Carried From Code Generation

Still open, all minor, none changed here:

- Backend: no test covers the one wiring line that switches host enrichment on. Only the exact value `UTC` counts as "no timezone".
- Foundation: two written rules are slightly behind the code (a picked place with no listing; a guest place with no stance).
- Guest tab: the day rail's "today" marker goes stale after midnight, in code this work did not touch.
- Host panel: the picked-ids read has no ordering guard. About 15 lines of glue are duplicated between the two screens.
