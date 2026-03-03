'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AppHeader as UIAppHeader, AppTypeTitle, Link } from '@boilerplate/ui';

import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../lib/routes';

function getTitleIcon(): string | undefined {
  const icon =
    typeof process.env.NEXT_PUBLIC_APP_TITLE_ICON === 'string'
      ? process.env.NEXT_PUBLIC_APP_TITLE_ICON.trim()
      : '';
  return icon !== '' ? icon : undefined;
}

export function AppHeader() {
  const t = useTranslations('common');
  const { user, logout } = useAuth();
  const router = useRouter();
  const titleIcon = getTitleIcon();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  const headerUser =
    user !== null ? { displayName: user.displayName ?? null, email: user.email } : null;

  return (
    <UIAppHeader
      title={<AppTypeTitle appName={t('appTitle')} titleIcon={titleIcon} />}
      homeHref={ROUTES.HOME}
      user={headerUser}
      onLogout={handleLogout}
      navItems={[
        { href: ROUTES.PROFILE, label: t('profile') },
        { href: ROUTES.SETTINGS, label: t('settings') },
      ]}
      LinkComponent={Link}
    />
  );
}
