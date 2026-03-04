'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Button,
  CopyLinkBox,
  CrudButtons,
  CrudCheckboxes,
  Divider,
  FormContainer,
  Link,
  SectionWithHeading,
  Stack,
  Text,
  UnorderedList,
} from '@boilerplate/ui';
import type { CrudFlags } from '@boilerplate/ui';
import { CRUD_BITS, bitmaskToFlags, flagsToBitmask } from '@boilerplate/helpers';
import { getApiBaseUrl } from '../../../../lib/api-client';
import { bucketSettingsAdminEditRoute } from '../../../../lib/routes';

import styles from './BucketAdminsClient.module.scss';

type PendingInvitationRow = {
  id: string;
  token: string;
  bucketCrud: number;
  messageCrud: number;
  adminCrud?: number;
  status: string;
  expiresAt: string;
};

type AdminRow = {
  id: string;
  bucketId: string;
  userId: string;
  bucketCrud: number;
  messageCrud: number;
  adminCrud?: number;
  createdAt: string;
  user: { id: string; shortId: string; email: string; displayName: string | null } | null;
};

function formatEmailDisplayName(email: string, displayName: string | null | undefined): string {
  const trimmed =
    displayName !== undefined && displayName !== null && displayName !== ''
      ? displayName.trim()
      : null;
  return trimmed !== null ? `${email} (${trimmed})` : email;
}

function formatExpiresAt(locale: string, expiresAt: string): string {
  const d = new Date(expiresAt);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
}

const CRUD_ORDER: Array<'create' | 'read' | 'update' | 'delete'> = [
  'create',
  'read',
  'update',
  'delete',
];

function formatCrudMask(
  mask: number,
  labels: Record<'create' | 'read' | 'update' | 'delete', string>
): string {
  const flags = bitmaskToFlags(mask);
  const set = CRUD_ORDER.filter((k) => flags[k]).map((k) => labels[k]);
  return set.length > 0 ? set.join(', ') : '—';
}

export function BucketAdminsClient({
  bucketId,
  ownerId,
  initialAdmins,
  initialPendingInvitations,
}: {
  bucketId: string;
  ownerId: string;
  initialAdmins: AdminRow[];
  initialPendingInvitations: PendingInvitationRow[];
}) {
  const t = useTranslations('buckets');
  const locale = useLocale();
  const crudLabels: Record<'create' | 'read' | 'update' | 'delete', string> = {
    create: t('crudCreate'),
    read: t('crudRead'),
    update: t('crudUpdate'),
    delete: t('crudDelete'),
  };
  const [admins, setAdmins] = useState<AdminRow[]>(initialAdmins);
  const [pendingInvitations, setPendingInvitations] =
    useState<PendingInvitationRow[]>(initialPendingInvitations);
  const [bucketFlags, setBucketFlags] = useState<CrudFlags>({
    create: false,
    read: true,
    update: false,
    delete: false,
  });
  const [messageFlags, setMessageFlags] = useState<CrudFlags>({
    create: true,
    read: true,
    update: false,
    delete: false,
  });
  const [adminFlags, setAdminFlags] = useState<CrudFlags>({
    create: false,
    read: true,
    update: false,
    delete: false,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const setAdminFlagsWithReadForced = (next: CrudFlags) => {
    setAdminFlags({ ...next, read: true });
  };

  const handleGenerateLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setInviteLink(null);
    setLoading(true);
    const baseUrl = getApiBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/buckets/${bucketId}/admin-invitations`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bucketCrud: flagsToBitmask(bucketFlags),
          messageCrud: flagsToBitmask(messageFlags),
          adminCrud: flagsToBitmask(adminFlags) | CRUD_BITS.read,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(
          typeof data?.message === 'string' ? data.message : 'Failed to create invitation'
        );
        return;
      }
      const data = (await res.json()) as {
        invitation?: PendingInvitationRow;
      };
      const inv = data.invitation;
      if (
        inv !== undefined &&
        typeof inv.token === 'string' &&
        typeof inv.expiresAt === 'string' &&
        typeof window !== 'undefined'
      ) {
        setInviteLink(`${window.location.origin}/invite/${inv.token}`);
        setPendingInvitations((prev) => [...prev, inv]);
      }
    } catch {
      setSubmitError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adminUserId: string) => {
    if (!confirm(t('delete') + ' this admin?')) return;
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/buckets/${bucketId}/admins/${adminUserId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      setAdmins((prev) => prev.filter((a) => (a.user?.shortId ?? a.userId) !== adminUserId));
    }
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    if (!confirm(t('delete') + ' this invitation?')) return;
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/buckets/${bucketId}/admin-invitations/${invitationId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      setPendingInvitations((prev) => prev.filter((i) => i.id !== invitationId));
    }
  };

  return (
    <>
      <FormContainer onSubmit={handleGenerateLink}>
        <Stack>
          <Text as="p" variant="muted">
            {t('addAdminDescription')}
          </Text>
          <CrudCheckboxes
            label="Bucket permissions"
            labels={crudLabels}
            flags={bucketFlags}
            onChange={setBucketFlags}
          />
          <CrudCheckboxes
            label="Message permissions"
            labels={crudLabels}
            flags={messageFlags}
            onChange={setMessageFlags}
          />
          <CrudCheckboxes
            label={t('adminPermissionsLabel')}
            labels={crudLabels}
            flags={adminFlags}
            onChange={setAdminFlagsWithReadForced}
            disabledBits={{ read: true }}
          />
          {submitError !== null && (
            <Text variant="error" size="sm" as="p" role="alert">
              {submitError}
            </Text>
          )}
          <Button type="submit" variant="primary" loading={loading}>
            {t('addAdmin')}
          </Button>
          {inviteLink !== null && (
            <CopyLinkBox
              value={inviteLink}
              description={t('inviteLinkCopy')}
              copyLabel={t('copy')}
              copiedLabel={t('copied')}
              inputAriaLabel={t('inviteLinkCopy')}
            />
          )}
        </Stack>
        <Divider />

        {admins.length === 0 ? (
          <Text variant="muted">No bucket admins yet.</Text>
        ) : (
          <UnorderedList>
            {admins.map((a) => (
              <li key={a.id} className={styles.listItem}>
                <div>
                  <Text>
                    {a.user !== undefined && a.user !== null
                      ? formatEmailDisplayName(a.user.email, a.user.displayName)
                      : a.userId}
                  </Text>
                  <Text variant="muted" as="p" className={styles.adminCrudMeta}>
                    Bucket: {formatCrudMask(a.bucketCrud, crudLabels)}
                    <br />
                    Message: {formatCrudMask(a.messageCrud, crudLabels)}
                    <br />
                    Admin: {formatCrudMask(a.adminCrud ?? CRUD_BITS.read, crudLabels)}
                  </Text>
                </div>
                <div className={styles.actions}>
                  {a.userId !== ownerId ? (
                    <CrudButtons
                      editHref={bucketSettingsAdminEditRoute(bucketId, a.user?.shortId ?? a.userId)}
                      editLabel={t('edit')}
                      onDelete={() => handleDelete(a.user?.shortId ?? a.userId)}
                      deleteLabel={t('delete')}
                    />
                  ) : (
                    <Text variant="muted" size="sm">
                      {t('owner')}
                    </Text>
                  )}
                </div>
              </li>
            ))}
          </UnorderedList>
        )}
      </FormContainer>

      {pendingInvitations.length > 0 ? (
        <>
          <Divider />
          <SectionWithHeading title={t('pendingInvitations')}>
            <table className={styles.pendingTable}>
              <thead>
                <tr>
                  <th scope="col">{t('invitationLink')}</th>
                  <th scope="col">{t('expires')}</th>
                  <th scope="col" aria-label={t('delete')} />
                </tr>
              </thead>
              <tbody>
                {pendingInvitations.map((inv) => {
                  const invitePath = `/invite/${inv.token}`;
                  return (
                    <tr key={inv.id}>
                      <td>
                        <Link href={invitePath} target="_blank" rel="noopener noreferrer">
                          {invitePath}
                        </Link>
                      </td>
                      <td>{formatExpiresAt(locale, inv.expiresAt)}</td>
                      <td>
                        <CrudButtons
                          onDelete={() => handleDeleteInvitation(inv.id)}
                          deleteLabel={t('delete')}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </SectionWithHeading>
        </>
      ) : null}
    </>
  );
}
