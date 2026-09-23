# Regulatory watcher

Monitoring for the layer where rules actually get written: state commissions, environmental agencies, siting boards, air districts, and the councils that new statutes create.

Tracking bills is a solved problem. Tracking the bodies that turn those bills into binding rules is not, because almost none of them publish anything a machine can subscribe to. This is what I found when I went looking, and the plumbing that makes the layer reachable.

Zero dependencies. Node 18 or newer.

```bash
cd watcher
node watch.js --since 30                    # reporters -> tracked bills
node commissions/watch-commissions.js --seed # establish baselines
node commissions/watch-commissions.js        # report only what changed
```

## What it covers

| Layer | Bodies |
| --- | --- |
| State utility regulators | 51, all 50 states and DC |
| State environmental agencies | 51, all 50 states and DC |
| Federal agencies and commissions | 28 |
| Air, water and basin authorities | 10 |
| Siting boards and energy councils | 8 |
| ISOs and RTOs | 7 |
| Reliability entities | 7 |
| **Total** | **162** |

A full sweep reaches 143 of them in 187 seconds and fingerprints 11,928 records with no failures. 15 sit behind bot walls and 3 render client-side; each is kept as a row with the reason, because a bot wall is evidence we cannot read a body, not evidence it does not exist.

**Not one of the first sixteen bodies probed publishes an RSS feed.** There is nothing to subscribe to. That is the whole reason this layer is still covered by a person refreshing a docket page.

## What's here

**`watcher/`** polls a curated roster of 58 reporters and links what they post to specific tracked bills. The alias table is the substance: a reporter writes "the ratepayer bill", never "H.R. 9340". Federal bill numbers are close to unique, state numbers collide fifty ways, so every state alias carries a gate that the post text or the reporter's own beat has to satisfy. See [watcher/README.md](watcher/README.md).

**`watcher/commissions/`** holds the body registry and the adapters that read it. Every row was verified by a live probe rather than asserted, and records the URL after redirects plus the site's own title. `new-bodies.js` reads enacted statutory text for the language that creates a council or board, so a new body enters the registry before its first meeting. See [watcher/commissions/README.md](watcher/commissions/README.md).

**`prototype/`** is a clickable concept of what an agent-native government affairs platform could look like from both sides: the firm covering a book of clients, and a client seeing only what they need. Open `prototype/index.html`. [prototype/GUIDE.md](prototype/GUIDE.md) walks every screen and the reason it exists; [prototype/SPEC.md](prototype/SPEC.md) holds the original decisions.

**`.claude/skills/`** is the skill library the work was built through. Twenty-one files, one per content section or tool, each carrying the rules and the mistakes worth not repeating. It is here because the repeatability is the point: the same process runs again without re-deciding anything.

## Three things that only showed up by running it

**A JavaScript shell usually hides an interface worth having.** FERC's eLibrary looks unscrapeable. Behind it is a service that answers without credentials and returns accession numbers, docket numbers, filing dates and author affiliations already structured. One look at the network panel found it.

**Acronyms have to match case-sensitively.** A case-insensitive match on `GRID` linked "it's very hot in Texas but the grid is fine" to the GRID Power Act. The first run produced 34 bill links and all 34 were wrong.

**Match the watermark to the source.** Set membership works for page diffs. It was wrong for FERC, whose search is relevance-ordered and returns a different subset on every call, so "not in the set we have seen" invented seven filings on a docket that had not changed. Where the source gives a real date, use the date.

## What is not done

- 18 bodies are unreadable without a browser session or a found endpoint. NERC is worth solving first, since ballot deadlines are real deadlines.
- `new-bodies.js` is tested against representative statutory language, not yet wired to a live bill-text feed. That wiring is what turns a detector into a product.
- Local permitting is absent entirely, and for siting fights that is often where the decision gets made.
- The page differ reports that something appeared, not what it means. A human still reads it, which is the right place for a person to sit.

## On the contents

Built by Kevin Trejos as a portfolio piece. Not affiliated with, endorsed by, or built for any firm named in the prototype. The client companies in `prototype/` are fictional. The bills, dockets, agencies and officials are real and cited, accurate as of September 2026, and nothing in here should be relied on as current policy advice.
