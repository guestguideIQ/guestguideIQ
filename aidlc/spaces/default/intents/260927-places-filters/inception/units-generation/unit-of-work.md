# Units of Work: Places Filters and Collapsible Categories

Upstream: the component catalogue (`../domain-design/components.md`), the decisions (`../domain-design/decisions.md`, ADR-001 to ADR-006) and the requirements (`../requirements-analysis/requirements.md`). Answers are cited from `units-generation-questions.md` as UQ1 and UQ2. There is no stories document, because user stories were skipped; requirements carry the acceptance criteria.

The work is split into four units (UQ1). The grouping follows how the work is delivered: by repo first, then by screen. It is not a pure domain split. `u2-places-foundation` in particular bundles four components that would separate along this line if the unit ever needed splitting: wire types, client and mocks; filtering rules and remembered choices; shared controls.

## Unit Table

| Unit ID | Directory | Kind | Repo | Complexity | Deployment |
|---|---|---|---|---|---|
| U1 | `u1-places-api` | service | `guestguideiq-app` | M | Shared: part of the existing backend service |
| U2 | `u2-places-foundation` | library | `guestguideiq-frontend` | L | Embedded: built into the existing frontend bundle |
| U3 | `u3-guest-places` | ui | `guestguideiq-frontend` | M | Embedded: built into the existing frontend bundle |
| U4 | `u4-host-curation` | ui | `guestguideiq-frontend` | M | Embedded: built into the existing frontend bundle |

The unit names `u1` to `u4` belong to this piece of work. Comments in the frontend code refer to units of the earlier frontend work (for example "u9-guest-guide-view"); those are different units.

## U1 — `u1-places-api` (service)

- **Description:** the additive backend changes that give both screens the data the filters need.
- **Components:** `Poi`, `Locality`, `GuestContext`, `GuestAccess` (the changed parts only).
- **Owns and delivers**
  - Distance from the property for each place, in the guest's place view and in the host's place list. Null when unknown. (FR10.1, ADR-001)
  - The property's timezone, with a fallback marker, on the guest stay response and on the host's place list. (FR10.2, ADR-002, ADR-003)
  - The host's enriched place list at its existing address: shared category, hours, price level, distance and stance per row. (FR10.3, ADR-004)
  - The price scale documented consistently as 0–4 with 0 meaning free. (FR10.5)
  - The backend's hand-kept contract note updated with the additions.
- **Boundaries:** no change to what guests are allowed to see. No place coordinates leave the server. No new endpoint, table or environment variable. No data filling.
- **Notes and constraints**
  - Every addition is optional and nullable, so the backend can deploy before the frontend. (FR10.4, NFR6)
  - The domain design review left three points for this unit's functional design:
    - who owns the route that serves the enriched host list, given the existing route-level ties between these components (review R-01);
    - whether the timezone rule becomes a shared helper rather than moving into `Locality` (review R-02);
    - what the fallback marker means when a locality's zone is the database default (review R-04).
  - Team practice: scenario test first, then implementation, then unit tests. Blocking CI and the 80% line coverage floor apply.

## U2 — `u2-places-foundation` (library)

- **Description:** everything both frontend screens share. It has no screen of its own.
- **Components:** `ApiContract`, `ApiClient`, `PlaceFiltering`, `PlacePreferences`, `DesignSystem` (the changed or new parts only).
- **Owns and delivers**
  - Wire types for the new response fields, the client mapping, the mock handlers used by tests, and the contract provenance record, changed together. (FR10.6)
  - The shared filtering rules: one grouping for both screens, open-now and open-on-a-day evaluation, the category, open, price, host picks and distance filters, sorting, counts, the missing-data rules and which filters to hide. (FR1.2, FR1.4, FR1.5, FR2–FR8, FR9.3, ADR-005)
  - Remembered choices: the one storage module, keyed by property and stay dates. (FR11.1–FR11.4, ADR-006)
  - Shared controls: filter chip, chip row, collapsible section header, filter sheet, checkbox group and radio group. (FR1.1, FR7.1, NFR1, NFR2)
- **Boundaries:** no screen composition. No knowledge of the day rail or of host actions. The controls know nothing about places.
- **Notes and constraints**
  - This unit fixes the response shapes on the frontend side. U1 and U2 must agree on them at functional design, because U2 does not wait for U1 to be built (UQ2).
  - The storage module needs its own narrow lint allowance (ADR-006). This widens the affirmed "no storage outside the API and session modules" practice and should be recorded as such.
  - The existing dialog control must block the page behind it before the filter sheet is built on it.
  - Hours evaluation, filter combination, distance formatting and remembered-choice handling are logic units and get unit tests. The controls are covered by scenario tests plus keyboard-only tests.
  - Rated L because it holds the hours logic, which has the most edge cases in this work.

## U3 — `u3-guest-places` (ui)

- **Description:** the guest Places tab, changed to use the foundation.
- **Components:** `GuestPlaces`.
- **Owns and delivers**
  - Collapsible category sections with the first one open. (FR1.3)
  - The chip row, filter sheet, result line and "Clear all" on the Places tab. (FR7.2, FR7.4)
  - The open filter following the day rail: "Open now" or "Open on [day]". (FR4.1)
  - The "Host pick" label on featured places. (FR6.2)
  - Restoring and saving the guest's choices. (FR11, through U2)
  - Sensible behaviour with no places, no property and no stay, as in the owner's preview. (FR8.3)
- **Boundaries:** no filtering rules of its own. No direct storage access. No second tab set on the page.
- **Notes and constraints**
  - The guide renderer is shared with the owner's preview, which passes no places.
  - The day rail appears only for stays of two days or more; without it the filter reads "Open now".

## U4 — `u4-host-curation` (ui)

- **Description:** the host's Local recommendations panel, changed to use the foundation.
- **Components:** `HostCuration`.
- **Owns and delivers**
  - The same filters, result line and collapsible categories as the guest tab. (FR9.1)
  - "Open now" only. (FR4.2)
  - Filters that change only what the host sees, with every curation action still available on visible rows. (FR9.2, FR9.4)
  - Reading stance from the enriched place list instead of joining a second call. (ADR-004)
  - No remembered choices across visits. (FR11.5)
- **Boundaries:** no filtering rules of its own. The panel's existing grouping module is replaced by the shared one.
- **Notes and constraints**
  - Hosts will see their list reorder once, because grouping moves from free-text categories sorted by name to the shared categories in their set order (ADR-005).
  - The place picker inside this panel is also used by onboarding. Functional design must say whether onboarding gets the filters or keeps the plain picker.
  - Whether hidden places are counted and filterable here was left open at requirements (review R-07).

## Sizing Notes

Sizes are relative: S is under a day of focused work, M a few days, L about a week. They are estimates for comparing the units, not commitments.


## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-10-02T05:08:02Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | aidlc/spaces/default/intents/260927-places-filters/inception/units-generation/unit-of-work.md > U2 Notes and constraints; aidlc/spaces/default/intents/260927-places-filters/inception/units-generation/unit-of-work-dependency.md > Integration points (u1-places-api and u2-places-foundation) | The U1/U2 response-shape agreement is the only coupling between two units that are designed in separate per-unit functional design passes, yet no artifact is named as its owner and neither unit's own notes (U1 says nothing about it) assign the work. Each pass would define the shapes independently and the drift is invisible to tests, since frontend tests run against mocks. The risk is disclosed, but the mechanism that closes it is not. | Name one place where the agreed shapes live (for example a shared contract section written before either unit's functional design) and state which unit authors it and which verifies against it. Add the obligation to U1's notes as well as U2's. | New |
| R-02 | Minor | aidlc/spaces/default/intents/260927-places-filters/inception/units-generation/unit-of-work-story-map.md > Map rows FR1.3, FR7.2, FR7.4; unit-of-work.md > U3 Boundaries ("no filtering rules of its own") | FR1.3 (first section open), FR7.2 (active-filter count) and FR7.4 (Clear all) are owned by U3, but U4 needs the same behaviour (FR9.1, "U4 applies the same rule"). Either U4 re-implements it, which can diverge, or it quietly lives in U2. U3's "no rules of its own" boundary contradicts owning these. | Move the shared logic (default-open rule, active-filter count, clear-all state reset) to U2 and leave U3 and U4 only the wiring, or state that U4 re-implements it and add a parity scenario to both units. | New |
| R-03 | Minor | aidlc/spaces/default/intents/260927-places-filters/inception/units-generation/unit-of-work.md > U2 Components; Unit Table (U2 row) | U2 holds 5 of 11 components and 28 of 45 requirements (62 percent) while U3 and U4 hold one component each. The grouping is honestly disclosed as delivery-shaped with its split line named, but with unit-major construction a single L-sized foundation delays every screen. | Optional: at delivery planning, consider splitting along the disclosed line (logic versus controls) if the foundation is built before the screens. | New |
| R-04 | Minor | aidlc/spaces/default/intents/260927-places-filters/inception/units-generation/unit-of-work.md > U1 and U2 Notes; ../domain-design/components.md > Review R-05, R-07 | Two accepted domain-design findings are not carried to a unit. R-05 (distance computed for the whole locality catalogue on every host read, inputs and coordinate source unstated) belongs to U1. R-07 (no stay means no key and no persisted choices; entry expiry unset) belongs to U2 and U3. R-01, R-02, R-03 and R-04 are carried correctly. | Add R-05 to U1's functional-design points and R-07 to U2's (expiry rule) and U3's (no-stay behaviour) notes. | New |
| R-05 | Minor | aidlc/spaces/default/intents/260927-places-filters/inception/units-generation/unit-of-work-story-map.md > NFR4 row; aidlc/spaces/default/intents/260927-places-filters/inception/units-generation/traceability.json > NFR4 | NFR4 (security and privacy) is mapped to U2 only, but the coordinates-stay-on-server obligation is U1's, as the row note itself says. | Add U1 as a secondary target for NFR4, or split the row. | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| Component coverage (components.md names vs unit lists) | PASS | All 11 components appear in exactly one unit: U1 has 4, U2 has 5, U3 has 1, U4 has 1. |
| Edge block, graph, tables | PASS | YAML is well formed and acyclic, uses lowercase path-segment names, and matches the mermaid graph, edge table and prose. The dotted u2-to-u1 line is labelled as an agreement, not a build dependency. |
| Topology-only check | PASS | No cross-unit build order or critical path is stated. The in-unit ordering is labelled as such. |
| Requirement coverage (story map vs traceability.json vs requirements.md) | PASS | All 45 FR sub-requirements appear once with the same unit in both files. The unit counts (6, 28, 6, 5) sum to 45. FR group IDs are N/A rows, and NFR5 and NFR8 are N/A with reasons. |
| Complexity and deployment | PASS | Present for every unit. |
| Kind fit | PASS | service, library, ui, ui are appropriate. |

### Summary

The unit split is sound and the edge block is consistent. The independence of u1 and u2 holds because every backend addition is optional and nullable, and the contract-drift risk is disclosed. The main gap is that no artifact owns the agreed response shapes, so drift is only disclosed, not closed (R-01). The other findings are minor ownership and carry-over gaps.
