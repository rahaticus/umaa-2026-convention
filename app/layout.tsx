import type { Metadata } from 'next';
import './globals.css';
import './future.css';
import './theme.css';
import './schedule-additions.css';
import './venue-salaat.css';
import './save-header.css';
import './clear-dialog.css';
import './mobile-nav.css';
import './room-schedule.css';
import './schedule-views-mobile.css';
import { Header, BottomNav } from '@/components/nav';
import { AppearanceControl } from '@/components/appearance';

export const metadata: Metadata = { title: 'UMAA 2026 Convention', description: 'The Next Chapter: From Identity to Impact', manifest: '/manifest.webmanifest', icons: { icon: '/umaa-logo.png' } };

const themeScript = "(()=>{const p=localStorage.getItem('umaa2026:theme');document.documentElement.dataset.theme=p==='light'||p==='dark'?p:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')})()";
const serviceWorkerScript = process.env.NODE_ENV === 'development'
  ? "(()=>{if(!('serviceWorker'in navigator))return;const k='umaa2026:dev-cache-cleared';if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,'1');window.addEventListener('load',()=>navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.map(r=>r.unregister()))).then(()=>caches.keys()).then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).finally(()=>location.reload()))})()"
  : "if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><Header /><main>{children}</main><AppearanceControl /><BottomNav /><script dangerouslySetInnerHTML={{ __html: serviceWorkerScript }} /></body></html>;
}
