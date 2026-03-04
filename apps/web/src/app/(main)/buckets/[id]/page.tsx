import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button, Container, DataDetail, Row, SectionWithHeading, Text } from '@boilerplate/ui';

import { fetchAdmins, fetchBucket, fetchTopics } from '../../../../lib/buckets';
import { getServerUser } from '../../../../lib/server-auth';
import {
  ROUTES,
  bucketDetailRoute,
  bucketMessagesRoute,
  bucketSettingsRoute,
  publicBucketRoute,
} from '../../../../lib/routes';

function formatAdminLabel(
  admin: {
    user: { displayName: string | null; email: string; shortId: string } | null;
    userId: string;
  },
  isOwner: boolean
): string {
  const name = admin.user?.displayName ?? admin.user?.email ?? admin.userId;
  return isOwner ? `${name} (owner)` : name;
}

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

  const [topics, admins] = await Promise.all([
    bucket.parentBucketId === null ? fetchTopics(id) : [],
    fetchAdmins(id),
  ]);

  const t = await getTranslations('buckets');
  const detailItems = [
    { label: t('isPublic'), value: bucket.isPublic ? t('publicYes') : t('publicNo') },
    ...(admins.length > 0
      ? [
          {
            label: t('admins'),
            value: admins.map((a) => formatAdminLabel(a, a.userId === bucket.ownerId)).join(', '),
          },
        ]
      : []),
  ];

  return (
    <Container>
      <h2>{bucket.name}</h2>
      <DataDetail items={detailItems} />
      <Row wrap>
        <Link href={bucketMessagesRoute(id)}>
          <Button variant="secondary">{t('messages')}</Button>
        </Link>
        {bucket.isPublic && (
          <Link href={publicBucketRoute(bucket.shortId)} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary">Public page</Button>
          </Link>
        )}
        <Link href={bucketSettingsRoute(id)}>
          <Button variant="secondary">{t('settings')}</Button>
        </Link>
      </Row>

      {bucket.parentBucketId === null && (
        <SectionWithHeading title={t('topics')}>
          {topics.length === 0 ? (
            <Text style={{ margin: 0 }}>No topics yet.</Text>
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
                    href={bucketDetailRoute(topic.shortId)}
                    style={{ fontWeight: 500, textDecoration: 'none' }}
                  >
                    {topic.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href={`/buckets/${id}/topics/new`}>
            <Button variant="primary">{t('createTopic')}</Button>
          </Link>
        </SectionWithHeading>
      )}
    </Container>
  );
}
