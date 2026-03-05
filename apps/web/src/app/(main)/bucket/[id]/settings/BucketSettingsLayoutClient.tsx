'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  BucketSettingsBreadcrumbs,
  BucketSettingsLayoutClient as UISettingsLayout,
} from '@boilerplate/ui';

import {
  bucketDetailRoute,
  bucketSettingsRoute,
  bucketSettingsAdminsRoute,
} from '../../../../../lib/routes';

type BucketSettingsLayoutClientProps = {
  bucketId: string;
  bucketName: string;
  bucketSettingsTitle: string;
  children: React.ReactNode;
};

function isEditAdminPath(pathname: string | null, bucketId: string): boolean {
  if (pathname === null || pathname === undefined) return false;
  const settingsAdminsPrefix = `/bucket/${bucketId}/settings/admins/`;
  return pathname.startsWith(settingsAdminsPrefix) && pathname.endsWith('/edit');
}

export function BucketSettingsLayoutClient({
  bucketId,
  bucketName,
  bucketSettingsTitle,
  children,
}: BucketSettingsLayoutClientProps) {
  const pathname = usePathname();
  const t = useTranslations('buckets');
  const isEditAdminPage = isEditAdminPath(pathname, bucketId);

  return (
    <UISettingsLayout
      breadcrumbs={
        <BucketSettingsBreadcrumbs
          bucketName={bucketName}
          bucketDetailHref={bucketDetailRoute(bucketId)}
          settingsHref={bucketSettingsRoute(bucketId)}
          settingsLabel={t('bucketSettings')}
          settingsAriaLabel={t('bucketSettings')}
          currentPageLabel={isEditAdminPage ? t('editAdminTitle') : bucketSettingsTitle}
          isEditAdminPage={isEditAdminPage}
          adminsHref={bucketSettingsAdminsRoute(bucketId)}
          adminsLabel={t('admins')}
        />
      }
      title={isEditAdminPage ? undefined : bucketSettingsTitle}
      contentMaxWidth="form"
    >
      {children}
    </UISettingsLayout>
  );
}
