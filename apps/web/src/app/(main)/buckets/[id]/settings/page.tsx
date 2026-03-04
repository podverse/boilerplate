import { notFound } from 'next/navigation';

import { fetchBucket } from '../../../../../lib/buckets';
import { bucketDetailRoute } from '../../../../../lib/routes';
import { BucketForm } from '../../BucketForm';
import type { BucketForForm } from '../../BucketForm';

export default async function BucketSettingsGeneralPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { bucket } = await fetchBucket(id);
  if (bucket === null) {
    notFound();
  }

  const forForm: BucketForForm = {
    id: bucket.id,
    name: bucket.name,
    isPublic: bucket.isPublic,
    messageBodyMaxLength: bucket.messageBodyMaxLength ?? null,
  };

  return (
    <BucketForm
      mode="edit"
      bucket={forForm}
      successHref={bucketDetailRoute(id)}
      cancelHref={bucketDetailRoute(id)}
    />
  );
}
