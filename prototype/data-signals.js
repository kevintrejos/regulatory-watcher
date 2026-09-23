/* The intelligence layer.

   Three tables that together answer a question no public-record database
   can: what do we know that is not on a .gov site yet, how sure are we,
   and are we allowed to repeat it.

   LW.feeds    where faster-than-government information comes from
   LW.signals  what a Locke person heard, read or watched, graded
   LW.queue    what the agents drafted off it, waiting on a human

   Every signal below is fictional tradecraft written for the concept.
   Named officials appear only where the public record already carries
   the fact, and no signal claims a private meeting between a real
   official and a client.  */
(LW => {

  /* ---------- where the fast information comes from ----------
     license is the field that matters. A seat on a subscription wire
     buys the right to read it, never the right to resell the text to a
     client. So paid feeds enter the system as human-logged takeaways
     with attribution, and free feeds can be quoted.  */
  LW.feeds = [
    { id: 'fd-pro', name: 'Politico Pro', kind: 'Subscription', latency: 'minutes', license: 'read', seats: 3,
      note: 'Three Locke seats. Reporters file floor and markup changes well before the committee site updates. Takeaways may be logged and attributed. Text may never be pasted into a client deliverable.' },
    { id: 'fd-pbj', name: 'Punchbowl News', kind: 'Subscription', latency: 'minutes', license: 'read', seats: 2,
      note: 'Leadership and floor scheduling. Best early read on whether a bill actually gets a vote.' },
    { id: 'fd-rto', name: 'RTO Insider', kind: 'Subscription', latency: 'hours', license: 'read', seats: 2,
      note: 'The only consistent coverage of RTO stakeholder committees, which publish minutes weeks late if at all.' },
    { id: 'fd-trib', name: 'Texas Tribune', kind: 'Public', latency: 'hours', license: 'quote',
      note: 'Free and citable. Carries PUCT and ERCOT politics the commission docket never states outright.' },
    { id: 'fd-cal', name: 'CalMatters', kind: 'Public', latency: 'hours', license: 'quote',
      note: 'Free and citable. Strong on CPUC proceedings and the Sacramento end of session.' },
    { id: 'fd-social', name: 'Capitol press pool posts', kind: 'Social', latency: 'seconds', license: 'quote',
      note: 'Statehouse reporters post floor action in real time. Fastest signal available and the least reliable. Never cite alone.' },
    { id: 'fd-dive', name: 'Utility Dive', kind: 'Public', latency: 'hours', license: 'quote',
      note: 'Trade coverage of FERC and NERC. Useful for reading how the industry is receiving an order.' }
  ];

  const FEED = { pro: 'fd-pro', pbj: 'fd-pbj', rto: 'fd-rto', trib: 'fd-trib', cal: 'fd-cal', social: 'fd-social' };

  /* ---------- the log ----------
     kind     how we know it
     conf     how much weight it carries
     handling who may see it  */
  LW.signals = [
    {
      id: 'sg-ballot', date: '2026-09-14', logged: 'chen', kind: 'heard', conf: 'med', handling: 'client',
      title: 'Second ballot on CLO-001-1 looks likely',
      who: 'A registered participant in the NERC standards process',
      note: 'Heard that enough negative ballots with comments are coming in on the computational load standard that the drafting team is already planning a second posting rather than pushing for approval this round. If that holds, the **December FERC filing deadline gets tight** and the substance stays open longer than the calendar suggests.',
      ents: [{ t: 'r', id: 'nerc-2602' }, { t: 'r', id: 'ferc-rd26' }],
      clients: ['loomwork', 'halden'], status: 'open', corrob: ['sg-rto-ballot'],
      why: 'Changes the ask. If a second ballot is coming, the useful comment is the one that shapes the redraft, not the one that tries to stop approval.'
    },
    {
      id: 'sg-rto-ballot', date: '2026-09-12', logged: 'kevin', kind: 'reported', conf: 'med', handling: 'client',
      title: 'Trade press reads the standard as contested',
      who: 'Trade coverage of the drafting team call', outlet: FEED.rto,
      note: 'Coverage of the standards drafting call described the registration threshold as the unresolved question, with load-serving entities and large load operators on opposite sides. Consistent with what Alexandra heard separately.',
      ents: [{ t: 'r', id: 'nerc-2602' }],
      clients: ['loomwork', 'halden'], status: 'open', corrob: ['sg-ballot'],
      why: 'Second, independent source pointing the same way. Two mediocre sources agreeing is worth more than one good one.'
    },
    {
      id: 'sg-cr', date: '2026-09-15', logged: 'bell', kind: 'reported', conf: 'high', handling: 'client',
      title: 'Anomaly list for the CR is being written now',
      who: 'Leadership newsletter reporting on approps staff', outlet: FEED.pbj,
      note: 'Reporting says appropriations staff are assembling the anomaly list this week. Anomalies are the only vehicle for program-specific money in a continuing resolution, so **this week is when a program either gets protected or does not**.',
      ents: [{ t: 'm', id: 'cr27' }, { t: 'm', id: 'ew27' }],
      clients: ['loomwork', 'kestrel', 'rampart'], status: 'open',
      why: 'Turns a passive watch item into a dated action. The window is days, not weeks.'
    },
    {
      id: 'sg-puct', date: '2026-09-11', logged: 'kevin', kind: 'observed', conf: 'high', handling: 'client',
      title: 'Commissioners signaled a narrower large-load rule from the bench',
      who: 'Locke staff watching the open meeting webcast',
      note: 'At the open meeting, questions from the bench focused almost entirely on curtailment obligations rather than on the cost allocation formula. The filed agenda did not preview that. **The written order will likely land narrower than the proposal** on cost and heavier on curtailment.',
      ents: [{ t: 'r', id: 'puct-25194' }],
      clients: ['loomwork', 'halden'], status: 'open',
      why: 'Nothing in the docket says this. It is only visible if someone watches the meeting, which is exactly the gap the listener closes.'
    },
    {
      id: 'sg-ca', date: '2026-09-09', logged: 'maya', kind: 'heard', conf: 'low', handling: 'internal',
      title: 'Interconnection language may ride on an unrelated bill',
      who: 'A Sacramento consultant, secondhand',
      note: 'Unconfirmed and thirdhand. Someone is reportedly shopping interconnection cost language for a gut-and-amend late in session. No bill number, no author, no confirmation. Logged so that if a vehicle appears we recognize it instead of meeting it cold.',
      ents: [{ t: 'm', id: 'ca-sb886' }],
      clients: ['loomwork'], status: 'open',
      why: 'Low confidence and internal only. This is a tripwire, not a finding. It never reaches a client in this state.'
    },
    {
      id: 'sg-ohio', date: '2026-09-08', logged: 'bell', kind: 'confirmed', conf: 'high', handling: 'public',
      title: 'Ohio ratepayer language matches the federal bill almost word for word',
      who: 'Locke analysis of both texts, verified against the enrolled bill',
      note: 'The cost-allocation section of the Ohio measure tracks the federal Ratepayer Protection Act closely enough that it is plainly drawn from the same model text. **Expect the same language in three to five more states** next session.',
      ents: [{ t: 'm', id: 'oh-hb646' }, { t: 'm', id: 'hr9340' }],
      clients: ['loomwork', 'halden', 'arcadia'], status: 'confirmed',
      why: 'Model legislation spreads. Catching the pattern once buys a season of warning in every other state.'
    },
    {
      id: 'sg-cmmc', date: '2026-09-10', logged: 'chen', kind: 'reported', conf: 'med', handling: 'client',
      title: 'Assessor capacity is the real constraint on CMMC timing',
      who: 'Trade reporting on the accreditation body', outlet: FEED.pro,
      note: 'Reporting suggests the assessor bench is the binding constraint on Phase 2 timing, not the rule text. If true, **the queue is the deadline** and booking early matters more than certifying fast.',
      ents: [{ t: 'r', id: 'cmmc' }],
      clients: ['kestrel', 'rampart'], status: 'open',
      why: 'Changes the advice from "start preparing" to "book an assessor now."'
    },
    {
      id: 'sg-quiet', date: '2026-09-05', logged: 'kevin', kind: 'observed', conf: 'med', handling: 'internal',
      title: 'The Texas interim charge has gone quiet',
      who: 'Locke tracking of committee postings',
      note: 'No hearing posted on the large-load interim charge since the spring. In an interim, silence usually means the work moved to a working group that does not post. Worth a call before assuming nothing is happening.',
      ents: [{ t: 'm', id: 'tx-interim' }],
      clients: ['loomwork', 'halden'], status: 'open',
      why: 'Absence of activity is itself a signal, but only if you know the body is supposed to be active.'
    }
  ];

  /* ---------- what the agents drafted, waiting on a human ----------
     Nothing in this queue has left the building. That is the point:
     an agent-drafted alert that goes out unreviewed is how a firm loses
     a client, so the human stays in the path and the stamp records it. */
  LW.queue = [
    {
      id: 'q-ballot', kind: 'alert', client: 'loomwork', status: 'pending',
      title: 'NERC ballot closes Friday and a second round now looks likely',
      drafted: '2026-09-15 06:41', agent: 'Monitor', conf: 0.86,
      channel: '#loomwork-locke', audience: 'Priya Raman, Daniel Okafor',
      why: 'Deadline inside 72 hours, plus two independent signals that the standard will not pass this round.',
      signals: ['sg-ballot', 'sg-rto-ballot'],
      body: 'Comments and the initial ballot on the computational load standard close **8:00 pm ET Friday** [[nerc-ballot|Project 2026-02]].\n\nTwo separate reads now suggest this goes to a second ballot rather than passing. If that holds, the comment that matters is the one shaping the redraft, not the one opposing approval. Alexandra has a draft; she needs Priya on the technical section by Thursday.',
      flags: [], sched: null
    },
    {
      id: 'q-cr', kind: 'alert', client: 'loomwork', status: 'pending',
      title: 'The CR anomaly list is being written this week',
      drafted: '2026-09-15 06:41', agent: 'Monitor', conf: 0.78,
      channel: '#loomwork-locke', audience: 'Daniel Okafor',
      why: 'Reported timing turns a standing watch item into a dated one.',
      signals: ['sg-cr'],
      body: 'Appropriations staff are assembling the anomaly list now. Anomalies are the only route to program-specific funding in a continuing resolution, so the window to ask is **this week**.\n\nRecommend Daniel send the one-paragraph ask to both approps offices by Wednesday. Draft is in Briefs.',
      flags: [], sched: null
    },
    {
      id: 'q-puct', kind: 'brief', client: 'halden', status: 'pending',
      title: 'What the PUCT bench signaled about the large-load rule',
      drafted: '2026-09-14 17:20', agent: 'Analyst', conf: 0.71,
      channel: '#halden-locke', audience: 'Halden policy lead',
      why: 'Firsthand observation that does not appear anywhere in the docket.',
      signals: ['sg-puct'],
      body: 'Questions from the bench at the open meeting ran heavily to curtailment obligations rather than cost allocation. The written order will likely land narrower on cost and heavier on curtailment than the proposal reads.\n\nThis is an observation from the webcast, not a filing. Treat it as direction, not as text.',
      flags: ['single-source'], sched: null
    },
    {
      id: 'q-ohio', kind: 'memo', client: 'loomwork', status: 'pending',
      title: 'Model ratepayer language is spreading. Here are the next states.',
      drafted: '2026-09-13 09:02', agent: 'Analyst', conf: 0.64,
      channel: '#loomwork-locke', audience: 'Maya Fontaine',
      why: 'Pattern match across two jurisdictions with a forward prediction attached.',
      signals: ['sg-ohio'],
      body: 'The Ohio cost-allocation section tracks the federal Ratepayer Protection Act closely enough to share a source. Expect the same language in three to five states next session.\n\nThe forward-looking state list in this draft is **an estimate and is not sourced**. It needs a human call before it goes out.',
      flags: ['unverified-citation'], sched: null
    },
    {
      id: 'q-cmmc', kind: 'alert', client: 'kestrel', status: 'scheduled',
      title: 'Book a CMMC assessor now. The queue is the deadline.',
      drafted: '2026-09-14 08:15', agent: 'Monitor', conf: 0.81,
      channel: '#kestrel-locke', audience: 'Kestrel ops',
      why: 'Slack-only client. This is their whole product, so it has to be right.',
      signals: ['sg-cmmc'],
      body: 'Reporting suggests assessor capacity, not the rule text, is what sets Phase 2 timing. If that holds, the booking queue is the real deadline.\n\nRecommend booking an assessment slot this month even if the documentation is not finished.',
      flags: [], sched: '2026-09-16 08:00'
    },
    {
      id: 'q-conflict', kind: 'alert', client: 'halden', status: 'pending',
      title: 'Cost allocation comment window opens at the PUCT',
      drafted: '2026-09-15 06:41', agent: 'Monitor', conf: 0.9,
      channel: '#halden-locke', audience: 'Halden policy lead',
      why: 'Routine deadline alert, but it lands on a docket where two clients have opposed positions.',
      signals: ['sg-puct'],
      body: 'Comments on the large-load rule are due in three weeks. Halden has an interest in the curtailment terms.',
      flags: ['position-conflict'], sched: null
    }
  ];

})(window.LW);
