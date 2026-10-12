# Functional Design — Questions: u2-places-foundation

Context: this unit is the shared frontend foundation (`../../../inception/units-generation/unit-of-work.md`, U2): types, API client and test mocks for the new response fields; the filtering rules; remembered choices; and the shared controls. It covers the requirements mapped to U2 in `../../../inception/units-generation/unit-of-work-story-map.md`, from `../../../inception/requirements-analysis/requirements.md`, using the components in `../../../inception/domain-design/components.md`. The response shapes it transcribes are fixed by the backend unit's design: the timezone is sent as a zone name or nothing, and distance as whole metres or nothing.

These questions settle the behaviours the earlier reviews left open for this unit.

## Q1. What does the open filter do when the property's timezone is not known?

The backend sends no timezone when a locality's zone was never set. Without it, "open right now" cannot be judged. "Open at some point on a given day" can, because it needs no clock.

A. Guest tab: the filter reads "Open on [day]" for whichever day is selected, including today. Host panel: the open filter is hidden. "Open now" appears only when the timezone is known
B. Hide the open filter on both screens whenever the timezone is not known
C. Not yet defined
X. Other (please specify)

[Answer]: A. Guest tab: the filter reads "Open on [day]" for whichever day is selected, including today. Host panel: the open filter is hidden. "Open now" appears only when the timezone is known

## Q2. A guest opens the guide before check-in or after check-out. What does "Open now" do? (requirements review R-03)

The hours a guest receives are the rules that apply during their stay. Outside the stay, a rule that only applies between certain dates may be missing.

A. Evaluate as usual with the hours received. A place with no rule for today counts as "hours not listed", the same as any other place with missing hours
B. Hide "Open now" whenever today is outside the stay
C. Not yet defined
X. Other (please specify)

[Answer]: A. Evaluate as usual with the hours received. A place with no rule for today counts as "hours not listed", the same as any other place with missing hours

## Q3. An older "free" flag can disagree with the price level. Which decides the price filter? (requirements review R-04)

A place can carry a price level (0 means free) and, separately, an older yes/no "free" flag.

A. The price level decides. The older flag counts as Free only when the place has no price level at all
B. Only the price level counts. The older flag is ignored by the filter
C. Not yet defined
X. Other (please specify)

[Answer]: A. The price level decides. The older flag counts as Free only when the place has no price level at all

## Q4. Where do the screen behaviours both screens need live? (units review R-02)

Three behaviours were assigned to the guest tab but are also needed by the host panel: the first category starting open, the count of active filters on the "Filters" chip, and what "Clear all" resets.

A. In this foundation, as part of the shared filtering rules. Each screen only wires them up
B. In each screen separately, with a test on both to keep them the same
C. Not yet defined
X. Other (please specify)

[Answer]: A. In this foundation, as part of the shared filtering rules. Each screen only wires them up

## Q5. When are remembered choices removed from the device? (domain design review R-07)

Choices are stored per stay on the guest's device. Without a rule they would stay there indefinitely.

A. When the guide is opened, entries for stays whose check-out date has passed are removed. An entry for the current stay is kept until then
B. Keep entries until the guest clears their browser data
C. Not yet defined
X. Other (please specify)

[Answer]: A. When the guide is opened, entries for stays whose check-out date has passed are removed. An entry for the current stay is kept until then

## Consolidated Summary Confirmation

- No timezone: the guest filter reads "Open on [day]" for the selected day, including today, and the host panel hides the open filter. "Open now" appears only when the timezone is known (Q1)
- Outside the stay: "Open now" evaluates as usual with the hours received, and a place with no rule for today counts as "hours not listed" (Q2)
- Price: the price level decides. The older free flag counts as Free only when the place has no price level (Q3)
- The first-category-open rule, the active-filter count and what "Clear all" resets live in this foundation; each screen only wires them up (Q4)
- Remembered choices for stays whose check-out date has passed are removed when the guide is opened (Q5)
- The response shapes are transcribed from the backend unit's design: timezone as a zone name or nothing, distance as whole metres or nothing

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
