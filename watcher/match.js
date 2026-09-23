'use strict';
/* Linking a post to a bill.

   Two gates, in order. First the alias has to actually appear, as a whole
   phrase and not as a substring: "S. 886" must not fire on "S. 8867".
   Second, if the alias carries a `needs` list, something has to satisfy
   it, either in the post itself or from the reporter's own beat. An
   Illinois statehouse reporter writing "SB 886" means the Illinois bill,
   and that is knowable without the post saying "Illinois". */

const { STATE_NAMES } = require('./aliases.js');

const norm = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* Whole-phrase, case-insensitive, not inside a longer alphanumeric run.
   Internal whitespace in the alias matches any whitespace in the post. */
function phraseRe(alias, cs) {
  const body = escapeRe(alias).replace(/\\?\s+/g, '\\s+');
  return new RegExp(`(?<![A-Za-z0-9])${body}(?![A-Za-z0-9])`, cs ? '' : 'i');
}
const reCache = new Map();
const getRe = (a, cs) => {
  const k = (cs ? 'cs:' : 'ci:') + a;
  let r = reCache.get(k);
  if (!r) { r = phraseRe(a, cs); reCache.set(k, r); }
  return r;
};

/* An alias gate is satisfied by the post text, or by the reporter covering
   that jurisdiction. */
function gateOk(needs, text, reporter) {
  if (!needs || !needs.length) return { ok: true, by: null };
  for (const n of needs) {
    if (getRe(n).test(text)) return { ok: true, by: `post says "${n}"` };
  }
  const jur = (reporter && reporter.jurisdiction) || [];
  for (const n of needs) {
    if (jur.includes(n)) return { ok: true, by: `${reporter.name} covers ${STATE_NAMES[n] || n}` };
  }
  return { ok: false, by: null };
}

/* Score one table against one post. */
function scoreTable(table, text, reporter) {
  const hits = [];
  for (const a of table.aliases) {
    if (!getRe(a.text, a.cs).test(text)) continue;
    const gate = gateOk(a.needs, text, reporter);
    if (!gate.ok) { hits.push({ ...a, blocked: true }); continue; }
    hits.push({ ...a, blocked: false, gatedBy: gate.by });
  }
  const live = hits.filter(h => !h.blocked);
  if (!live.length) {
    const blocked = hits.filter(h => h.blocked);
    if (!blocked.length) return null;
    const b = blocked[0];
    const want = b.needs.slice(0, 3).join(', ') + (b.needs.length > 3 ? ', …' : '');
    return { score: 0, blocked: true, why: `matched ${JSON.stringify(b.text)} but nothing established ${want}` };
  }
  const best = live.reduce((a, b) => (b.weight > a.weight ? b : a));
  /* Independent aliases agreeing is worth a little, but never enough to
     turn two weak matches into a strong one. */
  const distinct = new Set(live.map(h => h.kind)).size;
  const corroboration = Math.min(0.12, (distinct - 1) * 0.06);
  const rw = (reporter && reporter.weight) || 0.7;
  const score = Math.min(1, (best.weight + corroboration) * rw);
  return {
    score, blocked: false, best,
    matched: live.map(h => h.text),
    why: `${JSON.stringify(best.text)} (${best.kind})` + (best.gatedBy ? `, ${best.gatedBy}` : '') +
         (distinct > 1 ? `, plus ${distinct - 1} other alias kind${distinct > 2 ? 's' : ''}` : '')
  };
}

/* Topic keywords are a fallback: they say the post is in our world without
   saying which bill. They never produce a bill link. */
function topicHits(text, topicMap) {
  const out = [];
  for (const [topic, words] of Object.entries(topicMap || {})) {
    for (const w of words) if (getRe(w).test(text)) { out.push({ topic, word: w }); break; }
  }
  return out;
}

function matchPost(post, tables, reporter, opts) {
  const o = opts || {};
  const threshold = o.threshold == null ? 0.45 : o.threshold;
  const text = norm(post.text);
  const links = [];
  const suppressed = [];
  for (const t of tables) {
    const r = scoreTable(t, text, reporter);
    if (!r) continue;
    if (r.blocked) { suppressed.push({ id: t.id, label: t.label, why: r.why }); continue; }
    if (r.score < threshold) { suppressed.push({ id: t.id, label: t.label, why: `scored ${r.score.toFixed(2)}, below ${threshold}` }); continue; }
    links.push({ id: t.id, label: t.label, jurisdiction: t.jurisdiction, score: +r.score.toFixed(3), why: r.why, matched: r.matched });
  }
  links.sort((a, b) => b.score - a.score);
  return { links, suppressed, topics: topicHits(text, o.topics) };
}

module.exports = { matchPost, scoreTable, norm };
