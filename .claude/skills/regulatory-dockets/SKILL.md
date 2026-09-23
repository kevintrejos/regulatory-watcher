---
name: regulatory-dockets
description: Use when adding or updating rules, dockets, orders, standards and agency proceedings in the Locke prototype's Regulatory tracker - FERC, NERC, DOE, TVA, state commissions. Covers the docket object shape, the free-text stage labels, comment and ballot deadlines, and linking a docket to the compliance obligations it creates. Triggers include "add a docket", "the comment period", "FERC issued", "NERC standard", "update Regulatory", "a rule was proposed".
---

# Regulatory dockets

Owns `LW.reg` in `data-phase2.js`. Read `locke-content-style` and `policy-fact-verification` first.

Regulatory is where large-load policy is actually written, so this tracker usually carries the highest-exposure items in the prototype.

## Object shape

```js
{
  id: 'nerc-2602',
  ident: 'CLO-001-1 · Project 2026-02',   // docket or standard number as the agency writes it
  title: 'Computational load standards: comment and ballot',
  short: 'New reliability standards for data center loads',
  body: 'NERC',                    // the agency or commission
  lane: 'federal',                 // 'federal' | 'state'
  st: 'TX',                        // state lane only
  stage: 'Ballot open',            // FREE TEXT, see below
  cls: 'sev-act',                  // pill class, see below
  topics: ['largeload'],
  exposure: 3, position: 'Engage', owner: 'chen',
  last: { date: '2026-09-09', text: 'Initial ballot opened' },
  next: { date: '2026-09-18', label: 'Comment and ballot close, 8:00 pm ET' },
  analysis: ['...', '...'], means: '...', provisions: ['...'],
  sources: ['nerc-2602', 'nerc-ballot'],
  action: { label: 'File a comment before Friday', toast: '...' }
}
```

Unlike bills, dockets have no fixed stage ladder, so `stage` is free text and `cls` picks the pill:

| Situation | `cls` | Example stage text |
|---|---|---|
| A deadline is live and Locke should act | `sev-act` | Ballot open, Comments open |
| Moving, watch it | `sev-watch` | In force, Under review |
| Pending agency action | `st-pass` | Final rule pending |
| Ongoing proceeding | `st-cmte` | Stakeholder process, In compliance |
| Directive already issued | `st-rept` | Directive, Responses due |
| Closed or suspended | `st-dead` | Comments closed, Suspended |
| Completed favorably | `st-enact` | Final order |

## Method

1. Start at the agency: the FERC docket page, the NERC project page, the Federal Register notice, the state commission's project record.
2. Capture the **exact** deadline, including the time of day and time zone when the agency states one. "8:00 pm ET" is the difference between filing and missing.
3. Write the first analysis paragraph as what the agency did and when. Write the second as what happens next and who has to move.
4. `means` answers one question: does this create work the client can sell into, or work the client has to do? Say which.
5. If the docket creates a client obligation, add it in `LW.obligations` with `rel` set to this docket id. The rule page renders those automatically.

## Deadline discipline

- A comment period inside 30 days is an `sev-act` item and should also appear in `LW.coming` so it reaches the ticker and Home.
- A closed comment period is still worth tracking. Say what Locke filed, or why it passed. A recently closed window shows judgment.
- Re-check every open deadline whenever the prototype date changes.

## Quality bar

- The identifier matches the agency's own citation style, including section symbols: `16 TAC §25.194`, `RD26-7-000`, `RM26-4`.
- Every docket names the body precisely: "DOE Office of Electricity," not "DOE."
- Federal and state lanes both carry items. A Regulatory tracker with only federal entries misses where most large-load policy happens.
- Nothing claims an outcome the agency has not reached. Pending is pending.
