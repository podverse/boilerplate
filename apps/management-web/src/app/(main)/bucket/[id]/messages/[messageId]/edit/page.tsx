import { notFound, redirect } from 'next/navigation';
import { request } from '@boilerplate/helpers-requests';
import type { ManagementBucketMessage } from '@boilerplate/helpers-requests';

import { BucketMessageEditClient } from '../../../../../../../components/buckets/BucketMessageEditClient';
import { getServerUser } from '../../../../../../../lib/server-auth';
import { getServerManagementApiBaseUrl } from '../../../../../../../config/env';
import { getCrudFlags, hasReadPermission } from '../../../../../../../lib/main-nav';
import { ROUTES } from '../../../../../../../lib/routes';
import { getCookieHeader } from '../../../../../../../lib/server-request';
import { bucketMessagesRoute, bucketViewRoute } from '../../../../../../../lib/routes';

type PageProps = { params: Promise<{ id: string; messageId: string }> };

async function fetchMessage(
  bucketId: string,
  messageId: string
): Promise<ManagementBucketMessage | null> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerManagementApiBaseUrl();
  const res = await request(baseUrl, `/buckets/${bucketId}/messages/${messageId}`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok || res.data === undefined) return null;
  const data = res.data as { message?: ManagementBucketMessage };
  return data.message ?? null;
}

export default async function BucketMessageEditPage({ params }: PageProps) {
  const user = await getServerUser();
  if (user === null) redirect(ROUTES.LOGIN);

  const canReadBuckets =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'bucketsCrud');
  if (!canReadBuckets) redirect(ROUTES.DASHBOARD);

  const canReadMessages =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'bucketMessagesCrud');
  const crud = getCrudFlags(user.isSuperAdmin === true, user.permissions, 'bucketMessagesCrud');
  if (!crud.update) redirect(ROUTES.BUCKETS);

  const { id: bucketId, messageId } = await params;
  if (!canReadMessages) redirect(bucketViewRoute(bucketId));

  const message = await fetchMessage(bucketId, messageId);
  if (message === null) notFound();

  return (
    <BucketMessageEditClient
      bucketId={bucketId}
      messageId={messageId}
      initialBody={message.body}
      initialIsPublic={message.isPublic}
      senderName={message.senderName}
      messagesRoute={bucketMessagesRoute(bucketId)}
    />
  );
}
