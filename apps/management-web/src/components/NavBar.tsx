'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { AppTypeTitle, NavBar as UINavBar } from '@boilerplate/ui';

import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../lib/routes';

export type NavBarMainNavItem = { href: string; label: string };

function getTitleIconFallback(): string | undefined {
  const icon =
    typeof process.env.NEXT_PUBLIC_APP_TITLE_ICON === 'string'
      ? process.env.NEXT_PUBLIC_APP_TITLE_ICON.trim()
      : '';
  return icon !== '' ? icon : undefined;
}

export function NavBar({
  mainNavItems,
  titleIcon: titleIconProp,
}: {
  mainNavItems: NavBarMainNavItem[];
  titleIcon?: string | undefined;
}) {
  const t = useTranslations('common');
  const { user, logout } = useAuth();
  const router = useRouter();
  const titleIcon = titleIconProp ?? getTitleIconFallback();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  const navItems = [...mainNavItems, { href: ROUTES.SETTINGS, label: t('settings') }];

  return (
    <UINavBar
      title={<AppTypeTitle brandName={t('appTitle')} titleIcon={titleIcon} />}
      homeHref={ROUTES.HOME}
      user={user}
      onLogout={handleLogout}
      navItems={navItems}
      loginHref={ROUTES.LOGIN}
    />
  );
}
