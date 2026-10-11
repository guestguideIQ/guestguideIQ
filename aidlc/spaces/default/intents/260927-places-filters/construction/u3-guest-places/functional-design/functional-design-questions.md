# Functional Design — Questions: u3-guest-places

Context: this unit is the guest Places tab (`../../../inception/units-generation/unit-of-work.md`, U3). It wires the shared foundation into the tab: collapsible category sections, the chip row, the filter sheet, the result line, the "Host pick" label and remembered choices. Its requirements are those mapped to U3 in `../../../inception/units-generation/unit-of-work-story-map.md`, from `../../../inception/requirements-analysis/requirements.md`, and its component is `GuestPlaces` in `../../../inception/domain-design/components.md`. The filtering rules, the open filter's behaviour and the storage rules were settled in the foundation unit's design, so only one screen-level question is left.

## Q1. How does the new "Host pick" label sit beside the label place cards already show?

Place cards already show "Recommended by your host" on places the host added themselves. The new "Host pick" label marks places the host featured. A place can be both.

A. Show "Host pick" on featured places and keep the existing label on host-added places. A place that is both shows both
B. Show "Host pick" on featured places, and drop the existing label on those places so only one shows
C. Not yet defined
X. Other (please specify)

[Answer]: A. Show "Host pick" on featured places and keep the existing label on host-added places. A place that is both shows both

## Consolidated Summary Confirmation

- "Host pick" shows on featured places, and the existing "Recommended by your host" label stays on host-added places. A place that is both shows both (Q1)
- Everything else on this screen follows the foundation unit's design: the filtering rules, the open filter following the day rail, remembered choices, and the shared controls

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
