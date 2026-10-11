# Entities: u2-places-foundation

Upstream: the unit definition (`../../../inception/units-generation/unit-of-work.md`, U2), its requirement map (`../../../inception/units-generation/unit-of-work-story-map.md`), the requirements (`../../../inception/requirements-analysis/requirements.md`) and the component catalogue (`../../../inception/domain-design/components.md`). There is no contract-summary document; the response shapes come from section 2 of the backend unit's functional specification.

This unit has no database. Its entities are the values the filtering rules work on, and the one thing it stores in the guest's browser.

```yaml
entities:
  - name: FilterablePlace
    description: One place in the form the filtering rules need. Each screen builds it from its own place data.
    attributes:
      - name: id
        type: identifier
        required: true
        unique: true
      - name: category
        type: object
        required: false
        constraints: The shared category (name, icon, sort order). Absent when the place has none.
      - name: hours
        type: object
        required: false
        constraints: Opening hours by day of week, in local wall-clock time. Absent when not listed.
      - name: priceLevel
        type: integer
        required: false
        min: 0
        max: 4
        constraints: 0 means free. Absent when unknown.
      - name: isFree
        type: boolean
        required: false
        constraints: The older free flag. Used only when priceLevel is absent.
      - name: isHostPick
        type: boolean
        required: true
        default: false
        constraints: True when the host's stance on the place is featured.
      - name: distanceMeters
        type: integer
        required: false
        min: 0
        constraints: Straight-line distance from the property. Absent when unknown.
      - name: hostOrder
        type: integer
        required: true
        constraints: The place's position in the order the screen received it.
    constraints:
      - Carries no coordinates.
    relationships: []

  - name: FilterState
    description: The choices a person has made on one screen.
    attributes:
      - name: categories
        type: list of text
        required: true
        default: empty
        constraints: Category names chosen. Empty means every category.
      - name: openOnly
        type: boolean
        required: true
        default: false
      - name: hostPicksOnly
        type: boolean
        required: true
        default: false
      - name: priceLevels
        type: list of integer
        required: true
        default: empty
        allowed_values: [0, 1, 2, 3, 4]
        constraints: Empty means every price.
      - name: distanceBand
        type: text
        required: true
        default: any
        allowed_values: [any, under-0.5-mi, under-1-mi, under-3-mi, under-10-mi]
      - name: sort
        type: text
        required: true
        default: host-order
        allowed_values: [host-order, nearest-first]
      - name: includeUnknown
        type: list of text
        required: true
        default: empty
        allowed_values: [open, price, distance]
        constraints: Filters for which the person chose to show places that have no value.
    constraints:
      - The default state has every attribute at its default.
    relationships: []

  - name: OpenContext
    description: What the open filter is judged against on this screen at this moment.
    attributes:
      - name: mode
        type: text
        required: true
        allowed_values: [now, on-day, unavailable]
      - name: timezone
        type: text
        required: false
        constraints: IANA zone name. Required when mode is now.
      - name: instant
        type: timestamp
        required: false
        constraints: The current moment. Required when mode is now.
      - name: date
        type: date
        required: false
        constraints: The selected day. Required when mode is on-day.
    constraints:
      - Mode now requires a timezone.
    relationships: []

  - name: FilterAvailability
    description: Which filters a screen may offer for the places it has.
    attributes:
      - name: category
        type: boolean
        required: true
      - name: open
        type: boolean
        required: true
      - name: price
        type: boolean
        required: true
      - name: distance
        type: boolean
        required: true
      - name: nearestFirstSort
        type: boolean
        required: true
      - name: hostPicks
        type: boolean
        required: true
    constraints: []
    relationships: []

  - name: FilterResult
    description: What the rules return for a list of places and a filter state.
    attributes:
      - name: groups
        type: list of object
        required: false
        constraints: Category sections in order, each with its name, icon, matching places and matching count. Absent when the list is flat.
      - name: flatPlaces
        type: list of object
        required: false
        constraints: The matching places in one list. Present only when no place has a category.
      - name: totalMatching
        type: integer
        required: true
        min: 0
      - name: leftOut
        type: object
        required: true
        constraints: For each of open, price and distance, the number of places left out because they have no value for that active filter.
      - name: activeSheetFilterCount
        type: integer
        required: true
        min: 0
    constraints:
      - Exactly one of groups and flatPlaces is present.
    relationships:
      - to: FilterablePlace
        cardinality: one-to-many
        direction: FilterResult contains FilterablePlace

  - name: ExpandedState
    description: Which category sections are open on a screen.
    attributes:
      - name: expandedCategories
        type: list of text
        required: true
        constraints: Category names that are open.
    constraints: []
    relationships: []

  - name: StoredPlacePreference
    description: A guest's remembered choices for one stay, kept in the browser's local storage.
    attributes:
      - name: storageKey
        type: text
        required: true
        unique: true
        constraints: Built from a fixed prefix, the property id, the check-in date and the check-out date. Never contains the stay link token.
      - name: version
        type: integer
        required: true
        constraints: The format version. An entry with another version is ignored.
      - name: filters
        type: object
        required: true
        constraints: A FilterState.
      - name: expandedCategories
        type: list of text
        required: true
      - name: checkOut
        type: date
        required: true
        constraints: The stay's check-out date, used to remove the entry later.
    constraints:
      - Holds no credential and no personal data.
      - Exists only for a guest with a stay. The host panel never stores one.
    relationships: []
```

## Summary

- **Inputs to the rules:** `FilterablePlace`, `FilterState`, `OpenContext`.
- **Outputs of the rules:** `FilterAvailability`, `FilterResult`.
- **Screen state the rules define:** `ExpandedState`.
- **The only stored entity:** `StoredPlacePreference`, in the guest's browser.
- **Wire types** for the new response fields are not listed here. They are defined in section 2 of the backend unit's functional specification, and this unit's `functional-spec.md` says how they are transcribed.
