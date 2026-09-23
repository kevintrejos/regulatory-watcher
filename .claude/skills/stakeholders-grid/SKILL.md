---
name: stakeholders-grid
description: Use when adding or updating people and organizations in the Locke prototype's Stakeholders view - members of Congress, agency officials, state regulators, grid operators, coalitions. Covers the influence and alignment placement, stance labels cited to the public record, the ask and the route in, and the rule that contact logs stay at staff level. Triggers include "add a stakeholder", "place them on the grid", "what is their stance", "add a coalition", "update the watchlist", "log an interaction".
---

# Stakeholders and the influence grid

Owns `LW.stakeholders` and `LW.orgs` in `data-phase3.js`, plus `LW.members` (the Legislative watchlist) in `data-rest.js`. Read `locke-content-style` and `policy-fact-verification` first.

## Object shape

```js
{
  id: 'schiff',
  name: 'Sen. Adam Schiff (D-CA)',       // formatting rules below
  role: 'California · Sponsor of S. 4559',
  tier: 'Congress',        // Agencies | Congress | States | Grid operators | Coalitions
  stance: 'Aligned',       // Aligned | Mixed | Opposed | No public position
  al: 95,                  // alignment 0 opposed to 100 aligned
  inf: 54,                 // influence over THIS agenda, 0 to 100
  note: '...',             // cited, one or two sentences
  ask: '...',              // what Locke wants from them, stated plainly
  route: '...',            // how Locke gets there, usually staff
  log: [{ date: '2026-09-14', text: '...' }]   // optional, staff level only
}
```

Organizations add `member:` describing the client's membership status, and use it instead of `role`.

## Naming

House gets the district padded to two digits, Senate and governors get party and state, state legislators get party and district with no state, agency officials get no party tag at all.

```
Rep. Bob Latta (R-OH-05)      Sen. Adam Schiff (D-CA)      Gov. Greg Abbott (R-TX)
Asm. Rick Chavez Zbur (D-51)  Sen. Charles Schwertner (R-05)
Chairman Laura Swett          Pablo Vegas, President and CEO, ERCOT
```

Verify every district. Redistricting makes recall unreliable. Independents use their own letter: `Sen. Bernie Sanders (I-VT)`.

## Placing a dot

**Alignment** is toward the client's agenda, not toward a party.

| Range | Meaning |
|---|---|
| 85-100 | On the record for the exact thing the client wants |
| 60-84 | Supports the direction, no record on the specific ask |
| 40-59 | Genuinely mixed, or no record at all |
| 15-39 | On the record against part of it |
| 0-14 | Actively opposed |

**Influence** is over this agenda specifically. A committee chair with no jurisdiction here scores lower than a commissioner who votes on the docket. The test: if this person changed their mind tomorrow, how much would the outcome move?

Labels are positioned absolutely, so check for collisions after adding anyone. Dots above alignment 70 flip their label inward automatically. If two dots still overlap, nudge one by a few points and say nothing, because these are judgment placements, not measurements.

## Stance discipline

`Aligned`, `Mixed` and `Opposed` each require a citable vote, bill, filing or public statement in `note`. If there is none, the label is `No public position`, and that is a perfectly good answer. A watchlist where every person has a confident stance is a watchlist someone made up.

## Contact logs

- Log contact with **offices and organizations**: "Energy staff, Office of Sen. Schiff." Never a meeting, call or relationship with the principal.
- Anything not yet done belongs in `ask` as planned, not in `log` as history.
- An empty log renders as "No contact yet," which is honest and common on a new account.

## Quality bar

- Every tier has at least two entries, or the grid looks lopsided.
- At least a few people carry `No public position`. That is what a real watchlist looks like.
- The `ask` is specific enough to act on: "two paragraphs of modeling language in the transmission draft," not "build the relationship."
- `route` names the actual path in: committee staff, a comment record, a stakeholder process.
