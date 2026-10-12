# Requirements Analysis — Questions

Context: the scope document sets five filters plus collapsible categories on the guest Places tab and the host panel, and a should-have Google Maps view for guests. The code scan (the knowledge bases under `aidlc/spaces/default/codekb/`) found that several of these need data the screens do not receive today. These questions settle what this work includes now that those facts are known.

What the scan found, in short:
- The guest guide receives each place's category, opening hours, price level and host stance. It does not receive place coordinates, a distance or a timezone.
- The host panel's place list receives only name, description, a free-text category and address.
- The seed data suggests live places have no coordinates, hours or prices. Nothing in production writes them, and hosts cannot enter coordinates for places they add.
- The site's security headers block Google Maps, the site sends no referrer header, and a public Maps key would trip the blocking secret scan of the built site.

## Q1. Several filters need backend changes. Does this work include them?

Distance and the map need place coordinates sent to the guest. A true "open now" needs the property's timezone. This would be the fourth addition to the backend follow-up list since the frontend work began.

A. Yes: this work includes the backend changes (send place coordinates or distance, send a timezone, and extend the host panel's place list)
B. Frontend-only for now: ship what today's data supports (collapsible categories, category, price, host picks, and "open on the selected day" for guests), and move distance, "open now" and the map to a later piece of work
C. Split it: a separate backend piece of work lands first, then this work resumes with everything in scope
D. Not yet defined
X. Other (please specify)

[Answer]: A. Yes: this work includes the backend changes (send place coordinates or distance, send a timezone, and extend the host panel's place list)

## Q2. Live places appear to have no coordinates, hours or prices. What should happen about the missing data?

A filter over empty data shows nothing. The real counts are unknown, because the production database was not queried.

A. Include filling the data in this work (for example, geocoding existing places and letting hosts set a location on places they add)
B. Build the filters to cope: a filter is hidden when no place has that data, and places missing a value are never wrongly excluded. Filling the data is separate work
C. First count the real data in production, then decide between A and B
D. Not yet defined
X. Other (please specify)

[Answer]: B. Build the filters to cope: a filter is hidden when no place has that data, and places missing a value are never wrongly excluded. Filling the data is separate work

## Q3. What does "host picks" mean as a filter?

Every place a guest sees is already one the host chose. The data has three candidate signals.

A. Places the host marked as featured (as opposed to just listed)
B. Places the host marked as recommended (an older signal that still exists)
C. Places the host added themselves, as opposed to places from the shared local catalogue
D. Not yet defined
X. Other (please specify)

[Answer]: A. Places the host marked as featured (as opposed to just listed)

## Q4. The host panel's place list has no hours, price, shared category or coordinates. What does the host panel get?

At scope definition you chose the same five filters for the host panel as for guests. That needs the backend to send much more for each place in the host's list.

A. Keep the same five filters: the backend extends the host panel's place list (only possible if Q1 is A or C)
B. Host panel gets collapsible categories, a category filter and a stance filter (featured / listed / hidden) now; the other filters come later
C. Host panel gets collapsible categories only
D. Not yet defined
X. Other (please specify)

[Answer]: A. Keep the same five filters: the backend extends the host panel's place list (only possible if Q1 is A or C)

## Q5. The Google Maps view is blocked by the site's security setup. What should happen to it?

To load Google Maps, the security headers must allow Google's scripts and styles. That weakens the protection around the guest link, which is a seven-day credential that cannot be revoked. The key cannot be restricted by referrer because the site sends none. The blocking secret scan would need a documented exception for the public key; your project rules require that scan to stay blocking.

A. Keep the interactive map in this work, and make the security changes as an explicit, recorded decision at design
B. Move the interactive map to a later piece of work (it is already should-have)
C. Replace it with a plain "Open in Google Maps" link for each place and for the property: no key, no header changes, no cost
D. Not yet defined
X. Other (please specify)

[Answer]: B. Move the interactive map to a later piece of work (it is already should-have)

## Q6. Which distance unit and bands should the distance filter use?

A. Miles: under 0.5, under 1, under 3, under 10
B. Kilometres: under 1, under 2, under 5, under 15
C. Follow the property's country (miles in the US and UK, kilometres elsewhere), with the matching bands above
D. Not yet defined
X. Other (please specify)

[Answer]: A. Miles: under 0.5, under 1, under 3, under 10

## Q7. Should a guest's filter choices be remembered?

The frontend deliberately keeps browser storage out of screen code, so remembering across visits needs a small, deliberate exception.

A. No: filters reset whenever the guide is reopened
B. For the visit only: kept while the page stays open, including when switching tabs or between list and map
C. Across visits on the same device, for that stay
D. Not yet defined
X. Other (please specify)

[Answer]: C. Across visits on the same device, for that stay

## Consolidated Summary Confirmation

- Backend changes are part of this work: send place coordinates or distance to the guest, send a timezone, and extend the host panel's place list (Q1)
- Missing data: filters cope. A filter is hidden when no place has that data, and places missing a value are never wrongly excluded. Filling the data is separate work (Q2)
- "Host picks" means places the host marked as featured (Q3)
- The host panel keeps the same five filters as guests, with the backend extending the host's place list (Q4)
- The interactive Google Maps view moves to a later piece of work (Q5)
- Distance uses miles, with bands under 0.5, under 1, under 3 and under 10 (Q6)
- A guest's filter choices are remembered across visits on the same device, for that stay (Q7)

Does this all look correct before I generate the requirements artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
