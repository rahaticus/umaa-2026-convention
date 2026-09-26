import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const source = async path => readFile(new URL(path, root), 'utf8');

test('schedule control contract includes all views, selected semantics, and URL history', async () => {
  const file = await source('components/schedule-client.tsx');
  for (const label of ['Full Schedule', 'Main Sessions Only', 'Workshops Only', "Children's Program Only", 'Ladies Only']) assert.match(file, new RegExp(label));
  assert.match(file, /aria-pressed/);
  assert.match(file, /pushState/);
  assert.match(file, /popstate/);
  assert.match(file, /Clear filters/);
  assert.match(file, /setOpenDays\(dayIds\)/);
  assert.match(file, /current\.includes\(date\)/);
  assert.match(file, /view === 'ladies' && isLadiesOnly\(s\)/);
});

test('Salaat selector is a client control with selected state and live time updates', async () => {
  const file = await source('components/salaat.tsx');
  assert.match(file, /^'use client'/);
  assert.match(file, /type="button"/);
  assert.match(file, /aria-pressed/);
  assert.match(file, /aria-live="polite"/);
});

test('appearance uses one direct persisted light/dark toggle after device-based initialization', async () => {
  const [control, layout, styles] = await Promise.all([source('components/appearance.tsx'), source('app/layout.tsx'), source('app/theme.css')]);
  assert.match(control, /localStorage\.setItem/);
  assert.match(control, /Switch to dark mode/);
  assert.match(control, /Switch to light mode/);
  assert.match(control, /switchingToDark \? '☾' : '☀'/);
  assert.doesNotMatch(control, /appearance-menu|aria-expanded|System/);
  assert.match(layout, /matchMedia\('\(prefers-color-scheme: dark\)'\)/);
  assert.doesNotMatch(styles, /appearance-menu/);
});

test('local development clears any old PWA worker before loading client code', async () => {
  const file = await source('app/layout.tsx');
  assert.match(file, /getRegistrations/);
  assert.match(file, /unregister/);
  assert.match(file, /caches\.keys/);
  assert.match(file, /dev-cache-cleared/);
  assert.doesNotMatch(file, /location\.hostname/);
});

test('day headers omit counts, sharing uses canonical routes, and venue schedules derive from sessions', async () => {
  const [schedule, share, venue] = await Promise.all([source('components/schedule-client.tsx'), source('components/share-controls.tsx'), source('app/venue/page.tsx')]);
  assert.doesNotMatch(schedule, /daySessions\.length} session/);
  assert.match(share, /\*\$\{session\.title\}\*/);
  assert.match(share, /location\.origin/);
  assert.match(share, /sessionSlug\(session\)/);
  assert.match(venue, /sessions\.filter/);
  assert.match(venue, /combined\[key\]/);
});
