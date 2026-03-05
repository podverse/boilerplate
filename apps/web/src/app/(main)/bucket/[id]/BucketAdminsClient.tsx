'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  BucketAdminsView,
  type BucketAdminInvitationRow,
  type BucketAdminRow,
} from '@boilerplate/ui';
import { getApiBaseUrl } from '../../../../lib/api-client';
import { bucketSettingsAdminEditRoute } from '../../../../lib/routes';

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
  const locale = useLocale();
  const [admins, setAdmins] = useState<BucketAdminRow[]>(initialAdmins);
  const [pendingInvitations, setPendingInvitations] =
    useState<BucketAdminInvitationRow[]>(initialPendingInvitations);

  const labels = {
    addAdmin: t('addAdmin'),
    addAdminDescription: t('addAdminDescription'),
    bucketPermissions: t('bucketPermissions'),
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
    />
  );
}
