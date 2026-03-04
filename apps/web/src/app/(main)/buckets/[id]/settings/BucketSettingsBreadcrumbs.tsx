'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Breadcrumbs, Link } from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';
import {
  bucketDetailRoute,
  bucketSettingsRoute,
  bucketSettingsAdminsRoute,
} from '../../../../../lib/routes';

type BucketSettingsBreadcrumbsProps = {
  bucketId: string;
  bucketName: string;
};

function LinkAdapter({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function BucketSettingsBreadcrumbs({
  bucketId,
  bucketName,
}: BucketSettingsBreadcrumbsProps) {
  const pathname = usePathname();
  const t = useTranslations('buckets');

  const settingsPath = bucketSettingsRoute(bucketId);
  const adminsPath = bucketSettingsAdminsRoute(bucketId);
  const isEditAdmin =
    pathname !== null &&
    pathname !== undefined &&
    pathname.startsWith(adminsPath + '/') &&
    pathname.endsWith('/edit');

  const items: BreadcrumbItem[] = [
    { label: bucketName, href: bucketDetailRoute(bucketId) },
    {
      label: t('bucketSettings'),
      href: pathname === settingsPath ? undefined : settingsPath,
    },
  ];

  if (pathname === adminsPath || isEditAdmin) {
    items.push({
      label: t('admins'),
      href: isEditAdmin ? adminsPath : undefined,
    });
  }
  if (isEditAdmin) {
    items.push({ label: t('editAdminTitle') });
  }

  return <Breadcrumbs items={items} LinkComponent={LinkAdapter} ariaLabel={t('bucketSettings')} />;
}
