'use client';

import { ThemeToggle } from '@boilerplate/ui';

export function AppHeader({ appName }: { appName: string }) {
  return (
    <header className="header-bar">
      <h1 style={{ margin: 0 }}>{appName}</h1>
      <ThemeToggle />
    </header>
  );
}
