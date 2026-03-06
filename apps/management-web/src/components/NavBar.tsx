'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AppTypeTitle, NavBar as UINavBar } from '@boilerplate/ui';

import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../lib/routes';

export type NavBarMainNavItem = { href: string; label: string };

function getTitleIcon(): string | undefined {
  const icon =
    typeof process.env.NEXT_PUBLIC_APP_TITLE_ICON === 'string'
      ? process.env.NEXT_PUBLIC_APP_TITLE_ICON.trim()
      : '';
  return icon !== '' ? icon : undefined;
}

export function NavBar({ mainNavItems }: { mainNavItems: NavBarMainNavItem[] }) {
  const t = useTranslations('common');
  const { user, logout } = useAuth();
  const router = useRouter();
  const titleIcon = getTitleIcon();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  const navItems = [...mainNavItems, { href: ROUTES.SETTINGS, label: t('settings') }];

  return (
    <UINavBar
      title={<AppTypeTitle appName={t('appTitle')} titleIcon={titleIcon} />}
      homeHref={ROUTES.HOME}
      user={user}
      onLogout={handleLogout}
      navItems={navItems}
      loginHref={ROUTES.LOGIN}
    />
  );
}
