'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  BucketAdminsView,
  Text,
  type BucketAdminRoleOption,
  type BucketAdminInvitationRow,
  type BucketAdminRow,
} from '@boilerplate/ui';
import type { BucketRoleItem } from '@boilerplate/helpers-requests';
import { getApiBaseUrl } from '../../../../lib/api-client';
import {
  bucketSettingsAdminEditRoute,
  bucketSettingsAdminsRoute,
  bucketSettingsRoleNewRoute,
} from '../../../../lib/routes';

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

export function BucketAdminsClient({
  bucketId,
  ownerId,
  initialAdmins,
  initialPendingInvitations,
}: {
  bucketId: string;
  ownerId: string;
  initialAdmins: BucketAdminRow[];
  initialPendingInvitations: BucketAdminInvitationRow[];
}) {
  const t = useTranslations('buckets');
  const tRoles = useTranslations('roles');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [admins, setAdmins] = useState<BucketAdminRow[]>(initialAdmins);
  const [pendingInvitations, setPendingInvitations] =
    useState<BucketAdminInvitationRow[]>(initialPendingInvitations);
  const [roles, setRoles] = useState<BucketAdminRoleOption[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const loadRoles = useCallback(async () => {
    setLoadingRoles(true);
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/buckets/${bucketId}/roles`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) {
      setLoadingRoles(false);
      return;
    }
    const data = await res.json().catch(() => ({}));
    const roleList = Array.isArray(data?.roles) ? (data.roles as BucketRoleItem[]) : [];
    const mapped = roleList
      .map((role) => roleToOption(role, tRoles, t))
      .filter((item): item is BucketAdminRoleOption => item !== null);
    setRoles(mapped);
    setLoadingRoles(false);
  }, [bucketId, t, tRoles]);

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  const labels = {
    addAdmin: t('addAdmin'),
    addAdminDescription: t('addAdminDescription'),
    bucketPermissions: t('bucketPermissions'),
    bucketPermissionsInfo: t('bucketPermissionsInfo'),
    messagePermissions: t('messagePermissions'),
    adminPermissionsLabel: t('adminPermissionsLabel'),
    crudCreate: t('crudCreate'),
    crudRead: t('crudRead'),
    crudUpdate: t('crudUpdate'),
    crudDelete: t('crudDelete'),
    noAdminsYet: 'No bucket admins yet.',
    edit: t('edit'),
    delete: t('delete'),
    deleteConfirmAdmin: t('delete') + ' this admin?',
    deleteConfirmInvitation: t('delete') + ' this invitation?',
    owner: t('owner'),
    pendingInvitations: t('pendingInvitations'),
    invitationLink: t('invitationLink'),
    expires: t('expires'),
    inviteLinkCopy: t('inviteLinkCopy'),
    copy: t('copy'),
    copied: t('copied'),
    save: t('save'),
    cancel: t('cancel'),
  };

  const handleCreateInvitation = async (body: {
    bucketCrud: number;
    messageCrud: number;
    adminCrud: number;
  }): Promise<{ token: string } | { error: string }> => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/buckets/${bucketId}/admin-invitations`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        error: typeof data?.message === 'string' ? data.message : 'Failed to create invitation',
      };
    }
    const inv = data.invitation;
    if (
      inv !== undefined &&
      typeof inv.token === 'string' &&
      typeof inv.id === 'string' &&
      typeof inv.expiresAt === 'string'
    ) {
      setPendingInvitations((prev) => [...prev, inv]);
      return { token: inv.token };
    }
    return { error: 'Invalid response' };
  };

  const handleDeleteAdmin = async (adminUserId: string) => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/buckets/${bucketId}/admins/${adminUserId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      setAdmins((prev) => prev.filter((a) => (a.user?.shortId ?? a.userId) !== adminUserId));
      return { ok: true as const };
    }
    const data = await res.json().catch(() => ({}));
    return {
      ok: false as const,
      error: typeof data?.message === 'string' ? data.message : 'Failed to remove admin',
    };
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/buckets/${bucketId}/admin-invitations/${invitationId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      setPendingInvitations((prev) => prev.filter((i) => i.id !== invitationId));
      return { ok: true as const };
    }
    const data = await res.json().catch(() => ({}));
    return {
      ok: false as const,
      error: typeof data?.message === 'string' ? data.message : 'Failed to remove invitation',
    };
  };

  if (loadingRoles) {
    return <Text variant="muted">{tCommon('loading')}</Text>;
  }

  return (
    <BucketAdminsView
      admins={admins}
      pendingInvitations={pendingInvitations}
      ownerId={ownerId}
      labels={labels}
      onCreateInvitation={handleCreateInvitation}
      onDeleteAdmin={handleDeleteAdmin}
      onDeleteInvitation={handleDeleteInvitation}
      getEditHref={(userId) => bucketSettingsAdminEditRoute(bucketId, userId)}
      getInviteLinkUrl={(token) =>
        typeof window !== 'undefined'
          ? `${window.location.origin}/invite/${token}`
          : `/invite/${token}`
      }
      locale={locale}
      roleOptions={roles}
      createNewRoleHref={bucketSettingsRoleNewRoute(bucketId, bucketSettingsAdminsRoute(bucketId))}
      roleSelectLabel={t('roles')}
      createNewRoleOptionLabel={t('customRole')}
    />
  );
}
