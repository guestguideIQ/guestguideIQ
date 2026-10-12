# Intent Capture & Framing — Questions

## Sources

- [desc] Initial description: "Update the places page to have ability to filter bases on geographic distance, categories etc, also make the categories collapsible, also use mobbin mcp for inspriation"
- [scope] Workflow-selected scope: `feature`.

## Q1. Which "places page" does this change?

The app has two screens that list places. Guests see a **Places tab** in their stay guide, which was just grouped by category. Hosts see an **area/places panel** where they curate what guests see. The filters and collapsible categories need a target screen.

A. The guest Places tab in the stay guide
B. The host's area/places curation panel
C. Both screens
D. Not yet defined
X. Other (please specify)

[Answer]: C. Both screens

## Q2. What problem is this solving for the person using the page?

This helps frame the success measure. A long list and a need to find something close by lead to different designs.

A. The list is long, so it's hard to scan even with category headings
B. People want what's near them (or near the property) and can't tell what's close
C. Both A and B
D. Not yet defined
X. Other (please specify)

[Answer]: C. Both A and B

## Q3. "Geographic distance" is measured from where?

Places carry latitude/longitude. Distance needs a reference point, and using the guest's live location means asking for browser location permission.

A. From the property or stay address
B. From the guest's current device location
C. Both, and the person can switch between them
D. Not yet defined
X. Other (please specify)

[Answer]: A. From the property or stay address

## Q4. Besides distance and category, which other filters are in view? (select all that apply)

The description says "etc". This pins down what "etc" covers. Anything not picked stays out of this piece of work.

A. Open now / opening hours
B. Price level
C. Host picks / featured only
D. Rating
E. None: distance and category only
X. Other (please specify)

[Answer]: A, B, C, D

## Q5. What does success look like?

A. Qualitative: people find a relevant place in fewer taps/scrolls, judged by trying it
B. Measured: a usage signal (e.g. filter usage or place-card taps) that we can track
C. Not yet defined
X. Other (please specify)

[Answer]: C. Not yet defined

## Q6. Why now? What triggered this?

A. Feedback from guests or hosts
B. My own product judgment after shipping the category grouping
C. Something seen in competing products
D. Not identified
X. Other (please specify)

[Answer]: B. My own product judgment after shipping the category grouping

## Q7. Who has a stake in this, and who decides scope and priority? Is any reporting needed?

A. Just me: I decide, and no reporting beyond the pull requests
B. I decide, with input from hosts, and no formal reporting
C. Others are involved (please name them and any reporting cadence)
D. Not yet defined
X. Other (please specify)

[Answer]: A. Just me: I decide, and no reporting beyond the pull requests

## Q8. How should the Mobbin inspiration be used?

You asked to use Mobbin (a library of real app screens) for inspiration.

A. Research filter and collapsible-list patterns in Mobbin and cite the chosen references in the mockup stages
B. Informal inspiration only, with nothing recorded
C. Not applicable
X. Other (please specify)

[Answer]: A. Research filter and collapsible-list patterns in Mobbin and cite the chosen references in the mockup stages

## Q9. This work was set up as a full "feature" plan. Does that match the size you have in mind?

The feature plan runs through market research, feasibility, mockups, requirements, design, build, CI, and deployment steps. That's a lot for a single-screen UI change.

A. Yes, keep the feature plan: this is a real feature
B. It's smaller than that, and I'd like a lighter workflow for a focused UI change
C. It's bigger than that: part of a wider initiative (please describe)
X. Other (please specify)

[Answer]: B. It's smaller than that, and I'd like a lighter workflow for a focused UI change

## Q10. Follow-up: the rating filter has no data behind it today. What should happen to it?

You picked a rating filter in Q4. Places already store opening hours, a price level and host curation, but nothing in the place data holds a rating, so a rating filter would first need a source of ratings (collected or imported) before it could filter anything.

A. Keep it: this work also adds rating data to places
B. Drop the rating filter from this piece of work, and record it as a later idea
C. Not yet defined: carry it as an open question into requirements
X. Other (please specify)

[Answer]: B. Drop the rating filter from this piece of work, and record it as a later idea

## Consolidated Summary Confirmation

- Screen: both the guest Places tab and the host's area/places curation panel [Q1]
- Problem: the list is long and hard to scan, and people can't tell what is close [Q2]
- Distance is measured from the property / stay address [Q3]
- Filters in this work: distance, category, open now / hours, price level, host picks only [Q4, Q10]
- Rating filter dropped from this work and recorded as a later idea (no rating data exists today) [Q10]
- Categories become collapsible [desc]
- Success measure: not yet defined [Q5]
- Trigger: your own product judgment after shipping the category grouping [Q6]
- Stakeholders: just you; you decide, no reporting beyond pull requests [Q7]
- Mobbin: research filter and collapsible-list patterns and cite chosen references in the mockup steps [Q8]
- Plan size: smaller than a full feature plan; you want a lighter workflow for a focused UI change [Q9]

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
