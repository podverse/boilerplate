'use client';

import { ThemeProvider } from '@boilerplate/ui';

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
