/* Tracked legislation. Facts are cited; analysis is Locke's. */
window.LW.measures = [
  /* ---------------- federal ---------------- */
  {
    id: 's4559', level: 'federal', ident: 'S. 4559', title: 'Energy Cost Fairness and Reliability Act of 2026',
    short: 'Directs FERC to require AI and automation best practices in interconnection queues',
    stage: 'intro', body: 'Senate', sponsors: 'Sen. Adam Schiff (D-CA)', topics: ['interconnection'], exposure: 3, position: 'Support', owner: 'kevin',
    last: { date: '2026-05-18', text: 'Introduced in the Senate' }, next: { label: 'No committee action scheduled' }, dates: { 0: '2026-05-18' }, updated: '2026-09-14',
    analysis: [
      'This is the only bill in Congress that writes Loomwork’s product category into federal policy. It would require FERC to open a rulemaking revising the pro forma generator interconnection procedures, so that transmission providers share and use queue management best practices involving computing technologies such as artificial intelligence, machine learning and automation [[s4559-text|S. 4559 text]].',
      'It has no committee action, and the calendar before the midterms is short. Its value this year is as a marker: a home-state senator on record for automated interconnection studies, which Loomwork can cite in FERC and PJM proceedings.'
    ],
    means: 'Direct and positive. A FERC rule under this bill would turn study automation from a nice-to-have into an expectation for every FERC-jurisdictional grid operator. Worth a cosponsor push from California and Colorado offices in the lame duck.',
    provisions: [
      'Directs FERC to begin a rulemaking revising the pro forma Large Generator Interconnection Procedures [[s4559-text|S. 4559]].',
      'Requires public utility transmission providers to share and employ queue management best practices for computing technologies, including AI, machine learning and automation [[s4559-text|S. 4559]].'
    ],
    sources: ['s4559', 's4559-text'],
    action: { label: 'Draft cosponsor outreach', toast: 'Draft requested. After your sign-off, Kevin will send it to energy staff in Sen. Schiff’s office.' }
  },
  {
    id: 'hr9340', level: 'federal', ident: 'H.R. 9340', title: 'Ratepayer Protection Act',
    short: 'States must consider making loads of 100 MW or more pay full upgrade costs',
    stage: 'rept', body: 'House', cmte: 'Energy and Commerce', sponsors: 'Reps. Gabe Evans (R-CO-08) and Kathy Castor (D-FL-14). Sen. Jon Husted (R-OH) leads a Senate companion.',
    topics: ['largeload'], exposure: 2, position: 'Support', owner: 'kevin',
    last: { date: '2026-07-20', text: 'Reported by Energy and Commerce, 52-0' }, next: { label: 'House floor vote, not yet scheduled' }, dates: { 0: '2026-06-18', 1: '2026-07-20' },
    analysis: [
      'The bill amends PURPA section 111(d) so every state regulator must consider a large-load standard: rates for customers at 100 MW or more would recover the full incremental cost of the generation, transmission and distribution upgrades needed to serve them [[hr9340|H.R. 9340]]. It cleared Energy and Commerce 52-0 on 20 Jul [[ec-rpa|52-0 in committee]].',
      'Unanimous committee votes on data center costs are rare. House leaders have planned a floor vote, pushed by members in competitive districts who hear about power bills from constituents [[cnbc-rpa|CNBC]].'
    ],
    means: 'Indirect and positive. “Full incremental cost” has to be calculated, which means utilities need defensible studies of what each large load triggers. That is a Loomwork use case in every state that adopts the standard.',
    provisions: [
      'Amends PURPA §111(d) to add a large-load standard that state regulators must consider [[hr9340|H.R. 9340]].',
      'Defines large-load customers as sites with peak demand of 100 MW or more [[hr9340|H.R. 9340]].',
      'Rates must recover the full incremental cost of any generation, transmission or distribution upgrade needed to serve the load [[hr9340|H.R. 9340]].'
    ],
    sources: ['hr9340', 'ec-rpa'],
    action: { label: 'Draft a support statement', toast: 'Draft requested. Kevin will check it against Loomwork’s utility customer relationships first.' }
  },
  {
    id: 's5008', level: 'federal', ident: 'S. 5008', title: 'Grid Connection and Congestion Management Act',
    short: 'Requires grid operators to offer connect-and-manage interconnection',
    stage: 'intro', body: 'Senate', sponsors: 'Sen. Martin Heinrich (D-NM)', topics: ['interconnection'], exposure: 2, position: 'Engage', owner: 'kevin',
    last: { date: '2026-07-16', text: 'Introduced in the Senate' }, next: { label: 'No committee action scheduled' }, dates: { 0: '2026-07-16' },
    analysis: [
      'The bill would require FERC-jurisdictional grid operators to offer a connect-and-manage service modeled on Texas. Projects that accept curtailment when the grid is constrained would move ahead of projects waiting in queues [[pv-s5008|pv magazine]].',
      'Heinrich is the ranking member on Senate Energy and Natural Resources. The bill signals where Democrats would take interconnection if they hold the gavel in January.'
    ],
    means: 'Mixed. Connect-and-manage cuts some upfront studies but creates a new need: forecasting how often a project will be curtailed. Loomwork should position its models as the curtailment-risk tool.',
    provisions: [
      'Requires RTOs and ISOs to offer connect-and-manage interconnection for transmission-connected generation and storage [[pv-s5008|pv magazine]].',
      'Gives connect-and-manage requests priority over projects already in queues [[pv-s5008|pv magazine]].',
      'Participating projects must reduce output when the operator asks, to protect reliability [[pv-s5008|pv magazine]].'
    ],
    sources: ['s5008', 'pv-s5008'],
    action: { label: 'Draft a curtailment one-pager', toast: 'Draft requested. Kevin will share it with committee staff only after your sign-off.' }
  },
  {
    id: 'hr1047', level: 'federal', ident: 'H.R. 1047', title: 'GRID Power Act',
    short: 'Lets grid operators move dispatchable projects to the front of queues',
    stage: 'pass', body: 'House', sponsors: 'Rep. Troy Balderson (R-OH-12). Senate companion S. 465.', topics: ['interconnection'], exposure: 2, position: 'Monitor', owner: 'kevin',
    last: { date: '2025-09-18', text: 'Passed the House' }, next: { label: 'Senate companion S. 465 pending' }, dates: { 2: '2025-09-18' },
    analysis: [
      'The bill requires FERC to reform interconnection so grid operators can propose specific dispatchable projects to jump ahead in the queue, with FERC reviewing each proposal within 60 days [[ud-gridpower|Utility Dive]].',
      'It passed the House a year ago and has not moved in the Senate [[hr1047|H.R. 1047]].'
    ],
    means: 'Neutral. It changes queue order, not study method. Reordering queues does trigger restudies, which is modest added demand for automated tools.',
    sources: ['hr1047'],
    action: { label: 'Alert me on Senate action', toast: 'Alert set. Locke will flag any Senate action on S. 465.' }
  },
  {
    id: 'hr4776', level: 'federal', ident: 'H.R. 4776', title: 'SPEED Act',
    short: 'NEPA reform with a shorter window for legal challenges',
    stage: 'pass', body: 'House', cmte: 'Senate Environment and Public Works next', sponsors: 'Reps. Bruce Westerman (R-AR-04) and Jared Golden (D-ME-02)', topics: ['transmission'], exposure: 1, position: 'Monitor', owner: 'kevin',
    last: { date: '2025-12-18', text: 'Passed the House, 221-196' }, next: { label: 'Senate EPW negotiations' }, dates: { 2: '2025-12-18' },
    analysis: [
      'The House passed the SPEED Act 221-196 in December. It narrows NEPA reviews and shortens the window for legal challenges [[hr4776|CRS]]. Senate EPW leaders Capito and Whitehouse have signaled interest in a bipartisan package [[bhfs-speed|Brownstein]].',
      'Talks slowed over the summer, and advocates warned the midterm calendar leaves little room [[ee-permit|E&E News]]. A lame-duck deal is possible, not likely.'
    ],
    means: 'Low and indirect. Faster permitting helps Loomwork’s utility customers build what the studies recommend. It does not change how studies are done.',
    sources: ['hr4776', 'bhfs-speed'],
    action: { label: 'Brief me if talks restart', toast: 'Done. Kevin will send a one-paragraph note if Senate talks resume.' }
  },
  {
    id: 'dem-trans', level: 'federal', ident: 'Discussion draft', title: 'Senate Democratic transmission draft',
    short: 'A transmission buildout bill pitched as a bridge to a permitting deal',
    stage: 'draft', body: 'Senate', sponsors: 'Sens. Hickenlooper (D-CO), Padilla (D-CA), King (I-ME), Gallego (D-AZ), Cortez Masto (D-NV)', topics: ['transmission', 'interconnection'], exposure: 2, position: 'Engage', owner: 'kevin',
    next: { label: 'Not yet introduced' },
    trackNote: 'This is a discussion draft, so it has no formal stage yet. Locke will open a full record when it gets a bill number.',
    analysis: [
      'Democrats on Senate Energy and Natural Resources released a draft focused on building new transmission to meet demand and ease price increases [[ee-dems|E&E News]]. Sen. Alex Padilla, Loomwork’s home-state senator, is part of the group.',
      'Drafts are where language is cheapest to change. Nothing is locked, and the offices want input before introduction.'
    ],
    means: 'An opening. Transmission planning provisions are the natural place to ask for modeling and study-automation language. Staff-level outreach to Sen. Padilla’s energy office is the right first step.',
    sources: ['ee-dems'],
    action: { label: 'Draft suggested language', toast: 'Draft requested. Kevin and Alexandra will prepare two paragraphs of suggested text for your review.' }
  },
  {
    id: 'ew27', level: 'federal', ident: 'FY27 Energy-Water', title: 'FY27 Energy and Water Development appropriations',
    short: 'Sets FY27 funding for DOE’s grid programs',
    stage: 'rept', stageLabel: 'Committee approved', body: 'House', cmte: 'House Appropriations', topics: ['funding'], exposure: 3, position: 'Engage', owner: 'bell',
    next: { date: '2026-12-11', label: 'Stopgap expires' },
    analysis: [
      'The House Appropriations Committee approved an FY27 Energy and Water bill with $58.5 billion in discretionary spending, $461 million above FY26 [[ew-house|House Appropriations]]. It has not reached the floor, and the stopgap now runs to 11 Dec [[cr27|CR to 11 Dec]].',
      'Final numbers will be set in a lame-duck package. Report language, not just totals, decides whether DOE grid programs can fund planning software.'
    ],
    means: 'High. This bill funds the DOE offices that buy and grant for grid planning. The ask is report language telling DOE to treat planning and study software as eligible in grid programs.',
    provisions: [
      'Total discretionary allocation of $58.5 billion, $461 million above the FY26 level [[ew-house|House Appropriations]].',
      'Defense portion $35 billion. Non-defense portion $23.5 billion [[ew-house|House Appropriations]].'
    ],
    sources: ['ew-house', 'crs-ew'],
    action: { label: 'Draft a report language ask', toast: 'Draft requested. Marcus and Kevin will send a one-page ask for your approval.' }
  },
  {
    id: 'cr27', level: 'federal', ident: 'FY27 CR', title: 'Continuing Appropriations and Extensions Act, 2027',
    short: 'Funds the government at FY26 levels through 11 Dec',
    stage: 'enact', body: 'Congress', topics: ['funding'], exposure: 2, position: 'No action', owner: 'bell',
    last: { date: '2026-09-02', text: 'Signed into law' }, enacted: '2026-09-02', next: { date: '2026-12-11', label: 'Expires' },
    dates: { 2: '2026-08-08', 3: '2026-09-01', 4: '2026-09-02' },
    analysis: [
      'The Senate passed the stopgap 90-6 on 8 Aug and the House cleared it 370-48 on 1 Sep. The President signed it on 2 Sep, four weeks before the fiscal year ended [[cr27|GovCon Wire]].',
      'It holds most programs at FY26 levels until 11 Dec [[cr27-cra|CRA]]. Agencies generally avoid launching new competitions under a stopgap.'
    ],
    means: 'Slows new DOE solicitations until December at the earliest. No action needed, but the BD calendar should assume a quiet fall.',
    meansShort: 'Holds DOE grid programs at FY26 levels until 11 Dec. Expect few new solicitations this fall.',
    sources: ['cr27', 'cr27-cra'],
    action: { label: 'Add 11 Dec to the BD calendar', toast: 'Added. Daniel and Marcus will see it in Coming up.' }
  },
  {
    id: 'sbir', level: 'federal', ident: 'S. 3971', title: 'Small Business Innovation and Economic Security Act of 2026',
    short: 'Reauthorizes SBIR and STTR through 2031',
    stage: 'enact', body: 'Congress', topics: ['funding'], exposure: 2, position: 'Support', owner: 'bell',
    last: { date: '2026-04-13', text: 'Signed into law' }, enacted: '2026-04-13', next: { label: 'Agencies reissuing solicitations' },
    dates: { 2: '2026-03-03', 3: '2026-03-17', 4: '2026-04-13' },
    analysis: [
      'The programs lapsed on 30 Sep 2025 and stayed dark for six months. The Senate passed the reauthorization on 3 Mar, the House on 17 Mar, and the President signed it on 13 Apr, extending both programs through 30 Sep 2031 [[sbir|Crowell & Moring]].',
      'It adds a Phase II strategic breakthrough award of up to $30 million and more foreign-risk screening [[sbir|Crowell & Moring]].'
    ],
    means: 'Opens a non-dilutive funding path. Loomwork is under the 500-employee limit. Ownership rules need a check before any proposal.',
    sources: ['sbir'],
    action: { label: 'Run the eligibility check', toast: 'Requested. Alexandra will review the cap table against the ownership rules this week.' }
  },
  {
    id: 'hr5388', level: 'federal', ident: 'H.R. 5388', title: 'American Artificial Intelligence Leadership and Uniformity Act',
    short: 'Would preempt state AI laws with a federal framework',
    stage: 'intro', body: 'House', topics: ['ai'], exposure: 1, position: 'Monitor', owner: 'chen',
    next: { label: 'No action scheduled' },
    analysis: [
      'The bill would set a federal AI framework and preempt state AI laws [[hr5388|H.R. 5388]]. Congress has rejected broad preemption before: in 2025 the Senate voted 99-1 to strip a 10-year moratorium on state AI laws from the reconciliation bill [[ropes-ai|Ropes & Gray]].',
      'The administration is pursuing preemption through litigation instead. A December 2025 executive order created a Justice Department task force to challenge state AI laws [[ropes-ai|Ropes & Gray]].'
    ],
    means: 'Low. Most state AI laws do not reach grid planning software. Preemption would simplify compliance at the margins.',
    sources: ['hr5388'],
    action: { label: 'Set an alert', toast: 'Alert set. Alexandra will flag any movement.' }
  },
  {
    id: 's4214', level: 'federal', ident: 'S. 4214', title: 'Artificial Intelligence Data Center Moratorium Act',
    short: 'Would impose a federal moratorium on AI data centers',
    stage: 'intro', body: 'Senate', sponsors: 'Sen. Bernie Sanders (I-VT)', topics: ['largeload'], exposure: 2, position: 'Monitor', owner: 'kevin',
    next: { label: 'No action scheduled' },
    analysis: [
      'The bill would put a federal moratorium on AI data centers [[s4214|S. 4214]]. It has no path in this Congress.',
      'It matters as a signal. Data center backlash now shows up in both parties, and several states have moratorium and cost-shift bills of their own.'
    ],
    means: 'Low odds, real signal. Slower data center growth would reduce urgency for large-load studies. Not worth opposing in public. Worth watching for cosponsors.',
    sources: ['s4214'],
    action: { label: 'Track cosponsors', toast: 'Tracking. Locke will flag each new cosponsor.' }
  },

  /* ---------------- state ---------------- */
  {
    id: 'ca-ab2383', level: 'state', st: 'CA', ident: 'AB 2383', title: 'Fair Share in Energy Act',
    short: 'Separate generation and transmission tariffs for new large loads',
    stage: 'desk', body: 'Assembly', sponsors: 'Asm. Rick Chavez Zbur (D-51)', topics: ['largeload'], exposure: 2, position: 'Monitor', owner: 'kevin',
    next: { date: '2026-09-30', label: 'Governor’s deadline' },
    analysis: [
      'AB 2383 would require utilities, community choice aggregators and electric service providers to adopt separate generation and transmission tariffs for new large-load customers starting service on or after 1 Jan 2027. It passed on a party-line vote and is on the Governor’s desk [[ca-dcd|DCD]].',
      'Gov. Gavin Newsom (D-CA) has not signaled how he will act [[bbg-newsom|Bloomberg Opinion]]. He has until 30 Sep.'
    ],
    means: 'Neutral to positive. Separate large-load tariffs require utilities to know what each load costs to serve. Watch, do not lobby.',
    sources: ['ab2383', 'ca-dcd'],
    action: { label: 'Alert me when he acts', toast: 'Set. You will get one line the moment the Governor signs or vetoes.' }
  },
  {
    id: 'ca-sb886', level: 'state', st: 'CA', ident: 'SB 886', title: 'California Technology Innovation and Ratepayer Protection Act',
    short: 'CPUC must keep data center costs off other customers',
    stage: 'desk', body: 'Senate', sponsors: 'Sen. Steve Padilla (D-18), San Diego. Coauthors Arreguín, McNerney, Weber Pierson, Wiener.', topics: ['largeload'], exposure: 2, position: 'Monitor', owner: 'kevin',
    next: { date: '2026-09-30', label: 'Governor’s deadline' },
    analysis: [
      'SB 886 directs the CPUC to adopt new tariffs and update electric rules so the cost of serving data centers is not shifted to other ratepayers [[ca-dcd|DCD]]. The author is state Sen. Steve Padilla of San Diego, not U.S. Sen. Alex Padilla [[sb886-padilla|Office of Sen. S. Padilla]].',
      'If signed, the details move to the CPUC, where tariff design and study requirements will be set.'
    ],
    means: 'Same read as AB 2383. The CPUC proceeding that follows is where Loomwork should engage, because that is where study methods get defined.',
    sources: ['sb886', 'sb886-padilla'],
    action: { label: 'Alert me when he acts', toast: 'Set. You will get one line the moment the Governor signs or vetoes.' }
  },
  {
    id: 'ca-sb53', level: 'state', st: 'CA', ident: 'SB 53', title: 'Transparency in Frontier Artificial Intelligence Act',
    short: 'Safety frameworks and incident reports for frontier AI developers',
    stage: 'enact', body: 'Senate', topics: ['ai'], exposure: 0, position: 'No action', owner: 'chen',
    last: { date: '2025-09-29', text: 'Signed into law' }, enacted: '2025-09-29', dates: { 4: '2025-09-29' }, next: { label: 'In effect' },
    analysis: [
      'SB 53 applies to developers of frontier AI models, the largest general-purpose models, and requires published safety frameworks and incident reporting [[sb53|SB 53]].',
      'Loomwork builds grid planning models, not frontier models. Locke reviewed the definitions and concluded the law does not apply.'
    ],
    means: 'None today. It stays on the tracker because California regulates AI by amendment, and a change to the thresholds could pull in applied-AI companies.',
    sources: ['sb53'],
    action: { label: 'Open the applicability memo', toast: 'Opens in Briefs, arriving in Phase 3. Alexandra signed it on 3 Sep.' }
  },
  {
    id: 'tx-sb6', level: 'state', st: 'TX', ident: 'SB 6 (2025)', title: 'Large-load interconnection standards',
    short: 'PUCT must set interconnection rules for loads of 75 MW or more',
    stage: 'enact', body: 'Senate', topics: ['largeload', 'interconnection'], exposure: 3, position: 'Engage', owner: 'kevin',
    last: { date: '2026-03-12', text: 'PUCT proposed 16 TAC §25.194' }, enacted: '2025-06-20', dates: { 4: '2025-06-20' }, next: { label: 'PUCT final rule pending' },
    analysis: [
      'SB 6 told the PUCT to set standards for connecting loads of 75 MW or more in ERCOT, including study fees of at least $100,000, proof of site control, and disclosure of duplicate requests [[sb6-gt|Greenberg Traurig]]. The PUCT proposed its rule, 16 TAC §25.194, on 12 Mar, and comments closed 17 Apr [[puct-58481|PUCT 58481]].',
      'The final rule is still pending. In August, Gov. Greg Abbott (R-TX) directed the PUCT and ERCOT to audit the data center queue [[abbott|Abbott letter, 3 Aug]]. ERCOT expects to finish the audit in late November or early December [[tx-ci|Community Impact]].'
    ],
    means: 'High. Every large load in ERCOT will need a study that meets the new standard, and the audit will force restudies. Loomwork’s ERCOT pilot is the proof point.',
    sources: ['sb6-gt', 'puct-58481'],
    action: { label: 'Draft comments for the final rule', toast: 'Draft requested. Kevin and Alexandra will have comments ready if the PUCT reopens the record.' }
  },
  {
    id: 'tx-interim', level: 'state', st: 'TX', ident: 'Interim charge', title: 'Senate interim study of large electric loads',
    short: 'Business and Commerce review of large-load growth and costs',
    stage: 'study', body: 'Senate Business and Commerce', topics: ['largeload', 'transmission'], exposure: 2, position: 'Engage', owner: 'kevin',
    last: { date: '2026-07-29', text: 'Interim hearing held' }, next: { date: '2027-01-12', label: '90th Legislature convenes' },
    trackNote: 'Interim studies have no bill stages. The committee’s findings will shape bills filed for the 2027 session.',
    analysis: [
      'The Senate Business and Commerce Committee is studying whether Texas law and infrastructure can keep up with large loads such as data centers, and how to weigh that growth against effects on landowners, water and communities [[tx-bc|Committee page]]. After its July hearing, Chairman Schwertner and Lt. Gov. Dan Patrick (R-TX) called on the PUCT to deny the 765-kV transmission applications [[tx-kxan|KXAN]].',
      'That is a warning sign. Resistance to new transmission raises the value of getting more out of the existing grid, which is a planning problem.'
    ],
    means: 'Bills filed in January will reflect this study. Loomwork should submit written input before the committee report is final.',
    sources: ['tx-bc', 'tx-kxan'],
    action: { label: 'Draft written input', toast: 'Draft requested. Kevin will share it with you before it goes to committee staff.' }
  },
  {
    id: 'va-2026', level: 'state', st: 'VA', ident: '2026 Session', title: 'Virginia data center package',
    short: 'Energy-use tax and cost assignment for data centers',
    stage: 'enact', body: 'General Assembly', topics: ['largeload'], exposure: 2, position: 'Monitor', owner: 'kevin',
    last: { date: '2026-04-16', text: 'Governor’s amendments' }, next: { label: 'SCC implementation' },
    analysis: [
      'Data center bills dominated Virginia’s 2026 session, and lawmakers passed about 15 of them [[va-mercury|Virginia Mercury]]. The Governor’s office describes a first-of-its-kind statewide tax on data center energy use and steps to keep large-load infrastructure costs off other ratepayers [[va-gov|Office of the Governor]].',
      'Gov. Abigail Spanberger (D-VA) amended several bills in April. Lawmakers and Dominion said the changes weakened them [[va-amend|Virginia Mercury]]. The SCC now carries most of the implementation.'
    ],
    means: 'Dominion territory is where many PJM data centers connect. Cost-assignment rules at the SCC will lean on utility studies.',
    sources: ['va-mercury', 'va-gov'],
    action: { label: 'Follow SCC implementation', toast: 'Added to monitoring. Locke will watch SCC dockets on large-load cost assignment.' }
  },
  {
    id: 'pa-act21', level: 'state', st: 'PA', ident: 'SB 146 · Act 21', title: 'Load forecast oversight (Act 21 of 2026)',
    short: 'More PUC scrutiny of the load forecasts utilities send to PJM',
    stage: 'enact', body: 'General Assembly', topics: ['largeload'], exposure: 2, position: 'Support', owner: 'kevin',
    last: { date: '2026-07-12', text: 'Signed into law' }, enacted: '2026-07-12', dates: { 4: '2026-07-12' }, next: { label: 'PUC implementation' },
    analysis: [
      'Act 21 amends Pennsylvania’s 2025 framework for PUC oversight of the load forecasts utilities submit to PJM. It lets the PUC’s enforcement bureau and statutory advocates review the utility agreements and customer commitments behind those forecasts [[natlaw-pa|National Law Review]].',
      'It came with a budget that requires data centers to report water and power use to the state each year [[pa-act21|Utility Dive]]. Separately, the PUC finalized a model large-load tariff framework this spring [[pa-puc|PA PUC]].'
    ],
    means: 'Positive. Forecasts that face audit need better load modeling. Loomwork’s Pennsylvania utility customers are the audience.',
    meansShort: 'Utility load forecasts sent to PJM now face PUC review. Better forecasting becomes a compliance need.',
    sources: ['pa-act21', 'natlaw-pa'],
    action: { label: 'Draft a customer note', toast: 'Draft requested. Kevin will write a short note Daniel can send to Pennsylvania utility contacts.' }
  },
  {
    id: 'nj-c32', level: 'state', st: 'NJ', ident: 'S731/A796 · P.L. 2026, c.32', title: 'Data Center Fair Share Act',
    short: 'A separate rate class, with data centers paying for their grid upgrades',
    stage: 'enact', body: 'Legislature', topics: ['largeload'], exposure: 2, position: 'Monitor', owner: 'kevin',
    last: { date: '2026-07-07', text: 'Signed into law' }, enacted: '2026-07-07', dates: { 4: '2026-07-07' }, next: { label: 'BPU implementation' },
    analysis: [
      'Gov. Mikie Sherrill (D-NJ) signed the Data Center Fair Share Act on 7 Jul. It creates a separate rate class for large data centers and requires them to pay for the grid and clean energy upgrades they cause [[nj-law|State of New Jersey]].',
      'It was part of a package the administration says will save ratepayers more than $1 billion a year [[nj-law|State of New Jersey]].'
    ],
    means: 'The same pattern as other PJM states: someone has to calculate which upgrades each data center causes. That is study work.',
    meansShort: 'A new rate class for large data centers, which now pay for the upgrades they cause.',
    sources: ['nj-law'],
    action: { label: 'Follow BPU implementation', toast: 'Added to monitoring.' }
  },
  {
    id: 'md-hb1532', level: 'state', st: 'MD', ident: 'HB 1532 · Ch. 353', title: 'Utility RELIEF Act',
    short: 'Large-load customers pay for their own grid upgrades',
    stage: 'enact', body: 'General Assembly', topics: ['largeload'], exposure: 2, position: 'Monitor', owner: 'kevin',
    last: { date: '2026-05-12', text: 'Signed into law' }, enacted: '2026-05-12', dates: { 4: '2026-05-12' }, next: { date: '2026-09-30', label: 'Utility rate schedules due at PSC in September' },
    analysis: [
      'Gov. Wes Moore (D-MD) signed the Utility RELIEF Act on 12 May [[md-relief|Maryland Matters]]. It is meant to lower bills, strengthen consumer protections and require large-load customers to pay for their own grid upgrades [[md-opc|OPC summary]].',
      'Utilities must file large-load rate schedules with the Public Service Commission this month.'
    ],
    means: 'The September filings are the first look at how Maryland utilities plan to calculate large-load costs.',
    sources: ['md-relief', 'md-opc'],
    action: { label: 'Summarize the filings', toast: 'Requested. Locke will summarize each utility’s filing when it posts.' }
  },
  {
    id: 'oh-hb646', level: 'state', st: 'OH', ident: 'HB 646', title: 'Ohio data center rate class bill',
    short: 'Statewide data center rate class, with tariffs due within 60 days',
    stage: 'intro', body: 'House', topics: ['largeload'], exposure: 2, position: 'Monitor', owner: 'kevin',
    last: { date: '2026-06-10', text: 'Introduced' }, next: { label: 'No hearing scheduled' }, dates: { 0: '2026-06-10' },
    analysis: [
      'HB 646 would have PUCO create a data center rate class, and require every distribution utility without an approved data center tariff to file one within 60 days of the law taking effect [[oh-hb646|Ohio Capital Journal]].',
      'Ohio is PJM territory and one of the fastest-growing data center markets in the region.'
    ],
    means: 'Would standardize data center tariffs across Ohio. More tariffs mean more load studies.',
    sources: ['oh-hb646'],
    action: { label: 'Set an alert', toast: 'Alert set.' }
  },
  {
    id: 'il-power', level: 'state', st: 'IL', ident: 'SB 4016 / HB 5513', title: 'POWER Act',
    short: 'Guardrails on data center impacts to bills, climate and water',
    stage: 'intro', body: 'General Assembly', topics: ['largeload'], exposure: 1, position: 'Monitor', owner: 'kevin',
    next: { label: 'No action scheduled' },
    analysis: [
      'The POWER Act would set guardrails to limit data centers’ effects on utility bills, climate and water [[il-power|NRDC]]. Separately, Gov. JB Pritzker (D-IL) paused new state tax incentives for data centers for two years starting 1 Jul [[il-pause|Office of the Governor]].'
    ],
    means: 'Low. Illinois spans MISO and PJM, but Loomwork has no Illinois customers yet.',
    sources: ['il-power'],
    action: { label: 'Set an alert', toast: 'Alert set.' }
  },
  {
    id: 'co-sb189', level: 'state', st: 'CO', ident: 'SB 26-189', title: 'Automated Decision-Making Technology Act',
    short: 'Replaces the Colorado AI Act with disclosure rules',
    stage: 'enact', body: 'General Assembly', topics: ['ai'], exposure: 1, position: 'No action', owner: 'chen',
    last: { date: '2026-05-14', text: 'Signed into law' }, enacted: '2026-05-14', dates: { 4: '2026-05-14' }, next: { date: '2027-01-01', label: 'Takes effect' },
    analysis: [
      'Colorado repealed its 2024 AI Act and replaced it with a narrower law focused on transparency about automated decisions in consequential areas and disclosure of adverse outcomes. It takes effect 1 Jan 2027 [[co-sb189|Skadden]].',
      'Whether it survives a federal preemption challenge is an open question.'
    ],
    means: 'Probably out of scope. Grid planning is not a consequential decision about a person under the law’s framing. Alexandra will confirm before it takes effect.',
    sources: ['co-sb189'],
    action: { label: 'Request an applicability memo', toast: 'Requested. Alexandra will confirm scope before 1 Jan.' }
  }
];
