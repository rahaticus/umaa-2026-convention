'use client';

import { Session, displayTime, sessionSlug } from '@/lib/data';

async function shareMessage(message: string) {
  try {
    if (navigator.share) await navigator.share({ text: message });
    else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(message); alert('Share text copied'); }
    else prompt('Copy this text:', message);
  } catch (error) {
    if ((error as DOMException).name !== 'AbortError') prompt('Copy this text:', message);
  }
}

function originPath(path: string) { return `${location.origin}${path}`; }

export function SessionShare({ session }: { session: Session }) {
  const share = () => {
    const speakers = session.speakerNames.map(name => `- ${name}`).join('\n');
    const body = session.shortDescription || '';
    const message = [`*${session.title}*`, speakers, body, originPath(`/sessions/${sessionSlug(session)}`)].filter((part, index) => index === 0 || part !== '').join('\n\n');
    return shareMessage(message);
  };
  return <button type="button" className="plain-button" onClick={share}>Share</button>;
}

type Appearance = Pick<Session, 'date' | 'startTime' | 'title'>;
const weekday = (date: string) => new Intl.DateTimeFormat('en-CA', { weekday: 'long', timeZone: 'America/Toronto' }).format(new Date(`${date}T12:00:00Z`));
const time = (value: string | null) => value ? new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Toronto' }).format(new Date(`2026-01-01T${value}:00`)) : 'Time TBA';

export function SpeakerShare({ name, slug, appearances }: { name: string; slug: string; appearances: Appearance[] }) {
  const share = () => shareMessage([`*${name}*`, appearances.map(session => `${weekday(session.date)}, ${time(session.startTime)} — ${session.title}`).join('\n'), originPath(`/speakers/${slug}`)].join('\n\n'));
  return <button type="button" className="plain-button" onClick={share}>Share</button>;
}

export function MyScheduleShare({ saved }: { saved: Session[] }) {
  const groups = ['2026-10-09', '2026-10-10', '2026-10-11'].map(date => ({ date, sessions: saved.filter(session => session.date === date) })).filter(group => group.sessions.length);
  const share = () => shareMessage(['*My UMAA 2026 Schedule*', ...groups.map(group => `*${new Intl.DateTimeFormat('en-CA', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Toronto' }).format(new Date(`${group.date}T12:00:00Z`))}*\n${group.sessions.map(session => `${displayTime(session).split(' – ')[0]} — ${session.title}`).join('\n')}`), originPath('/my-schedule')].join('\n\n'));
  return <button type="button" className="plain-button" onClick={share}>Share My Schedule</button>;
}
