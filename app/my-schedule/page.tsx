'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { sessions } from '@/lib/data';
import { useFavorites } from '@/components/controls';
import { SessionCard } from '@/components/session-card';
import { MyScheduleShare } from '@/components/share-controls';

const days = [['2026-10-09', 'Friday', 'October 9'], ['2026-10-10', 'Saturday', 'October 10'], ['2026-10-11', 'Sunday', 'October 11']] as const;
function conflicts(a: typeof sessions[number], b: typeof sessions[number]) { return a.date === b.date && a.startTime && a.endTime && b.startTime && b.endTime && a.startTime < b.endTime && b.startTime < a.endTime; }
function chronological(a: typeof sessions[number], b: typeof sessions[number]) { return `${a.date}|${a.startTime || '99:99'}|${a.title}|${a.id}`.localeCompare(`${b.date}|${b.startTime || '99:99'}|${b.title}|${b.id}`); }

export default function MySchedule() {
  const { ids, setIds } = useFavorites();
  const [confirming, setConfirming] = useState(false);
  const clearButton = useRef<HTMLButtonElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const confirmButton = useRef<HTMLButtonElement>(null);
  const saved = useMemo(() => sessions.filter(session => ids.includes(session.id)).sort(chronological), [ids]);
  const conflictsById = new Set(saved.flatMap(a => saved.filter(b => a.id !== b.id && conflicts(a, b)).map(b => b.id)));

  useEffect(() => {
    if (!confirming) return;
    cancelButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setConfirming(false); clearButton.current?.focus(); }
      if (event.key === 'Tab') {
        const controls = [cancelButton.current, confirmButton.current].filter(Boolean) as HTMLButtonElement[];
        const current = controls.indexOf(document.activeElement as HTMLButtonElement);
        if (event.shiftKey && current <= 0) { event.preventDefault(); controls.at(-1)?.focus(); }
        else if (!event.shiftKey && current === controls.length - 1) { event.preventDefault(); controls[0]?.focus(); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [confirming]);

  const cancel = () => { setConfirming(false); requestAnimationFrame(() => clearButton.current?.focus()); };
  const clearAll = () => { setIds([]); setConfirming(false); requestAnimationFrame(() => clearButton.current?.focus()); };

  return <div id="content" className="container">
    <section className="hero compact"><p className="eyebrow">Your personal plan</p><h1>My Schedule</h1><p>Saved on this device. No account required.</p></section>
    {saved.length ? <>
      <div className="schedule-actions"><MyScheduleShare saved={saved}/><button ref={clearButton} type="button" className="clear-all" onClick={() => setConfirming(true)}>Clear All</button></div>
      <div className="conflict" hidden={!conflictsById.size}>Schedule conflict: some saved sessions overlap. You can keep both, but plan accordingly.</div>
      {days.map(([date, day, long]) => { const entries = saved.filter(session => session.date === date); return entries.length ? <section className="saved-day" key={date}><h2>{day} <span>{long}</span></h2><div className="day-list">{entries.map(session => <div key={session.id}>{conflictsById.has(session.id) && <p className="conflict mini">Schedule conflict</p>}<SessionCard s={session} /></div>)}</div></section> : null; })}
    </> : <div className="empty"><h2>No saved sessions yet</h2><p>Save sessions from the schedule to build a personal itinerary.</p><Link href="/schedule">Browse schedule</Link></div>}
    {confirming && <div className="dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) cancel(); }}><section className="clear-dialog" role="dialog" aria-modal="true" aria-labelledby="clear-title" aria-describedby="clear-description"><h2 id="clear-title">Clear all saved sessions?</h2><p id="clear-description">This will remove every session from My Schedule.</p><div><button ref={cancelButton} type="button" className="plain-button" onClick={cancel}>Cancel</button><button ref={confirmButton} type="button" className="clear-confirm" onClick={clearAll}>Clear All</button></div></section></div>}
  </div>;
}
