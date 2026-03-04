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

function isEditAdminPath(pathname: string | null, bucketId: string): boolean {
  if (pathname === null || pathname === undefined) return false;
  const prefix = `/buckets/${bucketId}/settings/admins/`;
  return pathname.startsWith(prefix) && pathname.endsWith('/edit');
}

/**
 * Breadcrumb for bucket settings. On the main settings page: bucket name only.
 * On the edit-admin page: bucket name → Settings → Admins (all links).
 */
export function BucketSettingsBreadcrumbs({
  bucketId,
  bucketName,
}: BucketSettingsBreadcrumbsProps) {
  const t = useTranslations('buckets');
  const pathname = usePathname();
  const onEditAdminPage = isEditAdminPath(pathname, bucketId);

  const items: BreadcrumbItem[] = [{ label: bucketName, href: bucketDetailRoute(bucketId) }];
  if (onEditAdminPage) {
    items.push(
      { label: t('bucketSettings'), href: bucketSettingsRoute(bucketId) },
      { label: t('admins'), href: bucketSettingsAdminsRoute(bucketId) }
    );
  }

  return <Breadcrumbs items={items} LinkComponent={LinkAdapter} ariaLabel={t('bucketSettings')} />;
}
