# Requirement-to-Unit Map: Places Filters and Collapsible Categories

There is no stories document for this work, because user stories were skipped. This map therefore assigns each functional requirement from `../requirements-analysis/requirements.md` to the unit that owns the substance of its acceptance criteria. Units are defined in `unit-of-work.md` and come from the components in `../domain-design/components.md` and the decisions in `../domain-design/decisions.md`.

Where a requirement's logic and its screen sit in different units, the owning unit is the one holding the logic, and the "Also touches" column names the unit that renders it.

## Map

| Requirement | Summary | Unit ID | Directory | Also touches |
|---|---|---|---|---|
| FR1.1 | Category headers collapse and expand | U2 | u2-places-foundation | U3, U4 render it |
| FR1.2 | Header shows the matching count | U2 | u2-places-foundation | U3, U4 |
| FR1.3 | First category open, others collapsed | U3 | u3-guest-places | U4 applies the same rule |
| FR1.4 | Emptied category stays, dimmed, "0 places" | U2 | u2-places-foundation | U3, U4 |
| FR1.5 | Flat list when no place has a category | U2 | u2-places-foundation | U3, U4 |
| FR2.1 | Distance shown in miles | U2 | u2-places-foundation | U3, U4 |
| FR2.2 | Straight line from the property | U1 | u1-places-api | none |
| FR2.3 | Distance bands | U2 | u2-places-foundation | U3, U4 |
| FR2.4 | Host's order or nearest first | U2 | u2-places-foundation | U3, U4 |
| FR2.5 | Place with no location | U2 | u2-places-foundation | U1 sends null |
| FR2.6 | Property with no location | U2 | u2-places-foundation | U1 sends null |
| FR3.1 | Category filter | U2 | u2-places-foundation | U3, U4 |
| FR3.2 | Categories listed in section order | U2 | u2-places-foundation | U3, U4 |
| FR4.1 | Guest open filter follows the day rail | U3 | u3-guest-places | U2 evaluates |
| FR4.2 | Host panel reads "Open now" | U4 | u4-host-curation | U2 evaluates |
| FR4.3 | Hours evaluation rules | U2 | u2-places-foundation | none |
| FR4.4 | No hours means unknown | U2 | u2-places-foundation | none |
| FR5.1 | Price filter | U2 | u2-places-foundation | U3, U4 |
| FR5.2 | Price 0 means Free | U2 | u2-places-foundation | U1 documents the scale |
| FR6.1 | Host picks means featured | U2 | u2-places-foundation | U3, U4 |
| FR6.2 | "Host pick" label on the card | U3 | u3-guest-places | none |
| FR7.1 | Chip row and Filters sheet | U2 | u2-places-foundation | U3, U4 |
| FR7.2 | Active-filter count on the chip | U3 | u3-guest-places | U4 |
| FR7.3 | "Show N places" | U2 | u2-places-foundation | U3, U4 |
| FR7.4 | "Clear all" | U3 | u3-guest-places | U4; U2 clears stored choices |
| FR7.5 | Filters combine with AND | U2 | u2-places-foundation | none |
| FR7.6 | Result line and "No places match" | U2 | u2-places-foundation | U3, U4 |
| FR8.1 | Hide a filter with no data | U2 | u2-places-foundation | U3, U4 |
| FR8.2 | Places with no value under an active filter | U2 | u2-places-foundation | U3, U4 |
| FR8.3 | Works with no places | U3 | u3-guest-places | U4 |
| FR9.1 | Host panel has the same filters | U4 | u4-host-curation | U2 |
| FR9.2 | Filters never change guest-facing data | U4 | u4-host-curation | none |
| FR9.3 | Same grouping as the guest tab | U2 | u2-places-foundation | U4 adopts it |
| FR9.4 | Host actions stay available | U4 | u4-host-curation | none |
| FR10.1 | Distance data in the guest response | U1 | u1-places-api | U2 types |
| FR10.2 | Timezone in the guest response | U1 | u1-places-api | U2 types |
| FR10.3 | Enriched host place list | U1 | u1-places-api | U2 types |
| FR10.4 | Additions optional and nullable | U1 | u1-places-api | none |
| FR10.5 | Price scale documented consistently | U1 | u1-places-api | none |
| FR10.6 | Frontend types, client, mocks and provenance | U2 | u2-places-foundation | none |
| FR11.1 | Choices remembered for the stay | U2 | u2-places-foundation | U3 |
| FR11.2 | Never applied to another stay | U2 | u2-places-foundation | none |
| FR11.3 | Stale choices dropped | U2 | u2-places-foundation | none |
| FR11.4 | "Clear all" clears stored choices | U2 | u2-places-foundation | U3 |
| FR11.5 | Host panel does not remember | U4 | u4-host-curation | none |

## Non-functional requirements

| Requirement | Unit ID | Directory | Note |
|---|---|---|---|
| NFR1 Accessibility | U2 | u2-places-foundation | The shared controls carry it; U3 and U4 each add a keyboard-only scenario |
| NFR2 Mobile-first | U2 | u2-places-foundation | Carried by the shared controls |
| NFR3 Responsiveness | U2 | u2-places-foundation | Filtering is in-memory, with no request |
| NFR4 Security and privacy | U2 | u2-places-foundation | The storage module; U1 keeps coordinates on the server |
| NFR5 Testing | all | all four | A practice applied in every unit, not owned by one |
| NFR6 Compatibility | U1 | u1-places-api | Optional, nullable additions |
| NFR7 Reliability | U2 | u2-places-foundation | Storage and hours evaluation never throw |
| NFR8 Observability | none | none | No new metric or alert is required |

## Cross-cutting requirements

- **FR1 (collapsible categories)** spans U2 (control and counts), U3 and U4 (each screen's sections).
- **FR4 (open filter)** spans U1 (timezone), U2 (evaluation), U3 and U4 (labels).
- **FR2 (distance)** spans U1 (calculation) and U2 (formatting, bands and sort).
- **FR10.6** is the frontend half of the contract change in FR10.1–FR10.3.

## Order within each unit

Order within a unit follows what each requirement needs to exist first. It is not a build order across units.

- **U1:** FR10.4 and FR10.5 (rules for every addition), then FR2.2 and FR10.1 (distance), FR10.2 (timezone), FR10.3 (host list).
- **U2:** FR10.6 (types and mocks), then FR1.5, FR3, FR9.3 (grouping), FR4.3, FR4.4 (hours), FR2, FR5, FR6.1 (single filters), FR7.5, FR7.3, FR7.6, FR1.2, FR1.4, FR8 (combination and counts), FR1.1, FR7.1 (controls), FR11.1–FR11.4 (remembered choices).
- **U3:** FR8.3, FR1.3, FR4.1, FR6.2, FR7.2, FR7.4.
- **U4:** FR9.1, FR4.2, FR9.2, FR9.4, FR11.5.

## Coverage check

- Every functional sub-requirement (45) is assigned to exactly one owning unit.
- Every unit owns at least one requirement: U1 owns 6, U2 owns 28, U3 owns 6, U4 owns 5.
- NFR5 and NFR8 have no single owning unit, for the reasons given above.
