---
name: briefs-library
description: Use when adding or updating entries in the Locke prototype's Briefs library - the record of what Locke has written for the client, with author, reviewer, source count and provenance. Covers the brief object, the status ladder, and the unverified-citation state that blocks export. Triggers include "add a brief", "we filed a comment", "mark the brief sent", "provenance stamp", "export blocked", "unverified citations".
---

# Briefs library

Owns `LW.briefs` in `data-phase3.js`. Read `locke-content-style` first.

The Briefs screen is the proof that a human is accountable for machine-drafted work. Every row carries who drafted it, who reviewed it, and how many sources were verified.

## Object shape

```js
{
  id: 'br-nerc',
  title: 'Comment on CLO-001-1, computational load studies',
  date: '2026-09-15',
  author: 'chen',        // who wrote it
  reviewer: 'priya',     // who signs off. May be a client person for technical review
  status: 'In review',   // Draft | In review | Sent | Filed
  sources: 6,            // verified source count
  unverified: 0,         // non-zero blocks export
  note: '...',           // one line: what it says, or what it is waiting on
  ref: { type: 'r', id: 'nerc-2602' }    // or { type: 'page', href: '#/report' }
}
```

## Status ladder

| Status | Means |
|---|---|
| `Draft` | Locke is still writing. Not visible to the client as advice |
| `In review` | With a named reviewer, blocked on them, and the note says so |
| `Sent` | Delivered to the client |
| `Filed` | In a public record: a comment, a filing, testimony |

`Filed` is the strongest status in the product, because it is the only one that proves Locke put the client's position somewhere official.

## The unverified state

Keep exactly one brief in the library with `unverified` greater than zero. It exists to show the guardrail working:

- The stripe turns to the act color and the stamp reads "N citations unverified · export blocked."
- The action button becomes "Why blocked" rather than "Send."
- The note names what specifically has to be confirmed and who owns the check.

This is the single most important detail on the screen for a legal buyer. An AI-drafted brief that cannot leave the building until its citations are confirmed is the difference between a tool and a liability.

## Method

1. One row per artifact Locke produced. Not per task, not per email.
2. Pair author and reviewer honestly: counsel reviews legal work, the client's technical lead reviews technical claims, contracts reviews bid work.
3. Count sources by actually counting the distinct source ids in the underlying item.
4. Link `ref` to the bill, docket or opportunity the brief is about, so the row is clickable.
5. Keep the library between six and ten rows. A library of forty looks like noise; a library of three looks like a new engagement that has done nothing.

## Quality bar

- Every brief has both an author and a reviewer, and they are different people.
- Dates are ordered and plausible against the prototype's clock, with the newest first on the page.
- At least one `Filed` item exists, because filing is the work product clients brag about.
- The one blocked brief stays blocked. Do not quietly resolve it.
