import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { CRUD_BITS } from '@boilerplate/helpers';
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
  const isOwner = userId === bucket.ownerId;
  if (result === null && !isOwner) notFound();

  const t = await getTranslations('buckets');
  const adminsHref = bucketSettingsAdminsRoute(bucketId);

  const fullCrud = CRUD_BITS.create | CRUD_BITS.read | CRUD_BITS.update | CRUD_BITS.delete;

  const admin = result?.admin;
  const initialBucketCrud = admin?.bucketCrud ?? fullCrud;
  const initialMessageCrud = admin?.messageCrud ?? fullCrud;
  const initialAdminCrud = admin?.adminCrud ?? (isOwner ? fullCrud : 2 | CRUD_BITS.read);

  const userLabel =
    admin?.user !== undefined && admin.user !== null
      ? formatUserLabel({
          username: admin.user.username,
          email: admin.user.email,
          displayName: admin.user.displayName,
        })
      : isOwner && bucket.ownerDisplayName !== undefined && bucket.ownerDisplayName !== null
        ? bucket.ownerDisplayName
        : null;

  return (
    <>
      <PageHeader title={t('editAdminTitle')} />
      {isOwner ? (
        <Text variant="muted" size="sm" as="p" role="alert">
          {t('cannotEditBucketOwnerAdmin')}
        </Text>
      ) : null}
      {userLabel !== null && userLabel !== '—' ? (
        <Text variant="muted" size="sm">
          {userLabel}
        </Text>
      ) : null}
      <EditBucketAdminFormClient
        bucketId={bucketId}
        userId={userId}
        initialBucketCrud={initialBucketCrud}
        initialMessageCrud={initialMessageCrud}
        initialAdminCrud={initialAdminCrud}
        successHref={adminsHref}
        cancelHref={adminsHref}
        readOnly={isOwner}
      />
    </>
  );
}
