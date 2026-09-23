/* Morning brief: a short stack of action cards, one per thing that needs a decision.
   Slack's speed, with the background Slack never has room for. Depth lives on the detail pages. */
window.LW.roles = {
  ceo: {
    person: 'maya', label: 'CEO',
    brief: {
      signer: 'kevin',
      lede: 'Two windows decide your next two years, and both close before the midterms. Nothing else this week needs you.',
      items: [
        {
          sev: 'act', when: '2026-09-18', whenLabel: 'Comments close 8:00 pm ET',
          title: 'Three days to put Loomwork on the record at NERC',
          why: 'The draft standard CLO-001-1 would make modeled interconnection studies mandatory for every large load in the country [[nerc-ballot|Project 2026-02]]. Alexandra has a comment drafted. It needs Priya’s technical review by Thursday noon.',
          ref: { type: 'r', id: 'nerc-2602' },
          actions: [{ label: 'Approve the filing', toast: 'Approved. Alexandra files before 8:00 pm ET Friday and will send you the confirmation.' }]
        },
        {
          sev: 'act', when: '2026-11-16', whenLabel: 'Operator responses due',
          title: 'The FERC filings that set your market get drafted in October',
          why: 'Five grid operators must answer FERC’s large-load show cause orders by 16 November [[ferc-sc|FERC show cause]] [[stoel-abey|Stoel Rives]]. They write those answers in stakeholder meetings next month, which is where automated study tools are either named as acceptable practice or left out.',
          ref: { type: 'r', id: 'ferc-showcause' },
          actions: [{ label: 'Approve the stakeholder plan', toast: 'Approved. Kevin opens PJM and MISO engagement this week and will report back after the first session.' }]
        },
        {
          sev: 'watch', when: '2026-09-30', whenLabel: 'Governor’s deadline',
          title: 'California’s two data center bills need no action from you',
          why: 'AB 2383 and SB 886 would put new large loads on their own tariffs, and Newsom has until 30 September [[ca-dcd|DCD]]. Either outcome pushes utilities toward sharper load studies, so we recommend watching rather than spending goodwill with your utility customers.',
          ref: { type: 'm', id: 'ca-ab2383' },
          actions: [{ label: 'Alert me when he acts', toast: 'Set. You get one line the moment the Governor signs or vetoes.' }]
        }
      ]
    },
    ask: [
      { q: 'What does FERC’s show cause process mean for us?', by: 'kevin',
        a: 'FERC told the six grid operators under its jurisdiction to justify their large-load rules or change them [[ferc-sc|FERC show cause]]. Five now respond by `16 Nov` [[stoel-abey|Stoel Rives]]. Every filing will need a faster, better-documented way to study large loads, which is what Loomwork sells. The risk is that operators write in manual, in-house processes and lock them in. The opportunity is getting automated studies named as an accepted method. Engage in PJM and MISO stakeholder sessions in October, before drafts close.' },
      { q: 'Should we weigh in on Newsom’s data center bills?', by: 'kevin',
        a: 'No. AB 2383 and SB 886 decide who pays for grid upgrades that serve data centers, not how interconnection studies are done [[ca-dcd|DCD]]. Loomwork gains either way, because separate large-load tariffs push utilities to study those loads more precisely. Weighing in would spend goodwill with utility customers on a fight that is not ours. Watch for the decision by `30 Sep`, then follow CPUC implementation, where study methods actually get defined.' },
      { q: 'What’s our biggest policy risk this quarter?', by: 'kevin',
        a: 'Lock-in. If grid operators answer FERC with manual processes, the market for study automation shrinks for years [[ferc-sc|FERC show cause]]. Second is a data center slowdown: ERCOT is auditing roughly 410 GW of large-load requests, about 87 percent of them data centers [[tx-ci|Community Impact]], and a federal moratorium bill is pending [[s4214|S. 4214]]. Fewer data centers means less urgency to buy. Third is Tapestry, already embedded in PJM’s queue process [[tapestry|DCD]].' }
    ]
  },

  bd: {
    person: 'daniel', label: 'Head of Gov Sales',
    brief: {
      signer: 'bell',
      lede: 'One live teaming opening, one to line up before awards drop, and one we passed on.',
      items: [
        {
          sev: 'act', when: '2026-10-15', whenLabel: 'Before deployment partners are set',
          title: 'DOE’s new grid AI award needs two utility hosts, and you have two',
          why: 'Brookhaven won $11.5 million on 1 September to build grid foundation models, with two utility deployments still unassigned [[gridfm|GridFM 2.0]]. Your PJM customers are the kind of host that award needs, and the lab has not picked yet.',
          ref: { type: 'o', id: 'gridfm' },
          actions: [{ label: 'Request a lab meeting', toast: 'Requested. Marcus will ask for an introduction through DOE’s technology transitions office.' }]
        },
        {
          sev: 'watch', when: '2026-10-31', whenLabel: 'Awards expected Oct to Jan',
          title: 'SPARK winners will need capacity studies, and nobody has asked them yet',
          why: 'DOE is awarding $1.9 billion for reconductoring and advanced transmission technologies [[spark|SPARK]]. Every winner has to show its upgrades added usable capacity, which is a before-and-after study. Get written into award negotiations rather than chasing subcontracts later.',
          ref: { type: 'o', id: 'spark' },
          actions: [{ label: 'Draft teaming outreach', toast: 'Draft requested. Marcus prepares notes for your two PJM utility customers before anything goes out.' }]
        },
        {
          sev: 'fyi', when: '2026-09-10', whenLabel: 'Closed',
          title: 'We passed on the Genesis SBIR, and the reason is the useful part',
          why: 'Loomwork became SBIR-eligible again in April [[sbir|S. 3971]], but the FY26 topics covered biotech, quantum, materials and lab automation, with no grid lane [[genesis-sbir|ConnectWerx]]. Eligibility is not fit. We are watching the FY27 topic list instead.',
          ref: { type: 'o', id: 'genesis-sbir' },
          actions: [{ label: 'Watch FY27 topics', toast: 'Watching. Marcus flags the FY27 topic list the day it posts.' }]
        }
      ]
    },
    ask: [
      { q: 'Are we SBIR-eligible now?', by: 'chen',
        a: 'Probably, with one check. SBIR requires fewer than 500 employees, and Loomwork has about 150. The catch is ownership: majority-VC-owned firms can only compete at agencies that opt in, and the April reauthorization added foreign-risk screening [[sbir|Crowell & Moring]]. Counsel will run the cap table against DOE’s rules before we spend proposal time. If it clears, the new Phase II award of up to $30 million is worth planning around.' },
      { q: 'Which SPARK applicants should we team with?', by: 'bell',
        a: 'DOE has not named winners, and awards are expected between October and January [[spark-hk|Holland & Knight]]. The best targets are utilities in Loomwork’s footprint that applied for reconductoring or advanced transmission projects, because they will need before-and-after capacity studies [[spark|DOE]]. Start with the two PJM utilities you already serve. Ask whether they applied, and offer study support in their award negotiations. Loomwork should not try to prime.' },
      { q: 'When will new DOE solicitations pick up?', by: 'bell',
        a: 'Not before December. The stopgap signed `2 Sep` holds DOE at FY26 levels through `11 Dec` [[cr27|GovCon Wire]]. The House committee’s FY27 Energy and Water bill totals $58.5 billion, $461 million above FY26 [[ew-house|House Appropriations]]. If a full-year bill near that level passes in the lame duck, grid program solicitations likely follow in early 2027. Use the fall for teaming and past-performance write-ups.' }
    ]
  },

  ciso: {
    person: 'priya', label: 'CISO',
    brief: {
      signer: 'chen',
      lede: 'One review due Thursday. One gap worth starting before anyone makes you. Nothing else changed.',
      items: [
        {
          sev: 'act', when: '2026-09-17', whenLabel: 'Your review due Thursday noon',
          title: 'Your technical review is the last step before we file at NERC',
          why: 'CLO-001-1 defines the study and modeling data your utility customers will have to produce, and the comment record closes Friday at 8:00 pm ET [[nerc-ballot|Project 2026-02]]. I need you to check the data requirements against what Loomwork’s models actually output.',
          ref: { type: 'r', id: 'nerc-2602' },
          actions: [{ label: 'Open the draft comment', toast: 'Opening in Briefs, arriving in Phase 3. Alexandra needs your notes by Thursday noon.' }]
        },
        {
          sev: 'watch', when: '2027-06-30', whenLabel: 'Multi-quarter path',
          title: 'FedRAMP is the long pole on every federal deal, and nothing blocks starting',
          why: 'The proposed FAR CUI rule would require FedRAMP Moderate or equivalent for cloud services holding CUI, plus NIST SP 800-171 Rev 3 [[farcui|FAR CUI rule]]. It is not final, but the path takes quarters, and grid data from federal customers is usually marked CUI or CEII.',
          ref: { type: 'r', id: 'far-cui' },
          actions: [{ label: 'Approve the gap assessment', toast: 'Approved. Alexandra sends scope and timeline for the Rev 3 gap assessment by Friday.' }]
        },
        {
          sev: 'fyi', when: '2026-09-13', whenLabel: 'Recommendations delivered',
          title: 'CMMC stays paused, so there is still nothing to buy',
          why: 'Phase 2 assessments were suspended on 13 July and the review team’s recommendations went to the CIO around 13 September [[cmmc|CMMC]]. DFARS 252.204-7012 and the Phase 1 self-assessment still apply, so keep those current and hold the assessment spend.',
          ref: { type: 'r', id: 'cmmc' },
          actions: [{ label: 'Hold the spend', toast: 'Noted. Alexandra flags the moment the CIO decision publishes.' }]
        }
      ]
    },
    ask: [
      { q: 'Does the NERC Level 3 alert apply to us?', by: 'chen',
        a: 'Not directly. Level 3 alerts bind registered entities, and Loomwork is not one [[nerc-l3|DWT]]. NERC has proposed a new Computational Load Entity category, covering loads of 20 MW or more connected at 60 kV with more than 1 MW of IT load [[nerc-cle|Steptoe]], and FERC wants standards finished by year end [[nerc-deadline|NERC]]. Your utility customers must act on the alert, and several of those actions involve studies Loomwork runs. Expect new contract terms and questionnaires in Q4.' },
      { q: 'What does the FAR CUI rule mean for our hosting?', by: 'chen',
        a: 'If Loomwork holds CUI under a federal contract, the systems that touch it would need NIST SP 800-171 Rev 3, and cloud providers storing it would need FedRAMP Moderate or equivalent [[farcui|Greenberg Traurig]]. The rule is still proposed. Grid data from DOE and national lab work is often marked CUI or CEII, so assume that work is in scope and size the gap now, while there is time to fix it.' },
      { q: 'Do we need CMMC now that Phase 2 is paused?', by: 'chen',
        a: 'Only for DoD work, and nothing has changed for current contracts. The 13 Jul suspension paused the third-party assessment requirements that were set to start `10 Nov` [[cmmc|Crowell & Moring]]. DFARS 252.204-7012 and Phase 1 self-assessments still apply. The task force’s recommendations were due around `13 Sep`, and the CIO decides what to adopt. Keep the self-assessment current, and hold off on buying a third-party assessment until the decision lands.' }
    ]
  }
};
