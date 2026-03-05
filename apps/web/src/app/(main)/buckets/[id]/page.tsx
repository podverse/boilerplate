import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { BucketDetailContent } from '@boilerplate/ui';

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

  const topicsForContent =
    bucket.parentBucketId === null
      ? topics.map((topic) => {
          const href = bucketDetailRoute(topic.shortId);
          return {
            id: topic.id,
            name: topic.name,
            href,
            editHref: `${href}/edit`,
          };
        })
      : undefined;

  return (
    <BucketDetailContent
      bucketName={bucket.name}
      detailItems={detailItems}
      showMessagesLink={true}
      messagesHref={bucketMessagesRoute(id)}
      messagesLabel={t('messages')}
      showPublicLink={bucket.isPublic}
      publicHref={bucket.isPublic ? publicBucketRoute(bucket.shortId) : undefined}
      publicLabel="Public page"
      showSettingsLink={true}
      settingsHref={bucketSettingsRoute(id)}
      settingsLabel={t('settings')}
      topics={topicsForContent}
      topicsTitle={topicsForContent !== undefined ? t('topics') : undefined}
      topicViewLabel={topicsForContent !== undefined ? t('view') : undefined}
      topicEditLabel={topicsForContent !== undefined ? t('edit') : undefined}
      topicDeleteLabel={topicsForContent !== undefined ? t('delete') : undefined}
      createTopicHref={topicsForContent !== undefined ? `/buckets/${id}/topics/new` : undefined}
      createTopicLabel={topicsForContent !== undefined ? t('createTopic') : undefined}
    />
  );
}
