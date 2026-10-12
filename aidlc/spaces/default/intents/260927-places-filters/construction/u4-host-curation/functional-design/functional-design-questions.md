# Functional Design — Questions: u4-host-curation

Context: this unit is the host's Local recommendations panel (`../../../inception/units-generation/unit-of-work.md`, U4). It wires the shared foundation into the panel: the same filters, result line and collapsible categories as the guest tab, with "Open now" only and no remembered choices. Its requirements are those mapped to U4 in `../../../inception/units-generation/unit-of-work-story-map.md`, from `../../../inception/requirements-analysis/requirements.md`, and its component is `HostCuration` in `../../../inception/domain-design/components.md`. Two screen-level questions are left from earlier reviews.

## Q1. The place picker inside this panel is also used during onboarding. Does onboarding get the filters too?

When a new host sets up their guide, the same picker lists the area's places for a first selection.

A. No: filters and collapsible categories appear only in the Local recommendations panel. Onboarding keeps the plain picker
B. Yes: onboarding gets the same filters and collapsible categories
C. Not yet defined
X. Other (please specify)

[Answer]: A. No: filters and collapsible categories appear only in the Local recommendations panel. Onboarding keeps the plain picker

## Q2. How do places the host has hidden behave under the filters? (requirements review R-07)

The host's list includes places the host has hidden from guests, and places the host has not picked at all.

A. They are treated like any other row: counted in the section counts and filtered by the same filters. "Host picks" keeps only featured places. No extra filter by stance is added
B. Add a further filter by stance (featured, listed, hidden, not picked), which goes beyond the agreed five filters
C. Not yet defined
X. Other (please specify)

[Answer]: A. They are treated like any other row: counted in the section counts and filtered by the same filters. "Host picks" keeps only featured places. No extra filter by stance is added

## Consolidated Summary Confirmation

- Filters and collapsible categories appear only in the Local recommendations panel. Onboarding keeps the plain picker (Q1)
- Hidden and unpicked places are treated like any other row: counted and filtered by the same filters. "Host picks" keeps only featured places. No extra stance filter is added (Q2)
- Everything else on this screen follows the foundation unit's design: the filtering rules, "Open now" only, no remembered choices, and the shared controls

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
