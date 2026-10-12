# Architecture Decisions: Places Filters and Collapsible Categories

These records cover the significant choices behind `components.md`. They build on the requirements (`../requirements-analysis/requirements.md`) and the existing architecture and component-inventory documents for both repos under `aidlc/spaces/default/codekb/`. Answers from `domain-design-questions.md` are cited as DQ1–DQ5.

## ADR-001: The backend computes distance and sends it; place coordinates stay on the server

- **Status:** Accepted (DQ1), 2026-10-01
- **Context**
  - Guests need each place's distance from the property (FR2, FR10.1).
  - The backend holds place coordinates and has a tested distance calculation that no endpoint uses.
  - The guest response sends the property's coordinates but not the places'.
  - The interactive map, which would need coordinates on the client, is out of this work.
- **Decision**
  - `Poi` computes the straight-line distance from the property to each place.
  - `GuestContext` adds it to the guest's place view and to the host's place list, as a nullable value in metres.
  - Place coordinates are not sent to any client.
- **Consequences**
  - Positive: one distance calculation, already tested, in one repo. The least data leaves the server. The frontend only formats a number.
  - Negative: the distance is fixed to the property. When the map returns, coordinates will have to be added to the responses then.
  - Negative: the calculation runs on every guest read. It is cheap, because it is in-memory arithmetic over one property's picks.
  - Security and privacy: no new location data reaches the browser. The property's coordinates were already sent.
- **Alternatives Rejected**
  - Send coordinates and compute on the frontend: ready for the map, but duplicates the calculation in both repos and exposes more data than this work needs.
  - Send both: the same exposure with no present use for the coordinates.

## ADR-002: The backend sends the property's timezone; the frontend evaluates "open"

- **Status:** Accepted (DQ2), 2026-10-01
- **Context**
  - "Open now" must be judged in the property's local time (FR4), on both the guest tab and the host panel (review finding R-01).
  - The guest tab also needs "open on [day]" for the day picked in the day rail.
  - No guest-reachable response carries a timezone today.
  - Hours are already sent to guests as local wall-clock times.
- **Decision**
  - The guest stay response and the host's place list each carry the property's timezone as an IANA name, with a marker saying whether it is a configured zone or the fallback.
  - One frontend evaluator in `PlaceFiltering` decides whether a place is open at an instant or on a date.
- **Consequences**
  - Positive: one evaluator serves "open now", "open on [day]" and both screens. The answer stays correct while the page stays open.
  - Negative: the hours logic (overnight spans, several spans, closed days, date-limited rules) lives in the frontend and must be tested thoroughly there.
  - Negative: when the timezone is only the fallback, "open now" may be wrong. The marker lets the frontend hide the filter in that case; functional design sets the rule.
  - Security and privacy: a timezone is low-sensitivity and roughly implied by the property's address, which guests already see.
- **Alternatives Rejected**
  - A server-computed "open now" flag: goes stale while the page is open and cannot answer "open on [day]".
  - Both the timezone and a flag: two sources of truth that can disagree.

## ADR-003: Timezone resolution moves into Locality

- **Status:** Accepted, 2026-10-01
- **Context**
  - The rule "the locality's zone, then the property's, then UTC" exists today inside guest access, used for stay expiry.
  - ADR-002 needs the same answer in two places: the guest response (`GuestAccess`) and the host's place list (`GuestContext`).
  - `GuestAccess` already depends on `GuestContext`, so `GuestContext` cannot call `GuestAccess` without a cycle.
- **Decision**
  - `Locality` owns the rule and exposes it, including whether the result is the fallback.
  - `GuestAccess` and `GuestContext` both call it. Stay expiry uses the same function, so behaviour there does not change.
- **Consequences**
  - Positive: one rule, no cycle, and stay expiry and "open now" can never disagree about the zone.
  - Negative: `Locality` takes the property's own zone as an input, which makes it aware of a property attribute.
  - Negative: the locality zone defaults to UTC in the database, so "never set" cannot be told apart from "set to UTC". Functional design must decide how the fallback marker treats that case.
  - Security and compliance: none. No new data is stored.
- **Alternatives Rejected**
  - Keep it in `GuestAccess` and call it from `GuestContext`: a dependency cycle.
  - Copy the rule into `GuestContext`: two copies of a rule that must stay identical.
  - A new shared component just for this: one function does not justify a component.

## ADR-004: The host's enriched place list is built by GuestContext, at the existing address

- **Status:** Accepted (DQ3), 2026-10-01
- **Context**
  - The host panel needs each place's category, hours, price, distance and stance (FR9, FR10.3).
  - Today the host's place list comes from `Poi` with seven fields, and the frontend joins stance from a second call.
  - `GuestContext` already joins exactly this data for guests. `Poi` sits below `GuestContext` and cannot depend on it.
- **Decision**
  - `GuestContext` produces the host's enriched place list, taking base rows and distances from `Poi`.
  - It is served at the existing host place-list address, composed at the HTTP edge, so the frontend makes the same call and receives more.
  - Every added field is optional and nullable.
- **Consequences**
  - Positive: one call for the host panel. The join that builds the guest view is reused. A frontend that ignores the new fields keeps working (FR10.4).
  - Negative: the place-list route now reaches two components. The same pattern already exists for favourites, where the route layer calls `GuestContext` through an optional port.
  - Negative: the list is still unpaginated, and each row is larger. Acceptable for one locality's catalogue; revisit if catalogues grow.
  - Security: the host sees hidden and offered stances, which guests never receive. The host list stays behind owner authentication and the ownership check on the property.
- **Alternatives Rejected**
  - A new, separate endpoint: a second address to keep in step, and the old one left serving a thinner view of the same list.
  - Have `Poi` do the join: `Poi` would depend on `GuestContext`, a cycle.

## ADR-005: One shared, UI-free filtering module for both screens

- **Status:** Accepted (DQ4), 2026-10-01
- **Context**
  - The guest tab and the host panel must show the same categories in the same order and filter the same way (FR9.3).
  - Today they group places with two different modules that sort and label differently.
  - Team practice: lower-level unit tests are for logic units; components are covered by scenario tests.
- **Decision**
  - A new `PlaceFiltering` component holds grouping, open-hours evaluation, filter combination, sorting, counts and the rules for hiding filters. It has no screen code, no network access and no storage access.
  - Generic controls (chip, chip row, collapsible header, filter sheet, checkbox and radio groups) go into `DesignSystem`.
  - The host panel's own grouping module is replaced by `PlaceFiltering`.
- **Consequences**
  - Positive: the two screens cannot drift apart. The rules are unit-testable without rendering anything.
  - Negative: the host panel's grouping changes from free-text categories sorted by name to the shared categories in their set order. Hosts will see their list reorder once.
  - Negative: the existing filter-sheet base (the dialog) must be made to block the page behind it before the sheet is built on it.
  - Security and compliance: none.
- **Alternatives Rejected**
  - Each screen keeps its own logic: two implementations of the hours rules to keep identical, and the mismatch FR9.3 exists to remove.
  - Put the rules in the guest guide component and import them into the owner panel: makes one screen depend on the other's internals.

## ADR-006: Remembered choices live in one storage module, keyed by property and stay dates

- **Status:** Accepted (DQ5), 2026-10-01
- **Context**
  - A guest's filter choices are remembered across visits on the same device, for that stay (FR11).
  - The stay link's token is a seven-day credential that cannot be revoked, and must never be written to browser storage (NFR4).
  - The frontend's lint rules allow browser storage only inside the API and session modules. Filter choices are neither (review finding R-05).
- **Decision**
  - A new `PlacePreferences` component is the only module that reads or writes storage for this feature. It gets its own, narrowly scoped lint allowance.
  - The storage key is built from the property id and the stay's check-in and check-out dates. The token is never part of it.
  - Reads and writes never throw. Unreadable or malformed entries are treated as "nothing remembered".
- **Consequences**
  - Positive: the token never reaches storage. The storage exception is one small module that can be reviewed in isolation.
  - Negative: two stays at the same property on the same dates, opened on the same device, share choices. Accepted as unlikely and harmless.
  - Negative: the lint allowance is a deliberate, recorded widening of an affirmed rule. The practice's wording should be reviewed at the next practices gate.
  - Negative: stored entries are never cleaned up automatically. Functional design should add an expiry, such as dropping entries after the stay's check-out date.
  - Security and privacy: the stored value holds filter settings and category names only, with no credential and no personal data. The key reveals a property id and stay dates to anyone with access to the device's storage, which is already visible in the guide itself.
- **Alternatives Rejected**
  - Key by a one-way hash of the token: unique per link, but still derived from the credential and one mistake away from storing it.
  - Key by the property only: choices would carry over to a different guest's stay on a shared device.
  - Keep choices in memory only: does not meet FR11.
  - Put storage access in the screen component: breaks the rule that screen code never touches storage.
