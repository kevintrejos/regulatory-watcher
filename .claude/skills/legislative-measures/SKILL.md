---
name: legislative-measures
description: Use when adding, updating or auditing bills in the Locke prototype's Legislative trackers - federal bills in Congress and state bills in Loomwork's markets. Covers the measure object shape, stage vocabulary, exposure and position calls, the stage track dates, and what belongs in the analysis versus the "what it means" line. Triggers include "add a bill", "update the tracker", "the bill moved", "refresh Legislative", "score this bill's exposure".
---

# Legislative measures

Owns `LW.measures` in `data-measures.js`. Read `locke-content-style` and `policy-fact-verification` first.

## Object shape

```js
{
  id: 's4559',                    // short, stable, used in routes and refs
  level: 'federal',               // 'federal' | 'state'
  st: 'CA',                       // state code, state level only
  ident: 'S. 4559',               // as the government writes it
  title: 'Energy Cost Fairness and Reliability Act of 2026',
  short: 'Directs FERC to require AI and automation best practices in interconnection queues',
  stage: 'intro',                 // see vocabulary below
  stageLabel: 'Committee approved',   // optional override
  body: 'Senate', cmte: 'Energy and Commerce',
  sponsors: 'Sen. Adam Schiff (D-CA)',   // formatting rules in locke-content-style
  topics: ['interconnection'],    // interconnection | largeload | transmission | ai | funding
  exposure: 3,                    // 0 none, 1 low, 2 medium, 3 high
  position: 'Support',            // Support | Oppose | Monitor | Engage | Filed | No action
  owner: 'kevin',                 // kevin policy, chen legal, bell contracts
  last: { date: '2026-05-18', text: 'Introduced in the Senate' },
  next: { date: '2026-09-30', label: "Governor's deadline" },  // omit date if none is scheduled
  enacted: '2026-07-12',          // enacted items only, drives the Recently enacted panel
  dates: { 0: '2026-06-18', 1: '2026-07-20' },   // index into the stage track
  analysis: ['...', '...'],       // two paragraphs, cited
  means: '...',                   // one paragraph, uncited, Locke's judgment
  meansShort: '...',              // one line, required if enacted within 90 days
  provisions: ['...'],            // optional, each cited
  sources: ['s4559', 's4559-text'],
  action: { label: 'Draft cosponsor outreach', toast: '...' }
}
```

## Stage vocabulary

`draft` `intro` `cmte` `rept` `pass` `desk` `enact` `study` `dead`

The stage track in `app.js` maps these to positions: intro 0, cmte and rept 1, pass 2, desk 3, enact 4. `draft` and `study` have no track, so give those items a `trackNote` explaining why.

## Method

1. Find the bill on Congress.gov or the state legislature's site. Confirm the current stage, the last action date and the sponsor.
2. Read enough of the text to write one true sentence about what it does. Do not paraphrase a press release.
3. Write `short` as the mechanism, not the marketing title. "States must consider making 100 MW+ loads pay full upgrade costs."
4. Write two analysis paragraphs: the first is what the bill does and where it stands, cited. The second is the political read: who is behind it, what the calendar does to it, what would have to happen next.
5. Write `means` as the client consequence. No citations. This is the sentence the client actually reads.
6. Score exposure and position (below).
7. Add every source to `LW.sources`.

## Scoring exposure

| Score | Test |
|---|---|
| 3 High | Changes the rules governing the client's product category, or the budget that buys it |
| 2 Medium | Changes the client's customers' obligations, which flows into demand |
| 1 Low | Real but indirect, or a small slice of the business |
| 0 None | Tracked for judgment, not effect. Say why in `means` |

An exposure 0 item with a clear "this does not apply to us, and here is why" is worth more than three padding entries.

## Position

`Support` and `Oppose` require a reason Locke would put in writing. `Engage` means Locke is actively working it. `Monitor` is the honest default. `Filed` means Locke is in the record. Never mark `Support` on something the client has not agreed to support.

## Quality bar

- Every federal item names its sponsor with the party and district format.
- Every state item sets `st` and appears in the right state filter.
- No two items share a `next.date` unless the deadline is genuinely shared.
- If a bill has not moved in 90 days, say so in the analysis rather than leaving it looking live.
