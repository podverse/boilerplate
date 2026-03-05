import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { PageHeader, Text } from '@boilerplate/ui';

import { fetchBucket } from '../../../../../../../../lib/buckets';
import { getServerUser } from '../../../../../../../../lib/server-auth';
import { getCookieHeader, getServerApiBaseUrl } from '../../../../../../../../lib/server-request';
import { ROUTES, bucketSettingsAdminsRoute } from '../../../../../../../../lib/routes';
import { EditBucketAdminFormClient } from '../../../../EditBucketAdminFormClient';

type AdminUser = {
  email: string;
  displayName: string | null;
};

type AdminRow = {
  id: string;
  bucketId: string;
  userId: string;
  bucketCrud: number;
  messageCrud: number;
  adminCrud?: number;
  user?: AdminUser | null;
};

/** Fetch a single bucket admin by bucket shortId and user shortId or UUID. */
async function fetchAdmin(
  bucketId: string,
  userIdParam: string
): Promise<{ admin: AdminRow } | null> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  const res = await request(baseUrl, `/buckets/${bucketId}/admins/${userIdParam}`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok || res.data === undefined) return null;
  const data = res.data as { admin?: AdminRow };
  const admin = data.admin;
  if (
    admin === undefined ||
    typeof admin.bucketCrud !== 'number' ||
    typeof admin.messageCrud !== 'number'
  ) {
    return null;
  }
  const adminCrud = typeof admin.adminCrud === 'number' ? admin.adminCrud : 2;
  return { admin: { ...admin, adminCrud } };
}

function formatEmailDisplayName(email: string, displayName: string | null | undefined): string {
  const trimmed =
    displayName !== undefined && displayName !== null && displayName !== ''
      ? displayName.trim()
      : null;
  return trimmed !== null ? `${email} (${trimmed})` : email;
}

function AdminDisplayInfo({ user }: { user: AdminUser | null | undefined }) {
  if (user === undefined || user === null) return null;
  const email = user.email ?? '';
  if (email === '') return null;
  const line = formatEmailDisplayName(email, user.displayName);
  return (
    <Text variant="muted" size="sm">
      {line}
    </Text>
  );
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

  const result = await fetchAdmin(bucketId, userId);
  if (result === null) notFound();
  const { admin } = result;

  if (admin.userId === bucket.ownerId) {
    redirect(bucketSettingsAdminsRoute(bucketId));
  }

  const t = await getTranslations('buckets');
  const adminsHref = bucketSettingsAdminsRoute(bucketId);

  return (
    <>
      <PageHeader title={t('editAdminTitle')} />
      <AdminDisplayInfo user={admin.user} />
      <EditBucketAdminFormClient
        bucketId={bucketId}
        userId={userId}
        initialBucketCrud={admin.bucketCrud}
        initialMessageCrud={admin.messageCrud}
        initialAdminCrud={admin.adminCrud ?? 2}
        successHref={adminsHref}
        cancelHref={adminsHref}
      />
    </>
  );
}
