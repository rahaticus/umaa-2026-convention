'use client';

import Link from 'next/link';
import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Salaat } from '@/components/salaat';
import { displayTime, sessionSlug, sessions } from '@/lib/data';

const rooms = [['maple', 'Maple'], ['evergreen', 'Evergreen'], ['primrose', 'Primrose'], ['jasmine', 'Jasmine'], ['orchid', 'Orchid'], ['violet', 'Violet'], ['butternut', 'Butternut'], ['holly', 'Holly']] as const;
const combined: Record<string, string[]> = { orchid_violet: ['orchid', 'violet'], holly_butternut: ['holly', 'butternut'] };
const roomKey = (name: string) => name.toLowerCase().replace(/\s*\+\s*/g, '_').replace(/\s+/g, '_');
const chronological = (a: typeof sessions[number], b: typeof sessions[number]) => `${a.date}|${a.startTime || '99:99'}|${a.title}|${a.id}`.localeCompare(`${b.date}|${b.startTime || '99:99'}|${b.title}|${b.id}`);

function Content() {
  const selected = useSearchParams().get('room') || '';
  const active = combined[selected] || [selected];
  const selectedName = rooms.find(([id]) => id === selected)?.[1] || selected.replaceAll('_', ' + ');
  const roomSessions = useMemo(() => selected ? sessions.filter(session => {
    const key = roomKey(session.room || '');
    const sessionRooms = combined[key] || [key];
    return sessionRooms.some(id => active.includes(id));
  }).sort(chronological) : [], [active.join(','), selected]);

  return <div id="content" className="container">
    <section className="hero compact"><p className="eyebrow">Hilton Toronto/Markham</p><h1>Venue</h1><p>8500 Warden Avenue, Markham, Ontario L6G 1A5</p></section>
    <Salaat />
    <section className="map"><div className="map-head">Level 2 · Conference rooms</div><div className="map-grid">{rooms.map(([id, name]) => <Link href={`/venue?room=${id}`} className={active.includes(id) ? 'selected' : selected ? 'dim' : ''} key={id}>{name}</Link>)}</div><div className="orientation"><span>↑ Elevator & restrooms</span><span>Foyer / conference centre</span></div></section>
    {selected && <section className="venue-selection"><b>{selectedName}</b><span>Highlighted on the conference map.</span><Link href="/venue">Return to full map</Link>{roomSessions.length ? <div className="room-schedule"><h2>Schedule in this room</h2>{roomSessions.map(session => <Link key={session.id} href={`/sessions/${sessionSlug(session)}`}><time>{session.date} · {displayTime(session)}</time><b>{session.title}</b></Link>)}</div> : <p className="room-empty">No scheduled sessions in this room.</p>}</section>}
    <section><h2>Rooms</h2><div className="room-list"><Link href="/venue?room=maple"><b>Maple</b></Link><Link href="/venue?room=evergreen"><b>Evergreen</b></Link><Link href="/venue?room=primrose"><b>Primrose</b></Link><Link href="/venue?room=jasmine"><b>Jasmine</b></Link><Link href="/venue?room=orchid_violet"><b>Orchid + Violet</b></Link><Link href="/venue?room=holly_butternut"><b>Holly + Butternut</b></Link></div></section>
  </div>;
}

export default function Venue() { return <Suspense fallback={<div className="container">Loading venue…</div>}><Content /></Suspense>; }
