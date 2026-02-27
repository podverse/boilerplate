import type { Metadata } from 'next';
import { getRuntimeConfig } from '../config/runtime-config-store';
import RuntimeConfigScript from '../components/Head/RuntimeConfigScript';
import { AppHeader } from '../components/AppHeader';
import { ThemeWrapper } from '../components/ThemeWrapper';

import '../styles/globals.scss';

export const metadata: Metadata = {
  title: 'Boilerplate',
  description: 'Boilerplate app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const runtimeConfig = getRuntimeConfig();
  const appName = runtimeConfig.env.NEXT_PUBLIC_APP_NAME ?? 'Boilerplate';
  return (
    <html lang="en">
      <head>
        <RuntimeConfigScript runtimeConfig={runtimeConfig} />
      </head>
      <body>
        <ThemeWrapper>
          <AppHeader appName={appName} />
          <main className="layout-main">{children}</main>
        </ThemeWrapper>
      </body>
    </html>
  );
}
