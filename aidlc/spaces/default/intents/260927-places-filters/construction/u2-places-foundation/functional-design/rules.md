# Business Rules: u2-places-foundation

Upstream: the unit definition (`../../../inception/units-generation/unit-of-work.md`, U2), its requirement map (`../../../inception/units-generation/unit-of-work-story-map.md`), the requirements (`../../../inception/requirements-analysis/requirements.md`) and the component catalogue (`../../../inception/domain-design/components.md`). Answers from `functional-design-questions.md` are cited as FQ1–FQ5. There is no contract-summary document.

```yaml
rules:
  - id: BR1.1
    statement: Places are grouped by shared category, in one order for both screens.
    category: policy
    applies_to: FilterResult.groups
    trigger: Grouping a list of places.
    logic: IF at least one place has a category THEN make one section per category name, ordered by the lowest sort order in the section and then by name.
    violation: Not applicable.
    source: FR3.2, FR9.3

  - id: BR1.2
    statement: Places with no category go in one "Other places" section, last.
    category: policy
    applies_to: FilterResult.groups
    trigger: Grouping a list of places.
    logic: IF some places have a category and some do not THEN the ones without go in a section named "Other places" after every other section.
    violation: Not applicable.
    source: FR3.2, FR9.3

  - id: BR1.3
    statement: When no place has a category, the list is flat.
    category: policy
    applies_to: FilterResult.flatPlaces
    trigger: Grouping a list of places.
    logic: IF no place has a category THEN return one flat list and no sections. Filters and sort still apply. The category filter is not offered.
    violation: Not applicable.
    source: FR1.5

  - id: BR1.4
    statement: A section whose places are all filtered out is still returned, with a count of zero.
    category: policy
    applies_to: FilterResult.groups
    trigger: Applying filters.
    logic: IF a section existed before filtering THEN it exists after filtering, in the same position, with its matching count, which may be 0.
    violation: Not applicable.
    source: FR1.2, FR1.4

  - id: BR2.1
    statement: A place is open at an instant when the local time in the property's zone falls inside one of its opening spans.
    category: calculation
    applies_to: FilterablePlace.hours with OpenContext mode now
    trigger: Evaluating the open filter in mode now.
    logic: Days of the week are numbered 0 for Sunday to 6 for Saturday. A span that does not close the next day covers its own day from its opening time up to, but not including, its closing time. A span that closes the next day covers its own day from its opening time to midnight; its after-midnight part is BR2.2. IF the local time falls in any span of the local day THEN the place is open. A day may have several spans; any one is enough.
    violation: Not applicable.
    source: FR4.3

  - id: BR2.2
    statement: A span that closes after midnight keeps the place open into the next day.
    category: calculation
    applies_to: FilterablePlace.hours with OpenContext mode now
    trigger: Evaluating the open filter in mode now.
    logic: IF the previous local day has a span marked as closing the next day AND the local time is before that span's closing time THEN the place is open. Such a span also counts as open from its opening time until midnight on its own day.
    violation: Not applicable.
    source: FR4.3

  - id: BR2.3
    statement: A day marked closed has no open time.
    category: calculation
    applies_to: FilterablePlace.hours
    trigger: Evaluating the open filter.
    logic: IF the day is marked closed THEN the place is not open on that day from that day's own hours. An overnight span from the previous day still applies under BR2.2.
    violation: Not applicable.
    source: FR4.3

  - id: BR2.4
    statement: A day with no usable hours is unknown, not closed.
    category: policy
    applies_to: FilterablePlace.hours
    trigger: Evaluating the open filter.
    logic: The day is unknown IF the place has no hours, OR the day is missing from its hours, OR the day is present, is not marked closed and has no spans. In mode now, an overnight span from the previous day can still make the place open. A place is definitely not open only when the day is marked closed, or the day has spans and none covers the time.
    violation: Not applicable.
    source: FR4.4, FQ2

  - id: BR2.5
    statement: A place is open on a day when that day has at least one opening span.
    category: calculation
    applies_to: FilterablePlace.hours with OpenContext mode on-day
    trigger: Evaluating the open filter in mode on-day.
    logic: IF the weekday of the date has at least one span and is not marked closed THEN the place is open on that day. A span spilling over from the previous day does not by itself make the day open.
    violation: Not applicable.
    source: FR4.1, FR4.3

  - id: BR2.6
    statement: Hours evaluation never throws on bad data, and reports bad data as unknown.
    category: validation
    applies_to: FilterablePlace.hours
    trigger: Evaluating the open filter.
    logic: A span is invalid IF a time is not a valid hours-and-minutes value, OR its closing time is not after its opening time while it is not marked as closing the next day. A day entry is invalid IF its day of week is outside 0 to 6. Invalid spans and day entries are ignored. IF that leaves the day with nothing usable THEN the result is unknown under BR2.4. The evaluation returns a value in every case (open, not open or unknown) and never throws. The unknown result reaches the person through the left-out count in BR3.6, so it is surfaced, not hidden.
    violation: The place is treated as having no hours listed.
    source: NFR7

  - id: BR2.7
    statement: The open filter's mode follows the screen, the timezone and the selected day.
    category: policy
    applies_to: OpenContext
    trigger: A screen builds the open context.
    logic: The screen states whether it is the guest tab or the host panel. A timezone is known only when it is present and is a zone name the platform recognises; an unrecognised name counts as unknown. Guest tab, timezone known, and no selected day or the selected day is today in that zone gives mode now. Guest tab, timezone known, and the selected day is another day gives mode on-day for that day. Guest tab, timezone unknown, and a day is selected gives mode on-day for that day. Guest tab, timezone unknown, and no selected day gives mode on-day for today, where today is the current calendar date on the guest's device. Host panel with a known timezone gives mode now. Host panel with an unknown timezone gives mode unavailable.
    violation: Not applicable.
    source: FR4.1, FR4.2, FQ1

  - id: BR2.8
    statement: Date-limited hours rules are applied by the backend; the frontend evaluates the hours it receives.
    category: policy
    applies_to: FilterablePlace.hours
    trigger: Evaluating the open filter.
    logic: The hours a screen receives carry no validity dates. The backend has already selected the rules that apply (for a guest, the rules that apply during the stay; for a host, the rules in effect today). The frontend evaluates those hours as given and does not treat a place flagged as seasonal differently. A seasonal place keeps the note the place card already shows.
    violation: Not applicable.
    source: FR4.3

  - id: BR3.1
    statement: The category filter keeps places in any of the chosen categories.
    category: policy
    applies_to: FilterState.categories
    trigger: Applying filters.
    logic: IF one or more categories are chosen THEN a place passes when its section name is one of them. IF none is chosen THEN every place passes.
    violation: Not applicable.
    source: FR3.1

  - id: BR3.2
    statement: The price filter keeps places at any of the chosen price levels, and the price level outranks the older free flag.
    category: policy
    applies_to: FilterState.priceLevels
    trigger: Applying filters.
    logic: IF the place has a price level THEN that is its price. ELSE IF the older free flag is true THEN its price is 0. ELSE its price is unknown. Price 0 is Free. A place passes when its price is one of the chosen levels.
    violation: Not applicable.
    source: FR5.1, FR5.2, FQ3

  - id: BR3.3
    statement: The host picks filter keeps places the host marked as featured.
    category: policy
    applies_to: FilterState.hostPicksOnly
    trigger: Applying filters.
    logic: IF host picks only is on THEN a place passes when it is a host pick.
    violation: Not applicable.
    source: FR6.1

  - id: BR3.4
    statement: The distance filter keeps places closer than the chosen band.
    category: calculation
    applies_to: FilterState.distanceBand
    trigger: Applying filters.
    logic: IF a band is chosen THEN a place passes when its distance in metres is less than the band's limit. The limits are 0.5, 1, 3 and 10 miles, at 1609.344 metres to the mile. IF the band is any THEN every place passes.
    violation: Not applicable.
    source: FR2.3

  - id: BR3.5
    statement: Filters of different kinds combine with AND.
    category: policy
    applies_to: FilterResult
    trigger: Applying filters.
    logic: IF several filters are active THEN a place is a match only when it passes every one of them.
    violation: Not applicable.
    source: FR7.5

  - id: BR3.6
    statement: A place with no value for an active filter is left out and counted, unless the person asks to see such places.
    category: policy
    applies_to: FilterResult.leftOut, FilterState.includeUnknown
    trigger: Applying the open, price or distance filter.
    logic: For each active filter a place is pass, fail or unknown. IF the person has chosen to include unknown places for a filter THEN unknown counts as pass for it. A place is a match when it passes every active filter. A place is left out when it fails no active filter and is unknown for at least one. Each left-out place adds one to the left-out count of every filter it is unknown for, so a place unknown for two filters is counted under both, and it becomes a match only when unknown places are included for both. Turning a filter off removes its include-unknown choice.
    violation: Not applicable.
    source: FR8.2

  - id: BR4.1
    statement: The default order is the order the screen received.
    category: policy
    applies_to: FilterState.sort
    trigger: Sorting.
    logic: IF sort is host order THEN places within each section keep their received order.
    violation: Not applicable.
    source: FR2.4

  - id: BR4.2
    statement: Nearest first sorts by distance within each section, with unknown distances last.
    category: calculation
    applies_to: FilterState.sort
    trigger: Sorting.
    logic: IF sort is nearest first THEN within each section places are ordered by distance ascending. Places with no distance come after all others. Ties keep their received order. Switching back to host order restores the received order exactly.
    violation: Not applicable.
    source: FR2.4, FR2.5

  - id: BR5.1
    statement: Counts reflect the current filters.
    category: calculation
    applies_to: FilterResult
    trigger: Applying filters.
    logic: Each section's count is its number of matches, and the total is the sum. The same calculation run on a proposed filter state gives the number shown on the sheet's confirm button.
    violation: Not applicable.
    source: FR1.2, FR7.3, FR7.6

  - id: BR5.2
    statement: A filter is offered only when at least one place has the data it needs.
    category: policy
    applies_to: FilterAvailability
    trigger: A screen asks which filters to offer.
    logic: Distance and nearest-first are offered when at least one place has a distance. Price is offered when at least one place has a price under BR3.2. Open is offered when at least one place has hours and the open mode is not unavailable. Category is offered when the list is grouped. Host picks is offered when at least one place is a host pick. With no places at all, nothing is offered.
    violation: Not applicable.
    source: FR8.1, FR2.6, FR8.3

  - id: BR6.1
    statement: Distance is shown in miles to one decimal place.
    category: calculation
    applies_to: FilterablePlace.distanceMeters
    trigger: Formatting a distance for display.
    logic: Convert metres to miles at 1609.344 metres to the mile. IF the unrounded value is under 0.1 miles (under 160.9344 metres) THEN show "under 0.1 mi". ELSE round half up to one decimal place and show for example "0.4 mi". IF the distance is unknown THEN show nothing. The distance filter compares unrounded metres, so a place shown as "0.5 mi" may still be inside the under 0.5 mile band.
    violation: Not applicable.
    source: FR2.1, FR2.5

  - id: BR7.1
    statement: On first view the first section is open and the rest are closed.
    category: policy
    applies_to: ExpandedState
    trigger: A screen shows the sections with no remembered state.
    logic: IF there is no remembered expanded state THEN only the first section is open. IF there is remembered state THEN it is used instead.
    violation: Not applicable.
    source: FR1.3, FQ4

  - id: BR7.2
    statement: The Filters chip counts the active filters inside the sheet.
    category: calculation
    applies_to: FilterResult.activeSheetFilterCount
    trigger: Applying filters.
    logic: The count is 1 if a distance band other than any is chosen, plus 1 if any price level is chosen. Sort is not a filter and is not counted.
    violation: Not applicable.
    source: FR7.2, FQ4

  - id: BR7.3
    statement: Clear all returns every filter and the sort to their defaults.
    category: policy
    applies_to: FilterState
    trigger: The person chooses Clear filters on the result line, or confirms the sheet after choosing Clear all in it.
    logic: The applied filter state becomes the default state, including the include-unknown choices. Which sections are open does not change. The stored entry is then written like any other change (BR8.4). It holds default filters and the open sections, so no filter choice is remembered and the open sections still are. Clear all inside the sheet resets only the draft; nothing changes until the sheet is confirmed.
    violation: Not applicable.
    source: FR7.4, FR11.4, FQ4

  - id: BR8.1
    statement: Remembered choices are keyed by the property and the stay's dates, never by the link token.
    category: constraint
    applies_to: StoredPlacePreference.storageKey
    trigger: Reading or writing remembered choices.
    logic: The key is a fixed prefix followed by the property id, the check-in date and the check-out date. The stay link token is never read by this module.
    violation: A key or value containing the token is a defect; a test must fail.
    source: FR11.1, FR11.2, NFR4

  - id: BR8.2
    statement: Without a stay and a property, nothing is remembered.
    category: policy
    applies_to: StoredPlacePreference
    trigger: Reading or writing remembered choices.
    logic: IF the screen has no stay dates or no property id THEN no key is built, nothing is read and nothing is written. This covers the owner's preview and the host panel.
    violation: Not applicable.
    source: FR11.5, FR8.3

  - id: BR8.3
    statement: Reading remembered choices never throws, and tells its caller what happened.
    category: validation
    applies_to: StoredPlacePreference
    trigger: Reading remembered choices.
    logic: The read returns one of four outcomes to its caller. They are found (with the choices), none (no entry), unavailable (storage could not be read) and unusable (the entry is not valid data, has the wrong shape or has another format version). For every outcome except found, the screen uses default filters and shows no error. The outcome is returned so the caller and the tests can observe it. See BR8.8 for logging.
    violation: The screen uses default filters.
    source: NFR7

  - id: BR8.4
    statement: Writing remembered choices never throws, and tells its caller what happened.
    category: validation
    applies_to: StoredPlacePreference
    trigger: Writing remembered choices.
    logic: The write returns saved or failed to its caller. On failed (storage unavailable or full) the screen carries on with its in-memory state and shows no error. See BR8.8 for logging.
    violation: The choices are not remembered for the next visit.
    source: NFR7

  - id: BR8.5
    statement: Remembered choices that no longer apply are dropped, and the rest are kept.
    category: policy
    applies_to: StoredPlacePreference.filters
    trigger: Restoring remembered choices against the current places.
    logic: A remembered category that no longer exists is removed. A remembered filter that is no longer offered under BR5.2 is reset to its default, and its include-unknown choice is removed. A remembered open section that no longer exists is removed. Everything else is applied.
    violation: Not applicable.
    source: FR11.3

  - id: BR8.6
    statement: Entries for stays that have ended are removed.
    category: policy
    applies_to: StoredPlacePreference
    trigger: The guide is opened.
    logic: Every stored entry with this module's prefix and the current format version whose check-out date is before today is removed, where today is the current calendar date on the guest's device. An entry with this module's prefix that is not valid data is also removed. An entry with a different format version is left untouched.
    violation: Not applicable.
    source: FQ5

  - id: BR8.7
    statement: The stored value holds only filter settings.
    category: constraint
    applies_to: StoredPlacePreference
    trigger: Writing remembered choices.
    logic: The value contains the format version, the filter state, the open section names and the check-out date. It contains no token, no guest name and no place data.
    violation: A stored value containing anything else is a defect; a test must fail.
    source: NFR4

  - id: BR8.8
    statement: Storage failures are reported to the caller and noted for developers, never shown to the guest.
    category: policy
    applies_to: StoredPlacePreference
    trigger: A read returns unavailable or unusable, or a write returns failed.
    logic: The outcome is returned to the caller (BR8.3, BR8.4). The storage module also writes one developer-facing warning per page load to the browser console, naming the outcome and never the stored value. The guest sees no message. This meets the construction rule that failures are surfaced to the caller or logged.
    violation: Not applicable.
    source: NFR7

  - id: BR9.1
    statement: The frontend's types for the new response fields match the backend unit's agreed shapes.
    category: constraint
    applies_to: Wire types
    trigger: Changing the contract types.
    logic: The guest place gains distanceMeters. The guest property gains timezone. The host place row gains poiCategory, hours, priceLevel, distanceMeters and stance. The host place list gains timezone. Every one is optional and may be null.
    violation: A type that differs from section 2 of the backend unit's functional specification is a defect.
    source: FR10.6

  - id: BR9.2
    statement: A missing field means the same as null, except a host row's stance.
    category: policy
    applies_to: Wire types
    trigger: Reading a response.
    logic: IF a new field other than a host row's stance is absent, as it is from a backend that has not been updated THEN it is treated as unknown. The screens then hide the filters that need it under BR5.2. A host row's stance is the one exception; see BR9.5.
    violation: Not applicable.
    source: FR10.6, NFR6

  - id: BR9.3
    statement: The test mocks send the new fields and default them to unknown.
    category: policy
    applies_to: Test mocks
    trigger: A test builds a response.
    logic: The mock guest stay and mock host place list include the new fields, null by default, with per-test overrides for each.
    violation: Not applicable.
    source: FR10.6

  - id: BR9.4
    statement: The contract provenance record changes in the same change as the types.
    category: constraint
    applies_to: Contract provenance record
    trigger: Changing the contract types.
    logic: The provenance record names the backend unit's functional specification, section 2, as the source of the new fields.
    violation: A type change without a provenance update is a defect at review.
    source: FR10.6

  - id: BR9.5
    statement: When the host place list comes from a backend that has not been updated, stance is still joined from the listings call.
    category: policy
    applies_to: Host place list
    trigger: Reading the host place list.
    logic: The response is enriched IF at least one row carries a stance field, whatever its value, including null. IF the response is enriched THEN each row uses its stance as sent, a row with no stance field is treated as null, null means the property has no listing for the place, and the listings call is not needed for stance. IF the list has rows and no row carries a stance field THEN the response is from an older backend, and stance is joined from the listings call exactly as today. IF the list is empty THEN there is nothing to join. The foundation provides this as one function that takes the place list and the listings and returns rows with a stance, so neither screen decides it.
    violation: Not applicable.
    source: FR10.6, NFR6

  - id: BR10.1
    statement: A filter chip is a button that reports whether it is on.
    category: constraint
    applies_to: Shared controls
    trigger: Rendering a chip.
    logic: A chip is a native button with a pressed state exposed to assistive technology. Its state is not shown by colour alone.
    violation: An automated accessibility finding or a failed keyboard scenario.
    source: FR7.1, NFR1

  - id: BR10.2
    statement: A collapsible section header is a button inside a heading that reports whether the section is open.
    category: constraint
    applies_to: Shared controls
    trigger: Rendering a section header.
    logic: The header's button exposes its expanded state and controls its section. Its accessible name includes the section name and the count. A section with count 0 is dimmed and still operable.
    violation: An automated accessibility finding or a failed keyboard scenario.
    source: FR1.1, FR1.4, NFR1

  - id: BR10.3
    statement: The filter sheet is a modal dialog, and the page behind it is inert.
    category: constraint
    applies_to: Shared controls
    trigger: Opening and closing the sheet.
    logic: On open, focus moves into the sheet and stays inside it. Escape and the close button close it. On close, focus returns to the control that opened it. While it is open the page behind cannot be reached by keyboard, pointer or screen reader. This unit owns that fix in the design system's dialog control. The dialog is rendered outside the application root and marks the application root inert while it is open. The existing dialogs gain the same behaviour.
    violation: A failed keyboard scenario.
    source: FR7.1, NFR1

  - id: BR10.4
    statement: Option groups are labelled groups of native inputs.
    category: constraint
    applies_to: Shared controls
    trigger: Rendering the distance, price and sort options.
    logic: Single-choice options are a labelled radio group. Multiple-choice options are a labelled group of checkboxes. Every input has a visible label.
    violation: An automated accessibility finding.
    source: FR7.1, NFR1

  - id: BR10.5
    statement: Controls fit a phone.
    category: constraint
    applies_to: Shared controls
    trigger: Rendering any shared control.
    logic: Every interactive target is at least 44 by 44 CSS pixels. At a 320 CSS pixel viewport the chip row scrolls sideways inside itself and the page does not scroll sideways.
    violation: A failed layout scenario.
    source: NFR1, NFR2

  - id: BR10.6
    statement: Changes to the result count are announced.
    category: constraint
    applies_to: Shared controls
    trigger: The matching count changes.
    logic: The result line is in a polite live region, so a screen reader announces the new count without moving focus.
    violation: A failed screen-reader scenario.
    source: FR7.6, NFR1

  - id: BR10.7
    statement: The category quick filter is one chip that opens a list of categories.
    category: constraint
    applies_to: Shared controls
    trigger: Rendering the category filter.
    logic: The chip row has one Category chip. Activating it opens a small sheet, built on the same modal control as the filter sheet, holding a labelled checkbox group with one checkbox per category. Each change applies immediately. The chip shows the number of categories chosen and reports itself as pressed when any is chosen.
    violation: An automated accessibility finding or a failed keyboard scenario.
    source: FR3.1, FR7.1, NFR1

  - id: BR11.1
    statement: Filtering is fast and local.
    category: constraint
    applies_to: FilterResult
    trigger: Applying filters.
    logic: Applying filters makes no network request. As a regression guard, applying every filter to 200 places completes within 25 milliseconds in the test environment. That leaves a fourfold margin for the 100 millisecond target on a mid-range phone in NFR3. It guards against regressions and is not a measurement on a phone.
    violation: A failed performance test.
    source: NFR3
```

## Rules Summary

| Group | Rules | Subject |
|---|---|---|
| BR1 | BR1.1–BR1.4 | Grouping: one order for both screens, "Other places" last, flat list, emptied sections kept |
| BR2 | BR2.1–BR2.8 | Open evaluation: instant, overnight spans, closed days, unknown, on a day, bad data, which mode applies, date-limited rules |
| BR3 | BR3.1–BR3.6 | Filters: category, price, host picks, distance, AND, places with no value |
| BR4 | BR4.1–BR4.2 | Sort: host's order, nearest first |
| BR5 | BR5.1–BR5.2 | Counts and which filters are offered |
| BR6 | BR6.1 | Distance display |
| BR7 | BR7.1–BR7.3 | Shared screen state: first section open, active-filter count, Clear all |
| BR8 | BR8.1–BR8.8 | Remembered choices: key, no stay, reads and writes that report their outcome, stale choices, removal, contents, failure reporting |
| BR9 | BR9.1–BR9.5 | Contract: types, missing fields, mocks, provenance, stance from an older backend |
| BR10 | BR10.1–BR10.7 | Shared controls: chip, section header, sheet and inert page, option groups, phone fit, announcements, category chip |
| BR11 | BR11.1 | Speed |
