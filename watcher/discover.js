#!/usr/bin/env node
/* Build a trusted-reporter roster from the Bluesky AppView.

   Discovery is a starting point, never the roster itself. Broad queries
   return economists, agencies and members of Congress alongside beat
   reporters, so everything here is filtered hard and then meant to be
   read by a human before it is trusted. Run it again to refresh, and
   hand-edit roster.json afterwards. That file is the source of truth. */
'use strict';

const BASE = 'https://public.api.bsky.app/xrpc';

const QUERIES = [
  'energy reporter', 'climate and energy reporter', 'utility regulation reporter',
  'FERC reporter', 'grid reporter', 'energy policy reporter',
  'data center reporter', 'tech policy reporter', 'AI policy reporter',
  'statehouse reporter', 'capitol reporter energy', 'congressional reporter energy'
];

/* A description has to look like a working journalist. */
const ROLE = /\b(reporter|correspondent|journalist|editor|bureau chief|covers?|covering)\b/i;
const BEATS = {
  energy: /\b(energy|power|grid|electric|utilit|FERC|NERC|nuclear|solar|wind|LNG|oil|gas)\b/i,
  climate: /\b(climate|environment|EPA|emissions|decarbon)\b/i,
  tech: /\b(tech|AI|artificial intelligence|semiconductor|data cent)\b/i,
  politics: /\b(congress|capitol|statehouse|legislature|politics|policy|white house)\b/i
};
const OUTLETS = [
  ['POLITICO', /politico/i], ['Bloomberg', /bloomberg/i], ['Reuters', /reuters/i],
  ['The New York Times', /\bnyt\b|new york times/i], ['The Washington Post', /washington post|\bwapo\b/i],
  ['Heatmap', /heatmap/i], ['Canary Media', /canary media/i], ['Utility Dive', /utility dive/i],
  ['E&E News', /e&e news|eenews/i], ['NPR', /\bnpr\b/i], ['WSJ', /wall street journal|\bwsj\b/i],
  ['Axios', /axios/i], ['CNBC', /cnbc/i], ['Texas Tribune', /texas tribune/i], ['CalMatters', /calmatters/i]
];
const STATES = [
  ['TX', /\btexas\b|\bERCOT\b|austin/i], ['CA', /\bcalifornia\b|sacramento|\bCPUC\b/i],
  ['NY', /\bnew york state\b|albany/i], ['PA', /pennsylvania|harrisburg/i],
  ['IL', /\billinois\b|springfield/i], ['VA', /\bvirginia\b|richmond/i], ['OH', /\bohio\b|columbus/i]
];

const pick = (desc, table) => table.filter(([, re]) => re.test(desc)).map(([k]) => k);

async function searchActors(q, limit = 12) {
  const r = await fetch(`${BASE}/app.bsky.actor.searchActors?q=${encodeURIComponent(q)}&limit=${limit}`);
  if (!r.ok) return [];
  return (await r.json()).actors || [];
}

async function main() {
  const found = new Map();
  for (const q of QUERIES) {
    for (const a of await searchActors(q)) {
      const desc = (a.description || '').replace(/\s+/g, ' ').trim();
      if (!desc || !ROLE.test(desc)) continue;
      /* drop official accounts and officeholders */
      if (/\.gov$/.test(a.handle) || /\b(congressman|congresswoman|senator|governor|official account)\b/i.test(desc)) continue;
      const beat = Object.entries(BEATS).filter(([, re]) => re.test(desc)).map(([k]) => k);
      if (!beat.length) continue;
      if (found.has(a.handle)) { found.get(a.handle).via.push(q); continue; }
      found.set(a.handle, {
        handle: a.handle, did: a.did, name: a.displayName || a.handle,
        outlet: pick(desc, OUTLETS)[0] || null,
        beat, jurisdiction: pick(desc, STATES).length ? pick(desc, STATES) : ['US'],
        platform: 'bluesky',
        weight: 0.7,
        desc: desc.slice(0, 160),
        via: [q], verifiedAt: new Date().toISOString().slice(0, 10)
      });
    }
  }
  const rows = [...found.values()].sort((a, b) => b.beat.length - a.beat.length || a.handle.localeCompare(b.handle));
  console.log(JSON.stringify(rows, null, 2));
  console.error(`discovered ${rows.length} candidate reporters`);
}
main().catch(e => { console.error('ERR', e.message); process.exit(1); });
