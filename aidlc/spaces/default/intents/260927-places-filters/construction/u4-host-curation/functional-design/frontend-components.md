# Frontend Components: u4-host-curation

Upstream: `functional-spec.md` in this folder, the unit definition (`../../../inception/units-generation/unit-of-work.md`, U4), the requirements (`../../../inception/requirements-analysis/requirements.md`) and the `HostCuration` component in `../../../inception/domain-design/components.md`. Names here describe roles. Final file and component names follow the frontend's naming rule and are settled at build time.

## Component Hierarchy

```
Local recommendations panel (existing; changed)
  Places filter bar (shared with the guest tab's unit by role; built from shared controls)
    Chip row: Open now chip, Host picks chip, Category chip, Filters chip
    Category sheet
    Filter sheet
  Result line (polite live region)
  Category section (shared collapsible header)
    Place picker rows (existing picker; rows unchanged apart from a distance)
      Host place actions (existing)
Onboarding flow (existing; unchanged)
  Place picker (existing; plain, with its existing grouping)
```

## Components

| Component | New or changed | Role | Receives | Holds |
|---|---|---|---|---|
| Local recommendations panel | Changed | Sets the picker's new filtering input. Otherwise unchanged | property id | unchanged |
| Places filter bar | Reused pattern | Shows the offered chips and opens the two sheets | availability, filter state, counts, handlers | which sheet is open; the filter sheet's draft |
| Result line | Reused pattern | Count, left-out notes, "Clear filters" | totals, left-out counts, handlers | nothing |
| Category section | Reused pattern | One collapsible section with name, count and its rows | section data, open or closed, toggle handler | nothing |
| Place picker | Changed | Still loads and holds the place list, picked ids, listings, tips, pending picks and the pick error. Gains one optional input that turns filtering on. With it on, the picker builds place values, holds the filter state and open sections, asks the foundation for the result and renders the bar, line and sections around its existing rows. With it off it renders exactly as today | the existing inputs, plus the new filtering input | the existing state; with filtering on, also filter state and open sections |
| Listing controls | Unchanged | Feature or stop featuring a picked place; notes | unchanged | unchanged |
| Host tips | Unchanged | Tips for a picked place | unchanged | unchanged |
| Host place actions | Unchanged | Edit or delete a place the host added | unchanged | unchanged |

The filter bar, result line and category section are the same pieces the guest tab uses. Whether they are one set of components shared by both screens, or built once in the first screen unit and reused by the second, is settled at build time. Either way they hold no rules: the rules are in the foundation.

## Data Flow

1. The picker loads the place list, the guide's picked ids, the listings and the tips through the API client, as today. Nothing about loading moves to the panel.
2. With filtering on, the picker passes the place list and listings to the foundation's stance function, then builds place values using the mapping in the functional spec's section 3a.
3. It calls the foundation's functions for availability and the result. Filtering sends no request.
4. An action calls the API client as today. When it returns, the picker updates its state as today and the result is recalculated with the current filters.
5. The picker never touches browser storage and never calls the foundation's storage module.
6. With filtering off, as in onboarding, steps 2 and 3 do not run and the picker uses its existing grouping.

## Interaction Notes

- Chip toggles and category ticks apply at once. The filter sheet applies on confirm.
- A row that stops matching after an action leaves the result. Focus moves to the add-or-remove button of the next row, else the previous row, else the section's header button.
- The panel has no control that hides a place. Hidden and offered stances arrive only from the backend.
- The existing bounded race when a host toggles the same place twice quickly is unchanged by this unit.
- There are no new forms. The existing add and edit forms are unchanged.

## API Integration Points

No new call. The panel keeps its three reads and its existing curation writes. From the place list it now also reads `timezone` and, per row, `poiCategory`, `hours`, `priceLevel`, `distanceMeters` and `stance`, as transcribed by the foundation unit. When rows carry a stance, the listings read is still made, because the panel also uses listings for the host's note, rank and feedback counts.

## Accessibility Obligations

- Section headers are level-three headings under the panel's level-two heading.
- Focus is managed when a row leaves the result after the host's own action.
- The open chip, when shown, always reads "Open now".
- No tab set is introduced.
