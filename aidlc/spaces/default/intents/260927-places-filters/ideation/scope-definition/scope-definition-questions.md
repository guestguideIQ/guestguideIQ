# Scope Definition & Prioritization — Questions

Context: the intent statement (`../intent-capture/intent-statement.md`) sets filters by distance from the property, category, open now, price level and host picks, plus collapsible categories, on the guest Places tab and the host's area/places panel. Market research (`../market-research/`) added a map view using Google Maps and kept the lighter plan. There is no feasibility assessment, because that step was skipped in the lighter plan. These questions set the in/out boundary and the order of work.

## Q1. Which screens get the map view?

Market research left this open. The host panel is where places are curated. The guest Places tab is where they are browsed.

A. Guest Places tab only
B. Both the guest Places tab and the host panel
C. Host panel only
D. Not yet defined
X. Other (please specify)

[Answer]: A. Guest Places tab only

## Q2. Does the host panel get the same filters as the guest tab?

Hosts curate rather than browse, so they may need fewer filters, or different ones.

A. Same filters as the guest tab (distance, category, open now, price, host picks) plus collapsible categories
B. Only category, host picks and collapsible categories (no distance, open now or price)
C. Only collapsible categories; filters are for guests
D. Not yet defined
X. Other (please specify)

[Answer]: A. Same filters as the guest tab (distance, category, open now, price, host picks) plus collapsible categories

## Q3. What is the must-have core for the first release of this work?

The rest becomes should-have: it is built in this work if time allows, or shipped soon after.

A. Everything is must-have: all five filters, collapsible categories and the map view
B. Filters and collapsible categories are must-have; the map view is should-have
C. Distance, category and collapsible categories are must-have; open now, price, host picks and the map view are should-have
D. Not yet defined
X. Other (please specify)

[Answer]: B. Filters and collapsible categories are must-have; the map view is should-have

## Q4. In what order should the pieces be built?

A. Value-first: collapsible categories and distance first, then the other filters, then the map
B. Risk-first: the map view first, since it is the only new third-party dependency, then filters
C. Dependency-first: whatever the design shows the others depend on, such as distance calculation and place coordinates
D. No preference
X. Other (please specify)

[Answer]: A. Value-first: collapsible categories and distance first, then the other filters, then the map

## Q5. Is there a deadline for any of this?

A. No deadline
B. Yes, a specific date (please give it)
C. Not yet defined
X. Other (please specify)

[Answer]: A. No deadline

## Q6. How should map usage costs be capped?

Google Maps bills by usage. Market research flagged cost exposure and key abuse as risks.

A. Set a monthly budget cap with quota alerts (please give an amount)
B. Rely on the free allowance and add a billing alert only
C. Not yet defined: decide at domain design
X. Other (please specify)

[Answer]: B. Rely on the free allowance and add a billing alert only

## Q7. Follow-up: given the cost model, which map provider should this work use?

You asked for a Google Maps vs Mapbox cost model before confirming. These are list prices checked on 2026-09-27:

- **Google Maps Dynamic Maps:** 10,000 free loads a month, then $7.00 per 1,000 up to 100k and $5.60 per 1,000 from 100k to 500k.
- **Mapbox GL JS:** 50,000 free loads a month, then $5.00 per 1,000 from 50k to 100k, $4.00 from 100k to 200k and $3.00 from 200k to 1M.

Modelled monthly cost at 25k / 50k / 100k / 250k loads:

- **Google:** about $105 / $280 / $630 / $1,470.
- **Mapbox:** $0 / $0 / $250 / $800.

At an on-demand volume of about 2,000 loads a month, both are free. Places already store coordinates, so no geocoding cost applies.

Sources: https://developers.google.com/maps/billing-and-pricing/pricing and https://www.mapbox.com/pricing

A. Keep Google Maps (the market research leaning): guest familiarity outweighs the smaller free allowance
B. Switch to Mapbox: five times the free headroom, and roughly half the price above it
C. Decide at domain design, with this model as input
X. Other (please specify)

[Answer]: A. Keep Google Maps (the market research leaning): guest familiarity outweighs the smaller free allowance

## Consolidated Summary Confirmation

- The map view goes on the guest Places tab only (Q1)
- The host panel gets the same filters as the guest tab (distance, category, open now, price, host picks) plus collapsible categories (Q2)
- Must-have: the five filters and collapsible categories. Should-have: the map view (Q3)
- Build order is value-first: collapsible categories and distance, then the other filters, then the map (Q4)
- No deadline (Q5)
- Map cost control: rely on the free allowance and add a billing alert only (Q6)
- Map provider: keep Google Maps after the cost model; both providers are free at the expected on-demand volume, and Google starts charging above 10,000 loads a month (Q7)
- Out of this work: the rating filter, recorded as a later idea (intent capture Q10)

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
