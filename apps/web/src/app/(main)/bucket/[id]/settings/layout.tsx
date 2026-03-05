import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { fetchBucket } from '../../../../../lib/buckets';
import { getServerUser } from '../../../../../lib/server-auth';
import { ROUTES } from '../../../../../lib/routes';
import { BucketSettingsLayoutClient } from './BucketSettingsLayoutClient';

export default async function BucketSettingsLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
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
  return (
    <BucketSettingsLayoutClient
      bucketId={id}
      bucketName={bucket.name}
      bucketSettingsTitle={t('bucketSettings')}
    >
      {children}
    </BucketSettingsLayoutClient>
  );
}
