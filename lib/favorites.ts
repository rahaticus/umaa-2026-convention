export const FAVORITES_STORAGE_KEY = 'umaa2026:favorites:v1';
export const FAVORITES_CHANGED_EVENT = 'umaa2026:favorites-changed';

export type FavoritesRecord = { version: 1; ids: string[] };

export function canonicalFavoriteIds(value: unknown, validIds: ReadonlySet<string>): string[] {
  const candidate = Array.isArray(value) ? value : value && typeof value === 'object' && Array.isArray((value as { ids?: unknown }).ids) ? (value as { ids: unknown[] }).ids : [];
  const seen = new Set<string>();
  return candidate.filter((id): id is string => typeof id === 'string' && validIds.has(id) && !seen.has(id) && (seen.add(id), true));
}

export function parseFavorites(serialized: string | null, validIds: ReadonlySet<string>): string[] {
  try { return canonicalFavoriteIds(serialized ? JSON.parse(serialized) : [], validIds); } catch { return []; }
}

export function serializeFavorites(ids: string[], validIds: ReadonlySet<string>): string {
  const record: FavoritesRecord = { version: 1, ids: canonicalFavoriteIds(ids, validIds) };
  return JSON.stringify(record);
}

export function toggleFavorite(ids: string[], id: string, validIds: ReadonlySet<string>): string[] {
  const current = canonicalFavoriteIds(ids, validIds);
  if (!validIds.has(id)) return current;
  return current.includes(id) ? current.filter(value => value !== id) : [...current, id];
}
