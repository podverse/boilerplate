'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AppHeader as UIAppHeader, Link } from '@boilerplate/ui';

import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../lib/routes';

export function AppHeader() {
  const t = useTranslations('common');
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  const headerUser =
    user !== null ? { displayName: user.displayName ?? null, email: user.email } : null;

  return (
    <UIAppHeader
      title={t('appTitleManagement')}
      homeHref={ROUTES.HOME}
      user={headerUser}
      onLogout={handleLogout}
      navItems={[
        { href: ROUTES.DASHBOARD, label: t('dashboard') },
        { href: ROUTES.SETTINGS, label: t('settings') },
      ]}
      LinkComponent={Link}
    />
  );
}
