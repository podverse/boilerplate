import { getTranslations } from 'next-intl/server';

import { Main } from '@boilerplate/ui';

import { NavBar } from '../../components/NavBar';
import { getAppTitleIcon } from '../../config/env';
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
  const titleIcon = getAppTitleIcon();

  return (
    <>
      <NavBar mainNavItems={mainNavItems} titleIcon={titleIcon} />
      <Main>{children}</Main>
    </>
  );
}
