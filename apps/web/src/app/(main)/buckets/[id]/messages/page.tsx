import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button, Card, Container, Stack } from '@boilerplate/ui';

import { fetchBucket, fetchMessages } from '../../../../../lib/buckets';
import { getServerUser } from '../../../../../lib/server-auth';
import { ROUTES, bucketDetailRoute } from '../../../../../lib/routes';
import { MessagesList } from '../MessagesList';

export default async function BucketMessagesPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (user === null) redirect(ROUTES.LOGIN);

  const { id } = await params;
  const { bucket } = await fetchBucket(id);
  if (bucket === null) notFound();

  const messages = await fetchMessages(id);
  const t = await getTranslations('buckets');

  return (
    <Container>
      <Stack>
        <Card title={t('messages')}>
          <div style={{ marginBottom: '1rem' }}>
            <Link href={bucketDetailRoute(id)}>
              <Button variant="secondary">← {bucket.name}</Button>
            </Link>
          </div>
          <MessagesList bucketId={id} initialMessages={messages} />
        </Card>
      </Stack>
    </Container>
  );
}
