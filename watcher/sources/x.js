'use strict';
/* X, by polling user timelines.

   Filtered stream is Pro or Enterprise only, and Pro was deprecated in
   August 2026, so real-time push is not available at a startup price. What
   is left is polling, where every post returned is a billed read at about
   $0.005. So this adapter counts what it spends and stops at the budget
   rather than discovering the overage on an invoice.

   Needs X_BEARER_TOKEN in the environment. It is never read from a file
   and never logged. */

const BASE = 'https://api.x.com/2';

const token = () => process.env.X_BEARER_TOKEN || null;
const hasToken = () => !!token();

async function call(pathAndQuery) {
  const r = await fetch(`${BASE}${pathAndQuery}`, {
    headers: { authorization: `Bearer ${token()}`, accept: 'application/json' }
  });
  if (r.status === 401) return { error: 'bad or expired bearer token' };
  if (r.status === 429) return { error: 'rate limited' };
  if (!r.ok) return { error: `HTTP ${r.status}` };
  return { data: await r.json() };
}

/* Username to id, cached by the caller so it is paid for once. */
async function resolveUser(username) {
  const { data, error } = await call(`/users/by/username/${encodeURIComponent(username)}`);
  if (error) return { id: null, error };
  return { id: data && data.data ? data.data.id : null, error: data && data.data ? null : 'not found' };
}

async function getUserPosts(userId, { sinceId = null, max = 40, handle = '' } = {}) {
  const q = new URLSearchParams({
    max_results: String(Math.max(5, Math.min(100, max))),
    'tweet.fields': 'created_at,text',
    exclude: 'replies,retweets'
  });
  if (sinceId) q.set('since_id', sinceId);
  const { data, error } = await call(`/users/${userId}/tweets?${q}`);
  if (error) return { posts: [], newest: null, reads: 0, error };
  const rows = (data && data.data) || [];
  const posts = rows.map(t => ({
    platform: 'x',
    id: t.id,
    text: t.text || '',
    createdAt: t.created_at,
    url: `https://x.com/${handle}/status/${t.id}`,
    authorHandle: handle,
    authorName: handle,
    isRepost: false,
    viaHandle: null,
    links: []
  }));
  return {
    posts,
    newest: (data && data.meta && data.meta.newest_id) || null,
    reads: rows.length,
    error: null
  };
}

module.exports = { hasToken, resolveUser, getUserPosts };
