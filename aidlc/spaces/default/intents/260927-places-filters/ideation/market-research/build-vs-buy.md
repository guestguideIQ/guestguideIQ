# Build vs Buy: Places Filters and Map View

Upstream: this note serves the scope in `../intent-capture/intent-statement.md` (the intent-statement), with the map view added in this stage (market-research-questions.md, Q4, Q6 and Q7).

## Decisions by Capability

| Capability | Decision | Rationale |
|------------|----------|-----------|
| Filters (distance, category, open now, price, host picks) | **Build** in the existing app | It is ordinary UI over data that already exists (opening hours, price level and host curation are stored today). This is where the "host picks first" differentiator lives (Q3) |
| Collapsible categories | **Build** in the existing app | A small accessible disclosure pattern. No vendor is needed |
| Map tiles and map rendering | **Buy**: Google Maps (your leaning, Q7) | Map rendering is commodity infrastructure and not a differentiator. Guests are familiar with Google Maps |
| Place data on the map | **Build**: plot your own curated places and coordinates | Your curated places are the product. The map shows them and does not replace them with the provider's place records |

## Google Maps vs Alternatives

| Factor | Google Maps (chosen leaning) | Mapbox | MapLibre + open tiles |
|--------|------------------------------|--------|-----------------------|
| Guest familiarity | High | Medium | Medium |
| Cost model | Usage-billed per map load. Hypothesis: a monthly free allowance exists. Check current pricing before committing | Usage-billed | No per-view charge from the library. Tile hosting is still needed |
| Key handling | Browser key restricted by domain | Public token restricted by URL | Depends on the tile host |
| Lock-in | Medium | Medium | Low |
| Styling to the guide's look | Adequate | Strong | Strong |

## Risks Carried Forward

- **Cost exposure**: map loads are billed. Scope definition or requirements should set a budget cap and quota alerts.
- **Key abuse**: a leaked browser key can be used from other sites unless it is restricted by domain and API. This is a setup requirement, not something that can be kept hidden.
- **Provider terms**: attribution and limits on storing data. Confirm these at domain design.
- **Plan size**: the map view is the second addition beyond the lighter plan. You chose to keep the lighter plan and handle the map inside the remaining steps (Q8), so feasibility and refined mockups stay skipped.

## Assumptions & Open Questions

- Hypothesis: Google Maps has a free monthly usage allowance that covers a small guest base. Check this against current Google pricing before choosing.
- Open: whether the host panel also gets the map, or only the guest Places tab. Settle this at scope definition.
