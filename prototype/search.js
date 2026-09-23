/* Locke platform search.

   Two retrieval arms fused with Reciprocal Rank Fusion. This is the shape
   production hybrid search converged on: a lexical arm for exact terms
   (bill numbers, member names, statutory language) and a second arm that
   tolerates paraphrase and misspelling. In the real product arm B is a
   dense vector index over chunked document text. Here it is character
   trigrams, because there is no server to embed against. The fusion code
   does not care which, because RRF ranks by position and never touches
   the underlying scores.

   Why not just average the two scores: BM25 is unbounded positive and
   cosine similarity sits in [-1,1]. Averaging them lets whichever arm
   happens to have the larger numeric range quietly win every query.

   Everything below is O(matching postings), not O(corpus). At this corpus
   size a linear scan would also feel instant, but the point is that the
   same code keeps working at 10,000x.  */
(() => {
  'use strict';

  /* ---------- text ---------- */

  const STOP = new Set(('a an and are as at be been but by for from had has have if in into is it its of on or ' +
    'that the their there these they this to was were what when which will with would').split(' '));

  /* Conservative stemming on purpose. Aggressive stemmers turn "gas" into
     "ga" and "Texas" into "texa", which costs more precision than the
     recall it buys on a corpus full of proper nouns. */
  function stem(w) {
    if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
    if (w.length > 5 && w.endsWith('ed')) return w.slice(0, -2);
    if (w.length > 3 && w.endsWith('s') && !/(ss|us|is)$/.test(w)) return w.slice(0, -1);
    return w;
  }

  function tokenize(s) {
    const out = [];
    for (const w of String(s == null ? '' : s).toLowerCase().split(/[^a-z0-9]+/)) {
      if (w && !STOP.has(w)) out.push(stem(w));
    }
    return out;
  }

  /* "CLO-001-1" and "S. 4559" have to survive as single searchable units,
     or a query for the exact identifier scatters across common tokens. */
  const squash = s => String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, '');

  function trigrams(s) {
    const t = '  ' + String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() + '  ';
    const set = new Set();
    for (let i = 0; i < t.length - 2; i++) set.add(t.slice(i, i + 3));
    return set;
  }

  /* Containment, not Dice. Dice divides by the size of both sets, so a
     short query measured against a long title scores low no matter how
     completely it is contained in it. "ratepayr" inside "Ratepayer
     Protection Act" is a hit, and containment says so. */
  function contains(q, d) {
    if (!q.size || !d.size) return 0;
    let hit = 0;
    for (const g of q) if (d.has(g)) hit++;
    return hit / q.size;
  }

  /* ---------- field model ---------- */

  /* BM25F weights. An identifier match is worth far more than a body
     match: someone typing "RD26-7" wants that docket, not the eleven
     documents that mention it in passing. */
  const FIELDS = [
    { key: 'ident', w: 6.0, b: 0.30 },
    { key: 'title', w: 3.2, b: 0.75 },
    { key: 'sub',   w: 1.8, b: 0.75 },
    { key: 'meta',  w: 1.4, b: 0.60 },
    { key: 'body',  w: 1.0, b: 0.80 }
  ];
  /* A static per-document prior, set by the caller. A person's one-line
     note is short, so BM25 length normalisation flatters it against a
     bill's full analysis. The prior corrects for that without touching
     the term statistics. */
  const K1 = 1.2;
  const RRF_K = 60;

  function create(docs) {
    const N = docs.length;
    const nf = FIELDS.length;

    /* postings: term -> [docIdx, counts[nf], docIdx, counts[nf], ...] kept
       as parallel arrays so scoring never allocates. */
    const postings = new Map();
    const df = new Map();
    const lens = FIELDS.map(() => new Float32Array(N));
    const avg = new Float32Array(nf);
    const tri = new Array(N);

    docs.forEach((doc, d) => {
      const seen = new Set();
      for (let f = 0; f < nf; f++) {
        const toks = tokenize(doc[FIELDS[f].key]);
        /* the squashed identifier rides along in the ident field */
        if (FIELDS[f].key === 'ident' && doc.ident) {
          const sq = squash(doc.ident);
          if (sq) toks.push(sq);
        }
        lens[f][d] = toks.length;
        avg[f] += toks.length;
        for (const t of toks) {
          let p = postings.get(t);
          if (!p) { p = { d: [], c: [] }; postings.set(t, p); }
          let i = p.d.length - 1;
          if (i >= 0 && p.d[i] === d) {
            p.c[i][f]++;
          } else {
            const counts = new Uint16Array(nf);
            counts[f]++;
            p.d.push(d);
            p.c.push(counts);
          }
          seen.add(t);
        }
      }
      for (const t of seen) df.set(t, (df.get(t) || 0) + 1);
      tri[d] = trigrams((doc.title || '') + ' ' + (doc.ident || '') + ' ' + (doc.sub || ''));
    });
    for (let f = 0; f < nf; f++) avg[f] = avg[f] / N || 1;

    /* Sorted term list, so a prefix lookup is a binary search for the
       lower bound and then a walk. That is what makes typeahead cheap:
       O(log n + k) instead of scanning every term on every keystroke. */
    const terms = [...postings.keys()].sort();

    function prefixRange(p) {
      let lo = 0, hi = terms.length;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (terms[mid] < p) lo = mid + 1; else hi = mid; }
      const out = [];
      for (let i = lo; i < terms.length && terms[i].startsWith(p) && out.length < 48; i++) out.push(terms[i]);
      return out;
    }

    function idf(t) {
      const n = df.get(t) || 0;
      return Math.log(1 + (N - n + 0.5) / (n + 0.5));
    }

    /* ---------- arm A: BM25F ---------- */
    function lexical(queryTerms, allow) {
      const acc = new Map();
      for (const { t, boost } of queryTerms) {
        const p = postings.get(t);
        if (!p) continue;
        const w = idf(t) * boost;
        for (let i = 0; i < p.d.length; i++) {
          const d = p.d[i];
          if (allow && !allow.has(d)) continue;
          const counts = p.c[i];
          let tfw = 0;
          for (let f = 0; f < nf; f++) {
            const c = counts[f];
            if (!c) continue;
            const F = FIELDS[f];
            tfw += F.w * (c / (1 - F.b + F.b * (lens[f][d] / avg[f])));
          }
          acc.set(d, (acc.get(d) || 0) + w * (tfw / (K1 + tfw)) * (docs[d].prior || 1));
        }
      }
      return acc;
    }

    /* ---------- arm B: fuzzy ---------- */
    function fuzzy(raw, allow) {
      const q = trigrams(raw);
      if (q.size < 3) return new Map();
      const acc = new Map();
      for (let d = 0; d < N; d++) {
        if (allow && !allow.has(d)) continue;
        const s = contains(q, tri[d]);
        if (s >= 0.55) acc.set(d, s);
      }
      return acc;
    }

    const ranked = m => [...m.entries()].sort((a, b) => b[1] - a[1]).map(e => e[0]);

    /* ---------- fusion ---------- */
    function fuse(arms) {
      const acc = new Map();
      for (const list of arms) {
        for (let r = 0; r < list.length; r++) {
          const d = list[r];
          acc.set(d, (acc.get(d) || 0) + 1 / (RRF_K + r + 1));
        }
      }
      return [...acc.entries()].sort((a, b) => b[1] - a[1]);
    }

    /* ---------- query ---------- */
    /* Supports field filters inline: "ratepayer type:bill state:TX". */
    function parse(input) {
      const filters = {};
      const free = String(input || '').replace(/(\w+):("[^"]+"|\S+)/g, (m, k, v) => {
        filters[k.toLowerCase()] = v.replace(/"/g, '').toLowerCase();
        return ' ';
      }).trim();
      return { filters, free };
    }

    function allowSet(filters) {
      const keys = Object.keys(filters);
      if (!keys.length) return null;
      const allow = new Set();
      docs.forEach((doc, d) => {
        const f = doc.filters || {};
        for (const k of keys) {
          const have = String(f[k] == null ? (k === 'type' ? doc.type : '') : f[k]).toLowerCase();
          if (have !== filters[k]) return;
        }
        allow.add(d);
      });
      return allow;
    }

    function snippet(doc, words) {
      const body = doc.body || doc.sub || '';
      if (!body) return '';
      const lower = body.toLowerCase();
      let at = -1;
      for (const w of words) { const i = lower.indexOf(w); if (i >= 0 && (at < 0 || i < at)) at = i; }
      if (at < 0) return body.slice(0, 150).trim() + (body.length > 150 ? '…' : '');
      const start = Math.max(0, at - 60);
      const end = Math.min(body.length, at + 120);
      return (start ? '…' : '') + body.slice(start, end).trim() + (end < body.length ? '…' : '');
    }

    function query(input, opts) {
      const o = opts || {};
      const limit = o.limit || 30;
      const { filters, free } = parse(input);
      const allow = allowSet(filters);

      if (!free) {
        const out = [];
        for (let d = 0; d < N && out.length < limit; d++) if (!allow || allow.has(d)) out.push({ doc: docs[d], score: 0, snippet: '' });
        return out;
      }

      const words = free.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
      const toks = tokenize(free).map(t => ({ t, boost: 1 }));

      /* the last word is still being typed, so also match it as a prefix,
         discounted so a complete match always outranks a partial one */
      const last = words[words.length - 1];
      if (last && last.length >= 2) {
        for (const t of prefixRange(stem(last))) toks.push({ t, boost: 0.45 });
      }
      const sq = squash(free);
      if (sq.length >= 3 && postings.has(sq)) toks.push({ t: sq, boost: 2.0 });

      const armA = ranked(lexical(toks, allow));
      const armB = ranked(fuzzy(free, allow));
      const fused = fuse([armA, armB]).slice(0, limit);

      return fused.map(([d, score]) => ({ doc: docs[d], score, snippet: snippet(docs[d], words) }));
    }

    return { query, size: N, termCount: terms.length, parse };
  }

  window.LWSearch = { create, tokenize, trigrams };
})();
