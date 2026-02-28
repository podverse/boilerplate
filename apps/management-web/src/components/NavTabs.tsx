'use client';

import { useTranslations } from 'next-intl';
import { Link, Tabs } from '@boilerplate/ui';

import { ROUTES } from '../lib/routes';

export function NavTabs() {
  const t = useTranslations('common');
  const items = [
    { href: ROUTES.DASHBOARD, label: t('dashboard') },
    { href: ROUTES.ADMINS, label: t('admins') },
    { href: ROUTES.EVENTS, label: t('events') },
  ];
  return <Tabs items={items} LinkComponent={Link} />;
}
