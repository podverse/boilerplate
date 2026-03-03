import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Card, Container, Stack } from '@boilerplate/ui';

import { fetchBucket } from '../../../../../lib/buckets';
import { getServerUser } from '../../../../../lib/server-auth';
import { ROUTES, bucketDetailRoute } from '../../../../../lib/routes';
import { BucketForm } from '../../BucketForm';
import type { BucketForForm } from '../../BucketForm';

export default async function BucketEditPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const { id } = await params;
  const { bucket } = await fetchBucket(id);
  if (bucket === null) {
    notFound();
  }

  const t = await getTranslations('buckets');
  const forForm: BucketForForm = {
    id: bucket.id,
    name: bucket.name,
    isPublic: bucket.isPublic,
  };

  return (
    <Container>
      <Stack>
        <Card title={t('editTitle')}>
          <BucketForm
            mode="edit"
            bucket={forForm}
            successHref={bucketDetailRoute(id)}
            cancelHref={bucketDetailRoute(id)}
          />
        </Card>
      </Stack>
    </Container>
  );
}
