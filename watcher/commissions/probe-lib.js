'use strict';
/* Shared probing. A candidate URL is a hypothesis; this is what turns it
   into a registry row or a flagged failure. */
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const PLATFORMS = [
  ['Granicus/Legistar', /legistar|granicus/i], ['Oracle APEX', /\/apex\/|apex_util/i],
  ['ASP.NET WebForms', /__VIEWSTATE|aspnetForm/i], ['Accela', /accela/i],
  ['Drupal', /drupal-settings-json/i], ['WordPress', /wp-content|wp-json/i],
  ['SharePoint', /_layouts\/15/i], ['CivicPlus', /civicplus/i], ['Tyler', /tylertech/i]
];
const CAPTCHA = /captcha|bot manager|radware|are you a human|access denied|request unsuccessful|incapsula|pardon our interruption|checking your browser/i;

const title = h => { const m = /<title[^>]*>([\s\S]{0,300}?)<\/title>/i.exec(h); return m ? m[1].replace(/\s+/g, ' ').trim() : ''; };

async function probe(url, timeoutMs = 20000) {
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeoutMs);
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' }, signal: ctl.signal, redirect: 'follow' });
    clearTimeout(timer);
    const html = await r.text();
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const t = title(html);
    return {
      ok: r.ok, status: r.status, finalUrl: r.url || url, title: t,
      words: text.split(' ').length, bytes: html.length,
      platform: PLATFORMS.filter(([, re]) => re.test(html)).map(([p]) => p)[0] || null,
      jsShell: text.length < 800 && html.length > 4000,
      walled: CAPTCHA.test(t) || CAPTCHA.test(text.slice(0, 1200)),
      sample: text.slice(0, 3000)
    };
  } catch (e) { return { ok: false, status: 0, error: e.name === 'AbortError' ? 'timeout' : e.message }; }
}

async function probeTwice(url) {
  const a = await probe(url);
  if (a.ok || a.status === 403) return a;
  await new Promise(r => setTimeout(r, 1200));
  return probe(url);
}

const accessOf = p => (!p.ok || p.walled) ? 'blocked' : p.jsShell ? 'js' : 'html';
const blockReason = p => !p.ok ? (p.error || `HTTP ${p.status}`) : (p.walled ? 'bot wall' : null);

async function pool(items, n, fn, delay = 250) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k]); await new Promise(r => setTimeout(r, delay)); }
  }));
  return out;
}

module.exports = { probe, probeTwice, accessOf, blockReason, pool, PLATFORMS };
