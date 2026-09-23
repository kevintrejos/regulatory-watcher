---
name: commission-watcher
description: Use when working on watcher/commissions - the registry of regulatory bodies, the FERC eLibrary adapter, the generic HTML change detector, or new-bodies.js which finds commissions and councils as statutes create them. Covers the probe findings, watermark rules and cold-start seeding. Triggers include "commission", "PUC", "docket", "FERC", "regulatory body", "new board", "AI council", "registry", "scrape a commission".
---

# Commission monitors

`watcher/commissions/`. Read its README first for operating detail. This is what to keep in mind while changing it.

## Probe before you build

`probe.js` answers the only question that matters up front: is a body server-rendered, a JS shell, or blocked. Nine of sixteen are server-rendered, five are shells, and **none of sixteen publish RSS**. Never assume a feed exists.

## A JS shell hides an API, so look before scraping

FERC's eLibrary is an Angular app whose `eLibraryWebAPI` answers unauthenticated from a server. One page load with the network panel open found it, and it returns better data than any scrape. Do the same for Ohio PUCO, NY DPS and NERC before writing a scraper for them.

FERC payload traps: `searchText` plus paging works; `sortBy` or a bare `docketNumber` makes the server throw. The response spells it `acesssionNumber`, with three s's, and that is not a typo to fix.

## Watermark rules

**Seed on first sight.** A cold poll sees everything as new. The first run sets a baseline and emits nothing, or a real change drowns in a false-alert storm.

**Match the watermark to the source.** Set membership for page diffs, because a link either appeared or it did not. Dates for anything relevance-ordered. FERC search returns a different subset per call, so set membership invented seven filings on an unchanged docket. If the source gives a real date, use the date.

## The differ stays dumb on purpose

No per-site selectors: 200 bodies means 200 selectors and every redesign breaks one. Extract link-shaped records, drop furniture, fingerprint, diff. It reports that something appeared, never what it means.

Verify any change to it across three consecutive runs. Runs two and three must report zero, or the site is leaking session tokens into links and every poll will look new.

## new-bodies.js

Scans statutory text for creation language and emits registry stubs. Confidence scales with corroboration: a bare phrase is 0.65, a phrase plus membership, appointment and a first-meeting deadline is 0.97. Track abolition and sunset too, because stale rows cost more trust than missing ones.

Currently tested on representative statutory language only. Wiring it to a live bill-text feed is the outstanding work.

## The registry is the point

`registry.json` is the asset, not the scrapers. `access` records what the probe found, not what a site claims. `cadence` exists to make silence readable, not to save polling cost, which is negligible.
