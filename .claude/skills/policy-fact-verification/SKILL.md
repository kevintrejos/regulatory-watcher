---
name: policy-fact-verification
description: Use when researching or verifying any real policy fact for the Locke prototype - bills, dockets, comment deadlines, hearings, agency programs, officials, districts, funding amounts. Covers how to search, which sources count, what to do when a fact will not verify, and the checks to run before anything enters a data file. Triggers include "find the deadline", "verify this", "is this still accurate", "research the docket", "check the district", "refresh the tracker".
---

# Policy fact verification

The research layer. Everything in the prototype is real except the client, the Locke staff around Kevin, and clearly marked illustrative items.

## The clock

The prototype is set to a fixed "today" in `LW.today` (currently `2026-09-15`). Every relative phrase in the content is computed from it, so:

- A fact is "live" only if its date sits on or after that day.
- Something that closed a week earlier is still useful. Recently closed windows show judgment: what Locke filed, or why it passed.
- When the prototype date moves, re-check every `next` date. Stale deadlines are the fastest way to lose a policy reader.

## Search method

1. Start with the primary source. Congress.gov for bills, the agency for dockets, the Federal Register for notices and comment deadlines, the commission's own project page for standards.
2. Confirm with a law firm or trade-press summary. These are good for status and meaning, weaker for exact dates.
3. Capture, for every fact: the exact date, the identifier as the government writes it, and a URL that resolves.
4. When two sources disagree (this happened with a continuing resolution bill number), use the fact both agree on and drop the detail they dispute. Do not pick a side silently.

Search phrasing that works: the identifier plus the year (`"CLO-001-1" comment period 2026`), the agency plus the action (`PUCT large load interconnection rule adopted`), or the person plus the bill.

## What counts

| Tier | Examples | Use |
|---|---|---|
| Primary | congress.gov, federalregister.gov, ferc.gov, nerc.com, agency and commission sites, governor's office | Always preferred. Cite these |
| Reliable secondary | Utility Dive, E&E News, law firm alerts, trade associations | Fine for status and framing. Cite them as themselves |
| Not citable | Aggregators with no byline, AI-written summaries, forum posts, anything undated | Do not use, even to "confirm" |

## When a fact will not verify

Pick one, in this order:

1. **Cut it.** The item survives without that sentence more often than you think.
2. **Narrow it.** Drop the disputed number and keep the verified shape: "the committee approved it unanimously" rather than an unconfirmed vote count.
3. **Mark it.** For a whole item that has no real counterpart, set `illustrative: true` and open its analysis with what it is modeled on and what in it is real.

Never split the difference by writing an approximate figure without a source.

## Before anything enters a data file

- [ ] Identifier written the way the government writes it (`H.R. 9340`, `16 TAC §25.194`, `RD26-7-000`)
- [ ] Every date traced to a source that states it, and formatted `YYYY-MM-DD` in data
- [ ] A `LW.sources` entry exists, with a resolving URL and a `date` only if the real date is known
- [ ] Any person named carries the right party and district format (see `locke-content-style`)
- [ ] Any stance claim is cited, or reads `No public position`
- [ ] The `next` date is in the future relative to `LW.today`, or the item explains why it is past
- [ ] Nothing in the entry asserts a relationship between a real official and the fictional client

## Recurring checks worth running

- Comment periods and ballots close fast. Re-check anything inside 30 days.
- Bill stages change without notice. Confirm the stage before publishing, not just the text.
- Agency programs get renamed and reorganized. Confirm the office still owns the program.
- Districts change with redistricting. Verify, do not recall.
