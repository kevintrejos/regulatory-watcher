(() => {
  'use strict';
  const D = window.LW;
  if (!D) return;

  const $ = id => document.getElementById(id);
  const view = $('view'), side = $('side'), topbar = $('topbar'), tickerEl = $('ticker');
  const scrim = $('scrim'), pal = $('pal'), drawer = $('about'), toastEl = $('toast');

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem('lw:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('lw:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  const savedRole = store.get('role', 'ceo');
  const state = {
    role: D.roles[savedRole] ? savedRole : 'ceo',
    hidden: new Set(store.get('hidden', [])),
    muted: new Set(store.get('muted', [])),
    asked: {},
    leg: { tab: 'federal', st: 'all', stage: 'all', topic: 'all', exp: 'all', q: '', sort: 'next' },
    reg: { lane: 'all', q: '', sort: 'next' },
    con: { status: 'all', q: '' },
    mode: store.get('mode', 'locke'),
    client: store.get('client', 'loomwork'),
    mv: { kind: 'all', exp: 'all', q: '' },
    topicsOff: new Set(store.get('topicsOff', [])),
    done: new Set(store.get('done', [])),
    undone: new Set(store.get('undone', [])),
    qs: store.get('qs', {}),
    sg: { kind: 'all', conf: 'all' },
    cur: -1, gKey: false, lastFocus: null
  };
  const saveHidden = () => store.set('hidden', [...state.hidden]);

  /* ---------- dates ---------- */
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const pd = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d || 1); };
  const TODAY = pd(D.today);
  const days = s => Math.round((pd(s) - TODAY) / 864e5);
  const fmt = (s, short) => {
    if (!s) return '';
    const d = pd(s);
    const dd = String(d.getDate()).padStart(2, '0') + ' ' + MON[d.getMonth()];
    return short ? dd : dd + ' ' + d.getFullYear();
  };
  const dow = (s, full) => { const n = DOW[pd(s).getDay()]; return full ? n : n.slice(0, 3); };
  const rel = s => {
    const n = days(s);
    if (n === 0) return 'today';
    if (n === 1) return 'tomorrow';
    if (n === -1) return 'yesterday';
    return n > 0 ? 'in ' + n + ' days' : Math.abs(n) + ' days ago';
  };
  const byDate = (a, b) => a.date.localeCompare(b.date);

  /* ---------- vocabulary ---------- */
  const STAGE = {
    draft: ['Discussion draft', 'st-draft'], intro: ['Introduced', 'st-intro'], cmte: ['In committee', 'st-cmte'],
    rept: ['Reported', 'st-rept'], pass: ['Passed chamber', 'st-pass'], desk: ["Governor's desk", 'st-desk'],
    enact: ['Enacted', 'st-enact'], study: ['Interim study', 'st-study'], dead: ['Dead', 'st-dead']
  };
  const EXP = ['None', 'Low', 'Medium', 'High'];
  const TOPICS = { interconnection: 'Interconnection', largeload: 'Large-load rules', transmission: 'Transmission and permitting', ai: 'AI regulation', funding: 'Federal funding' };
  const SEV = { act: 'Act', watch: 'Watch', fyi: 'FYI' };
  const KIND = { stage: 'Stage change', new: 'New item', press: 'Coverage', filing: 'Filing', locke: 'Locke', deadline: 'Deadline', meeting: 'Meeting' };
  const OB = { met: ['Met', 'st-enact'], due: ['Due', 'sev-watch'], gap: ['Gap', 'sev-act'], monitor: ['Monitor', 'st-intro'] };
  const REQ = { met: ['Met', 'st-enact'], partial: ['Partial', 'sev-watch'], gap: ['Gap', 'sev-act'] };
  const STN = D.stateNames;

  const I = {
    search: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/></svg>',
    menu: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h12M2 8h12M2 12h12"/></svg>',
    close: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg>',
    sun: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3"/><path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1"/></svg>',
    moon: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 9.6A5.6 5.6 0 0 1 6.4 2.5a5.6 5.6 0 1 0 7.1 7.1z"/></svg>',
    ext: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2.5h5v5M9.5 2.5 3 9"/></svg>',
    chev: '<svg viewBox="0 0 12 12" aria-hidden="true" style="width:11px;height:11px"><path d="M3 4.5 6 7.5 9 4.5"/></svg>'
  };

  /* ---------- atoms ---------- */
  function chip(id, label, pre) {
    const s = D.sources[id];
    const l = pre ? label : esc(label || (s && s.label) || id);
    if (!s) return '<span class="cite">' + l + '</span>';
    return '<a class="cite" href="' + esc(s.url) + '" target="_blank" rel="noopener" title="' + esc(s.pub + (s.date ? ', ' + fmt(s.date) : '')) + '">' + l + '</a>';
  }
  function rich(t) {
    let h = esc(t);
    h = h.replace(/\[\[([\w-]+)\|([^\]]+)\]\]/g, (m, id, label) => chip(id, label, true));
    h = h.replace(/`([^`]+)`/g, '<span class="id">$1</span>');
    h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return h;
  }
  const srcCount = texts => new Set(texts.join(' ').match(/\[\[([\w-]+)\|/g) || []).size;
  const srcIds = texts => [...new Set((texts.join(' ').match(/\[\[([\w-]+)\|/g) || []).map(x => x.slice(2, -1)))];
  function av(pid, cls) {
    const p = D.people[pid];
    if (!p) return '';
    return '<span class="av' + (p.org === 'locke' ? ' locke' : '') + (cls ? ' ' + cls : '') + '" title="' + esc(p.name + ', ' + p.title) + '">' + esc(p.ini) + '</span>';
  }
  const stagePill = m => { const s = STAGE[m.stage]; return '<span class="pill ' + s[1] + '">' + esc(m.stageLabel || s[0]) + '</span>'; };
  const regPill = r => '<span class="pill ' + r.cls + '">' + esc(r.stage) + '</span>';
  const sevPill = s => '<span class="pill sev-' + s + '">' + SEV[s] + '</span>';
  const exp = l => '<span class="exp" data-l="' + l + '"><span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>' + EXP[l] + '</span>';
  const stance = s => '<span class="stance" data-s="' + ({ Aligned: 'aligned', Mixed: 'mixed', Opposed: 'opposed' }[s] || 'none') + '">' + esc(s) + '</span>';
  const tag = (map, k) => { const v = map[k] || ['?', 'st-intro']; return '<span class="pill ' + v[1] + '">' + v[0] + '</span>'; };
  const dateBlock = s => { const d = pd(s); return '<span class="db" aria-hidden="true">' + MON[d.getMonth()] + '<b>' + String(d.getDate()).padStart(2, '0') + '</b></span>'; };
  const topicOn = topics => !topics || !topics.length || topics.some(t => !state.topicsOff.has(t));
  const visibleM = m => !state.muted.has(m.st || 'US') && !state.hidden.has('m:' + m.id) && topicOn(m.topics);
  const mById = id => D.measures.find(m => m.id === id);
  const rById = id => D.reg.find(r => r.id === id);
  const oById = id => D.opps.find(o => o.id === id);
  const stamps = (by, n, time) => {
    const p = D.people[by];
    return '<div class="stamps"><span class="prov"><span class="dot"></span>Agent-drafted' + (time ? ' ' + esc(time[0]) : '') + '</span>' +
      '<span class="prov"><span class="dot human"></span>Reviewed by ' + esc(p.short) + (time ? ', ' + esc(time[1]) : '') + '</span>' +
      (n ? '<span class="prov">' + n + ' source' + (n === 1 ? '' : 's') + ' verified</span>' : '') + '</div>';
  };
  const sig = pid => { const p = D.people[pid]; return '<div class="sig">' + av(pid, 'lg') + '<div><b>' + esc(p.name) + '</b><div class="lbl">' + esc(p.title) + (p.org === 'locke' ? ' · Locke' : '') + '</div></div></div>'; };
  let secN = 0;
  const sec = (html, cls) => { secN++; return '<section class="sec' + (cls ? ' ' + cls : '') + '"><div class="g" aria-hidden="true">' + String(secN).padStart(2, '0') + '</div><div class="b">' + html + '</div></section>'; };

  /* ---------- shell ---------- */
  /* What a client with seats sees. Four screens, not twelve. */
  const NAV = [
    { group: 'Your week', items: [['home', 'Brief', 'H'], ['moving', 'What’s moving', 'M']] },
    { group: 'Your obligations', items: [['compliance', 'Obligations', 'O']] },
    { group: 'Your pipeline', items: [['contracting', 'Opportunities', 'C']] }
  ];
  /* Everything a Locke staffer needs to do the work, on the firm side. */
  const FIRM_TOOLS = [
    { group: 'Intelligence', items: [['queue', 'Review queue', 'Q'], ['signals', 'Signal log', 'N']] },
    { group: 'Client tools', items: [['stakeholders', 'Stakeholders', 'S'], ['advocacy', 'Advocacy'], ['disclosures', 'Disclosures']] },
    { group: 'Work', items: [['briefs', 'Briefs', 'B'], ['tasks', 'Tasks', 'T'], ['analytics', 'Analytics', 'A'], ['settings', 'Monitoring settings']] }
  ];
  const sinceVisible = () => D.since.filter(x => !state.hidden.has(x.id));
  function navLink(k, l, key) {
    const p = D.planned[k];
    const n = k === 'home' ? sinceVisible().length : 0;
    const tail = n ? '<span class="badge" title="' + n + ' changes since your last visit">' + n + '</span>'
      : (p ? '<span class="soon">Phase ' + p.phase + '</span>' : (key ? '<kbd>G ' + key + '</kbd>' : ''));
    return '<a class="nav-a" data-nav="' + k + '" href="#/' + k + '"><span>' + esc(l) + '</span>' + tail + '</a>';
  }
  const curClient = () => cById(state.client) || D.clients[0];
  function modeBox() {
    const me = D.people[D.locke.user];
    if (state.mode === 'locke') {
      return '<div class="mode"><div class="who"><b>' + esc(me.name) + '</b><small>' + esc(D.locke.seat) + '</small></div>' +
        '<button class="mode-btn" type="button" data-act="mode" data-mode="client" data-client="' + esc(state.client) + '"><span>View as a client</span><span>→</span></button></div>';
    }
    const c = curClient();
    return '<div class="mode"><div class="who"><b>' + esc(c.name) + '</b><small>' + (c.tier === 'platform' ? 'Their seat · ' + c.seats.length + ' users' : 'Slack only · no seats') + '</small></div>' +
      '<button class="mode-btn" type="button" data-act="mode" data-mode="locke"><span>← Back to portfolio</span></button></div>';
  }
  function clientNav() {
    const c = curClient();
    if (c.tier !== 'platform') {
      return '<nav class="nav" aria-label="Sections"><div class="nav-g"><div class="nav-l">Their whole product</div>' +
        '<a class="nav-a" data-nav="digest" href="#/digest"><span>The digest</span></a></div>' +
        '<div class="nav-g"><div class="nav-l">Why this is all</div></div>' +
        '<p style="font-size:11.5px;color:var(--fg-faint);line-height:1.5;padding:0 2px">No one here runs government affairs. They get Slack and one page. Locke does the rest on their behalf.</p></nav>';
    }
    return '<nav class="nav" aria-label="Sections">' +
      NAV.map(g => '<div class="nav-g"><div class="nav-l">' + g.group + '</div>' + g.items.map(([k, l, key]) => navLink(k, l, key)).join('') + '</div>').join('') +
      '<div class="nav-g"><div class="nav-l">Saved searches</div>' + D.saved.map(s => '<a class="nav-a" href="' + s.href + '"><span>' + esc(s.label) + '</span></a>').join('') + '</div></nav>';
  }
  function lockeNav() {
    return '<nav class="nav" aria-label="Sections">' +
      '<div class="nav-g"><div class="nav-l">Firm</div>' +
      '<a class="nav-a" data-nav="portfolio" href="#/portfolio"><span>Portfolio</span><kbd>G P</kbd></a>' +
      '<a class="nav-a" data-nav="impacts" href="#/impacts"><span>Impact</span><kbd>G I</kbd></a>' +
      '</div><div class="nav-g"><div class="nav-l">Clients</div>' +
      D.clients.map(c => '<a class="nav-a" data-nav="client-' + c.id + '" href="#/client/' + c.id + '"><span class="row2">' + healthDot(c.health) + esc(c.name) + '</span>' +
        (c.openActions ? '<span class="badge">' + c.openActions + '</span>' : '<span class="soon">' + (c.tier === 'platform' ? 'Seats' : 'Slack') + '</span>') + '</a>').join('') +
      '</div>' +
      FIRM_TOOLS.map(g => '<div class="nav-g"><div class="nav-l">' + g.group + '</div>' + g.items.map(([k, l, key]) => navLink(k, l, key)).join('') + '</div>').join('') +
      '</nav>';
  }
  function renderSide() {
    side.innerHTML =
      '<div class="brand"><a href="' + (state.mode === 'locke' ? '#/portfolio' : '#/home') + '" class="wm">Locke</a><span class="tag">Concept</span>' +
      '<button class="icon-btn only-m" type="button" data-act="close" aria-label="Close menu">' + I.close + '</button></div>' +
      modeBox() +
      (state.mode === 'locke' ? lockeNav() : clientNav()) +
      '<div class="side-foot">' + (state.mode === 'locke' ? '' : navLink('settings', 'Monitoring settings')) +
      '<div class="nav-l">' + (state.mode === 'locke' ? 'Firm · today' : 'Your Locke team') + '</div>' +
      ['kevin', 'chen', 'bell'].map(p => {
        const load = D.triage.filter(t => t.owner === p).length;
        const sub = state.mode === 'locke' ? (load ? load + ' open today' : 'clear today') : D.people[p].title;
        return '<div class="tm">' + av(p) + '<span><b>' + esc(D.people[p].name) + '</b><small>' + esc(sub) + '</small></span></div>';
      }).join('') +
      '</div>';
    markNav(route().navKey);
  }
  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  const isPaper = () => document.documentElement.getAttribute('data-theme') === 'paper';
  function renderTop() {
    const r = D.roles[state.role], me = D.people[r.person];
    topbar.innerHTML =
      '<button class="icon-btn only-m" type="button" data-act="menu" aria-label="Open menu">' + I.menu + '</button>' +
      '<button class="search" type="button" data-act="palette" aria-label="Search. Shortcut Command K">' + I.search + '<span>Search bills, rules, opportunities, people</span><kbd>⌘K</kbd></button>' +
      '<div class="top-r">' +
      (state.mode === 'locke'
        ? '<span class="role-btn" style="cursor:default">' + av(D.locke.user) + '<span class="role-t"><b>' + esc(D.people[D.locke.user].name) + '</b><small>' + esc(D.locke.firm) + '</small></span></span>'
        : '<div class="role"><button class="role-btn" type="button" id="role-btn" data-act="role-menu" aria-haspopup="menu" aria-expanded="false" aria-label="Viewing as ' + esc(me.name) + '. Change role">' + av(r.person) + '<span class="role-t"><b>' + esc(me.name) + '</b><small>' + esc(r.label) + '</small></span>' + I.chev + '</button>' +
          '<div class="menu" id="role-menu" role="menu" hidden><div class="nav-l">View Loomwork as</div>' +
          Object.entries(D.roles).map(([k, v]) => '<button type="button" role="menuitemradio" aria-checked="' + (k === state.role) + '" data-act="role" data-role="' + k + '">' + av(v.person) + '<span><b>' + esc(D.people[v.person].name) + '</b><small>' + esc(v.label) + '</small></span></button>').join('') +
          '</div></div>') +
      '<button class="icon-btn" type="button" id="theme-btn" data-act="theme" aria-label="' + (isPaper() ? 'Switch to ink theme' : 'Switch to paper theme') + '">' + (isPaper() ? I.moon : I.sun) + '</button>' +
      '<button class="btn-quiet" type="button" data-act="about">About</button>' +
      '</div>';
  }
  function renderTicker() {
    const list = state.mode === 'locke'
      ? D.triage.filter(t => days(t.due) >= 0).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 7)
        .map(t => ({ date: t.due, title: cName(t.client) + ' · ' + t.title, href: t.ref ? refHref(t.ref) : '#/client/' + t.client, sev: t.sev }))
      : D.coming.filter(c => days(c.date) >= 0).sort(byDate).slice(0, 7);
    tickerEl.innerHTML = '<span class="tk-l">' + (state.mode === 'locke' ? 'Book' : 'Next') + '</span>' + list.map(c => {
      const inner = '<b>' + fmt(c.date, true).toUpperCase() + '</b><span>' + esc(c.title) + '</span><span class="d">' + rel(c.date) + '</span>';
      return c.href ? '<a class="tk' + (c.sev === 'act' ? ' is-act' : '') + '" href="' + c.href + '">' + inner + '</a>'
        : '<span class="tk' + (c.sev === 'act' ? ' is-act' : '') + '">' + inner + '</span>';
    }).join('');
  }
  function markNav(key) {
    side.querySelectorAll('[data-nav]').forEach(a => {
      if (a.dataset.nav === key) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  /* ---------- home ---------- */
  function viewHome() {
    const r = D.roles[state.role], me = D.people[r.person];
    const since = sinceVisible();
    const hiddenN = D.since.length - since.length;
    const coming = D.coming.filter(c => days(c.date) >= 0).sort(byDate);
    const needs = coming.filter(c => c.sev === 'act').length;
    const head = '<div class="pg-hd"><div><div class="eyebrow">' + dow(D.today, true) + ' ' + fmt(D.today) + ' · Morning brief</div>' +
      '<h1>Good morning, ' + esc(me.first) + '.</h1></div>' +
      '<div class="hd-facts"><span><b>' + since.length + '</b> changes since ' + dow(D.lastVisit) + ' ' + fmt(D.lastVisit, true) + '</span>' +
      '<span><b>' + needs + '</b> need a decision</span><span><b>' + D.reg.filter(x => x.exposure === 3).length + '</b> live dockets</span></div></div>';
    const body = '<div class="home-grid">' + letter(r) + '<div class="rail">' + comingPanel(coming.slice(0, 6)) + askPanel(r) + '</div></div>';
    const ledger = '<div class="sec-hd"><h2>Since ' + dow(D.lastVisit, true) + '</h2><span class="sec-meta">' + fmt(D.lastVisit, true) + ' to ' + fmt(D.today, true) + ' · J and K to move</span></div>' +
      '<div class="ledger">' + (since.length ? since.map(ledgerRow).join('') : '<p class="empty-s">Nothing new since your last visit.</p>') +
      (hiddenN ? '<div class="ledger-ft"><span>' + hiddenN + ' marked not relevant</span><button class="link" type="button" data-act="unhide">Restore</button></div>' : '') + '</div>';
    return sec(head + body) + sec(ledger);
  }
  function letter(r) {
    const b = r.brief, s = D.people[b.signer];
    const n = srcCount(b.items.map(i => i.why).concat(b.lede));
    return '<article class="letter brief" aria-labelledby="brief-lede">' +
      '<div class="mh"><span class="wm">Locke</span><span class="lbl">Morning brief · ' + esc(r.label) + ' · ' + fmt(D.today) + '</span></div>' +
      '<p class="lede" id="brief-lede">' + rich(b.lede) + '</p>' +
      briefStack(b.items) +
      '<div class="brief-ft"><div class="sigline">' + av(b.signer) + '<span><b>' + esc(s.name) + '</b>, ' + esc(s.title) + ' · signed 6:55 AM</span></div>' +
      '<span class="prov"><span class="dot"></span>Agent-drafted</span><span class="prov">' + n + ' sources verified</span>' +
      '<button class="btn-quiet sm" type="button" data-act="toast" data-msg="' + esc('Reply sent to ' + s.first + '. The whole Locke account team sees replies.') + '">Reply to ' + esc(s.first) + '</button></div>' +
      '</article>';
  }
  const bKey = i => 'b:' + state.role + ':' + (i.ref ? i.ref.type + i.ref.id : i.title.slice(0, 24));
  function briefStack(items) {
    const vis = items.filter(i => !state.hidden.has(bKey(i)));
    if (!vis.length) return '<div class="bitem"><span class="stripe s-fyi" aria-hidden="true"></span><div class="bi-b">' +
      '<p>Nothing left needs you this morning. The next item that does will arrive in Slack. ' +
      '<button class="link" type="button" data-act="unhide">Restore what I dismissed</button></p></div></div>';
    return vis.map(briefItem).join('');
  }
  function briefItem(i) {
    const href = refHref(i.ref);
    return '<div class="bitem"' + (href ? ' data-href="' + href + '"' : '') + '>' +
      '<span class="stripe s-' + i.sev + '" aria-hidden="true"></span>' +
      '<div class="bi-b">' +
      '<div class="bi-hd">' + sevPill(i.sev) +
      (i.when ? '<span class="bi-when">' + esc(i.whenLabel) + ' · ' + fmt(i.when, true) + (days(i.when) >= 0 ? ' · ' + rel(i.when) : '') + '</span>' : '') + '</div>' +
      '<h3 class="bi-t">' + (href ? '<a href="' + href + '">' + esc(i.title) + '</a>' : esc(i.title)) + '</h3>' +
      '<p>' + rich(i.why) + '</p>' +
      '<div class="bi-a">' +
      i.actions.map(a => '<button class="btn sm" type="button" data-act="toast" data-msg="' + esc(a.toast) + '">' + esc(a.label) + '</button>').join('') +
      '<button class="btn-quiet sm" type="button" data-act="hide-b" data-key="' + esc(bKey(i)) + '">Not relevant</button>' +
      '</div></div></div>';
  }
  function comingPanel(list) {
    return '<section aria-labelledby="coming-h"><div class="sec-hd"><h2 id="coming-h">Coming up</h2><span class="sec-meta">' + list.length + '</span></div>' +
      '<ol class="cal">' + list.map(c => {
        const title = c.href ? '<a href="' + c.href + '">' + esc(c.title) + '</a>' : '<span class="cal-t">' + esc(c.title) + '</span>';
        return '<li class="cal-i' + (c.internal ? ' internal' : '') + '">' + dateBlock(c.date) + '<div class="cal-b">' + title +
          '<div class="meta">' + esc(c.meta) + ' · ' + (c.approx ? 'by ' + fmt(c.date, true) : rel(c.date)) + '</div></div>' + (c.sev ? sevPill(c.sev) : '') + '</li>';
      }).join('') + '</ol></section>';
  }
  function askPanel(r) {
    const a = state.asked[state.role];
    return '<section class="ask" id="ask" aria-labelledby="ask-h"><div class="sec-hd"><h2 id="ask-h">Ask Locke</h2><span class="sec-meta">Reviewed by counsel</span></div>' +
      '<div class="ask-qs">' + r.ask.map((x, i) => '<button class="ask-q" type="button" data-act="ask" data-i="' + i + '" aria-expanded="' + (a === i) + '" aria-controls="ask-a">' + esc(x.q) + '</button>').join('') + '</div>' +
      (a != null ? askAnswer(r.ask[a], r) : '') + '</section>';
  }
  function askAnswer(x, r) {
    return '<div class="ask-a" id="ask-a"><div class="lbl">Locke</div><p>' + rich(x.a) + '</p>' + stamps(x.by || r.brief.signer, srcCount([x.a])) + '</div>';
  }
  function refHref(ref) {
    if (!ref) return null;
    if (ref.type === 'm') return '#/m/' + ref.id;
    if (ref.type === 'h') return '#/h/' + ref.id;
    if (ref.type === 'r') return '#/r/' + ref.id;
    if (ref.type === 'o') return '#/o/' + ref.id;
    if (ref.type === 'p') return '#/p/' + ref.id;
    return ref.href || null;
  }
  function ledgerRow(x) {
    const href = refHref(x.ref);
    return '<div class="lg-row"' + (href ? ' data-href="' + href + '"' : '') + ' data-id="' + esc(x.id) + '"><span class="stripe s-' + x.sev + '" aria-hidden="true"></span>' +
      '<span class="lg-k">' + esc(KIND[x.kind] || x.kind) + '</span>' +
      '<div class="lg-b"><div class="lg-t">' + (href ? '<a href="' + href + '">' + esc(x.title) + '</a>' : esc(x.title)) + '</div><p>' + rich(x.detail) + '</p></div>' +
      '<span class="lg-d">' + fmt(x.date, true) + '</span>' +
      '<div class="lg-a">' + (x.hideable ? '<button class="btn-quiet sm" type="button" data-act="hide" data-id="' + esc(x.id) + '">Not relevant</button>' : '') + '</div></div>';
  }

  /* ---------- legislative ---------- */
  function viewLeg(tab, q) {
    tab = tab === 'state' ? 'state' : 'federal';
    const L = state.leg;
    if (L.tab !== tab || q.topic) Object.assign(L, { tab, st: 'all', stage: 'all', topic: q.topic || 'all', exp: 'all', q: '', sort: 'next' });
    const all = D.measures.filter(m => m.level === tab && visibleM(m));
    const count = lv => D.measures.filter(m => m.level === lv && visibleM(m)).length;
    const moved = all.filter(m => m.last && days(m.last.date) <= 0 && days(m.last.date) >= -30).length;
    const high = all.filter(m => m.exposure === 3).length;
    const upcoming = all.filter(m => m.next && m.next.date && days(m.next.date) >= 0).sort((a, b) => a.next.date.localeCompare(b.next.date))[0];
    const states = [...new Set(all.map(m => m.st).filter(Boolean))].sort();
    const stages = [...new Set(all.map(m => m.stage))];
    const opt = (v, l, cur) => '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' + esc(l) + '</option>';

    const head = '<div class="pg-hd"><div><div class="eyebrow">Monitoring · Legislative</div><h1>' + (tab === 'federal' ? 'Congress' : 'State legislatures') + '</h1>' +
      '<p class="sub">' + esc(D.legIntro[tab]) + '</p></div>' +
      '<nav class="seg" aria-label="Jurisdiction"><a href="#/legislative/federal"' + (tab === 'federal' ? ' aria-current="page"' : '') + '>Federal <span>' + count('federal') + '</span></a>' +
      '<a href="#/legislative/state"' + (tab === 'state' ? ' aria-current="page"' : '') + '>State <span>' + count('state') + '</span></a></nav></div>';
    const strip = '<div class="strip">' +
      stat('Tracked', all.length, tab === 'state' ? states.length + ' states' : 'House and Senate') +
      stat('Moved in 30 days', moved, 'Stage change or floor action') +
      stat('High exposure', high, 'Direct effect on Loomwork') +
      stat('Next date', upcoming ? days(upcoming.next.date) + '<small>days</small>' : '&mdash;', upcoming ? upcoming.ident + ' · ' + upcoming.next.label : 'Nothing scheduled') + '</div>';
    const filters = '<div class="filters" role="search">' +
      '<label class="sr" for="leg-q">Filter measures</label><input class="fld" id="leg-q" type="search" placeholder="Filter by number, title, sponsor" value="' + esc(L.q) + '">' +
      (tab === 'state' ? '<label class="sr" for="leg-st">State</label><select class="fld" id="leg-st">' + opt('all', 'All states', L.st) + states.map(s => opt(s, STN[s], L.st)).join('') + '</select>' : '') +
      '<label class="sr" for="leg-stage">Stage</label><select class="fld" id="leg-stage">' + opt('all', 'Any stage', L.stage) + Object.keys(STAGE).filter(s => stages.includes(s)).map(s => opt(s, STAGE[s][0], L.stage)).join('') + '</select>' +
      '<label class="sr" for="leg-topic">Topic</label><select class="fld" id="leg-topic">' + opt('all', 'All topics', L.topic) + Object.entries(TOPICS).map(([k, v]) => opt(k, v, L.topic)).join('') + '</select>' +
      '<label class="sr" for="leg-exp">Exposure</label><select class="fld" id="leg-exp">' + opt('all', 'Any exposure', L.exp) + [3, 2, 1, 0].map(n => opt(String(n), EXP[n] + ' exposure', L.exp)).join('') + '</select>' +
      '<label class="sr" for="leg-sort">Sort</label><select class="fld" id="leg-sort">' + opt('next', 'Sort: next date', L.sort) + opt('exposure', 'Sort: exposure', L.sort) + opt('moved', 'Sort: last action', L.sort) + opt('title', 'Sort: title', L.sort) + '</select>' +
      '</div><div id="leg-results">' + legResults() + '</div>';
    return sec(head + strip + filters) +
      sec('<div class="cols">' + hearingsPanel(tab) + enactedPanel(tab) + '</div>', 'tight') +
      sec(watchPanel(tab), 'tight') +
      sec(pressPanel(tab), 'tight');
  }
  function stat(k, v, n) { return '<div class="stat"><div class="k">' + k + '</div><div class="v">' + v + '</div><div class="n" title="' + esc(n) + '">' + esc(n) + '</div></div>'; }
  function legList() {
    const L = state.leg;
    let list = D.measures.filter(m => m.level === L.tab && visibleM(m));
    if (L.st !== 'all') list = list.filter(m => m.st === L.st);
    if (L.stage !== 'all') list = list.filter(m => m.stage === L.stage);
    if (L.topic !== 'all') list = list.filter(m => m.topics.includes(L.topic));
    if (L.exp !== 'all') list = list.filter(m => String(m.exposure) === L.exp);
    if (L.q.trim()) {
      const q = L.q.trim().toLowerCase();
      list = list.filter(m => [m.ident, m.title, m.short, m.sponsors, m.body, STN[m.st]].join(' ').toLowerCase().includes(q));
    }
    const nk = m => (m.next && m.next.date && days(m.next.date) >= 0) ? m.next.date : '9999-12-31';
    const lk = m => (m.last && m.last.date) || '';
    const S = {
      next: (a, b) => nk(a).localeCompare(nk(b)) || b.exposure - a.exposure,
      exposure: (a, b) => b.exposure - a.exposure || nk(a).localeCompare(nk(b)),
      moved: (a, b) => lk(b).localeCompare(lk(a)),
      title: (a, b) => a.title.localeCompare(b.title)
    };
    return list.sort(S[L.sort] || S.next);
  }
  function legResults() {
    const L = state.leg, list = legList();
    const total = D.measures.filter(m => m.level === L.tab && visibleM(m)).length;
    const hiddenN = D.measures.filter(m => m.level === L.tab && state.hidden.has('m:' + m.id)).length;
    const head = '<div class="res-hd" aria-live="polite"><span>' + list.length + ' of ' + total + ' measures</span>' +
      (hiddenN ? '<span>' + hiddenN + ' not relevant · <button class="link" type="button" data-act="leg-restore">Restore</button></span>' : '<span>J and K to move, Enter to open</span>') + '</div>';
    if (!list.length) return head + '<div class="empty">No measures match these filters. <button class="link" type="button" data-act="leg-reset">Clear filters</button></div>';
    return head + '<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Measure</th><th scope="col">Stage</th><th scope="col">' + (L.tab === 'state' ? 'State' : 'Chamber') + '</th><th scope="col">Next</th><th scope="col">Exposure</th><th scope="col">Position</th><th scope="col"><span class="sr">Owner</span></th></tr></thead><tbody>' +
      list.map(m => '<tr class="row" data-href="#/m/' + m.id + '">' +
        '<td class="c-m"><a class="mt" href="#/m/' + m.id + '">' + esc(m.title) + '</a><div class="c-sub"><span class="id">' + esc(m.ident) + '</span><span>' + esc(m.short) + '</span></div></td>' +
        '<td>' + stagePill(m) + '</td><td class="c-j">' + esc(m.level === 'state' ? STN[m.st] : m.body) + '</td>' +
        '<td class="num">' + nextCell(m) + '</td><td>' + exp(m.exposure) + '</td><td><span class="pos">' + esc(m.position) + '</span></td><td>' + av(m.owner) + '</td></tr>').join('') +
      '</tbody></table></div>';
  }
  function nextCell(m) {
    if (!m.next) return '&mdash;';
    if (m.next.date && days(m.next.date) >= 0) return fmt(m.next.date, true) + '<small>' + esc(m.next.label) + ' · ' + rel(m.next.date) + '</small>';
    return '<small>' + esc(m.next.label) + '</small>';
  }
  function hRow(h) {
    return '<li class="cal-i">' + dateBlock(h.date) + '<div class="cal-b"><a href="#/h/' + h.id + '">' + esc(h.title) + '</a><div class="meta">' + esc(h.body) + ' · ' + rel(h.date) + '</div></div>' +
      (h.sev && days(h.date) >= 0 ? sevPill(h.sev) : '') + '</li>';
  }
  function hearingsPanel(tab) {
    const hs = D.hearings.filter(h => h.level === tab && !state.muted.has(h.st || 'US'));
    const up = hs.filter(h => days(h.date) >= 0).sort(byDate);
    const past = hs.filter(h => days(h.date) < 0 && days(h.date) >= -90).sort((a, b) => b.date.localeCompare(a.date));
    return '<section aria-labelledby="hear-h"><div class="sec-hd"><h2 id="hear-h">Hearings and meetings</h2><span class="sec-meta">' + up.length + ' noticed</span></div>' +
      (up.length ? '<ol class="cal">' + up.map(hRow).join('') + '</ol>' : '<p class="empty-s" style="padding-inline:0">' + esc(D.noHearings[tab]) + '</p>') +
      (past.length ? '<div class="sub-l" style="padding-inline:0">Held in the last 90 days</div><ol class="cal past">' + past.map(hRow).join('') + '</ol>' : '') + '</section>';
  }
  function enactedPanel(tab) {
    const list = D.measures.filter(m => m.level === tab && m.stage === 'enact' && m.enacted && days(m.enacted) <= 0 && days(m.enacted) >= -90 && visibleM(m))
      .map(m => ({ date: m.enacted, title: m.title, ident: m.ident, href: '#/m/' + m.id, note: m.meansShort }))
      .concat(D.actions.filter(a => a.level === tab && days(a.date) >= -90 && !state.muted.has(a.st || 'US')))
      .sort((a, b) => b.date.localeCompare(a.date));
    return '<section aria-labelledby="enact-h"><div class="sec-hd"><h2 id="enact-h">Recently enacted</h2><span class="sec-meta">Last 90 days</span></div>' +
      (list.length ? '<ol class="cal">' + list.map(e => '<li class="cal-i">' + dateBlock(e.date) + '<div class="cal-b">' +
        (e.href ? '<a href="' + e.href + '">' + esc(e.title) + '</a>' : '<span class="cal-t">' + esc(e.title) + '</span>') +
        '<div class="meta">' + esc(e.ident) + '</div><p style="margin:3px 0 0;font-size:12.5px;color:var(--fg-mute)">' + rich(e.note) + '</p></div><span></span></li>').join('') + '</ol>'
        : '<p class="empty-s" style="padding-inline:0">Nothing enacted in the last 90 days.</p>') + '</section>';
  }
  function watchPanel(tab) {
    const list = D.members.filter(p => p.level === tab);
    return '<div class="sec-hd"><h2>Member watchlist</h2><span class="sec-meta">Stance toward Loomwork’s agenda, cited to the public record</span></div>' +
      '<div class="panel"><ul class="wl">' + list.map(p => '<li><div class="wl-top"><span class="wl-n">' + esc(p.name) + '</span>' + stance(p.stance) + '</div>' +
        '<div class="wl-r">' + esc(p.role) + '</div><p>' + rich(p.note) + '</p></li>').join('') + '</ul></div>';
  }
  function pressPanel(tab) {
    const ids = new Set(D.measures.filter(m => m.level === tab).map(m => m.id));
    const list = D.press.filter(p => p.level === tab || p.rel.some(r => ids.has(r))).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
    return '<div class="sec-hd"><h2>In the press</h2><span class="sec-meta">Coverage of tracked items</span></div><div class="panel">' + pressList(list) + '</div>';
  }
  function pressList(list) {
    if (!list.length) return '<p class="empty-s">No coverage logged yet.</p>';
    return '<ul class="press">' + list.map(p => '<li><span class="src">' + esc(p.outlet) + '<br>' + fmt(p.date, true) + '</span><a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.headline) + I.ext + '</a></li>').join('') + '</ul>';
  }
  function bindLeg() {
    const L = state.leg;
    const q = $('leg-q');
    if (q) q.addEventListener('input', e => { L.q = e.target.value; refresh('leg-results', legResults); });
    [['leg-st', 'st'], ['leg-stage', 'stage'], ['leg-topic', 'topic'], ['leg-exp', 'exp'], ['leg-sort', 'sort']].forEach(([id, k]) => {
      const el = $(id);
      if (el) el.addEventListener('change', e => { L[k] = e.target.value; refresh('leg-results', legResults); });
    });
  }
  function refresh(id, fn) { const box = $(id); if (box) { box.innerHTML = fn(); state.cur = -1; } }

  /* ---------- regulatory ---------- */
  function regList() {
    const R = state.reg;
    let list = D.reg.filter(r => !state.muted.has(r.st || 'US') && topicOn(r.topics));
    if (R.lane !== 'all') list = list.filter(r => r.lane === R.lane);
    if (R.q.trim()) {
      const q = R.q.trim().toLowerCase();
      list = list.filter(r => [r.ident, r.title, r.short, r.body].join(' ').toLowerCase().includes(q));
    }
    const nk = r => (r.next && r.next.date && days(r.next.date) >= 0) ? r.next.date : '9999-12-31';
    return list.sort(R.sort === 'exposure'
      ? (a, b) => b.exposure - a.exposure || nk(a).localeCompare(nk(b))
      : (a, b) => nk(a).localeCompare(nk(b)) || b.exposure - a.exposure);
  }
  function regResults() {
    const list = regList();
    return '<div class="res-hd" aria-live="polite"><span>' + list.length + ' of ' + D.reg.length + ' dockets</span><span>J and K to move, Enter to open</span></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Rule or docket</th><th scope="col">Stage</th><th scope="col">Body</th><th scope="col">Next</th><th scope="col">Exposure</th><th scope="col">Position</th><th scope="col"><span class="sr">Owner</span></th></tr></thead><tbody>' +
      list.map(r => '<tr class="row" data-href="#/r/' + r.id + '">' +
        '<td class="c-m"><a class="mt" href="#/r/' + r.id + '">' + esc(r.title) + '</a><div class="c-sub"><span class="id">' + esc(r.ident) + '</span><span>' + esc(r.short) + '</span></div></td>' +
        '<td>' + regPill(r) + '</td><td class="c-j">' + esc(r.body) + '</td><td class="num">' + nextCell(r) + '</td>' +
        '<td>' + exp(r.exposure) + '</td><td><span class="pos">' + esc(r.position) + '</span></td><td>' + av(r.owner) + '</td></tr>').join('') +
      '</tbody></table></div>';
  }
  function viewReg(q) {
    const R = state.reg;
    if (q.lane) R.lane = q.lane;
    const act = D.reg.filter(r => r.next && r.next.date && days(r.next.date) >= 0 && days(r.next.date) <= 30);
    const soonest = D.reg.filter(r => r.next && r.next.date && days(r.next.date) >= 0).sort((a, b) => a.next.date.localeCompare(b.next.date))[0];
    const opt = (v, l, cur) => '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' + esc(l) + '</option>';
    const head = '<div class="pg-hd"><div><div class="eyebrow">Monitoring · Regulatory</div><h1>Rules and dockets</h1>' +
      '<p class="sub">Where large-load policy is actually being written: FERC, NERC, DOE, TVA and the state commissions. Compliance obligations live one screen over.</p></div>' +
      '<a class="btn-quiet" href="#/compliance">Obligations</a></div>';
    const strip = '<div class="strip">' +
      stat('Tracked', D.reg.length, 'Federal and state') +
      stat('Dates in 30 days', act.length, 'Comment, ballot or filing') +
      stat('High exposure', D.reg.filter(r => r.exposure === 3).length, 'Direct effect on Loomwork') +
      stat('Next date', soonest ? days(soonest.next.date) + '<small>days</small>' : '&mdash;', soonest ? soonest.ident + ' · ' + soonest.next.label : 'Nothing scheduled') + '</div>';
    const filters = '<div class="filters" role="search">' +
      '<label class="sr" for="reg-q">Filter dockets</label><input class="fld" id="reg-q" type="search" placeholder="Filter by docket, body or title" value="' + esc(R.q) + '">' +
      '<label class="sr" for="reg-lane">Level</label><select class="fld" id="reg-lane">' + opt('all', 'Federal and state', R.lane) + opt('federal', 'Federal only', R.lane) + opt('state', 'State only', R.lane) + '</select>' +
      '<label class="sr" for="reg-sort">Sort</label><select class="fld" id="reg-sort">' + opt('next', 'Sort: next date', R.sort) + opt('exposure', 'Sort: exposure', R.sort) + '</select>' +
      '</div><div id="reg-results">' + regResults() + '</div>';
    return sec(head + strip + filters);
  }
  function bindReg() {
    const R = state.reg;
    const q = $('reg-q');
    if (q) q.addEventListener('input', e => { R.q = e.target.value; refresh('reg-results', regResults); });
    [['reg-lane', 'lane'], ['reg-sort', 'sort']].forEach(([id, k]) => {
      const el = $(id);
      if (el) el.addEventListener('change', e => { R[k] = e.target.value; refresh('reg-results', regResults); });
    });
  }
  function viewRule(id) {
    const r = rById(id);
    if (!r) return notFound();
    const o = D.people[r.owner];
    const texts = r.analysis.concat(r.means, r.provisions || []);
    const srcs = [...new Set((r.sources || []).concat(srcIds(texts)))];
    const obs = (D.obligations || []).filter(x => x.rel === r.id);
    const head = '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/regulatory">Regulatory</a><span aria-hidden="true">/</span><span>' + esc(r.body) + '</span></nav>' +
      '<header class="d-hd"><div class="d-id"><span class="id">' + esc(r.ident) + '</span><span>' + esc(r.body) + '</span></div>' +
      '<h1>' + esc(r.title) + '</h1><div class="pillrow">' + regPill(r) + exp(r.exposure) + '<span class="pos">' + esc(r.position) + '</span></div></header>';
    const main = '<section class="memo-lite"><div class="memo-hd"><span class="lbl">Locke analysis</span><span class="lbl">Updated ' + fmt(D.today) + '</span></div>' +
      '<div class="prose sm">' + r.analysis.map(p => '<p>' + rich(p) + '</p>').join('') + '</div>' +
      '<div class="rec"><div class="lbl">What it means for Loomwork</div><p>' + rich(r.means) + '</p></div>' + sig(r.owner) + stamps(r.owner, srcCount(texts)) + '</section>' +
      (r.provisions && r.provisions.length ? '<section><h2 class="h2s">Key points</h2><ul class="plist">' + r.provisions.map(p => '<li>' + rich(p) + '</li>').join('') + '</ul></section>' : '') +
      (obs.length ? '<section><h2 class="h2s">Obligations this creates</h2><div class="panel">' + obs.map(obRow).join('') + '</div></section>' : '');
    const aside = '<div class="panel facts"><dl>' +
      fact('Body', esc(r.body)) +
      (r.last ? fact('Last action', fmt(r.last.date) + '<small>' + esc(r.last.text) + '</small>') : '') +
      (r.next ? fact('Next', (r.next.date ? fmt(r.next.date) + ' <small>' + esc(r.next.label) + (days(r.next.date) >= 0 ? ' · ' + rel(r.next.date) : '') + '</small>' : esc(r.next.label))) : '') +
      fact('Topics', r.topics.map(t => esc(TOPICS[t])).join(', ')) +
      fact('Owner', esc(o.name) + '<small>' + esc(o.title) + '</small>') +
      '</dl><div class="facts-a"><button class="btn" type="button" data-act="toast" data-msg="' + esc(r.action.toast) + '">' + esc(r.action.label) + '</button></div></div>' +
      '<section class="panel"><div class="panel-hd"><h2>Sources</h2><span class="sec-meta">' + srcs.length + '</span></div><ol class="src-list">' + srcs.map(srcItem).join('') + '</ol></section>';
    return sec(head + '<div class="detail"><div class="d-main">' + main + '</div><aside class="d-side">' + aside + '</aside></div>');
  }

  /* ---------- compliance ---------- */
  function obRow(x) {
    const p = D.people[x.owner];
    return '<div class="lg-row"' + (x.rel ? ' data-href="#/r/' + x.rel + '"' : '') + '><span class="stripe s-' + (x.status === 'gap' ? 'act' : x.status === 'due' ? 'watch' : x.status === 'met' ? 'locke' : 'fyi') + '" aria-hidden="true"></span>' +
      '<span class="lg-k">' + esc(x.regime) + '</span>' +
      '<div class="lg-b"><div class="lg-t">' + esc(x.requirement) + '</div><p>' + rich(x.note) + '</p></div>' +
      '<span class="lg-d">' + (x.due ? fmt(x.due, true) : '&mdash;') + '</span>' +
      '<div class="lg-a" style="display:flex;gap:7px;align-items:center;padding-top:9px">' + tag(OB, x.status) + av(x.owner, '') + '</div></div>';
  }
  function viewCompliance() {
    const obs = D.obligations;
    const n = s => obs.filter(o => o.status === s).length;
    const dueSoon = obs.filter(o => o.due && days(o.due) >= 0).sort((a, b) => a.due.localeCompare(b.due))[0];
    const head = '<div class="pg-hd"><div><div class="eyebrow">Compliance</div><h1>Obligations</h1>' +
      '<p class="sub">What Loomwork has to do, who owns it, and when. Each row links to the rule that created it. Gaps are the ones that block federal work.</p></div>' +
      '<a class="btn-quiet" href="#/regulatory">Rules and dockets</a></div>';
    const strip = '<div class="strip">' +
      stat('Met', n('met'), 'Documented and current') +
      stat('Due', n('due'), 'Dated and assigned') +
      stat('Gaps', n('gap'), 'Blocking federal work') +
      stat('Next date', dueSoon ? days(dueSoon.due) + '<small>days</small>' : '&mdash;', dueSoon ? dueSoon.regime : 'Nothing scheduled') + '</div>';
    const order = { gap: 0, due: 1, monitor: 2, met: 3 };
    const list = obs.slice().sort((a, b) => order[a.status] - order[b.status] || (a.due || '9999').localeCompare(b.due || '9999'));
    const body = '<div class="sec-hd" style="margin-top:18px"><h2>Every obligation</h2><span class="sec-meta">Gaps first, then dated work</span></div>' +
      '<div class="ledger">' + list.map(obRow).join('') + '</div>';
    const note = '<div class="note-box" style="margin-top:16px">' +
      rich('Two of these sit on the critical path for any federal contract: FedRAMP and NIST SP 800-171 Rev 3. Both are triggered by a rule that is still only proposed [[farcui|FAR CUI rule]], which is why Locke recommends starting now instead of waiting for the final rule.') + '</div>';
    return sec(head + strip + body + note);
  }

  /* ---------- contracting ---------- */
  function conList() {
    const C = state.con;
    let list = D.opps.slice();
    if (C.status !== 'all') list = list.filter(o => (C.status === 'open' ? o.status === 'Open' || o.status === 'Awards expected' : o.status === 'Closed' || o.status === 'Awarded'));
    if (C.q.trim()) {
      const q = C.q.trim().toLowerCase();
      list = list.filter(o => [o.ident, o.title, o.agency, o.office, o.type].join(' ').toLowerCase().includes(q));
    }
    return list.sort((a, b) => b.fit - a.fit);
  }
  function conResults() {
    const list = conList();
    return '<div class="res-hd" aria-live="polite"><span>' + list.length + ' of ' + D.opps.length + ' opportunities</span><span>Sorted by Locke fit score</span></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Opportunity</th><th scope="col">Type</th><th scope="col">Status</th><th scope="col">Response</th><th scope="col">Value</th><th scope="col">Fit</th><th scope="col">Call</th></tr></thead><tbody>' +
      list.map(o => '<tr class="row" data-href="#/o/' + o.id + '">' +
        '<td class="c-m"><a class="mt" href="#/o/' + o.id + '">' + esc(o.title) + '</a><div class="c-sub"><span class="id">' + esc(o.ident) + '</span><span>' + esc(o.agency) + '</span>' + (o.illustrative ? '<span class="pill st-draft">Illustrative</span>' : '') + '</div></td>' +
        '<td class="c-j">' + esc(o.type) + '</td><td><span class="pill ' + (o.status === 'Open' ? 'sev-act' : o.status === 'Closed' ? 'st-dead' : 'st-cmte') + '">' + esc(o.status) + '</span></td>' +
        '<td class="num">' + (o.due ? fmt(o.due, true) + '<small>' + rel(o.due) + '</small>' : '&mdash;') + '</td>' +
        '<td class="num">' + esc(o.value) + '</td>' +
        '<td class="num">' + fitBar(o.fit) + '</td>' +
        '<td><span class="pos">' + esc(o.rec) + '</span></td></tr>').join('') +
      '</tbody></table></div>';
  }
  const fitBar = n => '<span class="fit"><b>' + n + '</b><span class="fitbar" aria-hidden="true"><i style="width:' + n + '%"></i></span></span>';
  function viewCon() {
    const C = state.con;
    const open = D.opps.filter(o => o.status === 'Open' || o.status === 'Awards expected').length;
    const best = D.opps.slice().sort((a, b) => b.fit - a.fit)[0];
    const nextDue = D.opps.filter(o => o.due && days(o.due) >= 0).sort((a, b) => a.due.localeCompare(b.due))[0];
    const opt = (v, l, cur) => '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' + esc(l) + '</option>';
    const head = '<div class="pg-hd"><div><div class="eyebrow">Contracting</div><h1>Opportunities</h1>' +
      '<p class="sub">Federal programs, funding and teaming routes, each scored for fit and carrying a signed call. Closed ones stay on the board, because the reason they closed is usually the lesson.</p></div>' +
      '<a class="btn" href="#/o/oe-pilot">Open the bid decision</a></div>';
    const strip = '<div class="strip">' +
      stat('Live or expected', open, 'Accepting or awarding') +
      stat('Best fit', best ? best.fit : '&mdash;', best ? best.ident : '') +
      stat('Next response', nextDue ? days(nextDue.due) + '<small>days</small>' : '&mdash;', nextDue ? nextDue.title : 'Nothing due') +
      stat('Compliance gaps', D.obligations.filter(o => o.status === 'gap').length, 'Blocking a federal bid') + '</div>';
    const filters = '<div class="filters" role="search">' +
      '<label class="sr" for="con-q">Filter opportunities</label><input class="fld" id="con-q" type="search" placeholder="Filter by agency, program or number" value="' + esc(C.q) + '">' +
      '<label class="sr" for="con-status">Status</label><select class="fld" id="con-status">' + opt('all', 'All statuses', C.status) + opt('open', 'Live or expected', C.status) + opt('closed', 'Closed or awarded', C.status) + '</select>' +
      '</div><div id="con-results">' + conResults() + '</div>';
    const intel = '<div class="sec-hd"><h2>Market and competitors</h2><span class="sec-meta">Public record only</span></div><div class="panel">' +
      '<ol class="cal">' + D.intel.map(i => '<li class="cal-i">' + dateBlock(i.date) + '<div class="cal-b">' + (i.href ? '<a href="' + i.href + '">' + esc(i.title) + '</a>' : '<span class="cal-t">' + esc(i.title) + '</span>') +
      '<p style="margin:3px 0 0;font-size:12.5px;color:var(--fg-mute)">' + rich(i.note) + '</p></div><span></span></li>').join('') + '</ol></div>';
    return sec(head + strip + filters) + sec(intel, 'tight');
  }
  function bindCon() {
    const C = state.con;
    const q = $('con-q');
    if (q) q.addEventListener('input', e => { C.q = e.target.value; refresh('con-results', conResults); });
    const s = $('con-status');
    if (s) s.addEventListener('change', e => { C.status = e.target.value; refresh('con-results', conResults); });
  }
  function viewOpp(id) {
    const o = oById(id);
    if (!o) return notFound();
    const by = D.people[o.recBy];
    const texts = o.analysis.concat(o.why, (o.requirements || []).map(r => r.note), (o.competitors || []).map(c => c.note));
    const srcs = [...new Set((o.sources || []).concat(srcIds(texts)))];
    const head = '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/contracting">Contracting</a><span aria-hidden="true">/</span><span>' + esc(o.agency) + '</span></nav>' +
      '<header class="d-hd"><div class="d-id"><span class="id">' + esc(o.ident) + '</span><span>' + esc(o.agency) + '</span>' + (o.illustrative ? '<span class="pill st-draft">Illustrative</span>' : '') + '</div>' +
      '<h1>' + esc(o.title) + '</h1><div class="pillrow"><span class="pill ' + (o.status === 'Open' ? 'sev-act' : o.status === 'Closed' ? 'st-dead' : 'st-cmte') + '">' + esc(o.status) + '</span>' +
      '<span class="pos">Call: ' + esc(o.rec) + '</span>' + (o.due ? '<span class="pos">Response ' + fmt(o.due) + '</span>' : '') + '</div></header>';
    const fitBlock = o.fitParts ? '<section><h2 class="h2s">Fit score, ' + o.fit + ' of 100</h2><div class="panel">' +
      o.fitParts.map(p => '<div class="fitrow"><span class="fl">' + esc(p.label) + '</span><span class="fitbar" aria-hidden="true"><i style="width:' + Math.round(p.score / p.max * 100) + '%"></i></span>' +
        '<span class="fv num">' + p.score + '/' + p.max + '</span><p>' + esc(p.note) + '</p></div>').join('') + '</div></section>' : '';
    const reqBlock = o.requirements ? '<section><h2 class="h2s">Requirements crosswalk</h2><div class="panel">' +
      o.requirements.map(r => '<div class="reqrow">' + tag(REQ, r.status) + '<div><div class="lg-t">' + esc(r.req) + '</div><p>' + rich(r.note) + '</p></div></div>').join('') + '</div></section>' : '';
    const compBlock = o.competitors ? '<section><h2 class="h2s">Likely competitors</h2><div class="panel">' +
      o.competitors.map(c => '<div class="reqrow"><span class="pill st-intro">Public</span><div><div class="lg-t">' + esc(c.name) + '</div><p>' + rich(c.note) + '</p></div></div>').join('') + '</div></section>' : '';
    const main = '<section class="memo-lite"><div class="memo-hd"><span class="lbl">Locke assessment</span><span class="lbl">' + fmt(D.today) + '</span></div>' +
      '<div class="prose sm">' + o.analysis.map(p => '<p>' + rich(p) + '</p>').join('') + '</div>' +
      '<div class="rec"><div class="lbl">Recommendation: ' + esc(o.rec) + '</div><p>' + rich(o.why) + '</p></div>' + sig(o.recBy) + stamps(o.recBy, srcCount(texts)) + '</section>' + fitBlock + reqBlock + compBlock;
    const aside = '<div class="panel facts"><dl>' +
      fact('Agency', esc(o.agency) + (o.office ? '<small>' + esc(o.office) + '</small>' : '')) +
      fact('Type', esc(o.type)) + fact('NAICS', esc(o.naics)) + fact('Set-aside', esc(o.setAside)) +
      fact('Posted', o.posted ? fmt(o.posted) : '&mdash;') +
      fact('Response', o.due ? fmt(o.due) + '<small>' + rel(o.due) + '</small>' : '&mdash;') +
      fact('Value', esc(o.value)) + fact('Owner', esc(by.name) + '<small>' + esc(by.title) + '</small>') +
      '</dl><div class="facts-a"><button class="btn" type="button" data-act="toast" data-msg="' + esc(o.action.toast) + '">' + esc(o.action.label) + '</button></div></div>' +
      '<section class="panel"><div class="panel-hd"><h2>Sources</h2><span class="sec-meta">' + srcs.length + '</span></div><ol class="src-list">' + srcs.map(srcItem).join('') + '</ol></section>';
    return sec(head + '<div class="detail"><div class="d-main">' + main + '</div><aside class="d-side">' + aside + '</aside></div>');
  }

  /* ---------- measure and hearing detail ---------- */
  const TRACK = {
    federal: ['Introduced', 'In committee', 'Passed one chamber', 'Passed both', 'Enacted'],
    state: ['Introduced', 'In committee', 'Passed legislature', "Governor's desk", 'Enacted']
  };
  const AT = { intro: 0, cmte: 1, rept: 1, pass: 2, desk: 3, enact: 4 };
  function track(m) {
    if (!(m.stage in AT)) return m.trackNote ? '<div class="note-box">' + rich(m.trackNote) + '</div>' : '';
    const at = AT[m.stage];
    return '<div class="track-wrap"><ol class="track" aria-label="Progress">' + TRACK[m.level].map((l, i) => {
      const d = m.dates && m.dates[i];
      const cls = i < at ? 'done' : i === at ? 'cur' : '';
      return '<li class="' + cls + '"' + (i === at ? ' aria-current="step"' : '') + '><div class="tl">' + esc(l) + '</div><div class="td">' + (d ? fmt(d) : (i <= at ? 'On record' : 'Pending')) + '</div></li>';
    }).join('') + '</ol></div>';
  }
  function viewMeasure(id) {
    const m = mById(id);
    if (!m) return notFound();
    const o = D.people[m.owner];
    const texts = m.analysis.concat(m.means, m.provisions || []);
    const press = D.press.filter(p => p.rel.includes(m.id)).sort((a, b) => b.date.localeCompare(a.date));
    const srcs = [...new Set((m.sources || []).concat(srcIds(texts)))];
    const head = '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/legislative/' + m.level + '">Legislative</a><span aria-hidden="true">/</span>' +
      '<a href="#/legislative/' + m.level + '">' + (m.level === 'federal' ? 'Federal' : 'State') + '</a><span aria-hidden="true">/</span><span>' + esc(m.ident) + '</span></nav>' +
      '<header class="d-hd"><div class="d-id"><span class="id">' + esc(m.ident) + '</span><span>' + esc(m.level === 'state' ? STN[m.st] + ' · ' + m.body : m.body) + '</span></div>' +
      '<h1>' + esc(m.title) + '</h1><div class="pillrow">' + stagePill(m) + exp(m.exposure) + '<span class="pos">' + esc(m.position) + '</span></div></header>' + track(m);
    const main = '<section class="memo-lite"><div class="memo-hd"><span class="lbl">Locke analysis</span><span class="lbl">Updated ' + fmt(m.updated || D.today) + '</span></div>' +
      '<div class="prose sm">' + m.analysis.map(p => '<p>' + rich(p) + '</p>').join('') + '</div>' +
      '<div class="rec"><div class="lbl">What it means for Loomwork</div><p>' + rich(m.means) + '</p></div>' + sig(m.owner) + stamps(m.owner, srcCount(texts)) + '</section>' +
      (m.provisions && m.provisions.length ? '<section><h2 class="h2s">Key provisions</h2><ul class="plist">' + m.provisions.map(p => '<li>' + rich(p) + '</li>').join('') + '</ul></section>' : '');
    const aside = '<div class="panel facts"><dl>' +
      fact('Body', esc(m.body) + (m.cmte ? '<small>' + esc(m.cmte) + '</small>' : '')) +
      (m.sponsors ? fact('Sponsors', esc(m.sponsors)) : '') +
      (m.last ? fact('Last action', fmt(m.last.date) + '<small>' + esc(m.last.text) + '</small>') : '') +
      (m.next ? fact('Next', (m.next.date ? fmt(m.next.date) + ' <small>' + esc(m.next.label) + (days(m.next.date) >= 0 ? ' · ' + rel(m.next.date) : '') + '</small>' : esc(m.next.label))) : '') +
      fact('Topics', m.topics.map(t => esc(TOPICS[t])).join(', ')) +
      fact('Owner', esc(o.name) + '<small>' + esc(o.title) + '</small>') +
      '</dl><div class="facts-a"><button class="btn" type="button" data-act="toast" data-msg="' + esc(m.action.toast) + '">' + esc(m.action.label) + '</button>' +
      '<button class="btn-quiet" type="button" data-act="hide-m" data-id="' + m.id + '">Not relevant</button></div></div>' +
      '<section class="panel"><div class="panel-hd"><h2>Coverage</h2><span class="sec-meta">' + press.length + '</span></div>' + pressList(press) + '</section>' +
      '<section class="panel"><div class="panel-hd"><h2>Sources</h2><span class="sec-meta">' + srcs.length + '</span></div><ol class="src-list">' + srcs.map(srcItem).join('') + '</ol></section>';
    return sec(head + '<div class="detail"><div class="d-main">' + main + '</div><aside class="d-side">' + aside + '</aside></div>');
  }
  const fact = (k, v) => '<div class="f"><dt>' + k + '</dt><dd>' + v + '</dd></div>';
  function srcItem(id) {
    const s = D.sources[id];
    if (!s) return '';
    return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.title || s.label) + '</a><small>' + esc(s.pub) + (s.date ? ' · ' + fmt(s.date) : '') + '</small></li>';
  }
  function viewHearing(id) {
    const h = D.hearings.find(x => x.id === id);
    if (!h) return notFound();
    const up = days(h.date) >= 0;
    const texts = h.notes.concat(h.rec || []);
    const srcs = [...new Set((h.sources || []).concat(srcIds(texts)))];
    const head = '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/legislative/' + h.level + '">Legislative</a><span aria-hidden="true">/</span><span>Hearings</span></nav>' +
      '<header class="d-hd"><div class="d-id"><span class="id">' + fmt(h.date) + (h.time ? ' · ' + esc(h.time) : '') + '</span><span>' + esc(h.body) + '</span></div>' +
      '<h1>' + esc(h.title) + '</h1><div class="pillrow"><span class="pill ' + (up ? 'st-cmte' : 'st-study') + '">' + esc(up ? h.kind + ' · ' + rel(h.date) : h.kind + ' · held') + '</span></div></header>';
    const main = '<section class="memo-lite"><div class="memo-hd"><span class="lbl">' + (up ? 'What to watch' : 'What happened and why it matters') + '</span><span class="lbl">Locke</span></div>' +
      '<div class="prose sm">' + h.notes.map(p => '<p>' + rich(p) + '</p>').join('') + '</div>' +
      (h.rec ? '<div class="rec"><div class="lbl">Recommendation</div><p>' + rich(h.rec) + '</p></div>' : '') + sig(h.by) + stamps(h.by, srcCount(texts)) + '</section>' +
      (h.witnesses && h.witnesses.length ? '<section><h2 class="h2s">Witnesses</h2><ul class="plist">' + h.witnesses.map(w => '<li>' + esc(w) + '</li>').join('') + '</ul></section>' : '');
    const aside = '<div class="panel facts"><dl>' + fact('When', fmt(h.date) + (h.time ? '<small>' + esc(h.time) + '</small>' : '')) +
      fact('Body', esc(h.body)) + fact('Type', esc(h.kind)) +
      (h.rel && h.rel.length ? fact('Related', h.rel.map(x => { const m = mById(x); return m ? '<a class="cite" href="#/m/' + m.id + '">' + esc(m.ident) + '</a>' : ''; }).join(' ')) : '') +
      '</dl></div><section class="panel"><div class="panel-hd"><h2>Sources</h2><span class="sec-meta">' + srcs.length + '</span></div><ol class="src-list">' + srcs.map(srcItem).join('') + '</ol></section>';
    return sec(head + '<div class="detail"><div class="d-main">' + main + '</div><aside class="d-side">' + aside + '</aside></div>');
  }

  /* ---------- the Locke side ---------- */
  const cById = id => D.clients.find(c => c.id === id);
  const cName = id => (cById(id) || {}).name || id;
  const tierTag = c => '<span class="tier' + (c.tier === 'platform' ? ' platform' : '') + '">' + (c.tier === 'platform' ? 'Platform access' : 'Slack only') + '</span>';
  const healthDot = h => '<span class="cl-dot ' + (h === 'good' ? '' : h) + '" aria-hidden="true"></span>';
  function triageRow(t) {
    const href = t.ref ? refHref(t.ref) : '#/client/' + t.client;
    return '<div class="lg-row" data-href="' + href + '"><span class="stripe s-' + t.sev + '" aria-hidden="true"></span>' +
      '<span class="lg-k">' + esc(cName(t.client)) + '</span>' +
      '<div class="lg-b"><div class="lg-t"><a href="' + href + '">' + esc(t.title) + '</a></div><p>' + rich(t.why) + '</p></div>' +
      '<span class="lg-d">' + fmt(t.due, true) + '</span>' +
      '<div class="lg-a" style="display:flex;gap:7px;align-items:center;padding-top:9px">' + sevPill(t.sev) + av(t.owner) + '</div></div>';
  }
  function clientCard(c) {
    return '<a class="cl-card" href="#/client/' + c.id + '">' +
      '<span class="cl-top"><span class="cl-name">' + healthDot(c.health) + ' ' + esc(c.name) + '</span>' + tierTag(c) + '</span>' +
      '<span class="cl-sector">' + esc(c.sector) + ' · ' + esc(c.stage) + '</span>' +
      '<span class="cl-stats"><span><b>' + c.live + '</b> tracked</span><span><b>' + c.openActions + '</b> open</span>' +
      '<span>Next <b>' + fmt(c.next.date, true) + '</b></span></span>' +
      '<span class="cl-note">' + esc(c.note) + '</span></a>';
  }
  function impactBlock(im, compact) {
    const rows = im.rows.slice().sort((a, b) => b.exposure - a.exposure);
    return '<section style="margin-bottom:' + (compact ? '20px' : '0') + '">' +
      '<div class="imp-hd"><h3 style="font-size:15px">' + (compact ? '<a href="#/impact/' + im.id + '" style="text-decoration:none">' + esc(im.title) + '</a>' : esc(im.title)) + '</h3>' +
      '<span class="sec-meta">' + esc(im.ident) + ' · ' + esc(im.dateLabel) + ' ' + fmt(im.date, true) + ' · ' + rel(im.date) + '</span></div>' +
      '<p class="imp-sum">' + esc(im.summary) + '</p>' +
      (im.conflict ? '<div class="conflict"><div class="lbl">Position conflict</div>' + esc(im.conflictNote) + '</div>' : '') +
      '<div class="tbl-wrap"><table class="tbl" style="min-width:640px"><thead><tr><th scope="col">Client</th><th scope="col">Exposure</th><th scope="col">Position</th><th scope="col">What it does to them</th></tr></thead><tbody>' +
      rows.map(r => '<tr' + (r.client === 'loomwork' ? ' class="row" data-href="#/client/loomwork"' : '') + '><td class="c-j">' + esc(cName(r.client)) + '</td>' +
        '<td>' + exp(r.exposure) + '</td><td><span class="pos">' + esc(r.position) + '</span></td><td>' + esc(r.line) + '</td></tr>').join('') +
      '</tbody></table></div></section>';
  }
  function viewPortfolio() {
    const me = D.people[D.locke.user];
    const open = D.triage.filter(t => t.sev === 'act').length;
    const next = D.triage.slice().sort((a, b) => a.due.localeCompare(b.due))[0];
    const head = '<div class="pg-hd"><div><div class="eyebrow">' + esc(D.locke.firm) + ' · ' + dow(D.today, true) + ' ' + fmt(D.today) + '</div>' +
      '<h1>Good morning, ' + esc(me.first) + '.</h1>' +
      '<p class="sub">Five accounts, one policy person. This page exists to answer one question before the day starts: who needs you first.</p></div>' +
      '<div class="hd-facts"><span><b>' + D.clients.length + '</b> clients</span><span><b>' + open + '</b> need you today</span>' +
      '<span>Next <b>' + fmt(next.due, true) + '</b></span></div></div>';
    const triage = '<div class="sec-hd" style="margin-top:18px"><h2>Today, across the book</h2><span class="sec-meta">Sorted by what closes first</span></div>' +
      '<div class="ledger">' + D.triage.slice().sort((a, b) => a.due.localeCompare(b.due)).map(triageRow).join('') + '</div>';
    const cards = '<div class="sec-hd"><h2>The book</h2><span class="sec-meta">' + D.clients.filter(c => c.tier === 'platform').length + ' with platform access</span></div>' +
      '<div class="cl-grid">' + D.clients.map(clientCard).join('') + '</div>';
    const imp = '<div class="sec-hd"><h2>One event, many clients</h2><span class="sec-meta"><a href="#/impacts">All ' + D.impacts.length + '</a></span></div>' +
      impactBlock(D.impacts[1], true);
    return sec(head + triage) + sec(cards, 'tight') + sec(imp, 'tight');
  }
  function viewImpacts() {
    const head = '<div class="pg-hd"><div><div class="eyebrow">Firm · Impact</div><h1>One event, many clients</h1>' +
      '<p class="sub">The same federal action lands differently on each account. This is the view a Slack channel cannot give a firm, and the reason Locke staff need a platform of their own.</p></div></div>';
    return sec(head + '<div style="margin-top:18px">' + D.impacts.map(im => impactBlock(im, true)).join('') + '</div>');
  }
  function viewImpact(id) {
    const im = D.impacts.find(x => x.id === id);
    if (!im) return notFound();
    const href = im.ref ? refHref(im.ref) : null;
    const head = '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/impacts">Impact</a><span aria-hidden="true">/</span><span>' + esc(im.ident) + '</span></nav>';
    return sec(head + impactBlock(im, false) +
      (href ? '<div class="actions" style="margin-top:16px"><a class="btn-quiet" href="' + href + '">Open the docket</a>' +
        '<button class="btn" type="button" data-act="toast" data-msg="Drafted. Each client gets a different card, because the same order does different things to them.">Draft a card for every affected client</button></div>' : ''));
  }
  function viewClient(id) {
    const c = cById(id);
    if (!c) return notFound();
    const r = c.relationship, d = c.delivery, m = c.commercial;
    const hits = D.impacts.filter(im => im.rows.some(x => x.client === c.id && x.exposure > 0));
    const head = '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/portfolio">Portfolio</a><span aria-hidden="true">/</span><span>' + esc(c.sector) + '</span></nav>' +
      '<header class="d-hd"><div class="d-id"><span class="id">' + esc(c.stage) + '</span><span>' + esc(c.hq) + '</span></div>' +
      '<h1>' + healthDot(c.health) + ' ' + esc(c.name) + '</h1><div class="pillrow">' + tierTag(c) +
      '<span class="pos">' + c.live + ' tracked</span><span class="pos">' + c.openActions + ' open</span>' +
      '<span class="bi-when">Next · ' + esc(c.next.label) + ' · ' + fmt(c.next.date, true) + '</span></div></header>';
    const main = '<section class="memo-lite"><div class="memo-hd"><span class="lbl">Their agenda</span><span class="lbl">Owner ' + esc(D.people[c.owner || 'kevin'].short) + '</span></div>' +
      '<div class="prose sm"><p>' + esc(c.agenda) + '</p></div>' +
      '<div class="rec"><div class="lbl">Account read</div><p>' + esc(c.note) + '</p></div></section>' +
      '<section><h2 class="h2s">Relationship</h2><div class="panel facts"><dl>' +
      fact('Last contact', fmt(r.lastContact) + '<small>' + rel(r.lastContact) + '</small>') +
      fact('Cadence', esc(r.cadence)) + fact('Engages', esc(r.engaged)) +
      fact('Ignores', esc(r.ignored)) + fact('Asked for', esc(r.asked)) + '</dl></div></section>' +
      '<section><h2 class="h2s">What Locke has delivered</h2><div class="panel facts"><dl>' +
      fact('Alerts', d.alerts + ' pushed') + fact('Briefs', d.briefs + ' sent') + fact('Filings', d.filings + ' in public records') +
      fact('Last brief', esc(d.lastBrief.title) + '<small>' + fmt(d.lastBrief.date) + '</small>') + '</dl></div></section>' +
      (hits.length ? '<section><h2 class="h2s">Live events that reach them</h2><div class="panel">' +
        hits.map(im => { const row = im.rows.find(x => x.client === c.id); return '<div class="reqrow"><span class="pill st-cmte">' + fmt(im.date, true) + '</span><div><div class="lg-t"><a href="#/impact/' + im.id + '">' + esc(im.title) + '</a></div><p>' + esc(row.line) + '</p></div></div>'; }).join('') +
        '</div></section>' : '');
    const seats = c.seats.length
      ? c.seats.map(s => '<div class="reqrow"><span class="pill st-intro">Seat</span><div><div class="lg-t">' + esc(s.name) + '</div><p>' + esc(s.role) + ' · last in ' + fmt(s.last, true) + '</p></div></div>').join('')
      : '<p class="empty-s">No seats. This client gets Slack and the weekly brief, which is the right shape for a team with no one running government affairs.</p>';
    const aside = '<div class="panel facts"><dl>' +
      fact('Client since', fmt(c.since)) + fact('Retainer', esc(m.retainer)) + fact('Term', esc(m.term)) +
      fact('Renewal', fmt(m.renewal) + '<small>' + rel(m.renewal) + '</small>') + fact('Effort', esc(m.effort)) +
      '</dl><div class="facts-a">' +
      '<button class="btn" type="button" data-act="mode" data-mode="client" data-client="' + c.id + '">' +
      (c.tier === 'platform' ? 'Open their workspace' : 'See their one page') + '</button>' +
      '<button class="btn-quiet" type="button" data-act="toast" data-msg="Draft requested. It goes to ' + esc(c.name) + ' after your review.">Push an alert</button></div></div>' +
      '<section class="panel"><div class="panel-hd"><h2>Seats</h2><span class="sec-meta">' + c.seats.length + '</span></div>' + seats + '</section>';
    return sec(head + '<div class="detail"><div class="d-main">' + main + '</div><aside class="d-side">' + aside + '</aside></div>');
  }

  /* ---------- client view: what's moving, and the one-page digest ---------- */
  function movingRows() {
    const M = state.mv;
    const norm = [];
    D.measures.filter(visibleM).forEach(m => norm.push({
      kind: m.level === 'federal' ? 'Bill' : 'State bill', type: 'bill', href: '#/m/' + m.id,
      ident: m.ident, title: m.title, short: m.short, where: m.level === 'state' ? STN[m.st] : m.body,
      pill: stagePill(m), next: m.next, exposure: m.exposure, position: m.position, owner: m.owner
    }));
    D.reg.filter(r => !state.muted.has(r.st || 'US') && topicOn(r.topics)).forEach(r => norm.push({
      kind: 'Docket', type: 'docket', href: '#/r/' + r.id,
      ident: r.ident, title: r.title, short: r.short, where: r.body,
      pill: regPill(r), next: r.next, exposure: r.exposure, position: r.position, owner: r.owner
    }));
    let list = norm;
    if (M.kind !== 'all') list = list.filter(x => x.type === M.kind);
    if (M.exp !== 'all') list = list.filter(x => String(x.exposure) === M.exp);
    if (M.q.trim()) {
      const q = M.q.trim().toLowerCase();
      list = list.filter(x => [x.ident, x.title, x.short, x.where].join(' ').toLowerCase().includes(q));
    }
    const nk = x => (x.next && x.next.date && days(x.next.date) >= 0) ? x.next.date : '9999-12-31';
    return list.sort((a, b) => nk(a).localeCompare(nk(b)) || b.exposure - a.exposure);
  }
  function movingResults() {
    const list = movingRows(), total = D.measures.filter(visibleM).length + D.reg.length;
    if (!list.length) return '<div class="empty">Nothing matches. <button class="link" type="button" data-act="mv-reset">Clear filters</button></div>';
    return '<div class="res-hd" aria-live="polite"><span>' + list.length + ' of ' + total + ' items</span><span>J and K to move, Enter to open</span></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">What</th><th scope="col">Type</th><th scope="col">Stage</th><th scope="col">Where</th><th scope="col">Next</th><th scope="col">Exposure</th><th scope="col">Position</th></tr></thead><tbody>' +
      list.map(x => '<tr class="row" data-href="' + x.href + '">' +
        '<td class="c-m"><a class="mt" href="' + x.href + '">' + esc(x.title) + '</a><div class="c-sub"><span class="id">' + esc(x.ident) + '</span><span>' + esc(x.short) + '</span></div></td>' +
        '<td class="c-j">' + esc(x.kind) + '</td><td>' + x.pill + '</td><td class="c-j">' + esc(x.where) + '</td>' +
        '<td class="num">' + nextCell(x) + '</td><td>' + exp(x.exposure) + '</td><td><span class="pos">' + esc(x.position) + '</span></td></tr>').join('') +
      '</tbody></table></div>';
  }
  function viewMoving() {
    const M = state.mv;
    const all = movingRows();
    const soon = all.filter(x => x.next && x.next.date && days(x.next.date) >= 0 && days(x.next.date) <= 30).length;
    const opt = (v, l, cur) => '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' + esc(l) + '</option>';
    const head = '<div class="pg-hd"><div><div class="eyebrow">Your week</div><h1>What’s moving</h1>' +
      '<p class="sub">Bills and agency dockets in one list, because the distinction matters to Locke and not to you. Sorted by what closes first.</p></div></div>';
    const strip = '<div class="strip">' +
      stat('Tracked', all.length, 'Bills and dockets') +
      stat('Dates in 30 days', soon, 'Something closes') +
      stat('High exposure', all.filter(x => x.exposure === 3).length, 'Direct effect on you') +
      stat('Dockets', all.filter(x => x.type === 'docket').length, 'Where the rules get written') + '</div>';
    const filters = '<div class="filters" role="search">' +
      '<label class="sr" for="mv-q">Filter</label><input class="fld" id="mv-q" type="search" placeholder="Filter by number, title or body" value="' + esc(M.q) + '">' +
      '<label class="sr" for="mv-kind">Type</label><select class="fld" id="mv-kind">' + opt('all', 'Bills and dockets', M.kind) + opt('bill', 'Bills only', M.kind) + opt('docket', 'Dockets only', M.kind) + '</select>' +
      '<label class="sr" for="mv-exp">Exposure</label><select class="fld" id="mv-exp">' + opt('all', 'Any exposure', M.exp) + [3, 2, 1, 0].map(n => opt(String(n), EXP[n] + ' exposure', M.exp)).join('') + '</select>' +
      '</div><div id="mv-results">' + movingResults() + '</div>';
    return sec(head + strip + filters);
  }
  function bindMoving() {
    const q = $('mv-q');
    if (q) q.addEventListener('input', e => { state.mv.q = e.target.value; refresh('mv-results', movingResults); });
    [['mv-kind', 'kind'], ['mv-exp', 'exp']].forEach(([id, k]) => {
      const el = $(id);
      if (el) el.addEventListener('change', e => { state.mv[k] = e.target.value; refresh('mv-results', movingResults); });
    });
  }
  function viewDigest() {
    const c = curClient();
    const mine = D.triage.filter(t => t.client === c.id).sort((a, b) => a.due.localeCompare(b.due));
    const hits = D.impacts.filter(im => im.rows.some(x => x.client === c.id && x.exposure > 0));
    const d = c.delivery;
    const head = '<div class="pg-hd"><div><div class="eyebrow">' + dow(D.today, true) + ' ' + fmt(D.today) + ' · From Locke</div>' +
      '<h1>' + esc(c.name) + '</h1>' +
      '<p class="sub">This is the whole product for a company with nobody running government affairs. One page, the same things Locke pushes to Slack, and a person who owns each one.</p></div>' +
      '<div class="hd-facts"><span><b>' + mine.filter(t => t.sev === 'act').length + '</b> need a decision</span><span><b>' + c.live + '</b> tracked for you</span></div></div>';
    const decisions = '<div class="sec-hd" style="margin-top:18px"><h2>Needs a decision</h2><span class="sec-meta">Sorted by what closes first</span></div>' +
      (mine.length ? mine.map(t => '<div class="bitem"><span class="stripe s-' + t.sev + '" aria-hidden="true"></span><div class="bi-b">' +
        '<div class="bi-hd">' + sevPill(t.sev) + '<span class="bi-when">' + fmt(t.due, true) + ' · ' + rel(t.due) + '</span></div>' +
        '<h3 class="bi-t">' + esc(t.title) + '</h3><p>' + rich(t.why) + '</p>' +
        '<div class="bi-a"><button class="btn sm" type="button" data-act="toast" data-msg="Replied to Locke. ' + esc(D.people[t.owner].short) + ' picks it up today.">Reply to Locke</button>' +
        '<button class="btn-quiet sm" type="button" data-act="toast" data-msg="Cleared. Locke stops surfacing items like this.">Not relevant</button></div>' +
        '</div></div>').join('') : '<p class="empty-s">Nothing needs you today.</p>');
    const coming = hits.length ? '<div class="sec-hd" style="margin-top:26px"><h2>What’s coming</h2><span class="sec-meta">Events that reach you</span></div>' +
      '<div class="panel"><ol class="cal">' + hits.map(im => {
        const row = im.rows.find(x => x.client === c.id);
        return '<li class="cal-i">' + dateBlock(im.date) + '<div class="cal-b"><span class="cal-t">' + esc(im.title) + '</span>' +
          '<p style="margin:3px 0 0;font-size:12.5px;color:var(--fg-mute)">' + esc(row.line) + '</p></div>' + exp(row.exposure) + '</li>';
      }).join('') + '</ol></div>' : '';
    const did = '<div class="sec-hd" style="margin-top:26px"><h2>What Locke has done</h2><span class="sec-meta">Since ' + fmt(c.since) + '</span></div>' +
      '<div class="panel facts"><dl>' + fact('Alerts', d.alerts + ' pushed to Slack') + fact('Briefs', d.briefs + ' sent') +
      fact('Filings', d.filings + ' in public records') + fact('Last brief', esc(d.lastBrief.title) + '<small>' + fmt(d.lastBrief.date) + '</small>') +
      fact('Your contact', esc(D.people[c.owner || 'kevin'].name)) + '</dl></div>';
    return sec(head + decisions + coming + did);
  }

  /* ---------- stakeholders ---------- */
  const TIERS = ['Agencies', 'Congress', 'States', 'Grid operators', 'Coalitions'];
  const ORGA = { watt: 'WATT', aeu: 'AEU', gridwise: 'GridWise', dcc: 'DCC' };
  const everyone = () => D.stakeholders.concat(D.orgs);
  const pById = id => everyone().find(p => p.id === id);
  const sKey = s => ({ Aligned: 'aligned', Opposed: 'opposed', Mixed: 'mixed' }[s] || 'none');
  const dotLabel = p => ORGA[p.id] || p.name.split(' ').pop();
  function grid2() {
    return '<div class="g2-wrap"><div class="g2-y">Influence over this agenda</div><div class="g2">' +
      '<span class="g2-q" style="left:0;top:0">Powerful, not with us</span>' +
      '<span class="g2-q" style="right:0;top:0">Powerful and aligned</span>' +
      '<span class="g2-q" style="left:0;bottom:0">Low influence, opposed</span>' +
      '<span class="g2-q" style="right:0;bottom:0">Low influence, aligned</span>' +
      everyone().map(p => '<button class="g2-dot' + (p.al > 70 ? ' r' : '') + '" type="button" data-act="person" data-id="' + p.id + '" data-s="' + sKey(p.stance) +
        '" style="left:' + p.al + '%;top:' + (100 - p.inf) + '%" title="' + esc(p.name + ' · ' + p.stance) + '"><i></i><span>' + esc(dotLabel(p)) + '</span></button>').join('') +
      '</div><div class="g2-x"><span>Opposed</span><span>Aligned with Loomwork</span></div></div>';
  }
  function pcards() {
    return '<div class="pcols">' + TIERS.map(t => {
      const list = everyone().filter(p => p.tier === t);
      if (!list.length) return '';
      return '<div class="pcol"><h3>' + t + ' <span style="color:var(--fg-faint)">' + list.length + '</span></h3>' +
        list.map(p => '<button class="pcard" type="button" data-act="person" data-id="' + p.id + '"><b>' + esc(p.name) + '</b><small>' + esc(p.role || p.member) + '</small>' + stance(p.stance) + '</button>').join('') + '</div>';
    }).join('') + '</div>';
  }
  function viewStake() {
    const al = everyone().filter(p => p.stance === 'Aligned').length;
    const hi = everyone().filter(p => p.inf >= 80).length;
    const head = '<div class="pg-hd"><div><div class="eyebrow">Lobbying · Stakeholders</div><h1>Who decides this</h1>' +
      '<p class="sub">Everyone with a hand in how large loads get studied, placed by influence and by alignment with Loomwork’s agenda. Stance is cited to the public record. Where there is no record, it says so.</p></div>' +
      '<a class="btn-quiet" href="#/advocacy">Campaigns</a></div>';
    const strip = '<div class="strip">' + stat('Tracked', everyone().length, 'People and organizations') +
      stat('Aligned', al, 'On the record with us') +
      stat('Decisive', hi, 'Influence 80 or above') +
      stat('No position', everyone().filter(p => p.stance === 'No public position').length, 'Nothing citable yet') + '</div>';
    const note = '<div class="note-box" style="margin-top:16px">Locke logs contact at staff and organization level only. Meetings with principals appear as planned asks until they happen.</div>';
    return sec(head + strip + '<div style="margin-top:18px">' + grid2() + '</div>' + note) +
      sec('<div class="sec-hd"><h2>By tier</h2><span class="sec-meta">Click anyone for the ask and the route</span></div>' + pcards(), 'tight');
  }
  function viewPerson(id) {
    const p = pById(id);
    if (!p) return notFound();
    const texts = [p.note, p.ask || '', p.route || ''];
    const srcs = srcIds(texts);
    const head = '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/stakeholders">Stakeholders</a><span aria-hidden="true">/</span><span>' + esc(p.tier) + '</span></nav>' +
      '<header class="d-hd"><div class="d-id"><span class="id">' + esc(p.role || p.member) + '</span></div><h1>' + esc(p.name) + '</h1>' +
      '<div class="pillrow">' + stance(p.stance) + '<span class="pos">Influence ' + p.inf + '</span><span class="pos">Alignment ' + p.al + '</span></div></header>';
    const main = '<section class="memo-lite"><div class="memo-hd"><span class="lbl">Where they stand</span><span class="lbl">Public record</span></div>' +
      '<div class="prose sm"><p>' + rich(p.note) + '</p></div>' +
      (p.ask ? '<div class="rec"><div class="lbl">Our ask</div><p>' + rich(p.ask) + '</p></div>' : '') + '</section>' +
      (p.log && p.log.length ? '<section><h2 class="h2s">Contact log</h2><div class="panel">' +
        p.log.map(l => '<div class="reqrow"><span class="pill st-intro">' + fmt(l.date, true) + '</span><div><p style="margin:0">' + rich(l.text) + '</p></div></div>').join('') + '</div></section>'
        : '<section><h2 class="h2s">Contact log</h2><div class="panel"><p class="empty-s">No contact yet. Locke logs staff and organization contact here once it happens.</p></div></section>');
    const aside = '<div class="panel facts"><dl>' + fact('Tier', esc(p.tier)) +
      (p.route ? fact('Route in', rich(p.route)) : '') + (p.member ? fact('Membership', esc(p.member)) : '') +
      fact('Stance', esc(p.stance)) + '</dl>' +
      '<div class="facts-a"><button class="btn" type="button" data-act="toast" data-msg="Prep memo requested. Kevin builds it from the public record and sends it before any meeting.">Prep me for a meeting</button></div></div>' +
      (srcs.length ? '<section class="panel"><div class="panel-hd"><h2>Sources</h2><span class="sec-meta">' + srcs.length + '</span></div><ol class="src-list">' + srcs.map(srcItem).join('') + '</ol></section>' : '');
    return sec(head + '<div class="detail"><div class="d-main">' + main + '</div><aside class="d-side">' + aside + '</aside></div>');
  }

  /* ---------- advocacy ---------- */
  function viewAdvocacy() {
    const head = '<div class="pg-hd"><div><div class="eyebrow">Lobbying · Advocacy</div><h1>Campaigns</h1>' +
      '<p class="sub">Three things Locke is trying to change this year, each with a target, an asset list and a next date. Everything else is monitoring.</p></div>' +
      '<a class="btn-quiet" href="#/stakeholders">Stakeholders</a></div>';
    const cards = '<div class="cols" style="margin-top:18px">' + D.campaigns.map(c =>
      '<article class="camp"><div class="bi-hd">' + sevPill(c.sev) + '<span class="bi-when">' + esc(c.next.label) + ' · ' + fmt(c.next.date, true) + ' · ' + rel(c.next.date) + '</span></div>' +
      '<h3>' + esc(c.title) + '</h3><p class="goal">' + esc(c.goal) + '</p>' +
      '<div class="prog" aria-label="Step ' + (c.at + 1) + ' of ' + c.steps.length + '">' + c.steps.map((s, i) => '<i class="' + (i <= c.at ? 'on' : '') + '" title="' + esc(s) + '"></i>').join('') + '</div>' +
      '<div class="meta">' + esc(c.steps[c.at]) + ' · step ' + (c.at + 1) + ' of ' + c.steps.length + '</div>' +
      '<dl><dt>Targets</dt><dd>' + c.targets.map(esc).join(', ') + '</dd><dt>Assets</dt><dd>' + c.assets.map(esc).join(', ') + '</dd><dt>Owner</dt><dd>' + esc(D.people[c.owner].name) + '</dd></dl>' +
      '<p class="goal">' + rich(c.note) + '</p></article>').join('') + '</div>';
    return sec(head + cards);
  }

  /* ---------- disclosures ---------- */
  function viewDisc() {
    const d = D.disclosures;
    const head = '<div class="pg-hd"><div><div class="eyebrow">Lobbying · Disclosures</div><h1>Filings</h1>' +
      '<p class="sub">Locke is the registered lobbyist for Loomwork, so the filing obligations sit here. Competitor activity is shown only where a filing exists.</p></div></div>';
    const rows = '<div class="ledger" style="margin-top:18px">' + d.filings.map(f =>
      '<div class="lg-row"><span class="stripe s-' + (f.status === 'due' ? 'watch' : f.status === 'met' ? 'locke' : 'fyi') + '" aria-hidden="true"></span>' +
      '<span class="lg-k">' + esc(f.form) + ' · ' + esc(f.period) + '</span>' +
      '<div class="lg-b"><div class="lg-t">' + esc(f.issues[0]) + (f.issues.length > 1 ? ' and ' + (f.issues.length - 1) + ' more' : '') + '</div><p>' + rich(f.note) + '</p></div>' +
      '<span class="lg-d">' + fmt(f.due, true) + '</span>' +
      '<div class="lg-a" style="padding-top:9px">' + tag(OB, f.status) + '</div></div>').join('') + '</div>';
    const comp = '<div class="sec-hd" style="margin-top:26px"><h2>Competitor activity</h2><span class="sec-meta">Real filings only</span></div>' +
      '<div class="note-box">' + rich(d.competitors) + '</div>';
    return sec(head + '<div class="lbl">Registrant: ' + esc(d.registrant) + '</div>' + rows + comp);
  }

  /* ---------- briefs ---------- */
  function viewBriefs() {
    const head = '<div class="pg-hd"><div><div class="eyebrow">Work · Briefs</div><h1>Everything Locke has written</h1>' +
      '<p class="sub">Each brief carries its author, its reviewer and its source count. One is blocked from export, which is the point of the stamp.</p></div></div>';
    const list = '<div class="ledger" style="margin-top:18px">' + D.briefs.slice().sort((a, b) => b.date.localeCompare(a.date)).map(b => {
      const href = b.ref ? (b.ref.type === 'page' ? b.ref.href : refHref(b.ref)) : null;
      const blocked = b.unverified > 0;
      return '<div class="lg-row"' + (href ? ' data-href="' + href + '"' : '') + '><span class="stripe s-' + (blocked ? 'act' : b.status === 'Draft' ? 'fyi' : 'locke') + '" aria-hidden="true"></span>' +
        '<span class="lg-k">' + esc(b.status) + '</span>' +
        '<div class="lg-b"><div class="lg-t">' + (href ? '<a href="' + href + '">' + esc(b.title) + '</a>' : esc(b.title)) + '</div><p>' + rich(b.note) + '</p>' +
        '<div class="stamps" style="margin-top:8px"><span class="prov"><span class="dot"></span>Agent-drafted</span>' +
        '<span class="prov"><span class="dot human"></span>' + esc(D.people[b.author].short) + ', reviewed by ' + esc(D.people[b.reviewer].short) + '</span>' +
        (blocked ? '<span class="prov" style="border-color:var(--act);color:var(--act)">' + b.unverified + ' citations unverified · export blocked</span>'
          : '<span class="prov">' + b.sources + ' sources verified</span>') + '</div></div>' +
        '<span class="lg-d">' + fmt(b.date, true) + '</span>' +
        '<div class="lg-a">' + (blocked ? '<button class="btn-quiet sm" type="button" data-act="toast" data-msg="Export stays blocked until both citations are confirmed against the ERCOT filing. Kevin owns that check.">Why blocked</button>'
          : '<button class="btn-quiet sm" type="button" data-act="toast" data-msg="Sent. The client team sees it in Slack and here.">Send</button>') + '</div></div>';
    }).join('') + '</div>';
    return sec(head + list);
  }

  /* ---------- tasks ---------- */
  const doneSet = () => state.done;
  function taskRow(t) {
    const done = state.done.has(t.id) || (t.done && !state.undone.has(t.id));
    const href = t.ref ? refHref(t.ref) : null;
    const late = !done && t.due && days(t.due) < 0;
    return '<div class="tk-row' + (done ? ' done' : '') + '">' +
      '<input type="checkbox" id="task-' + t.id + '"' + (done ? ' checked' : '') + ' data-act="task" data-id="' + t.id + '" aria-label="' + esc(t.title) + '">' +
      '<label class="t" for="task-' + t.id + '">' + esc(t.title) + '<small>From ' + esc(t.from) + (href ? ' · linked' : '') + '</small></label>' +
      '<span class="tk-due' + (late ? ' late' : '') + '">' + (t.due ? fmt(t.due, true) + ' · ' + rel(t.due) : '') + '</span>' +
      (href ? '<a class="btn-quiet sm" href="' + href + '">Open</a>' : '<span></span>') + '</div>';
  }
  function viewTasks() {
    const mine = D.tasks.filter(t => !(state.done.has(t.id) || (t.done && !state.undone.has(t.id))));
    const done = D.tasks.filter(t => state.done.has(t.id) || (t.done && !state.undone.has(t.id)));
    const head = '<div class="pg-hd"><div><div class="eyebrow">Work · Tasks</div><h1>Who owes what</h1>' +
      '<p class="sub">Both teams in one list. Every task traces back to a bill, a docket or an opportunity, and the dates feed Coming up on Home.</p></div>' +
      '<div class="hd-facts"><span><b>' + mine.length + '</b> open</span><span><b>' + done.length + '</b> done</span></div></div>';
    return sec(head + '<div class="panel" style="margin-top:18px">' + mine.map(taskRow).join('') + '</div>' +
      (done.length ? '<div class="sec-hd" style="margin-top:22px"><h2>Done</h2><span class="sec-meta">' + done.length + '</span></div><div class="panel">' + done.map(taskRow).join('') + '</div>' : ''));
  }

  /* ---------- analytics ---------- */
  function barChart(s, w, h) {
    const max = Math.max.apply(null, s.points.map(p => p.v)) || 1;
    const n = s.points.length, gap = 10, bw = (w - gap * (n - 1)) / n;
    return '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(s.label + ': ' + s.points.map(p => p.k + ' ' + p.v).join(', ')) + '">' +
      s.points.map((p, i) => {
        const bh = Math.max(2, Math.round((p.v / max) * (h - 36)));
        const x = i * (bw + gap), y = h - 22 - bh;
        return '<rect class="ch-bar" x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh + '"></rect>' +
          '<text class="ch-v" x="' + (x + bw / 2) + '" y="' + (y - 5) + '" text-anchor="middle">' + p.v + '</text>' +
          '<text class="ch-t" x="' + (x + bw / 2) + '" y="' + (h - 7) + '" text-anchor="middle">' + esc(p.k) + '</text>';
      }).join('') +
      '<line class="ch-ax" x1="0" y1="' + (h - 21) + '" x2="' + w + '" y2="' + (h - 21) + '"></line></svg>';
  }
  function chartPanel(s) {
    return '<section class="panel"><div class="panel-hd"><h2>' + esc(s.label) + '</h2></div><div style="padding:14px 13px 8px">' + barChart(s, 320, 150) + '</div></section>';
  }
  function viewAnalytics() {
    const a = D.analytics;
    const head = '<div class="pg-hd"><div><div class="eyebrow">Work · Analytics</div><h1>The quarter in four numbers</h1>' +
      '<p class="sub">Enough to answer the questions a board asks, and no chart that exists only because the data was easy to plot.</p></div>' +
      '<a class="btn" href="#/report">Build the Q3 board report</a></div>';
    return sec(head + '<div class="cols" style="margin-top:18px">' + chartPanel(a.tracked) + chartPanel(a.exposure) + chartPanel(a.deadlines) + chartPanel(a.pipeline) + '</div>');
  }
  function viewReport() {
    const r = D.report, s = D.people[r.signer];
    const head = '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/analytics">Analytics</a><span aria-hidden="true">/</span><span>Board report</span></nav>';
    const body = '<article class="report"><div class="rhead"><span class="wm">Locke</span><span class="lbl">Board report · ' + esc(r.period) + ' · Confidential</span></div>' +
      '<p class="lede" style="font-size:16px;color:var(--fg)">' + rich(r.summary) + '</p>' +
      r.sections.map(x => '<h2>' + esc(x.h) + '</h2><ul>' + x.items.map(i => '<li>' + rich(i) + '</li>').join('') + '</ul>').join('') +
      '<div class="sig">' + av(r.signer, 'lg') + '<div><b>' + esc(s.name) + '</b><div class="lbl">' + esc(s.title) + ' · Locke · ' + fmt(r.prepared) + '</div></div></div>' +
      '</article>' +
      '<div class="actions" style="margin-top:16px"><button class="btn" type="button" data-act="print">Print or save as PDF</button>' +
      '<button class="btn-quiet" type="button" data-act="toast" data-msg="Sent to Maya for the 1 October board meeting.">Send to Maya</button></div>';
    return sec(head + body);
  }

  /* ---------- settings ---------- */
  function viewSettings() {
    const s = D.settings;
    const head = '<div class="pg-hd"><div><div class="eyebrow">Settings</div><h1>What Locke watches</h1>' +
      '<p class="sub">These controls are live. Turn off a jurisdiction or a topic and every tracker on the other screens re-filters.</p></div></div>';
    const jur = '<section class="panel"><div class="panel-hd"><h2>Jurisdictions</h2><span class="sec-meta">' + (s.jurisdictions.length - state.muted.size) + ' of ' + s.jurisdictions.length + ' on</span></div>' +
      s.jurisdictions.map(j => '<div class="set-row"><div><b>' + esc(j.label) + '</b><small>' + countFor(j.k) + ' tracked items</small></div>' +
        '<label class="sw"><input type="checkbox"' + (state.muted.has(j.k) ? '' : ' checked') + ' data-act="mute" data-k="' + j.k + '"><i></i>' + (state.muted.has(j.k) ? 'Off' : 'On') + '</label></div>').join('') + '</section>';
    const top = '<section class="panel"><div class="panel-hd"><h2>Topics</h2><span class="sec-meta">' + (s.topics.length - state.topicsOff.size) + ' of ' + s.topics.length + ' on</span></div>' +
      s.topics.map(t => '<div class="set-row"><div><b>' + esc(t.label) + '</b></div>' +
        '<label class="sw"><input type="checkbox"' + (state.topicsOff.has(t.k) ? '' : ' checked') + ' data-act="topic" data-k="' + t.k + '"><i></i>' + (state.topicsOff.has(t.k) ? 'Off' : 'On') + '</label></div>').join('') + '</section>';
    const thr = '<section class="panel"><div class="panel-hd"><h2>Push thresholds</h2><span class="sec-meta">Per role</span></div>' +
      s.thresholds.map(t => '<div class="set-row"><div><b>' + esc(t.role) + '</b><small>' + esc(t.rule) + '</small></div><span class="pos">Locke sets</span></div>').join('') + '</section>';
    const learned = '<section class="panel"><div class="panel-hd"><h2>What Locke has learned</h2><span class="sec-meta">From “Not relevant”</span></div>' +
      s.learned.map(l => '<div class="set-row"><div><b>' + esc(l.text) + '</b></div><span class="tk-due">' + fmt(l.date, true) + '</span></div>').join('') + '</section>';
    const ag = '<section class="panel"><div class="panel-hd"><h2>Agencies monitored</h2><span class="sec-meta">' + s.agencies.length + '</span></div>' +
      '<div style="padding:12px 13px;display:flex;flex-wrap:wrap;gap:6px">' + s.agencies.map(a => '<span class="cite">' + esc(a) + '</span>').join('') + '</div></section>';
    return sec(head + '<div class="cols" style="margin-top:18px">' + jur + top + '</div>') + sec('<div class="cols">' + thr + ag + '</div>', 'tight') + sec(learned, 'tight');
  }
  const countFor = k => D.measures.filter(m => (m.st || 'US') === k).length + D.reg.filter(r => (r.st || 'US') === k).length;

  /* ---------- planned + fallback ---------- */
  function viewPlanned(k) {
    const p = D.planned[k];
    return sec('<div class="pg-hd"><div><div class="eyebrow">' + esc(p.group) + '</div><h1>' + esc(p.title) + '</h1></div></div>' +
      '<div class="panel planned"><div class="lbl">Not built yet</div><p>' + rich(p.blurb) + '</p><ul>' + p.items.map(i => '<li>' + rich(i) + '</li>').join('') + '</ul></div>');
  }
  const notFound = () => sec('<div class="empty">That page does not exist. <a class="link" href="#/home">Go to Home</a></div>');

  /* ---------- router ---------- */
  function route() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [path, qs] = raw.split('?');
    const parts = (path || 'home').split('/');
    const q = {};
    new URLSearchParams(qs || '').forEach((v, k) => { q[k] = v; });
    const key = parts[0] || 'home';
    const nav = { m: 'legislative', h: 'legislative', r: 'regulatory', o: 'contracting', p: 'stakeholders', report: 'analytics', impact: 'impacts' };
    if (key === 'client') return { key, arg: parts[1], q, navKey: 'client-' + parts[1] };
    return { key, arg: parts[1], q, navKey: nav[key] || key };
  }
  function render(keep) {
    const r = route(), y = window.scrollY;
    secN = 0;
    let html;
    if (r.key === 'portfolio') html = viewPortfolio();
    else if (r.key === 'impacts') html = viewImpacts();
    else if (r.key === 'impact') html = viewImpact(r.arg);
    else if (r.key === 'client') html = viewClient(r.arg);
    else if (r.key === 'digest') html = viewDigest();
    else if (r.key === 'moving') html = (curClient().tier === 'platform' ? viewMoving() : viewDigest());
    else if (r.key === 'home') html = (curClient().id === 'loomwork' ? viewHome() : viewDigest());
    else if (r.key === 'legislative') html = viewLeg(r.arg, r.q);
    else if (r.key === 'regulatory') html = viewReg(r.q);
    else if (r.key === 'compliance') html = (state.mode === 'client' && curClient().tier !== 'platform' ? viewDigest() : viewCompliance());
    else if (r.key === 'contracting') html = (state.mode === 'client' && curClient().tier !== 'platform' ? viewDigest() : viewCon());
    else if (r.key === 'm') html = viewMeasure(r.arg);
    else if (r.key === 'h') html = viewHearing(r.arg);
    else if (r.key === 'r') html = viewRule(r.arg);
    else if (r.key === 'o') html = viewOpp(r.arg);
    else if (r.key === 'stakeholders') html = viewStake();
    else if (r.key === 'p') html = viewPerson(r.arg);
    else if (r.key === 'advocacy') html = viewAdvocacy();
    else if (r.key === 'disclosures') html = viewDisc();
    else if (r.key === 'briefs') html = viewBriefs();
    else if (r.key === 'tasks') html = viewTasks();
    else if (r.key === 'analytics') html = viewAnalytics();
    else if (r.key === 'report') html = viewReport();
    else if (r.key === 'queue') html = (state.mode === 'locke' ? viewQueue() : viewDigest());
    else if (r.key === 'signals') html = (state.mode === 'locke' ? viewSignals() : viewDigest());
    else if (r.key === 'settings') html = viewSettings();
    else if (D.planned[r.key]) html = viewPlanned(r.key);
    else html = notFound();
    view.innerHTML = html;
    markNav(r.navKey);
    state.cur = -1;
    if (r.key === 'moving') bindMoving();
    if (r.key === 'legislative') bindLeg();
    if (r.key === 'regulatory') bindReg();
    if (r.key === 'contracting') bindCon();
    if (r.key === 'signals') bindSignals();
    window.scrollTo(0, keep ? y : 0);
  }

  /* ---------- keyboard ---------- */
  const rows = () => [...view.querySelectorAll('tr.row[data-href], .lg-row[data-href], .bitem[data-href]')];
  function moveRow(d) {
    const list = rows();
    if (!list.length) return;
    list.forEach(r => r.classList.remove('cur'));
    state.cur = Math.max(0, Math.min(list.length - 1, state.cur + d));
    const el = list[state.cur];
    el.classList.add('cur');
    el.scrollIntoView({ block: 'nearest' });
  }
  function openRow() {
    const list = rows();
    if (state.cur >= 0 && list[state.cur]) location.hash = list[state.cur].dataset.href;
  }
  const GOTO = { h: 'home', m: 'moving', l: 'legislative', r: 'regulatory', o: 'compliance', c: 'contracting', s: 'stakeholders', b: 'briefs', t: 'tasks', a: 'analytics', p: 'portfolio', i: 'impacts', d: 'digest', q: 'queue', n: 'signals' };

  /* ---------- layers ---------- */
  function showLayer(el) { state.lastFocus = document.activeElement; scrim.hidden = false; el.hidden = false; }
  function closeLayers() {
    const was = !pal.hidden || !drawer.hidden || side.classList.contains('open');
    pal.hidden = true; drawer.hidden = true; scrim.hidden = true;
    side.classList.remove('open');
    toggleRole(false);
    if (was && state.lastFocus && document.contains(state.lastFocus)) state.lastFocus.focus({ preventScroll: true });
    state.lastFocus = null;
  }
  function toggleRole(open) {
    const m = $('role-menu'), b = $('role-btn');
    if (!m || !b) return;
    const o = open === undefined ? m.hidden : open;
    m.hidden = !o;
    b.setAttribute('aria-expanded', String(o));
  }
  let tt;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(tt);
    tt = setTimeout(() => toastEl.classList.remove('on'), 3600);
  }

  /* ---------- intelligence vocabulary ---------- */
  /* How we know it, how much it carries, and who is allowed to hear it.
     The third one is the field that keeps a firm out of trouble. */
  const SGK = { heard: ['Heard', 'sgk-heard'], reported: ['Reported', 'sgk-reported'], observed: ['Observed', 'sgk-observed'], confirmed: ['Confirmed', 'sgk-confirmed'] };
  const SGC = { low: 'Low', med: 'Medium', high: 'High' };
  const SGH = {
    internal: ['Internal only', 'Stays inside Locke. Not repeatable to the client.'],
    client: ['Client-releasable', 'May go into a client deliverable, with the sourcing attached.'],
    public: ['Attributable', 'Verified against the record. May be cited publicly.']
  };
  const QK = { alert: ['Alert', 'st-intro'], brief: ['Brief', 'st-cmte'], memo: ['Memo', 'st-rept'], answer: ['Answer', 'st-draft'] };
  const QFLAG = {
    'unverified-citation': ['Unverified claim', 'A load-bearing sentence has no source behind it. Sending is blocked until a human sources or cuts it.', true],
    'single-source': ['Single source', 'One observation, no corroboration. Fine to send if the note says so.', false],
    'position-conflict': ['Position conflict', 'Two clients sit on opposite sides of this docket. Check the impact page before sending.', false]
  };
  const entHref = e => '#/' + e.t + '/' + e.id;
  function entLabel(e) {
    const o = e.t === 'm' ? mById(e.id) : e.t === 'r' ? rById(e.id) : oById(e.id);
    return o ? (o.ident || o.title) : e.id;
  }
  const qStatus = q => state.qs[q.id] || q.status;

  /* ---------- review queue ---------- */
  /* Nothing here has left the building. An agent-drafted alert that goes
     out unreviewed is how a firm loses an account, so the human stays in
     the path and the provenance stamp records that they were. */
  function slackBlock(q) {
    const c = cById(q.client);
    return '<div class="slack"><div class="slack-hd"><span class="slack-av">L</span><b>Locke</b><span class="slack-app">APP</span>' +
      '<span class="slack-ts">' + esc(q.sched ? 'scheduled ' + q.sched.slice(11) : q.drafted.slice(11)) + '</span></div>' +
      '<div class="slack-body">' + q.body.split('\n\n').map(pp => '<p>' + rich(pp) + '</p>').join('') + '</div>' +
      '<div class="slack-ft"><span class="id">' + esc(q.channel) + '</span><span>' + esc(q.audience) + '</span>' +
      (c ? '<span>' + esc(c.tier === 'platform' ? 'also lands in their workspace' : 'Slack only, no workspace') + '</span>' : '') + '</div></div>';
  }
  function queueCard(q) {
    const st = qStatus(q), c = cById(q.client);
    const blocked = (q.flags || []).some(f => QFLAG[f] && QFLAG[f][2]);
    const acts = st === 'pending' || st === 'scheduled'
      ? '<button class="btn" type="button" data-act="qok" data-id="' + q.id + '"' + (blocked ? ' disabled title="Blocked by an unverified claim"' : '') + '>' + (st === 'scheduled' ? 'Send now' : 'Approve and send') + '</button>' +
        (st === 'scheduled' ? '' : '<button class="btn-quiet" type="button" data-act="qsched" data-id="' + q.id + '"' + (blocked ? ' disabled' : '') + '>Schedule</button>') +
        '<button class="btn-quiet" type="button" data-act="qedit" data-id="' + q.id + '">Edit</button>' +
        '<button class="btn-quiet" type="button" data-act="qkill" data-id="' + q.id + '">Kill</button>'
      : '<span class="qc-done">' + (st === 'approved' ? 'Sent by ' + D.people[D.locke.user].short : 'Killed. The agent logs why and stops proposing this shape.') + '</span>' +
        '<button class="btn-quiet" type="button" data-act="qback" data-id="' + q.id + '">Undo</button>';
    return '<article class="qc" data-st="' + st + '">' +
      '<div class="qc-hd">' + tag(QK, q.kind) +
      '<a class="qc-cl" href="#/client/' + esc(q.client) + '">' + esc(c ? c.name : q.client) + '</a>' +
      '<span class="qc-meta">' + esc(q.agent) + '-drafted ' + esc(q.drafted.slice(11)) + '</span>' +
      '<span class="qc-conf" data-c="' + (q.conf >= 0.8 ? 'high' : q.conf >= 0.7 ? 'med' : 'low') + '">' + Math.round(q.conf * 100) + '% confident</span>' +
      (st === 'scheduled' ? '<span class="qc-sched">Queued for ' + esc(q.sched) + '</span>' : '') + '</div>' +
      '<h3>' + esc(q.title) + '</h3>' +
      '<p class="qc-why"><b>Flagged because</b> ' + rich(q.why) + '</p>' +
      slackBlock(q) +
      ((q.flags || []).length ? '<div class="qc-flags">' + q.flags.map(f => {
        const F = QFLAG[f];
        return F ? '<div class="qf' + (F[2] ? ' hard' : '') + '"><b>' + esc(F[0]) + '</b><span>' + esc(F[1]) + '</span></div>' : '';
      }).join('') + '</div>' : '') +
      '<div class="qc-sig"><span class="lbl">Built from</span>' + (q.signals || []).map(id => {
        const g = (D.signals || []).find(x => x.id === id);
        return g ? '<a href="#/signals">' + tag(SGK, g.kind) + esc(g.title) + '</a>' : '';
      }).join('') + '</div>' +
      '<div class="qc-act">' + acts + '</div></article>';
  }
  function viewQueue() {
    const Q = D.queue || [];
    const pending = Q.filter(q => qStatus(q) === 'pending'), sched = Q.filter(q => qStatus(q) === 'scheduled');
    const done = Q.filter(q => ['approved', 'killed'].includes(qStatus(q)));
    const blocked = pending.filter(q => (q.flags || []).some(f => QFLAG[f] && QFLAG[f][2])).length;
    const head = '<div class="pg-hd"><div><div class="eyebrow">Intelligence · Review queue</div><h1>Nothing here has gone out yet</h1>' +
      '<p class="sub">Everything the agents drafted overnight, waiting on a person. Locke signs its work, so a human reads every line before a client does.</p></div></div>';
    const strip = '<div class="strip">' +
      stat('Waiting', pending.length, 'On a human') +
      stat('Scheduled', sched.length, 'Slack holds these') +
      stat('Blocked', blocked, 'Unsourced claim') +
      stat('Closed today', done.length, 'Sent or killed') + '</div>';
    return sec(head + strip) +
      sec('<h2>Waiting on you</h2>' + (pending.length ? pending.map(queueCard).join('') : '<p class="empty">Queue is clear.</p>')) +
      (sched.length ? sec('<h2>Scheduled</h2><p class="note-box">Slack sends these on its own clock. The platform owns the draft and the approval. Slack owns delivery.</p>' + sched.map(queueCard).join('')) : '') +
      (done.length ? sec('<h2>Closed today</h2>' + done.map(queueCard).join('')) : '');
  }

  /* ---------- signal log ---------- */
  function signalCard(g) {
    const H = SGH[g.handling], feed = (D.feeds || []).find(f => f.id === g.outlet);
    return '<article class="sg">' +
      '<div class="sg-hd">' + tag(SGK, g.kind) +
      '<span class="conf" data-c="' + g.conf + '">' + SGC[g.conf] + ' confidence</span>' +
      '<span class="hand" data-h="' + g.handling + '" title="' + esc(H[1]) + '">' + esc(H[0]) + '</span>' +
      '<span class="sg-date">' + esc(fmt(g.date, true)) + '</span></div>' +
      '<h3>' + esc(g.title) + '</h3>' +
      '<div class="sg-who">' + av(g.logged) + '<span>' + esc(g.who) + (feed ? ' · <b>' + esc(feed.name) + '</b>' : '') + '</span></div>' +
      '<p>' + rich(g.note) + '</p>' +
      '<p class="sg-why"><b>Why it changes anything</b> ' + rich(g.why) + '</p>' +
      '<div class="sg-ft">' +
      '<span class="lbl">Touches</span>' + (g.ents || []).map(e => '<a class="chipn" href="' + entHref(e) + '">' + esc(entLabel(e)) + '</a>').join('') +
      (g.corrob && g.corrob.length ? '<span class="lbl">Corroborated by</span><span class="chipn ok">' + g.corrob.length + ' other signal' + (g.corrob.length === 1 ? '' : 's') + '</span>' : '<span class="chipn warn">Uncorroborated</span>') +
      '<span class="lbl">Clients</span>' + (g.clients || []).map(c => { const cl = cById(c); return '<a class="chipn" href="#/client/' + esc(c) + '">' + esc(cl ? cl.name : c) + '</a>'; }).join('') +
      '</div></article>';
  }
  function signalResults() {
    const S = state.sg;
    let rows = (D.signals || []).filter(g => (S.kind === 'all' || g.kind === S.kind) && (S.conf === 'all' || g.conf === S.conf));
    rows = rows.slice().sort((a, b) => b.date.localeCompare(a.date));
    return rows.length ? rows.map(signalCard).join('') : '<p class="empty">Nothing logged at that grade.</p>';
  }
  function viewSignals() {
    const S = state.sg, n = (D.signals || []).length;
    const opt = (v, l, cur) => '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' + esc(l) + '</option>';
    const head = '<div class="pg-hd"><div><div class="eyebrow">Intelligence · Signal log</div><h1>What we know before the record says it</h1>' +
      '<p class="sub">A statehouse reporter posts a floor change in seconds. The legislature’s own site catches up tomorrow. ' +
      'A lobbyist hears something in a hallway that never reaches a site at all. All three belong in one place, graded.</p></div></div>';
    const strip = '<div class="strip">' +
      stat('Logged', n, 'Open signals') +
      stat('Corroborated', (D.signals || []).filter(g => g.corrob && g.corrob.length).length, 'Two sources agree') +
      stat('Internal only', (D.signals || []).filter(g => g.handling === 'internal').length, 'Never leaves Locke') +
      stat('Feeds', (D.feeds || []).length, 'Faster than .gov') + '</div>';
    const grade = '<h2>How an entry is graded</h2><div class="grade">' +
      Object.entries(SGK).map(([k, v]) => '<div><span class="pill ' + v[1] + '">' + v[0] + '</span><span>' + esc({
        heard: 'Someone told us. The weakest grade and often the earliest.',
        reported: 'A named outlet published it. Fast, but it is their reporting, not our verification.',
        observed: 'A Locke person watched it happen. Strong, and usually invisible in any filing.',
        confirmed: 'Checked against the primary record. The only grade that may be stated as fact.'
      }[k]) + '</span></div>').join('') + '</div>' +
      '<p class="note-box"><b>Handling is the field that keeps a firm out of trouble.</b> A rumor that is useful internally can be a liability in a client deliverable. ' +
      'Every entry carries who may hear it, and the agents respect that field when they draft.</p>';
    const filters = '<div class="filters" role="search">' +
      '<label class="sr" for="sg-kind">How we know</label><select class="fld" id="sg-kind" data-sg="kind">' +
      opt('all', 'Any grade', S.kind) + Object.entries(SGK).map(([k, v]) => opt(k, v[0], S.kind)).join('') + '</select>' +
      '<label class="sr" for="sg-conf">Confidence</label><select class="fld" id="sg-conf" data-sg="conf">' +
      opt('all', 'Any confidence', S.conf) + [['high', 'High'], ['med', 'Medium'], ['low', 'Low']].map(([k, l]) => opt(k, l + ' confidence', S.conf)).join('') + '</select>' +
      '</div><div id="sg-results">' + signalResults() + '</div>';
    const capture = '<h2>Capture</h2><p class="note-box">The log only works if writing to it is faster than not writing to it. One box, one grade, done in fifteen seconds.</p>' +
      '<div class="cap"><label class="sr" for="cap-t">What you heard</label><textarea id="cap-t" rows="2" placeholder="What did you just hear?"></textarea>' +
      '<div class="cap-r"><label class="sr" for="cap-k">Grade</label><select class="fld" id="cap-k">' + Object.entries(SGK).map(([k, v]) => '<option value="' + k + '">' + v[0] + '</option>').join('') + '</select>' +
      '<label class="sr" for="cap-h">Handling</label><select class="fld" id="cap-h">' + Object.entries(SGH).map(([k, v]) => '<option value="' + k + '">' + v[0] + '</option>').join('') + '</select>' +
      '<button class="btn" type="button" data-act="cap">Log it</button></div></div>';
    const feeds = '<h2>Feeds</h2><p class="note-box">Where the faster-than-government information comes from, and what we may do with it. ' +
      'A subscription seat buys the right to read, never the right to resell. Paid reporting enters as a human-logged takeaway with attribution, ' +
      'and its text never lands in a client deliverable.</p>' +
      '<div class="fd"><div class="fd-h"><span>Source</span><span>Kind</span><span>Latency</span><span>Rights</span></div>' +
      (D.feeds || []).map(f => '<div class="fd-row"><span><b>' + esc(f.name) + '</b><small>' + esc(f.note) + '</small></span>' +
        '<span>' + esc(f.kind) + (f.seats ? ' · ' + f.seats + ' seats' : '') + '</span><span class="id">' + esc(f.latency) + '</span>' +
        '<span class="lic" data-l="' + esc(f.license) + '">' + (f.license === 'quote' ? 'Quote with attribution' : 'Read only, log takeaways') + '</span></div>').join('') + '</div>';
    return sec(head + strip) + sec(grade) + sec('<h2>' + n + ' entries</h2>' + filters) + sec(capture) + sec(feeds);
  }
  function bindSignals() {
    view.querySelectorAll('[data-sg]').forEach(el => el.addEventListener('change', e => {
      state.sg[el.dataset.sg] = e.target.value;
      refresh('sg-results', signalResults);
    }));
  }

  /* ---------- palette ---------- */
  /* ---------- search ---------- */
  /* One index over every object in the product, built once on first use.
     The retrieval design lives in search.js. The only job here is deciding
     what text is worth indexing, and in which field, because the field a
     term lands in is most of what decides the ranking. */
  const PAGES = [
    ['portfolio', 'Portfolio', 'Every client, health and open actions'], ['impacts', 'Impact', 'One event across the whole book'],
    ['queue', 'Review queue', 'Agent drafts waiting on a human'], ['signals', 'Signal log', 'What we know before the record does'],
    ['home', 'Brief', 'Morning brief, coming up, what changed'], ['moving', 'What is moving', 'Bills and dockets in one tracker'],
    ['legislative/federal', 'Legislative · Federal', 'Congress'], ['legislative/state', 'Legislative · State', 'State legislatures'],
    ['regulatory', 'Regulatory', 'Rules and dockets'], ['compliance', 'Obligations', 'What the client owes and when'],
    ['contracting', 'Opportunities', 'Fit scores and bid calls'], ['stakeholders', 'Stakeholders', 'Influence grid and the ask for each'],
    ['advocacy', 'Advocacy', 'Campaigns in flight'], ['disclosures', 'Disclosures', 'LD-2 and LD-203 filings'],
    ['briefs', 'Briefs', 'Everything Locke has written'], ['tasks', 'Tasks', 'Who owes what'],
    ['analytics', 'Analytics', 'The quarter in four charts'], ['report', 'Q3 board report', 'Printable'],
    ['settings', 'Monitoring settings', 'Live filters']
  ];
  let SIDX = null;
  function searchCorpus() {
    const j = a => (Array.isArray(a) ? a : []).join(' ');
    const docs = PAGES.map(([h, t, sub]) => ({ id: 'pg-' + h, type: 'Page', title: t, sub, body: '', href: '#/' + h, prior: 0.8, filters: { type: 'page' } }));
    D.measures.forEach(m => docs.push({
      id: m.id, type: m.level === 'federal' ? 'Bill' : 'State bill', ident: m.ident, title: m.title, sub: m.short,
      meta: [m.sponsors, m.body, m.cmte, m.st ? STN[m.st] : 'Congress'].filter(Boolean).join(' '),
      body: [j(m.analysis), m.means, j(m.provisions)].filter(Boolean).join(' '),
      href: '#/m/' + m.id, filters: { type: m.level === 'federal' ? 'bill' : 'state-bill', state: (m.st || 'us').toLowerCase() }
    }));
    D.reg.forEach(r => docs.push({
      id: r.id, type: 'Docket', ident: r.ident, title: r.title, sub: r.short,
      meta: [r.body, r.stage, r.lane].filter(Boolean).join(' '),
      body: [j(r.analysis), r.means, j(r.provisions)].filter(Boolean).join(' '),
      href: '#/r/' + r.id, filters: { type: 'docket', state: (r.lane || 'federal').toLowerCase() }
    }));
    D.opps.forEach(o => docs.push({
      id: o.id, type: 'Opportunity', ident: o.ident, title: o.title, sub: [o.agency, o.office].filter(Boolean).join(' · '),
      meta: [o.type, o.naics, o.setAside, o.status].filter(Boolean).join(' '),
      body: [j(o.analysis), o.why, j(o.requirements)].filter(Boolean).join(' '),
      href: '#/o/' + o.id, filters: { type: 'opportunity' }
    }));
    D.hearings.forEach(h => docs.push({
      id: h.id, type: h.kind || 'Hearing', title: h.title, sub: [fmt(h.date), h.body].filter(Boolean).join(' · '),
      meta: [h.by, j(h.witnesses)].filter(Boolean).join(' '), body: j(h.notes),
      href: '#/h/' + h.id, filters: { type: 'hearing' }
    }));
    D.obligations.forEach(o => docs.push({
      id: o.id, type: 'Obligation', title: o.requirement, sub: [o.regime, o.status].filter(Boolean).join(' · '),
      meta: o.regime || '', body: o.note || '', href: '#/compliance', filters: { type: 'obligation' }
    }));
    everyone().forEach(p => docs.push({
      id: p.id, type: p.member ? 'Organization' : 'Person', title: p.name, sub: p.role || p.tier || '',
      meta: [p.stance, p.tier].filter(Boolean).join(' '), body: [p.note, p.ask, p.route].filter(Boolean).join(' '),
      href: '#/p/' + p.id, prior: 0.85, filters: { type: p.member ? 'org' : 'person' }
    }));
    D.briefs.forEach(b => docs.push({
      id: b.id, type: 'Brief', title: b.title, sub: [fmt(b.date), b.status].filter(Boolean).join(' · '),
      meta: [D.people[b.author] && D.people[b.author].name, b.status].filter(Boolean).join(' '), body: b.note || '',
      href: '#/briefs', filters: { type: 'brief' }
    }));
    D.campaigns.forEach(c => docs.push({
      id: c.id, type: 'Campaign', title: c.title, sub: 'Owner ' + D.people[c.owner].short,
      meta: j(c.targets), body: [c.goal, c.note].filter(Boolean).join(' '), href: '#/advocacy', filters: { type: 'campaign' }
    }));
    D.tasks.forEach(t => docs.push({
      id: t.id, type: 'Task', title: t.title, sub: 'Owner ' + (D.people[t.owner] ? D.people[t.owner].short : t.owner),
      meta: t.from || '', body: '', href: '#/tasks', prior: 0.8, filters: { type: 'task' }
    }));
    D.clients.forEach(c => docs.push({
      id: c.id, type: 'Client', title: c.name, sub: [c.sector, c.tier === 'platform' ? 'platform access' : 'Slack only'].filter(Boolean).join(' · '),
      meta: [c.hq, c.stage].filter(Boolean).join(' '), body: c.note || '',
      href: '#/client/' + c.id, filters: { type: 'client', client: c.id }
    }));
    D.impacts.forEach(i => docs.push({
      id: i.id, type: 'Impact', ident: i.ident, title: i.title, sub: i.dateLabel || fmt(i.date),
      meta: '', body: i.summary || '', href: '#/impact/' + i.id, filters: { type: 'impact' }
    }));
    (D.signals || []).forEach(g => docs.push({
      id: g.id, type: 'Signal', title: g.title, sub: [SGK[g.kind][0], g.who].filter(Boolean).join(' · '),
      meta: [g.kind, g.conf, g.handling].join(' '), body: [g.note, g.why].filter(Boolean).join(' '),
      href: '#/signals', filters: { type: 'signal' }
    }));
    (D.queue || []).forEach(q => docs.push({
      id: q.id, type: 'Draft', title: q.title, sub: [q.kind, cById(q.client) ? cById(q.client).name : q.client].join(' · '),
      meta: [q.agent, q.channel, q.status].join(' '), body: [q.body, q.why].filter(Boolean).join(' '),
      href: '#/queue', filters: { type: 'draft', client: q.client }
    }));
    return docs;
  }
  function searchIndex() {
    if (!SIDX && window.LWSearch) SIDX = window.LWSearch.create(searchCorpus());
    return SIDX;
  }
  /* highlight on the raw text, then escape each piece, so a match can
     never land inside an HTML entity */
  function hl(text, q) {
    const words = String(q || '').toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 1);
    if (!words.length) return esc(text);
    const re = new RegExp('(' + words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
    return String(text == null ? '' : text).split(re).map((part, i) => i % 2 ? '<mark>' + esc(part) + '</mark>' : esc(part)).join('');
  }

  let palItems = [], palSel = 0;
  function openPalette() {
    closeLayers();
    pal.innerHTML = '<div class="pal-in">' + I.search + '<label class="sr" for="pal-q">Search</label><input id="pal-q" type="search" placeholder="Search everything. Try RD26-7, ratepayer, or type:docket" autocomplete="off" aria-controls="pal-list" aria-activedescendant="po-0"><kbd>Esc</kbd></div>' +
      '<ul class="pal-list" id="pal-list" role="listbox" aria-label="Results"></ul><div class="pal-ft"><span>↑ ↓ move</span><span>Enter open</span><span>Filters: <span class="id">type:</span> <span class="id">state:</span></span></div>';
    showLayer(pal);
    const input = $('pal-q');
    palSel = 0;
    drawPal('');
    input.addEventListener('input', () => { palSel = 0; drawPal(input.value); });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!palItems.length) return;
        palSel = (palSel + (e.key === 'ArrowDown' ? 1 : -1) + palItems.length) % palItems.length;
        markPal();
      } else if (e.key === 'Enter' && palItems[palSel]) { e.preventDefault(); go(palItems[palSel].href); }
    });
    input.focus();
  }
  function drawPal(q) {
    const s = q.trim();
    const idx = searchIndex();
    let rows;
    if (!s || !idx) {
      rows = searchCorpus().filter(d => d.filters.type === 'page').slice(0, 12).map(doc => ({ doc, snippet: '' }));
    } else {
      rows = idx.query(s, { limit: 32 });
    }
    palItems = rows.map(r => ({
      type: r.doc.type, t: r.doc.title,
      s: [r.doc.ident, r.doc.sub].filter(Boolean).join(' · '),
      snip: r.snippet, href: r.doc.href
    }));
    $('pal-list').innerHTML = palItems.length ? palItems.map((i, n) =>
      '<li role="option" id="po-' + n + '" aria-selected="' + (n === palSel) + '" data-href="' + i.href + '">' +
      '<span class="pt">' + esc(i.type) + '</span><span><b>' + hl(i.t, s) + '</b><small>' + hl(i.s, s) + '</small>' +
      (i.snip ? '<small class="snip">' + hl(i.snip, s) + '</small>' : '') + '</span></li>').join('')
      : '<li class="pal-empty" role="option" aria-disabled="true" aria-selected="false">No matches. Try an identifier like RD26-7, a state like Texas, or a filter like <span class="id">type:docket</span>.</li>';
  }
  function markPal() {
    $('pal-list').querySelectorAll('[role="option"]').forEach((li, n) => li.setAttribute('aria-selected', String(n === palSel)));
    const cur = $('po-' + palSel);
    if (cur) { cur.scrollIntoView({ block: 'nearest' }); $('pal-q').setAttribute('aria-activedescendant', 'po-' + palSel); }
  }
  function go(href) { closeLayers(); if (location.hash === href) render(false); else location.hash = href; }

  /* ---------- drawers ---------- */
  function openAbout() {
    closeLayers();
    const a = D.about;
    const all = Object.keys(D.sources).sort((x, y) => (D.sources[x].pub + D.sources[x].label).localeCompare(D.sources[y].pub + D.sources[y].label));
    drawer.innerHTML = '<div class="dr-hd"><h2 id="about-title">About this prototype</h2><button class="icon-btn" type="button" data-act="close" aria-label="Close">' + I.close + '</button></div>' +
      '<div class="dr-b">' + a.paras.map((p, i) => '<p' + (i === 0 ? ' class="lead"' : '') + '>' + rich(p) + '</p>').join('') +
      a.sections.map(s => '<h3>' + esc(s.h) + '</h3><ul>' + s.items.map(i => '<li>' + rich(i) + '</li>').join('') + '</ul>').join('') +
      '<h3>Sources (' + all.length + ')</h3><ol class="src-list">' + all.map(srcItem).join('') + '</ol></div>';
    showLayer(drawer);
    drawer.querySelector('.icon-btn').focus();
  }
  function openKeys() {
    closeLayers();
    const k = [['G then H', 'Home'], ['G then L', 'Legislative'], ['G then R', 'Regulatory'], ['G then O', 'Obligations'], ['G then C', 'Contracting'],
      ['J / K', 'Move down and up a list'], ['Enter', 'Open the selected row'], ['⌘K or /', 'Search everything'], ['?', 'This list'], ['Esc', 'Close']];
    drawer.innerHTML = '<div class="dr-hd"><h2 id="about-title">Keyboard</h2><button class="icon-btn" type="button" data-act="close" aria-label="Close">' + I.close + '</button></div>' +
      '<div class="dr-b"><p>Built for people who live in this tool all morning. Everything here works without the mouse.</p><div class="keys">' +
      k.map(([a, b]) => '<div><kbd>' + a + '</kbd><span>' + b + '</span></div>').join('') + '</div></div>';
    showLayer(drawer);
    drawer.querySelector('.icon-btn').focus();
  }

  /* ---------- actions ---------- */
  function setRole(k) {
    state.role = k;
    store.set('role', k);
    renderTop();
    if (route().key === 'home') render(true);
    toast('Viewing as ' + D.people[D.roles[k].person].name + ', ' + D.roles[k].label + '.');
  }
  function toggleTheme() {
    const next = isPaper() ? 'ink' : 'paper';
    document.documentElement.setAttribute('data-theme', next);
    store.set('theme', next);
    const b = $('theme-btn');
    b.innerHTML = isPaper() ? I.moon : I.sun;
    b.setAttribute('aria-label', isPaper() ? 'Switch to ink theme' : 'Switch to paper theme');
  }
  function act(name, t) {
    switch (name) {
      case 'palette': openPalette(); break;
      case 'about': openAbout(); break;
      case 'keys': openKeys(); break;
      case 'close': closeLayers(); break;
      case 'menu': closeLayers(); showLayer(side); side.classList.add('open'); break;
      case 'theme': toggleTheme(); break;
      case 'role-menu': toggleRole(); break;
      case 'role': toggleRole(false); setRole(t.dataset.role); break;
      case 'ask': {
        const i = Number(t.dataset.i);
        state.asked[state.role] = state.asked[state.role] === i ? null : i;
        const box = $('ask');
        if (box) {
          box.outerHTML = askPanel(D.roles[state.role]);
          const btn = document.querySelector('.ask-q[data-i="' + i + '"]');
          if (btn) btn.focus({ preventScroll: true });
        }
        break;
      }
      case 'hide':
        state.hidden.add(t.dataset.id); saveHidden(); render(true); renderSide();
        toast('Marked not relevant. Locke will rank items like this lower for Loomwork.');
        break;
      case 'unhide':
        D.since.forEach(x => state.hidden.delete(x.id));
        [...state.hidden].filter(x => x.startsWith('b:')).forEach(x => state.hidden.delete(x));
        saveHidden(); render(true); renderSide(); toast('Restored.');
        break;
      case 'hide-b':
        state.hidden.add(t.dataset.key); saveHidden(); render(true);
        toast('Cleared. Locke stops surfacing this one and ranks similar items lower.');
        break;
      case 'hide-m': {
        const m = mById(t.dataset.id);
        state.hidden.add('m:' + t.dataset.id); saveHidden();
        toast(m.ident + ' removed from your tracker. Locke will stop alerting on it.');
        location.hash = '#/legislative/' + m.level;
        break;
      }
      case 'leg-restore':
        [...state.hidden].filter(x => x.startsWith('m:')).forEach(x => state.hidden.delete(x)); saveHidden(); render(true); toast('Restored to your tracker.');
        break;
      case 'leg-reset':
        Object.assign(state.leg, { st: 'all', stage: 'all', topic: 'all', exp: 'all', q: '' }); render(true);
        break;
      case 'toast': toast(t.dataset.msg); break;
      case 'person': location.hash = '#/p/' + t.dataset.id; break;
      case 'client': location.hash = '#/client/' + t.dataset.id; break;
      case 'mode': {
        state.mode = t.dataset.mode;
        if (t.dataset.client) { state.client = t.dataset.client; store.set('client', state.client); }
        store.set('mode', state.mode);
        renderTop(); renderSide(); renderTicker();
        const c = curClient();
        const dest = state.mode === 'locke' ? '#/portfolio' : (c.tier === 'platform' ? '#/home' : '#/digest');
        if (location.hash === dest) render(false); else location.hash = dest;
        toast(state.mode === 'locke' ? 'Back in the firm view, across all five accounts.'
          : (c.tier === 'platform' ? 'Seeing exactly what ' + c.name + ' sees. Four screens, nothing else.'
            : c.name + ' has no seats. This one page is their entire product, and Locke works the rest on their behalf.'));
        break;
      }
      case 'qok': case 'qkill': case 'qsched': case 'qback': case 'qedit': {
        const id = t.dataset.id, q = (D.queue || []).find(x => x.id === id);
        if (!q) break;
        if (name === 'qedit') { toast('Opens the draft in place. Edits are attributed to you and the provenance stamp updates.'); break; }
        const next = name === 'qok' ? 'approved' : name === 'qkill' ? 'killed' : name === 'qsched' ? 'scheduled' : q.status;
        if (name === 'qback') delete state.qs[id]; else state.qs[id] = next;
        store.set('qs', state.qs);
        SIDX = null;
        render(true);
        toast(name === 'qok' ? 'Sent to ' + q.channel + '. Stamped agent-drafted, reviewed by ' + D.people[D.locke.user].short + '.'
          : name === 'qkill' ? 'Killed. The reason goes back to the agent, which is how the threshold learns.'
            : name === 'qsched' ? 'Queued. Slack holds it and delivers on its own clock.'
              : 'Back in the queue.');
        break;
      }
      case 'cap': {
        const el = $('cap-t'), txt = el ? el.value.trim() : '';
        if (!txt) { toast('Nothing to log yet.'); break; }
        if (el) el.value = '';
        toast('Logged as ' + SGK[$('cap-k').value][0].toLowerCase() + ', ' + SGH[$('cap-h').value][0].toLowerCase() + '. Locke matches it against every open item tonight.');
        break;
      }
      case 'print': window.print(); break;
      case 'task': {
        const id = t.dataset.id, base = D.tasks.find(x => x.id === id);
        const isDone = state.done.has(id) || (base.done && !state.undone.has(id));
        if (isDone) { state.done.delete(id); if (base.done) state.undone.add(id); }
        else { state.undone.delete(id); if (!base.done) state.done.add(id); }
        store.set('done', [...state.done]); store.set('undone', [...state.undone]);
        render(true);
        break;
      }
      case 'mute': {
        const k = t.dataset.k;
        if (state.muted.has(k)) state.muted.delete(k); else state.muted.add(k);
        store.set('muted', [...state.muted]);
        render(true); renderSide(); renderTicker();
        toast(state.muted.has(k) ? 'Off. Locke stops surfacing items from this jurisdiction.' : 'On. Items from this jurisdiction are back in every tracker.');
        break;
      }
      case 'topic': {
        const k = t.dataset.k;
        if (state.topicsOff.has(k)) state.topicsOff.delete(k); else state.topicsOff.add(k);
        store.set('topicsOff', [...state.topicsOff]);
        render(true); renderSide();
        toast(state.topicsOff.has(k) ? 'Off. Items on this topic drop out of the trackers.' : 'On. This topic is back.');
        break;
      }
    }
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-act]');
    if (t) { e.preventDefault(); act(t.dataset.act, t); return; }
    const opt = e.target.closest('.pal-list [data-href]');
    if (opt) { go(opt.dataset.href); return; }
    const row = e.target.closest('[data-href]:not(a):not(.tk)');
    if (row && !e.target.closest('a,button')) { location.hash = row.dataset.href; return; }
    const menu = $('role-menu');
    if (menu && !menu.hidden && !e.target.closest('.role')) toggleRole(false);
  });
  document.addEventListener('keydown', e => {
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    const typing = /INPUT|TEXTAREA|SELECT/.test(tag);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (pal.hidden) openPalette(); else closeLayers(); return; }
    if (e.key === 'Escape') { closeLayers(); state.gKey = false; return; }
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (state.gKey) {
      state.gKey = false;
      if (GOTO[k]) { e.preventDefault(); location.hash = '#/' + GOTO[k]; }
      return;
    }
    if (k === 'g') { state.gKey = true; setTimeout(() => { state.gKey = false; }, 1400); return; }
    if (k === '/') { e.preventDefault(); openPalette(); return; }
    if (e.key === '?') { e.preventDefault(); openKeys(); return; }
    if (k === 'j') { e.preventDefault(); moveRow(1); return; }
    if (k === 'k') { e.preventDefault(); moveRow(-1); return; }
    if (e.key === 'Enter') { const list = rows(); if (state.cur >= 0 && list[state.cur]) { e.preventDefault(); openRow(); } }
  });
  window.addEventListener('hashchange', () => { closeLayers(); render(false); view.focus({ preventScroll: true }); });
  if (mq && mq.addEventListener) mq.addEventListener('change', () => { if (!document.documentElement.getAttribute('data-theme')) renderTop(); });

  renderTop();
  renderSide();
  renderTicker();
  render(false);
})();
