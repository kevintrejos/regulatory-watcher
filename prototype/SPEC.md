# Locke for Loomwork: Prototype Spec v0.1

Status: draft for Kevin's review. Nothing built yet.
Date in the prototype: **Tuesday, September 15, 2026**. Last login: Thursday, September 10.

---

## 1. The premise

**The pitch:** Locke as an agent-native government relations platform (GRM). It covers what Quorum, Bloomberg Government, and Politico Pro cover (tracking, stakeholder CRM, search, reporting), but agents do the work: they draft the comment, write the brief, score the RFP. A law firm stands behind every output. Slack and email stay as delivery channels, but the platform is the product.

**The thread through every screen:** Quorum shows you what happened. Locke tells you what to do about it, drafts it, and signs it.

**The client: Loomwork** (fictional)
- San Francisco. Series B, about 150 people.
- AI grid planning and interconnection software. Models interconnection queues, runs automated load and generation studies, and supports transmission planning.
- Customers (generic, never named): two PJM utilities, an ERCOT transmission service provider pilot, a MISO planning pilot, and a national lab research agreement.
- Real-world analog: Tapestry (Google X), which ran its AI platform on PJM's first reformed queue cycle in June 2026. In the prototype, Tapestry is a **named real competitor**.

**Loomwork's policy agenda**
1. **Faster interconnection.** Get FERC, the grid operators, and PUCs to accept automated, AI-run interconnection studies.
2. **Large-load and data center rules.** Become the tool utilities use to study data center load under FERC's show cause orders, Texas SB 6, and the new state tariffs.
3. **Federal money for grid software.** Make DOE programs (SPARK/GRIP, Genesis Mission, SBIR) fund software and planning tools, not just steel.

---

## 2. Cast

**Loomwork (invented), selectable in the role switcher**
| Role | Name | Default landing | Brief signed by |
|---|---|---|---|
| CEO / Co-founder | Maya Okafor | Home | Kevin Trejos, Policy |
| Head of Gov Sales | Daniel Reyes | Contracting | Marcus Bell, Government Contracts |
| CISO / VP Eng | Priya Natarajan | Regulatory | Alexandra Chen, Counsel |

**The Locke account team**
- **Kevin Trejos, Policy Lead.** Owns the account relationship, the legislative work, and the CEO brief. (Your cameo.)
- **Alexandra Chen, Counsel.** Fictional. Signs anything that needs legal judgment: compliance, comments, filings. She's the "A. Chen" from the design system.
- **Marcus Bell, Government Contracts.** Fictional. Owns bid/no-bid calls and the capture work.
- **Locke agents.** They appear in provenance stamps ("Agent-drafted"), never as a person.

Locke is also Loomwork's **registered lobbyist**. The app shows Locke's LD-2 filings for Loomwork and tracks LD-203 obligations.

---

## 3. App shell

- **Left sidebar**
  - Workspace: Home, Legislative, Regulatory, Contracting
  - Relationships: Stakeholders, Advocacy
  - Work: Briefs, Tasks, Analytics
  - Saved searches (3 examples)
  - Settings: Monitoring
- **Top bar:** global search (Cmd+K across bills, rules, people, opportunities), role switcher, theme toggle, About.
- **Footer:** "Unofficial concept prepared by Kevin Trejos. Not affiliated with Locke. Loomwork is fictional."
- **About panel:** why Locke should grow into a platform, what each screen shows, how I'd build it, and the full source list.
- **Detail pages:** bill, rule/docket, opportunity, hearing, person. Each has a timeline, Locke analysis, exposure, next steps, press clips, citations, and provenance.

---

## 4. Screens

### 4.1 Home
**Lead: morning brief.** One per role. Signed, with a provenance stamp. 150 to 200 words.

*CEO brief draft (Kevin signs):*
- **FERC large-load show cause.** The six grid operators got an extension, so their responses are now due **Nov 16**, with answers due Dec 16. That's a two-month window to get "automated study tools" language into the PJM and MISO filings. MISO already filed a reliability framework on Aug 28. Recommend Loomwork engage in PJM stakeholder meetings now.
- **California data center bills.** Newsom has until **Sep 30** to act on AB 2383 and SB 886 (large-load tariffs). Neutral to positive for Loomwork, since separate tariffs mean utilities need better load studies. Recommend watching, not engaging.
- **The appropriations runway.** The stopgap funding bill (CR) signed Sep 2 keeps the government at FY26 levels through **Dec 11**. SPARK awards are expected Oct to Jan. Keep federal funding on the BD track.

*BD brief (Marcus signs):* the featured opportunity (see 4.4), the SPARK teaming window, and SBIR being back (reauthorized Apr 13, 2026, through 2031).

*CISO brief (Alexandra signs):*
- The NERC Level 3 alert on computational loads and Project 2026-02. Loomwork isn't a registered entity, but utility customers will pass new study requirements and CIP-013 vendor questions down to it.
- The FAR CUI proposed rule (Jun 23): NIST 800-171 Rev 3, plus FedRAMP Moderate for cloud providers.
- CMMC Phase 2, suspended Jul 13 pending a 60-day review.

**Modules below the brief**
- **Since Thursday:** a diff of new items, stage changes, new opportunities, and "not relevant" learnings.
- **Next 14 days:** hearings, deadlines, and due dates across all areas.
- **Ask Locke:** three scripted questions per role (list in section 6).

### 4.2 Legislative
- **Tabs:** Federal | State, with a state filter (CA, TX, VA, PA, OH, NJ, MD, and MISO states).
- **Summary figures:** tracked measures, moved this week, hearings in the next 30 days, and "needs a position."
- **Tracker table:** measure, stage pill, jurisdiction, next date, exposure, owner. Filters for stage, topic, and exposure. Target 15 to 30 items.
- **Hearings calendar:** committee, witnesses, and a "submit testimony?" call.
- **Recently enacted (90 days):** each with "what it means for you."
- **Member watchlist:** key members with recent actions.
- **Press clips:** on detail pages, plus a small module here.

Seed items (verified unless noted):
| Item | Status | Why Loomwork cares |
|---|---|---|
| H.R. 4776, SPEED Act (NEPA reform) | Passed House 221-196, Dec 18, 2025. Senate EPW talks | Faster transmission permitting helps customer projects |
| Senate Dem transmission draft (Hickenlooper, Padilla, King, Gallego, Cortez Masto) | Draft | Home-state senator is on it. Chance to push study-automation language |
| Continuing Appropriations and Extensions Act, 2027 | **Enacted Sep 2, 2026**. Funds government through Dec 11 | DOE grid programs flat at FY26 levels. Lame-duck funding fight ahead |
| FY27 Energy-Water approps | House committee approved. Under CR | DOE grid program funding levels |
| H.R. 8800 / S. 4784, FY27 NDAA | In progress | DoD installation energy resilience |
| H.R. 5388, American AI Leadership and Uniformity Act (preemption) | Introduced | Would preempt the CA and CO AI laws that touch Loomwork |
| S. 4214, AI Data Center Moratorium Act | Introduced | Opposed. Demand-side risk to customers |
| S. 3971, SBIR/STTR reauth | **Enacted Apr 13, 2026** | Loomwork is eligible (under 500 employees) |
| CA AB 2383 (Zbur), Fair Share in Energy Act | Governor's desk, **Sep 30** | New large-load tariffs from Jan 1, 2027 |
| CA SB 886, Tech Innovation and Ratepayer Protection Act | Governor's desk, **Sep 30** | CPUC must stop data center cost shifts |
| TX SB 6 (large-load interconnection) | Enacted 2025. PUCT implementing | ERCOT pilot customer impact |
| TX Senate Business & Commerce interim charge on large loads | Interim hearings (Apr 1, July) | 2027 session setup |
| VA 2026 data center package (incl. HB 507) | Enacted, Spanberger amendments | Dominion-area customer impact |
| PA Act 21 of 2026 (load forecast oversight) | Enacted | More scrutiny on utility forecasts to PJM. Loomwork's forecasting is a selling point |
| CO SB 26-189 (ADMT Act) | Enacted May 14. Effective Jan 1, 2027 | Probably out of scope. Shows judgment |
| CA SB 53 (frontier AI) | Enacted 2025 | **Does not apply**, since Loomwork isn't a frontier developer. Shows judgment |

Needs more research: another 6 to 10 federal and state items to reach realistic density, and **real hearings scheduled for late Sep and Oct 2026** (none found yet).

### 4.3 Regulatory
**Top: rules tracker by stage**
| Item | Stage | Next date |
|---|---|---|
| FERC large-load interconnection (RM26-4, plus six show cause orders to PJM, MISO, SPP, CAISO, ISO-NE, NYISO) | Show cause, in abeyance | Responses **Nov 16**. Answers Dec 16 |
| MISO large computational load reliability framework | Filed at FERC Aug 28 | Comment date (verify) |
| NERC Project 2026-02, Computational Loads | Standards drafting | FERC year-end deadline |
| NERC Level 3 alert, computational loads | Issued May 4 | Essential actions for registered entities |
| PUCT 16 TAC §25.194 (SB 6 interconnection standards), Project 58481 | Proposed Mar 12, comments closed Apr 17 | Final adoption pending. PUCT approved changes to ERCOT's large-load review process in June |
| TX Gov. Abbott directive to PUCT and ERCOT on the data center queue | Letter Aug 3. Queue audit underway | Audit results late 2026 |
| PA PUC large-load model tariff | Final order May 13 | Utility tariff filings |
| PJM large load additions (CIFP), Board decision Jan 2026 | FERC filing | Verify |
| DOE 2026 National Transmission Needs Study | Draft | Comment period (verify) |
| FAR CUI proposed rule (new FAR Part 40) | Re-proposed Jun 23. Comments closed Jul 23 (96 filed) | Final rule pending |
| CMMC Phase 2 | Suspended Jul 13. Task force recommendations due about Sep 13 | DoW CIO decision pending. **Live this week** |

**Bottom: compliance obligations** (status: met / due / gap, with an owner)
- **Grid security and data:** CIP-013 supply chain duties passed down by utility customers. CEII handling (18 CFR 388.113). Customer security questionnaires.
- **AI regulation:** CO ADMT Act (likely out of scope, documented). CA ADMT rules. OMB AI memos that bind federal buyers. NIST AI RMF alignment.
- **Federal contractor:** FedRAMP (Moderate path for federal work). NIST 800-171 Rev 3 readiness. CMMC Level 2 (only for DoD work). LD-2 Q3 filing by Locke, due **Oct 20**. LD-203.
- **Export and foreign ownership:** EAR classification (likely EAR99, documented). CFIUS screen on the cap table.

### 4.4 Contracting
- **Summary figures:** open opportunities, strong-fit count, pipeline value, next due date.
- **Four lanes (tabs):** Federal solicitations (SAM.gov fields: notice ID, agency, notice type, NAICS 541511/541512/541715, set-aside, response date) | DOE funding (SPARK as software subrecipient, Genesis Mission, ARPA-E) | Utility and grid operator procurements | SBIR/OTA.
- **Locke layer on every row:** fit score (0 to 100), "why this matters," and a recommended action.

**The wow: opportunity detail.** Built as a bid/no-bid decision page:
1. Notice fields, exactly as SAM.gov shows them.
2. **Fit score** broken into five parts: technical match, past performance, compliance readiness, competition, and strategic value.
3. **Requirements crosswalk.** Each requirement is marked met, partial, or gap, and cited to the solicitation section. Gaps link to compliance items (e.g. "FedRAMP Moderate required. Loomwork: in progress").
4. **Likely competitors,** named from public award history.
5. **Recommendation: Bid, No-bid, or Team.** Marcus signs it, with provenance.
6. **Actions:** "Draft capability statement" (the agent drafts it, with citations and an unverified-citation state) and "Find teaming partners."

**Biggest research risk:** I need a real, live, plausible solicitation for this page. Candidates: BPA, WAPA, TVA, LBNL/i2X, and DOE Office of Electricity. If I can't verify one, the fallback is a clearly labeled "illustrative" notice built on a real agency and program. Your call (see section 8).

### 4.5 Stakeholders
- **Top: 2x2 power grid.** Influence (y) vs. alignment with Loomwork's agenda (x). Dots are clickable.
- **Below: grouped cards by influence tier.** Columns: Congress, Federal agencies, States, Grid operators, Coalitions.
- **Tabs:** Map | People | Organizations | Money & Lobbying.
- **People (real, stance cited to the public record):**
  - FERC: Chair Laura Swett and Commissioners David LaCerte, Lindsay See, David Rosner, and Judy W. Chang
  - DOE Secretary Chris Wright
  - Congress: Sens. Padilla (home state) and Hickenlooper. Sen. Mike Lee (ENR chair). Sen. Heinrich (ENR ranking). Rep. Latta (E&C Energy chair). Rep. Guthrie (E&C chair). Reps. Westerman and Golden (SPEED Act)
  - Texas: Sen. Schwertner. PUCT Chair Thomas Gleeson. ERCOT CEO Pablo Vegas
  - California: Asm. Zbur. Gov. Newsom
  - Governors Shapiro and Spanberger
  - PJM President and CEO David E. Mills (permanent since May 1)
- **Organizations:** WATT Coalition, GridWise Alliance, Advanced Energy United, Data Center Coalition, ESIG, American Clean Power.
- **Money & Lobbying:** Locke's LD-2 filings for Loomwork, plus competitor lobbying from the Senate LDA database (real figures only, or left out).
- **Person page:** stance with citations, recent actions, relevance to Loomwork, and a "Prep me for a meeting" one-pager.

### 4.6 Advocacy
Three campaigns:
1. **PJM and MISO stakeholder push before Nov 16:** get automated study tools named in the show cause responses.
2. **Coalition sign-on to FERC** (with WATT Coalition / Advanced Energy United).
3. **FY27 Energy-Water report language** making grid software eligible for DOE grid programs.

Also a note on calendar realism: Congress is out campaigning in October (midterms Nov 3), so the fly-in waits for the lame duck.

### 4.7 Briefs
A library of 6 to 8 briefs, each with a provenance stamp. Opens in the memo layout from the design system. Filter by author, topic, and status (draft, in review, sent). One brief shows the "2 citations unverified, export blocked" state.

### 4.8 Tasks
A list plus a light board. Assignees from both teams, due dates, and links to items. Check-off persists per viewer.

### 4.9 Analytics and board report
- **Charts:** tracked items by stage over time, exposure by jurisdiction, deadlines by month, and contracting pipeline by stage.
- **"Build Q3 board report":** a printable memo-style page covering the quarter's wins, top risks, what's ahead, Locke activity, and lobbying spend. Prints cleanly to PDF.

### 4.10 Monitoring settings
- Toggles for jurisdictions, agencies, topics, and keywords, plus alert thresholds.
- **Changes actually re-filter the dashboards.** Turn off Texas and the Texas items disappear.
- A "What Locke learned" log built from "Not relevant" clicks.

---

## 5. Design system changes (used as a starting point)
- **Kept:** the achromatic palette, indigo accent, semantic colors, status pill ramp, alert card, citation chip, provenance stamp, square records and rounded controls, and mono for identifiers.
- **Changed:** real Geist from Google Fonts (not the fallbacks), a left sidebar, and denser tables.
- **New components:** sidebar nav, command palette, 2x2 matrix, calendar, charts, fit-score breakdown, requirements crosswalk, and person cards. I'll document each one in the About panel.
- **Theme:** light by default, with a working dark toggle.

---

## 6. Ask Locke (scripted)
- **CEO:** "What does FERC's show cause process mean for us?" / "Should we weigh in on Newsom's data center bills?" / "What's our biggest policy risk this quarter?"
- **BD:** "Are we SBIR-eligible now?" / "Which SPARK applicants should we team with?" / "Bid or no-bid on [featured opportunity]?"
- **CISO:** "Does the NERC Level 3 alert apply to us?" / "What does the FAR CUI rule mean for our hosting?" / "Do we need CMMC now that Phase 2 is paused?"

Each answer: 80 to 120 words, with citation chips and provenance.

---

## 7. Build plan
- **Format:** one published private artifact with multiple files (HTML, app JS, data JS). Hash routing so every view and detail page has its own URL. Per-viewer state (settings, not-relevant clicks, tasks) saved in the browser.
- **Phase 1:** app shell, Home, and Legislative, plus verifying their content. Review with you.
- **Phase 2:** Regulatory, Contracting, and the opportunity detail page.
- **Phase 3:** Stakeholders, Advocacy, Briefs, Tasks, Analytics with the board report, Settings, and About.
- **Research pass in every phase.** Anything I can't verify gets cut or clearly labeled.

---

## 8. Open questions for Kevin

**Answered Sep 15:** (1) staff-level logs and planned asks only; (2) labeled illustrative notice if no live one is found; (3) real LDA figures only; (4) cite-or-"No public position"; (5) full scope; (6) review after Phase 1.


1. **CRM interactions with real officials.** Inventing a meeting between a real commissioner and a fake company is a fabricated record about a real person. **Recommendation:** logs only show staff-level or organization-level touches ("Energy LA, Office of Sen. Padilla"), and meetings with principals appear only as *planned* asks. OK?
2. **The featured RFP.** If no real live solicitation fits, may I use a clearly labeled illustrative notice built on a real agency and program?
3. **Competitor lobbying.** Real LDA figures only, or leave the dollar amounts out?
4. **Stance labels.** I'll label only where there's a citable vote or statement. Everyone else is "No public position." OK?
5. **Scope.** That's 10 views plus 5 detail page types. Should Advocacy and Tasks be lighter (one screen each, no detail pages)?
6. **Phase 1 first.** Want to review the shell and Home before I build the rest?
7. **Anything missing?** Anything you've seen in Quorum, BGov, or Politico Pro that you want included or explicitly left out?
