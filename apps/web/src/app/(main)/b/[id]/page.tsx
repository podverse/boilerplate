import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { PublicBucket, PublicBucketMessage } from '@boilerplate/helpers-requests';
import { webBuckets } from '@boilerplate/helpers-requests';
import { ButtonLink, ContentPageLayout, Divider, SectionWithHeading, Stack } from '@boilerplate/ui';

import { BucketMessageList } from '../../../../components/BucketMessageList/BucketMessageList';
import { getServerApiBaseUrl } from '../../../../lib/server-request';
import { publicBucketSubmitRoute } from '../../../../lib/routes';

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

  const listItems: {
    id: string;
    senderName: string;
    body: string;
    isPublic: boolean;
    createdAt: string;
  }[] = messages.map((m) => ({
    id: m.id,
    senderName: m.senderName,
    body: m.body,
    isPublic: m.isPublic,
    createdAt: m.createdAt,
  }));

  return (
    <ContentPageLayout title={bucket.name}>
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
            readableText
          />
        </SectionWithHeading>
      </Stack>
    </ContentPageLayout>
  );
}
