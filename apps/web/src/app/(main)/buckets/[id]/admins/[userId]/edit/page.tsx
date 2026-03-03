import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { Card, Container, Stack } from '@boilerplate/ui';

import { getServerUser } from '../../../../../../../lib/server-auth';
import { getCookieHeader, getServerApiBaseUrl } from '../../../../../../../lib/server-request';
import { ROUTES } from '../../../../../../../lib/routes';
import { EditBucketAdminForm } from '../../../EditBucketAdminForm';

type Bucket = { id: string; name: string };
type AdminRow = {
  id: string;
  bucketId: string;
  userId: string;
  bucketCrud: number;
  messageCrud: number;
  user: { id: string; shortId: string; email: string; displayName: string | null } | null;
};

async function fetchBucket(id: string): Promise<{ bucket: Bucket | null }> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  const res = await request(baseUrl, `/buckets/${id}`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok || res.data === undefined) return { bucket: null };
  const bucket = res.data as Bucket;
  return typeof bucket?.id === 'string' ? { bucket } : { bucket: null };
}

async function fetchAdmins(bucketId: string): Promise<AdminRow[]> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  const res = await request(baseUrl, `/buckets/${bucketId}/admins`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok || res.data === undefined) return [];
  const data = res.data as { admins?: AdminRow[] };
  return Array.isArray(data.admins) ? data.admins : [];
}

export default async function EditBucketAdminPage({
  params,
}: {
  params: Promise<{ id: string; userId: string }>;
}) {
  const user = await getServerUser();
  if (user === null) redirect(ROUTES.LOGIN);

  const { id: bucketId, userId } = await params;
  const { bucket } = await fetchBucket(bucketId);
  if (bucket === null) notFound();

  const admins = await fetchAdmins(bucketId);
  const admin = admins.find((a) => a.user?.shortId === userId || a.userId === userId);
  if (admin === undefined) notFound();

  const t = await getTranslations('buckets');
  return (
    <Container>
      <Stack>
        <Card title={`${t('edit')} admin`}>
          <EditBucketAdminForm
            bucketId={bucketId}
            userId={userId}
            initialBucketCrud={admin.bucketCrud}
            initialMessageCrud={admin.messageCrud}
            successHref={`/buckets/${bucketId}/admins`}
            cancelHref={`/buckets/${bucketId}/admins`}
          />
        </Card>
      </Stack>
    </Container>
  );
}
