import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { formatUserLabel } from '@boilerplate/helpers';
import { request } from '@boilerplate/helpers-requests';
import { PageHeader, Text } from '@boilerplate/ui';

import { EditBucketAdminFormClient } from '../../../../EditBucketAdminFormClient';
import { getServerUser } from '../../../../../../../../lib/server-auth';
import { getServerManagementApiBaseUrl } from '../../../../../../../../config/env';
import { hasReadPermission } from '../../../../../../../../lib/main-nav';
import { ROUTES, bucketSettingsAdminsRoute } from '../../../../../../../../lib/routes';
import { getCookieHeader } from '../../../../../../../../lib/server-request';
import type { ManagementBucket } from '@boilerplate/helpers-requests';

type AdminUser = {
  id: string;
  shortId: string;
  email: string | null;
  username?: string | null;
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

async function fetchBucket(id: string): Promise<ManagementBucket | null> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerManagementApiBaseUrl();
  const res = await request(baseUrl, `/buckets/${id}`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok || res.data === undefined) return null;
  const data = res.data as { bucket?: ManagementBucket };
  return data.bucket ?? null;
}

async function fetchAdmin(
  bucketId: string,
  userIdParam: string
): Promise<{ admin: AdminRow } | null> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerManagementApiBaseUrl();
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

export default async function EditBucketAdminPage({
  params,
}: {
  params: Promise<{ id: string; userId: string }>;
}) {
  const user = await getServerUser();
  if (user === null) redirect(ROUTES.LOGIN);

  const canUpdateBucketAdmins =
    user.isSuperAdmin === true || hasReadPermission(user.permissions, 'bucketAdminsCrud');
  if (!canUpdateBucketAdmins) notFound();

  const { id: bucketId, userId } = await params;
  const bucket = await fetchBucket(bucketId);
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
      {admin.user !== undefined &&
        admin.user !== null &&
        (() => {
          const line = formatUserLabel({
            username: admin.user.username,
            email: admin.user.email,
            displayName: admin.user.displayName,
          });
          return line !== '—' ? (
            <Text variant="muted" size="sm">
              {line}
            </Text>
          ) : null;
        })()}
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
