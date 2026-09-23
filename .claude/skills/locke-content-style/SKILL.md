---
name: locke-content-style
description: Use when writing or editing ANY content in the Locke for Loomwork prototype - citation tokens, source entries, how to name members of Congress and governors, voice, dates, and what may never be fabricated. Every other Locke prototype skill depends on this one. Triggers include "add a bill", "add a docket", "write the brief", "update the stakeholder", "add a source", "fix the citation".
---

# Locke prototype: content style

The shared layer. Per-section skills (`legislative-measures`, `regulatory-dockets`, `stakeholders-grid`, and the rest) all assume these rules.

## Where things live

Project: `loomwork-prototype/` in the Locke application folder.

| File | Holds |
|---|---|
| `data-core.js` | `today`, `lastVisit`, client, people, saved searches, the **sources registry** |
| `data-roles.js` | Per-role morning brief cards and Ask Locke answers |
| `data-measures.js` | `LW.measures`, bills |
| `data-rest.js` | Hearings, executive actions, members, press, activity, calendar, planned screens, About |
| `data-phase2.js` | `LW.reg` dockets, `LW.obligations`, `LW.opps`, `LW.intel` |
| `data-phase3.js` | Stakeholders, orgs, campaigns, disclosures, briefs, tasks, analytics, board report, settings |
| `app.js` | Rendering and routing. Data files never contain markup |
| `index.html` | Tokens, CSS, script tags |

After editing: copy to the scratchpad serving dir, `preview_start`, look once, then publish with the full `files` map. See `publish-prototype`.

## Citations

Inline token, resolved by `rich()` in app.js:

```
[[source-id|Visible label]]
```

Renders a mono chip linking to the source. The visible label is short: a docket number, a publisher, a date phrase. Never a sentence.

Every source id must exist in `LW.sources` (add new ones with `Object.assign(LW.sources, {...})` in the phase file where they are first used):

```js
'nerc-ballot': {
  label: 'Ballot closes 18 Sep',        // default chip text
  title: 'NERC computational load standards: CLO-001-1 guide',  // shown in the source list
  pub: 'Zero Emission Grid',            // publisher
  date: '2026-09-18',                   // OMIT if the real date is unknown. Never guess
  url: 'https://...'                    // must resolve
}
```

Rules:
- Every claim about the real world carries a citation. No exceptions for "everyone knows."
- Internal Locke and Loomwork work (drafts, plans, reviews, meetings between fictional people) carries **no** citation, and must read as internal so a reader can tell it apart.
- One claim, one source. If two sources are needed, use two chips.
- Prefer primary sources: Congress.gov, the agency, the Federal Register, the commission's own docket.

## Other inline formatting

- `` `S. 4559` `` sets an identifier in mono. Use for bill numbers, docket numbers, dates that act as deadlines, and dollar figures inside sentences.
- `**bold**` for the one phrase that carries the sentence. Rare.
- No raw HTML in data files. If markup is needed, it belongs in `app.js`.

## Naming people

| Who | Format | Example |
|---|---|---|
| House | `(PARTY-STATE-DISTRICT)`, district padded to two digits | `Rep. Bob Latta (R-OH-05)` |
| Senate | `(PARTY-STATE)`, no district | `Sen. Adam Schiff (D-CA)` |
| Governor | `(PARTY-STATE)` | `Gov. Greg Abbott (R-TX)` |
| State legislator | `(PARTY-DISTRICT)`, no state, district padded | `Asm. Rick Chavez Zbur (D-51)` |
| Agency official | No party tag | `Chairman Laura Swett`, `Commissioner Judy W. Chang` |
| Grid operator staff | No party tag | `Pablo Vegas, President and CEO, ERCOT` |

Independents use their caucus-neutral letter: `Sen. Bernie Sanders (I-VT)`. Verify the district before writing it. Never infer a district from a city.

## Voice

- Lead with the consequence, not the event. "Three days to put Loomwork on the record at NERC," not "NERC opens comment period."
- Sentence case. Title Case belongs to bill names and agency names.
- No em dashes. Use a spaced hyphen or restructure, matching locke.inc.
- Dates as `18 Sep` inside a line and `18 Sep 2026` where the year matters. Always pair a deadline with the interval: "closes 18 Sep, in 3 days."
- Use the vernacular correctly: markup, docket, ballot, comment period, show cause, set-aside, sources sought. The reader is a policy professional.
- Buttons name the outcome. The toast that follows says what happened and who now owns it.
- No exclamation points. When a client wins, the word is "Enacted."
- American English.

## Never

- Invent a meeting, call or relationship between a real official and Loomwork. Contact logs are staff-level or organization-level only, and planned asks stay labeled as planned.
- Invent a dollar figure, a vote count, a docket number or a notice ID. If a solicitation is not real, the item carries `illustrative: true` and the page says so in its first line.
- Assign a stance to a real person without a citable vote, bill or statement. The honest label is `No public position`.
- Copy Locke's logomark or photography. The sidebar carries a `Concept` tag instead.
- Let a date sit in the file without a source that states it.
