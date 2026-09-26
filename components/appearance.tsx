'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
const storageKey = 'umaa2026:theme';

export function AppearanceControl() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    const resolved: Theme = stored === 'dark' || stored === 'light'
      ? stored
      : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = resolved;
    setTheme(resolved);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    localStorage.setItem(storageKey, next);
    setTheme(next);
  };

  const switchingToDark = theme === 'light';
  return <div className="appearance"><button type="button" onClick={toggle} aria-label={switchingToDark ? 'Switch to dark mode' : 'Switch to light mode'} title={switchingToDark ? 'Switch to dark mode' : 'Switch to light mode'}>{switchingToDark ? '☾' : '☀'}</button></div>;
}
