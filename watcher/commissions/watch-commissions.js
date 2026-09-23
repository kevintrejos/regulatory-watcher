#!/usr/bin/env node
'use strict';
/* The commission watcher.

   Walks the registry, polls each body by whatever route it actually
   supports, and emits the same graded signals the reporter watcher does.

     node watch-commissions.js                  poll everything
     node watch-commissions.js --body ferc      one body
     node watch-commissions.js --dockets        FERC dockets the clients care about
     node watch-commissions.js --seed           establish baselines, report nothing
*/

const fs = require('fs');
const path = require('path');
const ferc = require('./ferc.js');
const htmlDiff = require('./html-diff.js');
const { watchedItems } = require('../bills.js');

const REG = JSON.parse(fs.readFileSync(path.join(__dirname, 'registry.json'), 'utf8'));
const STATE = path.join(__dirname, '..', 'out', 'commission-state.json');
const OUT = path.join(__dirname, '..', 'out', 'commission-signals.json');

const argv = process.argv.slice(2);
const flag = n => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const ONLY = opt('--body', null);
const SEED = flag('--seed');

const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

function loadState() {
  try {
    const s = JSON.parse(fs.readFileSync(STATE, 'utf8'));
    for (const k of Object.keys(s.seen || {})) s.seen[k] = new Set(s.seen[k]);
    s.marks = s.marks || {};
    return s;
  } catch (e) { return { seen: {}, marks: {}, lastRun: null }; }
}
function saveState(s) {
  const seen = {};
  for (const [k, v] of Object.entries(s.seen || {})) seen[k] = [...v].slice(-4000);
  fs.mkdirSync(path.dirname(STATE), { recursive: true });
  fs.writeFileSync(STATE, JSON.stringify({ seen, marks: s.marks || {}, lastRun: new Date().toISOString() }, null, 2));
}

const sig = (body, item, extra) => ({
  id: 'sg-c-' + hash(item.id || item.url || item.title),
  date: item.date || new Date().toISOString().slice(0, 10),
  logged: 'watcher', kind: 'observed',
  conf: extra && extra.conf ? extra.conf : 'med',
  /* A filing on a public docket is the public record, so it is quotable
     once a human has actually opened it. */
  handling: 'client',
  title: `${body.name}: ${String(item.title || '').slice(0, 140)}`,
  who: `${body.name} docket system`,
  outlet: `body:${body.id}`,
  note: String(item.title || '').slice(0, 400) + (item.dockets && item.dockets.length ? `  [${item.dockets.join(', ')}]` : ''),
  ents: [], topics: body.topics || [], clients: [],
  status: 'open', corrob: [],
  why: (extra && extra.why) || `new on ${body.name}`,
  source: { platform: body.id, url: item.url, bodyId: body.id, capturedAt: new Date().toISOString() }
});

async function main() {
  const t0 = Date.now();
  const st = loadState();
  const bodies = REG.bodies.filter(b => (!ONLY || b.id === ONLY));
  const signals = [];
  const report = [];

  console.log(`\nRegistry: ${REG.bodies.length} bodies. Polling ${bodies.length}.`);
  console.log(`Access mix: ${['api', 'html', 'js'].map(a => `${REG.bodies.filter(b => b.access === a).length} ${a}`).join(', ')}\n`);

  /* ---------- FERC, by docket, for the items clients actually track ---------- */
  if (flag('--dockets') || !ONLY) {
    const { dockets } = watchedItems(1);
    const fercDockets = dockets
      .filter(d => d.lane === 'federal' && /^[A-Z]{2,3}\d{2}-\d/.test(String(d.ident)))
      .map(d => String(d.ident).split(/[\s·]/)[0]);
    const uniq = [...new Set(fercDockets)].slice(0, 6);
    const body = REG.bodies.find(b => b.id === 'ferc');
    if (body && uniq.length) {
      /* FERC search is relevance-ordered and returns a different subset on
         each call, so "not in the set we have seen" is not the same as
         "newly filed" and produces phantom results. The API hands back real
         filing dates, so the watermark is a date per docket. Set membership
         still guards against emitting the same accession twice. */
      st.seen.ferc = st.seen.ferc || new Set();
      st.marks = st.marks || {};
      for (const dk of uniq) {
        const { items, error } = await ferc.watchDocket(dk, { pageSize: 25 });
        if (error) { report.push(`ferc/${dk}: ${error}`); continue; }
        const mark = st.marks[`ferc:${dk}`] || null;
        const dated = items.filter(i => i.date);
        const newest = dated.reduce((a, i) => (a && a > i.date ? a : i.date), null);
        let fresh = 0;
        if (mark && !SEED) {
          for (const it of dated) {
            if (it.date <= mark) continue;
            if (st.seen.ferc.has(it.id)) continue;
            st.seen.ferc.add(it.id);
            fresh++;
            signals.push(sig(body, it, { conf: 'high', why: `filed on ${dk} after ${mark}, from the eLibrary API` }));
          }
        } else {
          for (const it of dated) st.seen.ferc.add(it.id);
        }
        if (newest && (!mark || newest > mark)) st.marks[`ferc:${dk}`] = newest;
        report.push(`ferc/${dk}: ${items.length} records, newest ${newest || 'n/a'}` +
          (mark ? `, ${fresh} filed since ${mark}` : ', watermark set'));
        await sleep(500);
      }
    }
  }

  /* ---------- everything server-rendered ---------- */
  for (const body of bodies) {
    if (body.access !== 'html' || !body.adapter) continue;
    st.seen[body.id] = st.seen[body.id] || new Set();
    const { items, all, cold, error } = await htmlDiff.poll(body, st.seen[body.id]);
    if (error) { report.push(`${body.id}: ${error}`); continue; }
    for (const x of all) st.seen[body.id].add(x.id);
    const recordish = items.filter(x => x.recordish);
    if (!cold && !SEED) {
      for (const it of recordish.slice(0, 20)) {
        signals.push(sig(body, { id: it.id, title: it.title, url: it.url, date: null },
          { conf: 'low', why: `new item on ${body.name}${it.docketText ? `, mentions ${it.docketText}` : ''}` }));
      }
    }
    report.push(`${body.id}: ${all.length} records on page${cold ? ', baseline seeded' : `, ${items.length} new (${recordish.length} look like filings)`}`);
    await sleep(600);
  }

  /* ---------- bodies we cannot reach yet ---------- */
  const blocked = REG.bodies.filter(b => b.access === 'js' && (!ONLY || b.id === ONLY));

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(signals, null, 2));
  saveState(st);

  console.log('POLL');
  for (const r of report) console.log('  ' + r);
  console.log('');
  if (signals.length) {
    console.log(`SIGNALS  (${signals.length})`);
    for (const s of signals.slice(0, 10)) {
      console.log(`  [${s.conf.toUpperCase().padEnd(4)}] ${s.date}  ${s.title.slice(0, 96)}`);
      console.log(`          ${s.why}`);
      console.log(`          ${s.source.url}`);
    }
    console.log('');
  } else {
    console.log('No new items. Baselines are seeded, so the next run reports only what changed.\n');
  }
  if (blocked.length) {
    console.log('NEEDS A BROWSER OR A FOUND ENDPOINT');
    for (const b of blocked) console.log(`  ${b.id.padEnd(9)} ${b.name}\n            ${b.note || ''}`);
    console.log('');
  }
  console.log(`Done in ${((Date.now() - t0) / 1000).toFixed(1)}s -> out/commission-signals.json\n`);
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
