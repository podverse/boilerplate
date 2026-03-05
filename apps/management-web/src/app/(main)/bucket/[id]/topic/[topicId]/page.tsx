import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { Breadcrumbs, BucketDetailContent, Container, Link } from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';

import { getServerUser } from '../../../../../../lib/server-auth';
import { getServerManagementApiBaseUrl, getWebAppUrl } from '../../../../../../config/env';
import { getCrudFlags, hasReadPermission } from '../../../../../../lib/main-nav';
import { ROUTES } from '../../../../../../lib/routes';
import { getCookieHeader } from '../../../../../../lib/server-request';
import {
  bucketViewRoute,
  bucketSettingsRoute,
  topicMessagesRoute,
} from '../../../../../../lib/routes';
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
  if (user === null) redirect(ROUTES.LOGIN);

  const canReadBuckets =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'bucketsCrud');
  if (!canReadBuckets) redirect(ROUTES.DASHBOARD);

  const { id: parentId, topicId } = await params;
  const parent = await fetchBucket(parentId);
  const topic = await fetchBucket(topicId);
  if (parent === null || topic === null || topic.parentBucketId !== parent.id) {
    notFound();
  }

  const tCommon = await getTranslations('common');
  const showMessagesLink =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'bucketMessagesCrud');
  const bucketsCrud = getCrudFlags(user.isSuperAdmin === true, user.permissions, 'bucketsCrud');
  const detailItems = [
    {
      label: tCommon('bucketDetail.isPublic'),
      value: topic.isPublic ? tCommon('bucketDetail.publicYes') : tCommon('bucketDetail.publicNo'),
    },
    {
      label: tCommon('bucketDetail.owner'),
      value: topic.ownerDisplayName ?? topic.ownerId,
    },
  ];

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: parent.name, href: bucketViewRoute(parentId) },
    { label: topic.name, href: undefined },
  ];

  return (
    <Container contentMaxWidth="readable">
      <Breadcrumbs
        items={breadcrumbItems}
        LinkComponent={BreadcrumbLink}
        ariaLabel={tCommon('bucketDetail.topics')}
      />
      <BucketDetailContent
        bucketName={topic.name}
        detailItems={detailItems}
        showMessagesLink={showMessagesLink}
        messagesHref={showMessagesLink ? topicMessagesRoute(parentId, topicId) : undefined}
        messagesLabel={tCommon('bucketDetail.messages')}
        showPublicLink={topic.isPublic}
        publicHref={
          topic.isPublic
            ? (() => {
                const webUrl = getWebAppUrl();
                const path = `/b/${parent.shortId}/t/${topic.shortId}`;
                return webUrl !== undefined ? `${webUrl}${path}` : path;
              })()
            : undefined
        }
        publicLabel={tCommon('bucketDetail.publicPage')}
        showSettingsLink={bucketsCrud.update}
        settingsHref={bucketsCrud.update ? bucketSettingsRoute(parentId) : undefined}
        settingsLabel={tCommon('bucketDetail.settings')}
        wrapInContainer={false}
      />
    </Container>
  );
}
