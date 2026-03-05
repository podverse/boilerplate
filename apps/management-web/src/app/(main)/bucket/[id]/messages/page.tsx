import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import type { ManagementBucket, ManagementBucketMessage } from '@boilerplate/helpers-requests';

import { BucketMessagesPageClient } from './BucketMessagesPageClient';
import { getServerUser } from '../../../../../lib/server-auth';
import { getServerManagementApiBaseUrl } from '../../../../../config/env';
import { hasReadPermission } from '../../../../../lib/main-nav';
import { ROUTES } from '../../../../../lib/routes';
import { getCookieHeader } from '../../../../../lib/server-request';
import { bucketViewRoute } from '../../../../../lib/routes';

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

async function fetchMessages(bucketId: string): Promise<ManagementBucketMessage[]> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerManagementApiBaseUrl();
  const res = await request(baseUrl, `/buckets/${bucketId}/messages`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok || res.data === undefined) return [];
  const data = res.data as { messages?: ManagementBucketMessage[] };
  return Array.isArray(data.messages) ? data.messages : [];
}

export default async function BucketMessagesPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (user === null) redirect(ROUTES.LOGIN);

  const canReadBuckets =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'bucketsCrud');
  if (!canReadBuckets) redirect(ROUTES.DASHBOARD);

  const { id } = await params;
  const canReadMessages =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'bucketMessagesCrud');
  if (!canReadMessages) redirect(bucketViewRoute(id));

  const bucket = await fetchBucket(id);
  if (bucket === null) notFound();

  const messages = await fetchMessages(id);
  const t = await getTranslations('buckets');

  const listItems = messages.map((m) => ({
    id: m.id,
    senderName: m.senderName,
    body: m.body,
    isPublic: m.isPublic,
    createdAt: m.createdAt,
    bucketId: m.bucketId,
  }));

  return (
    <BucketMessagesPageClient
      bucketId={id}
      bucketName={bucket.name}
      bucketDetailHref={bucketViewRoute(id)}
      messages={listItems}
      messagesTitle={t('messages')}
      messagesAriaLabel={t('messages')}
      emptyMessage={t('noMessagesYet')}
    />
  );
}
