# What's in the prototype, and why

A walkthrough of every screen and the decision behind it. Open `index.html` in a browser, or use the hosted link.

The prototype has two sides. It opens on the **firm view**, where one policy person covers a book of five clients. The sidebar switch drops you into the **client view**, which is what a client actually sees. Almost every design decision here comes from that split: the firm needs depth, the client needs one thing to do.

---

## The 60-second path

If someone only has a minute, this is the order that makes the argument:

1. **Portfolio** — one person, five clients, who needs attention today
2. **Review queue** — six agent drafts, none sent, one with its send button disabled
3. **Impact** — a single FERC order mapped across the whole book, including two clients on opposite sides
4. **View as a client** → pick Kestrel Autonomy — their entire product is one page

---

## The firm side

### Portfolio
Every client with a health dot, open action count, and what's next. **Why:** a firm's real question at 8am is not "what happened" but "which account needs me today," and no bill tracker answers that.

### Impact
One policy event, every client it touches, in a matrix. It includes a disclosed position conflict where two clients want opposite outcomes on the same docket. **Why:** the leverage of a firm over an in-house hire is seeing one event hit five accounts at once. The conflict is there because a firm that never surfaces one isn't looking.

### Review queue
Agent-drafted alerts and memos waiting on a human, with the Slack message each would become. One carries an unverified-claim flag and its Approve and Schedule buttons are disabled. **Why:** "AI-native" only works if a human stays in the path, and the blocked button is that policy made mechanical rather than promised in a deck.

### Signal log
What Locke knows before the public record says it, graded four ways by how we know it, from *heard* to *confirmed*. Each entry also carries a handling rule: internal only, client-releasable, or attributable. **Why:** the most valuable thing a lobbyist knows is usually not in a filing yet, and a rumor that's useful internally is a liability in a client deliverable. The handling field is what keeps a firm out of trouble.

### Client tools
Stakeholders, advocacy campaigns, disclosures, the briefs library, tasks, analytics and monitoring settings. **Why:** these all used to sit on the client side. They moved here because they're how the work gets done, not what the client needs to see.

### Stakeholders
An influence-by-alignment grid plus grouped cards, with each person's stance cited to the public record and the ask written out. **Why:** a stakeholder list that doesn't say what you want from someone is a contact list. The grid makes the two questions that matter, how much they matter and whether they're with you, readable at a glance.

### Briefs
Everything Locke has written, each stamped with author, reviewer and source count. One is blocked from export because it has unverified citations. **Why:** the provenance stamp is the product for a firm selling law-firm-grade work, and the blocked brief proves the stamp has teeth.

### Analytics and the board report
Four charts and a printable quarterly report. **Why:** every GR budget gets questioned once a year. The report exists so the answer isn't assembled from scratch each time.

---

## The client side

### Two access tiers
Clients with seats get four screens. Slack-only clients get one page. **Why:** most of these companies have nobody running government affairs, and handing them a twelve-module platform guarantees they log in once. Route guards enforce the tier, so a Slack-only client can't land on a screen they don't have.

### Brief
The home screen. A signed one-line lede, then up to three action cards, each with a severity pill, a deadline, two sentences of background with source chips, and exactly two controls: the action and "Not relevant." **Why:** it's modeled on Locke's existing Slack alerts, not on a memo. The point is to act in thirty seconds, not to assign homework. Long analysis lives one click away.

### What's moving
Bills and agency dockets merged into one tracker with a type filter. **Why:** the distinction between a bill and a docket matters enormously to Locke and not at all to the client. The summary strip still shows how many are dockets, because that's where the binding rules actually get written.

### Obligations
What the company owes, when, who owns it, and which rule created it. **Why:** compliance deadlines are the one thing a client will genuinely lose money by missing, and they're usually tracked in someone's inbox.

### Opportunities
Federal solicitations scored on a five-part fit, ending in a bid or no-bid recommendation with a requirements crosswalk. **Why:** "here's an RFP" is not advice. The call, with the reasoning shown, is.

### The digest
The single page a Slack-only client gets: what needs a decision, what's coming, and what Locke has done since January. **Why:** it answers the three questions a client without a GR person actually has, and nothing else.

### Role switcher
The same week seen as CEO, Head of Government Sales, or CISO. **Why:** the brief that matters to a CISO is not the one that matters to a sales lead, and a single shared dashboard serves neither.

---

## Throughout

### Search
`⌘K` or `/` opens it. Ranked retrieval across bills, dockets, people, briefs, signals and pages, with filters like `type:docket` and `state:ca`. **Why:** every serious research tool opens with a search box, and a substring filter isn't one. It also tolerates misspellings, because people type `ratepayr`.

### Citations
Every factual claim carries a source chip linking to the primary document. **Why:** the standard a policy firm sells is that its work survives being checked. Unsourced sentences are treated as a defect, not a style choice.

### Provenance stamps
Agent-drafted at a time, reviewed by a named person, N sources verified. **Why:** a client should be able to see which parts a machine wrote and who signed off, without asking.

### Monitoring settings
Jurisdiction and topic toggles that actually re-filter the app, plus a log of what the agents learned from dismissals. **Why:** a settings page that doesn't change anything is a lie, and the learning log shows the system gets quieter as it's corrected.

### Keyboard
`G` then a key jumps between sections, `J` and `K` move down a list, `Enter` opens, `?` shows the map. **Why:** built for someone who lives in this tool every morning, not someone visiting it.

---

## What's deliberately missing

**Fabricated relationships.** No meeting between a real official and the fictional client. Contact logs stay at staff level, and stances are cited to the public record.

**Invented numbers.** Dollar figures, notice IDs and positions are either real and cited or labeled illustrative.

**A production backend.** Everything is client-side with data files. The live ingestion lives in `../watcher/`, which is where the real work is.
