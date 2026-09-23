/* Phase 2: rules and dockets, compliance obligations, contracting. Facts cited; analysis is Locke's. */
(function (LW) {
  Object.assign(LW.sources, {
    'ferc-rd26': { label: 'RD26-7-000', title: 'FERC orders mandatory NERC reliability standards for data center and other computational loads', pub: 'POWER Magazine', date: '2026-07-16', url: 'https://www.powermag.com/ferc-orders-mandatory-nerc-reliability-standards-for-data-center-and-other-computational-loads/' },
    'ferc-rd26-w': { label: 'Willkie', title: 'FERC orders new reliability standards for data centers and other computational loads', pub: 'Willkie Farr & Gallagher', url: 'https://www.willkie.com/publications/2026/07/ferc-orders-new-reliability-standards-for-data-centers-and-other-computational-loads' },
    'nerc-2602': { label: 'Project 2026-02', title: 'Project 2026-02 Computational Loads', pub: 'NERC', url: 'https://www.nerc.com/standards/reliability-standards-under-development/2026-02-computational-loads' },
    'nerc-ballot': { label: 'Ballot closes 18 Sep', title: 'NERC computational load standards: CLO-001-1 guide', pub: 'Zero Emission Grid', url: 'https://www.zeroemissiongrid.com/zeg-blog/nerc-computational-load-standards/' },
    'needs-study': { label: 'Comments closed 8 Sep', title: 'Notice of availability of draft 2026 National Transmission Needs Study and request for comment', pub: 'Federal Register', date: '2026-07-09', url: 'https://www.federalregister.gov/documents/2026/07/09/2026-13844/notice-of-availability-of-draft-2026-national-transmission-needs-study-and-request-for-comment' },
    'needs-doe': { label: 'DOE', title: 'DOE’s Office of Electricity publishes 2026 draft National Transmission Needs Study', pub: 'U.S. Department of Energy', url: 'https://www.energy.gov/oe/articles/does-office-electricity-publishes-2026-draft-national-transmission-needs-study' },
    'tva-peis': { label: 'TVA PEIS', title: 'Generator Interconnection Programmatic Environmental Impact Statement', pub: 'Federal Register', date: '2026-07-20', url: 'https://www.federalregister.gov/documents/2026/07/20/2026-14605/generator-interconnection-programmatic-environmental-impact-statement' },
    'order1920': { label: 'Order 1920', title: 'Order No. 1920 compliance filings schedule', pub: 'FERC', url: 'https://www.ferc.gov/news-events/news/order-no-1920-compliance-filings-schedule' },
    'isone-ext': { label: 'ISO-NE extension', title: 'ISO-NE Order 1920 compliance deadline extended to June 14, 2027', pub: 'NEPOOL', url: 'https://nepool.com/news/iso-ne-order-1920-compliance-deadline-extended-to-jun-14-2027/' },
    'caiso-ipe': { label: 'CAISO IPE 5.0', title: 'Interconnection Process Enhancements 5.0: final proposal', pub: 'California ISO', url: 'https://www.caiso.com/notices/interconnection-process-enhancements-5-0--final-proposal-posted--call-on-1-7-26' },
    'caiso-ll': { label: 'CAISO issue paper', title: 'Large Load Considerations issue paper', pub: 'California ISO', date: '2026-01-30', url: 'https://www.caiso.com/documents/issue-paper-large-load-consideration-jan-20-2026.pdf' },
    'ai4ix': { label: 'AI4IX', title: 'AI for Interconnection (AI4IX)', pub: 'U.S. Department of Energy', url: 'https://www.energy.gov/node/4846832' },
    'ai4ix-cwx': { label: 'CWX-010-GDO', title: 'CWX-010-GDO: Accelerating Interconnection Through AI', pub: 'ConnectWerx', url: 'https://www.connectwerx.org/portfolio-items/ppo-cwx-010-gdo-accelerating-interconnection-through-ai-ai4ax/' },
    'gridfm': { label: 'GridFM 2.0', title: 'DOE’s Office of Electricity announces $11.5M Genesis Mission project to meet growing electricity demand faster', pub: 'U.S. Department of Energy', date: '2026-09-01', url: 'https://www.energy.gov/oe/articles/does-office-electricity-announces-115m-genesis-mission-project-meet-growing-electricity' },
    'genesis-rfa': { label: 'DE-FOA-0003612', title: 'The Genesis Mission: Transforming Science and Energy with AI', pub: 'DOE Office of Science', url: 'https://science.osti.gov/grants/FOAs/FOAs/2026/DE-FOA-0003612' },
    'genesis-sbir': { label: 'Genesis SBIR', title: 'FY26 Phase I Genesis Mission SBIR/STTR', pub: 'ConnectWerx', url: 'https://sbir-sttr.connectwerx.org/portfolio-items/fy26genesismission/' },
    'enverus': { label: 'Enverus acquisition', title: 'Enverus acquires Pearl Street Technologies', pub: 'Enverus', date: '2025-03-13', url: 'https://www.enverus.com/newsroom/undo-the-queue-enverus-acquires-pearl-street-technologies-to-solve-for-a-more-reliable-resilient-grid/' },
    'ceii': { label: 'CEII rules', title: 'Critical Energy/Electric Infrastructure Information', pub: 'FERC', url: 'https://www.ferc.gov/ceii' },
    'i2x-roadmap': { label: 'i2X roadmap', title: 'Transmission Interconnection Roadmap', pub: 'U.S. Department of Energy', url: 'https://www.energy.gov/sites/default/files/2024-04/i2X%20Transmission%20Interconnection%20Roadmap.pdf' }
  });

  /* ---------------- rules and dockets ---------------- */
  LW.reg = [
    {
      id: 'ferc-showcause', ident: 'RM26-4 · §206 orders', title: 'Large-load interconnection: show cause orders to six grid operators',
      short: 'Justify your large-load rules or change them', body: 'FERC', lane: 'federal',
      stage: 'Responses due', cls: 'st-rept', topics: ['largeload', 'interconnection'], exposure: 3, position: 'Engage', owner: 'kevin',
      last: { date: '2026-08-28', text: 'MISO filed its reliability framework' }, next: { date: '2026-11-16', label: 'Operator responses due' },
      analysis: [
        'On 18 Jun FERC ordered PJM, MISO, SPP, CAISO, ISO-NE and NYISO to show that their tariffs handle large loads, or to file changes [[ferc-sc|FERC show cause, 18 Jun]]. Each operator asked for more time. Five now respond by `16 Nov`, with answers due `16 Dec` [[stoel-abey|Stoel Rives]].',
        'MISO moved early, filing a reliability framework on 28 Aug covering visibility reporting, monitoring, ramp limits and ride-through for load above 50 MW [[miso-ud|MISO filing, 28 Aug]]. The rest will draft through stakeholder processes this fall.'
      ],
      means: 'The single most valuable window this year. Each response defines how large loads get studied for the next several years. Locke’s job is to get automated study methods named as acceptable practice before the drafts close in October.',
      provisions: [
        'Issued under Federal Power Act section 206, which puts the burden on the operators to justify existing tariffs [[ferc-sc|McGuireWoods]].',
        'Covers all six FERC-jurisdictional RTOs and ISOs. ERCOT is not FERC-jurisdictional and is handling large loads through the PUCT instead [[sb6-gt|Greenberg Traurig]].'
      ],
      sources: ['ferc-sc', 'stoel-abey', 'ud-ferc'],
      action: { label: 'Draft PJM stakeholder comments', toast: 'Draft requested. Kevin will prepare comments for the October stakeholder sessions.' }
    },
    {
      id: 'nerc-2602', ident: 'CLO-001-1 · Project 2026-02', title: 'Computational load standards: comment and ballot',
      short: 'New reliability standards for data center loads', body: 'NERC', lane: 'federal',
      stage: 'Ballot open', cls: 'sev-act', topics: ['largeload'], exposure: 3, position: 'Engage', owner: 'chen',
      last: { date: '2026-09-09', text: 'Initial ballot opened' }, next: { date: '2026-09-18', label: 'Comment and ballot close, 8:00 pm ET' },
      analysis: [
        'NERC has proposed a new standard, CLO-001-1 on computational load interconnection, studies and modeling data, alongside revisions to FAC-001-5 and FAC-002-5. The formal comment period and initial ballot run through 8:00 pm ET on `18 Sep` [[nerc-ballot|Ballot closes 18 Sep]] [[nerc-2602|Project 2026-02]].',
        'Rules of Procedure changes would create two new registered entity types, Computational Load Owner and Computational Load Operator [[nerc-ballot|Zero Emission Grid]]. NERC is aiming for Board adoption in December.'
      ],
      means: 'Loomwork will not be a registered entity, but the standard defines the studies and modeling data its utility customers must produce. If the data requirements land where the draft has them, every large load in the country needs a modeled interconnection study. That is the market.',
      provisions: [
        'CLO-001-1 would govern computational load interconnection, studies and modeling data [[nerc-2602|NERC]].',
        'FAC-001-5 and FAC-002-5 revisions extend facility interconnection requirements and studies to computational load [[nerc-ballot|Zero Emission Grid]].',
        'New registered entity types: Computational Load Owner and Computational Load Operator [[nerc-ballot|Zero Emission Grid]].'
      ],
      sources: ['nerc-2602', 'nerc-ballot', 'nerc-cle'],
      action: { label: 'File a comment before Friday', toast: 'Alexandra is drafting. Comments close 8:00 pm ET Friday 18 Sep, so she needs your technical review by Thursday noon.' }
    },
    {
      id: 'ferc-rd26', ident: 'RD26-7-000', title: 'FERC directs NERC to file computational load standards',
      short: 'Standards and registry criteria due 31 December', body: 'FERC', lane: 'federal',
      stage: 'Directive', cls: 'st-rept', topics: ['largeload'], exposure: 3, position: 'Monitor', owner: 'chen',
      last: { date: '2026-07-16', text: 'Order issued' }, next: { date: '2026-12-31', label: 'NERC filing deadline' },
      analysis: [
        'On 16 Jul FERC directed NERC to file new or modified reliability standards addressing risks from integrating computational loads, by `31 Dec` [[ferc-rd26|RD26-7-000]]. The same order requires Rules of Procedure revisions, including registry criteria for computational load entities, on the same deadline.',
        'NERC must also file a workplan by `1 Mar 2027` laying out the next standards [[ferc-rd26-w|Willkie]]. The category is drawn broadly enough to cover AI data centers and crypto mining [[ferc-rd26|POWER]].'
      ],
      means: 'This is the order driving Project 2026-02. It guarantees that computational load studies become mandatory rather than voluntary, on a fixed clock. Plan product timelines against 31 December, not against the comment period.',
      sources: ['ferc-rd26', 'ferc-rd26-w'],
      action: { label: 'Add the Dec 31 date to the roadmap', toast: 'Added. Locke will brief the engineering team on what the filing is likely to require.' }
    },
    {
      id: 'nerc-alert', ident: 'Level 3 alert', title: 'NERC Level 3 alert on computational loads',
      short: 'Seven essential actions for registered entities', body: 'NERC', lane: 'federal',
      stage: 'In force', cls: 'sev-watch', topics: ['largeload'], exposure: 2, position: 'Monitor', owner: 'chen',
      last: { date: '2026-05-04', text: 'Alert issued' }, next: { label: 'Entity responses under review' },
      analysis: [
        'The NERC Board voted on 16 Apr to issue a Level 3 alert on computational load interconnections, only the third in NERC’s history. It went out on 4 May with seven essential actions for registered entities [[nerc-l3|NERC Level 3 alert]].',
        'NERC has documented grid disturbances where large computational loads contributed to instability [[ferc-rd26|POWER]]. That record is what moved FERC in July.'
      ],
      means: 'Utility customers are working through the essential actions right now. Several require load modeling and ride-through analysis Loomwork can run. This is the near-term commercial opening, ahead of the standards.',
      sources: ['nerc-l3'],
      action: { label: 'Draft a customer explainer', toast: 'Draft requested. Kevin will write a plain explainer Daniel can send to utility customers.' }
    },
    {
      id: 'puct-25194', ident: '16 TAC §25.194 · Project 58481', title: 'Texas large-load interconnection standards',
      short: 'SB 6 implementation for loads of 75 MW or more', body: 'Public Utility Commission of Texas', lane: 'state', st: 'TX',
      stage: 'Final rule pending', cls: 'st-pass', topics: ['largeload', 'interconnection'], exposure: 3, position: 'Engage', owner: 'kevin',
      last: { date: '2026-08-03', text: 'Governor ordered a queue audit' }, next: { label: 'Final adoption pending' },
      analysis: [
        'The PUCT proposed §25.194 on 12 Mar to implement SB 6, with study fees of at least $100,000, proof of site control and disclosure of duplicate requests. Comments closed 17 Apr [[puct-58481|PUCT 58481]] [[sb6-gt|Greenberg Traurig]].',
        'On 3 Aug Gov. Greg Abbott (R-TX) directed the PUCT and ERCOT to audit the data center queue [[abbott|Abbott letter]]. ERCOT is tracking roughly 410 GW of large-load requests, about 87 percent from data centers, and expects to finish the audit in late November or early December [[tx-ci|Community Impact]].'
      ],
      means: 'The audit is the opportunity. Sorting 410 GW of requests into real and speculative is a modeling problem, and ERCOT has to do it on a deadline. Loomwork’s ERCOT pilot should be visible while that work is happening.',
      sources: ['puct-58481', 'sb6-gt', 'abbott', 'tx-ci'],
      action: { label: 'Request an ERCOT briefing', toast: 'Requested. Kevin will ask ERCOT stakeholder relations for a briefing slot on study automation.' }
    },
    {
      id: 'order1920', ident: 'Order No. 1920', title: 'Long-term regional transmission planning',
      short: 'First long-term planning cycles begin', body: 'FERC', lane: 'federal',
      stage: 'In compliance', cls: 'st-cmte', topics: ['transmission'], exposure: 3, position: 'Engage', owner: 'kevin',
      last: { date: '2026-06-01', text: 'First long-term planning cycles due to begin' }, next: { date: '2027-06-14', label: 'ISO-NE compliance filing' },
      analysis: [
        'Order 1920 requires transmission providers to plan on a 20-year horizon using multiple scenarios. Compliance filings were due in June 2025, and the first long-term planning cycle had to begin within a year of filing, so by June 2026 [[order1920|Order 1920]].',
        'Timing varies by region. FERC extended ISO-NE to `14 Jun 2027` [[isone-ext|NEPOOL]].'
      ],
      means: 'The highest-volume modeling requirement in federal law right now. Every region has to run long-horizon scenario planning on a repeating cycle, which is exactly what Loomwork’s planning models produce.',
      sources: ['order1920', 'isone-ext'],
      action: { label: 'Map cycles to sales targets', toast: 'Requested. Marcus will map each region’s planning cycle to the buying window.' }
    },
    {
      id: 'needs-study', ident: '2026 Needs Study', title: 'DOE draft National Transmission Needs Study',
      short: 'Identifies where the grid is constrained', body: 'DOE Office of Electricity', lane: 'federal',
      stage: 'Comments closed', cls: 'st-dead', stageNote: true, topics: ['transmission'], exposure: 2, position: 'Filed', owner: 'kevin',
      last: { date: '2026-09-08', text: 'Comment period closed' }, next: { label: 'Final study expected' },
      analysis: [
        'DOE published the draft 2026 study on 9 Jul for a 60-day comment period that closed `8 Sep` [[needs-study|Comments closed 8 Sep]] [[needs-doe|DOE]]. The study identifies current and expected congestion and capacity constraints, and it feeds federal transmission policy.',
        'Locke filed comments for Loomwork on the last day, arguing that constraint analysis should rely on the same automated study methods FERC is pushing operators toward.'
      ],
      means: 'The final study becomes the reference document agencies cite for years. Being in the comment record costs little and gets Loomwork’s method named in a federal proceeding.',
      sources: ['needs-study', 'needs-doe'],
      action: { label: 'Read our filed comment', toast: 'Opens in Briefs, arriving in Phase 3. Kevin filed it on 8 Sep.' }
    },
    {
      id: 'tva-peis', ident: 'TVA PEIS', title: 'TVA programmatic review of generator interconnection',
      short: 'Standardized environmental screening for interconnection', body: 'Tennessee Valley Authority', lane: 'federal',
      stage: 'Draft expected', cls: 'st-cmte', topics: ['interconnection'], exposure: 2, position: 'Monitor', owner: 'kevin',
      last: { date: '2026-08-14', text: 'Scoping comments closed' }, next: { label: 'Draft PEIS expected this fall' },
      analysis: [
        'TVA is preparing a programmatic environmental impact statement for transmission work tied to generator interconnection across its power service area, covering its large and small generator procedures and its expedited study process [[tva-peis|TVA PEIS]]. Scoping comments closed 14 Aug.',
        'TVA expects a draft this fall and a final in early 2027 [[tva-peis|Federal Register]].'
      ],
      means: 'Two reasons to watch. TVA is a federal agency that buys software directly, and a standardized screening framework is the kind of repeatable process that automated tools serve well.',
      sources: ['tva-peis'],
      action: { label: 'Alert me when the draft posts', toast: 'Alert set for the draft PEIS.' }
    },
    {
      id: 'caiso-ipe', ident: 'IPE 5.0', title: 'CAISO interconnection process enhancements',
      short: 'California’s queue redesign and large-load study work', body: 'California ISO', lane: 'state', st: 'CA',
      stage: 'Stakeholder process', cls: 'st-cmte', topics: ['interconnection', 'largeload'], exposure: 2, position: 'Engage', owner: 'kevin',
      last: { date: '2026-01-30', text: 'Large load considerations issue paper' }, next: { label: 'Stakeholder process continuing' },
      analysis: [
        'CAISO posted its IPE 5.0 final proposal in December and held a stakeholder call on 7 Jan [[caiso-ipe|CAISO IPE 5.0]]. Its January issue paper reports about 4.5 GW of data center demand in the current transmission planning cycle [[caiso-ll|CAISO issue paper]].',
        'CAISO is also one of the operators that must answer FERC’s show cause order by `16 Nov` [[stoel-abey|Stoel Rives]].'
      ],
      means: 'Loomwork is headquartered in CAISO territory and has no CAISO work yet. The show cause response is a reason to be in the stakeholder process now rather than after.',
      sources: ['caiso-ipe', 'caiso-ll'],
      action: { label: 'Join the stakeholder list', toast: 'Requested. Kevin will register Loomwork for CAISO interconnection stakeholder notices.' }
    },
    {
      id: 'pa-tariff', ident: 'Model tariff', title: 'Pennsylvania large-load tariff framework',
      short: 'Model terms for loads over 50 MW', body: 'Pennsylvania PUC', lane: 'state', st: 'PA',
      stage: 'Final order', cls: 'st-enact', topics: ['largeload'], exposure: 2, position: 'Monitor', owner: 'kevin',
      last: { date: '2026-05-13', text: 'Final order issued' }, next: { label: 'Utility tariff filings' },
      analysis: [
        'The PUC issued a first-of-its-kind model tariff framework for large-load customers, applying to customers above 50 MW individually or 100 MW in aggregate [[pa-puc|PA PUC model tariff]]. The framework is non-binding, meant to guide utilities.',
        'It pairs with Act 21, which put utility load forecasts sent to PJM under PUC review [[pa-act21|Utility Dive]].'
      ],
      means: 'Pennsylvania utilities now write large-load tariffs against a model and defend their forecasts. Both need better load analysis, and two of Loomwork’s customers serve Pennsylvania.',
      sources: ['pa-puc', 'natlaw-pa'],
      action: { label: 'Track utility filings', toast: 'Added to monitoring.' }
    },
    {
      id: 'far-cui', ident: 'FAR Part 40', title: 'FAR rule on controlled unclassified information',
      short: 'NIST 800-171 Rev 3 and FedRAMP for contractors', body: 'FAR Council', lane: 'federal',
      stage: 'Final rule pending', cls: 'st-pass', topics: ['funding'], exposure: 2, position: 'Monitor', owner: 'chen',
      last: { date: '2026-07-23', text: 'Comment period closed, 96 comments' }, next: { label: 'Final rule pending' },
      analysis: [
        'The FAR Council re-proposed the CUI rule on 23 Jun as part of the FAR overhaul, moving the requirements into a reorganized FAR Part 40. Comments closed 23 Jul [[farcui|FAR CUI rule]].',
        'If it goes final as written, contractors holding CUI implement NIST SP 800-171 Rev 3, and cloud providers holding it meet FedRAMP Moderate or equivalent [[farcui|Greenberg Traurig]].'
      ],
      means: 'Direct cost and schedule impact on Loomwork’s hosting. Grid data from federal customers frequently carries CUI or CEII markings, so any lab or DOE work puts the company in scope.',
      sources: ['farcui'],
      action: { label: 'Scope the 800-171 gap', toast: 'Requested. Alexandra will send scope and timeline for a Rev 3 gap assessment by Friday.' }
    },
    {
      id: 'cmmc', ident: 'CMMC Phase 2', title: 'CMMC assessment requirements, suspended',
      short: 'Third-party assessments paused pending review', body: 'Department of War', lane: 'federal',
      stage: 'Suspended', cls: 'st-dead', topics: ['funding'], exposure: 1, position: 'Monitor', owner: 'chen',
      last: { date: '2026-09-13', text: 'Task force recommendations due' }, next: { label: 'CIO decision pending' },
      analysis: [
        'Phase 2 assessment requirements, due to appear in contracts on 10 Nov, were suspended on 13 Jul pending a 60-day program review [[cmmc|CMMC Phase 2 paused]]. Recommendations were due to the CIO around 13 Sep.',
        'DFARS 252.204-7012 and Phase 1 self-assessments are unaffected [[cmmc|Crowell & Moring]].'
      ],
      means: 'Only relevant if Loomwork pursues Department of War work. Keep the self-assessment current and do not buy a third-party assessment until the decision lands.',
      sources: ['cmmc'],
      action: { label: 'Hold the assessment spend', toast: 'Noted. Alexandra will flag the moment the CIO decision publishes.' }
    }
  ];

  /* ---------------- compliance obligations ---------------- */
  LW.obligations = [
    { id: 'ob-cip013', regime: 'NERC CIP-013', requirement: 'Supply chain risk terms passed down by utility customers', status: 'due', owner: 'priya', due: '2026-12-15', note: 'Customers working the Level 3 alert’s essential actions are adding vendor security terms to renewals [[nerc-l3|NERC alert]].', rel: 'nerc-alert' },
    { id: 'ob-ceii', regime: 'CEII', requirement: 'Handling procedures for critical energy infrastructure information', status: 'met', owner: 'priya', note: 'Loomwork handles CEII-marked grid models. FERC’s rules govern access and redistribution [[ceii|CEII rules]].' },
    { id: 'ob-800171', regime: 'NIST SP 800-171 Rev 3', requirement: 'Rev 3 controls across systems that touch CUI', status: 'gap', owner: 'priya', due: '2026-12-31', note: 'Not yet required. Becomes mandatory if the FAR CUI rule goes final as proposed [[farcui|FAR CUI rule]].', rel: 'far-cui' },
    { id: 'ob-fedramp', regime: 'FedRAMP', requirement: 'Moderate baseline, or equivalent, for cloud services holding CUI', status: 'gap', owner: 'priya', due: '2027-06-30', note: 'The longest lead item on this list. Start before the rule is final, not after [[farcui|Greenberg Traurig]].', rel: 'far-cui' },
    { id: 'ob-cmmc', regime: 'CMMC', requirement: 'Level 2 certification, only if Loomwork bids Department of War work', status: 'monitor', owner: 'priya', note: 'Phase 2 suspended 13 Jul. Phase 1 self-assessment and DFARS 252.204-7012 still apply [[cmmc|CMMC]].', rel: 'cmmc' },
    { id: 'ob-ld2', regime: 'Lobbying Disclosure Act', requirement: 'Q3 LD-2 report, filed by Locke on Loomwork’s behalf', status: 'due', owner: 'kevin', due: '2026-10-20', note: 'Quarterly report due 20 days after the quarter ends [[lda|LDA deadlines]].' },
    { id: 'ob-ld203', regime: 'Lobbying Disclosure Act', requirement: 'LD-203 semiannual contributions report', status: 'met', owner: 'kevin', due: '2027-01-30', note: 'Mid-year report filed on time. Year-end report due 30 Jan [[lda|LDA deadlines]].' },
    { id: 'ob-clo', regime: 'NERC registration', requirement: 'Computational Load Owner or Operator registration', status: 'monitor', owner: 'chen', note: 'Would apply to Loomwork’s data center customers, not to Loomwork. Locke will re-check when the registry criteria are filed on 31 Dec [[nerc-ballot|Project 2026-02]].', rel: 'nerc-2602' },
    { id: 'ob-sb53', regime: 'California SB 53', requirement: 'Frontier AI safety framework and incident reporting', status: 'met', owner: 'chen', note: 'Documented as out of scope. Loomwork does not train frontier models [[sb53|SB 53]].' },
    { id: 'ob-admt', regime: 'Colorado ADMT Act', requirement: 'Disclosures for automated decisions in consequential areas', status: 'monitor', owner: 'chen', due: '2027-01-01', note: 'Likely out of scope. Alexandra will confirm before the law takes effect [[co-sb189|Skadden]].' },
    { id: 'ob-ear', regime: 'Export controls', requirement: 'Classification review for grid modeling software', status: 'monitor', owner: 'priya', note: 'No current export exposure identified. Revisit before any non-US deployment or foreign partner agreement.' },
    { id: 'ob-foreign', regime: 'Foreign ownership', requirement: 'Cap table screen for federal eligibility', status: 'due', owner: 'chen', due: '2026-10-31', note: 'Needed for SBIR eligibility after the reauthorization added foreign-risk screening, and for the domestic-ownership certifications DOE programs require [[sbir|S. 3971]] [[ai4ix-cwx|CWX-010-GDO]].' }
  ];

  /* ---------------- contracting ---------------- */
  LW.opps = [
    {
      id: 'oe-pilot', ident: 'Illustrative notice', title: 'Interconnection study automation pilot',
      agency: 'DOE Office of Electricity', office: 'Through a national laboratory subcontract', type: 'Solicitation',
      naics: '541715 · 541512', setAside: 'None identified', status: 'Open', illustrative: true,
      posted: '2026-09-02', due: '2026-10-30', value: '$2M to $4M over two years',
      fit: 75, rec: 'Bid', recBy: 'bell', owner: 'bell',
      fitParts: [
        { label: 'Technical match', score: 26, max: 30, note: 'Automated interconnection and large-load studies are Loomwork’s core product.' },
        { label: 'Past performance', score: 12, max: 20, note: 'Two PJM utilities and an ERCOT pilot. No prime federal contract yet.' },
        { label: 'Compliance readiness', score: 10, max: 20, note: 'FedRAMP and NIST 800-171 Rev 3 gaps are the binding constraint.' },
        { label: 'Competition', score: 12, max: 15, note: 'Enverus and national lab teams are credible bidders.' },
        { label: 'Strategic value', score: 15, max: 15, note: 'A federal reference customer changes how utilities buy.' }
      ],
      analysis: [
        '**This page is illustrative.** No live federal solicitation matching Loomwork’s category was open on `15 Sep 2026`. It is modeled on two real programs: DOE’s AI for Interconnection effort, which put up to $30 million behind exactly this problem [[ai4ix|AI4IX]], and GridFM 2.0, the $11.5 million Genesis Mission project announced on 1 Sep [[gridfm|GridFM 2.0]]. Every requirement and rule cited below is real.',
        'The pattern to expect is a lab-led team rather than a direct vendor award. DOE has funded this category through partnership intermediaries and national laboratories, not open competitions [[ai4ix-cwx|CWX-010-GDO]].'
      ],
      why: 'Loomwork does not need to win this to benefit. A subcontract on a lab-led team creates the federal past performance the company currently lacks, and that is the gap holding back every larger bid.',
      requirements: [
        { req: 'Domestic entity, no ownership by countries of risk', status: 'met', note: 'Standard certification on DOE partnership programs [[ai4ix-cwx|CWX-010-GDO]].' },
        { req: 'Team includes a grid operator or utility host', status: 'partial', note: 'Two PJM utility customers could host. Neither has committed.' },
        { req: 'CUI handling under NIST SP 800-171 Rev 3', status: 'partial', note: 'Rev 2 practices in place. Rev 3 gap assessment not started [[farcui|FAR CUI rule]].' },
        { req: 'Cloud services at FedRAMP Moderate or equivalent', status: 'gap', note: 'The binding constraint. Start now; this is a multi-quarter path [[farcui|Greenberg Traurig]].' },
        { req: 'CEII handling procedures', status: 'met', note: 'Already required by utility customers [[ceii|FERC]].' },
        { req: 'Demonstrated study-time reduction', status: 'met', note: 'The ERCOT pilot produced measurable timing results.' }
      ],
      competitors: [
        { name: 'Enverus', note: 'Acquired Pearl Street Technologies in March 2025, whose SUGAR and Interconnect tools automate interconnection studies [[enverus|Enverus acquisition]].' },
        { name: 'Tapestry', note: 'Ran site control review for PJM’s first reformed queue cycle, 811 applications in under an hour [[tapestry|DCD]].' },
        { name: 'Brookhaven National Laboratory team', note: 'Leads GridFM 2.0, building grid foundation models with utility deployments planned [[gridfm|DOE]].' }
      ],
      sources: ['ai4ix', 'ai4ix-cwx', 'gridfm', 'farcui'],
      action: { label: 'Approve bid, assign capture', toast: 'Approved. Marcus opens capture, and the first task is a FedRAMP path decision.' }
    },
    {
      id: 'gridfm', ident: 'GridFM 2.0', title: 'Genesis Mission grid foundation models',
      agency: 'DOE Office of Electricity', office: 'Brookhaven National Laboratory', type: 'Awarded program',
      naics: 'n/a', setAside: 'n/a', status: 'Awarded', posted: '2026-09-01', value: '$11.5M',
      fit: 62, rec: 'Team', recBy: 'bell', owner: 'bell',
      analysis: [
        'DOE announced the award on 1 Sep. Brookhaven leads work on foundation models meant to let utilities evaluate a billion grid scenarios in a day and speed key calculations by orders of magnitude [[gridfm|GridFM 2.0]].',
        'The award includes two deployments with utility partners to demonstrate the technology and move it toward commercial use [[gridfm|DOE]].'
      ],
      why: 'Both a competitor and the best teaming target on the board. The deployments need utility hosts and integration work, and Loomwork already sits inside two PJM utilities. Approach the lab before the deployment partners are chosen.',
      sources: ['gridfm'],
      action: { label: 'Request a lab meeting', toast: 'Requested. Marcus will ask for an introduction through DOE’s technology transitions office.' }
    },
    {
      id: 'spark', ident: 'SPARK · GRIP round 3', title: 'Speed to Power transmission upgrades',
      agency: 'DOE Office of Electricity', office: 'Grid Deployment', type: 'Funding',
      naics: 'n/a', setAside: 'Utilities, states, tribes and grid operators', status: 'Awards expected',
      posted: '2026-03-12', due: '2026-05-20', value: '$1.9B, $10M to $250M per project',
      fit: 55, rec: 'Team', recBy: 'bell', owner: 'bell',
      analysis: [
        'SPARK funds reconductoring and advanced transmission technologies. Concept papers were due 2 Apr and full applications 20 May [[spark|SPARK]]. Selections were expected from August, with awards between October and January [[spark-hk|Holland & Knight]].',
        'Software vendors cannot apply directly. Recipients are utilities, states, tribes and grid operators.'
      ],
      why: 'Every winner has to show that its upgrades added usable capacity, which requires before-and-after studies. Get written into award negotiations rather than chasing subcontracts afterward.',
      sources: ['spark', 'spark-hk'],
      action: { label: 'Draft teaming outreach', toast: 'Draft requested. Marcus will prepare notes for your two PJM utility customers.' }
    },
    {
      id: 'genesis-sbir', ident: 'FY26 Phase I', title: 'Genesis Mission SBIR, Phase I',
      agency: 'DOE', office: 'Office of Technology Commercialization, via ConnectWerx', type: 'SBIR',
      naics: 'n/a', setAside: 'Small business', status: 'Closed', posted: '2026-08-15', due: '2026-09-10', value: 'Up to $250,000 per award',
      fit: 22, rec: 'No-bid', recBy: 'bell', owner: 'bell',
      analysis: [
        'About 40 awards totaling $10 million, capped at $250,000 each, closing 10 Sep at 2:00 pm ET [[genesis-sbir|Genesis SBIR]].',
        'The published topics were AI for biochemicals, quantum computing and networking, AI-driven materials design and autonomous laboratories [[genesis-sbir|ConnectWerx]]. None covers grid planning.'
      ],
      why: 'No-bid, and the reason matters more than the decision. Loomwork is newly SBIR-eligible after the April reauthorization [[sbir|S. 3971]], but eligibility is not fit. Locke checked the topics, found no grid lane, and saved the proposal time. Watch the FY27 round for an energy topic.',
      sources: ['genesis-sbir', 'sbir'],
      action: { label: 'Watch for FY27 topics', toast: 'Watching. Marcus will flag the FY27 topic list the day it posts.' }
    },
    {
      id: 'ai4ix', ident: 'CWX-010-GDO', title: 'Accelerating Interconnection Through AI',
      agency: 'DOE Office of Electricity', office: 'Through ConnectWerx', type: 'Program',
      naics: 'n/a', setAside: 'US for-profit and non-profit entities', status: 'Closed', posted: '2024-11-25', due: '2025-01-10', value: 'Up to $30M',
      fit: 88, rec: 'Watch', recBy: 'bell', owner: 'bell',
      analysis: [
        'DOE made up to $30 million available to apply AI to interconnection: application intake automation, site control verification, data transparency and stakeholder outreach, aligned to the department’s interconnection roadmap [[ai4ix-cwx|CWX-010-GDO]] [[i2x-roadmap|i2X roadmap]].',
        'Applications closed 10 Jan 2025 and awards went out that winter [[ai4ix|AI4IX]]. Teams were expected to pair software developers with project developers, guided by the grid operators that run the queues.'
      ],
      why: 'The highest-fit federal program Locke has found for Loomwork, and it closed before the company was ready. That is the argument for fixing the compliance gaps now. Watch for a successor round, and note that DOE prefers consortium teams over single vendors.',
      sources: ['ai4ix', 'ai4ix-cwx', 'i2x-roadmap'],
      action: { label: 'Alert me on a successor round', toast: 'Alert set across DOE Office of Electricity and ConnectWerx notices.' }
    },
    {
      id: 'genesis-rfa', ident: 'DE-FOA-0003612', title: 'Genesis Mission research applications',
      agency: 'DOE Office of Science', office: 'Genesis Mission', type: 'Funding',
      naics: 'n/a', setAside: 'Labs, universities, industry teams', status: 'Closed', posted: '2026-03-17', due: '2026-05-19', value: '$293.76M across 21 areas',
      fit: 40, rec: 'Team', recBy: 'bell', owner: 'bell',
      analysis: [
        'DOE issued the request for applications on 17 Mar with $293.76 million anticipated across 21 areas, energy among them. Phase I applications were due 1 May and Phase II applications 19 May [[genesis-rfa|DE-FOA-0003612]].',
        'GridFM 2.0 came out of this program [[gridfm|DOE]].'
      ],
      why: 'Loomwork is not a lab and will not lead one of these. The route in is as an industry partner on a lab team, which is how the grid awards have been structured.',
      sources: ['genesis-rfa', 'gridfm'],
      action: { label: 'Track the next cycle', toast: 'Tracking. Marcus will flag the FY27 announcement.' }
    }
  ];

  /* ---------------- market and competitor intel ---------------- */
  LW.intel = [
    { date: '2026-09-01', title: 'DOE funds grid foundation models at Brookhaven', note: 'GridFM 2.0, $11.5M, with two utility deployments planned [[gridfm|DOE]].', href: '#/o/gridfm' },
    { date: '2026-06-01', title: 'Tapestry runs PJM’s first reformed queue cycle', note: 'Site control review for 811 applications, 220 GW, in under an hour [[tapestry|DCD]].' },
    { date: '2025-03-13', title: 'Enverus acquires Pearl Street Technologies', note: 'Puts SUGAR and Interconnect inside a large energy software vendor [[enverus|Enverus]].' },
    { date: '2026-01-30', title: 'CAISO reports 4.5 GW of data center demand in study', note: 'Large load considerations issue paper [[caiso-ll|CAISO]].' }
  ];

  /* these views are built now, so they leave the planned list */
  delete LW.planned.regulatory;
  delete LW.planned.contracting;
  LW.planned.disclosures = { phase: 3, group: 'Lobbying', title: 'Disclosures', blurb: 'Locke’s LD-2 and LD-203 filings for Loomwork, plus competitor lobbying pulled from the public database. Real figures only.', items: ['Quarterly LD-2 filings with issue areas and covered officials', 'Contribution reporting on the LD-203 cycle', 'Competitor lobbying activity, where filings exist'] };

  LW.coming.push(
    { date: '2026-09-18', title: 'NERC computational load ballot closes', meta: 'NERC · 8:00 pm ET', href: '#/r/nerc-2602', sev: 'act' },
    { date: '2026-10-30', title: 'Illustrative pilot response due', meta: 'DOE Office of Electricity', href: '#/o/oe-pilot', sev: 'watch' },
    { date: '2026-12-31', title: 'NERC must file computational load standards', meta: 'FERC RD26-7-000', href: '#/r/ferc-rd26' }
  );

  LW.since.unshift(
    { id: 'sn-nerc', kind: 'deadline', sev: 'act', date: '2026-09-15', title: 'Three days left on the NERC computational load ballot', detail: 'Comments and the initial ballot on CLO-001-1 close 8:00 pm ET Friday [[nerc-ballot|Project 2026-02]]. Alexandra is drafting; she needs Priya’s technical review by Thursday.', ref: { type: 'r', id: 'nerc-2602' }, hideable: true },
    { id: 'sn-gridfm', kind: 'new', sev: 'watch', date: '2026-09-11', title: 'Added to tracker: DOE’s GridFM 2.0 award', detail: 'An $11.5M Genesis Mission project at Brookhaven building grid foundation models, announced 1 Sep [[gridfm|DOE]]. Competitor and teaming target at once.', ref: { type: 'o', id: 'gridfm' }, hideable: true }
  );
})(window.LW);
