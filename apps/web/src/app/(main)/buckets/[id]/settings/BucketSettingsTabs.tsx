'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link, Tabs } from '@boilerplate/ui';
import type { BucketSettingsTab } from '../../../../../lib/routes';
import { bucketSettingsRoute } from '../../../../../lib/routes';

type BucketSettingsTabsProps = {
  bucketId: string;
  activeTab: BucketSettingsTab;
};

export function BucketSettingsTabs({ bucketId, activeTab }: BucketSettingsTabsProps) {
  const t = useTranslations('buckets');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const currentHref =
    pathname !== null && pathname !== undefined
      ? `${pathname}${tabParam !== null && tabParam !== '' ? `?tab=${tabParam}` : ''}`
      : bucketSettingsRoute(bucketId, activeTab);
  const items = [
    { href: bucketSettingsRoute(bucketId), label: t('general') },
    { href: bucketSettingsRoute(bucketId, 'admins'), label: t('admins') },
  ];
  return <Tabs items={items} LinkComponent={Link} activeHref={currentHref} exactMatch />;
}
