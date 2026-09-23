---
name: activity-ledger
description: Use when updating what changed since the client's last visit and what is coming up in the Locke prototype - the Home ledger, the deadline ticker, and the dismissal learning loop. Triggers include "since Thursday", "what changed", "add to the ticker", "coming up", "update the feed", "not relevant", "the client dismissed".
---

# Activity ledger and the deadline ticker

Owns `LW.since` (the "Since ..." ledger on Home) and `LW.coming` (the ticker and the Coming up rail) in `data-rest.js`, extended in `data-phase2.js`.

## The window

`LW.lastVisit` sets the ledger's window. Only put things in `LW.since` that actually happened between `lastVisit` and `today`. If nothing real happened in that window, shorten the window rather than padding it, or let the ledger carry internal Locke activity, which is legitimately what fills quiet days at a firm.

## Ledger entries

```js
{
  id: 'sn-nerc',
  kind: 'deadline',    // stage | new | press | filing | locke | deadline | meeting
  sev: 'act',          // act | watch | fyi | locke
  date: '2026-09-15',
  title: 'Three days left on the NERC computational load ballot',
  detail: '...cited, one or two sentences...',
  ref: { type: 'r', id: 'nerc-2602' },
  hideable: true       // shows the "Not relevant" control
}
```

Use `sev: 'locke'` with `kind: 'locke'` for the firm's own work, which renders in the accent color rather than a severity color. That visual split matters: it lets a client see at a glance what the world did versus what their firm did.

## What earns a row

- A real stage change, filing or deadline inside the window, cited.
- Coverage that changes the read, not coverage that repeats it.
- Locke's own work: a draft produced, a comment filed, an item added to the tracker, a scoring decision.

What does not: anything undated, anything outside the window, and anything the client already acted on.

## Not relevant

`hideable: true` puts the learning control on the row. Dismissals persist per viewer and feed the log in `LW.settings.learned`. When adding a dismissal to that log, write what Locke concluded, not what the user clicked: "state AI bills with no grid nexus now go to the digest instead of the brief."

Leave Locke's own work rows without `hideable`. A client dismissing the firm's work product is not a signal worth learning from.

## Coming up and the ticker

```js
{ date: '2026-09-18', title: 'NERC computational load ballot closes',
  meta: 'NERC · 8:00 pm ET', href: '#/r/nerc-2602', sev: 'act',
  internal: true,    // dashed date block, for client or Locke internal events
  approx: true }     // renders "by 30 Sep" when only the month is known
```

The ticker shows the next seven dated items, so `LW.coming` is the highest-leverage list in the prototype. Rules:

- Sorted by date, always forward-looking. Past items drop out automatically.
- Mix external deadlines with internal events. A calendar with only government dates does not look like anyone's real week.
- Use `approx` when the source says a month but not a day. Never invent the day.
- Anything marked `sev: 'act'` should also appear in a brief card, or the client will see a red deadline with no guidance attached.
- The window can run months out. A two-week window looks empty in a quiet season, which misrepresents the work.

## Quality bar

- Five to seven ledger rows. More reads as noise.
- At least one row is Locke's own work, and at least one is dismissible.
- Every ticker item with an `href` points at a page that exists.
