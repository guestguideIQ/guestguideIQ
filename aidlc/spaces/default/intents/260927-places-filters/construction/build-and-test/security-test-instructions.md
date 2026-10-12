# Security Test Instructions: Places Filters

The security-relevant claims in this work come from requirement NFR4 and the team's standing rules. Each has a check below.

## 1. Dependency Vulnerabilities

Both repositories' CI runs this as a blocking step:

```bash
npm audit --audit-level=high
```

This work adds no dependency to either repository; neither lockfile changed.

## 2. Secrets

- Source: both CI workflows run a secret scan on every pull request.
- Built output: the frontend CI also scans `dist/` after the build.
- This work adds no credential, key or token, and no new environment variable.

## 3. Nothing Sensitive in Browser Storage

**Claim.** The remembered-choices entry holds only the property id, the stay dates and the filter choices. The stay link token and the guest's name are never written.

**Checks.** Scenario S27 in `guestguideiq-frontend/src/places/placePreferences.scenarios.test.ts`, and scenario S12 in `src/guest/guide/guestPlaces.scenarios.test.tsx`, which asserts the stored key and value contain neither the token nor the name.

## 4. One Storage Boundary

**Claim.** Only `src/places/placePreferences.ts` touches browser storage for this feature, and it cannot make network requests.

**Checks.** The lint rule in `eslint.config.js` bans storage and network access outside the allowed modules. `src/eslintConfig.test.ts` pins that the allowance covers that one file and is storage-only. The host panel's scenario S9 asserts storage is never touched there.

## 5. Ownership and Data Exposure on the Backend

**Claims.**
- The host place list is refused for a property the caller does not own, before any new data is read.
- One property's listings never appear in another's response.
- No place coordinate is sent in any response; only a distance in whole metres.
- A hidden place never reaches a guest.

**Checks.** `guestguideiq-app/tests/bdd/places-filters-host.test.ts` (ownership refusal, another property's listing not leaking, no coordinate in the body) and `tests/bdd/places-filters-guest.test.ts` (hidden place absent, no coordinate in the body).

## 6. Untrusted Content

This work renders no new server-supplied HTML. Place names, category names and the new text all render as text. The existing lint ban on raw-HTML rendering still applies and was not relaxed.

## 7. No New Origins

This work adds no third-party script, style or network origin and does not change the Content-Security-Policy or referrer policy. The interactive map, which would have added one, is out of scope.

## How to Run the Local Checks

Backend:

```bash
npx vitest run tests/bdd/places-filters-guest.test.ts tests/bdd/places-filters-host.test.ts
```

Frontend:

```bash
npx vitest run src/places src/guest src/owner src/eslintConfig.test.ts --exclude ".claude/**"
```

## Not Run Locally

The secret scans and the built-output scan run only in CI. There is no automated accessibility check in either repository; the frontend workflow has a placeholder comment where one would go.
