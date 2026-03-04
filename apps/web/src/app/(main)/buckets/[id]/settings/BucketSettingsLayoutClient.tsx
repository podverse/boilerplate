'use client';

import { usePathname } from 'next/navigation';
import { ContentPageLayout } from '@boilerplate/ui';
import { BucketSettingsBreadcrumbs } from './BucketSettingsBreadcrumbs';

type BucketSettingsLayoutClientProps = {
  bucketId: string;
  bucketName: string;
  bucketSettingsTitle: string;
  children: React.ReactNode;
};

function isEditAdminPath(pathname: string | null, bucketId: string): boolean {
  if (pathname === null || pathname === undefined) return false;
  const settingsAdminsPrefix = `/buckets/${bucketId}/settings/admins/`;
  return pathname.startsWith(settingsAdminsPrefix) && pathname.endsWith('/edit');
}

export function BucketSettingsLayoutClient({
  bucketId,
  bucketName,
  bucketSettingsTitle,
  children,
}: BucketSettingsLayoutClientProps) {
  const pathname = usePathname();
  const isEditAdminPage = isEditAdminPath(pathname, bucketId);

  return (
    <ContentPageLayout
      breadcrumbs={<BucketSettingsBreadcrumbs bucketId={bucketId} bucketName={bucketName} />}
      title={isEditAdminPage ? undefined : bucketSettingsTitle}
      type="form"
    >
      {children}
    </ContentPageLayout>
  );
}
