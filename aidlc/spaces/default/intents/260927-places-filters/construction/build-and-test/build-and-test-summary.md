# Build and Test Summary: Places Filters

## Overall Status

**Not passed. The failure was accepted by the human on 2026-10-11**, with the remaining fixes to be made as ordinary follow-up on the open pull requests.

Both repositories build. Every test passes locally. CI then ran on six pull requests: it confirmed the backend's database reads against a real database, and found one guest-tab test that depends on the machine's timezone. Three quality targets are not met and two cannot be verified. Full results are in `test-results.md`.

| | Backend | Frontend (all three units) |
|---|---|---|
| Branch | `feature/places-filters-api` at `8784bde` | `feature/places-filters-host` at `e2bc275` |
| Build, type-check, lint | Pass, locally and in CI | Pass, locally and in CI |
| Tests, local | 822 passed, 0 failed, 101 skipped (no database) | 920 passed, 0 failed |
| Tests, CI | All pass, database-backed tests included | Foundation: all pass. Guest tab and host panel: 1 test fails |
| Line coverage | 89.1% (floor 80%) | 94.26% (floor 80%) |
| Dependency audit on `main` | Fails; fix open as #69 | Fails; fix open as #38, fully green |

## Pull Requests

Nothing is merged. The four feature pull requests are drafts.

| Pull request | Contents | Base |
|---|---|---|
| guestguideiq-app#69 | Dependency updates, backend and admin-api | `main` |
| guestguideiq-app#70 | Backend feature | `main` |
| guestguideiq-frontend#38 | Dependency updates, frontend | `main` |
| guestguideiq-frontend#39 | Foundation | `main` |
| guestguideiq-frontend#40 | Guest Places tab | Foundation branch |
| guestguideiq-frontend#41 | Host panel | Guest tab branch |

## Prerequisites

- Node.js and npm. No environment variables for build, unit or scenario tests.
- PostgreSQL 16 and a `DATABASE_URL` for the backend's database-backed tests. CI provides them.

## Test Type Inventory

| Test type | Instructions | Run? |
|---|---|---|
| Unit and scenario tests, per unit | Each unit's `unit-test-instructions.md` | Locally and in CI |
| Integration: backend to database | `integration-test-instructions.md`, boundary 1 | In CI only; passed |
| Integration: frontend to response shapes | `integration-test-instructions.md`, boundary 2 | Locally and in CI, against mocks |
| Integration: both screens to the shared rules | `integration-test-instructions.md`, boundary 3 | Locally and in CI |
| Performance guard | `performance-test-instructions.md` | The 25 ms guard, yes. The 100 ms phone target was not measured |
| Security checks | `security-test-instructions.md` | The local ones, yes. The backend feature's secret scan and static analysis have not run, because the audit step fails first |
| Dependency audit | `security-test-instructions.md`, section 1 | Fails on `main` in both repositories; fixes are open |
| Automated accessibility check | None | **Does not exist** in either repository |
| Live-backend end-to-end | The frontend's deploy workflow | No. The backend branch is not deployed |

The strategy is Standard, which calls for the integration instructions only. Performance and security instructions were written as well because requirements NFR3 and NFR4 make measurable claims.

## Coverage Expectations per Unit

| Unit | Expectation | Result |
|---|---|---|
| `u1-places-api` | Backend stays at or above 80% lines | 89.1% |
| `u2-places-foundation` | Frontend stays at or above 80% lines and 70% branches | `src/places` alone is at 99.75% lines |
| `u3-guest-places` | Same frontend floors | Frontend overall 94.26% lines, 91.59% branches |
| `u4-host-curation` | Same frontend floors | Same run; `PlacePicker.tsx` at 99% lines |

## Target Verification Matrix

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|---|---|---|---|---|---|---|
| T-01 | Testing Contract, scope floor; NFR5 | Backend line coverage at least 80% | 89.1% | `test-results.md`, Coverage; CI gate on #70 | Build and Test | Met |
| T-02 | Testing Contract, scope floor; NFR5 | Frontend line coverage at least 80% | 94.26% | `test-results.md`, Coverage; CI gate on #39 | Build and Test | Met |
| T-03 | NFR5; `vite.config.ts` | Frontend branch coverage at least 70% | 91.59% | `test-results.md`, Coverage | Build and Test | Met |
| T-04 | Testing Contract; NFR5 | Build, lint, type-check and all tests pass | Backend: all pass. Frontend: one guest-tab test fails in CI | `test-results.md`, CI Results | Build and Test | Not Met |
| T-05 | Testing Contract, Standard strategy | Integration tests run at the key boundaries | All ran and passed, the backend's database boundary in CI | #70, tests step | Build and Test | Met |
| T-06 | Testing Contract, scope floor; NFR5; team rule | Tests run in CI before merge; every pull request green | CI ran. No feature pull request is green | `test-results.md`, CI Results | Build and Test | Not Met |
| T-07 | Team rule: dependency scan is a blocking gate | `npm audit --audit-level=high` passes | Fails on `main` in both repositories; fixes open, not merged | `test-results.md`, Dependency Audit | Build and Test | Not Met |
| T-08 | NFR3; foundation rule BR11.1 | Every filter over 200 places within 25 ms in the test environment | Passes | Scenario S32 | Build and Test | Met |
| T-09 | NFR1 | Automated accessibility check passes; keyboard-only scenario per new control | Keyboard scenarios pass. No automated check exists | Guest S13, host S13; the CI workflow's placeholder | None scheduled | Unverified |
| T-10 | NFR3 | Within 100 ms for 200 places on a mid-range phone | Never measured on a device | `performance-test-instructions.md` | None scheduled | Unverified |
| T-11 | NFR4 | Nothing sensitive stored; one storage boundary; no coordinate sent; ownership checked | All pass | `security-test-instructions.md`, sections 3 to 5 | Build and Test | Met |

Six met, three not met, two unverified.

## Readiness

| | Verdict | Why |
|---|---|---|
| Build-ready | Yes | Both repositories build cleanly, locally and in CI |
| Test-ready | Mostly | One timezone-dependent test fails in CI. Everything else passes |
| Merge-ready | **No** | See the follow-up list below |
| Deployment-ready | **No** | Not merged. The deployment stages are outside this plan |

## Follow-Up, in Order

These are what stand between the open pull requests and a merge. The first four are code or review work; the last three need a person's judgement.

1. **Merge the two dependency pull requests** (#69 and #38) after review. Until then the audit step fails on every pull request in both repositories.
2. **Fix the timezone-dependent test** in `src/guest/guide/guestPlaces.scenarios.test.tsx` on the guest tab branch, and carry it to the host panel branch. Confirm by running the frontend suite with the clock zone set to UTC and to a zone east of UTC.
3. **Fix three typing errors** in two foundation test files once #38 has merged and the foundation branch is brought up to date with `main`.
4. **Re-run CI on the four feature pull requests.** Only then do the backend feature's secret scan and static analysis run.
5. **Decide what "Open now" should mean for a device in a different zone from the property.** Today such a guest sees "Open on [weekday]" for the device's date during the hours when the two dates differ.
6. **Decide how to treat the missing accessibility check:** add one, or accept keyboard scenarios and a hand check as meeting NFR1 for this work.
7. **Measure filtering speed** on a phone or a throttled browser against the 100 ms target.

Merge order once green: backend first, then foundation, guest tab, host panel. Until the backend deploys, hosts see a flat place list with only the Host picks chip.

## Closing Note: After the Stage Was Approved

Added on 2026-10-11, after the approval. Everything above this section describes the stage as it stood when it was approved, and is left as written.

**The follow-up list was worked through and all six pull requests are merged**, each only after CI was green on its latest commit.

| Pull request | Contents | Merged as |
|---|---|---|
| guestguideiq-app#69 | Dependency updates, backend and admin-api | `e8f4193` |
| guestguideiq-app#70 | Backend feature | `8296338` |
| guestguideiq-frontend#38 | Dependency updates, frontend | `afde852` |
| guestguideiq-frontend#39 | Foundation | `0457176` |
| guestguideiq-frontend#40 | Guest Places tab | `2f0daed` |
| guestguideiq-frontend#41 | Host panel | `8f47bab` |

What changed on the way:

- **The timezone-dependent test was fixed** on the guest tab branch. The Places tab scenarios now put the test device in the property's zone, and the suite was run under UTC and Tokyo as well as the development machine's zone.
- **The three typing errors were fixed** in the two foundation test files, by declaring the console spy's type explicitly.
- **The backend feature's secret scan, static analysis and infrastructure scans ran for the first time and passed**, once the dependency fix had merged.
- **The host panel branch conflicted with `main`** when it was brought up to date, because `main` carried the guest tab as one squashed commit. Every conflict was resolved in favour of the branch, and the result was confirmed identical, file for file, to the branch before the merge.

How the targets stand now:

| Target | At approval | Now |
|---|---|---|
| T-04 all tests pass | Not Met | Met: 921 frontend and 822 backend tests pass, in CI |
| T-06 CI before merge, every pull request green | Not Met | Met |
| T-07 dependency audit passes | Not Met | Met on `main` in both repositories |
| T-09 automated accessibility check | Unverified | Unverified. **Deferred by the human's decision on 2026-10-11** |
| T-10 100 ms on a phone | Unverified | Unverified. Not measured |

Decisions the human made after approval:

- **Accessibility checks are deferred.** Keyboard scenarios and the hand checks stand for this work.
- **"Open now" should hold whatever timezone the phone is set to.** Taken to mean: "today" in the guide is the property's day, not the phone's, so a guest whose phone is on another zone's time still sees "Open now" judged at the property. The human was told this reading and said to proceed on reasonable assumptions. **Done and merged** as guestguideiq-frontend#42 (`c9bbbf6`): with the property's zone known, the day rail, the header's day and the open filter use the date at the property; without it they fall back to the phone's date. 928 tests pass with the machine clock on four timezones. It was not looked at in a browser.
- **Deploy the backend. Done on 2026-10-11**, by running the deploy workflow on `main` at `8296338`. It shipped two commits since the previous deploy (`2f1dd72`): the dependency updates and the feature. There was no database migration. The deploy job and the post-deploy smoke test against the live API both passed.
  - **This was a deliberate departure from a project rule, made by the human.** The rule reads: "NEVER deploy the backend to production without first passing through staging and receiving manual approval". No staging environment exists; the staging jobs are skipped by design. The human was told this before the deploy was started and directed it to go ahead. The manual approval half of the rule was met; the staging half could not be. The cost is that the first place this code met real infrastructure was production, covered only by CI and the smoke test. The earlier deploys ran the same way.

**What is live:** the backend. **What is not:** the frontend. Its production deploy is started by hand and has not been run, so guests and hosts do not see the filters yet.

Found along the way: this workspace repository's own dependency scan also fails on `main` (5 advisories in build tooling), which fails the scan on the pull request that carries this record. A lockfile-only fix is open as guestguideIQ#16. It was not merged by the agent, because merging to `main` here rebuilds and publishes the marketing site.

## Known Limitations

- The frontend's tests run against hand-written mocks of the backend. The live-backend suite was not extended because the backend branch is not deployed.
- Accessibility was checked by keyboard scenarios and by hand in a browser at 320 px and desktop width, light and dark. Not with a screen reader, a touch device or reduced motion.
- Requirement coverage fails the strict cross-unit check on the form of the records, not on what was built. See `cross-unit-traceability.md`.
- The workflow's source-freshness check cannot run in this workspace, because untracked working copies in the frontend folder exceed its limit. The human bypassed it to open and to record the Code Generation approval.
- The dependency updates changed tooling by a major version in both repositories (typescript-eslint 8 in the backend, vitest 5 in the frontend). Under the new frontend test runner, coverage reads about a point lower with no test removed.
- Minor review notes from Code Generation remain open and are listed at the end of `test-results.md`.
