# Reverse Engineering Timestamp — `guestguideiq-frontend`

| Field | Value |
|---|---|
| Date | 2026-09-30 |
| Intent | `260927-places-filters` |
| Repository | `guestguideiq-frontend` (sibling of the workspace root) |
| Branch scanned | `brand/fraunces`, **not `main`** |
| Commit | `09edbf7f489adccb7a582d3251bb93fe0234ea46`, a merge of `origin/main` into `brand/fraunces` that contains `293f8af` "Group the guest Places tab by category" (#36) |
| Source tree fingerprint | `git:3833e76903c7c008954cbec645f8ffcfb96ee568` (tree of `09edbf7`; working tree clean) |
| Store verdict before scan | `NO_STORE` (first scan) |
| Requested breadth | full scan of the whole repo |
| Recorded kind | `partial`: the scan read the Places area, the API boundary, config, CI and infra deeply, and only skimmed the rest (see below) |
| Test baseline | 57 files, 643 tests passing; 92.4% lines, 88.53% branches (with `.claude/**` excluded) |

## Notes on scope

- Human breadth was a full scan, but this block records what was verified deeply, not what was aspired to. Large areas (most owner and guest components outside the Places modules, `session/`, `theme/`, design-system primitives, the MSW double, test bodies) were skimmed only, so `./` is not claimed and the kind is `partial`.
- `src/api/client.ts` was read for its header, `RequestOptions`, the whole `ApiClient` interface and `send`. `src/api/contract/entities.ts` was read for the property, locality, guide, POI, hours, profile, listing, area and host-place types. `infra/lib/frontend-stack.ts` was read for props, SPA function, media bucket and the headers policy. `.github/workflows/deploy.yml` was read for its gating sections. They are recorded as analyzed because the intent-relevant parts were read in full.
- Header-only reads are recorded as shallow: `src/api/replay.ts`, `src/api/contract/PROVENANCE.md`, `src/owner/billing/ListingControls.tsx`, the design-system primitives, `src/mocks/`, `scripts/post-deploy-check.mjs`, `README.md`.
- Test files are colocated (`*.test.ts(x)`) and were skimmed for names and counts only; they are covered by the shallow directory entries.
- Backend files in `guestguideiq-app` were spot-checked for coordinates and timezone only and are not part of this store's scope.
- Rescan if `main` moves before the store is relied on, since this was scanned on a feature branch.

## Scope of Analysis

```yaml
scope_version: 1
kind: partial
intent: 260927-places-filters
fingerprint: 1ac053e0b1170e71c8a45c883273fa0c36191b49
analyzed:
  paths:
    - src/guest/guide/GuestGuideView.tsx
    - src/guest/guide/GuideTabs.tsx
    - src/guest/guide/PlaceCard.tsx
    - src/guest/guide/placeGroups.ts
    - src/guest/guide/placeFormat.ts
    - src/guest/guide/stayDays.ts
    - src/guest/guide/DayRail.tsx
    - src/owner/billing/AreaPanel.tsx
    - src/owner/billing/LocalityCuration.tsx
    - src/owner/billing/curationView.ts
    - src/owner/billing/HostPlaceActions.tsx
    - src/owner/billing/PlacePicker.tsx
    - src/owner/guide/GuestPreviewFrame.tsx
    - src/api/client.ts
    - src/api/errors.ts
    - src/api/contract/entities.ts
    - src/api/contract/paths.ts
    - src/api/contract/primitives.ts
    - src/api/contract/index.ts
    - src/design-system/index.ts
    - src/design-system/tokens/tokens.ts
    - src/design-system/tokens/tokens.css
    - src/App.tsx
    - src/main.tsx
    - src/foundation.ts
    - src/vite-env.d.ts
    - src/test/setup.ts
    - package.json
    - vite.config.ts
    - eslint.config.js
    - tsconfig.json
    - tsconfig.app.json
    - tsconfig.node.json
    - .prettierrc
    - .prettierignore
    - .gitignore
    - .env.example
    - index.html
    - .github/workflows/ci.yml
    - .github/workflows/deploy.yml
    - infra/lib/frontend-stack.ts
    - infra/package.json
    - SECURITY.md
  components:
    - api-contract
    - foundation
    - app-entry
    - owner-billing
    - guest-guide-view
    - infra
    - ci-cd
shallow:
  paths:
    - src/guest/
    - src/owner/
    - src/session/
    - src/theme/
    - src/dev/
    - src/mocks/
    - src/design-system/primitives/
    - src/assets/brand/
    - src/api/replay.ts
    - src/api/contract/PROVENANCE.md
    - src/owner/billing/ListingControls.tsx
    - infra/bin/
    - public/fonts/
    - scripts/post-deploy-check.mjs
    - README.md
```
