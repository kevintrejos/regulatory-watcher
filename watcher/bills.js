'use strict';
/* Load the tracked items out of the prototype's data files.

   They are browser scripts that assign onto window.LW, so a fake window is
   enough to read them in node. That keeps one source of truth: a bill added
   to the prototype is watched, with no second list to maintain. */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'prototype');
const FILES = ['data-core.js', 'data-roles.js', 'data-measures.js', 'data-rest.js',
  'data-phase2.js', 'data-phase3.js', 'data-portfolio.js', 'data-signals.js'];

function loadLW() {
  const window = {};
  for (const f of FILES) {
    const src = fs.readFileSync(path.join(DIR, f), 'utf8');
    // eslint-disable-next-line no-eval
    eval(src);
  }
  return window.LW;
}

/* "Important to our clients" is the filter Kevin asked for: anything with
   real exposure gets a table. Tracked-but-inert items do not. */
function watchedItems(minExposure = 1) {
  const D = loadLW();
  const bills = (D.measures || [])
    .filter(m => (m.exposure || 0) >= minExposure)
    .map(m => ({ id: m.id, ident: m.ident, title: m.title, st: m.st || null,
                 sponsors: m.sponsors, topics: m.topics || [], exposure: m.exposure, type: 'm' }));
  const dockets = (D.reg || [])
    .filter(r => (r.exposure || 0) >= minExposure)
    .map(r => ({ id: r.id, ident: r.ident, title: r.title, st: null, lane: r.lane,
                 sponsors: null, topics: r.topics || [], exposure: r.exposure, type: 'r' }));
  return { bills, dockets, all: [...bills, ...dockets], D };
}

module.exports = { loadLW, watchedItems };
