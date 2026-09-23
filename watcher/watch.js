#!/usr/bin/env node
'use strict';
/* The reporter watcher.

   Polls a curated roster on Bluesky (free) and X (billed per read), links
   each post to a tracked bill or docket through the alias tables, and emits
   graded signals in the same shape the prototype's signal log uses.

   Nothing here is a citation. A post is a tripwire that says go look at the
   filing. That is why every emitted signal is kind "reported" and carries
   its own URL, and why none of them are ever marked confirmed.

     node watch.js                 poll everything since the last run
     node watch.js --since 45      ignore the watermark, look back N days
     node watch.js --no-x          Bluesky only
     node watch.js --explain       also show what was suppressed and why
*/

const fs = require('fs');
const path = require('path');
const { buildAliases } = require('./aliases.js');
const { matchPost } = require('./match.js');
const bsky = require('./sources/bluesky.js');
const x = require('./sources/x.js');
const store = require('./store.js');
const { watchedItems } = require('./bills.js');

const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const roster = JSON.parse(fs.readFileSync(path.join(__dirname, 'roster.json'), 'utf8'));
const manual = JSON.parse(fs.readFileSync(path.join(__dirname, 'aliases.manual.json'), 'utf8'));

const argv = process.argv.slice(2);
const flag = n => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const SINCE_DAYS = +opt('--since', cfg.windowDays);
const USE_X = cfg.x.enabled && !flag('--no-x');
const EXPLAIN = flag('--explain');

const sleep = ms => new Promise(r => setTimeout(r, ms));
const hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h).toString(36); };
const cutoff = Date.now() - SINCE_DAYS * 864e5;

/* Brand accounts are not reporting, they are the wire.

   A roster reporter reposting @politico.com is just a headline that the
   outlet already published, and a tracker built on those is a worse RSS
   feed. What we want is the individual reporting on their own account:
   their read, their scoop, their sense of whether a bill moves. So posts
   authored by an institutional account are dropped, while a reporter
   amplifying another individual reporter is kept, because one journalist
   vouching for another is a real signal. */
const PUBLICATION = /\b(news|times|post|journal|wire|media|magazine|network|tribune|gazette|herald|press|politico|reuters|bloomberg|semafor|punchbowl|axios|heatmap|notus|cnn|npr|msnbc|guardian)\b/i;
function isInstitutional(post) {
  const name = String(post.authorName || '').trim();
  const handle = String(post.authorHandle || '').toLowerCase();
  if (PUBLICATION.test(name)) return true;
  /* a bare organisation domain with a non-personal display name */
  if (!handle.endsWith('.bsky.social') && /^[a-z0-9-]+\.(com|news|org|net|co|io)$/.test(handle)) {
    const words = name.split(/\s+/).filter(Boolean);
    if (words.length < 2 || words.length > 4) return true;
  }
  return false;
}

/* Run a list of async jobs a few at a time, politely. */
async function pool(items, n, fn) {
  const out = [];
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const k = i++;
      out[k] = await fn(items[k], k);
      await sleep(cfg.politeDelayMs);
    }
  }));
  return out;
}

async function main() {
  const t0 = Date.now();
  const st = store.load();
  const { bills, dockets, all } = watchedItems(1);
  const tables = all.map(it => buildAliases(it, manual[it.id]));
  const byId = new Map(all.map(it => [it.id, it]));

  console.log(`\nWatching ${tables.length} items (${bills.length} bills, ${dockets.length} dockets) ` +
    `across ${tables.reduce((n, t) => n + t.aliases.length, 0)} aliases`);
  console.log(`Roster: ${roster.length} reporters. Window: ${SINCE_DAYS} days.\n`);

  /* ---------- collect ---------- */
  const posts = [];
  const sourceErrors = [];
  const dropped = { institutional: 0 };

  const blueskyTargets = cfg.bluesky.enabled ? roster.filter(r => r.bluesky) : [];
  await pool(blueskyTargets, cfg.concurrency, async r => {
    const key = `bsky:${r.handle}`;
    const { posts: got, error } = await bsky.getAuthorFeed(r.handle, { limit: cfg.maxPostsPerAuthor });
    if (error) { sourceErrors.push(`${r.handle}: ${error}`); return; }
    for (const p of got) {
      if (st.seen.has(p.id)) continue;
      if (new Date(p.createdAt).getTime() < cutoff) continue;
      if (isInstitutional(p)) { dropped.institutional++; st.seen.add(p.id); continue; }
      posts.push({ ...p, reporter: r });
    }
    st.watermarks[key] = new Date().toISOString();
  });

  /* ---------- X, only if it is paid for and configured ---------- */
  let xReads = 0;
  const xTargets = roster.filter(r => r.x);
  if (USE_X && xTargets.length) {
    if (!x.hasToken()) {
      sourceErrors.push('X skipped: X_BEARER_TOKEN is not set in the environment');
    } else {
      const left = store.budgetLeft(st, cfg);
      if (left <= 0) sourceErrors.push('X skipped: monthly read budget exhausted');
      else {
        for (const r of xTargets) {
          if (store.budgetLeft(st, cfg) <= 0) { sourceErrors.push('X stopped mid-run: budget exhausted'); break; }
          const key = `x:${r.x}`;
          let id = st.watermarks[`xid:${r.x}`];
          if (!id) {
            const res = await x.resolveUser(r.x);
            if (res.error) { sourceErrors.push(`x/${r.x}: ${res.error}`); continue; }
            id = res.id;
            st.watermarks[`xid:${r.x}`] = id;
          }
          const { posts: got, newest, reads, error } = await x.getUserPosts(id, {
            sinceId: st.watermarks[key], max: Math.min(cfg.maxPostsPerAuthor, store.budgetLeft(st, cfg)), handle: r.x
          });
          if (error) { sourceErrors.push(`x/${r.x}: ${error}`); continue; }
          store.spend(st, reads);
          xReads += reads;
          if (newest) st.watermarks[key] = newest;
          for (const p of got) {
            if (st.seen.has(p.id)) continue;
            if (new Date(p.createdAt).getTime() < cutoff) continue;
            if (isInstitutional(p)) { dropped.institutional++; st.seen.add(p.id); continue; }
            posts.push({ ...p, reporter: r });
          }
          await sleep(cfg.politeDelayMs);
        }
      }
    }
  } else if (USE_X && !xTargets.length) {
    sourceErrors.push('X skipped: no roster entry has an x handle yet');
  }

  /* ---------- match ---------- */
  const linked = [];
  const topicOnly = [];
  const suppressedLog = [];
  for (const p of posts) {
    st.seen.add(p.id);
    const r = matchPost(p, tables, p.reporter, { threshold: cfg.threshold, topics: cfg.topics });
    if (r.links.length) linked.push({ post: p, links: r.links });
    else if (r.topics.length) topicOnly.push({ post: p, topics: r.topics });
    if (EXPLAIN && r.suppressed.length) suppressedLog.push({ post: p, suppressed: r.suppressed });
  }

  /* ---------- corroboration ----------
     Two reporters independently naming the same bill on the same day is the
     cheapest real corroboration there is, and it is exactly the field the
     signal log wants filled. */
  const groups = new Map();
  for (const { post, links } of linked) {
    const day = String(post.createdAt).slice(0, 10);
    for (const l of links) {
      const k = `${l.id}|${day}`;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push({ post, link: l });
    }
  }

  /* ---------- emit ---------- */
  const signals = [];
  for (const [k, rows] of groups) {
    const [itemId, day] = k.split('|');
    const item = byId.get(itemId);
    const reporters = [...new Set(rows.map(r => r.post.reporter.handle))];
    const corroborated = reporters.length > 1;
    const best = rows.reduce((a, b) => (b.link.score > a.link.score ? b : a));
    let score = best.link.score + (corroborated ? 0.1 : 0);
    const conf = score >= 0.8 ? 'high' : score >= 0.6 ? 'med' : 'low';
    const ids = rows.map(r => 'sg-w-' + hash(r.post.id));

    for (const { post, link } of rows) {
      const id = 'sg-w-' + hash(post.id);
      signals.push({
        id, date: day, logged: 'watcher',
        kind: 'reported',
        conf: post === best.post ? conf : (conf === 'high' ? 'med' : 'low'),
        /* A public post is quotable. The article behind its link may not be,
           which is a separate licence question handled in the feeds table. */
        handling: 'client',
        /* Credit the person who wrote the words. When our roster reporter
           reposted somebody else, that is a different and weaker fact, so
           say so rather than putting their name on another author's post. */
        title: `${item ? item.ident : itemId}: ${post.isRepost ? 'amplified by' : 'reported by'} ${post.isRepost ? post.reporter.name : post.authorName}`,
        who: post.isRepost
          ? `${post.authorName} (@${post.authorHandle}), surfaced by ${post.reporter.name}${post.reporter.outlet ? ' of ' + post.reporter.outlet : ''}`
          : `${post.authorName}${post.reporter.outlet ? ', ' + post.reporter.outlet : ''}`,
        outlet: `bsky:${post.reporter.handle}`,
        note: post.text.replace(/\s+/g, ' ').trim().slice(0, 500),
        ents: [{ t: item ? item.type : 'm', id: itemId }],
        clients: [],
        status: 'open',
        corrob: ids.filter(x2 => x2 !== id),
        why: link.why,
        source: { platform: post.platform, url: post.url, postId: post.id, capturedAt: new Date().toISOString() }
      });
    }
  }

  /* Topic hits are the larger half of the value and were nearly buried as a
     footnote. A reporter writing about Newsom reversing on data centres names
     no bill, but it is exactly what a policy shop wants on its desk. These
     emit as signals with no entity link, low confidence, and a topic tag, so
     a human decides what they attach to. */
  for (const { post, topics } of topicOnly) {
    const id = 'sg-w-' + hash(post.id);
    signals.push({
      id, date: String(post.createdAt).slice(0, 10), logged: 'watcher',
      kind: 'reported', conf: 'low', handling: 'client',
      title: `${topics.map(t => t.topic).join(', ')}: ${post.isRepost ? 'amplified by' : 'reported by'} ${post.isRepost ? post.reporter.name : post.authorName}`,
      who: post.isRepost
        ? `${post.authorName} (@${post.authorHandle}), surfaced by ${post.reporter.name}${post.reporter.outlet ? ' of ' + post.reporter.outlet : ''}`
        : `${post.authorName}${post.reporter.outlet ? ', ' + post.reporter.outlet : ''}`,
      outlet: `bsky:${post.reporter.handle}`,
      note: post.text.replace(/\s+/g, ' ').trim().slice(0, 500),
      ents: [], topics: topics.map(t => t.topic), clients: [],
      status: 'open', corrob: [],
      why: `no bill named, but matched ${topics.map(t => JSON.stringify(t.word)).join(', ')}`,
      source: { platform: post.platform, url: post.url, postId: post.id, capturedAt: new Date().toISOString() }
    });
  }

  fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'out', 'signals.json'), JSON.stringify(signals, null, 2));
  store.save(st);

  /* ---------- report ---------- */
  console.log(`Fetched  ${posts.length} new posts from ${blueskyTargets.length} Bluesky accounts` +
    (xReads ? ` and ${xReads} X reads ($${(xReads * cfg.x.costPerRead).toFixed(2)})` : ''));
  console.log(`Dropped  ${dropped.institutional} posts from brand accounts, keeping individual reporting only`);
  console.log(`Linked   ${linked.length} posts to ${groups.size} item-days`);
  console.log(`Topic    ${topicOnly.length} posts in our world with no bill link`);
  console.log(`Emitted  ${signals.length} signals -> out/signals.json\n`);

  const bound = signals.filter(s => s.ents.length);
  const radar = signals.filter(s => !s.ents.length);

  if (bound.length) {
    console.log('BILL-LINKED  (a reporter named a tracked item)');
    for (const s of bound.slice(0, 12)) {
      console.log(`  [${s.conf.toUpperCase().padEnd(4)}] ${s.date}  ${s.title}`);
      console.log(`          why: ${s.why}`);
      console.log(`          "${s.note.slice(0, 120)}${s.note.length > 120 ? '…' : ''}"`);
      if (s.corrob.length) console.log(`          corroborated by ${s.corrob.length} other post(s)`);
      console.log(`          ${s.source.url}`);
    }
    console.log('');
  }
  if (radar.length) {
    console.log('TOPIC RADAR  (no bill named, still our world, a human triages)');
    for (const s of radar.slice(0, 10)) {
      console.log(`  ${(s.topics || []).join(',').padEnd(16)} ${s.date}  ${s.who}`);
      console.log(`          "${s.note.slice(0, 110)}${s.note.length > 110 ? '…' : ''}"`);
    }
    console.log('');
  }
  if (EXPLAIN && suppressedLog.length) {
    console.log('SUPPRESSED (the gate doing its job)');
    for (const s of suppressedLog.slice(0, 8)) console.log(`  ${s.suppressed[0].id}: ${s.suppressed[0].why}`);
    console.log('');
  }
  try {
    const todo = JSON.parse(fs.readFileSync(path.join(__dirname, 'roster-x-todo.json'), 'utf8'));
    const open = (todo.outlets || []).filter(o => !(o.handles || []).length);
    if (open.length) {
      console.log('WAITING ON X  (no usable Bluesky presence, so X is the only route)');
      for (const o of open) console.log(`  ${o.outlet.padEnd(18)} ${o.why}`);
      console.log('  Add handles to roster-x-todo.json, set X_BEARER_TOKEN, then re-run.\n');
    }
  } catch (e) { /* the list is optional */ }

  if (sourceErrors.length) {
    console.log('NOTES');
    for (const e of [...new Set(sourceErrors)]) console.log('  ' + e);
    console.log('');
  }
  console.log(`Done in ${((Date.now() - t0) / 1000).toFixed(1)}s. State in out/state.json.\n`);
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
