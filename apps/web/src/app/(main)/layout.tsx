import { Main } from '@boilerplate/ui';

import { getRuntimeConfig } from '../../config/runtime-config-store';
import { AppHeader } from '../../components/AppHeader';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const runtimeConfig = getRuntimeConfig();
  const appName = runtimeConfig.env.NEXT_PUBLIC_APP_NAME ?? 'boilerplate-web';
  return (
    <>
      <AppHeader appName={appName} />
      <Main>{children}</Main>
    </>
  );
}
