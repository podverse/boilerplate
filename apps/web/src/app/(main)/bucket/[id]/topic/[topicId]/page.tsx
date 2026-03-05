import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Breadcrumbs, BucketDetailContent, Container, Link } from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';

import { fetchAdmins, fetchBucket } from '../../../../../../lib/buckets';
import { getServerUser } from '../../../../../../lib/server-auth';
import {
  ROUTES,
  bucketDetailRoute,
  bucketSettingsRoute,
  topicMessagesRoute,
  publicTopicRoute,
} from '../../../../../../lib/routes';

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

function BreadcrumbLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ id: string; topicId: string }>;
}) {
  const user = await getServerUser();
  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const { id: parentId, topicId } = await params;
  const { bucket: parent } = await fetchBucket(parentId);
  const { bucket: topic } = await fetchBucket(topicId);
  if (parent === null || topic === null || topic.parentBucketId !== parent.id) {
    notFound();
  }

  const admins = await fetchAdmins(topicId);
  const t = await getTranslations('buckets');
  const isViewerOwner = user.id === topic.ownerId;
  const ownerAdmin = admins.find((a) => a.userId === topic.ownerId);
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
    { label: t('isPublic'), value: topic.isPublic ? t('publicYes') : t('publicNo') },
    { label: t('owner'), value: ownerLabel },
    ...(admins.length > 0
      ? [
          {
            label: t('admins'),
            value: admins.map((a) => formatAdminLabel(a, a.userId === topic.ownerId)).join(', '),
          },
        ]
      : []),
  ];

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: parent.name, href: bucketDetailRoute(parentId) },
    { label: topic.name, href: undefined },
  ];

  return (
    <Container contentMaxWidth="readable">
      <Breadcrumbs items={breadcrumbItems} LinkComponent={BreadcrumbLink} ariaLabel={t('topics')} />
      <BucketDetailContent
        bucketName={topic.name}
        detailItems={detailItems}
        showMessagesLink={true}
        messagesHref={topicMessagesRoute(parentId, topicId)}
        messagesLabel={t('messages')}
        showPublicLink={topic.isPublic}
        publicHref={topic.isPublic ? publicTopicRoute(parent.shortId, topic.shortId) : undefined}
        publicLabel="Public page"
        showSettingsLink={true}
        settingsHref={bucketSettingsRoute(parentId)}
        settingsLabel={t('settings')}
        wrapInContainer={false}
      />
    </Container>
  );
}
