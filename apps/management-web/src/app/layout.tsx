import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AppView, getThemeFromSettingsCookieValue, ThemeWrapper } from '@boilerplate/ui';
import { AuthWrapper } from '../components/AuthWrapper';

import '../styles/globals.scss';

const SETTINGS_COOKIE_NAME = 'management-settings';

export const metadata: Metadata = {
  title: 'boilerplate-management-web',
  description: 'boilerplate-management-web app',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const cookieStore = await cookies();
  const initialTheme = getThemeFromSettingsCookieValue(
    cookieStore.get(SETTINGS_COOKIE_NAME)?.value
  );
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeWrapper initialTheme={initialTheme} settingsCookieName={SETTINGS_COOKIE_NAME}>
            <AuthWrapper>
              <AppView>{children}</AppView>
            </AuthWrapper>
          </ThemeWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
