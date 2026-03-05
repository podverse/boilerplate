import { redirect, notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { formatDateTimeReadable } from '@boilerplate/helpers-i18n';
import { request, managementWebBuckets } from '@boilerplate/helpers-requests';
import { BucketDetailContent } from '@boilerplate/ui';

import { getServerUser } from '../../../../lib/server-auth';
import { getServerManagementApiBaseUrl, getWebAppUrl } from '../../../../config/env';
import { getCrudFlags, hasReadPermission } from '../../../../lib/main-nav';
import { ROUTES } from '../../../../lib/routes';
import { getCookieHeader } from '../../../../lib/server-request';
import {
  bucketMessagesRoute,
  bucketSettingsRoute,
  topicDetailRoute,
  topicEditRoute,
  topicNewRoute,
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

async function fetchTopics(bucketId: string): Promise<ManagementBucket[]> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerManagementApiBaseUrl();
  const res = await managementWebBuckets.getBucketTopics(baseUrl, bucketId, {
    headers: { Cookie: cookieHeader },
    ...requestOptions,
  });
  if (!res.ok || res.data === undefined) return [];
  const data = res.data;
  return Array.isArray(data.buckets) ? data.buckets : [];
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

  if (bucket.parentBucketId !== null) {
    const parent = await fetchBucket(bucket.parentBucketId);
    if (parent !== null) {
      redirect(topicDetailRoute(parent.shortId, bucket.shortId));
    }
  }

  const topics = bucket.parentBucketId === null ? await fetchTopics(id) : [];
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

  const topicsForContent =
    bucket.parentBucketId === null
      ? topics.map((topic) => ({
          id: topic.id,
          name: topic.name,
          href: topicDetailRoute(id, topic.shortId),
          editHref: topicEditRoute(id, topic.shortId),
          createdAtDisplay: formatDateTimeReadable(locale, topic.createdAt),
          lastMessageAtDisplay:
            topic.lastMessageAt !== undefined && topic.lastMessageAt !== null
              ? formatDateTimeReadable(locale, topic.lastMessageAt)
              : null,
        }))
      : undefined;

  return (
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
      showSettingsLink={bucketsCrud.update}
      settingsHref={bucketsCrud.update ? bucketSettingsRoute(id) : undefined}
      settingsLabel={tCommon('bucketDetail.settings')}
      topics={topicsForContent}
      topicsTitle={topicsForContent !== undefined ? tCommon('bucketDetail.topics') : undefined}
      topicViewLabel={topicsForContent !== undefined ? tCommon('bucketDetail.view') : undefined}
      topicEditLabel={topicsForContent !== undefined ? tCommon('bucketDetail.edit') : undefined}
      createTopicHref={topicsForContent !== undefined ? topicNewRoute(id) : undefined}
      createTopicLabel={
        topicsForContent !== undefined ? tCommon('bucketDetail.createTopic') : undefined
      }
      topicsColumnName={topicsForContent !== undefined ? tCommon('bucketDetail.name') : undefined}
      topicsColumnLastMessage={
        topicsForContent !== undefined ? tCommon('bucketDetail.lastMessage') : undefined
      }
      topicsColumnCreated={
        topicsForContent !== undefined ? tCommon('bucketDetail.created') : undefined
      }
      topicsColumnActions={
        topicsForContent !== undefined ? tCommon('bucketDetail.actions') : undefined
      }
    />
  );
}
