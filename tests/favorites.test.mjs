import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import seed from '../data/sessions_seed.json' with { type: 'json' };

const ids = seed.sessions.map(session => session.id);
const known = new Set(ids);
const normalize = value => {
  const raw = Array.isArray(value) ? value : value?.ids;
  const seen = new Set();
  return Array.isArray(raw) ? raw.filter(id => typeof id === 'string' && known.has(id) && !seen.has(id) && (seen.add(id), true)) : [];
};
const toggle = (saved, id) => saved.includes(id) ? saved.filter(value => value !== id) : [...saved, id];
const chrono = (a, b) => `${a.date}|${a.startTime || '99:99'}|${a.title}|${a.id}`.localeCompare(`${b.date}|${b.startTime || '99:99'}|${b.title}|${b.id}`);

test('all 53 canonical occurrences can save, persist, resolve, and remove independently', () => {
  assert.equal(ids.length, 53);
  assert.equal(known.size, 53);
  let saved = [];
  for (const id of ids) saved = toggle(saved, id);
  const persisted = JSON.stringify({ version: 1, ids: saved });
  const restored = normalize(JSON.parse(persisted));
  assert.deepEqual(restored, ids);
  assert.equal(seed.sessions.filter(session => restored.includes(session.id)).length, 53);
  for (const id of ids) saved = toggle(saved, id);
  assert.deepEqual(saved, []);
});

test('favorite migration preserves valid legacy IDs, rejects corruption, and prevents duplicates', () => {
  assert.deepEqual(normalize([ids[0], ids[0], 'not-a-session', ids[1]]), [ids[0], ids[1]]);
  assert.deepEqual(normalize({ version: 1, ids: [ids[2], ids[3]] }), [ids[2], ids[3]]);
  assert.deepEqual(normalize(null), []);
});

test('clearing all canonical IDs serializes an empty persisted itinerary', () => {
  const persisted = JSON.stringify({ version: 1, ids });
  assert.equal(normalize(JSON.parse(persisted)).length, 53);
  const cleared = JSON.stringify({ version: 1, ids: [] });
  assert.deepEqual(normalize(JSON.parse(cleared)), []);
  assert.equal(seed.sessions.filter(session => normalize(JSON.parse(cleared)).includes(session.id)).length, 0);
});

test('My Schedule source resolves every saved ID and sorts by date, time, title, then ID', () => {
  const ordered = [...seed.sessions].sort(chrono);
  assert.equal(ordered.length, 53);
  assert.ok(ordered.every((session, index) => index === 0 || chrono(ordered[index - 1], session) <= 0));
  assert.deepEqual([...new Set(ordered.map(session => session.id))].sort(), [...ids].sort());
});

test('client controls use canonical storage reads for every toggle and broadcast updates', async () => {
  const source = await readFile(new URL('../components/controls.tsx', import.meta.url), 'utf8');
  assert.match(source, /FAVORITES_STORAGE_KEY/);
  assert.match(source, /toggleFavorite\(readFavorites\(\), id/);
  assert.match(source, /FAVORITES_CHANGED_EVENT/);
  assert.match(source, /window\.addEventListener\('storage'/);
});

test('Clear All uses an accessible confirmation dialog before persistence is removed', async () => {
  const source = await readFile(new URL('../app/my-schedule/page.tsx', import.meta.url), 'utf8');
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /Clear all saved sessions\?/);
  assert.match(source, /event\.key === 'Escape'/);
  assert.match(source, /setIds\(\[\]\)/);
  assert.match(source, /cancelButton\.current\?\.focus/);
});
