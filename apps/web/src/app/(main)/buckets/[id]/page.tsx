import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import {
  ButtonLink,
  Container,
  DataDetail,
  Link,
  Row,
  SectionWithHeading,
  Text,
} from '@boilerplate/ui';

import { fetchAdmins, fetchBucket, fetchTopics } from '../../../../lib/buckets';
import { getServerUser } from '../../../../lib/server-auth';
import {
  ROUTES,
  bucketDetailRoute,
  bucketMessagesRoute,
  bucketSettingsRoute,
  publicBucketRoute,
} from '../../../../lib/routes';

function formatEmailDisplayName(email: string, displayName: string | null | undefined): string {
  const trimmed =
    displayName !== undefined && displayName !== null && displayName !== ''
      ? displayName.trim()
      : null;
  return trimmed !== null ? `${email} (${trimmed})` : email;
}

function formatAdminLabel(
  admin: {
    user: { displayName: string | null; email: string; shortId: string } | null;
    userId: string;
  },
  isOwner: boolean
): string {
  const email = admin.user?.email ?? admin.userId;
  const label =
    admin.user !== undefined && admin.user !== null
      ? formatEmailDisplayName(email, admin.user.displayName)
      : admin.userId;
  return isOwner ? `${label} (owner)` : label;
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
  const isViewerOwner = user.id === bucket.ownerId;
  const ownerAdmin = admins.find((a) => a.userId === bucket.ownerId);
  const ownerLabel = (() => {
    if (isViewerOwner) {
      const email = user.email ?? '';
      if (email === '') return t('anonymous');
      return formatEmailDisplayName(email, user.displayName);
    }
    const ownerEmail = ownerAdmin?.user?.email;
    if (ownerEmail === undefined || ownerEmail === '') return t('anonymous');
    return formatEmailDisplayName(ownerEmail, ownerAdmin?.user?.displayName);
  })();
  const detailItems = [
    { label: t('isPublic'), value: bucket.isPublic ? t('publicYes') : t('publicNo') },
    { label: t('owner'), value: ownerLabel },
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
        <ButtonLink href={bucketMessagesRoute(id)} variant="secondary">
          {t('messages')}
        </ButtonLink>
        {bucket.isPublic && (
          <ButtonLink
            href={publicBucketRoute(bucket.shortId)}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Public page
          </ButtonLink>
        )}
        <ButtonLink href={bucketSettingsRoute(id)} variant="secondary">
          {t('settings')}
        </ButtonLink>
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
          <ButtonLink href={`/buckets/${id}/topics/new`} variant="primary">
            {t('createTopic')}
          </ButtonLink>
        </SectionWithHeading>
      )}
    </Container>
  );
}
