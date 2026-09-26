'use client';

import { useEffect, useState } from 'react';
import { sessions } from '@/lib/data';
import { FAVORITES_CHANGED_EVENT, FAVORITES_STORAGE_KEY, parseFavorites, serializeFavorites, toggleFavorite } from '@/lib/favorites';

const canonicalIds = new Set(sessions.map(session => session.id));
const readFavorites = () => parseFavorites(localStorage.getItem(FAVORITES_STORAGE_KEY), canonicalIds);

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setIds(readFavorites());
    sync();
    window.addEventListener(FAVORITES_CHANGED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(FAVORITES_CHANGED_EVENT, sync); window.removeEventListener('storage', sync); };
  }, []);
  const persist = (next: string[]) => {
    const serialized = serializeFavorites(next, canonicalIds);
    localStorage.setItem(FAVORITES_STORAGE_KEY, serialized);
    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
    setIds(parseFavorites(serialized, canonicalIds));
  };
  const toggle = (id: string) => persist(toggleFavorite(readFavorites(), id, canonicalIds));
  return { ids, toggle, setIds: persist };
}

export function Favorite({ id }: { id: string }) {
  const { ids, toggle } = useFavorites();
  const saved = ids.includes(id);
  return <button type="button" className={`favorite ${saved ? 'saved' : ''}`} onClick={() => toggle(id)} aria-label={`${saved ? 'Remove' : 'Add'} this session ${saved ? 'from' : 'to'} My Schedule`} aria-pressed={saved}>{saved ? '♥ Saved' : '♡ Save'}</button>;
}

export function Share({ title }: { title: string }) {
  const share = async () => {
    const url = location.href;
    try { if (navigator.share) await navigator.share({ title, url }); else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); alert('Link copied'); } else { prompt('Copy this link:', url); } }
    catch (error) { if ((error as DOMException).name !== 'AbortError') prompt('Copy this link:', url); }
  };
  return <button type="button" className="plain-button" onClick={share}>Share</button>;
}
