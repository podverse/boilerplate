'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AppHeader as UIAppHeader, AppTypeTitle } from '@boilerplate/ui';

import { useAuth } from '../context/AuthContext';
import { getRuntimeConfig } from '../config/runtime-config-store';
import { ROUTES } from '../lib/routes';

export function AppHeader({ appName }: { appName: string }) {
  const t = useTranslations('common');
  const { user, logout } = useAuth();
  const router = useRouter();
  const runtimeConfig = getRuntimeConfig();
  const titleIcon = runtimeConfig.env.NEXT_PUBLIC_APP_TITLE_ICON?.trim() || undefined;

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  const title = <AppTypeTitle appName={appName} titleIcon={titleIcon} />;

  return (
    <UIAppHeader
      title={title}
      homeHref={ROUTES.HOME}
      user={user}
      onLogout={handleLogout}
      navItems={[
        { href: ROUTES.DASHBOARD, label: t('dashboard') },
        { href: ROUTES.SETTINGS, label: t('settings') },
      ]}
      loginHref={ROUTES.LOGIN}
    />
  );
}
