import { redirect, notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { formatDateTimeReadable } from '@boilerplate/helpers-i18n';
import { Breadcrumbs, BucketDetailContent, BucketDetailPageLayout, Link } from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';

import {
  fetchAdmins,
  fetchBucket,
  fetchBucketAncestry,
  fetchChildBuckets,
} from '../../../../lib/buckets';
import { getServerUser } from '../../../../lib/server-auth';
import {
  ROUTES,
  bucketDetailRoute,
  bucketEditRoute,
  bucketMessagesRoute,
  bucketNewRouteFromAncestry,
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

  const [childBuckets, admins, ancestors] = await Promise.all([
    fetchChildBuckets(id),
    fetchAdmins(id),
    fetchBucketAncestry(bucket),
  ]);

  const t = await getTranslations('buckets');
  const locale = await getLocale();
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

  const childBucketsForContent = childBuckets.map((childBucket) => ({
    id: childBucket.id,
    name: childBucket.name,
    href: bucketDetailRoute(childBucket.shortId),
    editHref: bucketEditRoute(childBucket.shortId),
    createdAtDisplay: formatDateTimeReadable(locale, childBucket.createdAt),
    lastMessageAtDisplay:
      childBucket.lastMessageAt !== undefined && childBucket.lastMessageAt !== null
        ? formatDateTimeReadable(locale, childBucket.lastMessageAt)
        : null,
    isPublicDisplay: childBucket.isPublic ? t('publicYes') : t('publicNo'),
  }));
  const breadcrumbItems: BreadcrumbItem[] = ancestors.map((ancestor) => ({
    label: ancestor.name,
    href: bucketDetailRoute(ancestor.shortId),
  }));
  const currentBreadcrumb: BreadcrumbItem = { label: bucket.name, href: undefined };

  return (
    <BucketDetailPageLayout
      breadcrumbs={
        breadcrumbItems.length > 0 ? (
          <Breadcrumbs
            items={[...breadcrumbItems, currentBreadcrumb]}
            LinkComponent={BreadcrumbLink}
            ariaLabel={t('bucketSettings')}
          />
        ) : undefined
      }
    >
      <BucketDetailContent
        bucketName={bucket.name}
        detailItems={detailItems}
        showMessagesLink={true}
        messagesHref={bucketMessagesRoute(id)}
        messagesLabel={t('messages')}
        showPublicLink={bucket.isPublic}
        publicHref={bucket.isPublic ? publicBucketRoute(bucket.shortId) : undefined}
        publicLabel="Public page"
        showSettingsLink={bucket.parentBucketId === null}
        settingsHref={bucket.parentBucketId === null ? bucketSettingsRoute(id) : undefined}
        settingsLabel={t('settings')}
        topics={childBucketsForContent}
        topicsTitle={t('topics')}
        topicViewLabel={t('view')}
        topicEditLabel={t('edit')}
        topicDeleteLabel={t('delete')}
        createTopicHref={bucketNewRouteFromAncestry([id])}
        createTopicLabel={t('createTopic')}
        topicsColumnName={t('name')}
        topicsColumnLastMessage={t('lastMessage')}
        topicsColumnCreated={t('created')}
        topicsColumnPublic={t('isPublic')}
        topicsColumnActions={t('actions')}
        topicsEmptyMessage={t('noBucketsYet')}
        wrapInContainer={false}
      />
    </BucketDetailPageLayout>
  );
}
