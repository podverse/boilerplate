'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  BucketAdminsView,
  Text,
  type BucketAdminInvitationRow,
  type BucketAdminRow,
} from '@boilerplate/ui';
import {
  managementWebBucketAdmins,
  type ManagementBucketAdmin,
  type ManagementBucketAdminInvitation,
} from '@boilerplate/helpers-requests';
import { getManagementApiBaseUrl } from '../../../../../config/env';
import { getWebAppUrl } from '../../../../../config/env';
import { bucketSettingsAdminEditRoute } from '../../../../../lib/routes';

function toAdminRow(a: ManagementBucketAdmin): BucketAdminRow {
  return {
    id: a.id,
    bucketId: a.bucketId,
    userId: a.userId,
    bucketCrud: a.bucketCrud,
    messageCrud: a.messageCrud,
    adminCrud: a.adminCrud,
    createdAt: a.createdAt,
    user: a.user,
  };
}

function toInvitationRow(inv: ManagementBucketAdminInvitation): BucketAdminInvitationRow {
  return {
    id: inv.id,
    token: inv.token,
    bucketCrud: inv.bucketCrud,
    messageCrud: inv.messageCrud,
    adminCrud: inv.adminCrud,
    status: inv.status,
    expiresAt: inv.expiresAt,
  };
}

export function BucketAdminsClient({ bucketId, ownerId }: { bucketId: string; ownerId: string }) {
  const t = useTranslations('buckets');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const baseUrl = getManagementApiBaseUrl();
  const [admins, setAdmins] = useState<BucketAdminRow[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<BucketAdminInvitationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [adminsRes, invRes] = await Promise.all([
      managementWebBucketAdmins.listBucketAdmins(baseUrl, bucketId, null),
      managementWebBucketAdmins.listBucketAdminInvitations(baseUrl, bucketId, null),
    ]);
    if (adminsRes.ok && adminsRes.data !== undefined) {
      setAdmins(adminsRes.data.admins.map(toAdminRow));
    }
    if (invRes.ok && invRes.data !== undefined) {
      setPendingInvitations(invRes.data.invitations.map(toInvitationRow));
    }
    setLoading(false);
  }, [baseUrl, bucketId]);

  useEffect(() => {
    void load();
  }, [load]);

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
    noAdminsYet: t('noAdminsYet'),
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

  const handleCreateInvitation = useCallback(
    async (body: {
      bucketCrud: number;
      messageCrud: number;
      adminCrud: number;
    }): Promise<{ token: string } | { error: string }> => {
      const res = await managementWebBucketAdmins.createBucketAdminInvitation(
        baseUrl,
        bucketId,
        body,
        null
      );
      if (!res.ok) {
        return {
          error: res.error !== undefined ? res.error.message : 'Failed to create invitation',
        };
      }
      if (res.data === undefined) return { error: 'Invalid response' };
      const inv = res.data.invitation;
      setPendingInvitations((prev) => [...prev, toInvitationRow(inv)]);
      return { token: inv.token };
    },
    [baseUrl, bucketId]
  );

  const handleDeleteAdmin = useCallback(
    async (adminUserId: string) => {
      const res = await managementWebBucketAdmins.deleteBucketAdmin(
        baseUrl,
        bucketId,
        adminUserId,
        null
      );
      if (res.ok) {
        setAdmins((prev) => prev.filter((a) => (a.user?.shortId ?? a.userId) !== adminUserId));
        return { ok: true as const };
      }
      return {
        ok: false as const,
        error:
          res.error !== undefined && typeof res.error.message === 'string'
            ? res.error.message
            : 'Failed to remove admin',
      };
    },
    [baseUrl, bucketId]
  );

  const handleDeleteInvitation = useCallback(
    async (invitationId: string) => {
      const res = await managementWebBucketAdmins.deleteBucketAdminInvitation(
        baseUrl,
        bucketId,
        invitationId,
        null
      );
      if (res.ok) {
        setPendingInvitations((prev) => prev.filter((i) => i.id !== invitationId));
        return { ok: true as const };
      }
      return {
        ok: false as const,
        error:
          res.error !== undefined && typeof res.error.message === 'string'
            ? res.error.message
            : 'Failed to remove invitation',
      };
    },
    [baseUrl, bucketId]
  );

  const webBase = getWebAppUrl();
  const getInviteLinkUrl = useCallback(
    (token: string) => {
      const base = webBase !== undefined && webBase !== '' ? webBase.replace(/\/$/, '') : '';
      return base !== '' ? `${base}/invite/${token}` : `/invite/${token}`;
    },
    [webBase]
  );

  if (loading) {
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
      getInviteLinkUrl={getInviteLinkUrl}
      locale={locale}
    />
  );
}
