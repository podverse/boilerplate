import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { PublicBucket } from '@boilerplate/helpers-requests';
import { webBuckets } from '@boilerplate/helpers-requests';
import { Card, Container, Stack } from '@boilerplate/ui';

import { getServerApiBaseUrl } from '../../../../../lib/server-request';
import { publicBucketRoute } from '../../../../../lib/routes';
import { PublicSubmitForm } from './PublicSubmitForm';

async function fetchPublicBucket(id: string): Promise<PublicBucket | null> {
  const baseUrl = getServerApiBaseUrl();
  const res = await webBuckets.reqFetchPublicBucket(baseUrl, id);
  if (!res.ok || res.data === undefined) return null;
  const bucket = res.data.bucket;
  return bucket !== undefined && typeof bucket?.id === 'string' ? bucket : null;
}

export default async function PublicSubmitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bucket = await fetchPublicBucket(id);
  if (bucket === null) notFound();

  const t = await getTranslations('buckets');
  return (
    <Container>
      <Stack>
        <Card title={`${t('messages')} – ${bucket.name}`}>
          <p>
            <Link href={publicBucketRoute(id)}>{t('backToBucket')}</Link>
          </p>
          <PublicSubmitForm bucketId={id} successHref={publicBucketRoute(id)} />
        </Card>
      </Stack>
    </Container>
  );
}
