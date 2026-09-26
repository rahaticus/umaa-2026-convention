'use client';

import { useEffect, useMemo, useState } from 'react';
import { isLadiesOnly, sessionDescription, sessions } from '@/lib/data';
import { SessionCard } from './session-card';

const days = [['2026-10-09', 'Friday', 'October 9, 2026'], ['2026-10-10', 'Saturday', 'October 10, 2026'], ['2026-10-11', 'Sunday', 'October 11, 2026']] as const;
const dayIds = days.map(([date]) => date);
const views = [['full', 'Full Schedule'], ['main', 'Main Sessions Only'], ['workshops', 'Workshops Only'], ['children', "Children's Program Only"], ['ladies', 'Ladies Only']] as const;
type View = typeof views[number][0];

function isView(value: string | null): value is View { return views.some(([id]) => id === value); }

export function ScheduleClient() {
  const [openDays, setOpenDays] = useState<string[]>(['2026-10-09']);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [room, setRoom] = useState('');
  const [view, setView] = useState<View>('full');

  useEffect(() => {
    const syncFromUrl = () => {
      const value = new URLSearchParams(window.location.search).get('view');
      setView(isView(value) ? value : 'full');
      setOpenDays(dayIds);
    };
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const chooseView = (next: View) => {
    setView(next);
    setOpenDays(dayIds);
    const url = new URL(window.location.href);
    if (next === 'full') url.searchParams.delete('view'); else url.searchParams.set('view', next);
    window.history.pushState({}, '', url);
  };

  const rooms = useMemo(() => [...new Set(sessions.map(s => s.room).filter(Boolean))].sort(), []);
  const categories = useMemo(() => [...new Set(sessions.map(s => s.category))].sort(), []);
  const list = useMemo(() => sessions.filter(s => {
    const matchesView = view === 'full' || (view === 'main' && s.category === 'main session') || (view === 'workshops' && s.category === 'workshop') || (view === 'children' && s.category === 'children') || (view === 'ladies' && isLadiesOnly(s));
    const searchable = [s.title, s.room, s.category, sessionDescription(s), ...s.speakerNames, ...s.moderatorNames, ...s.facilitatorNames].join(' ').toLowerCase();
    return matchesView && searchable.includes(query.toLowerCase()) && (!category || s.category === category) && (!room || s.room === room);
  }), [category, query, room, view]);
  const clearFilters = () => { setQuery(''); setCategory(''); setRoom(''); };

  return <div id="content" className="container">
    <section className="hero"><p className="eyebrow">UMAA Annual Convention</p><h1>The Next Chapter</h1><p>From Identity to Impact · Hilton Toronto/Markham</p></section>
    <div className="schedule-views" role="group" aria-label="Schedule view">
      {views.map(([id, label]) => <button type="button" aria-pressed={view === id} className={view === id ? 'active' : ''} key={id} onClick={() => chooseView(id)}>{label}</button>)}
    </div>
    <section className="tools" aria-label="Schedule filters">
      <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search sessions, speakers, rooms…" aria-label="Search schedule" />
      <select value={category} onChange={event => setCategory(event.target.value)} aria-label="Filter by category"><option value="">All categories</option>{categories.map(value => <option key={value} value={value}>{value.replace(/\b\w/g, letter => letter.toUpperCase())}</option>)}</select>
      <select value={room} onChange={event => setRoom(event.target.value)} aria-label="Filter by room"><option value="">All rooms</option>{rooms.map(value => <option key={value} value={value}>{value}</option>)}</select>
      <button type="button" onClick={clearFilters} disabled={!query && !category && !room}>Clear filters</button>
    </section>
    {days.map(([date, day, long]) => {
      const daySessions = list.filter(session => session.date === date);
      return <section className="day" key={date}>
        <button type="button" className="day-toggle" onClick={() => setOpenDays(current => current.includes(date) ? current.filter(value => value !== date) : [...current, date])} aria-expanded={openDays.includes(date)} aria-controls={`day-${date}`}>
          <span><b>{day}</b><small>{long}</small></span><span aria-hidden="true">{openDays.includes(date) ? '−' : '+'}</span>
        </button>
        {openDays.includes(date) && <div id={`day-${date}`} className="day-list">{daySessions.map(session => <SessionCard key={session.id} s={session} />)}</div>}
      </section>;
    })}
  </div>;
}
