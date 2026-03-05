import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { TopicMessagesPageClient } from './TopicMessagesPageClient';
import { fetchBucket, fetchMessages } from '../../../../../../../lib/buckets';
import { getServerUser } from '../../../../../../../lib/server-auth';
import { ROUTES, bucketDetailRoute, topicDetailRoute } from '../../../../../../../lib/routes';

export default async function TopicMessagesPage({
  params,
}: {
  params: Promise<{ id: string; topicId: string }>;
}) {
  const user = await getServerUser();
  if (user === null) redirect(ROUTES.LOGIN);

  const { id: parentId, topicId } = await params;
  const { bucket: parent } = await fetchBucket(parentId);
  const { bucket: topic } = await fetchBucket(topicId);
  if (parent === null || topic === null || topic.parentBucketId !== parent.id) {
    notFound();
  }

  const messages = await fetchMessages(topicId);
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
    <TopicMessagesPageClient
      parentId={parentId}
      topicId={topicId}
      parentName={parent.name}
      topicName={topic.name}
      parentHref={bucketDetailRoute(parentId)}
      topicHref={topicDetailRoute(parentId, topicId)}
      messages={listItems}
      messagesTitle={t('messages')}
      messagesAriaLabel={t('messages')}
      emptyMessage={t('noMessagesYet')}
    />
  );
}
