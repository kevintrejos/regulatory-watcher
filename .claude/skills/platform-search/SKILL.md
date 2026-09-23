---
name: platform-search
description: Use when changing how search works in the Locke prototype - what gets indexed, how results rank, the palette UI, or the retrieval design in search.js. Covers BM25F field weights, the two-arm fusion, document priors, field filters, and how to add a new object type to the corpus. Triggers include "search is wrong", "add X to search", "ranking", "the palette", "BM25", "why is this result first", "typeahead".
---

# Search

`search.js` is a standalone module with no dependency on `LW`. It takes an array of documents and returns an index. `app.js` builds the documents in `searchCorpus()` and calls it from the palette. Keep that separation - it is what makes the retrieval testable in `node` without a browser.

## The design

Two retrieval arms fused with Reciprocal Rank Fusion, which is the shape production hybrid search converged on.

**Arm A, BM25F.** Lexical. Catches bill numbers, member names and statutory phrasing. Fields carry separate weights and separate length normalisation:

| Field | Weight | b |
|---|---|---|
| `ident` | 6.0 | 0.30 |
| `title` | 3.2 | 0.75 |
| `sub` | 1.8 | 0.75 |
| `meta` | 1.4 | 0.60 |
| `body` | 1.0 | 0.80 |

An identifier match outranks a body match by a wide margin, because someone typing `RD26-7` wants that docket and not the eleven documents that mention it in passing. The squashed identifier (`rd267`) is indexed as its own token so punctuation never splits it.

**Arm B, fuzzy.** Character trigrams over title, ident and sub. In a real deployment this arm is a dense vector index over chunked text; the fusion code does not care which, because RRF ranks by position and never reads the scores.

**Fusion.** `1 / (60 + rank)`, summed. Never average the raw scores. BM25 is unbounded positive and cosine similarity lives in [-1, 1], so averaging lets whichever arm has the larger numeric range silently win every query.

## Two things that were wrong once

**Use containment, not Dice, for the fuzzy arm.** Dice divides by the size of both trigram sets, so a short query against a long title scores low no matter how completely it is contained. `ratepayr` inside "Ratepayer Protection Act" returned nothing under Dice and ranks first under containment at a 0.55 threshold.

**Set a document prior on short records.** A person's one-line note is short, so BM25 length normalisation flatters it against a bill's full analysis. A query for a policy concept was returning a senator ahead of the signal that actually discussed it. `prior` on the doc fixes it without touching term statistics: people and orgs 0.85, tasks and pages 0.8, everything else 1.

## Adding an object type

In `searchCorpus()`, push a doc with `id`, `type`, `title`, `href` and `filters.type` as a slug. Fill `ident` only for things with a real identifier. Put display text in `sub` and searchable prose in `body`. Set `prior` only to demote. Then add the type to the `PAGES` list if it deserves its own destination.

The index is built lazily and cached in `SIDX`. Any action that mutates data the corpus reads must null `SIDX`, as the queue actions do.

## Field filters

`type:docket`, `state:ca`, `client:loomwork`. Multi-word values need quotes (`type:"state bill"`), which is why filter values are slugs. Parsing strips them from the query before tokenising.

## Performance

Roughly 200 documents, about 0.7ms per warm query, index build on first keystroke. If the corpus ever passes a few thousand documents, the prefix walk is the first thing to bound, not BM25.

## Checking a ranking complaint

Run it in `node` against a handful of documents before touching weights. Most ranking surprises are a field assignment problem, not a scoring problem: text that should be in `title` sitting in `body`, or an identifier that never made it into `ident`.
