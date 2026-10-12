# User Flows: Places Filters, Collapsible Categories and Map View

Upstream: the flows cover the intent-statement's problem (`../intent-capture/intent-statement.md`), the scope-document's boundary (`../scope-definition/scope-document.md`) and the intent-backlog items B1–B8 (`../scope-definition/intent-backlog.md`). The screens referenced are the ones in `wireframes.md`.

## Flow 1: Guest Finds Something Nearby That Is Open

```
Guest guide
   |
   v
[Places tab: List]  --(first category open, rest collapsed with counts)
   |
   +--> tap (Open on Sun) chip ---> counts update live, empty categories dim
   |
   +--> tap (Filters) --> [Filters sheet]
   |                          |
   |                          +--> pick "< 1 mi", sort "Nearest first"
   |                          |
   |                          +--> [Show 9 places] --> back to list, filtered
   |
   v
open a category header --> scan cards (distance, price, host pick)
   |
   v
tap a card --> full place card (existing)
```

Flow: Find a nearby, open place
Persona: Guest on a phone
Trigger: The guest opens the Places tab
Steps:
1. Places tab (List) -> the guest reads the category counts -> Dining is open, the others are collapsed.
2. Taps "Open on [day]" -> the counts and cards update, and categories left empty dim to "0 places".
3. Taps "Filters" -> picks a distance band and "Nearest first" -> "Show N places".
4. Opens a category -> scans the distance on each card -> opens a place.

Success outcome: the guest reaches a relevant open place without scrolling the whole list.

Error paths:
- Filters match nothing -> "No places match. Clear filters" -> Clear resets every filter.
- The places fail to load -> the existing guide error pattern -> retry.

## Flow 2: Guest Switches to the Map

```
[Places tab: List, filters set]
   |
   v
tap [Map] --> map loads now (first map load of this visit)
   |
   +--> pins = places matching current filters, (H) = property
   |
   +--> tap a pin --> place card strip --> [Details] --> full place card
   |
   +--> tap [List] --> back to list, same filters and scroll position
```

Flow: See places around the property
Persona: Guest on a phone
Trigger: The guest picks "Map" on the List / Map toggle
Steps:
1. Picks Map -> the map loads for the first time this visit -> pins for the filtered places, plus the property.
2. Selects a pin -> a card strip appears -> Details opens the full card.
3. Picks List -> back to the list with the filters unchanged.

Success outcome: the guest understands where places sit relative to the property.

Error paths:
- The map fails to load (network, key restriction or quota) -> "The map isn't available right now" -> Show list.
- Some places have no coordinates -> "3 places aren't on the map" -> link to the list.

## Flow 3: Host Scans Curated Places

Flow: Review what is curated in one category
Persona: Host in the area/places panel
Trigger: The host opens "Your area's places"
Steps:
1. The panel lists categories with counts, and the first one is open.
2. Taps "Host picks" -> only featured places are shown -> confirms what guests see first.
3. Opens a category -> edits or hides a place with the existing actions.

Success outcome: the host finds a place to curate without scrolling the whole list.

Error paths:
- Filters match nothing -> "No places match. Clear filters".

## Assumptions & Open Questions

- Whether the List / Map choice and the filters survive a reload is not decided. Requirements should settle it.
- The hosts' flow assumes filters never change guest-facing data. Requirements should state this as a rule.
