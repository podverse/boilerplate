import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { PublicBucket } from '@boilerplate/helpers-requests';
import { webBuckets } from '@boilerplate/helpers-requests';
import { Container, SectionWithHeading } from '@boilerplate/ui';

import { getServerApiBaseUrl } from '../../../../../lib/server-request';
import { publicBucketRoute } from '../../../../../lib/routes';
import { PublicSubmitForm } from '../../PublicSubmitForm';

async function fetchPublicBucket(id: string): Promise<PublicBucket | null> {
  const baseUrl = getServerApiBaseUrl();
  const res = await webBuckets.reqFetchPublicBucket(baseUrl, id);
  if (!res.ok || res.data === undefined) return null;
  const bucket = res.data.bucket;
  return bucket !== undefined && typeof bucket?.id === 'string' ? bucket : null;
}

export default async function PublicBucketSendMessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bucket = await fetchPublicBucket(id);
  if (bucket === null) notFound();

  const t = await getTranslations('buckets');

  return (
    <Container>
      <SectionWithHeading title={`${t('messages')} – ${bucket.name}`}>
        <PublicSubmitForm
          bucketId={id}
          messageBodyMaxLength={bucket.messageBodyMaxLength ?? null}
          successHref={publicBucketRoute(id)}
        />
      </SectionWithHeading>
    </Container>
  );
}
