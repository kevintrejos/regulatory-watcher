---
name: intelligence-layer
description: Use when adding or editing the Locke prototype's signal log, reporter feeds, or agent review queue - the firm-side tables in data-signals.js holding what Locke knows before the public record says it. Covers the four grades, the handling field, feed licensing, queue flags, and what blocks a send. Triggers include "add a signal", "log a rumor", "the review queue", "approve the draft", "add a feed", "what did we hear", "unverified claim", "intelligence".
---

# The intelligence layer

Three tables in `data-signals.js`. This is the part of the prototype that no public-record GRM has an equivalent for, so it carries the most argument per byte. Load `locke-content-style` first.

## LW.signals

What a Locke person heard, read or watched.

`kind` is how we know it, and it is the spine of the feature:

| Grade | Means | Weight |
|---|---|---|
| `heard` | Someone told us | Weakest, often earliest |
| `reported` | A named outlet published it | Fast, but their verification and not ours |
| `observed` | A Locke person watched it happen | Strong, usually invisible in any filing |
| `confirmed` | Checked against the primary record | The only grade that may be stated as fact |

`handling` is the field that keeps a firm out of trouble. `internal` never leaves Locke. `client` may go into a deliverable with its sourcing attached. `public` is verified and quotable. A low-confidence rumor is `internal`, always.

`conf` is low, med or high. `corrob` lists other signal ids, because two mediocre sources agreeing outrank one good source alone, and the footer says so.

`why` is required. It states what the signal changes about the advice. A signal that changes nothing does not belong in the log.

`ents` links to real prototype objects (`m`, `r` or `o` plus the id). `clients` lists who it reaches. Both are validated - a broken reference renders as a raw id.

### What may never be written here

No private meeting between a real named official and a fictional client. Sources on `heard` entries stay unnamed and staff-level, for example "a registered participant in the standards process". On `reported` entries, describe what the coverage said without inventing a quote or a headline a real outlet never published.

## LW.feeds

Where faster-than-government information comes from. `license` is load-bearing:

- `quote` - free and public. May be cited with attribution.
- `read` - a paid seat. Buys the right to read, never the right to resell. Paid reporting enters as a human-logged takeaway with attribution, and its text never lands in a client deliverable.

Adding a paid feed without setting `read` is a licensing problem, not a data-entry slip.

## LW.queue

Agent drafts waiting on a human. Nothing in it has gone out, which is the entire point.

`flags` decide whether the send button works. `QFLAG` in `app.js` maps each flag to a label, an explanation and a boolean for whether it hard-blocks:

- `unverified-citation` - **blocks the send.** A load-bearing sentence has no source behind it. Keep exactly one of these in the queue. It is the clearest single argument in the prototype and it gets diluted if there are three.
- `single-source` - warns, still sends.
- `position-conflict` - warns, still sends. Use where two clients sit on opposite sides of one docket.

`conf` is 0 to 1 and renders as a percentage. `signals` lists the signal ids the draft was built from, which is what makes human intelligence visibly feed agent output.

`body` uses a blank line between paragraphs and the normal citation tokens. It renders inside a Slack message mock, so hold it to the length a Slack alert would really be.

## Where it appears

`#/queue` and `#/signals`, firm side only. Route guards in `render()` send a client-mode visitor to their digest instead. Never relax those guards: the signal log holds `internal` material by design, and a leak into client view would be the worst bug this prototype could ship.
