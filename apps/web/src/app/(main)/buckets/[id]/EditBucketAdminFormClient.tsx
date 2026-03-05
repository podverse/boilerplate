'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { EditBucketAdminForm } from '@boilerplate/ui';
import type { EditBucketAdminFormPayload } from '@boilerplate/ui';
import { getApiBaseUrl } from '../../../../lib/api-client';

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
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/buckets/${bucketId}/admins/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(typeof data?.message === 'string' ? data.message : 'Failed to update admin');
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
