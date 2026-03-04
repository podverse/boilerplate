'use client';

import { useTranslations } from 'next-intl';
import { Link, Tabs } from '@boilerplate/ui';
import { bucketSettingsRoute, bucketSettingsAdminsRoute } from '../../../../../lib/routes';

type BucketSettingsTabsProps = {
  bucketId: string;
};

export function BucketSettingsTabs({ bucketId }: BucketSettingsTabsProps) {
  const t = useTranslations('buckets');
  const items = [
    { href: bucketSettingsRoute(bucketId), label: t('general') },
    { href: bucketSettingsAdminsRoute(bucketId), label: t('admins') },
  ];
  return <Tabs items={items} LinkComponent={Link} exactMatch />;
}
