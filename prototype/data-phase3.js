/* Phase 3: stakeholders, advocacy, disclosures, briefs, tasks, analytics, settings.
   Real people and organizations, with stance cited to the public record.
   Interactions are logged at staff and organization level only. Meetings with principals appear only as planned asks. */
(function (LW) {
  Object.assign(LW.sources, {
    'watt': { label: 'WATT Coalition', title: 'WATT Coalition, working for advanced transmission technologies', pub: 'WATT Coalition', url: 'https://watt-transmission.org/' },
    'aeu-report': { label: 'AEU report', title: 'Transmission grid connection processes improving, but still too slow and unpredictable', pub: 'Advanced Energy United', date: '2026-06-01', url: 'https://advancedenergyunited.org/press-releases/interconnection-progress-report-june2026/' },
    'aeu-ud': { label: 'Utility Dive', title: 'Grid operators making significant progress on generator interconnection reform: AEU', pub: 'Utility Dive', url: 'https://www.utilitydive.com/news/generator-interconnection-reform-ferc-spp-miso-pjm/823613/' },
    'gridwise': { label: 'GridWise Alliance', title: 'Grid Modernization Index 2026: key indicators for a changing grid', pub: 'GridWise Alliance', url: 'https://gridwise.org/grid-modernization-index-2026-key-indicators-for-a-changing-grid/' },
    'multistate-rp': { label: 'MultiState', title: 'State data center ratepayer protection bills: comparing five approaches', pub: 'MultiState', date: '2026-06-04', url: 'https://www.multistate.us/insider/2026/6/4/how-states-are-requiring-data-centers-to-pay-for-grid-expansion-comparing-ratepayer-protection-bills-across-five-states' },
    'ferc-rm26-page': { label: 'RM26-4 docket', title: 'Interconnection of large loads to the interstate transmission system, Docket RM26-4-000', pub: 'FERC', url: 'https://www.ferc.gov/rm26-4' }
  });

  /* ---------------- stakeholders ---------------- */
  /* al: alignment with Loomwork's agenda, 0 opposed to 100 aligned. inf: influence over it, 0 to 100. */
  LW.stakeholders = [
    { id: 'swett', name: 'Laura Swett', role: 'Chairman, FERC', tier: 'Agencies', stance: 'Aligned', al: 72, inf: 96,
      note: 'Said FERC wants to bring innovation to interconnection and the studies behind it, and stood up a task force on grid-enhancing technologies [[ud-swett|Utility Dive]].',
      ask: 'That automated study methods be named as acceptable practice in the large-load orders.', route: 'Through the RM26-4 comment record, not directly [[ferc-rm26-page|RM26-4 docket]].',
      log: [{ date: '2026-09-08', text: 'Locke filed comments for Loomwork in the DOE Needs Study record, which FERC staff read.' }] },
    { id: 'chang', name: 'Judy W. Chang', role: 'Commissioner, FERC', tier: 'Agencies', stance: 'No public position', al: 52, inf: 84,
      note: 'Testified at July oversight alongside the full Commission. Economist by background, focused on transmission planning and investment [[enr-ferc|ENR hearing]].',
      ask: 'None yet. Watch her questions in the show cause proceeding.', route: 'Public record only.' },
    { id: 'rosner', name: 'David Rosner', role: 'Commissioner, FERC', tier: 'Agencies', stance: 'No public position', al: 55, inf: 80,
      note: 'Part of the unanimous action directing the six grid operators to justify or reform large-load rules [[ferc-sc|FERC show cause]].', ask: 'None yet.', route: 'Public record only.' },
    { id: 'wright', name: 'Chris Wright', role: 'Secretary of Energy', tier: 'Agencies', stance: 'Aligned', al: 68, inf: 92,
      note: 'Directed FERC to open the large-load interconnection rulemaking on an accelerated schedule [[ferc-rm26|FERC]]. His department funds the AI-for-interconnection work [[ai4ix|AI4IX]].',
      ask: 'That DOE grid programs treat planning and study software as fundable.', route: 'Through Office of Electricity staff and the FY27 appropriations record.',
      log: [{ date: '2026-09-04', text: 'Locke requested a briefing slot with Office of Electricity program staff. Pending.' }] },
    { id: 'schiff', name: 'Sen. Adam Schiff (D-CA)', role: 'California · Sponsor of S. 4559', tier: 'Congress', stance: 'Aligned', al: 95, inf: 54,
      note: 'Sponsors the only bill directing FERC to require AI and automation practices in interconnection queues [[s4559|S. 4559]]. Home-state senator for Loomwork.',
      ask: 'Add cosponsors before the lame duck, and reference the bill in the FERC record.', route: 'Energy staff in the Washington office.',
      log: [{ date: '2026-09-14', text: 'Kevin drafted an introduction to energy staff. Awaiting Maya’s approval to send.' }] },
    { id: 'apadilla', name: 'Sen. Alex Padilla (D-CA)', role: 'California · Energy and Natural Resources', tier: 'Congress', stance: 'Aligned', al: 80, inf: 62,
      note: 'One of the Democrats behind the Senate transmission draft [[ee-dems|E&E News]]. Not to be confused with California state Sen. Steve Padilla.',
      ask: 'Two paragraphs of modeling and study language in the transmission draft.', route: 'Committee staff, before introduction.' },
    { id: 'heinrich', name: 'Sen. Martin Heinrich (D-NM)', role: 'Ranking member, Energy and Natural Resources', tier: 'Congress', stance: 'Aligned', al: 78, inf: 72,
      note: 'Introduced S. 5008 to require connect-and-manage interconnection [[pv-s5008|pv magazine]], which would create demand for curtailment-risk modeling.',
      ask: 'Curtailment forecasting named in any connect-and-manage rulemaking.', route: 'Committee staff.' },
    { id: 'lee', name: 'Sen. Mike Lee (R-UT)', role: 'Chairman, Energy and Natural Resources', tier: 'Congress', stance: 'No public position', al: 46, inf: 76,
      note: 'Controls the committee calendar that any Senate interconnection bill must pass through. No stated view on study automation.', ask: 'None yet.', route: 'Committee staff.' },
    { id: 'latta', name: 'Rep. Bob Latta (R-OH-05)', role: 'Chair, E&C Subcommittee on Energy', tier: 'Congress', stance: 'No public position', al: 54, inf: 64,
      note: 'Chaired the April hearing on AI and the grid [[ec-aigrid|E&C]] and pushed the Ratepayer Protection Act to full committee.', ask: 'None yet.', route: 'Subcommittee staff.' },
    { id: 'sanders', name: 'Sen. Bernie Sanders (I-VT)', role: 'Sponsor, S. 4214', tier: 'Congress', stance: 'Opposed', al: 14, inf: 58,
      note: 'His moratorium bill would slow the data center growth that drives demand for large-load studies [[s4214|S. 4214]].', ask: 'None. Track cosponsors only.', route: 'No engagement recommended.' },
    { id: 'gleeson', name: 'Thomas Gleeson', role: 'Chairman, Public Utility Commission of Texas', tier: 'States', stance: 'Mixed', al: 58, inf: 86,
      note: 'Runs the SB 6 rulemaking and, with ERCOT, the data center queue audit the Governor ordered [[abbott|Abbott letter]] [[puct-58481|PUCT 58481]].',
      ask: 'That the final §25.194 rule recognize automated study methods.', route: 'Through the Project 58481 comment record.' },
    { id: 'vegas', name: 'Pablo Vegas', role: 'President and CEO, ERCOT', tier: 'Grid operators', stance: 'Mixed', al: 64, inf: 82,
      note: 'Briefed the Texas Senate on interconnection requests in July [[tx-kxan|KXAN]]. ERCOT is tracking roughly 410 GW of large-load requests [[tx-ci|Community Impact]].',
      ask: 'A briefing on study automation while the queue audit is running.', route: 'ERCOT stakeholder relations.',
      log: [{ date: '2026-09-12', text: 'Locke asked ERCOT stakeholder relations for a briefing slot. No date yet.' }] },
    { id: 'mills', name: 'David E. Mills', role: 'President and CEO, PJM', tier: 'Grid operators', stance: 'No public position', al: 52, inf: 90,
      note: 'Permanent CEO since 1 May [[pjm-mills|PJM]]. PJM already runs Tapestry’s platform on part of its queue [[tapestry|DCD]], which makes PJM the hardest and most valuable room to be in.',
      ask: 'None directly. Work the stakeholder process.', route: 'PJM stakeholder committees.' },
    { id: 'abbott', name: 'Gov. Greg Abbott (R-TX)', role: 'Governor of Texas', tier: 'States', stance: 'Mixed', al: 42, inf: 90,
      note: 'Ordered the PUCT and ERCOT to audit the data center queue and paused some approvals until it finishes [[abbott|Abbott letter]].', ask: 'None. The audit is the opportunity.', route: 'Not engaged.' },
    { id: 'shapiro', name: 'Gov. Josh Shapiro (D-PA)', role: 'Governor of Pennsylvania', tier: 'States', stance: 'Mixed', al: 60, inf: 70,
      note: 'Signed Act 21, putting utility load forecasts sent to PJM under PUC review [[pa-act21|Utility Dive]]. Better forecasting is now a compliance need in Pennsylvania.',
      ask: 'None. Customer-level opportunity, not a government ask.', route: 'Not engaged.' },
    { id: 'schwertner', name: 'Sen. Charles Schwertner (R-05)', role: 'Chair, Texas Senate Business and Commerce', tier: 'States', stance: 'Mixed', al: 40, inf: 72,
      note: 'Leads the large-load interim study and called on the PUCT to deny the 765-kV transmission applications [[tx-kxan|KXAN]]. Skeptical of new transmission, which raises the value of using the existing grid harder.',
      ask: 'Written input to the interim report before it is final.', route: 'Committee staff.' }
  ];

  LW.orgs = [
    { id: 'watt', name: 'WATT Coalition', tier: 'Coalitions', stance: 'Aligned', al: 90, inf: 56, member: 'Not a member. Technology membership is open to companies developing grid-enhancing technologies.',
      note: 'The only organization working exclusively on grid-enhancing technologies, and an active filer at FERC in 2026, including on large-load interconnection [[watt|WATT Coalition]].',
      ask: 'Join as an associate member, then co-sign on the show cause record.' },
    { id: 'aeu', name: 'Advanced Energy United', tier: 'Coalitions', stance: 'Aligned', al: 74, inf: 70, member: 'Not a member.',
      note: 'Published a June progress report on interconnection reform [[aeu-report|AEU report]] and argues against fast-track carve-outs, preferring to speed the whole queue [[aeu-ud|Utility Dive]].',
      ask: 'Alignment on automated studies as a queue-wide fix rather than a carve-out. Their position and Loomwork’s fit together.' },
    { id: 'gridwise', name: 'GridWise Alliance', tier: 'Coalitions', stance: 'Aligned', al: 70, inf: 60, member: 'Not a member.',
      note: 'Washington-based, pairs utilities with technology providers and publishes the Grid Modernization Index across all 50 states [[gridwise|GridWise Alliance]].',
      ask: 'Membership is the cheapest route to the utility planning staff Loomwork sells to.' },
    { id: 'dcc', name: 'Data Center Coalition', tier: 'Coalitions', stance: 'Mixed', al: 44, inf: 76, member: 'Not a member, and should not be.',
      note: 'Represents data center operators in the cost-allocation fights now running in at least 18 states [[multistate-rp|MultiState]]. Their interest in faster interconnection matches Loomwork’s. Their interest in avoiding cost responsibility does not.',
      ask: 'None. Stay visibly separate from the cost fight.' }
  ];

  /* ---------------- advocacy ---------------- */
  LW.campaigns = [
    { id: 'showcause', title: 'Get automated studies named in the show cause responses', sev: 'act', owner: 'kevin',
      goal: 'When five grid operators file on 16 November, at least two should describe automated study methods as acceptable practice.',
      targets: ['PJM stakeholder process', 'MISO stakeholder process', 'FERC record, RM26-4'],
      steps: ['Scoped', 'Drafted', 'Filed', 'Meetings held', 'Language landed'], at: 1,
      assets: ['Draft stakeholder comment', 'Two-page technical explainer', 'ERCOT pilot timing results'],
      next: { date: '2026-11-16', label: 'Operator responses due' },
      note: 'The highest-value campaign of the year. Drafting happens in October, so the window to influence text closes before the filing date [[ferc-sc|FERC show cause]].' },
    { id: 'nerc', title: 'Put Loomwork on the NERC record', sev: 'act', owner: 'chen',
      goal: 'File a comment on CLO-001-1 arguing that required study data should be producible by automated methods.',
      targets: ['NERC Project 2026-02 record'],
      steps: ['Scoped', 'Drafted', 'Technical review', 'Filed', 'Cited in response'], at: 2,
      assets: ['Draft comment', 'Data-output mapping from Loomwork models'],
      next: { date: '2026-09-18', label: 'Comments close 8:00 pm ET' },
      note: 'Blocked on Priya’s technical review. Alexandra files Friday afternoon [[nerc-ballot|Project 2026-02]].' },
    { id: 'approps', title: 'FY27 report language on grid software eligibility', sev: 'watch', owner: 'bell',
      goal: 'Report language directing DOE to treat planning and study software as eligible under grid programs.',
      targets: ['House Energy and Water subcommittee staff', 'Senate counterparts'],
      steps: ['Scoped', 'Language drafted', 'Champion found', 'Submitted', 'Included'], at: 1,
      assets: ['One-page ask', 'Precedent from the AI for Interconnection program'],
      next: { date: '2026-12-11', label: 'Stopgap expires' },
      note: 'Members are home campaigning in October, so the real work is the lame duck. A fly-in before 3 November would waste the travel [[cr27|CR to 11 Dec]].' }
  ];

  /* ---------------- disclosures ---------------- */
  LW.disclosures = {
    registrant: 'Locke Government Affairs, on behalf of Loomwork',
    filings: [
      { id: 'ld2-q3', form: 'LD-2', period: 'Q3 2026', status: 'due', due: '2026-10-20', issues: ['Electric utility interconnection, RM26-4', 'DOE appropriations, FY27', 'Reliability standards for computational loads'], note: 'In preparation. No covered official contacts to report this quarter, because engagement so far has been staff-level and through public records.' },
      { id: 'ld2-q2', form: 'LD-2', period: 'Q2 2026', status: 'met', due: '2026-07-20', issues: ['Electric utility interconnection', 'DOE appropriations, FY27'], note: 'Filed on time.' },
      { id: 'ld203-h1', form: 'LD-203', period: 'First half 2026', status: 'met', due: '2026-07-30', issues: ['Semiannual contributions report'], note: 'Filed. No reportable contributions.' },
      { id: 'ld203-h2', form: 'LD-203', period: 'Second half 2026', status: 'monitor', due: '2027-01-30', issues: ['Semiannual contributions report'], note: 'Not yet due.' }
    ],
    competitors: 'Locke checked the federal lobbying database on 15 September 2026 and found no current registration for Enverus or Tapestry [[lda|LDA database]]. Alphabet, Tapestry’s parent, lobbies federally across many issues, and Locke does not attribute any portion of that spending to grid policy without a filing that says so. This row stays empty rather than estimated.'
  };

  /* ---------------- briefs ---------------- */
  LW.briefs = [
    { id: 'br-nerc', title: 'Comment on CLO-001-1, computational load studies', date: '2026-09-15', author: 'chen', reviewer: 'priya', status: 'In review', sources: 6, unverified: 0, note: 'Awaiting Priya’s technical review before Friday’s deadline.', ref: { type: 'r', id: 'nerc-2602' } },
    { id: 'br-needs', title: 'Filed comment, draft 2026 National Transmission Needs Study', date: '2026-09-08', author: 'kevin', reviewer: 'chen', status: 'Filed', sources: 9, unverified: 0, note: 'Argued that constraint analysis should use the automated methods FERC is pushing operators toward.', ref: { type: 'r', id: 'needs-study' } },
    { id: 'br-bid', title: 'Bid recommendation, interconnection study automation pilot', date: '2026-09-05', author: 'bell', reviewer: 'kevin', status: 'Sent', sources: 7, unverified: 0, note: 'Recommends bidding, with FedRAMP as the binding constraint.', ref: { type: 'o', id: 'oe-pilot' } },
    { id: 'br-showcause', title: 'What the FERC show cause orders mean for Loomwork', date: '2026-08-27', author: 'kevin', reviewer: 'chen', status: 'Sent', sources: 11, unverified: 0, note: 'The account’s foundational memo. Everything on Home traces back to it.', ref: { type: 'r', id: 'ferc-showcause' } },
    { id: 'br-sb53', title: 'Applicability memo, California SB 53', date: '2026-09-03', author: 'chen', reviewer: 'kevin', status: 'Sent', sources: 4, unverified: 0, note: 'Concludes the frontier AI law does not reach Loomwork’s models.', ref: { type: 'm', id: 'ca-sb53' } },
    { id: 'br-ercot', title: 'ERCOT queue audit: what 410 GW actually means', date: '2026-08-21', author: 'kevin', reviewer: 'bell', status: 'Draft', sources: 5, unverified: 2, note: 'Two figures in the draft trace to a secondary source. Export is blocked until Locke confirms them against the ERCOT filing.', ref: { type: 'r', id: 'puct-25194' } },
    { id: 'br-q3', title: 'Q3 board report, government affairs', date: '2026-09-15', author: 'kevin', reviewer: 'chen', status: 'Draft', sources: 14, unverified: 0, note: 'Built from this quarter’s tracked items. Opens in Analytics.', ref: { type: 'page', href: '#/report' } },
    { id: 'br-compliance', title: 'Federal contracting readiness: the FedRAMP decision', date: '2026-08-14', author: 'chen', reviewer: 'priya', status: 'Sent', sources: 6, unverified: 0, note: 'Lays out the cost and timeline of the path Loomwork has not started yet.', ref: { type: 'r', id: 'far-cui' } }
  ];

  /* ---------------- tasks ---------------- */
  LW.tasks = [
    { id: 't1', title: 'Technical review of the NERC draft comment', owner: 'priya', due: '2026-09-17', done: false, ref: { type: 'r', id: 'nerc-2602' }, from: 'Alexandra Chen' },
    { id: 't2', title: 'File comment on CLO-001-1 before 8:00 pm ET', owner: 'chen', due: '2026-09-18', done: false, ref: { type: 'r', id: 'nerc-2602' }, from: 'Locke' },
    { id: 't3', title: 'Approve the PJM and MISO stakeholder plan', owner: 'maya', due: '2026-09-17', done: false, ref: { type: 'r', id: 'ferc-showcause' }, from: 'Kevin Trejos' },
    { id: 't4', title: 'Ask Brookhaven for a GridFM 2.0 introduction', owner: 'bell', due: '2026-09-22', done: false, ref: { type: 'o', id: 'gridfm' }, from: 'Daniel Reyes' },
    { id: 't5', title: 'Confirm SPARK applications with both PJM utility customers', owner: 'daniel', due: '2026-09-25', done: false, ref: { type: 'o', id: 'spark' }, from: 'Marcus Bell' },
    { id: 't6', title: 'Scope the NIST 800-171 Rev 3 gap assessment', owner: 'priya', due: '2026-09-30', done: false, ref: { type: 'r', id: 'far-cui' }, from: 'Alexandra Chen' },
    { id: 't7', title: 'Cap table screen for SBIR and DOE eligibility', owner: 'chen', due: '2026-10-31', done: false, from: 'Marcus Bell' },
    { id: 't8', title: 'Prepare the Q3 LD-2 filing', owner: 'kevin', due: '2026-10-20', done: false, from: 'Locke' },
    { id: 't9', title: 'File comments in the DOE Needs Study record', owner: 'kevin', due: '2026-09-08', done: true, ref: { type: 'r', id: 'needs-study' }, from: 'Locke' },
    { id: 't10', title: 'Send the SB 53 applicability memo to Priya', owner: 'chen', due: '2026-09-03', done: true, ref: { type: 'm', id: 'ca-sb53' }, from: 'Locke' },
    { id: 't11', title: 'Add Ohio HB 646 to the tracker', owner: 'kevin', due: '2026-09-11', done: true, ref: { type: 'm', id: 'oh-hb646' }, from: 'Locke' }
  ];

  /* ---------------- analytics ---------------- */
  LW.analytics = {
    tracked: { label: 'Items tracked', unit: '', points: [{ k: 'Apr', v: 9 }, { k: 'May', v: 14 }, { k: 'Jun', v: 19 }, { k: 'Jul', v: 26 }, { k: 'Aug', v: 31 }, { k: 'Sep', v: 35 }] },
    exposure: { label: 'High-exposure items by jurisdiction', points: [{ k: 'Federal', v: 7 }, { k: 'Texas', v: 2 }, { k: 'California', v: 2 }, { k: 'PJM states', v: 3 }, { k: 'Other', v: 1 }] },
    deadlines: { label: 'Dated obligations by month', points: [{ k: 'Sep', v: 4 }, { k: 'Oct', v: 3 }, { k: 'Nov', v: 3 }, { k: 'Dec', v: 4 }, { k: 'Jan', v: 2 }] },
    pipeline: { label: 'Contracting pipeline', points: [{ k: 'Watching', v: 2 }, { k: 'Teaming', v: 3 }, { k: 'Bidding', v: 1 }, { k: 'Submitted', v: 0 }] }
  };

  LW.report = {
    period: 'Q3 2026',
    prepared: '2026-09-15',
    signer: 'kevin',
    summary: 'Two federal proceedings now decide how large loads get studied in the United States, and Loomwork is on the record in one of them with the second closing in November. Nothing this quarter threatens the business. One compliance gap threatens the federal revenue line.',
    sections: [
      { h: 'What moved', items: [
        'FERC ordered six grid operators to justify or reform their large-load rules. Five now respond on 16 November [[ferc-sc|FERC show cause]].',
        'FERC directed NERC to file mandatory computational load standards by 31 December, and the first draft is out for ballot [[ferc-rd26|RD26-7-000]].',
        'Texas is auditing roughly 410 GW of large-load interconnection requests, with results expected by early December [[tx-ci|Community Impact]].',
        'Four states enacted large-load cost rules that require utilities to calculate what each load triggers: Maryland, New Jersey, Pennsylvania and Virginia.'] },
      { h: 'What Locke did', items: [
        'Filed comments for Loomwork in the DOE National Transmission Needs Study record on 8 September.',
        'Drafted a comment on NERC CLO-001-1, pending technical review, to file by 18 September.',
        'Scored six federal opportunities and recommended one bid, one no-bid and three teaming approaches.',
        'Opened the FY27 appropriations ask on grid software eligibility, targeted at the lame duck.'] },
      { h: 'The one risk worth board attention', items: [
        'Loomwork cannot hold federal CUI at the level the proposed FAR rule would require, and FedRAMP authorization is a multi-quarter path [[farcui|FAR CUI rule]].',
        'The highest-fit federal program Locke has found, DOE’s $30 million AI for Interconnection effort, closed in January 2025 [[ai4ix|AI4IX]]. The next one should not find Loomwork unready.'] },
      { h: 'Next quarter', items: [
        'Land automated study language in at least two show cause responses.',
        'Start the FedRAMP path, or decide deliberately not to pursue federal work.',
        'Convert the GridFM 2.0 deployment need into a teaming agreement through Loomwork’s PJM customers [[gridfm|GridFM 2.0]].'] }
    ]
  };

  /* ---------------- settings ---------------- */
  LW.settings = {
    jurisdictions: [{ k: 'US', label: 'Federal' }, { k: 'CA', label: 'California' }, { k: 'TX', label: 'Texas' }, { k: 'VA', label: 'Virginia' }, { k: 'PA', label: 'Pennsylvania' }, { k: 'NJ', label: 'New Jersey' }, { k: 'MD', label: 'Maryland' }, { k: 'OH', label: 'Ohio' }, { k: 'IL', label: 'Illinois' }, { k: 'CO', label: 'Colorado' }],
    topics: [{ k: 'interconnection', label: 'Interconnection' }, { k: 'largeload', label: 'Large-load rules' }, { k: 'transmission', label: 'Transmission and permitting' }, { k: 'funding', label: 'Federal funding' }, { k: 'ai', label: 'AI regulation' }],
    agencies: ['FERC', 'NERC', 'DOE Office of Electricity', 'Public Utility Commission of Texas', 'California PUC', 'Pennsylvania PUC', 'Tennessee Valley Authority'],
    thresholds: [
      { role: 'CEO', rule: 'Act items only, at most one push per day. Everything else waits for the morning brief.' },
      { role: 'Head of Gov Sales', rule: 'Opportunities scoring 60 or above, plus any teaming window closing inside 30 days.' },
      { role: 'CISO', rule: 'Any comment deadline or compliance date inside 14 days.' }
    ],
    learned: [
      { date: '2026-09-11', text: 'Marked not relevant: state AI bills with no grid nexus. Locke now files these to the digest instead of the brief.' },
      { date: '2026-08-30', text: 'Marked not relevant: distribution-level DER interconnection dockets. Out of Loomwork’s product scope.' },
      { date: '2026-08-12', text: 'Requested more of: anything touching interconnection study methods, at any level of government.' }
    ]
  };

  ['stakeholders', 'advocacy', 'disclosures', 'briefs', 'tasks', 'analytics', 'settings'].forEach(k => { delete LW.planned[k]; });
})(window.LW);
