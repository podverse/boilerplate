import { redirect, notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { DEFAULT_PAGE_LIMIT, formatUserLabel } from '@boilerplate/helpers';
import { formatDateTimeReadable } from '@boilerplate/helpers-i18n';
import {
  Breadcrumbs,
  BucketDetailContent,
  BucketDetailPageLayout,
  Link,
  SectionWithHeading,
} from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';

import {
  fetchAdmins,
  fetchBucket,
  fetchBucketAncestry,
  fetchChildBuckets,
  fetchMessagesPaginated,
} from '../../../../lib/buckets';
import { getServerUser } from '../../../../lib/server-auth';
import {
  ROUTES,
  bucketDetailRoute,
  bucketDetailTabRoute,
  bucketEditRoute,
  bucketNewRouteFromAncestry,
  bucketSettingsRoute,
  publicBucketRoute,
} from '../../../../lib/routes';
import { BucketDetailTabsClient } from './BucketDetailTabsClient';
import { BucketMessagesPanel } from './BucketMessagesPanel';
import { MessagesSortSelect } from './MessagesSortSelect';

function formatAdminLabel(
  admin: {
    user: {
      username?: string | null;
      email?: string | null;
      displayName?: string | null;
    } | null;
    userId: string;
  },
  isOwner: boolean
): string {
  const label =
    admin.user !== undefined && admin.user !== null
      ? formatUserLabel({
          username: admin.user.username,
          email: admin.user.email,
          displayName: admin.user.displayName,
        })
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

export default async function BucketDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; page?: string; sort?: string }>;
}) {
  const user = await getServerUser();
  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams.tab === 'buckets' ? 'buckets' : 'messages';
  const page = Math.max(1, parseInt(resolvedSearchParams.page ?? '1', 10) || 1);
  const sort = resolvedSearchParams.sort === 'oldest' ? 'oldest' : 'recent';

  const { bucket } = await fetchBucket(id);
  if (bucket === null) {
    notFound();
  }

  const [childBuckets, admins, ancestors, messagesResult] = await Promise.all([
    fetchChildBuckets(id),
    fetchAdmins(id),
    fetchBucketAncestry(bucket),
    tab === 'messages'
      ? fetchMessagesPaginated(id, page, DEFAULT_PAGE_LIMIT, sort)
      : Promise.resolve({
          messages: [],
          page: 1,
          limit: DEFAULT_PAGE_LIMIT,
          total: 0,
          totalPages: 1,
        }),
  ]);

  const t = await getTranslations('buckets');
  const locale = await getLocale();
  const isViewerOwner = user.id === bucket.ownerId;
  const ownerAdmin = admins.find((a) => a.userId === bucket.ownerId);
  const ownerLabel = (() => {
    if (isViewerOwner) {
      const label = formatUserLabel({
        username: user.username,
        email: user.email,
        displayName: user.displayName,
      });
      return label === '—' ? t('anonymous') : label;
    }
    if (ownerAdmin?.user === undefined || ownerAdmin?.user === null) return t('anonymous');
    const label = formatUserLabel({
      username: ownerAdmin.user.username,
      email: ownerAdmin.user.email,
      displayName: ownerAdmin.user.displayName,
    });
    return label === '—' ? t('anonymous') : label;
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

  const tabItems = [
    { href: bucketDetailRoute(id), label: t('messages') },
    { href: bucketDetailTabRoute(id, 'buckets'), label: t('topics') },
    ...(bucket.isPublic
      ? [{ href: publicBucketRoute(bucket.shortId), label: t('publicPage') }]
      : []),
    ...(bucket.parentBucketId === null
      ? [{ href: bucketSettingsRoute(id), label: t('settings') }]
      : []),
  ];
  const activeHref =
    tab === 'buckets'
      ? bucketDetailTabRoute(id, 'buckets')
      : bucketDetailTabRoute(id, 'messages', page > 1 ? page : undefined, sort);

  const messagesListItems = messagesResult.messages.map((m) => ({
    id: m.id,
    senderName: m.senderName,
    body: m.body,
    isPublic: m.isPublic,
    createdAt: m.createdAt,
    bucketId: m.bucketId,
  }));

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
        showMessagesLink={false}
        messagesHref={undefined}
        messagesLabel={t('messages')}
        showPublicLink={false}
        publicHref={undefined}
        publicLabel={t('publicPage')}
        showSettingsLink={false}
        settingsHref={undefined}
        settingsLabel={t('settings')}
        actionArea={<BucketDetailTabsClient items={tabItems} activeHref={activeHref} />}
        messagesSlot={
          tab === 'messages' ? (
            <SectionWithHeading
              title={t('messages')}
              headingAction={
                <MessagesSortSelect
                  sort={sort}
                  basePath={bucketDetailRoute(id)}
                  queryParams={{ tab: 'messages' }}
                  label={t('messagesSort.label')}
                  sortOptionLabels={{
                    recent: t('messagesSortOptions.recent'),
                    oldest: t('messagesSortOptions.oldest'),
                  }}
                />
              }
            >
              <BucketMessagesPanel
                bucketId={id}
                messages={messagesListItems}
                emptyMessage={t('noMessagesYet')}
                page={messagesResult.page}
                totalPages={messagesResult.totalPages}
                limit={messagesResult.limit}
                basePath={bucketDetailRoute(id)}
                queryParams={{
                  tab: 'messages',
                  ...(sort === 'oldest' ? { sort: 'oldest' } : {}),
                }}
              />
            </SectionWithHeading>
          ) : undefined
        }
        topics={tab === 'buckets' ? childBucketsForContent : undefined}
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
