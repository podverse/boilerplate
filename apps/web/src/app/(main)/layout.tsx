import { Main } from '@boilerplate/ui';

import { getRuntimeConfig } from '../../config/runtime-config-store';
import { NavBar } from '../../components/NavBar';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const runtimeConfig = getRuntimeConfig();
  const appName = runtimeConfig.env.NEXT_PUBLIC_APP_NAME ?? 'boilerplate-web';
  return (
    <>
      <NavBar appName={appName} />
      <Main>{children}</Main>
    </>
  );
}
