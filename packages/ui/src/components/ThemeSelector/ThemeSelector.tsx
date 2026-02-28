'use client';

import { useTranslations } from 'next-intl';
import { Select } from '../Select';
import { THEMES, type Theme } from '../../lib/settingsCookie';
import { useTheme } from '../../contexts/ThemeContext';

function isTheme(value: string): value is Theme {
  return THEMES.includes(value as Theme);
}

export function ThemeSelector() {
  const t = useTranslations('ui.themeSelector');
  const { theme, setTheme } = useTheme();
  const options = THEMES.map((value) => ({ value, label: t(value) }));
  return (
    <Select
      options={options}
      value={theme}
      onChange={(value) => {
        if (isTheme(value)) setTheme(value);
      }}
      aria-label={t('groupAriaLabel')}
    />
  );
}
