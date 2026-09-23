# Commission and board monitors

The part nobody sells. Every GRM tracks bills. Almost none maintain a living list of which commissions, boards and councils hold authority, what created them, when they meet, and whether they still exist.

```bash
node probe.js                          # what is actually fetchable
node watch-commissions.js --seed       # establish baselines, report nothing
node watch-commissions.js              # report only what changed
node watch-commissions.js --body ferc  # one body
```

## What the probe found

Sixteen real bodies, probed live on 22 September 2026.

- **15 of 16 answered a plain GET.** Only FERC's news page returned 403.
- **Zero RSS feeds.** Not one advertises RSS or Atom. The cheapest possible route does not exist, which is most of the reason this problem is still open.
- **9 server-rendered**, so a plain fetch plus a differ works.
- **5 client-rendered shells**, where a fetch returns markup and no content.
- **ASP.NET WebForms is the dominant platform.** They do not each build their own stack, which is what makes 200 bodies tractable with a handful of adapters rather than 200 scrapers.

## A JS shell usually hides an API

A page that renders client-side has to call something. FERC's eLibrary is an Angular app, and behind it sits `eLibraryWebAPI`, which answers **unauthenticated from a server with no Cloudflare challenge**. It returns accession numbers, docket numbers, filing and issue dates, document class, author affiliations and attachments. That is far better than scraping would ever be.

Finding it took one page load with the network panel open. Do that before writing a scraper for any of the remaining shells.

Two traps in that API:

- The payload is fussy. `searchText` plus paging works. Adding `sortBy`, or passing a bare `docketNumber`, makes the server throw a null reference and return `success: false`.
- The response really does spell it **`acesssionNumber`**, with three s's. Do not "fix" it.

## Two watermark rules

**Seed on first sight.** A body's first poll sees hundreds of records and every one looks new. Emitting those would bury a real change under a false-alert storm. The first poll establishes a baseline and reports nothing.

**Match the watermark to the source.** For page diffing, set membership is right: a link either appeared or it did not. For FERC it is wrong, because search results come back in relevance order and a different subset arrives on each call, so "not in the set we have seen" produced seven phantom filings on a docket that had not changed. Structured dates are the correct watermark there. Rule of thumb: if the source gives you a real date, use the date.

The differ was checked across three consecutive runs. All nine HTML bodies reported zero changes on runs two and three, so there is no session-token churn, which was the main risk with government sites.

## The differ is deliberately dumb

No per-site selectors. Two hundred bodies means two hundred selectors to maintain and every redesign breaks one. Instead it pulls every link that looks like a record rather than furniture, fingerprints it, and compares. Links whose own text carries a date or a docket number are marked `recordish` and rank above the rest.

This tells you something appeared. It does not tell you what it means. That is the honest boundary, and a human or a later pass reads it.

## new-bodies.js

The compounding piece. Enabling statutes are formulaic: "there is hereby created", "shall establish", "to be known as", usually followed by an appointment clause and often a sunset date. Scan enacted bill text and you get a feed of authority coming into existence, months before the body meets.

Confidence rises with corroboration. A phrase match alone scores about 0.65. Add a membership count, an appointment clause and a first-meeting deadline and it reaches 0.97. On a sample AI oversight council it extracted the name, eleven members, the first meeting date, the report deadline and the fact that it can make rules, then produced a registry stub ready to watch.

The inverse matters as much. Bodies get abolished and sunset, and a registry full of dead rows loses trust faster than one with gaps.

**This is tested against representative statutory language, not yet wired to a live bill-text feed.** That wiring is the next step and it is what turns the detector into a product.

## The registry

`registry.json` is the asset. Thirteen bodies today; roughly two hundred belong there. `access` records what the probe actually found rather than what a site claims, so nobody writes a scraper for a page that will never return content.

`cadence` is not a polling optimiser. Polling these is cheap. It is there so silence can be read: no movement on a docket means one thing the week before an open meeting and another in August.
