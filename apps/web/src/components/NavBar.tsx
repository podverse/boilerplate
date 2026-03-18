'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { AppTypeTitle, NavBar as UINavBar } from '@boilerplate/ui';

import { getRuntimeConfig } from '../config/runtime-config-store';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../lib/routes';

export function NavBar({ brandName }: { brandName: string }) {
  const t = useTranslations('common');
  const { user, logout } = useAuth();
  const router = useRouter();
  const runtimeConfig = getRuntimeConfig();
  const titleIcon = runtimeConfig.env.NEXT_PUBLIC_APP_TITLE_ICON?.trim() || undefined;

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  const title = <AppTypeTitle brandName={brandName} titleIcon={titleIcon} />;

  return (
    <UINavBar
      title={title}
      homeHref={ROUTES.HOME}
      user={user}
      onLogout={handleLogout}
      navItems={[
        { href: ROUTES.BUCKETS, label: t('buckets') },
        { href: ROUTES.SETTINGS, label: t('settings') },
      ]}
      loginHref={ROUTES.LOGIN}
    />
  );
}
