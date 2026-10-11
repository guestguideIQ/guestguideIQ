# Entities: u1-places-api

Upstream: the unit definition (`../../../inception/units-generation/unit-of-work.md`, U1), its requirement map (`../../../inception/units-generation/unit-of-work-story-map.md`), the requirements (`../../../inception/requirements-analysis/requirements.md`) and the component catalogue (`../../../inception/domain-design/components.md`). There is no contract-summary document, because contract design was skipped. The response shapes in this unit's `functional-spec.md` take its place.

This unit adds no stored entity and changes no table. It reads existing records in new ways and adds fields to two responses. The block below lists the stored records it reads, then the response views it changes.

```yaml
entities:
  - name: Place
    description: A place in a locality's catalogue. Existing record, read only.
    attributes:
      - name: id
        type: identifier
        required: true
        unique: true
      - name: latitude
        type: decimal
        required: false
        min: -90
        max: 90
        constraints: Present only together with longitude.
      - name: longitude
        type: decimal
        required: false
        min: -180
        max: 180
        constraints: Present only together with latitude.
      - name: categoryId
        type: identifier
        required: false
        references: PlaceCategory.id
    constraints:
      - Latitude and longitude are both present or both absent.
      - Coordinates are never included in any response this unit produces.
    relationships:
      - to: PlaceCategory
        cardinality: many-to-one, optional
        direction: Place refers to PlaceCategory
      - to: PlaceHours
        cardinality: one-to-many
        direction: PlaceHours refers to Place
      - to: PlaceProfile
        cardinality: one-to-one, optional
        direction: PlaceProfile refers to Place
      - to: PropertyListing
        cardinality: one-to-many
        direction: PropertyListing refers to Place

  - name: Property
    description: A host's property. Existing record, read only. Owned outside this unit.
    attributes:
      - name: id
        type: identifier
        required: true
        unique: true
      - name: latitude
        type: decimal
        required: false
        constraints: Present only together with longitude.
      - name: longitude
        type: decimal
        required: false
        constraints: Present only together with latitude.
      - name: timezone
        type: text
        required: false
        constraints: An IANA Region/City zone name when present.
    constraints:
      - Latitude and longitude are both present or both absent.
    relationships:
      - to: LocalityRecord
        cardinality: many-to-one, optional
        direction: Property refers to LocalityRecord

  - name: LocalityRecord
    description: A locality brand. Existing record, read only.
    attributes:
      - name: id
        type: identifier
        required: true
        unique: true
      - name: timezone
        type: text
        required: true
        default: UTC
        constraints: Either the default value UTC, meaning never set, or an IANA Region/City zone name.
    constraints: []
    relationships: []

  - name: PlaceHours
    description: One opening-hours rule for a place. Existing record, read only.
    attributes:
      - name: id
        type: identifier
        required: true
        unique: true
      - name: placeId
        type: identifier
        required: true
        references: Place.id
      - name: dayOfWeek
        type: integer
        required: true
        min: 0
        max: 6
        constraints: 0 is Sunday.
      - name: opens
        type: text
        required: false
        constraints: Local wall-clock time, hours and minutes.
      - name: closes
        type: text
        required: false
        constraints: Local wall-clock time, hours and minutes.
      - name: closesNextDay
        type: boolean
        required: true
        default: false
      - name: isClosed
        type: boolean
        required: true
        default: false
      - name: validFrom
        type: date
        required: false
      - name: validUntil
        type: date
        required: false
    constraints:
      - A place may have several rules for the same day.
      - No rule for a day means the hours for that day are unknown, not closed.
    relationships:
      - to: Place
        cardinality: many-to-one
        direction: PlaceHours refers to Place

  - name: PlaceProfile
    description: Practical facts about a place. Existing record, read only.
    attributes:
      - name: placeId
        type: identifier
        required: true
        unique: true
        references: Place.id
      - name: priceLevel
        type: integer
        required: false
        min: 0
        max: 4
        allowed_values: [0, 1, 2, 3, 4]
        constraints: 0 means free. Absent means unknown.
    constraints: []
    relationships:
      - to: Place
        cardinality: one-to-one
        direction: PlaceProfile refers to Place

  - name: PlaceCategory
    description: A shared category. Existing record, read only.
    attributes:
      - name: id
        type: identifier
        required: true
        unique: true
      - name: category
        type: text
        required: true
      - name: subcategory
        type: text
        required: true
      - name: slug
        type: text
        required: true
      - name: icon
        type: text
        required: false
      - name: sortOrder
        type: integer
        required: false
        default: 0
    constraints: []
    relationships: []

  - name: PropertyListing
    description: One property's stance on one place. Existing record, read only.
    attributes:
      - name: propertyId
        type: identifier
        required: true
        references: Property.id
      - name: placeId
        type: identifier
        required: true
        references: Place.id
      - name: stance
        type: text
        required: true
        allowed_values: [offered, featured, listed, hidden]
    constraints:
      - At most one listing per property and place.
    relationships:
      - to: Place
        cardinality: many-to-one
        direction: PropertyListing refers to Place
      - to: Property
        cardinality: many-to-one
        direction: PropertyListing refers to Property

  - name: GuestPlaceView
    description: One place as a guest receives it. Existing response view; this unit adds one field.
    attributes:
      - name: distanceMeters
        type: integer
        required: false
        min: 0
        constraints: New. Straight-line distance from the property, in whole metres. Null when unknown.
    constraints:
      - Never carries coordinates.
    relationships: []

  - name: GuestStayView
    description: The guest's stay response. Existing response view; this unit adds one field to its property part.
    attributes:
      - name: property.timezone
        type: text
        required: false
        constraints: New. An IANA Region/City zone name. Null when no real zone is configured.
    constraints: []
    relationships:
      - to: GuestPlaceView
        cardinality: one-to-many
        direction: GuestStayView contains GuestPlaceView

  - name: HostPlaceRow
    description: One row of the host's place list. Existing response view; this unit adds six fields.
    attributes:
      - name: poiCategory
        type: object
        required: false
        constraints: New. The shared category (id, category, subcategory, slug, icon, sortOrder, imageUrl). Null when the place has none.
      - name: hours
        type: object
        required: false
        constraints: New. Same shape as the guest's hours. Null when the place has no hours rules in effect today.
      - name: priceLevel
        type: integer
        required: false
        min: 0
        max: 4
        constraints: New. 0 means free. Null when unknown.
      - name: distanceMeters
        type: integer
        required: false
        min: 0
        constraints: New. Null when unknown.
      - name: stance
        type: text
        required: false
        allowed_values: [offered, featured, listed, hidden]
        constraints: New. This property's stance on the place. Null when the property has no listing for it.
    constraints:
      - Never carries coordinates.
      - Existing fields (id, name, description, category, localityIds, address, hostAdded) are unchanged.
    relationships: []

  - name: HostPlaceList
    description: The host's place list response. Existing response view; this unit adds one field.
    attributes:
      - name: timezone
        type: text
        required: false
        constraints: New. Same meaning as GuestStayView property.timezone.
    constraints: []
    relationships:
      - to: HostPlaceRow
        cardinality: one-to-many
        direction: HostPlaceList contains HostPlaceRow
```

## Summary

- **Stored records read, none changed:** Place, Property, LocalityRecord, PlaceHours, PlaceProfile, PlaceCategory, PropertyListing.
- **Response views changed:**
  - `GuestPlaceView` gains `distanceMeters`.
  - `GuestStayView` gains `property.timezone`.
  - `HostPlaceRow` gains `poiCategory`, `hours`, `priceLevel`, `distanceMeters` and `stance`.
  - `HostPlaceList` gains `timezone`.
- **Nothing new is stored.** No migration is needed.
- Every new field is optional and nullable. Coordinates of places are never sent.
