import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { BucketSettingsTabs } from '@boilerplate/ui';
import type { ManagementBucket } from '@boilerplate/helpers-requests';

import { BucketForm } from '../../../../../components/buckets/BucketForm';
import { BucketAdminsClient } from './BucketAdminsClient';
import { getServerUser } from '../../../../../lib/server-auth';
import { getServerManagementApiBaseUrl } from '../../../../../config/env';
import { hasReadPermission } from '../../../../../lib/main-nav';
import { getCookieHeader } from '../../../../../lib/server-request';
import { bucketSettingsRoute, bucketSettingsAdminsRoute } from '../../../../../lib/routes';
import type { BucketSettingsTab } from '../../../../../lib/routes';

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

export default async function BucketSettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tab?: string }>;
}) {
  const user = await getServerUser();
  if (user === null) notFound();

  const canReadBuckets =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'bucketsCrud');
  if (!canReadBuckets) notFound();

  const canReadBucketAdmins =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'bucketAdminsCrud');

  const { id } = await params;
  const bucket = await fetchBucket(id);
  if (bucket === null) notFound();

  const resolvedSearch = searchParams !== undefined ? await searchParams : {};
  const tabParam = resolvedSearch.tab ?? 'general';
  const activeTab: BucketSettingsTab = tabParam === 'admins' ? 'admins' : 'general';

  const t = await getTranslations('buckets');
  const generalHref = bucketSettingsRoute(id);

  return (
    <>
      <BucketSettingsTabs
        generalHref={generalHref}
        generalLabel={t('general')}
        adminsHref={canReadBucketAdmins ? bucketSettingsAdminsRoute(id) : undefined}
        adminsLabel={canReadBucketAdmins ? t('admins') : undefined}
        activeHref={activeTab === 'admins' ? bucketSettingsAdminsRoute(id) : generalHref}
      />
      {activeTab === 'general' ? (
        <BucketForm
          mode="edit"
          bucketId={id}
          initialValues={{
            name: bucket.name,
            isPublic: bucket.isPublic,
            messageBodyMaxLength: bucket.messageBodyMaxLength ?? null,
          }}
        />
      ) : canReadBucketAdmins ? (
        <BucketAdminsClient bucketId={id} ownerId={bucket.ownerId} />
      ) : (
        notFound()
      )}
    </>
  );
}
