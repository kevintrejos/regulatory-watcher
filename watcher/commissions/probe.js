#!/usr/bin/env node
'use strict';
/* What can we actually read?

   State commissions publish no APIs, so before designing anything the
   question is empirical: which of these sites answer a plain GET, which
   hand back server-rendered HTML, which need JavaScript, and which expose
   an RSS feed nobody advertises. The answer decides whether a body needs a
   cheap feed reader, a page differ, or a headless browser. */

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

/* Platform fingerprints. Commissions do not each build their own stack;
   they cluster on a handful of vendors, which is what makes 200 bodies
   tractable with a handful of adapters. */
const PLATFORMS = [
  ['Granicus/Legistar', /legistar|granicus/i],
  ['Oracle APEX',       /\/apex\/|apex_util|ORA_WWV/i],
  ['ASP.NET WebForms',  /__VIEWSTATE|aspnetForm|\.aspx/i],
  ['Accela',            /accela/i],
  ['Drupal',            /drupal-settings-json|\/sites\/default\/files/i],
  ['WordPress',         /wp-content|wp-json/i],
  ['SharePoint',        /_layouts\/15|sharepoint/i],
  ['CivicPlus',         /civicplus/i],
  ['Socrata',           /socrata|\/api\/views\//i]
];

const BODIES = [
  ['FERC eLibrary',        'https://elibrary.ferc.gov/eLibrary/search'],
  ['FERC news',            'https://www.ferc.gov/news-events/news'],
  ['PUCT Interchange',     'https://interchange.puc.texas.gov/'],
  ['CPUC',                 'https://www.cpuc.ca.gov/'],
  ['CPUC docket search',   'https://apps.cpuc.ca.gov/apex/f?p=401:1'],
  ['PA PUC',               'https://www.puc.pa.gov/'],
  ['Ohio PUCO docketing',  'https://dis.puc.state.oh.us/'],
  ['Illinois ICC',         'https://www.icc.illinois.gov/'],
  ['Virginia SCC',         'https://scc.virginia.gov/'],
  ['Georgia PSC',          'https://psc.ga.gov/'],
  ['NY DPS documents',     'https://documents.dps.ny.gov/public/'],
  ['NJ BPU',               'https://www.nj.gov/bpu/'],
  ['Michigan PSC',         'https://www.michigan.gov/mpsc'],
  ['NERC',                 'https://www.nerc.com/Pages/default.aspx'],
  ['ERCOT',                'https://www.ercot.com/'],
  ['NARUC',                'https://www.naruc.org/']
];

const rss = html => {
  const out = [];
  const re = /<link[^>]+type=["']application\/(?:rss|atom)\+xml["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const h = /href=["']([^"']+)["']/i.exec(m[0]);
    if (h) out.push(h[1]);
  }
  return out;
};

async function probe(name, url) {
  const t0 = Date.now();
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 15000);
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' }, signal: ctl.signal, redirect: 'follow' });
    clearTimeout(timer);
    const body = await r.text();
    const ms = Date.now() - t0;
    const plat = PLATFORMS.filter(([, re]) => re.test(body)).map(([p]) => p);
    /* crude but effective: strip tags and see whether anything is left.
       a shell that renders client-side has markup and almost no words. */
    const text = body.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return { name, url, status: r.status, ms, bytes: body.length, words: text.split(' ').length,
             platforms: plat, feeds: rss(body), jsShell: text.length < 800 && body.length > 4000 };
  } catch (e) {
    return { name, url, status: 0, error: e.name === 'AbortError' ? 'timeout' : e.message };
  }
}

(async () => {
  const rows = [];
  for (const [n, u] of BODIES) { rows.push(await probe(n, u)); await new Promise(r => setTimeout(r, 400)); }
  console.log('NAME                     STATUS  WORDS   PLATFORM                 FEEDS  NOTE');
  for (const r of rows) {
    if (r.error) { console.log(`${r.name.padEnd(24)} ---     -       ${r.error}`); continue; }
    const note = r.jsShell ? 'JS-rendered shell' : r.words > 300 ? 'server-rendered' : 'thin';
    console.log(`${r.name.padEnd(24)} ${String(r.status).padEnd(7)} ${String(r.words).padEnd(7)} ${(r.platforms.join(',') || '-').slice(0, 24).padEnd(24)} ${String(r.feeds.length).padEnd(6)} ${note}`);
    for (const f of r.feeds.slice(0, 2)) console.log(`${''.padEnd(24)} feed: ${f}`);
  }
  require('fs').writeFileSync(require('path').join(__dirname, 'probe-results.json'), JSON.stringify(rows, null, 2));
  const ok = rows.filter(r => r.status === 200).length;
  console.log(`\nreachable: ${ok}/${rows.length} | with feeds: ${rows.filter(r => (r.feeds || []).length).length} | JS shells: ${rows.filter(r => r.jsShell).length}`);
})();
