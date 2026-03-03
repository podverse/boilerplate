import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button, Card, Container, Stack, Text } from '@boilerplate/ui';

import { fetchBucket, fetchTopics } from '../../../../lib/buckets';
import { getServerUser } from '../../../../lib/server-auth';
import {
  ROUTES,
  bucketDetailRoute,
  bucketEditRoute,
  bucketMessagesRoute,
  publicBucketRoute,
} from '../../../../lib/routes';

export default async function BucketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const { id } = await params;
  const { bucket } = await fetchBucket(id);
  if (bucket === null) {
    notFound();
  }

  const topics = bucket.parentBucketId === null ? await fetchTopics(id) : [];

  const t = await getTranslations('buckets');
  return (
    <Container>
      <Stack>
        <Card title={bucket.name}>
          <div style={{ marginBottom: '1rem' }}>
            <Text variant="muted">
              {bucket.isPublic ? t('publicYes') : t('publicNo')}
            </Text>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <Link href={bucketEditRoute(id)}>
              <Button variant="secondary">{t('edit')}</Button>
            </Link>
            <Link href={bucketMessagesRoute(id)}>
              <Button variant="secondary">{t('messages')}</Button>
            </Link>
            {bucket.isPublic && (
              <Link href={publicBucketRoute(bucket.id)} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary">Public page</Button>
              </Link>
            )}
          </div>
        </Card>

        {bucket.parentBucketId === null && (
          <Card title={t('topics')}>
            {topics.length === 0 ? (
              <Text variant="muted">No topics yet.</Text>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {topics.map((topic) => (
                  <li
                    key={topic.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0',
                      borderBottom: '1px solid var(--pv-color-border, #eee)',
                    }}
                  >
                    <Link
                      href={bucketDetailRoute(topic.id)}
                      style={{ fontWeight: 500, textDecoration: 'none' }}
                    >
                      {topic.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div style={{ marginTop: '1rem' }}>
              <Link href={`/buckets/${id}/topics/new`}>
                <Button variant="primary">{t('createTopic')}</Button>
              </Link>
            </div>
          </Card>
        )}

        <Card title={t('admins')}>
          <Link href={`/buckets/${id}/admins`}>
            <Button variant="secondary">Manage bucket admins</Button>
          </Link>
        </Card>
      </Stack>
    </Container>
  );
}
