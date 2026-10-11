# Unit Test Instructions: u3-guest-places

Repository: `guestguideiq-frontend`. Runner: Vitest with a browser-like test environment (configured in `vite.config.ts`, which also enforces the coverage floors: 80% lines, 70% branches). Tests sit beside the code they cover. All commands run from the repository root.

## Prerequisites

- Node and the repository's dependencies installed (`npm ci`).
- The foundation unit's code present: this unit's branch is cut from `feature/places-filters-foundation`.
- No backend is needed. Network calls are intercepted by the mock handlers under `src/mocks/`. Browser storage is replaced by a substitute object.

## Unit-Scoped Command

Runs only the guest folder. The exclude keeps out untracked local working copies that the runner would otherwise also collect.

```bash
npx vitest run src/guest --exclude ".claude/**"
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
| `src/guest/guide/guestPlaces.scenarios.test.tsx` | Scenario | S1–S20: first section open, open chip label by day and timezone, "Host pick" label, Filters chip count, Clear filters, owner's preview, storage that throws, restore on reopening, keyboard-only use, tab switch keeps state, left-out notes with Show and Hide, nothing matches, flat list, zero-count section, price 0. Also heading levels, the count inside the category sheet, and distance on the card |
| Existing guide tests under `src/guest/` | Scenario and unit | Unchanged behaviour of the guide, the day rail, events and the place card |
| A small unit test beside any new logic | Unit | Only what the scenarios do not reach, such as the price-level conversion |

## Substitution Rules

- Scenario tests mount the real guide with its real providers and state, and drive it as a guest would, by keyboard and pointer.
- Network is substituted only by request interception. Storage is substituted only by passing a storage object in.
- No child component is mocked.

## Pass Criteria

- Every scenario passes, and the rest of the suite stays green.
- Coverage stays at or above the configured floors. No threshold is lowered and nothing new is excluded.
- Type-check, lint and build report no errors.

## Order of Work

Scenarios are written and seen to fail on behaviour before the implementation. Unit tests are added after. This follows the Testing Contract in `code-generation-plan.md`.
