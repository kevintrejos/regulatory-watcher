'use strict';
/* Finding bodies before anyone is watching them.

   Every tracker's list of commissions and boards is hand-maintained, so
   when a statute stands up an AI oversight council the council starts
   meeting months later and issues binding guidance while no tracker knows
   it exists. The client reads about it in the trade press.

   Enabling statutes are formulaic, which is what makes this tractable.
   "There is hereby created", "shall establish", "to be known as", followed
   by an appointment clause and often a sunset date. The inverse matters
   just as much: bodies get abolished and sunset, and a registry full of
   dead rows loses trust faster than one with gaps. */

const BODY_NOUN = '(?:Commission|Council|Board|Authority|Committee|Task\\s*Force|Working\\s*Group|Office|Division|Bureau|Panel|Advisory\\s*(?:Committee|Council|Board)|Corporation|Agency|Institute)';

const CREATE = [
  { re: new RegExp(`there\\s+is\\s+(?:hereby\\s+)?(?:created|established)(?:\\s+(?:within|in|under)\\s+[^,.;]{3,80})?[,\\s]+(?:a|an|the)\\s+([^,.;]{4,120}?${BODY_NOUN})`, 'gi'), kind: 'created' },
  { re: new RegExp(`(?:shall|must)\\s+(?:establish|create|appoint)\\s+(?:a|an|the)\\s+([^,.;]{4,120}?${BODY_NOUN})`, 'gi'), kind: 'created' },
  { re: new RegExp(`to\\s+be\\s+known\\s+as\\s+(?:the\\s+)?([^,.;]{4,120}?${BODY_NOUN})`, 'gi'), kind: 'named' },
  { re: new RegExp(`(?:a|an|the)\\s+([A-Z][^,.;]{4,120}?${BODY_NOUN})\\s+is\\s+(?:hereby\\s+)?(?:created|established)`, 'gi'), kind: 'created' }
];

const END = [
  { re: new RegExp(`(?:the\\s+)?([^,.;]{4,120}?${BODY_NOUN})\\s+is\\s+(?:hereby\\s+)?(?:abolished|dissolved|terminated|repealed)`, 'gi'), kind: 'abolished' },
  { re: new RegExp(`(?:the\\s+)?([^,.;]{4,120}?${BODY_NOUN})\\s+shall\\s+(?:terminate|expire|sunset|cease\\s+to\\s+exist)`, 'gi'), kind: 'sunset' }
];

/* Corroborating detail. A match with an appointment clause or a first
   meeting deadline is almost certainly a real body; a bare phrase match
   might be a reference to one that already exists. */
const SIGNALS = {
  membership: /\bshall\s+consist\s+of\s+(?:not\s+(?:more|fewer|less)\s+than\s+)?(\w+|\d+)\s+(?:voting\s+)?members?\b/i,
  appointment: /\b(?:appointed\s+by|shall\s+appoint)\b/i,
  firstMeeting: /\bfirst\s+meeting\s+(?:no\s+later\s+than|within|on\s+or\s+before)\s+([A-Z][a-z]+\s+\d{1,2},?\s*\d{4}|[^,.;]{3,60})/i,
  sunsetDate: /\b(?:terminate|expire|sunset|cease\s+to\s+exist)\s+on\s+([A-Z][a-z]+\s+\d{1,2},?\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4})/i,
  reportDue: /\bshall\s+(?:submit|issue|publish)\s+(?:a\s+)?report\b[^.]{0,80}?\b(?:no\s+later\s+than|by)\s+([A-Z][a-z]+\s+\d{1,2},?\s*\d{4}|[^,.;]{3,60})/i,
  rulemaking: /\b(?:shall|may)\s+(?:adopt|promulgate|issue)\s+(?:rules|regulations)\b/i
};

const clean = s => String(s || '').replace(/\s+/g, ' ').replace(/^(?:a|an|the)\s+/i, '').trim();
const TITLECASE = /^(?:[A-Z][\w'-]*|of|for|on|and|the|in|to)(?:\s+(?:[A-Z][\w'-]*|of|for|on|and|the|in|to))*$/;

function scan(text, meta) {
  const src = String(text || '').replace(/\s+/g, ' ');
  const found = new Map();

  const record = (name, kind, at) => {
    const n = clean(name);
    if (n.length < 8 || n.split(' ').length < 2) return;
    const key = n.toLowerCase();
    const window = src.slice(Math.max(0, at - 200), Math.min(src.length, at + 700));
    const detail = {};
    for (const [k, re] of Object.entries(SIGNALS)) {
      const m = re.exec(window);
      if (m) detail[k] = m[1] ? clean(m[1]) : true;
    }
    /* Confidence is about how much corroboration sits around the phrase,
       and whether the name reads like a proper noun. */
    let conf = 0.45;
    if (TITLECASE.test(n)) conf += 0.2;
    if (detail.membership) conf += 0.15;
    if (detail.appointment) conf += 0.1;
    if (detail.firstMeeting) conf += 0.1;
    if (detail.rulemaking) conf += 0.05;
    conf = Math.min(0.97, conf);

    const prev = found.get(key);
    if (prev && prev.confidence >= conf) { prev.kinds = [...new Set([...prev.kinds, kind])]; return; }
    found.set(key, {
      name: n, kinds: [kind], confidence: +conf.toFixed(2), detail,
      excerpt: window.slice(Math.max(0, at - Math.max(0, at - 200) - 60), Math.max(0, at - Math.max(0, at - 200)) + 220).trim(),
      source: meta || {}
    });
  };

  for (const { re, kind } of CREATE) { re.lastIndex = 0; let m; while ((m = re.exec(src))) record(m[1], kind, m.index); }
  for (const { re, kind } of END)    { re.lastIndex = 0; let m; while ((m = re.exec(src))) record(m[1], kind, m.index); }

  return [...found.values()].sort((a, b) => b.confidence - a.confidence);
}

/* Turn a find into a registry stub so it can be watched immediately,
   with status reflecting that nobody has confirmed it stood up yet. */
function toRegistryStub(find, meta) {
  const ending = find.kinds.some(k => k === 'abolished' || k === 'sunset');
  return {
    id: find.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48),
    name: find.name,
    jurisdiction: (meta && meta.jurisdiction) || 'US',
    type: /council/i.test(find.name) ? 'council' : /board/i.test(find.name) ? 'board' : /task\s*force/i.test(find.name) ? 'taskforce' : 'commission',
    authority: (meta && meta.citation) || null,
    status: ending ? 'ending' : 'proposed',
    url: null, access: 'unknown', adapter: null,
    cadence: { pattern: 'unknown' },
    firstMeeting: find.detail.firstMeeting || null,
    sunsetDate: find.detail.sunsetDate || null,
    members: find.detail.membership || null,
    canMakeRules: !!find.detail.rulemaking,
    discoveredFrom: meta || null,
    confidence: find.confidence,
    verifiedAt: null
  };
}

module.exports = { scan, toRegistryStub };
