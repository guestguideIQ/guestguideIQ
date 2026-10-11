# Domain Design — Questions

Context: the requirements (`../requirements-analysis/requirements.md`) left four design questions open (OQ1, OQ2, OQ4 and the shape of the host's place list), and the review raised one more (where the host panel gets a timezone, R-01). The existing building blocks are described in the two component inventories under `aidlc/spaces/default/codekb/`. These questions settle the boundaries before the components are written down.

## Q1. How does the frontend learn each place's distance from the property? (requirements OQ1)

The backend already has a tested distance calculation that no endpoint uses. The guest already receives the property's own coordinates.

A. The backend computes the distance and sends it with each place. No place coordinates are sent. One calculation, least data exposed; the map, when it returns, will need coordinates added then
B. The backend sends each place's coordinates and the frontend computes the distance. Ready for the map later; the calculation then exists in both repos
C. The backend sends both the distance and the coordinates
D. Not yet defined
X. Other (please specify)

[Answer]: A. The backend computes the distance and sends it with each place. No place coordinates are sent. One calculation, least data exposed; the map, when it returns, will need coordinates added then

## Q2. How does the frontend evaluate "open now" in the property's local time? (requirements OQ2, review R-01)

The guest response carries no timezone today, and the host's place list carries none either.

A. The backend sends the property's timezone with both the guest response and the host's place list, and one shared frontend evaluator works out "open now" and "open on [day]"
B. The backend computes an "open now" flag for each place. Simple for the frontend, but it goes stale while the page stays open and cannot answer "open on [day]"
C. Both: the timezone and a server-computed flag
D. Not yet defined
X. Other (please specify)

[Answer]: A. The backend sends the property's timezone with both the guest response and the host's place list, and one shared frontend evaluator works out "open now" and "open on [day]"

## Q3. How does the host panel get the extra place data (category, hours, price, distance, stance)?

A. Extend the existing host place list so each row carries the new fields. One call, backwards compatible
B. Add a new, separate endpoint for the curation view and leave the existing list untouched
C. Not yet defined
X. Other (please specify)

[Answer]: A. Extend the existing host place list so each row carries the new fields. One call, backwards compatible

## Q4. Where does the filtering logic live in the frontend?

The guest tab and the host panel must behave the same (same categories, same order, same filters). Today they group places with two different modules.

A. One shared, UI-free filtering module (grouping, hours evaluation, distance, filter combination) used by both screens, plus shared controls (chips, filter sheet, collapsible header) added to the design system
B. Each screen keeps its own logic and controls, written to match
C. Not yet defined
X. Other (please specify)

[Answer]: A. One shared, UI-free filtering module (grouping, hours evaluation, distance, filter combination) used by both screens, plus shared controls (chips, filter sheet, collapsible header) added to the design system

## Q5. How are a guest's remembered filter choices tied to a stay? (requirements OQ4, review R-05)

The stay link's token is a credential and must not be written to browser storage. Whatever identifies the stay in storage must not be the token.

A. Key by the property and the stay's dates (for example, property id plus check-in and check-out). Not a credential; two stays at the same property on the same dates would share choices
B. Key by a one-way hash of the token. Unique per stay link, and the token cannot be recovered from it, but it is still derived from the credential
C. Key by the property only. Simplest; choices carry across every stay at that property on the device
D. Not yet defined
X. Other (please specify)

[Answer]: A. Key by the property and the stay's dates (for example, property id plus check-in and check-out). Not a credential; two stays at the same property on the same dates would share choices

## Consolidated Summary Confirmation

- Distance: the backend computes each place's distance from the property and sends it. No place coordinates are sent (Q1)
- Open now: the backend sends the property's timezone with the guest response and the host's place list, and one shared frontend evaluator works out "open now" and "open on [day]" (Q2)
- Host panel data: the existing host place list is extended so each row carries the new fields (Q3)
- Filtering logic: one shared, UI-free filtering module for both screens, with shared controls added to the design system (Q4)
- Remembered choices are keyed by the property and the stay's dates, never by the link token (Q5)

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
