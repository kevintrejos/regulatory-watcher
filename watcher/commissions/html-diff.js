'use strict';
/* A change detector for bodies that publish server-rendered HTML.

   No parsing library and no per-site selectors, because 200 bodies means
   200 selectors to maintain and every redesign breaks one. Instead: pull
   every link that looks like a record rather than furniture, fingerprint
   it, and compare against what we saw last time. Crude, but it survives a
   redesign and it is honest about what it is: this tells you something
   appeared, not what it means. A human or a later pass reads it. */

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

/* Navigation, legal boilerplate and social links are on every page and
   change never. They would drown any real record. */
const FURNITURE = /^(home|about|contact|search|menu|login|log in|sign in|skip to|privacy|accessibility|terms|site ?map|careers|espa|facebook|twitter|linkedin|youtube|instagram|subscribe|newsroom|back to top|read more|more|next|previous|print|share|faq|help)\b/i;

const DOCKET = /\b([A-Z]{1,4}[-\s]?\d{2,6}[-\s]?\d{0,4}|\d{2}-[A-Z]?\d{3,6})\b/;
const DATEISH = /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](20\d{2})\b|\b(20\d{2})-(\d{2})-(\d{2})\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+20\d{2}\b/i;

const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36); };
const decode = s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');

function extractRecords(html, baseUrl) {
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const out = [];
  const seen = new Set();
  const re = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(body))) {
    const href = m[1];
    const text = decode(m[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (text.length < 15 || text.length > 260) continue;
    if (FURNITURE.test(text)) continue;
    if (/^(#|javascript:|mailto:|tel:)/i.test(href)) continue;
    let url;
    try { url = new URL(href, baseUrl).toString(); } catch (e) { continue; }
    const key = hash(text + '|' + url);
    if (seen.has(key)) continue;
    seen.add(key);
    const d = DATEISH.exec(text);
    const k = DOCKET.exec(text);
    out.push({
      id: key, title: text, url,
      dateText: d ? d[0] : null,
      docketText: k ? k[0] : null,
      /* a record with a date or a docket number in its own link text is
         far more likely to be a filing than a content page */
      recordish: !!(d || k)
    });
  }
  return out;
}

async function poll(body, previousIds) {
  const url = body.docketUrl || body.url;
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 20000);
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' }, signal: ctl.signal, redirect: 'follow' });
    clearTimeout(timer);
    if (!r.ok) return { items: [], all: [], error: `HTTP ${r.status}` };
    const html = await r.text();
    const all = extractRecords(html, url);
    const prev = previousIds instanceof Set ? previousIds : new Set(previousIds || []);
    /* On a cold start every record looks new, which would emit hundreds of
       false alerts. So the first sight of a body seeds the baseline and
       reports nothing. */
    const cold = prev.size === 0;
    const fresh = cold ? [] : all.filter(x => !prev.has(x.id));
    return { items: fresh, all, cold, error: null };
  } catch (e) {
    return { items: [], all: [], error: e.name === 'AbortError' ? 'timeout' : e.message };
  }
}

module.exports = { poll, extractRecords };
