---
name: compliance-obligations
description: Use when adding or updating the client's compliance obligations in the Locke prototype - what the company owes, who owns it, when it is due, and which rule created it. Covers the obligation shape, the four statuses, linking back to a docket, and the judgment calls about what does not apply. Triggers include "add an obligation", "update compliance", "what do we owe", "is this in scope", "FedRAMP", "CMMC", "lobbying filing deadline".
---

# Compliance obligations

Owns `LW.obligations` in `data-phase2.js`. Read `locke-content-style` and `policy-fact-verification` first.

This screen answers one question for the client: what do we have to do, and what is blocking us. It is the screen a general counsel opens first.

## Object shape

```js
{
  id: 'ob-fedramp',
  regime: 'FedRAMP',                   // the framework, short enough for a column label
  requirement: 'Moderate baseline, or equivalent, for cloud services holding CUI',
  status: 'gap',                       // met | due | gap | monitor
  owner: 'priya',                      // a client person, or kevin/chen for Locke-run filings
  due: '2027-06-30',                   // omit when there is no date
  note: '...',                         // one or two sentences, cited where it states a rule
  rel: 'far-cui'                       // optional, the LW.reg docket id that created it
}
```

## The four statuses

| Status | Means | Sorts |
|---|---|---|
| `gap` | Required, or about to be, and the client cannot do it today | First |
| `due` | Dated work with an owner, on track | Second |
| `monitor` | Might apply, or applies later. Being watched deliberately | Third |
| `met` | Documented and current. Includes "we checked, it does not apply" | Last |

`met` covers two different things and both matter: the obligation satisfied, and the obligation ruled out in writing. Ruling something out is work, and showing it is how a client learns to trust the list.

## Method

1. Start from the docket. Most obligations come from a rule already in `LW.reg`. Set `rel` so the rule page lists the obligations it creates.
2. State the requirement in the client's terms, not the regulation's. "Moderate baseline for cloud services holding CUI," not a clause number.
3. Assign a real owner. Security and hosting go to the client's CISO. Filings that Locke performs go to the Locke person who files them.
4. Date it when the rule dates it. A proposed rule has no compliance date yet, so the date is the client's own target, and the note should say so.
5. Mark the honest status. Resist marking things `due` when nothing is scheduled.

## Judgment entries

Include obligations that do **not** apply, with the reasoning:

- A frontier AI law that does not reach the client's models
- A NERC registration category that covers the client's customers, not the client
- An export classification with no current exposure

These earn their place because a client who sees only obligations cannot tell whether the list is complete. Each needs a date or a trigger for re-checking, since scope changes.

## The critical path

At most two or three items should be `gap`. If more are, the list has become a wish list. The gaps that matter are the ones that block revenue, and the note should say what they block: "the binding constraint on any federal bid."

## Quality bar

- Every `gap` names what it blocks and what the first step is.
- Every filing obligation Locke owns (LD-2, LD-203) carries the real statutory deadline.
- No obligation cites a rule that is not in `LW.reg` or `LW.sources`.
- The counts on the summary strip are computed, never hardcoded.
