# Build Instructions: Places Filters

This work spans two repositories and four local branches. Nothing is pushed.

| Repository | Branch to build | Holds |
|---|---|---|
| `guestguideiq-app` (backend) | `feature/places-filters-api` | `u1-places-api` |
| `guestguideiq-frontend` | `feature/places-filters-host` | `u2-places-foundation`, `u3-guest-places` and `u4-host-curation`, stacked in that order |

The frontend's three branches stack: `feature/places-filters-foundation`, then `feature/places-filters-guest`, then `feature/places-filters-host`. Building the last one builds all three units.

## Prerequisites

- Node.js and npm, at the versions each repository's CI workflow uses.
- No environment variables are needed to build or to run the unit and scenario tests in either repository.
- The backend's database-backed tests need PostgreSQL 16 and a `DATABASE_URL`. CI provides both as a service container. Without them, those tests skip themselves.

## Backend

From `guestguideiq-app`:

```bash
git checkout feature/places-filters-api
```

```bash
npm ci
```

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run build
```

The build compiles TypeScript to `dist/`. There is no schema change in this work, so no migration is run.

## Frontend

From `guestguideiq-frontend`:

```bash
git checkout feature/places-filters-host
```

```bash
npm ci
```

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run build
```

The build writes the bundle to `dist/`.

## Build Verification

- Each command exits 0.
- Backend lint reports no findings. Frontend lint reports 0 errors and 1 warning, an unused directive in `src/api/client.test.ts` that predates this work.
- The frontend build lists `dist/assets/index-*.css` and `index-*.js`.

## Troubleshooting

| Symptom | Cause | What to do |
|---|---|---|
| `npm run format:check` fails on hundreds of files, in either repository, on Windows | The checkout has Windows line endings and Prettier expects Unix ones | Not a formatting fault. Check with `npx prettier --check --end-of-line auto <paths>`, or rely on CI, which checks out Unix line endings |
| Frontend `npm run test:coverage` reports one failing test under `.claude/worktrees/` | Untracked local working copies inside the frontend folder are picked up by the test runner | Run `npx vitest run --coverage --exclude ".claude/**"`. CI has no such folder |
| Backend tests report about 100 skipped | No database is reachable | Expected locally. They run in CI |
| The workflow refuses to close a build stage with "the workspace source changed" | The same untracked working copies exceed the source-snapshot limit | Clear `guestguideiq-frontend/.claude/worktrees/` once no session needs those copies |

## Order of Deployment

The backend additions are backwards compatible, and the frontend works against an older backend. The backend should still go out first: until it does, hosts see a flat place list with only the Host picks chip.
