import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { PublicBucket, PublicBucketMessage } from '@boilerplate/helpers-requests';
import { webBuckets } from '@boilerplate/helpers-requests';
import {
  Breadcrumbs,
  BucketMessageList,
  ButtonLink,
  ContentPageLayout,
  Divider,
  Link,
  SectionWithHeading,
  Stack,
} from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';

import { getServerApiBaseUrl } from '../../../../../../lib/server-request';
import { publicBucketRoute, publicTopicSubmitRoute } from '../../../../../../lib/routes';

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

async function fetchPublicBucket(id: string): Promise<PublicBucket | null> {
  const baseUrl = getServerApiBaseUrl();
  const res = await webBuckets.reqFetchPublicBucket(baseUrl, id);
  if (!res.ok || res.data === undefined) return null;
  const bucket = res.data.bucket;
  return bucket !== undefined && typeof bucket?.id === 'string' ? bucket : null;
}

async function fetchPublicMessages(id: string): Promise<PublicBucketMessage[]> {
  const baseUrl = getServerApiBaseUrl();
  const res = await webBuckets.reqFetchPublicBucketMessages(baseUrl, id);
  if (!res.ok || res.data === undefined) return [];
  const data = res.data;
  return Array.isArray(data.messages) ? data.messages : [];
}

export default async function PublicTopicPage({
  params,
}: {
  params: Promise<{ id: string; topicId: string }>;
}) {
  const { id: parentId, topicId } = await params;
  const parent = await fetchPublicBucket(parentId);
  const topic = await fetchPublicBucket(topicId);
  if (parent === null || topic === null || !topic.isPublic || topic.parentBucketId !== parent.id) {
    notFound();
  }

  const messages = await fetchPublicMessages(topicId);
  const t = await getTranslations('buckets');

  const listItems: BucketMessageListItem[] = messages.map((m) => ({
    id: m.id,
    senderName: m.senderName,
    body: m.body,
    isPublic: m.isPublic,
    createdAt: m.createdAt,
  }));

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: parent.name, href: publicBucketRoute(parentId) },
    { label: topic.name, href: undefined },
  ];

  return (
    <ContentPageLayout
      title={topic.name}
      breadcrumbs={
        <Breadcrumbs
          items={breadcrumbItems}
          LinkComponent={BreadcrumbLink}
          ariaLabel={t('messages')}
        />
      }
      contentMaxWidth="readable"
    >
      <Stack>
        <ButtonLink href={publicTopicSubmitRoute(parentId, topicId)} variant="primary">
          Submit a message
        </ButtonLink>
        <Divider />
        <SectionWithHeading title={t('messages')}>
          <BucketMessageList
            messages={listItems}
            variant="public"
            emptyMessage={t('noPublicMessagesYet')}
          />
        </SectionWithHeading>
      </Stack>
    </ContentPageLayout>
  );
}
