---
name: analytics-board-report
description: Use when updating the Locke prototype's Analytics charts or the printable quarterly board report. Covers the four series, the rule that a chart must answer a question a board asks, the report structure, and print behavior. Triggers include "update analytics", "the charts", "board report", "quarterly report", "add a chart", "print to PDF".
---

# Analytics and the board report

Owns `LW.analytics` and `LW.report` in `data-phase3.js`. Charts render as inline SVG from `barChart()` in `app.js`, using theme tokens so they work in both themes and in print.

## The four series

```js
LW.analytics = {
  tracked:   { label: 'Items tracked', points: [{ k: 'Apr', v: 9 }, ...] },
  exposure:  { label: 'High-exposure items by jurisdiction', points: [...] },
  deadlines: { label: 'Dated obligations by month', points: [...] },
  pipeline:  { label: 'Contracting pipeline', points: [...] }
}
```

Each exists because a board asks that question:

| Series | Question it answers |
|---|---|
| tracked | Is the firm's coverage growing with our exposure? |
| exposure | Where is our risk concentrated? |
| deadlines | What does the next two quarters demand of us? |
| pipeline | Is any of this turning into revenue? |

Do not add a fifth chart because the data exists. A chart that answers no question is decoration, and on this screen decoration reads as padding.

## Keeping the numbers honest

Series values should reconcile with the rest of the prototype. If the tracker holds 35 items, the last point in `tracked` is 35. If three obligations are dated in October, the October bar is 3. A reader who counts will count, and a mismatch costs more credibility than the chart earns.

When the underlying data changes, update these series in the same pass.

## The board report

```js
LW.report = {
  period: 'Q3 2026', prepared: '2026-09-15', signer: 'kevin',
  summary: '...',             // one paragraph, the whole quarter in four sentences
  sections: [ { h: 'What moved', items: ['...cited...'] }, ... ]
}
```

Four sections, in this order:

1. **What moved.** The outside world. Every item cited.
2. **What Locke did.** The firm's own work. No citations, because this is internal record.
3. **The one risk worth board attention.** Exactly one. A report that lists five risks has not done the prioritization the board is paying for.
4. **Next quarter.** Three commitments, each specific enough to be graded next quarter.

The summary paragraph leads with the consequence and names the single thing that threatens the business. If nothing does, say that plainly, then name the constraint that does.

## Print

The report prints through `@media print`, which forces a paper palette, drops the sidebar, ticker, gutter numbers and action buttons, and unboxes the report. Before shipping a change, print-preview it once: a board report that prints as dark grey blocks is the kind of detail that undoes an otherwise careful deliverable.

## Quality bar

- The signer is the person who would actually stand behind it.
- Every claim in "What moved" carries a citation.
- Section 3 has exactly one risk.
- Numbers in the prose match the charts and the trackers.
