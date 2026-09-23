---
name: publish-prototype
description: Use when building, previewing or publishing the Locke for Loomwork prototype artifact. Covers the file map, the local preview workaround for the Desktop sandbox, the look-once rule, and the publish call that keeps the same URL. Triggers include "publish the prototype", "preview it", "check it renders", "republish", "the artifact", "deploy the update".
---

# Building and publishing the prototype

## Files

The artifact is `index.html` plus `app.js`, `search.js` and eight data files. Every publish must pass the full map, or a missing file 404s on the live page:

```
files: {
  "app.js": "app.js",
  "search.js": "search.js",
  "data-core.js": "data-core.js",
  "data-roles.js": "data-roles.js",
  "data-measures.js": "data-measures.js",
  "data-rest.js": "data-rest.js",
  "data-phase2.js": "data-phase2.js",
  "data-phase3.js": "data-phase3.js",
  "data-portfolio.js": "data-portfolio.js",
  "data-signals.js": "data-signals.js"
}
```

`search.js` must load AFTER the data files and BEFORE `app.js`. It defines `window.LWSearch`, which `app.js` calls on the first keystroke in the palette.

**The source paths on the right resolve against the current working directory, not against the HTML file.** If the working directory is the application folder, they need the `loomwork-prototype/` prefix. If it is the prototype folder itself, they must not. A publish that fails with `"...not found"` is almost always this. Check the working directory, or pass `root` to pin it.

Adding a data file means three edits, not one: create it, add a `<script src>` tag with `charset="utf-8"` in `index.html`, and add it to the publish map.

## Previewing locally

The Desktop sandbox blocks the dev server from reading the Desktop folder, and a `file://` preview renders as a static snapshot without the scripts. The workaround:

1. Copy the folder to the session scratchpad.
2. Serve that copy via `.claude/launch.json`, which runs `sh -c "cd <scratchpad path> && exec python3 -m http.server 8765"`.
3. `preview_start`, then load `http://localhost:8765/#/home`.
4. Re-copy after every edit. The server serves the copy, not the source.

## The preview caches scripts

The local server sends caching headers, so after re-copying an edited `app.js` the browser will keep running the old one and the look will show stale behavior. Symptoms: a fix that is provably in the file does not appear on screen, while an older fix does.

Before trusting a look after an edit, bust the cache from the page:

```js
await fetch('app.js', { cache: 'reload' });
await fetch('index.html', { cache: 'reload' });
location.reload();
```

To tell a stale cache apart from a bad edit, compare three things: `grep` the source file, `grep` the copy being served, and ask the page what it is actually running (`document.querySelectorAll('a.cl-card').length`). If the files agree and the page disagrees, it is cache.

## Writing clickable things

A `<button>` may not contain `<div>`. The browser silently breaks the element apart and the click target disappears, leaving text that looks right and does nothing. This shipped once, in the portfolio client cards.

For anything that navigates, use `<a href="#/route">` with `<span>` children. Keep `<button>` for actions that do not navigate, and give it only phrasing content. The accessibility tree is the fastest check: `read_page` with `filter: "interactive"` will simply not list an element that was broken apart.

## Looking once

Write carefully, look once, fix what the look shows, then publish. Do not build a screenshot loop.

A single look should cover:
- One screenshot of the screen that changed most
- Navigation through every new route, then `read_console_messages` with `onlyErrors`
- For a new layout with absolute positioning, one screenshot of that specifically

What past looks have caught: garbled characters from a missing charset, a header colliding with the brief, a ticker clipping its last item, and colliding labels on the influence grid. All were one-line fixes, and all would have shipped without the look.

## Publishing

Republish the same `file_path` to keep the URL. Pass a short `label` describing the change. Do not pass `favicon` or `icon` on a republish, because the artifact keeps the ones it has.

After publishing, stop the preview server.

## The publish guard

Republishing an artifact from an earlier session is refused until this session has seen what is live. The sequence that works:

1. The first refusal hands back the live `index.html`. Read it.
2. `action: "read"` on the artifact URL, which marks the live version as viewed.
3. The next refusal names any published file whose bytes this session has not seen, usually `app.js`.
4. Prove your copy descends from it. `shasum -a 256` your pre-edit backup and compare to the sha in the refusal. Copy the file before editing (`cp app.js /tmp/app.js.bak`) precisely so this check is available.
5. When the hashes match, the published bytes are the bytes you edited, so nothing unseen can be lost. Publish with `overwrite_unread: ["app.js"]`.

If the hashes do NOT match, someone else changed the file. Read it and merge instead of overwriting.

Note that the byte count in a refusal counts UTF-8 bytes, while a Python string length counts characters. A file full of curly quotes reads a hundred or so bytes larger than its character count. That difference is not a mismatch.

## Checklist before publishing

- [ ] Every new data file is in the script tags and the publish map
- [ ] `search.js` still sits between the data files and `app.js`
- [ ] Console shows no errors on the changed routes
- [ ] Dates still make sense against `LW.today`
- [ ] New names follow the party and district convention
- [ ] Anything illustrative is still labeled
- [ ] The scratchpad copy matches the source, so the look tested what ships
