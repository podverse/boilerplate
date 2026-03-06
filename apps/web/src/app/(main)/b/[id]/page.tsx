import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { PublicBucket, PublicBucketMessage } from '@boilerplate/helpers-requests';
import { webBuckets } from '@boilerplate/helpers-requests';
import {
  BucketMessageList,
  ButtonLink,
  ContentPageLayout,
  Divider,
  SectionWithHeading,
  Stack,
} from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';
import type { BucketMessageListItem } from '@boilerplate/ui';

import { getServerApiBaseUrl } from '../../../../lib/server-request';
import { publicBucketRoute, publicBucketSubmitRoute } from '../../../../lib/routes';
import { PublicBucketBreadcrumbs } from './PublicBucketBreadcrumbs';

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

export default async function PublicBucketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bucket = await fetchPublicBucket(id);
  if (bucket === null || !bucket.isPublic) {
    notFound();
  }

  const messages = await fetchPublicMessages(id);
  const t = await getTranslations('buckets');
  const listItems: BucketMessageListItem[] = messages.map((m) => ({
    id: m.id,
    senderName: m.senderName,
    body: m.body,
    isPublic: m.isPublic,
    createdAt: m.createdAt,
  }));

  const ancestors = bucket.ancestors ?? [];
  const showBreadcrumbs = ancestors.length > 0;
  const breadcrumbItems: BreadcrumbItem[] = showBreadcrumbs
    ? [
        ...ancestors.map((a) => ({ label: a.name, href: publicBucketRoute(a.shortId) })),
        { label: bucket.name, href: undefined },
      ]
    : [];

  return (
    <ContentPageLayout
      title={bucket.name}
      breadcrumbs={
        showBreadcrumbs ? <PublicBucketBreadcrumbs items={breadcrumbItems} /> : undefined
      }
      contentMaxWidth="readable"
    >
      <Stack>
        <ButtonLink href={publicBucketSubmitRoute(id)} variant="primary">
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
