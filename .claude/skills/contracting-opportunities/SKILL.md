---
name: contracting-opportunities
description: Use when adding or updating federal opportunities in the Locke prototype's Contracting view - solicitations, funding programs, SBIR rounds, teaming targets - and when writing the bid or no-bid page. Covers the opportunity shape, the five-part fit score, the requirements crosswalk, competitor entries, and the rules for marking an item illustrative. Triggers include "add an opportunity", "score this RFP", "bid or no-bid", "SAM.gov", "teaming", "update Contracting", "fit score".
---

# Contracting opportunities

Owns `LW.opps` and `LW.intel` in `data-phase2.js`. Read `locke-content-style` and `policy-fact-verification` first.

## Object shape

```js
{
  id: 'oe-pilot', ident: 'CWX-010-GDO',       // notice number, or 'Illustrative notice'
  title: '...', agency: 'DOE Office of Electricity', office: '...',
  type: 'Solicitation',      // Solicitation | Funding | Program | SBIR | Awarded program
  naics: '541715 · 541512', setAside: 'None identified',
  status: 'Open',            // Open | Awards expected | Closed | Awarded
  illustrative: true,        // only when no real counterpart exists
  posted: '2026-09-02', due: '2026-10-30', value: '$2M to $4M over two years',
  fit: 75, rec: 'Bid',       // Bid | No-bid | Team | Watch
  recBy: 'bell', owner: 'bell',
  fitParts: [ { label: 'Technical match', score: 26, max: 30, note: '...' } ],
  analysis: ['...'], why: '...',
  requirements: [ { req: '...', status: 'gap', note: '...' } ],   // met | partial | gap
  competitors: [ { name: 'Enverus', note: '...' } ],
  sources: [...], action: { label: '...', toast: '...' }
}
```

## The fit score

Five parts, 100 points. Keep these weights so scores compare across opportunities.

| Part | Max | What moves it |
|---|---|---|
| Technical match | 30 | How close the work is to what the client already builds |
| Past performance | 20 | Relevant contracts already delivered, especially federal |
| Compliance readiness | 20 | Whether the client can legally hold the work today |
| Competition | 15 | How crowded, and whether an incumbent is embedded |
| Strategic value | 15 | What winning unlocks beyond the contract itself |

Compliance readiness is usually the honest ceiling for a startup, and saying so is the most useful thing on the page. A 90 technical score with a 6 compliance score is a no-bid until the gap closes.

## The recommendation

`Bid`, `No-bid`, `Team` or `Watch`, signed by the contracts owner. The `why` paragraph gives the reasoning in the client's terms, including what the client gains even when the answer is no.

A well-reasoned `No-bid` is the most valuable item on this screen. Show the check that was run, the reason it failed, and what to watch next. That is the work a client is paying for.

## Requirements crosswalk

Each row is a real requirement, drawn from the notice or from the rules that govern this kind of work, with `met`, `partial` or `gap` and a cited note. Never invent a requirement to fill the table. Rows that link to a compliance obligation should use the same language as `LW.obligations` so the two screens agree.

## Illustrative items

Sometimes no live solicitation fits. Then:

1. Set `illustrative: true` and `ident: 'Illustrative notice'`, which renders a visible badge.
2. Open the first analysis paragraph with the words **This page is illustrative**, name the real programs it is modeled on, and state that every requirement and rule cited is real.
3. Never invent a notice ID, a solicitation number or an agency point of contact.

## Competitors and intel

Only public record: acquisitions, awards, deployments, published partnerships. Cite each one. Do not attribute lobbying spend, revenue or pipeline to a competitor without a filing that states it. `LW.intel` carries the same discipline in a dated list.

## Quality bar

- Closed and awarded items stay on the board. The reason something closed is usually the lesson.
- Every dated item's `due` is real, and a past `due` is paired with a status of `Closed` or `Awarded`.
- Fit parts sum to `fit`.
- The agency and office are named precisely, including the partnership intermediary when one runs the program.
