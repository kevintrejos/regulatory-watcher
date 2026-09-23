---
name: monitoring-settings
description: Use when updating the Locke prototype's Monitoring settings - jurisdiction and topic toggles that actually re-filter the app, per-role push thresholds, monitored agencies, and the log of what the agents have learned from dismissals. Triggers include "update settings", "add a jurisdiction", "alert threshold", "what Locke watches", "the learning log", "turn off a state".
---

# Monitoring settings

Owns `LW.settings` in `data-phase3.js`. Unlike most settings screens in a demo, these controls are wired: toggling a jurisdiction or topic re-filters every tracker, the ticker, the counts and the brief.

## Shape

```js
LW.settings = {
  jurisdictions: [{ k: 'US', label: 'Federal' }, { k: 'TX', label: 'Texas' }, ...],
  topics: [{ k: 'interconnection', label: 'Interconnection' }, ...],
  agencies: ['FERC', 'NERC', 'DOE Office of Electricity', ...],
  thresholds: [{ role: 'CEO', rule: '...' }],
  learned: [{ date: '2026-09-11', text: '...' }]
}
```

## Wiring rules

- Jurisdiction keys must match the `st` values used across `LW.measures`, `LW.reg` and `LW.hearings`, with `US` meaning federal. A key with no matching items shows a zero count, which looks broken.
- Topic keys must match the `topics` arrays on measures and dockets. An item hides only when **all** of its topics are off, so an item tagged both `interconnection` and `largeload` survives turning off one of them. That is intentional and worth preserving.
- State lives in `state.muted` and `state.topicsOff`, persisted per viewer. Toggles re-render the shell so counts and the ticker stay consistent.

## Thresholds

One rule per role, written as a sentence a person would say, not as a config value:

> CEO: Act items only, at most one push per day. Everything else waits for the morning brief.

This is where the product's restraint is stated out loud. Keep the CEO rule the strictest. It is the clearest signal that the firm is protecting the client's attention rather than proving its own activity.

## The learning log

Every entry records a conclusion the firm drew, with a date:

> Marked not relevant: state AI bills with no grid nexus. Locke now files these to the digest instead of the brief.

Write the conclusion, not the click. Include at least one "requested more of" entry, because learning runs both directions and a log of only rejections reads like a complaint file.

## Quality bar

- Every jurisdiction listed has at least one tracked item, or is there because the client expects coverage and Locke has found nothing yet, stated in the count line.
- Agencies listed are the ones that actually appear as `body` values in the dockets.
- The learning log has three or more dated entries, oldest last.
- Toggling any control leaves the app in a coherent state: no empty trackers without an explanation, no counts that contradict the lists.
