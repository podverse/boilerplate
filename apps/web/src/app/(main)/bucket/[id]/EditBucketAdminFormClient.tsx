'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { EditBucketAdminForm } from '@boilerplate/ui';
import type { EditBucketAdminFormPayload } from '@boilerplate/ui';
import type { BucketAdminRoleOption } from '@boilerplate/ui';
import type { BucketRoleItem } from '@boilerplate/helpers-requests';
import { getApiBaseUrl } from '../../../../lib/api-client';
import { bucketSettingsAdminsRoute, bucketSettingsRoleNewRoute } from '../../../../lib/routes';

function roleDescription(roleId: string, t: (key: string) => string): string {
  if (roleId === 'bucket_full') return t('roleDescriptionBucketFull');
  if (roleId === 'bucket_read') return t('roleDescriptionBucketRead');
  return t('roleDescriptionCustomRole');
}

function roleToOption(
  role: BucketRoleItem,
  tRoles: (key: string) => string,
  tBuckets: (key: string) => string
): BucketAdminRoleOption | null {
  if (role.isPredefined && 'nameKey' in role) {
    if (role.id !== 'bucket_full' && role.id !== 'bucket_read') {
      return null;
    }
    const key = role.nameKey.split('.').pop();
    const label = key !== undefined ? tRoles(key) : role.id;
    return {
      id: role.id,
      label,
      description: roleDescription(role.id, tBuckets),
      bucketCrud: role.bucketCrud,
      messageCrud: role.messageCrud,
      adminCrud: role.adminCrud,
    };
  }

  const name = role.name;
  return {
    id: role.id,
    label: name,
    description: tBuckets('roleDescriptionCustomRole'),
    bucketCrud: role.bucketCrud,
    messageCrud: role.messageCrud,
    adminCrud: role.adminCrud,
  };
}

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
  const tRoles = useTranslations('roles');
  const router = useRouter();
  const [roleOptions, setRoleOptions] = useState<BucketAdminRoleOption[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoles = useCallback(async () => {
    setLoading(true);
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/buckets/${bucketId}/roles`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json().catch(() => ({}));
    const roleList = Array.isArray(data?.roles) ? (data.roles as BucketRoleItem[]) : [];
    const mapped = roleList
      .map((role) => roleToOption(role, tRoles, t))
      .filter((item): item is BucketAdminRoleOption => item !== null);
    setRoleOptions(mapped);
    setLoading(false);
  }, [bucketId, t, tRoles]);

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  const labels = {
    roleSelectLabel: t('roles'),
    createRoleOptionLabel: t('customRole'),
    bucketPermissions: t('bucketPermissions'),
    bucketPermissionsInfo: t('bucketPermissionsInfo'),
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

  if (loading) return null;

  return (
    <EditBucketAdminForm
      initialBucketCrud={initialBucketCrud}
      initialMessageCrud={initialMessageCrud}
      initialAdminCrud={initialAdminCrud}
      roleOptions={roleOptions}
      createNewRoleHref={bucketSettingsRoleNewRoute(bucketId, bucketSettingsAdminsRoute(bucketId))}
      labels={labels}
      onSubmit={handleSubmit}
      successHref={successHref}
      cancelHref={cancelHref}
      onSuccess={() => router.push(successHref)}
    />
  );
}
