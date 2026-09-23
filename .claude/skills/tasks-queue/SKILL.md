---
name: tasks-queue
description: Use when adding or updating tasks in the Locke prototype - the shared worklist across the Locke team and the client team, with owners, due dates and links back to the item that created them. Triggers include "add a task", "who owes what", "assign this", "update Tasks", "mark it done", "the client owes us".
---

# Tasks queue

Owns `LW.tasks` in `data-phase3.js`. Completion state is per-viewer and persists in browser storage, so the seeded `done` flag is only the starting position.

## Object shape

```js
{
  id: 't1',
  title: 'Technical review of the NERC draft comment',
  owner: 'priya',              // client or Locke person id
  due: '2026-09-17',
  done: false,                 // seed state only
  ref: { type: 'r', id: 'nerc-2602' },   // optional but strongly preferred
  from: 'Alexandra Chen'       // who asked, displayed as "From ..."
}
```

## Rules

- **Every task traces to something.** If a task has no `ref`, it should be a filing obligation or an internal check that genuinely has no item behind it. Three or more ref-less tasks means the list has drifted from the work.
- **Owners cross both teams.** The point of this screen is that Locke and the client see one list. Tasks assigned to the client should name what Locke is blocked on.
- **`from` names the asker.** "From Alexandra Chen" tells the owner who to push back on. "From Locke" is right for recurring filing obligations.
- **Dates feed Home.** A task due inside the window shows up in the Coming up rail, so the date has to be real, not aspirational.
- **Seed a few as done.** A list with nothing completed reads as a wish list. Completed items should be ones the rest of the prototype references, like a comment already filed.

## Writing a task title

Name the action and the object, in the owner's language. Fewer than ten words.

- Yes: "Technical review of the NERC draft comment"
- Yes: "Confirm SPARK applications with both PJM utility customers"
- No: "NERC" or "Follow up on the thing from Tuesday"

## Overdue

Anything past due renders in the act color. That is deliberate and should be rare: one overdue item reads as real life, five reads as a broken account. If something is genuinely overdue, the brief or the ledger should acknowledge it rather than letting the client discover it here.

## Quality bar

- Between eight and twelve tasks, three or four of them seeded complete.
- Every open task has a due date. Undated work is not a task, it is a wish.
- No task duplicates a compliance obligation. Obligations live in `LW.obligations`, and a task may point at one, but the two lists should not say the same thing twice.
