import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { Button, Card, Container, Stack } from '@boilerplate/ui';

import { getServerUser } from '../../../../../lib/server-auth';
import { getCookieHeader, getServerApiBaseUrl } from '../../../../../lib/server-request';
import { ROUTES, bucketDetailRoute } from '../../../../../lib/routes';
import { BucketAdminsClient } from '../BucketAdminsClient';

type Bucket = {
  id: string;
  shortId: string;
  ownerId: string;
  name: string;
  slug: string;
  isPublic: boolean;
  parentBucketId: string | null;
};

type BucketAdminRow = {
  id: string;
  bucketId: string;
  userId: string;
  bucketCrud: number;
  messageCrud: number;
  createdAt: string;
  user: { id: string; shortId: string; email: string; displayName: string | null } | null;
};

async function fetchBucket(id: string): Promise<{ bucket: Bucket | null }> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  const res = await request(baseUrl, `/buckets/${id}`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok || res.data === undefined) {
    return { bucket: null };
  }
  const bucket = res.data as Bucket;
  if (typeof bucket?.id !== 'string') {
    return { bucket: null };
  }
  return { bucket };
}

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
        <Card title={t('admins')}>
          <div style={{ marginBottom: '1rem' }}>
            <Link href={bucketDetailRoute(id)}>
              <Button variant="secondary">← {bucket.name}</Button>
            </Link>
          </div>
          <BucketAdminsClient bucketId={id} initialAdmins={admins} />
        </Card>
      </Stack>
    </Container>
  );
}
