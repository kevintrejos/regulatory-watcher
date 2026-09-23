# Reporter watcher

Polls a curated roster of individual reporters, links what they post to bills and dockets the clients care about, and emits graded signals in the same shape the prototype's signal log uses.

Zero dependencies. Node 18 or newer.

```bash
node watch.js                # poll everything new since the last run
node watch.js --since 120    # ignore the watermark, look back N days
node watch.js --explain      # also show what was suppressed and why
node watch.js --no-x         # Bluesky only
node discover.js > candidates.json   # find new reporters to consider
```

## What it does, in order

1. Reads the tracked items straight out of `../loomwork-prototype/data-*.js`, so a bill added to the prototype is watched with no second list to maintain. Anything with exposure of 1 or more gets a table.
2. Builds an alias table per item.
3. Polls each reporter on the roster.
4. Drops brand accounts, keeping individual reporting.
5. Matches each post against every alias.
6. Groups matches by item and day, so two reporters naming the same bill corroborate each other.
7. Writes `out/signals.json`.

## The alias table is the whole trick

A reporter writes "the ratepayer bill", never "H.R. 9340". So each item gets the strings a human would actually type, each with a weight and a gate.

The hard problem is namespace collision. Federal bill numbers are close to unique. State numbers collide fifty ways, because `SB 886` is live in most states in most sessions. So every state alias carries a `needs` list, and the match only counts when something satisfies it, from either the post text or the reporter's own beat:

| Post | Reporter | Result |
|---|---|---|
| "SB 886 advanced out of committee" | national | nothing, and it says why |
| "SB 886 advanced out of committee" | Illinois statehouse | the Illinois bill |
| "California SB 886 advanced" | national | the California bill |

That third column is the feature. The same eight words mean three different things.

`aliases.manual.json` holds press nicknames. No machine can guess that reporters settled on calling something "the data center bill", so that is where the human knowledge lives. Adding one is the highest-value edit in this repo.

## Two bugs worth not reintroducing

**Acronyms must match case-sensitively.** The first run linked "it's very hot in Texas but the grid is fine" to the GRID Power Act, and "that is far from settled" to FAR Part 40. An acronym matched case-insensitively is just a common word. Bare agency acronyms (FERC, DOE, NERC) are excluded entirely: a post mentioning FERC is not a post about one docket.

**Credit the author, not the reposter.** The Bluesky feed includes reposts whose `post.author` is somebody else, so a naive read puts your reporter's name on another person's words. Reposts are kept, because one journalist amplifying another is a real signal, but they are labelled `amplified by`.

## What to expect from it

Bill-level links are high precision and low volume. Reporters write prose, not bill numbers, so most days produce a handful at most. The topic radar is the larger half of the value: posts that name no bill but are plainly in your world, which a human triages.

Treat all of it as a tripwire. A post tells you to go look at the filing. It is never the citation. Everything emitted is graded `reported`, never `confirmed`.

## X

Filtered stream is Pro or Enterprise only, and Pro was deprecated in August 2026, so real-time push is not available at a startup price. This polls user timelines instead, where each returned post is a billed read at about $0.005. One reporter posting twenty times a day costs roughly $3 a month.

`store.js` tracks spend against `config.json`'s `monthlyReadBudget` and stops rather than letting you find the overage on an invoice. Set `X_BEARER_TOKEN` in the environment. It is never read from a file and never logged.

`roster-x-todo.json` is the shopping list, and it is now short. Only The Daily Wire, NOTUS and some Politico Pro staff need X. Fill in handles there. **Never invent a handle**: a wrong one silently polls the wrong account and bills you for the privilege.

## Finding reporters at an outlet

Use two probes, and use both. They miss different people.

1. **`getFollows` on the outlet's own account.** Outlets follow their staff. This is how The Hill's reporters were found; a name search returned none of them.
2. **`searchActors` with the bare outlet name.** No qualifiers. This is how CQ Roll Call's staff were found; the follows list was empty.

**Do not append words like "reporter" or "congress" to the outlet name.** It reads like it should narrow the search and it does the opposite: it degrades the match and buries the people you want. An early pass did exactly this and concluded Punchbowl, The Hill and The Daily Wire had no Bluesky presence at all. Punchbowl has five, The Hill has seven, CQ Roll Call has eight. That wrong conclusion would have sent the whole Hill trade press to a paid X budget for no reason.

Check every bio for "Formerly" and "Previously". Several hits had moved to other outlets or left journalism.

## Roster

`roster.json` is curated and is the source of truth. `discover.js` proposes candidates and gets it wrong often enough that its output should never be trusted directly: it has tagged a legal affairs reporter as energy and surfaced someone who had left journalism for a comms job. Read the `selfDescription` on every row before trusting a weight.

`weight` is how fast that person is on process news. Hill trade press sits at 0.85 to 0.9.
