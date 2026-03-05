'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { EditBucketAdminForm } from '@boilerplate/ui';
import type { EditBucketAdminFormPayload } from '@boilerplate/ui';
import { managementWebBucketAdmins } from '@boilerplate/helpers-requests';
import { getManagementApiBaseUrl } from '../../../../config/env';

export function EditBucketAdminFormClient({
  bucketId,
  userId,
  initialBucketCrud,
  initialMessageCrud,
  initialAdminCrud,
  successHref,
  cancelHref,
}: {
  bucketId: string;
  userId: string;
  initialBucketCrud: number;
  initialMessageCrud: number;
  initialAdminCrud: number;
  successHref: string;
  cancelHref: string;
}) {
  const t = useTranslations('buckets');
  const router = useRouter();
  const baseUrl = getManagementApiBaseUrl();

  const labels = {
    bucketPermissions: t('bucketPermissions'),
    messagePermissions: t('messagePermissions'),
    adminPermissionsLabel: t('adminPermissionsLabel'),
    crudCreate: t('crudCreate'),
    crudRead: t('crudRead'),
    crudUpdate: t('crudUpdate'),
    crudDelete: t('crudDelete'),
    save: t('save'),
    cancel: t('cancel'),
  };

  const handleSubmit = async (payload: EditBucketAdminFormPayload) => {
    const res = await managementWebBucketAdmins.updateBucketAdmin(
      baseUrl,
      bucketId,
      userId,
      payload,
      null
    );
    if (!res.ok) {
      throw new Error(res.error !== undefined ? res.error.message : 'Failed to update admin');
    }
  };

  return (
    <EditBucketAdminForm
      initialBucketCrud={initialBucketCrud}
      initialMessageCrud={initialMessageCrud}
      initialAdminCrud={initialAdminCrud}
      labels={labels}
      onSubmit={handleSubmit}
      successHref={successHref}
      cancelHref={cancelHref}
      onSuccess={() => router.push(successHref)}
    />
  );
}
