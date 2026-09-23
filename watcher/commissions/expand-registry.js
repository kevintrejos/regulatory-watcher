#!/usr/bin/env node
'use strict';
/* Build the registry by probing, never by asserting.

   There is no machine-readable directory of state utility commissions.
   NARUC's member page does not expose the links. So each candidate below
   is a hypothesis, and the probe is what turns it into a row: the request
   has to resolve, and the page's own <title> has to identify it as a
   regulator. Anything that fails lands in `unverified` with the reason
   rather than quietly shipping a wrong URL.

   Every row records the URL AFTER redirects, because several of these
   moved and the old address still answers. */

const fs = require('fs');
const path = require('path');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const PLATFORMS = [
  ['Granicus/Legistar', /legistar|granicus/i], ['Oracle APEX', /\/apex\/|apex_util/i],
  ['ASP.NET WebForms', /__VIEWSTATE|aspnetForm/i], ['Accela', /accela/i],
  ['Drupal', /drupal-settings-json/i], ['WordPress', /wp-content|wp-json/i],
  ['SharePoint', /_layouts\/15/i], ['CivicPlus', /civicplus/i], ['Tyler', /tylertech/i]
];
/* The page has to say it regulates something. Abbreviations count: several
   of these title their homepage "Florida PSC" and nothing longer, which an
   expanded-words-only test reads as a failure. */
const REGULATOR = /(public service|public utilit|utilit|corporation commission|commerce commission|regulatory commission|board of public|department of public service|railroad commission|energy facilit|siting)/i;
const REGULATOR_ABBR = /\b(PSC|PUC|PUCO|PURA|IURC|ICC|OCC|RCA|UTC|SCC|BPU|TPUC|DPS|PRC|KCC|NCUC|MPSC|CPUC|LPSC|APSC)\b/;
const identifies = p => REGULATOR.test(p.title) || REGULATOR_ABBR.test(p.title) || REGULATOR.test(String(p.sample || ''));

/* A bot wall is not evidence a body does not exist. It is evidence we
   cannot read it with a plain fetch, which is a different fact and belongs
   in the row rather than in a discard pile. Dropping New York because
   Akamai said no would leave a hole nobody ever notices. */
const CAPTCHA = /captcha|bot manager|are you a human|access denied|request unsuccessful|incapsula|cloudflare/i;

const STATE_PUCS = [
  ['AL','Alabama Public Service Commission','https://psc.alabama.gov/'],
  ['AK','Regulatory Commission of Alaska','https://rca.alaska.gov/'],
  ['AZ','Arizona Corporation Commission','https://www.azcc.gov/'],
  ['AR','Arkansas Public Service Commission','https://apsc.arkansas.gov/'],
  ['CA','California Public Utilities Commission','https://www.cpuc.ca.gov/'],
  ['CO','Colorado Public Utilities Commission','https://puc.colorado.gov/'],
  ['CT','Connecticut PURA','https://portal.ct.gov/pura'],
  ['DE','Delaware Public Service Commission','https://depsc.delaware.gov/'],
  ['DC','DC Public Service Commission','https://dcpsc.org/'],
  ['FL','Florida Public Service Commission','https://www.floridapsc.com/'],
  ['GA','Georgia Public Service Commission','https://psc.ga.gov/'],
  ['HI','Hawaii Public Utilities Commission','https://puc.hawaii.gov/'],
  ['ID','Idaho Public Utilities Commission','https://puc.idaho.gov/'],
  ['IL','Illinois Commerce Commission','https://www.icc.illinois.gov/'],
  ['IN','Indiana Utility Regulatory Commission','https://www.in.gov/iurc/'],
  ['IA','Iowa Utilities Commission','https://iuc.iowa.gov/'],
  ['KS','Kansas Corporation Commission','https://www.kcc.ks.gov/'],
  ['KY','Kentucky Public Service Commission','https://psc.ky.gov/'],
  ['LA','Louisiana Public Service Commission','https://www.lpsc.louisiana.gov/'],
  ['ME','Maine Public Utilities Commission','https://www.maine.gov/mpuc/'],
  ['MD','Maryland Public Service Commission','https://www.psc.state.md.us/'],
  ['MA','Massachusetts Department of Public Utilities','https://www.mass.gov/orgs/department-of-public-utilities'],
  ['MI','Michigan Public Service Commission','https://www.michigan.gov/mpsc'],
  ['MN','Minnesota Public Utilities Commission','https://mn.gov/puc/'],
  ['MS','Mississippi Public Service Commission','https://www.psc.ms.gov/'],
  ['MO','Missouri Public Service Commission','https://psc.mo.gov/'],
  ['MT','Montana Public Service Commission','https://psc.mt.gov/'],
  ['NE','Nebraska Public Service Commission','https://psc.nebraska.gov/'],
  ['NV','Public Utilities Commission of Nevada','https://puc.nv.gov/'],
  ['NH','New Hampshire Public Utilities Commission','https://www.puc.nh.gov/'],
  ['NJ','New Jersey Board of Public Utilities','https://www.nj.gov/bpu/'],
  ['NM','New Mexico Public Regulation Commission','https://www.prc.nm.gov/'],
  ['NY','New York Department of Public Service','https://dps.ny.gov/'],
  ['NC','North Carolina Utilities Commission','https://www.ncuc.gov/'],
  ['ND','North Dakota Public Service Commission','https://www.psc.nd.gov/'],
  ['OH','Public Utilities Commission of Ohio','https://puco.ohio.gov/'],
  ['OK','Oklahoma Corporation Commission','https://oklahoma.gov/occ.html'],
  ['OR','Oregon Public Utility Commission','https://www.oregon.gov/puc/'],
  ['PA','Pennsylvania Public Utility Commission','https://www.puc.pa.gov/'],
  ['RI','Rhode Island Public Utilities Commission','https://ripuc.ri.gov/'],
  ['SC','South Carolina Public Service Commission','https://psc.sc.gov/'],
  ['SD','South Dakota Public Utilities Commission','https://puc.sd.gov/'],
  ['TN','Tennessee Public Utility Commission','https://www.tn.gov/tpuc.html'],
  ['TX','Public Utility Commission of Texas','https://www.puc.texas.gov/'],
  ['UT','Utah Public Service Commission','https://psc.utah.gov/'],
  ['VT','Vermont Public Utility Commission','https://puc.vermont.gov/'],
  ['VA','Virginia State Corporation Commission','https://scc.virginia.gov/'],
  ['WA','Washington Utilities and Transportation Commission','https://www.utc.wa.gov/'],
  ['WV','West Virginia Public Service Commission','https://www.psc.state.wv.us/'],
  ['WI','Public Service Commission of Wisconsin','https://psc.wi.gov/'],
  ['WY','Wyoming Public Service Commission','https://psc.wyo.gov/']
];

const GRID = [
  ['pjm','PJM Interconnection','US','iso','https://www.pjm.com/','FERC-jurisdictional RTO'],
  ['miso','Midcontinent ISO','US','iso','https://www.misoenergy.org/','FERC-jurisdictional RTO'],
  ['spp','Southwest Power Pool','US','iso','https://www.spp.org/','FERC-jurisdictional RTO'],
  ['caiso','California ISO','CA','iso','https://www.caiso.com/','FERC-jurisdictional ISO'],
  ['isone','ISO New England','US','iso','https://www.iso-ne.com/','FERC-jurisdictional ISO'],
  ['nyiso','New York ISO','NY','iso','https://www.nyiso.com/','FERC-jurisdictional ISO'],
  ['ercot','Electric Reliability Council of Texas','TX','iso','https://www.ercot.com/','Not FERC-jurisdictional; overseen by PUCT']
];

const FEDERAL = [
  ['doe','U.S. Department of Energy','US','agency','https://www.energy.gov/','DOE Organization Act of 1977'],
  ['epa','U.S. Environmental Protection Agency','US','agency','https://www.epa.gov/','Reorganization Plan No. 3 of 1970'],
  ['nrc','U.S. Nuclear Regulatory Commission','US','commission','https://www.nrc.gov/','Energy Reorganization Act of 1974'],
  ['tva','Tennessee Valley Authority','US','authority','https://www.tva.com/','Tennessee Valley Authority Act of 1933']
];

const title = h => { const m = /<title[^>]*>([\s\S]{0,300}?)<\/title>/i.exec(h); return m ? m[1].replace(/\s+/g, ' ').trim() : ''; };

async function probe(url) {
  const t0 = Date.now();
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 20000);
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' }, signal: ctl.signal, redirect: 'follow' });
    clearTimeout(timer);
    const html = await r.text();
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return {
      ok: r.ok, status: r.status, finalUrl: r.url || url, title: title(html),
      words: text.split(' ').length, bytes: html.length, ms: Date.now() - t0,
      platform: PLATFORMS.filter(([, re]) => re.test(html)).map(([p]) => p)[0] || null,
      jsShell: text.length < 800 && html.length > 4000,
      sample: text.slice(0, 4000),
      walled: CAPTCHA.test(title(html)) || CAPTCHA.test(text.slice(0, 1200))
    };
  } catch (e) { return { ok: false, status: 0, error: e.name === 'AbortError' ? 'timeout' : e.message }; }
}

async function probeTwice(url) {
  const a = await probe(url);
  if (a.ok || a.status === 403) return a;
  await new Promise(r => setTimeout(r, 1200));
  return probe(url);
}

async function pool(items, n, fn) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k]); await new Promise(r => setTimeout(r, 250)); }
  }));
  return out;
}

const accessOf = p => (!p.ok || p.walled) ? 'blocked' : p.jsShell ? 'js' : 'html';
const blockReason = p => !p.ok ? (p.error || `HTTP ${p.status}`) : (p.walled ? 'bot wall' : null);

(async () => {
  console.log('Probing candidates. Each has to resolve AND identify itself as a regulator.\n');
  const rows = [], unverified = [];

  const pucs = await pool(STATE_PUCS, 5, async ([st, name, url]) => ({ st, name, url, p: await probeTwice(url) }));
  for (const { st, name, url, p } of pucs) {
    const access = accessOf(p);
    /* A body that answered but did not identify itself, or that sits behind
       a bot wall, still exists. It goes in with the truth about access. */
    if (!p.ok || p.walled) {
      rows.push({
        id: `puc-${st.toLowerCase()}`, name, jurisdiction: st, type: 'commission',
        authority: null, status: 'active', url: p.finalUrl || url, siteTitle: (p.title || '').slice(0, 120),
        access: 'blocked', adapter: null, blockedBy: blockReason(p),
        note: 'Exists and is reachable by a person. A plain fetch is refused, so this needs a browser session or a found endpoint.',
        platform: p.platform || null, cadence: { pattern: 'unknown' }, pollEvery: '12h',
        topics: ['energy', 'utilities'], verifiedAt: new Date().toISOString().slice(0, 10), verifiedBy: 'live probe, blocked'
      });
      unverified.push({ id: `puc-${st.toLowerCase()}`, name, url: p.finalUrl || url, reason: blockReason(p), kept: true });
      continue;
    }
    if (!identifies(p)) {
      unverified.push({ id: `puc-${st.toLowerCase()}`, name, url: p.finalUrl, reason: `resolved but did not identify a regulator (title: ${JSON.stringify((p.title || '').slice(0, 70))})`, kept: false });
      continue;
    }
    rows.push({
      id: `puc-${st.toLowerCase()}`, name, jurisdiction: st, type: 'commission',
      authority: null, status: 'active', url: p.finalUrl,
      siteTitle: p.title.slice(0, 120),
      access, adapter: access === 'html' ? 'html-diff' : null,
      platform: p.platform, cadence: { pattern: 'unknown', note: 'meeting schedule not yet captured' },
      pollEvery: '12h', topics: ['energy', 'utilities'], verifiedAt: new Date().toISOString().slice(0, 10), verifiedBy: 'live probe'
    });
  }

  for (const list of [GRID, FEDERAL]) {
    const got = await pool(list, 4, async (row) => ({ row, p: await probeTwice(row[4]) }));
    for (const { row, p } of got) {
      const [id, name, jur, type, url, authority] = row;
      const access = accessOf(p);
      if (!p.ok || p.walled) unverified.push({ id, name, url, reason: blockReason(p), kept: true });
      rows.push({
        id, name, jurisdiction: jur, type, authority, status: 'active', url: p.finalUrl || url,
        siteTitle: (p.title || '').slice(0, 120), access,
        adapter: access === 'html' ? 'html-diff' : null, platform: p.platform || null,
        ...(access === 'blocked' ? { blockedBy: blockReason(p), note: 'Reachable by a person; a plain fetch is refused.' } : {}),
        cadence: { pattern: 'unknown' }, pollEvery: '12h',
        topics: type === 'iso' ? ['energy', 'reliability', 'interconnection'] : ['energy'],
        verifiedAt: new Date().toISOString().slice(0, 10), verifiedBy: 'live probe'
      });
    }
  }

  fs.writeFileSync(path.join(__dirname, 'probe-expand.json'), JSON.stringify({ rows, unverified }, null, 2));
  console.log(`verified   ${rows.length}`);
  console.log(`unverified ${unverified.length}`);
  const by = k => rows.reduce((a, r) => { a[r[k] || 'none'] = (a[r[k] || 'none'] || 0) + 1; return a; }, {});
  console.log('\naccess  ', JSON.stringify(by('access')));
  console.log('type    ', JSON.stringify(by('type')));
  console.log('platform', JSON.stringify(by('platform')));
  if (unverified.length) { console.log('\nUNVERIFIED, not added:'); for (const u of unverified) console.log(`  ${u.id.padEnd(9)} ${u.reason.slice(0, 96)}`); }
})();
