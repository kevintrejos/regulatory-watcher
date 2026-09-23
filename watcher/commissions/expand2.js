#!/usr/bin/env node
'use strict';
/* Probe the non-utility bodies and fold them into the registry. */
const fs = require('fs');
const path = require('path');
const { probeTwice, accessOf, blockReason, pool } = require('./probe-lib.js');
const C = require('./candidates.js');

/* A body's own page has to look like a regulator of some kind. This is
   wider than the utility test, because an air district and an export
   control bureau describe themselves nothing like a PUC. */
const REGULATORY = /(department|division|bureau|commission|agency|board|council|administration|authority|district|protection|environment|quality|regulat|permit|enforce|standards|siting|conservation|natural resources|reliability|water|air)/i;

const rowFrom = (id, name, jur, type, url, authority, topics, p) => {
  const access = accessOf(p);
  return {
    id, name, jurisdiction: jur, type, authority, status: 'active',
    url: p.finalUrl || url, siteTitle: (p.title || '').slice(0, 120),
    access, adapter: access === 'html' ? 'html-diff' : null,
    platform: p.platform || null,
    ...(access === 'blocked' ? { blockedBy: blockReason(p), note: 'Reachable by a person; a plain fetch is refused.' } : {}),
    cadence: { pattern: 'unknown' }, pollEvery: '12h', topics,
    verifiedAt: new Date().toISOString().slice(0, 10), verifiedBy: 'live probe'
  };
};

(async () => {
  const rows = [], rejected = [];

  const tagged = [
    ...C.FEDERAL.map(r => ['federal', r]),
    ...C.NERC_REGIONAL.map(r => ['nerc-re', r]),
    ...C.SITING.map(r => ['siting', r]),
    ...C.AIR_WATER.map(r => ['air-water', r]),
    ...C.STATE_ENV.map(([st, name, url]) => ['state-env',
      [`env-${st.toLowerCase()}`, name, st, 'agency', url, null, ['environment', 'permitting', 'air', 'water']]])
  ];

  console.log(`Probing ${tagged.length} candidates across ${new Set(tagged.map(t => t[0])).size} categories.\n`);

  const got = await pool(tagged, 6, async ([cat, r]) => ({ cat, r, p: await probeTwice(r[4]) }), 220);

  for (const { cat, r, p } of got) {
    const [id, name, jur, type, url, authority, topics] = r;
    if (p.ok && !p.walled && !REGULATORY.test(p.title) && !REGULATORY.test(p.sample || '')) {
      rejected.push({ id, url: p.finalUrl, reason: `resolved but does not read as a regulator (title: ${JSON.stringify((p.title || '').slice(0, 60))})` });
      continue;
    }
    rows.push({ ...rowFrom(id, name, jur, type, url, authority, topics, p), category: cat });
  }

  const reg = JSON.parse(fs.readFileSync(path.join(__dirname, 'registry.json'), 'utf8'));
  const have = new Set(reg.bodies.map(b => b.id));
  const added = rows.filter(r => !have.has(r.id));
  reg.bodies = reg.bodies.concat(added);

  const order = { api: 0, html: 1, js: 2, blocked: 3 };
  reg.bodies.sort((a, b) => (order[a.access] ?? 9) - (order[b.access] ?? 9) ||
    String(a.jurisdiction).localeCompare(String(b.jurisdiction)) || a.id.localeCompare(b.id));

  const by = k => reg.bodies.reduce((a, r) => { a[r[k] || 'none'] = (a[r[k] || 'none'] || 0) + 1; return a; }, {});
  reg._counts = {
    total: reg.bodies.length, byAccess: by('access'), byType: by('type'),
    pollableNow: reg.bodies.filter(b => b.access === 'html' || b.access === 'api').length,
    asOf: new Date().toISOString().slice(0, 10)
  };
  reg._unreadable = reg.bodies.filter(b => b.access === 'blocked' || b.access === 'js')
    .map(b => ({ id: b.id, name: b.name, access: b.access, reason: b.blockedBy || 'renders client-side' }));
  reg._what = 'Bodies that hold regulatory power over the clients, not only utility commissions. A data centre is permitted by a state environmental agency, sited by a siting board, its generators licensed by an air district and its cooling water by a water board. A defence client lives under FAA, export controls and CFIUS. Every row was verified by a live probe; access records what the probe found, not what the site claims.';

  fs.writeFileSync(path.join(__dirname, 'registry.json'), JSON.stringify(reg, null, 2));
  fs.writeFileSync(path.join(__dirname, 'probe-expand2.json'), JSON.stringify({ rows, rejected }, null, 2));

  console.log(`added ${added.length} | registry now ${reg.bodies.length}`);
  console.log('access  ', JSON.stringify(reg._counts.byAccess));
  console.log('type    ', JSON.stringify(reg._counts.byType));
  console.log('pollable now:', reg._counts.pollableNow);
  const cats = added.reduce((a, r) => { a[r.category] = (a[r.category] || 0) + 1; return a; }, {});
  console.log('by category:', JSON.stringify(cats));
  if (rejected.length) { console.log('\nREJECTED, not added:'); for (const r of rejected) console.log(`  ${r.id.padEnd(16)} ${r.reason.slice(0, 92)}`); }
  const blocked = added.filter(r => r.access === 'blocked');
  if (blocked.length) { console.log('\nADDED BUT BLOCKED:'); for (const b of blocked) console.log(`  ${b.id.padEnd(16)} ${(b.blockedBy || '').padEnd(14)} ${b.name.slice(0, 50)}`); }
})();
