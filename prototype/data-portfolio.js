/* The Locke side of the platform: one policy person, five clients.
   Clients other than Loomwork are fictional, as is all commercial and relationship detail.
   The policy events they are mapped against are real and cited elsewhere in the app. */
(function (LW) {
  LW.locke = {
    firm: 'Locke Government Affairs',
    user: 'kevin',
    seat: 'Policy lead · 5 accounts',
    mode: 'locke'          // default landing. 'client' switches to the Loomwork view
  };

  LW.clients = [
    {
      id: 'loomwork', name: 'Loomwork', sector: 'Grid planning software', stage: 'Series B · 150 people', hq: 'San Francisco',
      tier: 'platform', since: '2026-03-02', health: 'good', live: 35, openActions: 3,
      agenda: 'Faster interconnection, large-load rules, and federal money that can buy software.',
      next: { date: '2026-09-18', label: 'NERC ballot closes' },
      seats: [{ name: 'Maya Okafor', role: 'CEO', last: '2026-09-15' }, { name: 'Priya Natarajan', role: 'CISO', last: '2026-09-14' }, { name: 'Daniel Reyes', role: 'Head of Gov Sales', last: '2026-09-11' }],
      relationship: { lastContact: '2026-09-15', cadence: 'Weekly brief, Slack daily', engaged: 'Maya reads every Act card and answers same day', ignored: 'State AI bills with no grid nexus', asked: 'More on ERCOT, less on distribution-level dockets' },
      delivery: { alerts: 34, briefs: 8, filings: 2, lastBrief: { title: 'Comment on CLO-001-1', date: '2026-09-15' } },
      commercial: { retainer: '$18,000 per month', term: '12 months', renewal: '2027-03-01', effort: '21 of 30 hours this month' },
      note: 'The reference account. Heaviest usage, and the only client filing in federal records this quarter.'
    },
    {
      id: 'halden', name: 'Halden Compute', sector: 'Hyperscale data centers', stage: 'Series D · 400 people', hq: 'Reston, Virginia',
      tier: 'platform', since: '2025-11-10', health: 'watch', live: 28, openActions: 4,
      agenda: 'Keep interconnection moving in PJM and ERCOT, and keep cost-allocation rules workable.',
      next: { date: '2026-09-30', label: 'Maryland rate schedules filed' },
      seats: [{ name: 'Ruth Calloway', role: 'General Counsel', last: '2026-09-09' }],
      relationship: { lastContact: '2026-09-09', cadence: 'Weekly brief to the GC, no Slack', engaged: 'Ruth forwards everything to outside counsel before acting', ignored: 'Anything federal that is not FERC', asked: 'Virginia and Ohio first, always' },
      delivery: { alerts: 51, briefs: 6, filings: 1, lastBrief: { title: 'Five-state cost allocation comparison', date: '2026-09-02' } },
      commercial: { retainer: '$25,000 per month', term: '12 months', renewal: '2026-11-10', effort: '29 of 30 hours this month' },
      note: 'Renewal in eight weeks and the account is running at capacity. Ruth has asked twice for a state-by-state cost model Locke has not built.'
    },
    {
      id: 'arcadia', name: 'Arcadia Silicon', sector: 'AI accelerators', stage: 'Series C · 260 people', hq: 'Austin',
      tier: 'slack', since: '2026-06-15', health: 'good', live: 16, openActions: 1,
      agenda: 'Power for test fabs, export rules that do not strand the product line.',
      next: { date: '2026-11-03', label: 'Midterms, then export policy' },
      seats: [],
      relationship: { lastContact: '2026-09-04', cadence: 'Slack only, digest on Mondays', engaged: 'Their VP Eng replies in the channel, nobody else does', ignored: 'State legislation of any kind', asked: 'Tell us before Commerce does' },
      delivery: { alerts: 22, briefs: 2, filings: 0, lastBrief: { title: 'Export classification: what would change', date: '2026-08-19' } },
      commercial: { retainer: '$9,000 per month', term: '6 months', renewal: '2026-12-15', effort: '7 of 12 hours this month' },
      note: 'Quiet by design. The risk is that quiet reads as no value at renewal.'
    },
    {
      id: 'kestrel', name: 'Kestrel Autonomy', sector: 'Defense robotics', stage: 'Series B · 120 people', hq: 'Arlington, Virginia',
      tier: 'slack', since: '2026-01-20', health: 'watch', live: 19, openActions: 2,
      agenda: 'Get on a program of record, survive the compliance ladder that comes with it.',
      next: { date: '2026-12-11', label: 'Stopgap expires' },
      seats: [],
      relationship: { lastContact: '2026-09-12', cadence: 'Slack, plus a monthly call', engaged: 'Founder reads everything, usually at midnight', ignored: 'Energy and grid items', asked: 'What does the CMMC pause actually mean for our bid' },
      delivery: { alerts: 29, briefs: 4, filings: 0, lastBrief: { title: 'CMMC Phase 2 suspension: what changes for bidders', date: '2026-07-16' } },
      commercial: { retainer: '$12,000 per month', term: '12 months', renewal: '2027-01-20', effort: '14 of 18 hours this month' },
      note: 'Their question about the CMMC pause has been open for four days. That is the oldest unanswered client question in the book.'
    },
    {
      id: 'rampart', name: 'Rampart Systems', sector: 'Counter-UAS', stage: 'Series A · 70 people', hq: 'Colorado Springs',
      tier: 'slack', since: '2026-07-01', health: 'good', live: 12, openActions: 0,
      agenda: 'Appropriations language, and a path into a service branch that is not a pilot.',
      next: { date: '2026-10-20', label: 'Q3 LD-2 due' },
      seats: [],
      relationship: { lastContact: '2026-09-08', cadence: 'Slack only', engaged: 'Two co-founders, both responsive', ignored: 'Nothing yet, the account is new', asked: 'Who do we need to know on the authorizing committees' },
      delivery: { alerts: 11, briefs: 1, filings: 0, lastBrief: { title: 'Onboarding memo: the FY27 calendar', date: '2026-07-14' } },
      commercial: { retainer: '$8,000 per month', term: '6 months', renewal: '2027-01-01', effort: '5 of 12 hours this month' },
      note: 'Newest account. Still in the window where the first real win sets expectations for the year.'
    }
  ];

  /* What needs a Locke human today, across the whole book. */
  LW.triage = [
    { id: 'tr1', client: 'loomwork', sev: 'act', due: '2026-09-18', title: 'File the NERC comment for Loomwork', why: 'Blocked on Priya’s technical review, due tomorrow noon. Alexandra files Friday.', ref: { type: 'r', id: 'nerc-2602' }, owner: 'chen' },
    { id: 'tr2', client: 'kestrel', sev: 'act', due: '2026-09-16', title: 'Answer Kestrel on what the CMMC pause means for their bid', why: 'Asked four days ago. Oldest open question in the portfolio, and the answer is short.', ref: { type: 'r', id: 'cmmc' }, owner: 'chen' },
    { id: 'tr3', client: 'halden', sev: 'act', due: '2026-09-22', title: 'Halden renewal call needs the state cost model they asked for twice', why: 'Renewal 10 Nov, account at capacity, and the one thing they keep asking for does not exist yet.', owner: 'kevin' },
    { id: 'tr4', client: 'loomwork', sev: 'watch', due: '2026-09-30', title: 'Watch Newsom on AB 2383 and SB 886', why: 'No action needed. One line to Maya when he signs or vetoes.', ref: { type: 'm', id: 'ca-ab2383' }, owner: 'kevin' },
    { id: 'tr5', client: 'halden', sev: 'watch', due: '2026-09-30', title: 'Pull Maryland large-load rate schedules when utilities file', why: 'Halden has two sites in the PSC’s territory. First look at how Maryland calculates large-load cost.', ref: { type: 'm', id: 'md-hb1532' }, owner: 'kevin' },
    { id: 'tr6', client: 'arcadia', sev: 'fyi', due: '2026-09-21', title: 'Arcadia has had no substantive contact in two weeks', why: 'Slack-only account, renewal in December. Quiet is fine, silence at renewal is not.', owner: 'kevin' },
    { id: 'tr7', client: 'rampart', sev: 'fyi', due: '2026-10-20', title: 'Add Rampart to the Q3 LD-2 filing', why: 'First quarter of representation. Issue areas need to be written before the 20th.', owner: 'kevin' }
  ];

  /* One event, many clients. The view Slack cannot give a firm. */
  LW.impacts = [
    {
      id: 'im-showcause', title: 'FERC large-load show cause orders', ident: 'RM26-4 · §206', date: '2026-11-16', dateLabel: 'Operator responses due',
      ref: { type: 'r', id: 'ferc-showcause' },
      summary: 'Five grid operators must justify or rewrite how large loads connect. It reaches three clients in opposite directions.',
      rows: [
        { client: 'loomwork', exposure: 3, position: 'Engage', line: 'Every response needs a faster way to study large loads. This is the year’s commercial opening.' },
        { client: 'halden', exposure: 3, position: 'Engage', line: 'Whatever the operators file becomes the queue Halden’s next four sites sit in.' },
        { client: 'arcadia', exposure: 1, position: 'Monitor', line: 'Indirect. Affects how fast the sites that host their accelerators get power.' },
        { client: 'kestrel', exposure: 0, position: 'No action', line: 'No exposure.' },
        { client: 'rampart', exposure: 0, position: 'No action', line: 'No exposure.' }
      ]
    },
    {
      id: 'im-clo', title: 'NERC computational load standards', ident: 'CLO-001-1 · Project 2026-02', date: '2026-09-18', dateLabel: 'Comment and ballot close',
      ref: { type: 'r', id: 'nerc-2602' },
      summary: 'The first mandatory reliability standards written for data center load. One client sells into it, one client gets registered by it.',
      conflict: true,
      conflictNote: 'Loomwork gains from strict study and data requirements. Halden carries the cost of them. Locke files separately for each, with different teams and no shared work product, and both clients know.',
      rows: [
        { client: 'loomwork', exposure: 3, position: 'Support', line: 'Mandatory modeled studies for every large load. Filing in support of the data requirements.' },
        { client: 'halden', exposure: 3, position: 'Oppose in part', line: 'Would make Halden a registered Computational Load Entity, with ride-through and reporting duties. Filing on the compliance burden.' },
        { client: 'arcadia', exposure: 1, position: 'Monitor', line: 'Only matters if they build their own compute halls, which is on the roadmap for 2028.' },
        { client: 'kestrel', exposure: 0, position: 'No action', line: 'No exposure.' },
        { client: 'rampart', exposure: 0, position: 'No action', line: 'No exposure.' }
      ]
    },
    {
      id: 'im-cr', title: 'Stopgap funding expires', ident: 'FY27 CR', date: '2026-12-11', dateLabel: 'Funding runs out',
      ref: { type: 'm', id: 'cr27' },
      summary: 'The lame duck decides FY27. It reaches four clients through four different accounts.',
      rows: [
        { client: 'kestrel', exposure: 3, position: 'Engage', line: 'Their program line sits in the defense bill. No full-year bill, no new starts.' },
        { client: 'rampart', exposure: 3, position: 'Engage', line: 'The counter-UAS language they need is report language, and report language happens in the lame duck.' },
        { client: 'loomwork', exposure: 2, position: 'Engage', line: 'DOE grid programs are flat until a full-year bill. The eligibility ask goes in the same window.' },
        { client: 'arcadia', exposure: 1, position: 'Monitor', line: 'Research accounts only. Watching, not asking.' },
        { client: 'halden', exposure: 0, position: 'No action', line: 'No federal funding exposure.' }
      ]
    },
    {
      id: 'im-cmmc', title: 'CMMC Phase 2 suspension', ident: 'Department of War', date: '2026-09-13', dateLabel: 'Task force recommendations delivered',
      ref: { type: 'r', id: 'cmmc' },
      summary: 'Assessment requirements are paused pending a decision. Two defense clients are waiting on the answer before they spend.',
      rows: [
        { client: 'kestrel', exposure: 3, position: 'Monitor', line: 'They asked four days ago whether to keep paying for assessment prep. The answer is hold.' },
        { client: 'rampart', exposure: 2, position: 'Monitor', line: 'Too early to matter for their contract vehicle, but it changes the readiness plan.' },
        { client: 'loomwork', exposure: 1, position: 'Monitor', line: 'Only relevant if they pursue Department of War work.' },
        { client: 'arcadia', exposure: 1, position: 'Monitor', line: 'Same.' },
        { client: 'halden', exposure: 0, position: 'No action', line: 'No exposure.' }
      ]
    }
  ];
})(window.LW);
