# Code Structure — `guestguideiq-frontend`

## Repository layout

```
guestguideiq-frontend/
  index.html, package.json, vite.config.ts (also Vitest config),
  eslint.config.js, tsconfig*.json, .prettierrc, .env.example, SECURITY.md, README.md
  .github/workflows/ci.yml, deploy.yml
  scripts/post-deploy-check.mjs       Playwright post-deploy smoke check
  infra/                              separate CDK package (own package.json, lockfile)
    bin/frontend.ts, lib/frontend-stack.ts
  public/fonts/                       self-hosted fonts (font-src 'self')
  src/
    main.tsx, App.tsx, foundation.ts, vite-env.d.ts
    api/            client.ts, errors.ts, replay.ts
      contract/     entities.ts, paths.ts, primitives.ts, index.ts, PROVENANCE.md
    session/        SessionManager and token store
    theme/          locality brand -> design tokens
    design-system/  index.ts, primitives/ (10), tokens/ (tokens.ts, tokens.css)
    owner/          OwnerApp.tsx, shell/, guide/, billing/, links/, property/, *.css
    guest/          GuestSurface.tsx, ChatWidget.tsx, AskPrompt.tsx, states.tsx, guest.css
      guide/        GuestGuideView, GuideTabs, PlaceCard, placeGroups, placeFormat,
                    stayDays, DayRail, Essentials, EventRow, DuskHeader, ...
    mocks/          backend.ts (stateful double), handlers.ts (MSW routes)
    dev/            design-system showcase
    test/setup.ts
    assets/brand/
```

## Directory-to-unit map

| Directory | Unit (from `260907-frontend-app`) | Classification |
|---|---|---|
| `src/api/contract/` | u1-api-contract | types and path constants; excluded from coverage |
| `src/design-system/` | u2-design-system | primitives and tokens; excluded from coverage (ADR-007) |
| `src/api/` (client, errors, replay), `src/session/`, `src/theme/`, `src/foundation.ts` | u3-foundation | runtime boundary modules |
| `src/owner/shell/`, `src/owner/OwnerApp.tsx` | u4 | owner shell, auth screens, navigation |
| `src/owner/guide/` | u5 | guide editor, onboarding, guest preview frame |
| `src/owner/billing/` | u6 | plan controls and Local recommendations |
| `src/owner/links/` | u7 | guest links (stays) |
| `src/guest/` | u8 | guest surface, chat, states |
| `src/guest/guide/` | u9-guest-guide-view | shared guide renderer |
| `src/mocks/` | test doubles | MSW backend double |
| `src/dev/` | dev only | showcase |

Note: `owner/billing/` holds curation (`LocalityCuration`, `PlacePicker`, `curationView`, `AreaPanel`, host places and tips) as well as billing. The directory name follows the delivery grouping, not the domain.

## File classification in the Places area

| File | Kind | Role |
|---|---|---|
| `guest/guide/GuestGuideView.tsx` | component | page composition; owns selected-day state; forbids a preview-mode prop |
| `guest/guide/GuideTabs.tsx` | component | Overview / Places / Events; the only tablist on the page |
| `guest/guide/PlaceCard.tsx` | component | one place: name, picture fallback, hours, price, host note, "Recommended by your host" for `hostAdded` |
| `guest/guide/placeGroups.ts` | pure logic | groups by `poiCategory.category`, sections by `sortOrder`, server order within a section; returns `null` for a flat list when nothing is categorised |
| `guest/guide/placeFormat.ts` | pure logic | `hoursOn(hours, isoDate)` (lines 59-75), `priceLabel()` (lines 115-121); unknown hours stay unknown |
| `guest/guide/stayDays.ts` | pure logic | stay window to days; "today" in the viewer's zone because no property timezone is available (lines 60-72) |
| `guest/guide/DayRail.tsx` | component | radiogroup with roving tabindex; renders only for 2 or more days |
| `owner/billing/LocalityCuration.tsx` | component | curation panel; joins catalogue, picked IDs and listings |
| `owner/billing/PlacePicker.tsx` | component | catalogue picker, shared with onboarding (`OnboardingFlow.tsx:161`) |
| `owner/billing/curationView.ts` | pure logic | groups by free-text `category`, "Other" last, sorts by name |
| `owner/billing/HostPlaceActions.tsx` | component | host-added place actions |
| `owner/billing/AreaPanel.tsx` | component | property area; the only place `area.timezone` is read |
| `owner/guide/GuestPreviewFrame.tsx` | component | renders `GuestGuideView` with no places, property or stay |

## Code patterns and conventions

- **Naming**: a file is named after its export: PascalCase for components, camelCase otherwise (project.md). Multi-word directories are single words today.
- **`exactOptionalPropertyTypes`**: optional props are passed with `{...(x === undefined ? {} : { x })}`. New props must follow the idiom.
- **Result, not exceptions**: client calls return `Result<T>`; components branch on `ok`.
- **Pure view modules beside components**: grouping and formatting are plain functions with their own unit tests (`placeGroups.test.ts`, `curationView.test.ts`).
- **Colocated tests**: `*.test.ts(x)` next to the code. Scenario tests mount real components and intercept only the network with MSW.
- **Traceability comments**: dense comments cite AC, BR, ADR or team.md rules.
- **CSS**: plain global CSS per surface (`guest.css`, `owner.css`, `polish.css`) with `ggiq-` prefixed classes and design-token custom properties.
- **Path alias** `@/` -> `src/` is declared but relative imports dominate.
