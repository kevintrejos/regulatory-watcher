'use strict';
/* Watermarks, dedupe and the X spend counter, in one JSON file.

   The seen-set is capped. A watcher that grows its state file forever is a
   watcher that eventually stops running on someone's laptop. */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'out', 'state.json');
const SEEN_CAP = 5000;

function load() {
  try {
    const s = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    s.seen = new Set(s.seen || []);
    s.watermarks = s.watermarks || {};
    s.budget = s.budget || { month: null, reads: 0 };
    return s;
  } catch (e) {
    return { watermarks: {}, seen: new Set(), budget: { month: null, reads: 0 } };
  }
}

function save(s) {
  const seen = [...s.seen].slice(-SEEN_CAP);
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify({ watermarks: s.watermarks, seen, budget: s.budget }, null, 2));
}

/* The X budget resets with the calendar month, the same way the cap does. */
function budgetLeft(s, cfg) {
  const month = new Date().toISOString().slice(0, 7);
  if (s.budget.month !== month) s.budget = { month, reads: 0 };
  return Math.max(0, cfg.x.monthlyReadBudget - s.budget.reads);
}
const spend = (s, n) => { s.budget.reads += n; };

module.exports = { load, save, budgetLeft, spend, FILE };
