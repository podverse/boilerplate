import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button, Container } from '@boilerplate/ui';

import { fetchAdmins, fetchBucket } from '../../../../../lib/buckets';
import { getServerUser } from '../../../../../lib/server-auth';
import { ROUTES, bucketDetailRoute } from '../../../../../lib/routes';
import { BucketAdminsClient } from '../BucketAdminsClient';

export default async function BucketAdminsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const { id } = await params;
  const { bucket } = await fetchBucket(id);
  if (bucket === null) {
    notFound();
  }

  const admins = await fetchAdmins(id);
  const t = await getTranslations('buckets');

  return (
    <Container>
      <h2>{t('admins')}</h2>
      <div style={{ marginBottom: '1rem' }}>
        <Link href={bucketDetailRoute(id)}>
          <Button variant="secondary">← {bucket.name}</Button>
        </Link>
      </div>
      <BucketAdminsClient bucketId={id} initialAdmins={admins} />
    </Container>
  );
}
