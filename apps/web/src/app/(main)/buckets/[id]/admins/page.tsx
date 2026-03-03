import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { Button, Container, Stack } from '@boilerplate/ui';

import { fetchBucket } from '../../../../../lib/buckets';
import { getServerUser } from '../../../../../lib/server-auth';
import { getCookieHeader, getServerApiBaseUrl } from '../../../../../lib/server-request';
import { ROUTES, bucketDetailRoute } from '../../../../../lib/routes';
import { BucketAdminsClient } from '../BucketAdminsClient';

type BucketAdminRow = {
  id: string;
  bucketId: string;
  userId: string;
  bucketCrud: number;
  messageCrud: number;
  createdAt: string;
  user: { id: string; shortId: string; email: string; displayName: string | null } | null;
};

async function fetchAdmins(bucketId: string): Promise<BucketAdminRow[]> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  const res = await request(baseUrl, `/buckets/${bucketId}/admins`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok || res.data === undefined) {
    return [];
  }
  const data = res.data as { admins?: BucketAdminRow[] };
  return Array.isArray(data.admins) ? data.admins : [];
}

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
      <Stack>
        <Stack>
          <h2>{t('admins')}</h2>
          <div style={{ marginBottom: '1rem' }}>
            <Link href={bucketDetailRoute(id)}>
              <Button variant="secondary">← {bucket.name}</Button>
            </Link>
          </div>
          <BucketAdminsClient bucketId={id} initialAdmins={admins} />
        </Stack>
      </Stack>
    </Container>
  );
}
