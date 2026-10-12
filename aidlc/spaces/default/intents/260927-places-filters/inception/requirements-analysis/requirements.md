# Requirements: Places Filters and Collapsible Categories

Sources and traceability:
- **Ideation:** the intent-statement (`../../ideation/intent-capture/intent-statement.md`), the scope-document (`../../ideation/scope-definition/scope-document.md`, backlog items B1–B8 in `intent-backlog.md`) and the wireframes (`../../ideation/rough-mockups/wireframes.md`).
- **Code knowledge bases:** the business-overview, architecture and code-structure documents for both repos under `aidlc/spaces/default/codekb/guestguideiq-app/` and `aidlc/spaces/default/codekb/guestguideiq-frontend/`, plus each repo's `api-documentation.md`.
- **Answers in this stage:** `requirements-analysis-questions.md`, cited as RQ1–RQ7.
- **Team practices:** `aidlc/spaces/default/memory/team.md` and `project.md`. No separate team-practices document exists for this work, because practices discovery was skipped and the affirmed practices apply unchanged.

Each requirement names its origin in brackets.

## Intent Analysis

- **Goal:** guests find a relevant, nearby place in a long list without scrolling all of it, and hosts scan the places they curate. [intent-statement]
- **Type:** an enhancement to two existing screens, the guest Places tab and the host's Local recommendations panel, plus additive changes to the backend API that feeds them. [RQ1]
- **Scope:** multi-component, across two repos: `guestguideiq-frontend` and `guestguideiq-app`.
- **Complexity:** standard. The UI patterns are well understood. The uncertainty is in the data: what the API sends, and how little of it exists in production.
- **What changed since scope definition:**
  - The interactive Google Maps view (backlog item B8) moves to a later piece of work. [RQ5]
  - Backend API additions join this work. [RQ1]
  - Filling in missing place data stays out. [RQ2]

## Functional Requirements

### FR1 — Collapsible categories [B1]

- **FR1.1** Each category section on the guest Places tab and the host panel has a header that collapses and expands its places.
- **FR1.2** Each header shows the number of places in the category that match the current filters.
- **FR1.3** On first view, the first category is expanded and the others are collapsed. [wireframes Q3]
- **FR1.4** A category that filters leave empty stays in place, visually dimmed, showing "0 places". Expanding it shows "None match your filters". [wireframes Q4]
- **FR1.5** When no place has a category, the existing flat list is shown with no category headers. Filters and sort still apply. [architecture: `placeGroups` flat-list fallback]

Acceptance:
- Given a guide with places in three categories, when the Places tab opens, then the first category is expanded, the other two are collapsed, and each header shows its count.
- Given a filter that matches no place in "Shopping", when it is applied, then the Shopping header reads "0 places", is dimmed and remains in its position.
- Given a guide where no place has a category, when the Places tab opens, then places appear as one flat list with no headers.

### FR2 — Distance from the property [B2]

- **FR2.1** Each place shows its distance from the property, in miles to one decimal place. A distance under 0.1 miles reads "under 0.1 mi". [RQ6]
- **FR2.2** Distance is measured in a straight line from the property's address location to the place. It is never measured from the guest's device. [intent-statement Q3]
- **FR2.3** A distance filter offers: Any, under 0.5 mi, under 1 mi, under 3 mi and under 10 mi. One band is selected at a time, and Any is the default. [RQ6]
- **FR2.4** A sort control offers "Host's order" (the default) and "Nearest first". Nearest first sorts places within each category by distance. Switching back restores the host's order exactly.
- **FR2.5** A place with no known location shows no distance. Under "Nearest first" it sorts after every place that has a distance. It never shows as "0 mi".
- **FR2.6** When the property itself has no known location, no distances are shown and the distance filter and the "Nearest first" sort are hidden.

Acceptance:
- Given a property and a place 0.42 miles apart, when the place card renders, then it shows "0.4 mi".
- Given places at 0.4, 2.0 and 6.0 miles, when "under 3 mi" is selected, then the first two are shown and the count reads 2.
- Given "Nearest first" and a place with no location, when the category renders, then that place is last and shows no distance.
- Given a property with no location, when the Places tab opens, then no distance, distance filter or nearest-first sort appears.

### FR3 — Category filter [B3]

- **FR3.1** A category filter lets the person choose one or more categories. Only places in the chosen categories are shown.
- **FR3.2** The filter lists the categories present in the current place list, in the same order as the sections, including "Other places" when it exists.

Acceptance:
- Given categories Dining, Outdoors and Culture, when Dining and Culture are chosen, then Outdoors shows "0 places" and the count equals the Dining and Culture places combined.

### FR4 — Open filter [B4]

- **FR4.1** On the guest Places tab, the open filter follows the day rail. When today is the selected day, or no day rail is shown, it reads "Open now" and keeps places open at the current time in the property's local time. When another day is selected, it reads "Open on [weekday]" and keeps places open at any time on that day. [wireframes Q1]
- **FR4.2** On the host panel the filter always reads "Open now". [wireframes summary]
- **FR4.3** "Open" is evaluated against the place's opening hours for that date, including:
  - several opening spans in a day;
  - a span that closes after midnight, which counts as open into the next day until its closing time;
  - a day marked closed;
  - rules that apply only between certain dates.
- **FR4.4** A day with no hours recorded is treated as unknown, not closed. See FR8.2.

Acceptance:
- Given a place open 20:00–02:00 on Saturday, when it is 01:00 on Sunday in the property's local time and "Open now" is on, then the place is shown.
- Given a place open 09:00–12:00 and 14:00–18:00, when it is 13:00 local time and "Open now" is on, then the place is not shown.
- Given the day rail on a Tuesday that is not today, when the filter is used, then it reads "Open on Tuesday" and keeps places with any open span on Tuesday.
- Given a one-day stay with no day rail, when the Places tab opens, then the filter reads "Open now".

### FR5 — Price filter [B5]

- **FR5.1** A price filter offers Free, $, $$, $$$ and $$$$. One or more can be selected.
- **FR5.2** A price level of 0 means Free. The filter and the place card treat it that way. [backend architecture: price scale conflict TD-22]

Acceptance:
- Given places at Free, $$ and $$$$, when Free and $$ are selected, then two places are shown.

### FR6 — Host picks filter [B6]

- **FR6.1** A "Host picks" filter keeps only places the host marked as featured. [RQ3]
- **FR6.2** A featured place carries a visible "Host pick" label on its card, so the filter's meaning is clear before it is used.

Acceptance:
- Given three featured places and five listed places, when "Host picks" is on, then three places are shown and each carries the "Host pick" label.

### FR7 — Filter controls and result count [B7]

- **FR7.1** A chip row offers the open filter, host picks and category as quick filters. A "Filters" chip opens a sheet holding distance, price and sort. [wireframes Q2]
- **FR7.2** The "Filters" chip shows how many filters in the sheet are active.
- **FR7.3** The sheet's confirm button shows the number of places that would match ("Show N places") and updates as options change.
- **FR7.4** "Clear all" resets every filter and the sort to their defaults.
- **FR7.5** Filters combine with AND across filter types. A place is shown only if it passes every active filter.
- **FR7.6** The list shows a line with the number of matching places. When nothing matches, it reads "No places match" with a "Clear filters" action.

Acceptance:
- Given "Open now" and "under 1 mi" active, when a place is open but 2 miles away, then it is not shown.
- Given filters that match nothing, when the list renders, then "No places match" and "Clear filters" appear, and choosing it restores the full list.

### FR8 — Behaviour when data is missing [RQ2]

- **FR8.1** A filter is hidden when no place in the list has the data it needs: distance when no place has a location, open when no place has hours, price when no place has a price level.
- **FR8.2** When a filter is active, a place with no value for it is not shown as a match. The result line states how many places were left out for that reason (for example, "4 places have no hours listed") and offers to show them.
- **FR8.3** The Places tab and the host panel work with no places at all, showing their existing empty states with no filter controls. [frontend architecture: shared guide renderer in the owner preview]

Acceptance:
- Given no place has a price level, when the Filters sheet opens, then no price section appears.
- Given "Open now" is on and four places have no hours, when the list renders, then those four are not listed as open and the line "4 places have no hours listed" appears with a way to show them.

### FR9 — Host panel [RQ4, scope Q2]

- **FR9.1** The host's Local recommendations panel has collapsible categories (FR1), distance (FR2), and the category, open, price and host picks filters (FR3–FR7), with the missing-data behaviour in FR8.
- **FR9.2** Filters and collapsing change only what the host sees. They never change what a guest sees, and never change a place's stance, order or note.
- **FR9.3** The host panel groups places by the same shared categories, in the same order and with the same "Other places" label, as the guest tab. [frontend architecture: two grouping modules differ]
- **FR9.4** The existing host actions (pick, feature, list, hide, add and edit a place) stay available on each row while filters are active.

Acceptance:
- Given a host filters to "Host picks", when a guest opens the guide, then the guest sees the same places as before the host filtered.
- Given the same places on both screens, when each is grouped, then the category names and their order match.

### FR10 — Backend API additions [RQ1]

These are additive changes to `guestguideiq-app`. Each is listed with the reason it is needed.

- **FR10.1** The guest stay response gives the frontend what it needs to show each place's distance from the property (FR2). Whether the server sends a computed distance, the place's coordinates or both is a design decision. See Open Questions.
- **FR10.2** The guest stay response gives the frontend what it needs to evaluate "open now" in the property's local time (FR4.1). The design decides whether that is the timezone itself or a server-computed value.
- **FR10.3** The host's place list includes, for each place: its shared category, opening hours, price level, the data needed for distance, and its stance. This replaces joining stance from a second call on the client. (FR9)
- **FR10.4** Every addition is optional and nullable. A frontend that ignores the new fields keeps working, and a place with no data sends null, never a default value such as 0.
- **FR10.5** The price level is documented as 0–4 with 0 meaning free, in the schema comment, the guest type and the contract document, so the three agree. (FR5.2)
- **FR10.6** The frontend's hand-written contract types, client methods, mock handlers and contract provenance record are updated together with the backend change. [frontend api-documentation: contract provenance]

Acceptance:
- Given a place with coordinates and a located property, when the guest stay response is read, then the frontend can show the place's distance without any further request.
- Given a place with no coordinates, when the response is read, then the distance data for it is null.
- Given the host's place list, when it is read, then each row carries category, hours, price level, distance data and stance.
- Given the previous frontend build, when it reads the new responses, then it behaves as before.

### FR11 — Remembering filter choices [RQ7]

- **FR11.1** A guest's filter and sort choices and which categories are expanded are remembered across visits on the same device, for that stay.
- **FR11.2** Remembered choices from one stay never apply to another stay.
- **FR11.3** If a remembered choice no longer applies (for example, a category that no longer exists, or a filter now hidden under FR8.1), it is dropped silently and the rest are kept.
- **FR11.4** "Clear all" also clears the remembered choices.
- **FR11.5** The host panel does not remember filter choices across visits.

Acceptance:
- Given a guest sets "under 1 mi" and closes the guide, when they reopen the same stay link on the same device, then "under 1 mi" is still set.
- Given a guest with remembered choices for one stay, when they open a different stay link, then no filters are set.

## Non-Functional Requirements

- **NFR1 — Accessibility.** [market research Q5; team practice]
  - Every new control is operable by keyboard alone and announced correctly by a screen reader, to WCAG 2.1 AA.
  - Category headers expose their expanded or collapsed state.
  - The filter sheet behaves as a modal dialog: focus moves in, stays in, and returns to the "Filters" chip on close.
  - The result count is announced when it changes.
  - The existing Places tabs stay the only tab set on the page.
  - Touch targets are at least 44 by 44 CSS pixels.
  - Verified by the existing automated accessibility check plus a keyboard-only scenario test for each new control.
- **NFR2 — Mobile-first.** [market research Q5]
  - Every new control is usable at a 320 CSS pixel viewport width with no horizontal page scroll. The chip row may scroll sideways within itself.
- **NFR3 — Responsiveness.**
  - Applying or changing a filter updates the list and counts within 100 ms for a list of 200 places on a mid-range phone.
  - Filtering makes no network request.
- **NFR4 — Security and privacy.** [frontend architecture: security posture]
  - This work adds no third-party script, style or network origin, and makes no change to the Content-Security-Policy or referrer policy.
  - Remembered filter choices (FR11) contain no credential and no personal data. The stay link token is never written to browser storage.
  - Browser storage is reached only through the frontend's existing storage boundary, not from screen components.
  - Place data sent to guests stays limited to places the host has chosen to show.
- **NFR5 — Testing.** [team practice: Testing Posture]
  - Each acceptance criterion above has a scenario test written before its implementation, substituting only at the network boundary.
  - Logic units (open-hours evaluation, distance formatting, filter combination, remembered-choice handling) have unit tests.
  - Both repos keep their coverage floors: 80% lines in each, and the frontend's 70% branches.
  - Every pull request passes build, lint, type-check, test and coverage before merge.
- **NFR6 — Compatibility.**
  - The backend additions are backwards compatible (FR10.4), so the backend can deploy before the frontend.
- **NFR7 — Reliability.**
  - If remembered choices cannot be read or written (storage blocked or full), the screens work with default filters and show no error.
  - Hours evaluation never throws on malformed or partial hours. Such a place is treated as having no hours (FR8.2).
- **NFR8 — Observability.**
  - No new metric or alert is required. Backend errors on the changed endpoints surface through the existing error envelope and logs. No success measure is defined, so no usage tracking is added. See Open Questions.

## Constraints

- No deadline. [scope Q5]
- The lighter plan stays. Contract design, NFR design and the deployment stages are skipped, so the API additions (FR10) are specified here and in the design stages. [intent capture Q9; market research Q8]
- The frontend calls the backend only through its one API client module, and its contract types are hand-written with a provenance record. [team practice: Code Style; frontend architecture]
- The frontend lint rules keep `fetch` and browser storage out of screen code. [frontend architecture]
- The backend has no geospatial database extension. Distance is computed in application code, and tested helpers for it already exist but are not yet used by any endpoint. [backend architecture]
- Backend and frontend changes each go through a short-lived branch, a reviewed pull request and blocking CI. [project rules]

## Assumptions

- **A1.** Straight-line distance is acceptable. Walking or driving distance is not required. Rationale: the scope asks for "distance from the property", and routing would need a paid third-party service.
- **A2.** "Open now" on the host panel uses the property's local time, like the guest tab. Rationale: hosts curate for a property, not for their own location.
- **A3.** Places with no value for an active filter are left out of the matches but counted and recoverable (FR8.2). Rationale: this follows RQ2's "never wrongly excluded" without showing closed-looking places as open. It is an interpretation, so it is flagged for your review at approval.
- **A4.** Miles apply everywhere for now. Rationale: RQ6 chose miles without a country rule.
- **A5.** The property's location will exist for properties that want distance. Today no screen collects it, so in production the distance features will stay hidden (FR2.6) until that is addressed.

## Out of Scope

- The interactive Google Maps view, map provider setup, map key and any change to security headers. Moved to a later piece of work. [RQ5]
- Filling in missing place data: geocoding existing places, letting hosts set a location on places they add, and loading hours or prices. [RQ2]
- A screen for hosts to set the property's location. [frontend api-documentation]
- The rating filter. [intent capture Q10]
- Distance from the guest's device, and walking or driving distance. [intent-statement Q3; A1]
- Server-side filtering, sorting or pagination of place lists.
- Fixing the host catalogue's hidden-places inconsistency found in the scan (TD-26), and retiring the older "recommended" signal.
- Usage tracking or analytics.

## Open Questions

- **OQ1.** Should the guest receive each place's coordinates, or only a server-computed distance? With the map deferred, distance alone would do and exposes less. Coordinates would be needed again when the map returns. For domain design.
- **OQ2.** Should the guest receive the property's timezone, or a server-computed "open now" value? A timezone lets the frontend handle "open on [day]" and stays correct as time passes. For domain design.
- **OQ3.** How many live places have coordinates, hours and a price level, and how many properties have a location? The production database was not queried. Until this is known, expect the distance, open and price filters to be hidden in production (FR8.1, FR2.6).
- **OQ4.** How are remembered choices keyed to a stay without storing the stay link token (NFR4)? For domain design.
- **OQ5.** The success measure is still undefined (intent capture Q5).


## Review

**Verdict:** READY
**Reviewer:** aidlc-product-lead-agent
**Date:** 2026-10-01T05:35:40Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | aidlc/spaces/default/intents/260927-places-filters/inception/requirements-analysis/requirements.md > FR10.2, FR10.3, FR4.2, A2 | The host panel's "Open now" (FR4.2, A2) needs the property's timezone, but FR10.2 adds a timezone only to the guest stay response and FR10.3 lists no timezone for the host place list. The codekb says the only owner-reachable timezone is `area.timezone` on the area endpoint, which can be null. As written, host "Open now" has no stated data source. | State where the host panel gets the property timezone (extend FR10.3, or name the area endpoint and say what happens when it is null), and add an acceptance criterion for the host case. | New |
| R-02 | Major | aidlc/spaces/default/intents/260927-places-filters/inception/requirements-analysis/requirements.md > FR8.2, A3 | RQ2 was answered as "places missing a value are never wrongly excluded". FR8.2 excludes places with no value from the matches whenever a filter is active (hidden behind a "show them" prompt). The reading is disclosed in A3 and is defensible, but it is the opposite of the literal wording of the human's answer. With live data probably lacking hours, price and coordinates, this will often apply. | Put the A3 interpretation to the human explicitly at the approval gate as a choice (exclude and count versus include and mark unknown), and record the answer. Keep FR8.2 as is only if confirmed. | New |
| R-03 | Minor | aidlc/spaces/default/intents/260927-places-filters/inception/requirements-analysis/requirements.md > FR4.1, FR4.3 | The codekb states guest `hours` are limited to the stay window. The requirement does not say what "Open now" does when the current time is outside the stay (before check-in, after checkout), and FR4.3's rule-by-date cases are not tied to the shape actually sent. | Add one criterion for "Open now" outside the stay window, and confirm the hours shape against `api-documentation.md` before design. | New |
| R-04 | Minor | aidlc/spaces/default/intents/260927-places-filters/inception/requirements-analysis/requirements.md > FR5.2, FR10.5 | Price 0 is treated as Free, but the deprecated `isFree` flag and the `free_entry` feature overlap with it and can disagree with `priceLevel`. Which signal wins is not stated. | State precedence when `isFree` and `priceLevel` conflict, or state that only `priceLevel` drives the filter. | New |
| R-05 | Minor | aidlc/spaces/default/intents/260927-places-filters/inception/requirements-analysis/requirements.md > FR11.1, NFR4, Constraints | The lint ban allows browser storage only in `src/api/**` and `src/session/**`. NFR4 says storage goes through the "existing storage boundary", but filter preferences are not session data. A lint exception or a new owning module is implied and not stated, and FR11.1 also stores expanded categories (FR1.3 default) without saying how the two interact. | State that a new storage-owning module (with its lint override) is a requirement, and that remembered expanded-state overrides the FR1.3 default. | New |
| R-06 | Minor | aidlc/spaces/default/intents/260927-places-filters/inception/requirements-analysis/requirements.md > NFR3, NFR5 | The 100 ms figure for 200 places and the 70% branch floor for the frontend carry no cited source, and "mid-range phone" is not a defined device. | Cite where the 70% comes from, and define the reference device or measure the timing in a test environment. | New |
| R-07 | Minor | aidlc/spaces/default/intents/260927-places-filters/inception/requirements-analysis/requirements.md > FR9.2, FR9.4 | The host panel can contain hidden places (TD-26 is out of scope), but FR1.2 and FR7.6 counts and filters do not say whether hidden places count or whether a stance filter exists there. | Say whether hidden places are counted and filterable on the host panel, or confirm they are unaffected. | New |

### Summary

The artifact is thorough: RQ1 to RQ7 are reflected, B1 to B7 are covered, B8 is moved out with its reason, FR10 and FR11 name their origin, and IDs and required sections are present. Two Major items need the human's attention at the gate: the host panel has no stated timezone source (R-01), and A3 reads RQ2 in a way that differs from its literal wording (R-02). Neither blocks engineering, so the verdict is READY.
