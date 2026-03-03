import { getTranslations } from 'next-intl/server';
import { Main } from '@boilerplate/ui';

import { getRuntimeConfig } from '../../config/runtime-config-store';
import { AppHeader } from '../../components/AppHeader';
import { NavTabs } from '../../components/NavTabs';
import { ROUTES } from '../../lib/routes';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const runtimeConfig = getRuntimeConfig();
  const appName = runtimeConfig.env.NEXT_PUBLIC_APP_NAME ?? 'boilerplate-web';
  const t = await getTranslations('common');
  const navItems = [
    { href: ROUTES.DASHBOARD, label: t('dashboard') },
    { href: ROUTES.BUCKETS, label: t('buckets') },
  ];
  return (
    <>
      <AppHeader appName={appName} />
      <NavTabs items={navItems} />
      <Main>{children}</Main>
    </>
  );
}
