import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { BucketMessagesPageClient } from './BucketMessagesPageClient';
import { fetchBucket, fetchMessages } from '../../../../../lib/buckets';
import { getServerUser } from '../../../../../lib/server-auth';
import { ROUTES, bucketDetailRoute } from '../../../../../lib/routes';

export default async function BucketMessagesPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (user === null) redirect(ROUTES.LOGIN);

  const { id } = await params;
  const { bucket } = await fetchBucket(id);
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
      bucketDetailHref={bucketDetailRoute(id)}
      messages={listItems}
      messagesTitle={t('messages')}
      messagesAriaLabel={t('messages')}
      emptyMessage={t('noMessagesYet')}
    />
  );
}
