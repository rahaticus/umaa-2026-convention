'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const links=[['/schedule','Schedule','▦'],['/my-schedule','My Schedule','♡'],['/speakers','Speakers','◉'],['/venue','Venue','⌖']];
export function Header(){return <><a className="skip" href="#content">Skip to content</a><header><Link href="/schedule" aria-label="UMAA 2026 schedule"><img src="/umaa-logo.png" alt="UMAA"/></Link><div className="event-mark"><b>Annual Convention 2026</b><span>Toronto · Oct 9–11</span></div><Link className="search-link" href="/search" aria-label="Search the program">⌕ <span>Search</span></Link></header></>}
export function BottomNav(){const path=usePathname();return <nav className="bottom-nav" aria-label="Primary">{links.map(([href,label,icon])=><Link key={href} href={href} className={path.startsWith(href)?'active':''}><span aria-hidden="true">{icon}</span>{label}</Link>)}</nav>}
