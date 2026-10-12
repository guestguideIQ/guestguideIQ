# Market Research & Competitive Analysis — Questions

Context: the intent statement (`../intent-capture/intent-statement.md`) sets this work as filters (distance from the property, category, open now, price level, host picks) and collapsible categories on the guest Places tab and the host's area/places panel. This research looks at how comparable products handle the same job, so the mockups and requirements start from known patterns.

## Q1. Which products should we compare against? (select all that apply)

Knowing which apps your guests and hosts already use sets the "expected" behaviour for filters.

A. Map and local-discovery apps (Google Maps, Apple Maps, Yelp)
B. Travel and booking apps with area guides (Airbnb Guides/Experiences, Booking.com, Tripadvisor)
C. Digital guidebook products for hosts (e.g. Touch Stay, Hostfully, Enso Connect guidebooks)
D. Whatever Mobbin surfaces for "filter" and "collapsible list" patterns, regardless of category
E. None: skip competitor comparison and rely on Mobbin in the mockup step only
X. Other (please specify)

[Answer]: A, B, C, D

## Q2. What do guests treat as table stakes on a list of nearby places?

This decides what must ship in this work and what can be a differentiator later.

A. Distance shown on every place, plus a sort by distance
B. An "Open now" toggle
C. Category chips or tabs you can switch quickly
D. All of A, B and C are table stakes
E. Not yet defined: let the competitor survey tell us
X. Other (please specify)

[Answer]: A. Distance shown on every place, plus a sort by distance

## Q3. Where should GuestGuideIQ differ from the map apps?

Map apps list everything. A host-curated guide can lean on curation instead.

A. Host picks first: curated recommendations lead, and filters narrow within them
B. Stay context: distance from the property, and walkable vs drive
C. Both A and B
D. No differentiation needed: match the common patterns well
E. Not yet defined
X. Other (please specify)

[Answer]: A. Host picks first: curated recommendations lead, and filters narrow within them

## Q4. Is there a build-vs-buy choice anywhere in this work?

Filters and collapsible sections are ordinary UI, but a map view or a places/filter component library could be bought or adopted.

A. No: build it in the existing app with the current design system
B. Consider an existing UI component library for the filter controls
C. Consider adding a map view with a third-party map provider (would widen scope)
D. Not applicable
X. Other (please specify)

[Answer]: C. Consider adding a map view with a third-party map provider (would widen scope)

## Q5. Are there trends or rules we need to respect?

A. Accessibility: collapsible sections and filter controls must work with keyboard and screen readers
B. Mobile-first: most guests read the guide on a phone
C. Both A and B
D. None
X. Other (please specify)

[Answer]: C. Both A and B

## Q6. Follow-up: is the map view part of this piece of work?

In Q4 you chose to consider adding a map view with a third-party map provider. The confirmed scope for this work (filters and collapsible categories, with a lighter plan) has no map view, and the frontend has no map library today. Adding one brings in a provider choice, an API key and billing, and more design and testing.

A. Record the map view as a later idea; keep this work to filters and collapsible categories
B. Include a map view in this work, which widens the scope and may need stages brought back
C. Assess it here only: compare map providers in the build-vs-buy note, then decide at scope definition
X. Other (please specify)

[Answer]: B. Include a map view in this work, which widens the scope and may need stages brought back

## Q7. Follow-up: which map provider do you lean towards?

A map view needs a tile and map provider. They differ mainly on cost and on whether a browser-visible API key is needed. A browser map key is public by nature and must be locked to your domains, never treated as a secret.

A. Google Maps (familiar to guests, usage-billed, needs a restricted browser key)
B. Mapbox (strong styling, usage-billed, needs a restricted public token)
C. MapLibre with an open tile source (no per-view billing from the library; tiles still need a host)
D. Not yet defined: compare them in the build-vs-buy note
X. Other (please specify)

[Answer]: A. Google Maps (familiar to guests, usage-billed, needs a restricted browser key)

## Q8. Follow-up: the map view grows the work. How should the plan respond?

You asked for a lighter plan (intent capture Q9), and this is the second addition beyond it after the extra filters. Several skipped steps, such as feasibility and refined mockups, would normally cover a new third-party dependency.

A. After this step, I propose which skipped steps to bring back, and you approve or edit
B. Keep the lighter plan as it is and handle the map inside the remaining steps
X. Other (please specify)

[Answer]: B. Keep the lighter plan as it is and handle the map inside the remaining steps

## Consolidated Summary Confirmation

- Compare against map and local apps, travel and booking apps, host guidebook products, and Mobbin filter and collapsible-list patterns (Q1)
- Table stakes for guests: distance shown on every place, plus a sort by distance (Q2)
- Differentiator: host picks first, with filters narrowing within the curated recommendations (Q3)
- Build-vs-buy: add a map view using a third-party map provider (Q4), included in this work (Q6)
- Map provider leaning: Google Maps, with a browser key restricted to your domains (Q7)
- Accessibility and mobile-first both apply to the filters and collapsible sections (Q5)
- Plan: keep the lighter plan and handle the map inside the remaining steps (Q8)

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
