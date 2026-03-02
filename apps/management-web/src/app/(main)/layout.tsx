import { getTranslations } from 'next-intl/server';
import { Main } from '@boilerplate/ui';

import { AppHeader } from '../../components/AppHeader';
import { NavTabs } from '../../components/NavTabs';
import { getVisibleNavItems } from '../../lib/main-nav';
import { getServerUser } from '../../lib/server-auth';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  const t = await getTranslations('common');
  const navItems = getVisibleNavItems(
    user?.isSuperAdmin === true,
    user?.permissions ?? null,
    (key) => t(key)
  );

  return (
    <>
      <AppHeader />
      <NavTabs items={navItems} />
      <Main>{children}</Main>
    </>
  );
}
