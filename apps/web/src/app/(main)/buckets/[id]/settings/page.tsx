import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button, ContentPageLayout, Divider, SectionWithHeading } from '@boilerplate/ui';

import { fetchAdmins, fetchBucket } from '../../../../../lib/buckets';
import { getServerUser } from '../../../../../lib/server-auth';
import { ROUTES, bucketDetailRoute } from '../../../../../lib/routes';
import { BucketForm } from '../../BucketForm';
import type { BucketForForm } from '../../BucketForm';
import { BucketAdminsClient } from '../BucketAdminsClient';

export default async function BucketSettingsPage({ params }: { params: Promise<{ id: string }> }) {
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
  const forForm: BucketForForm = {
    id: bucket.id,
    name: bucket.name,
    isPublic: bucket.isPublic,
  };

  return (
    <ContentPageLayout title={t('settings')} type="form">
      <div style={{ marginBottom: '1rem' }}>
        <Link href={bucketDetailRoute(id)}>
          <Button variant="secondary">
            {t('backToBucket')} – {bucket.name}
          </Button>
        </Link>
      </div>
      <SectionWithHeading title={t('editTitle')}>
        <BucketForm
          mode="edit"
          bucket={forForm}
          successHref={bucketDetailRoute(id)}
          cancelHref={bucketDetailRoute(id)}
        />
      </SectionWithHeading>
      <Divider />
      <SectionWithHeading title={t('admins')}>
        <BucketAdminsClient bucketId={id} initialAdmins={admins} />
      </SectionWithHeading>
    </ContentPageLayout>
  );
}
