# Frontend Components: u3-guest-places

Upstream: `functional-spec.md` in this folder, the unit definition (`../../../inception/units-generation/unit-of-work.md`, U3), the requirements (`../../../inception/requirements-analysis/requirements.md`) and the `GuestPlaces` component in `../../../inception/domain-design/components.md`. Names here describe roles. Final file and component names follow the frontend's naming rule (a file is named after what it exports) and are settled at build time.

## Component Hierarchy

```
Guide view (existing; owns the selected day)
  Guide tabs (existing; the only tab set)
    Places panel (changed)
      Places filter bar (new)
        Chip row (shared control)
          Open chip, Host picks chip, Category chip, Filters chip (shared control)
        Category sheet (shared sheet + checkbox group)
        Filter sheet (shared sheet + radio groups + checkbox group)
      Result line (new; polite live region)
      Category section (new wrapper; shared collapsible header)
        Place card (existing; gains distance and "Host pick")
```

## Components

| Component | New or changed | Role | Receives | Holds |
|---|---|---|---|---|
| Guide view | Changed | Already holds the selected day. Now also holds the filter state and open sections, reads remembered choices once and writes them after changes | the stay view | selected day (existing); filter state; open sections |
| Places panel | Changed | Composes the tab. Builds place values, asks the foundation for the result, renders bar, line and sections | places, selected day when the day rail is shown, timezone, filter state, open sections, change handlers | nothing that must survive a tab switch |
| Places filter bar | New | Shows the chips the foundation says can be offered and opens the two sheets | availability, filter state, open mode and label, counts, change handlers | which sheet is open; the filter sheet's draft |
| Result line | New | Shows the count, left-out notes with "Show them" / "Hide them", and "Clear filters" | result totals, left-out counts, include-unknown choices, handlers | nothing |
| Category section | New | One collapsible section: header with name and count, and its cards when open | section data, open or closed, toggle handler | nothing |
| Place card | Changed | Shows a place. Gains a distance in its practical details and a "Host pick" label | the place, its formatted distance, whether it is a host pick | unchanged |

The filter state and the open sections live in the guide view, not in the Places panel. The tab set shows only the active tab's panel, so state held inside the panel would be lost on a tab switch. The bar, line and sections are told what to show and report what the guest did. Only the filter sheet's draft and which sheet is open are held lower down, and losing those on a tab switch is harmless.

## Data Flow

1. The guide view passes the places, the selected day (only when the day rail is shown), the filter state, the open sections, and `property.timezone` from the stay view.
2. The Places panel builds the foundation's inputs, using the mapping in the functional spec's section 3a, and calls the foundation's functions. It calls nothing on the network.
3. The guide view reads remembered choices once, when it first has places, and writes after each change, through the foundation's storage module. No component touches browser storage itself.
4. The Places tab's own grouping module is retired. Grouping comes from the foundation.

## Interaction Notes

- Chip toggles and category ticks apply at once. The filter sheet applies on confirm.
- A day-rail change updates the open chip's label and the result. It does not reset any filter.
- Opening or closing a section never changes the filters, and changing filters never opens or closes a section.
- There are no forms and no validation in this unit. Every control is a toggle or a choice.

## API Integration Points

None of its own. The panel uses the stay view the guest surface already loads. The new fields it reads are each place's `distanceMeters` and `property.timezone`, as transcribed by the foundation unit.

## Accessibility Obligations

- Section headers are level-three headings containing the shared header button, which reports open or closed and includes the count in its name. Card names inside a section are level-four headings; in the flat list they stay at level three.
- The chip row, the result-line actions and the section headers are reachable in that order by keyboard.
- "Host pick" is text. The dimmed state of an emptied section is not the only signal: the header reads "0 places".
- No second tab set is introduced.
