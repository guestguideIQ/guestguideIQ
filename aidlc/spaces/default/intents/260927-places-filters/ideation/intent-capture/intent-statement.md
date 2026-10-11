# Intent Statement: Places Page Filters and Collapsible Categories

## Problem Statement

The places page should let people filter places by geographic distance, by category and by other attributes, and its categories should be collapsible. [desc]

The list of places is long and hard to scan even with category headings, and people cannot tell which places are close. [Q2]

The change applies to two screens: the guest Places tab in the stay guide and the host's area/places curation panel. [Q1]

## Target Customer

Guests reading the Places tab of their stay guide, who need to find a relevant place without scrolling a long list. [Q1] [Q2]

Hosts curating places in the area/places panel, who face the same long, hard-to-scan list. [Q1] [Q2]

## Scope of the Change

Distance is measured from the property or stay address, not from the guest's device location. [Q3]

The filters in this piece of work are distance and category, plus open now / opening hours, price level, and host picks / featured only. [desc] [Q4] [Q10]

A rating filter is out of this piece of work. It is recorded as a later idea because places hold no rating data today. [Q10]

Categories on the page become collapsible. [desc]

Filter and collapsible-list patterns are researched in Mobbin, and the chosen references are cited in the mockup steps. [desc] [Q8]

## Success Metrics

No success measure is defined yet. Neither a qualitative check nor a tracked usage signal was chosen. [Q5]

## Initiative Trigger

Your own product judgment after shipping the category grouping, rather than external feedback or competing products. [Q6]

## Initial Scope Signal

| Signal | Value | Source |
|--------|-------|--------|
| Workflow-selected scope | `feature` (workflow-selected) | [scope] |
| User-confirmed product boundary | Smaller than a full feature plan: a focused UI change that wants a lighter workflow | [Q9] |

## Assumptions & Open Questions

None.

## Review

**Verdict:** READY
**Reviewer:** aidlc-product-lead-agent
**Date:** 2026-09-27T21:53:11Z
**Iteration:** 1

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Minor | aidlc/spaces/default/intents/260927-places-filters/ideation/intent-capture/intent-capture-questions.md > Q9 | Q9 ("This work was set up as a full 'feature' plan. Does that match the size you have in mind?") has options A/B/C/X but no explicit `Not yet defined` / `None` / `Not identified` / `Not applicable` option, which the stage definition's Step 2 requires on every question "as appropriate." The human did answer definitively (B), so this had no practical downstream effect on the artifacts. | Note the gap for the next intent-capture run; no rework needed on this artifact since the question was answered. | New |

### Summary

Every substantive claim in `intent-statement.md` and `stakeholder-map.md` carries a source tag that the cited source (`[desc]`, `[Q<n>]`, `[scope]`) actually supports, no unselected Q4 option (rating) was smuggled in as a requirement — it is explicitly recorded as dropped via `[Q10]` — and no stakeholder, authority, or communication requirement is invented in the stakeholder map. All six required sections are present, both artifacts are free of implementation detail and readable by a non-technical stakeholder, and the `Initial Scope Signal` table correctly separates the workflow-selected scope from the user's stated preference for a lighter plan. The only gap found is a minor stage-protocol miss (Q9's missing neutral option) with no material effect on this artifact's readiness.
