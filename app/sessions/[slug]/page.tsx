import { notFound } from 'next/navigation';
import Link from 'next/link';
import { bySlug, displayTime, sessionSlug, slugify, roomId, sessions } from '@/lib/data';
import { Favorite } from '@/components/controls';
import { SessionShare } from '@/components/share-controls';
export function generateStaticParams(){return sessions.map(s=>({slug:sessionSlug(s)}))}
export default async function SessionPage({params}:{params:Promise<{slug:string}>}){
  const s=bySlug((await params).slug); if(!s)return notFound();
  const entries=[['Speakers',s.speakerNames],['Moderators',s.moderatorNames],['Facilitators',s.facilitatorNames],['Emcees',s.emceeNames]] as const;
  return <div id="content" className="container detail"><Link className="back" href="/schedule">← Schedule</Link><p className="eyebrow">{s.category}</p><h1>{s.title}</h1>{s.subtitle&&<p className="subtitle">{s.subtitle}</p>}<div className="detail-meta"><b>{displayTime(s)}</b><Link href={`/venue?room=${roomId(s.room)}`}>⌖ {s.room}</Link></div><div className="actions"><Favorite id={s.id}/><a className="plain-button" href={`/api/calendar/${s.id}`}>Add to calendar</a><SessionShare session={s}/></div>{s.shortDescription&&<p className="description">{s.shortDescription}</p>}<div className="detail-participants">{entries.map(([label,names])=>names.length?<section className="participant-group" key={label}><span className="participant-role">{label}</span><div className="participant-list">{names.map(n=><Link className="participant-chip" key={n} href={`/speakers/${slugify(n)}`}>{n}</Link>)}</div></section>:null)}</div>{s.audience.length>0&&<section><h2>Audience</h2><p>{s.audience.join(' · ')}</p></section>}<p className="source">Program source: page {s.sourcePages.join(', ')}</p></div>;
}
