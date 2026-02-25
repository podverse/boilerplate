import type { Metadata } from 'next';
import { getRuntimeConfig } from '../config/runtime-config-store';
import RuntimeConfigScript from '../components/Head/RuntimeConfigScript';

export const metadata: Metadata = {
  title: 'Metaboost',
  description: 'Metaboost app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const runtimeConfig = getRuntimeConfig();
  const appName = runtimeConfig.env.NEXT_PUBLIC_APP_NAME ?? 'Metaboost';
  return (
    <html lang="en">
      <head>
        <RuntimeConfigScript runtimeConfig={runtimeConfig} />
      </head>
      <body>
        <header>
          <h1>{appName}</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
