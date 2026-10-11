# Cross-Unit Traceability: Places Filters

Source of requirement IDs: `inception/requirements-analysis/requirements.md` (53 numbered requirements and 11 group headings; user stories were skipped, so there are no acceptance-criteria IDs). Coverage is read from each unit's `code-generation/traceability.json`.

## Verdict

**Fail, on the letter of the check. No requirement is left unbuilt.**

The check asks that every requirement ID appear, with status OK and an existing file, in at least one unit's code-generation record. Counted strictly:

| How the ID is covered | Count |
|---|---|
| Named directly in a unit's code-generation record | 19 |
| Not named directly, but its design rule is: the unit's functional-design record maps the requirement to a rule, and the code-generation record maps that rule to a file | 32 |
| Group heading, covered through its numbered sub-requirements | 11 |
| Not covered by any record | 2 |

So 19 of 64 pass the check as written, 43 more are covered one step removed, and 2 are not in any record.

## Findings for the Approval Gate

1. **32 requirements are traced through design rules, not by their own ID.** The foundation unit's code-generation record lists rule IDs (BR1.1 to BR11.1) and no requirement IDs, and most of the filtering requirements live in that unit. Each of the 32 resolves to an existing file through one rule. This is a gap in the record's form, not in what was built.
2. **NFR5 (Testing) is in no unit's record.** It is evidenced by this stage instead: `test-results.md` shows the coverage floors met and scenario tests in place. Its last clause, that every pull request passes CI before merge, is unverified because nothing is pushed.
3. **NFR8 (Observability) is in no unit's record.** It requires nothing new to be built. Its one positive statement, that backend errors on the changed endpoints surface through the existing logs, is met by the place-list route logging an enrichment failure and the guest route logging a distance failure, in `guestguideiq-app/src/poi/routes.ts` and `guestguideiq-app/src/guestaccess/routes.ts`.
4. **Two entries name a file at its old path.** FR7.2 and FR7.4 in the guest tab's record point at files that the host panel unit moved to `src/places-ui/`. The files exist at the new path, shown below.

## Per-Requirement Coverage

| ID | How covered | Owning unit | Target file | Note | Result |
|---|---|---|---|---|---|
| FR1 | Group heading | n/a | n/a | Covered through its numbered sub-requirements below | Covered |
| FR1.1 | Through rule BR10.2 | u2-places-foundation | `guestguideiq-frontend/src/design-system/primitives/CollapsibleSection.tsx` | File exists | Covered |
| FR1.2 | Through rule BR1.4 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR1.3 | Direct | u3-guest-places | `guestguideiq-frontend/src/guest/guide/usePlaceChoices.ts` | File exists | Covered |
| FR1.4 | Through rule BR1.4 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR1.5 | Through rule BR1.3 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR2 | Group heading | n/a | n/a | Covered through its numbered sub-requirements below | Covered |
| FR2.1 | Through rule BR6.1 | u2-places-foundation | `guestguideiq-frontend/src/places/distance.ts` | File exists | Covered |
| FR2.2 | Direct | u1-places-api | `guestguideiq-app/src/poi/service.ts` | File exists | Covered |
| FR2.3 | Through rule BR3.4 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR2.4 | Through rule BR4.1 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR2.5 | Through rule BR4.2 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR2.6 | Through rule BR5.2 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR3 | Group heading | n/a | n/a | Covered through its numbered sub-requirements below | Covered |
| FR3.1 | Through rule BR3.1 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR3.2 | Through rule BR1.1 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR4 | Group heading | n/a | n/a | Covered through its numbered sub-requirements below | Covered |
| FR4.1 | Direct | u3-guest-places | `guestguideiq-frontend/src/guest/guide/usePlaceChoices.ts` | File exists | Covered |
| FR4.2 | Direct | u4-host-curation | `guestguideiq-frontend/src/owner/billing/PlacePicker.tsx` | File exists | Covered |
| FR4.3 | Through rule BR2.1 | u2-places-foundation | `guestguideiq-frontend/src/places/openHours.ts` | File exists | Covered |
| FR4.4 | Through rule BR2.4 | u2-places-foundation | `guestguideiq-frontend/src/places/openHours.ts` | File exists | Covered |
| FR5 | Group heading | n/a | n/a | Covered through its numbered sub-requirements below | Covered |
| FR5.1 | Through rule BR3.2 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR5.2 | Through rule BR3.2 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR6 | Group heading | n/a | n/a | Covered through its numbered sub-requirements below | Covered |
| FR6.1 | Through rule BR3.3 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR6.2 | Direct | u3-guest-places | `guestguideiq-frontend/src/guest/guide/PlaceCard.tsx` | File exists | Covered |
| FR7 | Group heading | n/a | n/a | Covered through its numbered sub-requirements below | Covered |
| FR7.1 | Through rule BR10.1 | u2-places-foundation | `guestguideiq-frontend/src/design-system/primitives/Chip.tsx` | File exists | Covered |
| FR7.2 | Direct | u3-guest-places | `guestguideiq-frontend/src/places-ui/PlacesFilterBar.tsx` | Recorded at its old path; the file moved in the host panel unit | Covered |
| FR7.3 | Through rule BR5.1 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR7.4 | Direct | u3-guest-places | `guestguideiq-frontend/src/places-ui/PlacesResultLine.tsx` | Recorded at its old path; the file moved in the host panel unit | Covered |
| FR7.5 | Through rule BR3.5 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR7.6 | Through rule BR5.1 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR8 | Group heading | n/a | n/a | Covered through its numbered sub-requirements below | Covered |
| FR8.1 | Through rule BR5.2 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR8.2 | Through rule BR3.6 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR8.3 | Direct | u3-guest-places | `guestguideiq-frontend/src/guest/guide/PlacesPanel.tsx` | File exists | Covered |
| FR9 | Group heading | n/a | n/a | Covered through its numbered sub-requirements below | Covered |
| FR9.1 | Direct | u4-host-curation | `guestguideiq-frontend/src/owner/billing/PlacePicker.tsx` | File exists | Covered |
| FR9.2 | Direct | u4-host-curation | `guestguideiq-frontend/src/owner/billing/hostPlaces.scenarios.test.tsx` | File exists | Covered |
| FR9.3 | Through rule BR1.1 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR9.4 | Direct | u4-host-curation | `guestguideiq-frontend/src/owner/billing/curationFocus.ts` | File exists | Covered |
| FR10 | Group heading | n/a | n/a | Covered through its numbered sub-requirements below | Covered |
| FR10.1 | Direct | u1-places-api | `guestguideiq-app/tests/bdd/places-filters-guest.test.ts` | File exists | Covered |
| FR10.2 | Direct | u1-places-api | `guestguideiq-app/src/guestaccess/routes.ts` | File exists | Covered |
| FR10.3 | Direct | u1-places-api | `guestguideiq-app/tests/bdd/places-filters-host.test.ts` | File exists | Covered |
| FR10.4 | Direct | u1-places-api | `guestguideiq-app/src/poi/routes.ts` | File exists | Covered |
| FR10.5 | Direct | u1-places-api | `guestguideiq-app/docs/frontend-contract-delta.md` | File exists | Covered |
| FR10.6 | Through rule BR9.1 | u2-places-foundation | `guestguideiq-frontend/src/api/contract/entities.ts` | File exists | Covered |
| FR11 | Group heading | n/a | n/a | Covered through its numbered sub-requirements below | Covered |
| FR11.1 | Through rule BR8.1 | u2-places-foundation | `guestguideiq-frontend/src/places/placePreferences.ts` | File exists | Covered |
| FR11.2 | Through rule BR8.1 | u2-places-foundation | `guestguideiq-frontend/src/places/placePreferences.ts` | File exists | Covered |
| FR11.3 | Through rule BR8.5 | u2-places-foundation | `guestguideiq-frontend/src/places/placePreferences.ts` | File exists | Covered |
| FR11.4 | Through rule BR7.3 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.ts` | File exists | Covered |
| FR11.5 | Direct | u4-host-curation | `guestguideiq-frontend/src/owner/billing/hostPlaces.scenarios.test.tsx` | File exists | Covered |
| NFR1 | Direct | u3-guest-places | `guestguideiq-frontend/src/guest/guide/guestPlaces.scenarios.test.tsx` | File exists | Covered |
| NFR2 | Through rule BR10.5 | u2-places-foundation | `guestguideiq-frontend/src/design-system/primitives/primitives.css` | File exists | Covered |
| NFR3 | Through rule BR11.1 | u2-places-foundation | `guestguideiq-frontend/src/places/placeFilters.scenarios.test.ts` | File exists | Covered |
| NFR4 | Through rule BR8.1 | u2-places-foundation | `guestguideiq-frontend/src/places/placePreferences.ts` | File exists | Covered |
| NFR5 | None | n/a | n/a | No entry in any unit | **Uncovered** |
| NFR6 | Direct | u1-places-api | `guestguideiq-app/tests/bdd/places-filters-host.test.ts` | File exists | Covered |
| NFR7 | Through rule BR2.6 | u2-places-foundation | `guestguideiq-frontend/src/places/openHours.ts` | File exists | Covered |
| NFR8 | None | n/a | n/a | No entry in any unit | **Uncovered** |

## Uncovered Elements

- NFR5: see finding 2.
- NFR8: see finding 3.
