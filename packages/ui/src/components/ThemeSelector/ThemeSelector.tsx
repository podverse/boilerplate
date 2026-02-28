'use client';

import { useTranslations } from 'next-intl';
import { THEMES } from '../../lib/settingsCookie';
import { useTheme } from '../../contexts/ThemeContext';

import styles from './ThemeSelector.module.scss';

const THEME_OPTIONS = THEMES.map((value) => ({ value }));

export function ThemeSelector() {
  const t = useTranslations('ui.themeSelector');
  const { theme, setTheme } = useTheme();
  return (
    <div className={styles.root} role="group" aria-label={t('groupAriaLabel')}>
      {THEME_OPTIONS.map((opt) => {
        const label = t(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            className={theme === opt.value ? `${styles.option} ${styles.selected}` : styles.option}
            onClick={() => setTheme(opt.value)}
            aria-pressed={theme === opt.value}
            aria-label={t('useThemeAriaLabel', { theme: label })}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
