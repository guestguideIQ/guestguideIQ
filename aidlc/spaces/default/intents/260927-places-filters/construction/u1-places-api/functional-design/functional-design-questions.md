# Functional Design — Questions: u1-places-api

Context: this unit is the backend additions (`../../../inception/units-generation/unit-of-work.md`, U1) for requirements FR2.2 and FR10.1–FR10.5 (`../../../inception/requirements-analysis/requirements.md`), built from the components in `../../../inception/domain-design/components.md`. The domain design review left three points for this unit, and the units review asked that this unit be the one place where the agreed response shapes are written. I checked the backend code at commit `ce69629` before writing these.

## Q1. Where should the timezone rule live? (domain design review R-02)

The rule today is one line inside the guest access data layer: the locality's zone, then the property's own zone, then UTC. The domain design moved it into the locality component. The review found that heavier than needed: the locality component would have to read a property's zone, and a similar line also exists in the events code.

A. A small shared helper function that takes the two zones and returns the result. Guest access and the host place list both call it. The locality component is not changed. This replaces decision record ADR-003
B. Keep ADR-003: the locality component owns the rule
C. Not yet defined
X. Other (please specify)

[Answer]: A. A small shared helper function that takes the two zones and returns the result. Guest access and the host place list both call it. The locality component is not changed. This replaces decision record ADR-003

## Q2. What does the API send when the property's timezone is not really known? (domain design review R-04)

A locality's zone defaults to "UTC" in the database. Real zones are validated as Region/City names, so "UTC" only ever means "never set". Judging "open now" in UTC for a property in Arizona would be wrong by seven hours.

A. Send the timezone, or nothing (null) when the result is only the UTC default. The frontend hides the open filter when it is null. No separate marker field
B. Always send a timezone, plus a separate true/false marker saying it is only the fallback
C. Not yet defined
X. Other (please specify)

[Answer]: A. Send the timezone, or nothing (null) when the result is only the UTC default. The frontend hides the open filter when it is null. No separate marker field

## Q3. Which part of the backend serves the host's enriched place list? (domain design review R-01)

The list is served at the existing place-list address, whose route belongs to the place catalogue code. That route already calls into the guest context code for host-added places, so the two are already tied together at the route layer.

A. Keep the route where it is. It calls the guest context code, through the same kind of optional connection it already uses, to add category, hours, price, distance and stance. The tie stays at the route layer only and is written down as such
B. Move the place-list route into the guest context code
C. Not yet defined
X. Other (please specify)

[Answer]: A. Keep the route where it is. It calls the guest context code, through the same kind of optional connection it already uses, to add category, hours, price, distance and stance. The tie stays at the route layer only and is written down as such

## Consolidated Summary Confirmation

- The timezone rule becomes a small shared helper function used by guest access and the host place list. The locality component is not changed. This replaces decision record ADR-003 (Q1)
- The API sends the property's timezone, or null when the result is only the UTC default. There is no separate marker field, and the frontend hides the open filter when it is null (Q2)
- The host's enriched place list is served by the existing place-list route, which calls the guest context code to add category, hours, price, distance and stance. The tie stays at the route layer only (Q3)
- This unit's functional design is the one place where the agreed response shapes are written. The frontend foundation copies them from here

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
