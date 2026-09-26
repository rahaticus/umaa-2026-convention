import Link from 'next/link';
import { Favorite } from './controls';
import { Session, displayTime, sessionSlug, slugify, roomId } from '@/lib/data';

const roleGroups = [['Speakers', 'speakerNames'], ['Moderator', 'moderatorNames'], ['Facilitator', 'facilitatorNames'], ['Emcee', 'emceeNames']] as const;

export function SessionCard({ s }: { s: Session }) {
  return <article className="session-card" data-category={s.category}>
    <div className="session-top"><time>{displayTime(s)}</time><Favorite id={s.id} /></div>
    <Link href={`/sessions/${sessionSlug(s)}`} className="session-title">{s.title}</Link>
    {s.subtitle && <p className="subtitle">{s.subtitle}</p>}
    <Link className="room" href={`/venue?room=${roomId(s.room)}`}><span aria-hidden="true">⌖</span>{s.room || 'Room to be announced'}</Link>
    <div className="badges"><span>{s.category.replace(/_/g, ' ')}</span>{s.audience.map(x => <span key={x}>{x}</span>)}</div>
    {s.shortDescription && <p className="session-description">{s.shortDescription}</p>}
    <div className="participant-area">
      {roleGroups.map(([role, key]) => s[key].length ? <div className="participant-group" key={key}>
        <span className="participant-role">{role}</span>
        <div className="participant-list">{s[key].map(name => <Link key={name} className="participant-chip" href={`/speakers/${slugify(name)}`}>{name}</Link>)}</div>
      </div> : null)}
    </div>
    {s.notes && <p className="note">{s.notes}</p>}
  </article>;
}
