'use client';

/// <reference lib="dom" />
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark';

export type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'boilerplate-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // ignore
    }
    return defaultTheme;
  });

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      try {
        if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, next);
      } catch {
        // ignore
      }
    },
    [storageKey]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
