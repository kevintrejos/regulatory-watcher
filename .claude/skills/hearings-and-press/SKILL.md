---
name: hearings-and-press
description: Use when adding hearings, markups, agency meetings, executive actions or press coverage to the Locke prototype. Covers the hearing object, what to write before versus after a hearing, executive action entries, and the rule that press items only appear when the publication date is verifiable. Triggers include "add a hearing", "committee markup", "add coverage", "press clip", "executive order", "the governor signed", "what happened at the hearing".
---

# Hearings, executive actions and press

Owns `LW.hearings`, `LW.actions` and `LW.press` in `data-rest.js`. Read `locke-content-style` and `policy-fact-verification` first.

## Hearings

```js
{
  id: 'enr-ferc', level: 'federal',    // 'federal' | 'state'
  st: 'TX',                            // state level only
  date: '2026-07-22', time: '10:00 am ET',   // omit time unless the notice states one
  body: 'Senate Energy and Natural Resources',
  kind: 'Hearing',                     // Hearing | Markup | Interim hearing | Open meeting
  title: 'Oversight of the Federal Energy Regulatory Commission',
  by: 'kevin',                         // who at Locke wrote the note
  rel: ['s4559', 's5008'],             // related measure ids
  witnesses: ['Chairman Laura Swett', '...'],
  notes: ['...', '...'],               // cited
  rec: '...',                          // optional, what Locke advises
  sources: ['enr-ferc', 'ud-swett']
}
```

The page header switches automatically on the date: upcoming hearings show "What to watch," past ones show "What happened and why it matters." Write `notes` to match which side of the date it is on, and rewrite them after the hearing rather than leaving predictions in place.

**Before:** what is at stake, who is testifying, the one exchange worth watching, and whether the client should submit testimony.

**After:** what was actually said, by whom, with a citation, and what it changes. A quotable line from a chairman is worth more than a summary of the whole hearing, because it can be cited in a comment filing later.

## When there are no upcoming hearings

This is common and normal, especially near an election. Say so plainly in `LW.noHearings` rather than padding the calendar: committee calendars thin out before midterms, and a tracker that admits this is more credible than one that invents activity. Keep the past 90 days visible so the section is not empty.

## Executive actions

`LW.actions` holds things that are neither bills nor dockets: governor directives, executive orders, incentive pauses.

```js
{ level: 'state', st: 'TX', date: '2026-08-03',
  title: 'Abbott orders an audit of the data center queue',
  ident: 'Governor’s directive', note: '...cited...' }
```

These appear in the Recently enacted panel alongside enacted bills, which is correct: the client cares what changed, not which branch changed it.

## Press

`LW.press` is built from `LW.sources` entries, so a clip only exists if its source has a real `date`:

```js
LW.press = [ ['bbg-newsom', ['ca-ab2383', 'ca-sb886']], ... ]
   .map(([id, rel]) => ({ date: S[id].date, outlet: S[id].pub, headline: S[id].title, url: S[id].url, rel }));
```

Rules:
- No clip without a verifiable publication date. A URL with the date in its path is the easiest confirmation.
- `rel` decides where the clip surfaces, so relate it to every measure it actually covers.
- Headlines are the publication's own. Do not rewrite them to be punchier.
- Prefer coverage that adds something the primary source does not: political read, reaction, consequence.

## Quality bar

- Every hearing has at least one source and a real body name.
- Witness lists name people as the committee listed them, with agency titles rather than party tags.
- Press skews recent. A clip older than about six months needs a reason to still be on the page.
