---
name: portfolio-book
description: Use when updating the Locke side of the prototype - the firm view where one policy person covers five clients. Covers the client record, the cross-client triage queue, the impact matrix that maps one policy event onto every account, access tiers, position conflicts between clients, and the mode switch between the firm view and the client view. Triggers include "add a client", "the portfolio", "triage queue", "impact matrix", "one event many clients", "client health", "renewal", "the Locke view", "mode switch".
---

# The portfolio, or the Locke side

Owns `LW.clients`, `LW.triage`, `LW.impacts` and `LW.locke` in `data-portfolio.js`. Read `locke-content-style` first.

## Why this view exists

The client view answers "what does this mean for my company." The firm view answers a harder question: one policy person covers five accounts, so who needs them first, and what does a single federal action do across the whole book. A Slack channel per client cannot answer that. Neither can Quorum.

Small clients never log in. They get Slack and a weekly brief, and Locke staff work this view on their behalf. Bigger clients with a general counsel or a government relations lead get seats in the client view.

## Client record

```js
{
  id: 'halden', name: 'Halden Compute', sector: '...', stage: 'Series D · 400 people', hq: '...',
  tier: 'platform',            // 'platform' has seats, 'slack' does not
  since: '2025-11-10', health: 'good',    // good | watch | risk
  live: 28, openActions: 4,
  agenda: 'One sentence. What they want from government',
  next: { date: '2026-09-30', label: '...' },
  seats: [{ name: '...', role: 'General Counsel', last: '2026-09-09' }],
  relationship: { lastContact, cadence, engaged, ignored, asked },
  delivery: { alerts, briefs, filings, lastBrief: { title, date } },
  commercial: { retainer, term, renewal, effort },
  note: 'The account read. The thing a partner would say out loud'
}
```

Write `relationship` from the client's actual behavior, not their org chart. "Ruth forwards everything to outside counsel before acting" tells a colleague how to work the account. "Engaged stakeholder" tells them nothing.

`note` carries the judgment: capacity problems, renewal risk, an unanswered question, a new account still setting expectations. One honest sentence beats a status label.

## Triage queue

Everything that needs a Locke human, across all clients, sorted by what closes first.

```js
{ id, client: 'kestrel', sev: 'act', due: '2026-09-16',
  title: 'Answer Kestrel on what the CMMC pause means for their bid',
  why: 'Asked four days ago. Oldest open question in the portfolio, and the answer is short.',
  ref: { type: 'r', id: 'cmmc' }, owner: 'chen' }
```

Rules:
- Title names the action and the client's stake, not the policy event.
- Include at least one item that is about the relationship rather than the policy: an unanswered question, a quiet account before renewal, a promise not yet kept. Those are the items that actually lose clients.
- `ref` links into the item when the client is Loomwork, since Loomwork is the only account with a built workspace. Otherwise the row opens the client page.
- Five to eight rows. This is a morning list, not a backlog.

## Impact matrix

The signature view. One event, every client, ranked by exposure.

```js
{ id, title, ident, date, dateLabel, ref, summary,
  conflict: true, conflictNote: '...',
  rows: [ { client: 'loomwork', exposure: 3, position: 'Support', line: '...' } ] }
```

- Every client appears in every impact, including the ones with `exposure: 0`. "No exposure" is information, and its absence makes the matrix look like cherry-picking.
- `line` is one sentence in that client's terms. The same order should read differently for each of them, because it is different for each of them.
- Sort rows by exposure when rendering, so the affected clients surface first.

## Position conflicts

When two clients want opposite outcomes, set `conflict: true` and write `conflictNote` plainly: who benefits, who pays, and how the firm handles it. The current example is a grid software client that gains from strict study requirements and a data center client that carries their cost.

Do not hide this. A government affairs firm with five clients in adjacent sectors will have conflicts, and showing how the firm manages one is more credible than a portfolio where everyone agrees. The note should state the mechanism: separate teams, separate filings, no shared work product, and both clients informed.

## Access tiers

Two, and they change what Locke owes the client:

| Tier | Means |
|---|---|
| `platform` | Has seats in the client view. Someone there works in the tool |
| `slack` | No seats. Locke staff work this view on their behalf and push to Slack |

A `slack` client with no seats is not a lesser client. It is the firm's core business: companies too small to staff government affairs at all.

## The mode switch

`LW.locke.mode` sets the landing view, and `state.mode` persists per viewer. The switch lives at the top of the sidebar, and switching changes the nav, the ticker and the top-bar identity together. In the firm view the identity is the Locke staffer, not a client role.

Only Loomwork's workspace is built. Any attempt to open another client's workspace says so rather than pretending.

## Quality bar

- Every client has a different shape of problem. Five healthy accounts with nothing overdue is not a book, it is a brochure.
- Commercial numbers are internally consistent: effort near capacity on the account flagged at capacity, renewal dates that match the tenure.
- Each impact reaches at least two clients, or it belongs on a client page instead.
- The triage queue and the client cards agree with each other on open counts.
