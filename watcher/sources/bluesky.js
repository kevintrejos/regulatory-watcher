'use strict';
/* Bluesky, through the public AppView. No auth, no key, no cost.

   Two things the raw response will trip you on. The feed includes reposts,
   whose post.author is somebody else entirely, so a naive read attributes
   another person's words to your reporter. And the at:// URI is not a web
   link, so it has to be rebuilt into a bsky.app URL a human can open. */

const BASE = 'https://public.api.bsky.app/xrpc';

const rkey = uri => String(uri).split('/').pop();
const webUrl = (handle, uri) => `https://bsky.app/profile/${handle}/post/${rkey(uri)}`;

async function getAuthorFeed(handle, { limit = 60, cursor = null } = {}) {
  const u = new URL(`${BASE}/app.bsky.feed.getAuthorFeed`);
  u.searchParams.set('actor', handle);
  u.searchParams.set('limit', String(Math.min(100, limit)));
  u.searchParams.set('filter', 'posts_no_replies');
  if (cursor) u.searchParams.set('cursor', cursor);

  const r = await fetch(u, { headers: { accept: 'application/json' } });
  if (r.status === 400) return { posts: [], cursor: null, error: 'unknown or deactivated handle' };
  if (r.status === 429) return { posts: [], cursor: null, error: 'rate limited' };
  if (!r.ok) return { posts: [], cursor: null, error: `HTTP ${r.status}` };

  const j = await r.json();
  const posts = [];
  for (const item of j.feed || []) {
    const p = item.post;
    if (!p || !p.record) continue;
    /* A self-repost still carries a repost reason, so reason alone would
       label a reporter's own work as somebody else's that they amplified.
       It is only an amplification when the author is a different person. */
    const authorHandle = p.author && p.author.handle ? p.author.handle : handle;
    const isRepost = !!(item.reason && String(item.reason.$type || '').includes('reasonRepost'))
      && authorHandle.toLowerCase() !== String(handle).toLowerCase();
    const links = (p.record.facets || [])
      .flatMap(f => (f.features || []).map(x => x.uri).filter(Boolean));
    posts.push({
      platform: 'bluesky',
      id: p.uri,
      text: p.record.text || '',
      createdAt: p.record.createdAt || p.indexedAt,
      url: webUrl(authorHandle, p.uri),
      authorHandle,
      authorName: p.author ? (p.author.displayName || p.author.handle) : handle,
      isRepost,
      /* on a repost the words belong to the original author; the reporter's
         signal is that they chose to amplify it */
      viaHandle: isRepost ? handle : null,
      links
    });
  }
  return { posts, cursor: j.cursor || null, error: null };
}

module.exports = { getAuthorFeed, webUrl };
