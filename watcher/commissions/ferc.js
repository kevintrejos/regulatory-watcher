'use strict';
/* FERC eLibrary.

   The search page is an Angular shell, so a plain fetch of it returns
   nothing. Behind it sits eLibraryWebAPI, which answers unauthenticated
   from a server with no Cloudflare challenge. That is far better than
   scraping: accession numbers, docket numbers, filing dates, document
   class and author affiliations all come back structured.

   Two traps. The payload is fussy: searchText plus paging works, and
   adding sortBy or a bare docketNumber makes the server throw a null
   reference. And the response really does spell it `acesssionNumber`,
   with three s's. Do not "fix" that. */

const ENDPOINT = 'https://elibrary.ferc.gov/eLibraryWebAPI/api/Search/AdvancedSearch';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const pd = s => { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(s || '')); return m ? `${m[3]}-${m[1]}-${m[2]}` : null; };

async function search(text, { pageSize = 25, pageNumber = 1 } = {}) {
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'user-agent': UA, accept: 'application/json', 'content-type': 'application/json',
      referer: 'https://elibrary.ferc.gov/eLibrary/search', origin: 'https://elibrary.ferc.gov'
    },
    body: JSON.stringify({ searchText: text, pageNumber, pageSize })
  });
  if (!r.ok) return { items: [], error: `HTTP ${r.status}` };
  const j = await r.json().catch(() => null);
  if (!j) return { items: [], error: 'non-JSON response' };
  if (!j.success) return { items: [], error: j.errorMessage || 'search failed' };

  const items = (j.searchHits || []).map(h => {
    const acc = h.acesssionNumber || h.accessionNumber || h.documentId;
    return {
      id: `ferc:${acc}`,
      bodyId: 'ferc',
      title: (h.description || '').replace(/\s+/g, ' ').trim().slice(0, 300),
      date: pd(h.issuedDate) || pd(h.filedDate) || pd(h.postedDate),
      dockets: h.docketNumbers || [],
      category: h.category || null,
      docClass: (h.classTypes || []).map(c => c.documentClass).filter(Boolean),
      authors: (h.affiliations || []).filter(a => a.afType === 'AUTHOR').map(a => a.affiliation).slice(0, 3),
      url: `https://elibrary.ferc.gov/eLibrary/filelist?accession_number=${encodeURIComponent(acc)}`,
      accession: acc
    };
  });
  return { items, total: j.totalHits || 0, error: null };
}

/* Watch one docket. Searching the docket number is the reliable route,
   because the dedicated docket filter throws on this endpoint. Results are
   filtered client-side, since the API returns relevance order. */
async function watchDocket(docket, { since = null, pageSize = 25 } = {}) {
  const { items, error } = await search(docket, { pageSize });
  if (error) return { items: [], error };
  const hit = items.filter(i => (i.dockets || []).some(d => String(d).toUpperCase().startsWith(String(docket).toUpperCase())));
  const scoped = hit.length ? hit : items;
  const fresh = since ? scoped.filter(i => i.date && i.date > since) : scoped;
  fresh.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return { items: fresh, error: null };
}

module.exports = { search, watchDocket, ENDPOINT };
