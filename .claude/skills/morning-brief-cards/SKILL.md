---
name: morning-brief-cards
description: Use when writing or revising the morning brief on the Locke prototype's Home screen - the per-role action cards and the Ask Locke answers. The brief is modeled on a Slack alert, not a memo. Covers the card shape, the word budget, the two-control rule, and how to choose which three things reach a given role. Triggers include "write the brief", "update Home", "the CEO brief", "add a card", "Ask Locke answer", "rewrite the morning brief".
---

# Morning brief cards

Owns `LW.roles[*].brief` and `LW.roles[*].ask` in `data-roles.js`. Read `locke-content-style` first.

## The rule that governs everything here

The brief is the Slack alert the client already acts on, with the background Slack has no room for. It is not homework. If a card cannot be read and acted on in fifteen seconds, it belongs on a detail page instead.

## Shape

```js
brief: {
  signer: 'kevin',                    // kevin policy, chen legal, bell contracts
  lede: 'One line. What this morning is about.',
  items: [ {
    sev: 'act',                       // act | watch | fyi
    when: '2026-09-18',
    whenLabel: 'Comments close 8:00 pm ET',
    title: 'Three days to put Loomwork on the record at NERC',
    why: 'Two sentences. What it is, plus what is blocking or what happens next.',
    ref: { type: 'r', id: 'nerc-2602' },     // m bill, r docket, o opportunity, h hearing, p person
    actions: [ { label: 'Approve the filing', toast: '...' } ]
  } ]
}
```

## Word budget

| Part | Budget |
|---|---|
| `lede` | One sentence, up to about 20 words |
| `title` | Up to about 12 words |
| `why` | Two sentences, 35 to 50 words, with one or two citation chips |
| Whole brief | Around 200 words across three cards |

Three cards is the maximum. A fourth means something on the list is not a decision.

## Writing the title

State the consequence for the client, and put the clock in it where there is one.

- Yes: "DOE's new grid AI award needs two utility hosts, and you have two"
- Yes: "Your technical review is the last step before we file at NERC"
- No: "NERC opens comment period on CLO-001-1"
- No: "Update on the FERC proceeding"

The title is a link to the item's full page, so it must name something specific enough to click.

## Writing the why

Sentence one: what happened, cited. Sentence two: what it means for this person, or what is blocking. Name the person who owes the next step, by name, with the date.

## Controls

Exactly two per card: the action, and `Not relevant`. This mirrors the Slack alert and keeps the learning loop visible, since dismissals teach the agents what this client does not care about. Do not add a third button. If a card seems to need one, the card is doing two jobs.

Action labels name the outcome: "Approve the filing," "Request a lab meeting," "Hold the spend." The toast that follows says what happened and who now owns it, with a date where one exists.

## Choosing the three

Each role gets decisions, not updates.

| Role | What reaches them |
|---|---|
| CEO | Only what needs their judgment or their signature. At most one thing they cannot delegate |
| Head of Gov Sales | Money and relationships: teaming windows, awards, opportunities closing |
| CISO | Deadlines and obligations that land on their team, plus anything blocked on their review |

An item with no decision attached goes to the Since-yesterday ledger or the tracker, not the brief.

## Ask Locke answers

Three scripted questions per role. Each answer is 80 to 110 words, cited, and signed by the person who would actually answer it: counsel for legal questions, contracts for procurement, policy for everything else. Answer the question in the first sentence, then support it. Say no when no is the right answer, and give the reason.
