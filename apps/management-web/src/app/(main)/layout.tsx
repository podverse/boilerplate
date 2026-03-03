import { getTranslations } from 'next-intl/server';
import { Main } from '@boilerplate/ui';

import { AppHeader } from '../../components/AppHeader';
import { getVisibleNavItems } from '../../lib/main-nav';
import { ROUTES } from '../../lib/routes';
import { getServerUser } from '../../lib/server-auth';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  const t = await getTranslations('common');
  const allNavItems = getVisibleNavItems(
    user?.isSuperAdmin === true,
    user?.permissions ?? null,
    (key) => t(key)
  );
  const mainNavItems = allNavItems.filter((item) => item.href !== ROUTES.DASHBOARD);

  return (
    <>
      <AppHeader mainNavItems={mainNavItems} />
      <Main>{children}</Main>
    </>
  );
}
