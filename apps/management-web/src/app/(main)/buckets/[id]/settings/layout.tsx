import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import type { ManagementBucket } from '@boilerplate/helpers-requests';

import { BucketSettingsLayoutClient } from './BucketSettingsLayoutClient';
import { getServerUser } from '../../../../../lib/server-auth';
import { getServerManagementApiBaseUrl } from '../../../../../config/env';
import { hasReadPermission } from '../../../../../lib/main-nav';
import { ROUTES } from '../../../../../lib/routes';
import { getCookieHeader } from '../../../../../lib/server-request';

async function fetchBucket(id: string): Promise<ManagementBucket | null> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerManagementApiBaseUrl();
  const res = await request(baseUrl, `/buckets/${id}`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok || res.data === undefined) return null;
  const data = res.data as { bucket?: ManagementBucket };
  return data.bucket ?? null;
}

export default async function BucketSettingsLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const user = await getServerUser();
  if (user === null) redirect(ROUTES.LOGIN);

  const canReadBuckets =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'bucketsCrud');
  if (!canReadBuckets) redirect(ROUTES.DASHBOARD);

  const { id } = await params;
  const bucket = await fetchBucket(id);
  if (bucket === null) notFound();

  const t = await getTranslations('buckets');

  return (
    <BucketSettingsLayoutClient
      bucketId={id}
      bucketName={bucket.name}
      bucketSettingsTitle={t('bucketSettings')}
    >
      {children}
    </BucketSettingsLayoutClient>
  );
}
