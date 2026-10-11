# Performance Test Instructions: Places Filters

No dedicated performance stage ran for this work, and no load test is called for. There is one measurable performance requirement and one cost to watch.

## The Requirement: Filtering Speed (NFR3)

Applying or changing a filter must update the list and counts within 100 ms for 200 places on a mid-range phone, and must make no network request.

**Automated guard.** Scenario S32 in `guestguideiq-frontend/src/places/placeFilters.scenarios.test.ts` applies every filter to 200 places and asserts it completes within 25 ms in the test environment, taking the fastest of five runs, and that no request is made. The 25 ms bound leaves a fourfold margin for a phone.

```bash
npx vitest run src/places/placeFilters.scenarios.test.ts --exclude ".claude/**"
```

**What this is not.** It is a regression guard on a development machine. It is not a measurement on a phone. The 100 ms target itself has not been measured on a device.

**To measure it properly.** On a mid-range Android phone, or with 4x CPU throttling in a desktop browser's developer tools, open a guest guide with about 200 places, record a performance profile while toggling "Open now" and confirming the filter sheet, and read the time from the tap to the next paint.

## The Cost to Watch: Backend Reads

- **Guest stay read:** one extra query for place coordinates per request.
- **Host place list:** a fixed number of extra queries per request (the property's location and zones, categories, hours, listings, picked ids, coordinates). None is per row.
- **Host panel after an action:** one extra place-list read each time the host adds, removes, features or stops featuring a place.

No latency target was set for these endpoints in this work. After deployment, compare the existing request-duration figures for the guest stay read and `GET /v1/pois` before and after.

## Not Applicable

Load testing, soak testing and capacity planning: the change adds no new endpoint and no new workload.
