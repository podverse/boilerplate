import { redirect, notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { formatDateTimeReadable } from '@boilerplate/helpers-i18n';
import { request, managementWebBuckets } from '@boilerplate/helpers-requests';
import { Breadcrumbs, BucketDetailContent, BucketDetailPageLayout, Link } from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';

import { getServerUser } from '../../../../lib/server-auth';
import { getServerManagementApiBaseUrl, getWebAppUrl } from '../../../../config/env';
import { getCrudFlags, hasReadPermission } from '../../../../lib/main-nav';
import { ROUTES } from '../../../../lib/routes';
import { getCookieHeader } from '../../../../lib/server-request';
import {
  bucketEditRoute,
  bucketMessagesRoute,
  bucketViewRoute,
  bucketSettingsRoute,
  bucketNewRouteFromAncestry,
} from '../../../../lib/routes';
import type { ManagementBucket } from '@boilerplate/helpers-requests';

const requestOptions = { cache: 'no-store' as RequestCache } as const;

async function fetchBucket(id: string): Promise<ManagementBucket | null> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerManagementApiBaseUrl();
  const res = await request(baseUrl, `/buckets/${id}`, {
    headers: { Cookie: cookieHeader },
    ...requestOptions,
  });
  if (!res.ok || res.data === undefined) return null;
  const data = res.data as { bucket?: ManagementBucket };
  return data.bucket ?? null;
}

async function fetchChildBuckets(bucketId: string): Promise<ManagementBucket[]> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerManagementApiBaseUrl();
  const res = await managementWebBuckets.getChildBuckets(baseUrl, bucketId, {
    headers: { Cookie: cookieHeader },
    ...requestOptions,
  });
  if (!res.ok || res.data === undefined) return [];
  const data = res.data;
  return Array.isArray(data.buckets) ? data.buckets : [];
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

async function fetchBucketAncestry(bucket: ManagementBucket): Promise<ManagementBucket[]> {
  const parents: ManagementBucket[] = [];
  let parentId = bucket.parentBucketId;
  while (parentId !== null) {
    const parent = await fetchBucket(parentId);
    if (parent === null) {
      break;
    }
    parents.unshift(parent);
    parentId = parent.parentBucketId;
  }
  return parents;
}

export default async function BucketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (user === null) redirect(ROUTES.LOGIN);

  const canReadBuckets =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'bucketsCrud');
  if (!canReadBuckets) redirect(ROUTES.DASHBOARD);

  const { id } = await params;
  const bucket = await fetchBucket(id);
  if (bucket === null) notFound();

  const childBuckets = await fetchChildBuckets(id);
  const ancestors = await fetchBucketAncestry(bucket);
  const locale = await getLocale();

  const tCommon = await getTranslations('common');
  const showMessagesLink =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'bucketMessagesCrud');
  const bucketsCrud = getCrudFlags(user.isSuperAdmin === true, user.permissions, 'bucketsCrud');
  const detailItems = [
    {
      label: tCommon('bucketDetail.isPublic'),
      value: bucket.isPublic ? tCommon('bucketDetail.publicYes') : tCommon('bucketDetail.publicNo'),
    },
    {
      label: tCommon('bucketDetail.owner'),
      value: bucket.ownerDisplayName ?? bucket.ownerId,
    },
  ];

  const bucketAncestryForNewChild = [...ancestors.map((a) => a.shortId), bucket.shortId];
  const canCreateBucket = bucketsCrud.create;
  const createTopicHref = canCreateBucket
    ? bucketNewRouteFromAncestry(bucketAncestryForNewChild)
    : undefined;
  const createTopicLabel = canCreateBucket ? tCommon('bucketDetail.createTopic') : undefined;

  const childBucketsForContent = childBuckets.map((childBucket) => ({
    id: childBucket.id,
    name: childBucket.name,
    href: bucketViewRoute(childBucket.shortId),
    editHref: bucketEditRoute(childBucket.shortId),
    createdAtDisplay: formatDateTimeReadable(locale, childBucket.createdAt),
    lastMessageAtDisplay:
      childBucket.lastMessageAt !== undefined && childBucket.lastMessageAt !== null
        ? formatDateTimeReadable(locale, childBucket.lastMessageAt)
        : null,
    isPublicDisplay: childBucket.isPublic
      ? tCommon('bucketDetail.publicYes')
      : tCommon('bucketDetail.publicNo'),
  }));
  const breadcrumbItems: BreadcrumbItem[] = ancestors.map((ancestor) => ({
    label: ancestor.name,
    href: bucketViewRoute(ancestor.shortId),
  }));
  const currentBreadcrumb: BreadcrumbItem = { label: bucket.name, href: undefined };

  return (
    <BucketDetailPageLayout
      breadcrumbs={
        breadcrumbItems.length > 0 ? (
          <Breadcrumbs
            items={[...breadcrumbItems, currentBreadcrumb]}
            LinkComponent={BreadcrumbLink}
            ariaLabel={tCommon('bucketDetail.settings')}
          />
        ) : undefined
      }
    >
      <BucketDetailContent
        bucketName={bucket.name}
        detailItems={detailItems}
        showMessagesLink={showMessagesLink}
        messagesHref={showMessagesLink ? bucketMessagesRoute(id) : undefined}
        messagesLabel={tCommon('bucketDetail.messages')}
        showPublicLink={bucket.isPublic}
        publicHref={
          bucket.isPublic
            ? (() => {
                const webUrl = getWebAppUrl();
                const path = `/b/${bucket.shortId}`;
                return webUrl !== undefined ? `${webUrl}${path}` : path;
              })()
            : undefined
        }
        publicLabel={tCommon('bucketDetail.publicPage')}
        showSettingsLink={bucketsCrud.update && bucket.parentBucketId === null}
        settingsHref={
          bucketsCrud.update && bucket.parentBucketId === null ? bucketSettingsRoute(id) : undefined
        }
        settingsLabel={tCommon('bucketDetail.settings')}
        topics={childBucketsForContent}
        topicsTitle={tCommon('bucketDetail.topics')}
        topicViewLabel={tCommon('bucketDetail.view')}
        topicEditLabel={tCommon('bucketDetail.edit')}
        createTopicHref={createTopicHref}
        createTopicLabel={createTopicLabel}
        topicsColumnName={tCommon('bucketDetail.name')}
        topicsColumnLastMessage={tCommon('bucketDetail.lastMessage')}
        topicsColumnCreated={tCommon('bucketDetail.created')}
        topicsColumnPublic={tCommon('bucketDetail.isPublic')}
        topicsColumnActions={tCommon('bucketDetail.actions')}
        topicsEmptyMessage={tCommon('bucketDetail.noBucketsYet')}
        wrapInContainer={false}
      />
    </BucketDetailPageLayout>
  );
}
