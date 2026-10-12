# Unit Test Instructions: u4-host-curation

Repository: `guestguideiq-frontend`. Runner: Vitest with a browser-like test environment (configured in `vite.config.ts`, which also enforces the coverage floors: 80% lines, 70% branches). Tests sit beside the code they cover. All commands run from the repository root.

## Prerequisites

- Node and the repository's dependencies installed (`npm ci`).
- The foundation and guest tab code present: this unit's branch is cut from `feature/places-filters-guest`.
- No backend is needed. Network calls are intercepted by the mock handlers under `src/mocks/`.

## Unit-Scoped Command

Runs the folders this unit changes. The exclude keeps out untracked local working copies that the runner would otherwise also collect.

```bash
npx vitest run src/owner src/places-ui src/places src/guest --exclude ".claude/**"
```

## Full Gates

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run build
```

```bash
npx vitest run --coverage --exclude ".claude/**"
```

`npm run test:coverage` and `npm run format:check` fail on this machine for reasons that predate this work (untracked working copies inside the folder, and Windows line endings). CI is the real check for both.

## What the Tests Cover

| File | Kind | Covers |
|---|---|---|
| `src/owner/billing/hostPlaces.scenarios.test.tsx` | Scenario | S1–S20: sections in the guest tab's order, "Open now" with and without a timezone, sheet filters and the Filters chip count, no request when filtering, curating while filtered with focus moving on, hidden and unpicked rows, nothing remembered, onboarding unchanged, older backend, keyboard-only use, paused setup, a failed pick, a new place hidden by filters. Also the re-read after an action and a failed re-read |
| Foundation tests under `src/places/` | Scenario, then unit | The stance function with picked ids |
| Guest scenarios under `src/guest/` | Scenario | Unchanged behaviour of the guest tab after the shared pieces move |
| Existing onboarding, picker and panel tests under `src/owner/` | Scenario and unit | Unchanged behaviour of onboarding and of curation with no filters |

## Substitution Rules

- Scenario tests mount the real owner app with its real providers and state, and drive it as a host would, by keyboard and pointer.
- Network is substituted only by request interception. The scenarios count requests to prove filtering sends none.
- No child component is mocked.

## Pass Criteria

- Every scenario passes, and the rest of the suite stays green, with no guest or onboarding test edited beyond import paths.
- Coverage stays at or above the configured floors. No threshold is lowered and nothing new is excluded.
- Type-check, lint and build report no errors.

## Order of Work

Scenarios are written and seen to fail on behaviour before the implementation. Unit tests are added after. This follows the Testing Contract in `code-generation-plan.md`.
