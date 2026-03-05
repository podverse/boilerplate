import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { BucketDetailContent } from '@boilerplate/ui';

import { getServerUser } from '../../../../lib/server-auth';
import { getServerManagementApiBaseUrl, getWebAppUrl } from '../../../../config/env';
import { getCrudFlags, hasReadPermission } from '../../../../lib/main-nav';
import { ROUTES } from '../../../../lib/routes';
import { getCookieHeader } from '../../../../lib/server-request';
import { bucketMessagesRoute, bucketSettingsRoute } from '../../../../lib/routes';
import type { ManagementBucket } from '@boilerplate/helpers-requests';

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

export default async function BucketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (user === null) redirect(ROUTES.LOGIN);

  const canReadBuckets =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'bucketsCrud');
  if (!canReadBuckets) redirect(ROUTES.DASHBOARD);

  const { id } = await params;
  const bucket = await fetchBucket(id);
  if (bucket === null) notFound();

  const tCommon = await getTranslations('common');
  const showMessagesLink =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'bucketMessagesCrud');
  const bucketsCrud = getCrudFlags(user.isSuperAdmin === true, user.permissions, 'bucketsCrud');
  const detailItems = [
    {
      label: tCommon('bucketDetail.isPublic'),
      value: bucket.isPublic ? tCommon('bucketDetail.publicYes') : tCommon('bucketDetail.publicNo'),
    },
    {
      label: tCommon('bucketDetail.owner'),
      value: bucket.ownerDisplayName ?? bucket.ownerId,
    },
  ];

  return (
    <BucketDetailContent
      bucketName={bucket.name}
      detailItems={detailItems}
      showMessagesLink={showMessagesLink}
      messagesHref={showMessagesLink ? bucketMessagesRoute(id) : undefined}
      messagesLabel={tCommon('bucketDetail.messages')}
      showPublicLink={bucket.isPublic}
      publicHref={
        bucket.isPublic
          ? (() => {
              const webUrl = getWebAppUrl();
              const path = `/b/${bucket.shortId}`;
              return webUrl !== undefined ? `${webUrl}${path}` : path;
            })()
          : undefined
      }
      publicLabel={tCommon('bucketDetail.publicPage')}
      showSettingsLink={bucketsCrud.update}
      settingsHref={bucketsCrud.update ? bucketSettingsRoute(id) : undefined}
      settingsLabel={tCommon('bucketDetail.settings')}
    />
  );
}
