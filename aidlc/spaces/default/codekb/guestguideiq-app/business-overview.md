# Business Overview — `guestguideiq-app`

**Repo**: `guestguideiq-app`, the sibling of `aidlc/` at the workspace root.

**Derived from** two passes:
- The **focused scan of 2026-09-30** at `ce69629` (intent `260927-places-filters`). It covered places, curation, the guest stay payload and the data model.
- The **prior full scan of 2026-09-07** at `76d190d` (intent `260907-frontend-app`), preserved where the focused scan did not reach.

Sections marked *(carried forward from `76d190d`, not re-verified)* may be out of date. See `reverse-engineering-timestamp.md` for the exact split.

---

## Business Domain

GuestGuideIQ is a **white-label digital guest-guide SaaS for short-term rental property owners**. The owner-side flow is:
1. A Property Owner signs up and onboards a Property.
2. They curate a guide: written sections plus places chosen from the locality's catalogue, or places they add themselves.
3. They publish the guide.
4. They issue a stay-scoped link to each guest.

The guest opens the link without an account. They see the published guide, including a **Places** tab of the host's picks, an **Events** tab of what is on during their stay, and area context.

The system is **multi-tenant by locality brand**. A locality brand is a geographic or branding tenant, such as a town or a destination marketing organisation. It owns curated local content (places and events) and supplies the visual styling of the guest experience.
- A Property belongs to one locality brand.
- The guest's tenant is resolved from the request's own `Host` header.
- An account may now own **several properties**: owner routes take an explicit `propertyId` and check ownership (`src/guestaccess/routes.ts:61-66`).

## Actors

| Actor | Authenticates with | Reaches |
|---|---|---|
| **Property Owner** | Username + password → bearer access + rotating refresh token *(token details carried forward, not re-verified)* | Owner routes: guide, place curation, stays, property details |
| **Guest** | No account. An opaque **stay token** in the URL path, plus a matching `Host` | `GET /v1/stays/:token`, `POST /v1/stays/:token/feedback`, `POST /v1/stays/:token/chat` |
| **Marketing-site visitor** | None | `POST /v1/leads/*` *(carried forward)* |
| **Ops operator** | An ops-role JWT | u2 admin API *(carried forward)* |

## Key Functionality

1. **Account creation and authentication** *(carried forward, not re-verified)*.
2. **Onboarding** *(carried forward, not re-verified)*. The developer skimmed `src/onboarding/propertyDetails.ts`, which now also sets property details. These include the property's `latitude`/`longitude`, which must be set or cleared together.
3. **Property guide authoring.** The guide holds written sections plus the host's **place picks**. A pick dual-writes a `PropertyListing` row with stance `featured`.
4. **Place curation (host).**
   - The host browses the locality catalogue (`GET /v1/pois?propertyId=`).
   - They set each place's **stance**: `offered`, `featured`, `listed` or `hidden`.
   - They can add a note in their own voice.
   - They can add **their own places**, which are not in the platform catalogue.
   - They can see guest feedback counts per place.
5. **Stay links (host).** The host creates, lists, corrects and revokes guest stays (`POST`, `GET`, `PATCH` and `DELETE /v1/stays`). This supply side did not exist at the prior scan.
6. **Guest stay experience.** One read, `GET /v1/stays/:token`, returns everything:
   - the stay window and guest name;
   - property arrival facts, including the property's own coordinates as `property.geo`;
   - locality branding;
   - the published guide: sections, **fully resolved places with hours, price profile, category, features, fit, tips and media**, the events during the stay, the area, advisories and the itinerary.
   The guest can send up/down/saved feedback on a place.
7. **Subscription, lead capture, chat and the ops back office** *(carried forward, not re-verified)*.

## The Places Domain (primary focus of intent `260927-places-filters`)

Guests should be able to filter and sort the host's places by category, distance, "open now", price and host picks, and see them on a map. The schema **models every one of those attributes**. The API and the production data **do not yet deliver them**:

| Filter the intent wants | Modelled in the schema | Delivered to the guest today | Populated in production content |
|---|---|---|---|
| Category | Yes: `PoiCategory` taxonomy plus legacy text | Yes: `poiCategory` and `categoryId` | Category level only, through legacy text. Host-added places fall to "Other" (an inference, not tested). |
| Distance / map | Yes: `POI.latitude` and `POI.longitude` | **No.** No place coordinates and no distance are sent. `property.geo` is sent. | **No.** 0 of the 24 places defined in the repository have coordinates, and host-added places cannot have any. |
| Open now / open on a day | Yes: `PlaceHours`, including `closesNextDay` | Yes: `hours` by weekday. **No timezone is sent.** | **No.** Nothing in the product writes hours, and the Sedona content says so explicitly. |
| Price | Yes: `PlaceProfile.priceLevel` | Yes: `profile.priceLevel` | **No.** Nothing in the product writes it. The scale is documented two ways, 0–4 and 1–4. |
| Host picks | Yes: `PropertyListing.stance` | Yes: `stance` `featured`/`listed`, plus the legacy `recommended` | Yes, but every guest-visible place is already a host choice. |

**Business consequence.** Distance, map, open-now and price filters would render **empty or all-unknown** against today's production content. This holds until a producer exists: ingest, geocoding or host entry. The backend must also expose the missing fields: place coordinates or distance, and a timezone or a server-computed `openNow`. The live production counts are **unknown** and need a database query before requirements are fixed. Detail is in `api-documentation.md` § Places on the Wire and in `code-quality-assessment.md` TD-20 to TD-27.

## Business Rules Visible in the Code

- **BR8.3**: a guest stay link is honoured only when the request's resolved locality equals the property's locality. Every failure returns the same `410 LINK_INVALID`. This is verified at `ce69629` in the analyzed `src/guestaccess/` path.
- **BR4.1**: the guest read only ever returns **published** guide content.
- **Stance visibility**:
  - `hidden` and `offered` places never reach a guest.
  - `featured` places sort before `listed` ones, then by `rank`, then by pick order.
  - A favourite with no listing row counts as `featured` (`src/guestcontext/service.ts:416-422, 531-540`).
- **The guest never learns a place was withheld.** The guest guide's id arrays list only what resolved. The owner view keeps the full favourite set (`src/guide/service.ts:134-144`).
- **"Not stated" is never defaulted**:
  - A missing hours row means *unknown*, not *closed*.
  - A missing price means unknown.
  - A missing check-in time means "say nothing".
  These rules are stated in the type comments of `GuestPOIView`, `GuestHours` and the stay handler.
- **Stay expiry and "today"** are resolved in the locality's timezone, then the property's, then UTC (`src/guestaccess/repository.ts:130`).
- **BR9.2**: one domain maps to at most one locality brand *(carried forward)*.
- Username uniqueness is case-insensitive. Login failures are indistinguishable, and a password-reset request always returns `202` *(carried forward, not re-verified)*.

## Capabilities Specified but Not Operational

| Capability | Status |
|---|---|
| Issuing a guest stay link | **Now operational** (`POST /v1/stays`, `src/guestaccess/routes.ts:53`). This supersedes the prior scan's "absent". |
| Guest resolving favourited places | **Now operational.** The guest payload carries full `GuestPlace` objects. This supersedes the prior scan's "not resolvable". |
| Place distance, "nearby" search | **Implemented but unrouted.** `POIService.nearby` and `nearProperty` are tested, but no route calls them. |
| Place coordinates, hours and price in production | **Schema only.** No product write path exists; only dev seed data populates them. |
| Itinerary chat | Non-functional at `76d190d` *(carried forward, not re-verified)* |
| Password-reset delivery | Non-functional at `76d190d` *(carried forward, not re-verified)* |
| Reading subscription state | Absent at `76d190d` *(carried forward, not re-verified)* |

## Value Proposition Implied by the Design

The differentiator is the **locality layer**. Owners inherit a curated local catalogue that professionals maintain, then add their own voice: picks, stances, notes and their own places. The design leans hard on **honest absence**: it never shows a default where a fact is unknown. Any filter UI built on this data has to preserve that. A place with unknown hours is neither "open" nor "closed", and a place with unknown price is neither cheap nor expensive.
