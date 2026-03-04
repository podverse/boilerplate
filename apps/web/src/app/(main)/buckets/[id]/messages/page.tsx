import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Container } from '@boilerplate/ui';

import { BucketMessageList } from '../../../../../components/BucketMessageList/BucketMessageList';
import { fetchBucket, fetchMessages } from '../../../../../lib/buckets';
import { getServerUser } from '../../../../../lib/server-auth';
import { ROUTES } from '../../../../../lib/routes';

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
    <Container>
      <h2>
        {t('messages')} – {bucket.name}
      </h2>
      <BucketMessageList
        messages={listItems}
        variant="management"
        bucketId={id}
        emptyMessage={t('noMessagesYet')}
        readableText
      />
    </Container>
  );
}
