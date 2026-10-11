# API Documentation — `guestguideiq-app`

**Derived from** two passes:
- The **focused scan of 2026-09-30** at `ce69629`. It re-derived every endpoint under `src/poi/`, `src/guide/`, `src/guestcontext/`, `src/locality/` and `src/guestaccess/`, plus the skimmed `PATCH /v1/properties/:id` coordinate rule.
- The **prior full scan** at `76d190d`, preserved for the other surfaces and marked *(carried forward, not re-verified)*.

> There is **no OpenAPI, Swagger or JSON Schema document**. Since the prior scan, `docs/frontend-contract-delta.md` has become the hand-kept contract note (skimmed at `ce69629`). This file and that document together are the most complete contract available.

---

## Surfaces *(carried forward from `76d190d`, not re-verified)*

| Surface | Process | Reachable by a browser frontend? |
|---|---|---|
| **A: u1 public API** | `src/app.ts`, `PORT` (default 3000) | Yes |
| **B: u1 internal API** | `src/internalApp.ts`, loopback `INTERNAL_PORT` (default 3001) | No |
| **C: u2 admin API** | `admin-api/src/app.ts`, `PORT` (default 4000) | No |

All three share one error envelope, `{ error: { code, message, details? } }`.

---

# Surface A: u1 public API

## Places on the Wire: what intent `260927-places-filters` can rely on (verified at `ce69629`)

This is the summary for the Places filters. The endpoint detail follows in A.4, A.5, A.7 and A.11.

| Datum | Guest `GET /v1/stays/:token` | Owner `GET /v1/pois?propertyId=` | Owner `GET /v1/properties/:id/listings` |
|---|---|---|---|
| Place coordinates | **Absent**. `toGuestPOI` drops them (`src/guide/service.ts:231-254`) | **Absent** | Absent |
| Distance from property | **Absent**. No endpoint computes it | **Absent** | Absent |
| Property coordinates | `property.geo: { latitude, longitude } \| null` | n/a | n/a |
| Timezone | **Absent** | Absent | Absent. Only `GET /v1/properties/:id/area` has `area.timezone` |
| Category | `category` (legacy text), `categoryId`, `poiCategory \| null` | `category` (legacy text) only | n/a |
| Opening hours | `hours: GuestHours \| null`, limited to the stay window | **Absent** | Absent |
| Price | `profile.priceLevel: number \| null` | **Absent** | Absent |
| Host curation | `stance: 'featured' \| 'listed'`, `recommended: boolean`, `hostNote` | `hostAdded` only | `stance`, `hostNote`, `rank`, `feedback` |
| Order | Pre-sorted: featured, then `rank`, then pick order | Unordered locality list | By listing |
| Query parameters for filtering or sorting | **None** | **None** (only `propertyId`) | None |

**Price-level scale conflict (TD-22).** The schema CHECK allows **0–4**, where 0 means free (`schema.prisma:1086, 1091-1092`). The guest type comment says **1–4** (`src/guestcontext/service.ts:101`), and so does `docs/frontend-contract-delta.md:208`. A client must handle `0`. The deprecated `POI.isFree` flag and the `PlaceFeature` `free_entry` feature overlap with it.

**Unrouted distance code.** `POIService.nearby` and `nearProperty` (`src/poi/service.ts:97-99, 178-200, 257-261`) are tested, but no route calls them. They take a radius of up to 200 km and a limit of 100 by default and 500 at most, and sort nearest first. `nearProperty` returns `located:false` when the property has no coordinates.

---

## A.1 Health, A.2 Identity, A.3 Onboarding *(carried forward from `76d190d`, not re-verified)*

At `76d190d` the surface was:
- `GET /health` and `GET /health/ready`;
- `POST /v1/accounts`, `POST /v1/auth/login`, `POST /v1/auth/reset/request`, `POST /v1/auth/reset/confirm` and `POST /v1/auth/refresh`, using a 15-minute access token and a 7-day rotating refresh token;
- the four-step onboarding machine under `/v1/onboarding/*`.

The prior scan recorded these gaps: no current-user endpoint, no logout, reset tokens discarded, and no server-side PDF parsing. None of it was re-read at `ce69629`. The owner stay routes now take an explicit `propertyId` because accounts can own several properties, so claims such as "the JWT carries the one `propertyId`" should be treated as possibly stale.

## A.4 Property Guide: `src/guide/routes.ts` (verified at `ce69629` for the parts listed)

- `GET /v1/guides/:id` returns the owner guide view, including `favoritedPOIIds` (`guide/routes.ts:22-29`). The owner view keeps the **full** favourite set, including places a stance now hides from guests (`src/guide/service.ts:134-144`).
- `POST /v1/guides/:id/favorites` and `DELETE /v1/guides/:id/favorites/...` pick or unpick a place (`guide/routes.ts:65-96`). **A pick also writes a `PropertyListing` row with stance `featured`** (`src/guestcontext/service.ts:822-836`), so the legacy favourite and the listing stay in step.
- The prior scan documented section editing (a full replace), publish and unpublish. They are carried forward and were not re-verified.

## A.5 Curated catalogue: `GET /v1/pois` (verified at `ce69629`)

| Method | Path | Response |
|---|---|---|
| GET | `/v1/pois?propertyId=` | `200 { items: [{ id, name, description, category, localityIds, address, hostAdded }], ... }` |

- The items are projected at `src/poi/service.ts:219-227`, and `hostAdded` is added at `src/poi/routes.ts:185-189`. **There are no coordinates, `categoryId`, hours, price or stance.**
- The owner's picker needs stance, so it must also call `GET /v1/properties/:id/listings` and **join by id on the client**.
- The response is unpaginated and has no filter or sort parameters (`src/poi/repository.ts:166-171`).
- **Latent bug (TD-26).** `browseByLocality` calls `listByLocality`, which filters `status: 'published'`. The interface comment (`:116-123`) says the owner list "stays unfiltered" so that hosts can see suppressed rows. The code and the comment disagree.
- The prior scan's `GET /v1/events` shape is carried forward and was not re-verified.

## A.6 Subscription *(carried forward from `76d190d`, not re-verified)*

At `76d190d`:
- `POST /v1/subscriptions` and `PATCH /v1/subscriptions { action }` existed.
- The PATCH **cancelled on any unrecognised action**.
- There was no `GET /v1/subscriptions`.

## A.7 Guest access: `src/guestaccess/routes.ts` (verified at `ce69629`)

Guest routes take **no JWT**. Authentication is the opaque `:token` path segment plus a `Host`-derived locality check (BR8.1–BR8.3). Every failure returns the same `410 LINK_INVALID`.

| Method | Path | Notes |
|---|---|---|
| GET | `/v1/stays/:token` | The guest's only read. It has no query parameters. |
| POST | `/v1/stays/:token/feedback` | Place or event feedback (`src/guestcontext/routes.ts:144-150`). Not in the intent's scope. |
| POST | `/v1/stays/:token/chat` | *Carried forward from `76d190d`, not re-verified.* |

`GET /v1/stays/:token` returns `200` with this body (`src/guestaccess/routes.ts:188-298`):

```ts
{
  stay: { checkIn: string /* YYYY-MM-DD */; checkOut: string; guestName: string | null };
  // expiresAt deliberately withheld from the guest
  property: {
    id: string; name: string; address: string | null;
    geo: { latitude: number; longitude: number } | null;   // property only, not places
    checkInTime: string | null; checkOutTime: string | null;
    wifi: { network: string; password: string | null } | null;
    rules: { petsAllowed; smokingAllowed; partiesAllowed; quietHours: { start; end } | null };
    host: { name: string | null; email: string | null } | null;
  };
  locality: { id; name; tagline; visualStyling: Record<string, unknown> | null };
  guide: {
    propertyId: string;
    sections: { title: string; body: string }[] | null;
    notYetPublished: boolean;
    favoritedPOIIds: string[];        // only ids that resolved; withheld places leave no trace
    favoritedEventIds: string[];
    favoritedPOIs: GuestPlace[];      // the Places tab
    favoritedEvents: GuestEvent[];
    stayEvents: GuestEvent[];         // events during this stay, soonest first
    area: GuestArea | null;
    advisories: GuestAdvisory[];
    itinerary: GuestItinerary | null;
  };
}
```

`GuestPlace` is `GuestPOIView` (`src/guide/service.ts:29-73`) extended in `src/guestcontext/service.ts:81-114`:

```ts
{
  id; name; description;
  category: string;                    // legacy free text
  categoryId: string | null;
  poiCategory: { id; category; subcategory; slug; icon; sortOrder; imageUrl } | null; // null => "Other"
  types: string[]; activities: string[];
  placeGroup: 'essentials' | 'explore' | 'shopping' | null;
  tier: 'classic' | 'local_favorite' | 'hidden_gem' | null;
  neighborhood: string | null; address: string | null;
  isFree: boolean | null;              // deprecated; overlaps priceLevel 0
  admission; localNote; lastOrders; statusNote: string | null;
  attribution: string | null; sourceUrl: string | null;   // map attribution must keep this
  hostAdded: boolean;
  recommended: boolean;                // LEGACY HostNote stance
  stance: 'featured' | 'listed';       // PropertyListing stance; hidden/offered never sent
  hostNote: string | null;
  hours: {
    days: { dayOfWeek: number /* 0=Sun */; closed: boolean;
            spans: { opens: string /* HH:MM */; closes: string; closesNextDay: boolean }[] }[];
    seasonal: boolean;
  } | null;                            // omitted day = unknown, not closed
  features: { feature; label; value: 'yes' | 'limited' | 'no'; detail }[];
  fit: { facet: 'theme' | 'audience'; key; label; score; note }[];
  profile: { setting; priceLevel: number | null /* see scale conflict */; typicalMinutes; effort } | null;
  tips; media; advisoryIds: string[]; myFeedback: FeedbackSignal | null;
  // NO latitude, longitude, distance or timezone
}
```

These rules apply to the guest payload:
- **Hours semantics.** `hoursOf` (`src/guestcontext/service.ts:505-529`) keeps rules whose validity window **touches the stay**, not today, and sets `seasonal` when any rule is windowed. "Open now" or "open on day X" needs per-date evaluation that handles `closesNextDay`, several spans, `closed` and validity windows. That evaluation exists nowhere today.
- **Order.** The server returns places in `featured`, then `rank`, then pick order. A favourite with no listing row counts as `featured` (`src/guestcontext/service.ts:416-422, 531-540`).
- **Host picks.** Every place in this list is already a host choice (`featured` or `listed`). `recommended` is a second, legacy signal.

## A.9 Owner stay links: `src/guestaccess/routes.ts` (verified at `ce69629`)

**This supersedes the prior scan's "no endpoint creates a `Stay`".** Every route is bearer-authenticated and checks ownership through the property.

| Method | Path | Body or query | Response |
|---|---|---|---|
| POST | `/v1/stays` | `{ propertyId (required), checkIn, checkOut, guestName? }` | `201` with the stay view and shareable link. Returns `400` for a missing `propertyId`, a bad date, or `checkOut` before `checkIn`. `guestName` has a maximum length of 120. |
| GET | `/v1/stays?propertyId=` | `propertyId` required | `200 { items }`, newest first |
| PATCH | `/v1/stays/:stayId` | any of `checkIn`, `checkOut`, `guestName` | `200`. A body naming no known field returns `400`. |
| DELETE | `/v1/stays/:stayId` | — | `204` |

- The routes are keyed by **stay id, never by token**.
- A missing stay and someone else's stay both return the same refusal.

## A.10 Owner place curation and area: `src/guestcontext/routes.ts` (verified at `ce69629`)

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/v1/properties/:id/listings` | — | `200 [{ kind: 'place' \| 'event', id, stance, hostNote, rank, feedback: { up, down, saved } }]` (`service.ts:185-193`) |
| PATCH | `/v1/properties/:id/listings/places/:itemId` and `/v1/properties/:id/listings/events/:itemId` | `{ stance?, hostNote? }` | Sets the stance (`offered \| featured \| listed \| hidden`) and the note. Validation is at `service.ts:761-820`. |
| POST | `/v1/properties/:id/places` | `{ name, description, category, address }` | Adds a host place. **It takes no coordinates.** `category` is from the closed host vocabulary (`hostContent.ts:28-37`). |
| PATCH | `/v1/properties/:id/places/:placeId` | same fields | Edits a host place |
| DELETE | `/v1/properties/:id/places/:placeId` | — | Removes a host place |
| GET | `/v1/properties/:id/area` | — | `200 { area: { name, kind, stateCode, timezone } \| null, themes, audiences, notes, advisories }` (`service.ts:693-740`). **This is the only response that carries a timezone.** |

Host-added places cannot carry coordinates. Their category labels (`food`, `outdoors`, and so on) will probably not match `poi_categories` top-level names, so they would resolve to `poiCategory: null`, which displays as "Other". That is inferred from `poiCategories.ts:243-246` and is not tested.

## A.11 Property coordinates and public locality (verified or skimmed at `ce69629`)

- **`PATCH /v1/properties/:id`** sets the property `latitude`/`longitude`. Both must be set or cleared together (`src/onboarding/propertyDetails.ts:148-195`, skimmed, and `docs/frontend-contract-delta.md:135-136`). This is the only product path that writes a coordinate. **No product path writes a place coordinate.**
- **`GET /v1/localities/current`** (public, `src/locality/routes.ts:21-38`) **deliberately omits `timezone`** (`:29-31`).

## A.12 Lead capture, CORS and rate limits *(carried forward from `76d190d`, not re-verified)*

At `76d190d`:
- CORS allowed only `https://guestguideiq.com` in production, allowed none in `dev` and `staging`, and had `credentials` off.
- Rate limits were in-memory per process: 20/min per IP on `GET /v1/stays/:token` and 10/min per stay token on chat. An architect grep at `ce69629` found that the `GET /v1/stays/` path-matching rule is still present at `src/app.ts:206`.
- The three `POST /v1/leads/*` endpoints were unauthenticated.

The team's backend follow-up (the `ALLOWED_ORIGINS` fix) may have changed CORS since. Re-verify before relying on it.

## A.13 Endpoint gap summary

| Wanted | Status at `ce69629` |
|---|---|
| Create or list a guest stay link | **Present** (A.9) |
| Guest resolution of favourited places | **Present** (A.7) |
| Place coordinates to the guest (map, distance) | **Missing** |
| Server-computed distance or nearby search | **Implemented, unrouted** |
| Timezone or `openNow` for the guest | **Missing** |
| Price, hours or `categoryId` in the owner catalogue | **Missing** (A.5) |
| Filtering, sorting or pagination on any list | **Missing** |
| Coordinates on host-added places | **Missing** (A.10) |
| Machine-readable contract | **Missing**; only the hand-kept `docs/frontend-contract-delta.md` exists |
| `GET /v1/subscriptions`, current user, logout, chat history | Missing at `76d190d` *(carried forward, not re-verified)* |

---

# Surface B: u1 internal API, and Surface C: u2 admin API *(carried forward from `76d190d`, not re-verified)*

At `76d190d`:
- The internal API served `/v1/internal/pois`, `/events`, `/accounts/:id`, `/localities` and `/localities/:id/domains`, protected by an internal service JWT on loopback.
- u2 re-exposed these under an ops-role JWT, with Fastify JSON body schemas.

At `ce69629` the developer skimmed `admin-api/src/` at directory level and confirmed that **its `poi/routes.ts` does not handle coordinates, hours or price**. The ops path is therefore not a producer for the intent's missing data either.
