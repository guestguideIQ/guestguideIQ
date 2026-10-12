# Business Overview — `guestguideiq-frontend`

## Purpose

`guestguideiq-frontend` is the browser application for GuestGuideIQ. One React SPA serves two audiences:

- **Property owners (hosts)** use the Owner app to sign up, describe a property, build and publish a guest guide, curate local recommendations ("Local recommendations": picked places, host-added places, host tips), manage guest links (stays) and manage their subscription plan.
- **Guests** open a stay link at `/s/<token>` and read the host's guide on their phone: an Overview, a **Places** tab, an Events tab, essentials such as arrival facts, and an AI chat widget.

The backend is `guestguideiq-app`, a separate repository. This repo owns no data. Every business fact it shows comes from the backend REST API through one client module (see `api-documentation.md`).

## Business domains visible in the code

| Domain | Owner surface | Guest surface |
|---|---|---|
| Identity and session | signup, login, optional Google sign-in, token refresh | opaque stay token in the URL; no login |
| Property and guide | property details form, guide editor, onboarding flow, guest preview | guide rendering (`GuestGuideView`) |
| Local places (POIs) | `LocalityCuration` + `PlacePicker` over the whole locality catalogue; feature / list / hide stances; host-added places and tips; `AreaPanel` | Places tab: host-picked places grouped by category, hours, price, host notes |
| Events | not observed in depth | Events tab and `DayRail` stay-day selector |
| Billing | plan controls, cancel confirmation | none |
| Guest links | stay/link management (`owner/links/`) | the link itself |
| Feedback and chat | feedback counts per listing | thumbs feedback on places, chat widget |

## Current intent context (`260927-places-filters`)

This intent adds filtering (and possibly a map) to the guest Places tab and to the host's curation panel. What the code supports today:

- **Computable on the guest side from the current payload**: category (via `poiCategory`), price (`profile.priceLevel`, `isFree`), "open on a selected stay day" (via `hoursOn(poi.hours, day.iso)`), and host picks (`stance` / `recommended`).
- **Not computable today**: distance and map pins (no place coordinates reach the frontend), and a true "open now" (no timezone reaches the guest). The host panel's catalogue rows (`LocalityPOI`) carry no hours, price, `poiCategory` or coordinates at all.
- **Hosting constraints**: the deployed CSP, the global `no-referrer` policy and the blocking built-output secret scan all constrain an embedded Google Map. See `architecture.md` § Security posture and `code-quality-assessment.md`.

## Key business rules encoded in the frontend

- Places on the guest side are **only** host-chosen places (`guide.favoritedPOIs`), in server order: featured first, then by host rank.
- Unknown opening hours display as unknown, never as open (`placeFormat.ts`).
- The owner's guest preview renders the real guest component with no preview-mode prop (`GuestGuideView.tsx:17-20`).
- `GuideTabs` is the only tablist on the guest page. Any new view switch must be a radiogroup or pressed-state buttons (project.md, 2026-09-30).
- Server-supplied empty-state copy renders as-is (team.md, Code Style).

Cross-references: component detail in `component-inventory.md`, data shapes in `api-documentation.md`.
