'use client';

import { useTheme } from './ThemeContext.js';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
}
