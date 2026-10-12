# Business Rules: u1-places-api

Upstream: the unit definition (`../../../inception/units-generation/unit-of-work.md`, U1), its requirement map (`../../../inception/units-generation/unit-of-work-story-map.md`), the requirements (`../../../inception/requirements-analysis/requirements.md`) and the component catalogue (`../../../inception/domain-design/components.md`). Answers from `functional-design-questions.md` are cited as FQ1–FQ3. There is no contract-summary document; the response shapes are in `functional-spec.md`.

```yaml
rules:
  - id: BR1.1
    statement: A place's distance is the straight-line distance from the property's location to the place's location.
    category: calculation
    applies_to: GuestPlaceView.distanceMeters, HostPlaceRow.distanceMeters
    trigger: Building the guest stay response or the host place list.
    logic: IF the property has a location AND the place has a location THEN distance is the great-circle distance between them, using the existing tested distance function.
    violation: Not applicable. A calculation cannot be violated; an unknown input falls under BR1.2.
    source: FR2.2, FR10.1

  - id: BR1.2
    statement: An unknown distance is sent as null, never as zero.
    category: constraint
    applies_to: GuestPlaceView.distanceMeters, HostPlaceRow.distanceMeters
    trigger: Building either response.
    logic: IF the property has no location OR the place has no location THEN distanceMeters is null.
    violation: A response carrying 0 for an unknown distance is a defect; a test must fail.
    source: FR10.1, FR10.4

  - id: BR1.3
    statement: Distance is sent in whole metres.
    category: calculation
    applies_to: GuestPlaceView.distanceMeters, HostPlaceRow.distanceMeters
    trigger: Building either response.
    logic: IF a distance is known THEN round it to the nearest whole metre. A place at the property's own location has distance 0, which is a real value.
    violation: Not applicable.
    source: FR10.1

  - id: BR1.4
    statement: Place coordinates are never sent to any client.
    category: constraint
    applies_to: GuestPlaceView, HostPlaceRow
    trigger: Building either response.
    logic: IF a response is serialised THEN no place latitude or longitude appears in it.
    violation: A response carrying a place coordinate is a defect; a test must fail.
    source: NFR4, ADR-001

  - id: BR2.1
    statement: The property's timezone is the first real zone found, looking at the locality and then the property.
    category: calculation
    applies_to: GuestStayView.property.timezone, HostPlaceList.timezone
    trigger: Building either response.
    logic: IF the locality has a real zone THEN use it. ELSE IF the property has a real zone THEN use it. ELSE the zone is unknown. One shared helper function holds this rule.
    violation: Not applicable.
    source: FR10.2, FQ1

  - id: BR2.2
    statement: The default value UTC is not a real zone, and an unknown zone is sent as null.
    category: policy
    applies_to: GuestStayView.property.timezone, HostPlaceList.timezone
    trigger: Resolving the zone.
    logic: IF a zone value is missing, is exactly UTC, or is not a valid Region/City zone name THEN it is not a real zone. IF no real zone is found THEN timezone is null.
    violation: A response carrying UTC as the timezone is a defect; a test must fail.
    source: FR10.2, FR10.4, FQ2

  - id: BR2.3
    statement: Stay link expiry keeps falling back to UTC when no real zone is known.
    category: policy
    applies_to: Stay expiry
    trigger: Creating or changing a stay.
    logic: IF the shared helper finds a real zone THEN expiry is the end of the check-out day in that zone. ELSE expiry is the end of the check-out day in UTC, as today.
    violation: Not applicable.
    source: FQ1

  - id: BR3.1
    statement: Each row of the host's place list carries the place's shared category, opening hours, price level, distance and this property's stance.
    category: policy
    applies_to: HostPlaceRow
    trigger: The host requests the place list for a property.
    logic: IF the enrichment is available THEN every row carries poiCategory, hours, priceLevel, distanceMeters and stance, each null when unknown.
    violation: Not applicable.
    source: FR10.3, FQ3

  - id: BR3.2
    statement: The host place list keeps its existing authentication and ownership check.
    category: authorization
    applies_to: HostPlaceList
    trigger: The host requests the place list for a property.
    logic: IF the caller is not an authenticated owner of the property THEN the request is refused exactly as it is today, and no enriched data is returned.
    violation: The existing refusal response.
    source: NFR4

  - id: BR3.3
    statement: A host sees every stance; a guest never sees hidden or offered places.
    category: authorization
    applies_to: HostPlaceRow.stance, GuestPlaceView
    trigger: Building either response.
    logic: IF the response is the host place list THEN stance may be offered, featured, listed, hidden or null. IF the response is the guest stay view THEN only featured and listed places appear, as today.
    violation: A guest response containing a hidden or offered place is a defect; a test must fail.
    source: FR10.3, NFR4

  - id: BR3.4
    statement: Hours on the host place list are the rules in effect on the current date.
    category: policy
    applies_to: HostPlaceRow.hours
    trigger: Building the host place list.
    logic: IF an hours rule has no validity dates, or today falls within them, THEN it is included. IF a place has no included rule THEN hours is null. Today is the current date in the property's timezone, or in UTC when the zone is unknown.
    violation: Not applicable.
    source: FR10.3

  - id: BR3.5
    statement: The host place list is still returned in full when enrichment data is missing.
    category: policy
    applies_to: HostPlaceList
    trigger: Building the host place list.
    logic: IF a place has no category, hours, price, location or listing THEN its row is still returned with those fields null. IF the property has no location THEN every distanceMeters is null.
    violation: Not applicable.
    source: FR10.4

  - id: BR4.1
    statement: Every field this unit adds is optional and nullable.
    category: constraint
    applies_to: GuestPlaceView, GuestStayView, HostPlaceRow, HostPlaceList
    trigger: Any response this unit changes.
    logic: IF a value is unknown THEN the field is null. No existing field changes its name, type or meaning.
    violation: A changed or removed existing field is a defect; the existing tests must stay green.
    source: FR10.4, NFR6

  - id: BR4.2
    statement: When the enrichment is not wired in, the host place list returns its previous shape.
    category: policy
    applies_to: HostPlaceList
    trigger: The place-list route runs without its optional enrichment connection.
    logic: IF the optional connection to the guest context code is absent THEN the rows carry only their existing fields and the response has no timezone field.
    violation: Not applicable.
    source: NFR6, FQ3

  - id: BR5.1
    statement: The price level scale is 0 to 4, where 0 means free.
    category: constraint
    applies_to: PlaceProfile.priceLevel, GuestPlaceView, HostPlaceRow.priceLevel
    trigger: Documenting and sending a price level.
    logic: IF a price level is sent THEN it is an integer from 0 to 4 and 0 means free. The schema note, the guest type note and the contract note all say so.
    violation: Not applicable.
    source: FR10.5
```

## Rules Summary

| ID | Rule | Category | Source |
|---|---|---|---|
| BR1.1 | Distance is the straight line from the property to the place | calculation | FR2.2, FR10.1 |
| BR1.2 | Unknown distance is null, never zero | constraint | FR10.1, FR10.4 |
| BR1.3 | Distance is in whole metres | calculation | FR10.1 |
| BR1.4 | Place coordinates are never sent | constraint | NFR4 |
| BR2.1 | Timezone is the locality's real zone, else the property's | calculation | FR10.2 |
| BR2.2 | UTC default is not a real zone; unknown is null | policy | FR10.2, FR10.4 |
| BR2.3 | Stay expiry still falls back to UTC | policy | FQ1 |
| BR3.1 | Host rows carry category, hours, price, distance, stance | policy | FR10.3 |
| BR3.2 | Host list keeps its authentication and ownership check | authorization | NFR4 |
| BR3.3 | Hosts see every stance; guests never see hidden or offered | authorization | FR10.3, NFR4 |
| BR3.4 | Host hours are the rules in effect today | policy | FR10.3 |
| BR3.5 | Rows are returned even with no enrichment data | policy | FR10.4 |
| BR4.1 | Every added field is optional and nullable | constraint | FR10.4, NFR6 |
| BR4.2 | Without the enrichment connection, the old shape is returned | policy | NFR6 |
| BR5.1 | Price level is 0 to 4, and 0 means free | constraint | FR10.5 |
