---
name: reporter-watcher
description: Use when working on the watcher/ ingestion tool - the reporter roster, alias tables, post-to-bill matching, the Bluesky or X adapters, or the signals it emits. Covers the jurisdiction gate, the acronym trap, brand-account filtering and X cost control. Triggers include "the watcher", "add a reporter", "alias table", "why did this match", "false positive", "Bluesky", "X API", "poll reporters", "monitor news".
---

# The reporter watcher

Lives in `watcher/`. Zero dependencies, Node 18+. Read `watcher/README.md` first; it carries the operating detail. This file is what to keep in mind while changing it.

## The design in one line

Curated roster of individual reporters, alias table per tracked bill, gated matching, graded signals out in the prototype's `LW.signals` shape.

## The rules that keep precision up

**Every state alias needs a jurisdiction gate.** Federal bill numbers are near-unique; state numbers collide across fifty states. An alias carries `needs`, satisfied by the post text or by the reporter's own beat. Never add a state alias with an empty `needs`.

**Acronyms match case-sensitively, and agency acronyms are excluded.** Matching "GRID" case-insensitively links every post about the electrical grid to the GRID Power Act. This shipped once and produced 34 false positives out of 34. `AGENCY_ACRONYMS` in `aliases.js` holds the exclusions.

**Descriptive titles are not formal titles.** "Ratepayer Protection Act" is a name worth 0.95. "Data center cost allocation" is a tracker's label, worth 0.55 and gated, or it matches every story on the subject.

**Credit the author, never the reposter.** The Bluesky feed mixes in reposts under a different `post.author`. Keep them, label them `amplified by`, and never put a roster reporter's name on another person's words.

**Brand accounts are dropped.** A reporter reposting their own outlet's account is a headline the outlet already published. The value is the individual's own read. `isInstitutional()` in `watch.js`.

## Finding reporters at a given outlet

Two probes, both needed, because they miss different people. `getFollows` on the outlet's own account finds staff the outlet follows (this is how The Hill's were found). `searchActors` on the **bare** outlet name finds the rest (this is how CQ Roll Call's were found).

Never append qualifiers like "reporter" or "congress" to the outlet name in `searchActors`. It degrades the match rather than narrowing it. Doing so once produced the confident and completely wrong conclusion that Punchbowl, The Hill and The Daily Wire had no Bluesky presence, which would have pushed all of Hill trade press onto a paid X budget. The real counts are 5, 7 and 8 (Roll Call).

Always check bios for "Formerly" and "Previously" before adding someone.

## Adding a reporter

Run `discover.js` for candidates, then hand-curate into `roster.json`. Never paste discovery output in directly. Check `selfDescription` on every row: it has misclassified beats and included people who left journalism. Set `weight` by how fast they are on process news, not by how well known they are.

## Adding a press nickname

`aliases.manual.json`, keyed by the prototype item id. This is the highest-value edit available, because no machine can guess that reporters settled on "the data center bill".

## Cost

Bluesky is free and unauthenticated. X is billed per read and polls timelines, because filtered stream needs Pro or Enterprise. `store.js` enforces the monthly budget. Never log or persist `X_BEARER_TOKEN`.

## What it is not

Not a citation source. Everything emitted is `kind: reported`, and a post is a tripwire that says go read the filing. Nothing here is ever graded `confirmed`. See `intelligence-layer` for the grading model.
