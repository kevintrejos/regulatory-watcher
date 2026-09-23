'use strict';
/* Alias tables.

   A reporter writes "the ratepayer bill", not "H.R. 9340". So every bill a
   client cares about gets a table of the strings a human might actually
   type, each carrying how much a match on it is worth and what else has to
   be true for the match to count.

   The central problem is namespace collision. Federal bill numbers are
   close to unique: "H.R. 9340" in a 2026 post almost certainly means that
   bill. State numbers collide fifty ways. "SB 886" is a live bill number
   in most states in most sessions, so a bare match on it is nearly
   worthless. The `needs` field carries that: a state alias only counts
   when the post or the reporter supplies the jurisdiction.  */

const STATE_NAMES = {
  AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California', CO:'Colorado',
  CT:'Connecticut', DE:'Delaware', FL:'Florida', GA:'Georgia', HI:'Hawaii', ID:'Idaho',
  IL:'Illinois', IN:'Indiana', IA:'Iowa', KS:'Kansas', KY:'Kentucky', LA:'Louisiana',
  ME:'Maine', MD:'Maryland', MA:'Massachusetts', MI:'Michigan', MN:'Minnesota',
  MS:'Mississippi', MO:'Missouri', MT:'Montana', NE:'Nebraska', NV:'Nevada',
  NH:'New Hampshire', NJ:'New Jersey', NM:'New Mexico', NY:'New York', NC:'North Carolina',
  ND:'North Dakota', OH:'Ohio', OK:'Oklahoma', OR:'Oregon', PA:'Pennsylvania',
  RI:'Rhode Island', SC:'South Carolina', SD:'South Dakota', TN:'Tennessee', TX:'Texas',
  UT:'Utah', VT:'Vermont', VA:'Virginia', WA:'Washington', WV:'West Virginia',
  WI:'Wisconsin', WY:'Wyoming'
};
/* Extra words that establish a jurisdiction without naming the state. */
const STATE_CONTEXT = {
  TX:['ERCOT','PUCT','Austin','Texas Legislature'], CA:['CPUC','CAISO','Sacramento','Assembly'],
  PA:['Harrisburg','PUC'], IL:['Springfield','ICC'], OH:['Columbus','PUCO'],
  NJ:['Trenton','BPU'], NY:['Albany','NYISO','PSC'], VA:['Richmond','SCC'],
  MD:['Annapolis'], CO:['Denver'], MA:['Beacon Hill']
};

/* How much a match on each kind of alias is worth, before the reporter's
   own weight is applied. */
const KIND_WEIGHT = {
  ident: 1.00,        // "H.R. 9340"
  'ident-loose': 0.72, // "HR9340", no separators
  title: 0.95,        // the full short title
  'title-short': 0.70, // the title with Act/of 2026 stripped
  acronym: 0.85,      // "SPEED Act"
  'title-desc': 0.55, // a descriptive label, not a formal short title
  docket: 1.00,       // "RD26-7-000"
  'docket-loose': 0.70,
  sponsor: 0.35,      // "the Evans bill". Weak on its own.
  manual: 0.90        // a press nickname a human added
};

const uniq = a => [...new Set(a.filter(Boolean))];
const clean = s => String(s == null ? '' : s).trim();

/* ---------- identifier variants ---------- */

/* Split a messy ident field into its separate citable parts.
   "SB 146 · Act 21" and "S731/A796 · P.L. 2026, c.32" both carry more
   than one thing a reporter might write. */
function identParts(ident) {
  return clean(ident).split(/\s*[·|]\s*|\s*\/\s*/).map(clean).filter(Boolean);
}

const CHAMBER = [
  [/^H\.?\s?R\.?\s*(\d+)$/i, p => [`H.R. ${p}`, `HR ${p}`, `H.R.${p}`, `H R ${p}`], p => [`HR${p}`]],
  [/^S\.?\s*(\d+)$/i,        p => [`S. ${p}`, `S ${p}`, `S.${p}`],                  p => [`S${p}`]],
  [/^A\.?B\.?\s*(\d+)$/i,    p => [`AB ${p}`, `A.B. ${p}`, `Assembly Bill ${p}`],   p => [`AB${p}`]],
  [/^S\.?B\.?\s*(\d+)$/i,    p => [`SB ${p}`, `S.B. ${p}`, `Senate Bill ${p}`],     p => [`SB${p}`]],
  [/^H\.?B\.?\s*(\d+)$/i,    p => [`HB ${p}`, `H.B. ${p}`, `House Bill ${p}`],      p => [`HB${p}`]],
  [/^A\s*(\d+)$/i,           p => [`A ${p}`, `A-${p}`, `Assembly Bill ${p}`],       p => [`A${p}`]],
  [/^S\s*(\d+)$/i,           p => [`S ${p}`, `S-${p}`],                             p => [`S${p}`]]
];

function identAliases(part) {
  for (const [re, exact, loose] of CHAMBER) {
    const m = part.match(re);
    if (m) return { exact: exact(m[1]), loose: loose(m[1]) };
  }
  /* Agency dockets: RD26-7-000, CLO-001-1, 16 TAC 25.194, Project 2026-02 */
  if (/^[A-Z]{2,6}[\d-]+/.test(part) || /^(Project|Order No\.|Docket)\b/i.test(part)) {
    const trimmed = part.replace(/-0+$/, '');
    return { exact: uniq([part, trimmed]), loose: uniq([part.replace(/[^A-Za-z0-9]/g, '')]), docket: true };
  }
  return { exact: [], loose: [] };
}

/* ---------- title variants ---------- */

/* A formal short title ("Ratepayer Protection Act") is a name and matching
   it means something. A descriptive label a tracker wrote ("Data center cost
   allocation") is just words, and on its own it would match any story on the
   subject, so it scores lower and takes the jurisdiction gate. */
const isFormalTitle = t => /\b(Act|Law|Resolution)\b\s*(of\s+(19|20)\d\d)?$/i.test(t);

/* Acronyms are only useful when the acronym ALONE is what people write.
   Two rules keep them from eating the corpus. They match case-sensitively,
   because "GRID" is a bill and "grid" is a noun. And a bare agency or
   programme acronym is context, never a bill name: a post mentioning FERC
   is not a post about one specific docket. */
const AGENCY_ACRONYMS = new Set([
  'FERC','NERC','EPA','DOE','DOD','TVA','PUC','PUCT','CPUC','PUCO','ICC','BPU','SCC',
  'PJM','ERCOT','MISO','CAISO','SPP','NYISO','ISONE','RTO','NEPA','PEIS','CMMC','SBIR',
  'RFA','RFP','FAR','CUI','TAC','GW','MW','AI','LNG','USA','ACT','THE','AND','FOR'
]);

function titleAliases(title) {
  const t = clean(title);
  if (!t) return { exact: [], short: [], acronyms: [], formal: false };
  const short = t
    .replace(/\s+of\s+(19|20)\d\d$/i, '')
    .replace(/\s+Act$/i, '')
    .trim();
  /* A run of capitals in a title is almost always the name people use:
     the SPEED Act, BIG WIRES. */
  const acronyms = (t.match(/\b[A-Z]{3,}(?:\s+[A-Z]{2,})*\b/g) || [])
    .map(a => a.trim())
    .filter(a => a !== t.toUpperCase())
    /* multi-word runs like "BIG WIRES" are distinctive at any length;
       a single short token is not */
    .filter(a => a.includes(' ') || (a.length >= 4 && !AGENCY_ACRONYMS.has(a)));
  return {
    exact: [t],
    short: short && short.toLowerCase() !== t.toLowerCase() && short.split(/\s+/).length >= 2 ? [short] : [],
    acronyms, formal: isFormalTitle(t)
  };
}

/* ---------- sponsor variants ---------- */

/* "Reps. Gabe Evans (R-CO-08) and Kathy Castor (D-FL-14)." -> Evans, Castor */
function sponsorAliases(sponsors) {
  const s = clean(sponsors);
  if (!s) return [];
  const names = [];
  const re = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*\(([RDI])-/g;
  let m;
  while ((m = re.exec(s))) {
    const full = m[1].trim().split(/\s+/);
    const last = full[full.length - 1];
    if (last && last.length > 2) names.push(last);
  }
  const out = names.map(n => `${n} bill`);
  if (names.length >= 2) out.push(`${names[0]}-${names[1]}`);
  return uniq(out);
}

/* ---------- the table ---------- */

/* `needs` is a list of strings, any one of which satisfies the gate.
   An empty list means the alias stands on its own. */
function buildAliases(item, manual) {
  const isState = !!item.st;
  const st = item.st ? String(item.st).toUpperCase() : null;
  const context = isState
    ? uniq([st, STATE_NAMES[st], ...(STATE_CONTEXT[st] || [])])
    : [];

  const aliases = [];
  const push = (text, kind, needs) => {
    if (!text || String(text).length < 3) return;
    aliases.push({
      text: String(text), kind, weight: KIND_WEIGHT[kind], needs: needs || [],
      /* an acronym that is not matched case-sensitively is just a word */
      cs: kind === 'acronym'
    });
  };

  for (const part of identParts(item.ident)) {
    const { exact, loose, docket } = identAliases(part);
    /* A federal bill number stands alone. A state number never does. */
    for (const e of exact) push(e, docket ? 'docket' : 'ident', isState ? context : []);
    for (const l of loose) push(l, docket ? 'docket-loose' : 'ident-loose', isState ? context : []);
  }

  const t = titleAliases(item.title);
  for (const e of t.exact) push(e, t.formal ? 'title' : 'title-desc', t.formal ? [] : context);
  for (const s of t.short) push(s, 'title-short', isState ? context : []);
  for (const a of t.acronyms) push(a, 'acronym', []);

  /* A surname needs the topic to be in play, or every Evans story matches. */
  for (const sp of sponsorAliases(item.sponsors)) push(sp, 'sponsor', uniq([...context, ...(item.topics || [])]));

  for (const m of (manual || [])) push(m, 'manual', isState ? context : []);

  /* Longest first, so "Ratepayer Protection Act" is tried before "Ratepayer
     Protection" and the stronger alias is the one that scores. */
  aliases.sort((a, b) => b.text.length - a.text.length);

  return {
    id: item.id,
    kind: item.ident && /^(H|S|A)/.test(clean(item.ident)) && !item.lane ? 'bill' : (item.lane ? 'docket' : 'bill'),
    label: `${clean(item.ident)} ${clean(item.title)}`.trim(),
    jurisdiction: st || 'US',
    topics: item.topics || [],
    context,
    aliases,
    builtAt: new Date().toISOString().slice(0, 10)
  };
}

module.exports = { buildAliases, STATE_NAMES, STATE_CONTEXT, KIND_WEIGHT };
