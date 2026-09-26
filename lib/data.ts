import rawSessions from '@/data/sessions_seed.json';
import rawBios from '@/data/speaker_bios_clean.json';
import aliases from '@/data/speaker_aliases_review.json';
import roomsData from '@/data/rooms.json';

export type PersonRole = 'speakerNames'|'moderatorNames'|'facilitatorNames'|'emceeNames';
export type Session = (typeof rawSessions.sessions)[number];
export const sessions: Session[] = rawSessions.sessions;
/** Explicit program-audience metadata only; never inferred from title or speakers. */
export function isLadiesOnly(session: Session) { return session.audience.includes('ladies only') || session.audience.includes('females only'); }
export const rooms = roomsData.rooms;
export const slugify=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
const bioRows = rawBios.speakers;
const confirmed = new Map(aliases.matches.filter(x=>x.status==='confirmed').map(x=>[x.programName,x.sourceName]));
export function allNamedPeople(){ return [...new Set(sessions.flatMap(s=>['speakerNames','moderatorNames','facilitatorNames','emceeNames'].flatMap(k=>(s[k as PersonRole]||[]))).filter(n=>!['Aqeelah Publishing','Al Kisa Foundation','Imamia Medics International','UMAA'].includes(n)))].sort((a,b)=>a.localeCompare(b)); }
export function person(name:string){ const source=confirmed.get(name) || name; const row=bioRows.find(x=>x.sourceName===source); return {name,slug:slugify(name),bio:row?.bio?.trim() || 'Bio not currently available',role:row?.role || null,matchStatus: confirmed.has(name)?'confirmed':row?'exact':'unmatched'}; }
export function people(){return allNamedPeople().map(person)}
export function sessionSlug(s:Session){return `${slugify(s.title)}-${s.id}`}
export function bySlug(slug:string){return sessions.find(s=>sessionSlug(s)===slug)}
export function personBySlug(slug:string){return people().find(p=>p.slug===slug)}
export function appearances(name:string){return sessions.filter(s=>['speakerNames','moderatorNames','facilitatorNames','emceeNames'].some(k=>(s[k as PersonRole] as string[]).includes(name))).sort((a,b)=>`${a.date}${a.startTime||'99'}`.localeCompare(`${b.date}${b.startTime||'99'}`));}
export function roleIn(s:Session,name:string){ const a:Record<PersonRole,string>={speakerNames:'Speaker',moderatorNames:'Moderator',facilitatorNames:'Facilitator',emceeNames:'Emcee'}; return (Object.keys(a) as PersonRole[]).filter(k=>(s[k] as string[]).includes(name)).map(k=>a[k]).join(', '); }
export function displayTime(s:Session){return s.timeLabel || (s.startTime ? `${formatTime(s.startTime)}${s.endTime?` – ${formatTime(s.endTime)}`:''}` : 'Anytime / special timing');}
function formatTime(t:string){const [h,m]=t.split(':').map(Number);return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`}
export function roomId(name:string){return rooms.find(r=>r.displayName.toLowerCase()===name.toLowerCase())?.id || slugify(name)}
