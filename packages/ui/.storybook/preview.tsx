import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { THEMES, type Theme } from '../src/lib/settingsCookie';

import '@fortawesome/fontawesome-free/css/all.min.css';
import '../src/styles/index.scss';
import './preview.scss';

const defaultTheme: Theme = THEMES.includes('dark') ? 'dark' : THEMES[0];

const themeToolbarItems = THEMES.map((value) => ({
  value,
  title: value.charAt(0).toUpperCase() + value.slice(1),
}));

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Theme for the canvas (from project THEMES)',
      defaultValue: defaultTheme,
      toolbar: {
        icon: 'circlehollow',
        items: themeToolbarItems,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const raw = context.globals.theme as string | undefined;
      const theme: Theme = raw !== undefined && THEMES.includes(raw as Theme) ? (raw as Theme) : defaultTheme;
      return (
        <ThemeProvider key={theme} defaultTheme={theme} storageKey="storybook-theme">
          <div
            style={{
              padding: '3rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxSizing: 'border-box',
            }}
          >
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
