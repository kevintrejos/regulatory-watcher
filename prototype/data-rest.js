/* Hearings, members, press, activity, calendar, planned screens, about. */
(function (LW) {
  Object.assign(LW.sources, {
    'ropes-ai': { label: 'Ropes & Gray', title: 'Examining the landscape and limitations of the federal push to override state AI regulation', pub: 'Ropes & Gray', url: 'https://www.ropesgray.com/en/insights/alerts/2026/03/examining-the-landscape-and-limitations-of-the-federal-push-to-override-state-ai-regulation' },
    'tx-bc': { label: 'Committee page', title: 'Senate Committee on Business and Commerce', pub: 'Texas Senate', url: 'https://senate.texas.gov/cmte.php?c=510' },
    'va-gov': { label: 'Governor’s office', title: 'Governor Spanberger highlights first-of-its-kind data center legislation', pub: 'Office of the Governor of Virginia', url: 'https://www.governor.virginia.gov/newsroom/news-releases/2026/july-releases/name-1120725-en.html' },
    'natlaw-pa': { label: 'National Law Review', title: 'Data centers, grid reliability, and large load regulation: recent developments in Pennsylvania and the region', pub: 'National Law Review', url: 'https://natlawreview.com/article/data-centers-grid-reliability-and-large-load-regulation-recent-developments' }
  });

  LW.hearings = [
    {
      id: 'enr-ferc', level: 'federal', date: '2026-07-22', body: 'Senate Energy and Natural Resources', kind: 'Hearing',
      title: 'Oversight of the Federal Energy Regulatory Commission', by: 'kevin', rel: ['s4559', 's5008'],
      witnesses: ['Chairman Laura Swett', 'Commissioner David Rosner', 'Commissioner Lindsay See', 'Commissioner Judy W. Chang', 'Commissioner David LaCerte'],
      notes: [
        'All five FERC commissioners testified. The large-load show cause orders dominated the hearing, with senators from both parties pressing on ratepayer protection and advanced transmission technologies [[appa-enr|APPA recap]].',
        'Chairman Swett said FERC wants to bring innovation to interconnection and the studies behind it, and that the agency has formed a task force on grid-enhancing technologies [[ud-swett|Utility Dive]].'
      ],
      rec: 'Quote the Chairman’s statement on interconnection studies in every PJM and MISO stakeholder comment this fall. It is the clearest sign FERC will welcome automated methods.',
      sources: ['enr-ferc', 'appa-enr', 'ud-swett']
    },
    {
      id: 'ec-markup', level: 'federal', date: '2026-07-20', body: 'House Energy and Commerce', kind: 'Markup',
      title: 'Full committee markup: 17 bills, including the Ratepayer Protection Act', by: 'kevin', rel: ['hr9340'],
      notes: ['The committee sent 17 bills to the House floor [[ec-markup|E&C markup]]. The Ratepayer Protection Act passed 52-0 [[ec-rpa|52-0 in committee]].'],
      sources: ['ec-markup', 'ec-rpa']
    },
    {
      id: 'ec-aigrid', level: 'federal', date: '2026-04-29', body: 'House E&C Subcommittee on Energy', kind: 'Hearing',
      title: 'AI and the Grid: Meeting Growing Power Demand While Protecting Ratepayers', by: 'kevin', rel: ['hr9340'],
      notes: ['Chaired by Rep. Bob Latta. The hearing asked whether utilities can serve data center growth without raising rates for everyone else [[ec-aigrid|E&C hearing]].'],
      sources: ['ec-aigrid']
    },
    {
      id: 'tx-house-aug', level: 'state', st: 'TX', date: '2026-08-19', body: 'Texas House State Affairs', kind: 'Interim hearing',
      title: 'Data centers and 765-kV transmission lines', by: 'kevin', rel: ['tx-sb6', 'tx-interim'],
      notes: [
        'A nine-hour hearing with state agencies, ERCOT, data center companies and nearly 50 public witnesses [[tx-trib|Texas Tribune]].',
        'ERCOT said it is tracking about 410 GW of large-load interconnection requests, roughly 87 percent from data centers, and expects to finish its queue audit in late November or early December [[tx-ci|Community Impact]].'
      ],
      rec: 'Use the 410 GW figure in every ERCOT conversation. No manual process can study a queue that size on the timeline the Governor wants.',
      sources: ['tx-trib', 'tx-ci']
    },
    {
      id: 'tx-senate-jul', level: 'state', st: 'TX', date: '2026-07-29', body: 'Texas Senate Business and Commerce', kind: 'Interim hearing',
      title: 'Large loads, data centers and 765-kV transmission', by: 'kevin', rel: ['tx-interim'],
      witnesses: ['Pablo Vegas, President and CEO, ERCOT', 'Landowners along proposed 765-kV routes'],
      notes: ['The committee heard an ERCOT update and testimony from landowners on the proposed 765-kV lines. Afterward, Chairman Schwertner and Lt. Gov. Dan Patrick (R-TX) called on the PUCT to deny the 765-kV applications [[tx-kxan|KXAN]].'],
      sources: ['tx-kxan']
    }
  ];

  LW.actions = [
    { level: 'state', st: 'TX', date: '2026-08-03', title: 'Abbott orders an audit of the data center queue', ident: 'Governor’s directive', note: 'Directs the PUCT and ERCOT to audit large-load interconnection requests [[abbott|Abbott letter]].' },
    { level: 'state', st: 'IL', date: '2026-07-01', title: 'Illinois pauses new data center tax incentives', ident: 'Executive action', note: 'A two-year pause on state incentives for new data centers [[il-pause|Office of the Governor]].' }
  ];

  LW.members = [
    { level: 'federal', name: 'Sen. Adam Schiff (D-CA)', role: 'Home state · Sponsor of S. 4559', stance: 'Aligned', note: 'Sponsor of the only bill directing FERC to adopt AI and automation practices in interconnection queues [[s4559|S. 4559]].' },
    { level: 'federal', name: 'Sen. Alex Padilla (D-CA)', role: 'Home state · Energy and Natural Resources', stance: 'Aligned', note: 'Part of the Democratic group behind the Senate transmission draft [[ee-dems|E&E News]].' },
    { level: 'federal', name: 'Sen. Martin Heinrich (D-NM)', role: 'Ranking member, Energy and Natural Resources', stance: 'Aligned', note: 'Introduced S. 5008 to require connect-and-manage interconnection [[pv-s5008|pv magazine]].' },
    { level: 'federal', name: 'Sen. John Hickenlooper (D-CO)', role: 'Energy and Natural Resources', stance: 'Aligned', note: 'Leads the Senate transmission draft [[ee-dems|E&E News]].' },
    { level: 'federal', name: 'Rep. Bob Latta (R-OH-05)', role: 'Chair, E&C Subcommittee on Energy', stance: 'No public position', note: 'Chaired April’s AI and the Grid hearing [[ec-aigrid|E&C]]. No stated view on study automation.' },
    { level: 'federal', name: 'Reps. Gabe Evans (R-CO-08) and Kathy Castor (D-FL-14)', role: 'Leads, H.R. 9340', stance: 'No public position', note: 'Their bill makes large loads pay full upgrade costs [[hr9340|H.R. 9340]]. No stated view on how those costs are studied.' },
    { level: 'federal', name: 'Rep. Troy Balderson (R-OH-12)', role: 'Sponsor, GRID Power Act', stance: 'Mixed', note: 'Wants faster queues, but through priority for dispatchable projects rather than better studies [[ud-gridpower|Utility Dive]].' },
    { level: 'federal', name: 'Sen. Bernie Sanders (I-VT)', role: 'Sponsor, S. 4214', stance: 'Opposed', note: 'His moratorium bill would slow the data center growth that drives demand for large-load studies [[s4214|S. 4214]].' },
    { level: 'state', name: 'Asm. Rick Chavez Zbur (D-51)', role: 'Author, AB 2383', stance: 'No public position', note: 'Author of the Fair Share in Energy Act [[ca-dcd|DCD]]. No stated view on study methods.' },
    { level: 'state', name: 'Sen. Steve Padilla (D-18)', role: 'Author, SB 886 · San Diego', stance: 'No public position', note: 'Not the U.S. senator. Author of SB 886 [[sb886-padilla|Office of Sen. S. Padilla]].' },
    { level: 'state', name: 'Sen. Charles Schwertner (R-05)', role: 'Chair, Senate Business and Commerce', stance: 'Mixed', note: 'Leads the large-load interim study, and called on the PUCT to deny the 765-kV applications [[tx-kxan|KXAN]].' },
    { level: 'state', name: 'Gov. Greg Abbott (R-TX)', role: 'Governor', stance: 'Mixed', note: 'Ordered an audit of the data center queue [[abbott|Abbott letter]].' },
    { level: 'state', name: 'Gov. Josh Shapiro (D-PA)', role: 'Governor', stance: 'Mixed', note: 'Signed Act 21, which puts utility load forecasts under PUC review [[pa-act21|Utility Dive]].' },
    { level: 'state', name: 'Gov. Mikie Sherrill (D-NJ)', role: 'Governor', stance: 'No public position', note: 'Signed the Data Center Fair Share Act [[nj-law|State of New Jersey]].' }
  ];

  LW.press = [
    ['bbg-newsom', ['ca-ab2383', 'ca-sb886']],
    ['tx-trib', ['tx-interim', 'tx-sb6']],
    ['pv-s5008', ['s5008']],
    ['nj-vind', ['nj-c32']],
    ['lp-tariff', ['ca-sb886', 'ca-ab2383']],
    ['cnbc-rpa', ['hr9340']],
    ['oh-hb646', ['oh-hb646']],
    ['md-relief', ['md-hb1532']],
    ['va-amend', ['va-2026']],
    ['va-mercury', ['va-2026']],
    ['ud-gridpower', ['hr1047']]
  ].map(([id, rel]) => { const s = LW.sources[id]; return { date: s.date, outlet: s.pub, headline: s.title, url: s.url, rel }; });

  LW.since = [
    { id: 'sn-newsom', kind: 'deadline', sev: 'act', date: '2026-09-15', title: '15 days left for Newsom on AB 2383 and SB 886', detail: 'The Governor must sign or veto by `30 Sep`. Locke recommends watching, not lobbying [[ca-dcd|DCD]].', ref: { type: 'm', id: 'ca-ab2383' }, hideable: true },
    { id: 'sn-plan', kind: 'locke', sev: 'locke', date: '2026-09-14', title: 'PJM and MISO stakeholder plan drafted', detail: 'Built around the `16 Nov` show cause responses [[stoel-abey|Stoel Rives]]. In review with Kevin before it reaches Maya.' },
    { id: 'sn-s4559', kind: 'locke', sev: 'locke', date: '2026-09-14', title: 'S. 4559 scored as Loomwork’s highest-fit federal bill', detail: 'Agents matched the bill text to Loomwork’s product. Outreach to energy staff in Sen. Schiff’s office is planned, pending your approval.', ref: { type: 'm', id: 's4559' } },
    { id: 'sn-cmmc', kind: 'deadline', sev: 'watch', date: '2026-09-13', title: 'CMMC task force recommendations were due', detail: 'Phase 2 has been suspended since `13 Jul`. No decision is public yet, and DFARS 252.204-7012 still applies [[cmmc|Crowell & Moring]].', hideable: true },
    { id: 'sn-oh', kind: 'new', sev: 'fyi', date: '2026-09-11', title: 'Added to tracker: Ohio HB 646', detail: 'A statewide data center rate class bill in a PJM state. Added when Locke widened monitoring to every PJM territory where Loomwork has customers.', ref: { type: 'm', id: 'oh-hb646' }, hideable: true }
  ];

  LW.coming = [
    { date: '2026-09-17', title: 'Walk through the stakeholder plan with Kevin', meta: 'Locke · 30 min', internal: true },
    { date: '2026-09-30', title: 'Newsom acts on AB 2383 and SB 886', meta: 'California · Governor’s deadline', href: '#/m/ca-ab2383', sev: 'act' },
    { date: '2026-09-30', title: 'Maryland utilities file large-load rate schedules', meta: 'Maryland PSC · HB 1532', href: '#/m/md-hb1532', approx: true },
    { date: '2026-10-01', title: 'Loomwork Q3 board meeting', meta: 'Loomwork · internal', internal: true },
    { date: '2026-10-20', title: 'Q3 lobbying report (LD-2) due', meta: 'Locke files for Loomwork', sev: 'fyi' },
    { date: '2026-11-03', title: 'Midterm elections', meta: 'Federal and state' },
    { date: '2026-11-16', title: 'Grid operators answer FERC on large loads', meta: 'PJM, MISO, CAISO, ISO-NE, NYISO', sev: 'watch' },
    { date: '2026-12-11', title: 'Stopgap funding expires', meta: 'FY27 appropriations', href: '#/m/cr27', sev: 'watch' }
  ];

  LW.planned = {
    regulatory: { phase: 2, group: 'Monitor', title: 'Regulatory', blurb: 'Rulemakings and dockets on top. Loomwork’s compliance obligations below, each with an owner and a status.', items: [
      'FERC’s large-load show cause orders to PJM, MISO, SPP, CAISO, ISO-NE and NYISO, with responses due `16 Nov` [[stoel-abey|Stoel Rives]]',
      'NERC Project 2026-02 on computational loads and the May Level 3 alert [[nerc-l3|DWT]]',
      'PUCT rule 16 TAC §25.194 under Texas SB 6 [[puct-58481|PUCT 58481]]',
      'The FAR CUI rule, CMMC Phase 2, FedRAMP, CEII handling and LDA filings as tracked obligations'] },
    contracting: { phase: 2, group: 'Monitor', title: 'Contracting', blurb: 'Federal solicitations with SAM.gov fields, DOE funding, utility and grid operator procurements, and SBIR, each with a Locke fit score. The centerpiece is a bid or no-bid decision page.', items: [
      'An opportunity table with notice ID, NAICS, set-aside and response date',
      'A SPARK teaming tracker as awards land between October and January [[spark-hk|Holland & Knight]]',
      'An SBIR eligibility check after the April reauthorization [[sbir|Crowell & Moring]]',
      'The bid or no-bid page: fit score, requirements crosswalk, likely competitors, and a signed recommendation'] },
    stakeholders: { phase: 3, group: 'Relationships', title: 'Stakeholders', blurb: 'An influence-by-alignment grid above grouped cards for Congress, agencies, states, grid operators and coalitions. Interactions are logged only at the staff and organization level.', items: [
      'FERC: Chairman Laura Swett and Commissioners Rosner, See, Chang and LaCerte [[enr-ferc|ENR hearing]]',
      'PJM President and CEO David E. Mills [[pjm-mills|PJM]]',
      'Coalitions and trade groups, with their positions and sign-on asks',
      'Money and lobbying: Locke’s LD-2 filings for Loomwork, and real competitor disclosures only'] },
    advocacy: { phase: 3, group: 'Relationships', title: 'Advocacy', blurb: 'Campaigns with goals, targets, assets and status.', items: [
      'Get automated study tools named in the PJM and MISO show cause responses',
      'A coalition sign-on letter to FERC',
      'FY27 Energy and Water report language on grid software eligibility',
      'A fly-in timed to the lame duck, since members are home campaigning in October'] },
    briefs: { phase: 3, group: 'Work', title: 'Briefs', blurb: 'Every brief Locke has written for Loomwork, with authors, reviewers and provenance.', items: [
      'Filters for author, topic and status',
      'One brief shows the “2 citations unverified” state, which blocks export until it is resolved'] },
    tasks: { phase: 3, group: 'Work', title: 'Tasks', blurb: 'Who is doing what, across both teams.', items: [
      'Assignments linked to bills, rules and opportunities',
      'Due dates that feed Coming up on Home'] },
    analytics: { phase: 3, group: 'Work', title: 'Analytics', blurb: 'Trends, plus a report the board can read.', items: [
      'Tracked items by stage over time, exposure by jurisdiction, deadlines by month',
      'A one-click Q3 board report that prints cleanly to PDF'] },
    settings: { phase: 3, group: 'Settings', title: 'Monitoring settings', blurb: 'What Locke watches for Loomwork, and what it has learned.', items: [
      'Jurisdiction, agency and keyword controls that re-filter every dashboard',
      'Alert thresholds by role',
      'A log of what “Not relevant” clicks have taught the agents'] }
  };

  LW.about = {
    paras: [
      'Locke delivers monitoring through Slack and email today. This prototype asks what happens when the same model, agents doing the work and counsel signing it, becomes the whole platform: the tracker, the relationship map, the brief and the bid decision. Quorum and Bloomberg Government show you what happened. Locke tells you what to do about it, drafts it, and signs it.',
      'The client is fictional. Loomwork is a Series B grid planning software company in San Francisco, the kind of company Tapestry represents [[tapestry|DCD]]. Everything it tracks is real and cited as of 15 September 2026. Loomwork’s team, its customers, and Locke’s internal work (plans, drafts, reviews) are illustrative. Contact with real officials only ever appears as planned outreach to staff.',
      'Prepared by Kevin Trejos as part of an application for Founding Member of Policy Staff. Not affiliated with or endorsed by Locke.'
    ],
    sections: [
      { h: 'What is built', items: [
        'Monitoring: a signed morning brief per role, Coming up, Ask Locke, and everything that changed since the last visit',
        'Legislative: federal and state trackers with filters, hearings, recent enactments, a member watchlist and press',
        'Regulatory: rules and dockets from FERC, NERC, DOE, TVA and state commissions',
        'Compliance: Loomwork’s obligations with an owner, a status and a date',
        'Contracting: opportunities with a Locke fit score, and a bid or no-bid page',
        'Detail pages for bills, hearings, rules and opportunities, each with analysis, provenance and sources',
        'Search (⌘K or /), keyboard navigation (press ? for the list), a role switcher, “Not relevant” learning, and both themes'] },
      { h: 'The design follows locke.inc', items: [
        'Ink ground #050505 and bone type #F3F0E8, taken from the site’s own CSS variables. Nothing is pure white',
        'Geist throughout at regular weight, headlines included. Geist Mono for anything the government numbered',
        'Square edges everywhere, hairline rules at low opacity, and mono section numbers in a left gutter, as the site does',
        'One quiet accent, the site’s pale sage, plus three status colors muted to sit on black',
        'Locke’s own service names in the sidebar: Monitoring, Compliance, Contracting, Lobbying',
        'Terminal habits for density: a deadline ticker, 36-pixel rows, and keyboard control',
        'Locke’s logomark and photography are deliberately not copied. This is a concept, and it should read as one'] },
      { h: 'What comes next', items: [
        'Stakeholders and Advocacy, including the influence grid and the lobbying disclosures',
        'Briefs, Tasks, Analytics with the board report, and Monitoring settings'] }
    ]
  };
})(window.LW);
