# Code Quality Assessment — `guestguideiq-frontend`

## Test baseline (taken during the scan, HEAD `09edbf7`)

`npx vitest run --coverage --exclude ".claude/**"`:

| Measure | Value | Floor (`vite.config.ts`) |
|---|---|---|
| Test files | 57 | |
| Tests | 643, all passing | |
| Lines | 92.4% | 80 |
| Branches | 88.53% | 70 |
| Functions | 88.56% | 80 |
| Statements | 92.4% | 80 |

- Floors are enforced in the runner's own config, so they fire locally and in CI.
- **Included**: `src/**/*.{ts,tsx}`. **Excluded**: `src/design-system/**`, `src/api/contract/**`, `src/test/**`, `src/mocks/**`, `src/dev/**`, `src/main.tsx`, `*.d.ts`, test files.
- Style: Vitest, jsdom, globals, React Testing Library, user-event, MSW; 15-second timeout; tests colocated. Scenario tests mount real components and substitute only the network (team.md).

### Places-relevant existing tests

- `guest/guide/placeGroups.test.ts` (112 lines).
- `guest/guide/guestContent.test.tsx`: category sections in sort order with "Other" last; flat list when nothing is categorised; picture fallbacks; day-selected hours.
- `guest/guide/GuestGuideView.test.tsx`, `DayRail.test.tsx`, `stayDays.test.ts`.
- `owner/billing/curationView.test.ts`, `LocalityCuration.test.tsx`, `hostCuration.test.tsx` (760 lines).
- `owner/guide/OnboardingFlow.places.test.tsx` (shared `PlacePicker`).

### Test gaps

- **No live-backend E2E suite.** Team practice (Q5) requires a thin one; Playwright is used only for the post-deploy check.
- **Mock fixtures too thin for filters**: `guestPlace()` emits null hours, profile and `isFree`, no coordinates, `stance` defaulting to `featured`, never `recommended`; five categories only.

## Linting and formatting

- ESLint flat config, type-aware (`strictTypeChecked`, `stylisticTypeChecked`), blocking.
- Custom bans: raw-HTML sinks (`dangerouslySetInnerHTML`, `innerHTML`/`outerHTML` assignment, `insertAdjacentHTML`, `document.write`); `fetch`, `localStorage`, `sessionStorage` outside owning modules; `no-warning-comments` for TODO, FIXME, HACK; `react-hooks/exhaustive-deps` as an error.
- Prettier enforced with `format:check`.
- Marker hygiene clean: no TODO, FIXME or HACK in `src/`; one `eslint-disable-next-line` in `api/client.test.ts:274`; intentional `@ts-expect-error` contract assertions in `contract.test.ts`.

## CI/CD

### `ci.yml`

| Job | What it runs | Blocking |
|---|---|---|
| verify | format:check, lint, typecheck (separate from build), test:coverage, build; uploads `dist` | yes |
| infra | tsc and `cdk synth` for dev, staging, production; certificate-guard negative test | yes |
| scan | `npm audit --audit-level=high`; gitleaks source scan | yes |
| scan-built-output | `gitleaks dir dist/ --exit-code=1`, pinned version and sha256; refuses to scan an empty directory | yes |
| accessibility | **absent**; advisory by recorded decision and deliberately not faked | n/a |

### `deploy.yml`

- Gated by `vars.DEPLOY_ENABLED`. OIDC credentials, SHA-pinned actions, per-job permissions.
- **Staging is skipped** (`STAGING_ENABLED`) because no staging stack exists.
- **Production runs only by `workflow_dispatch`**, because environment protection rules are unavailable on the current GitHub plan; `environment: production` scopes OIDC only. Documented with "TO RESTORE" steps.
- Keeps a rollback snapshot of the shell and runs a Playwright post-deploy check.

This deviates from the affirmed practice "never deploy without first passing through staging and receiving manual approval". The deviation is documented in the workflow, not hidden.

## Documentation

- `README.md` covers the gates and their history in detail.
- `SECURITY.md` sets a suppression policy: owner, reason and expiry for each suppression; none active.
- Source comments are dense and traceable (AC, BR, ADR, team.md citations).

## Technical debt

| Item | Location | Impact | Suggested action |
|---|---|---|---|
| Local test run polluted by stale agent worktrees | `.claude/worktrees/` (six); `vite.config.ts` `test` has no `.claude/**` exclude | plain `npm test` runs 153 files / 1,685 tests with one foreign failure; CI unaffected | add `exclude: ['.claude/**', ...]` to the Vitest config |
| Two divergent place-grouping modules | `guest/guide/placeGroups.ts` vs `owner/billing/curationView.ts` | different category source, "Other" label and ordering; the intent needs the same categories on both surfaces | converge on `poiCategory` once the owner catalogue carries it |
| Unused dependency | `react-router-dom` | bundle and audit surface | remove |
| Large files | `mocks/handlers.ts` 2,050; `guest/guest.css` 1,861; `api/contract/entities.ts` 1,221; `owner/owner.css` 1,181; `api/client.ts` 1,098; `owner/polish.css` 836 | review cost; guest CSS repeats `.ggiq-pscroll` / `.ggiq-pcard` in 4-6 blocks | consolidate when touched |
| Bounded toggle race | `PlacePicker.tsx:19-32` | a quick double toggle can visibly revert | accepted, documented |
| `Dialog` not background-inert | `design-system/primitives/Dialog.tsx` | relevant to a modal filter sheet | fix before building on it |
| No staging, no enforced prod reviewer | `deploy.yml` | deviates from affirmed practice | restore per documented steps |

## Security gates relevant to the Places-filters intent

1. **CSP blocks Google Maps** as deployed (`infra/lib/frontend-stack.ts:263-277`). Needs an explicit security decision at design.
2. **`Referrer-Policy: no-referrer` globally** (`frontend-stack.ts:290-298`) conflicts with an HTTP-referrer-restricted Maps key. The guest token URL must never reach Google.
3. **The built-output secret scan will flag a public Google API key** compiled into `dist/`. It needs a `SECURITY.md` allowlist entry with owner, reason and expiry; weakening the gate is forbidden (project.md).
4. `Permissions-Policy: geolocation=()` matches the out-of-scope "no device location"; keep it.

New filter logic (distance, open-now, predicates, counts) is pure logic and falls under the 80/70 floors and the BDD-first cadence (team.md).
