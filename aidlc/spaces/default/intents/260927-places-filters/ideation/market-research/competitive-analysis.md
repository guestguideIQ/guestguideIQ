# Competitive Analysis: Place Filters, Collapsible Categories and Map View

Upstream: this analysis serves the scope in `../intent-capture/intent-statement.md` (the intent-statement), which asks for filters by distance from the property, category, open now, price level and host picks, plus collapsible categories on the guest Places tab and the host's area/places panel. A map view was added during this stage (market-research-questions.md, Q4 and Q6).

## Sources and Evidence Standard

- **Observed**: screens retrieved from Mobbin on 2026-09-27 and examined directly. Each is linked.
- **Hypothesis**: claims about products not seen in Mobbin this session, such as host guidebook products. These are labelled as hypotheses and need checking before anyone relies on them.

## Comparison Set

You chose four groups (Q1): map and local apps, travel and booking apps, host guidebook products, and general Mobbin patterns.

| Product | Group | What it shows about this problem | Evidence |
|---------|-------|----------------------------------|----------|
| Google Maps | Map / local | Search results as a map above a list. The filter row starts with a filter-settings icon, then quick chips ("Open now", accessibility). Each card shows open or closed status with the next opening time | Observed: [Google Maps list](https://mobbin.com/screens/cdf52403-8878-40f2-b7cc-126b574c8379) |
| Snapchat (Map places) | Map / local | A place list in a bottom sheet over the map, with category chips on top. Each card shows the category, "Open Now" or "Closed", and the distance, plus "vibe" tags such as Date Night or Scenic Views | Observed: [Snapchat places](https://mobbin.com/screens/418d9a3e-d688-46a5-bb83-6df4c3eedaf0) |
| Swarm | Map / local | Category chips (Restaurants, Coffee, Bakery) under the search bar. Rows show distance first, for example "150 m • New York" | Observed: [Swarm explore](https://mobbin.com/screens/9d037ed6-31a2-4ecd-97ac-cee3ef0e98c9) |
| Tripadvisor | Travel | A filter sheet with a "Distance from" slider and landmark chips, then neighbourhood and rating sections, ending with a "Show 5 results" button | Observed: [Tripadvisor filters](https://mobbin.com/screens/85bc9bfe-26f3-4ecc-aa6b-f05f96281f8b) |
| Viator | Travel | A filter sheet with a price range and checkbox "specials", ending with "Clear all" and "Show 200 results" | Observed: [Viator filters](https://mobbin.com/screens/c9f8aded-2997-45b1-8423-2f6d066b0ef8) |
| TheFork | Travel / dining | A map above a list. The filter chip shows how many filters are active ("1"), and the sheet header shows a live result count ("258 restaurants") | Observed: [TheFork map list](https://mobbin.com/screens/25a33ea6-3844-4896-bb0d-0a5e3fbba4c6) |
| corner | Curated places | A person's curated places on a map, with "all places / eat / café / bar" chips and a list sheet below. This is the closest analogue to host-curated places | Observed: [corner curated map](https://mobbin.com/screens/bbb59302-dc73-4aa6-8033-423bc20aff11) |
| Places | Curated places | A map with curated chips ("Table Tonight", "Newly opened") and a selected-place card showing "Open now" | Observed: [Places map](https://mobbin.com/screens/a975205e-1d5d-48a8-b153-0ad30ccf710a) |
| Too Good To Go | Local | Category chips plus a "Top picks near you" row that leads the page, with distance on each card | Observed: [Too Good To Go discover](https://mobbin.com/screens/dd73f5fb-1631-46eb-868a-d8d89c68b075) |
| Fresha | Local services | A filter sheet with sort options (Best match / Nearest / Top rated), a max-price slider and an "Only show" toggle | Observed: [Fresha filters](https://mobbin.com/screens/95f307d6-cfed-4784-b500-b6fa2f81d91b) |
| Host guidebooks (Touch Stay, Hostfully, Enso Connect) | Host guidebook | Hypothesis: these present host recommendations as category lists, often with an embedded map, but with little or no filtering. Not seen on Mobbin this session, so unverified | Hypothesis |

## Collapsible Category Patterns (Mobbin)

| Pattern | Example | Relevance |
|---------|---------|-----------|
| Header row with the item count and a chevron | [Me+ grouped list](https://mobbin.com/screens/ee1d2bb0-ff1b-4b75-bbc2-6300cc399fb6) | Showing each category's count while it is collapsed tells guests what is inside without opening it |
| Large section headings with a chevron, where empty sections are dimmed | [Reminders sections](https://mobbin.com/screens/18651acb-c9e7-4579-9148-ee2737350062) | Shows how a category can look when filters leave it empty |
| Expanded section showing grouped content inline | [Fly Delta menu](https://mobbin.com/screens/b7a00b6f-eff3-42e2-80b3-cef62a0b896f) | One section open and the others collapsed keeps a long guide easy to scan |
| Top-level "Categories" collapse above the sub-category rows | [eBay categories](https://mobbin.com/screens/ba7be750-df58-477a-a9bc-328da291cefb) | Relevant if the host panel nests sub-categories |

## Feature Comparison (Observed Screens)

| Capability | Map apps | Travel apps | Curated-place apps | GuestGuideIQ today |
|-----------|----------|-------------|--------------------|--------------------|
| Distance on each place | Strong (Swarm, Snapchat) | Adequate (Tripadvisor: distance from a landmark) | Adequate (Too Good To Go) | Absent |
| Distance from a chosen point, not from the device | Weak | Strong (Tripadvisor "Distance from" a landmark) | Absent | Absent: this work adds distance from the property |
| Open now | Strong (Google Maps chip) | Adequate | Adequate (Places) | Absent |
| Price | Adequate (foodpanda-style chips) | Strong (Viator, Fresha sliders) | Absent | Absent |
| Curated or featured first | Weak | Weak | Strong (corner, Places, Too Good To Go "Top picks") | Host curation exists in the data but is not a filter |
| Map plus list | Strong | Strong (TheFork) | Strong (corner) | Absent |
| Collapsible categories | Not typical | Not typical | Not typical | Grouped by category but not collapsible |
| Live result count on the filter sheet | Adequate | Strong (Tripadvisor, Viator, TheFork) | Absent | Absent |

## Positioning

- **Table stakes**: guests expect to see the distance on every place and to be able to sort by distance (Q2). Every map and local app examined shows distance on the card.
- **Differentiator**: host picks first, with filters narrowing within the curated set (Q3). The curated-place apps (corner, Places, Too Good To Go "Top picks") lead with curation. The map apps list everything, which is the gap a host-curated guide can fill.
- **Distance from the property**: Tripadvisor's "Distance from [landmark]" is the closest precedent. It measures distance from a chosen point rather than the device, which matches measuring from the stay address.

## Assumptions & Open Questions

- Hypothesis: host guidebook competitors offer little filtering. Check this directly before using it as a selling point.
- Most observed screens are iOS. The guest guide is a web app, so the patterns need adapting for mobile web (Q5 mobile-first).
