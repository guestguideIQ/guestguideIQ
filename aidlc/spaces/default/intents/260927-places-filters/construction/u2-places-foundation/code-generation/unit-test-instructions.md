# Unit Test Instructions: u2-places-foundation

Repository: `guestguideiq-frontend`. Runner: Vitest with a browser-like test environment (configured in `vite.config.ts`, which also enforces the coverage floors: 80% lines, 70% branches). Tests sit beside the code they cover. All commands run from the repository root.

## Prerequisites

- Node and the repository's dependencies installed (`npm ci`).
- No backend is needed. Network calls are intercepted by the mock handlers under `src/mocks/`. Browser storage is replaced by a substitute object passed to the storage module.

## Unit-Scoped Command

Runs only the folders this unit changes:

```bash
npx vitest run src/places src/design-system src/api src/mocks src/eslintConfig.test.ts
```

## Full Gates

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run format:check
```

```bash
npm run build
```

```bash
npm run test:coverage
```

## What the Tests Cover

| Area | Kind | Covers |
|---|---|---|
| Contract (`src/api/`, `src/mocks/`, stance function) | Scenario, then unit | S29, S38–S41: missing fields read as unknown; stance used as sent, joined, mixed, empty |
| Filtering rules (`src/places/`) | Scenario, then unit | S1–S21, S32–S37, S42, S43: grouping, open evaluation and mode, filters, left-out counts, sort, availability, distance display, counts, speed guard |
| Remembered choices (`src/places/`) | Scenario, then unit | S22–S28, S44–S46: key, restore, no stay, storage that throws, pruning, nothing sensitive stored, Clear all |
| Shared controls (`src/design-system/primitives/`) | Scenario and keyboard-only | S30, S31, S47, S48: focus kept in the sheet and returned, page behind inert, header toggle announced, category chip |
| Lint configuration (`src/eslintConfig.test.ts`) | Unit | The storage allowance covers only the one new file, and network access is still forbidden in it |

## Substitution Rules

- Scenario tests for controls render the real controls and drive them as a person would (keyboard and pointer). Child components are not mocked.
- Network is substituted only by request interception. Storage is substituted only by passing a storage object in.
- The speed guard (S32) asserts 200 places with every filter active complete within 25 ms in the test environment. It is a regression guard, not a phone measurement.

## Pass Criteria

- Every scenario and unit test above passes, and the full existing suite stays green, including the existing dialog tests.
- Coverage stays at or above the configured floors. No threshold is lowered and nothing new is excluded from coverage.
- Type-check, lint, format check and build report no errors.

## Order of Work

Scenarios are written and seen to fail before the implementation. Unit tests for logic are added after the implementation. This follows the Testing Contract in `code-generation-plan.md`.
