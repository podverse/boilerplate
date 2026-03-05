'use client';

import { useState } from 'react';
import { Button } from '../../form/Button/Button';
import { CopyLinkBox } from '../../layout/CopyLinkBox/CopyLinkBox';
import { CrudButtons } from '../../form/CrudButtons/CrudButtons';
import { CrudCheckboxes } from '../../form/CrudCheckboxes/CrudCheckboxes';
import type { CrudFlags } from '../../form/CrudCheckboxes/CrudCheckboxes';
import { Divider } from '../../layout/Divider/Divider';
import { FormContainer } from '../../form/FormContainer/FormContainer';
import { Link } from '../../navigation/Link/Link';
import { SectionWithHeading } from '../../layout/SectionWithHeading/SectionWithHeading';
import { Stack } from '../../layout/Stack/Stack';
import { Text } from '../../layout/Text/Text';
import { UnorderedList } from '../../layout/UnorderedList/UnorderedList';
import { CRUD_BITS, bitmaskToFlags, flagsToBitmask } from '@boilerplate/helpers';

import styles from './BucketAdminsView.module.scss';

export type BucketAdminRow = {
  id: string;
  bucketId: string;
  userId: string;
  bucketCrud: number;
  messageCrud: number;
  adminCrud?: number;
  createdAt: string;
  user: { id: string; shortId: string; email: string; displayName: string | null } | null;
};

export type BucketAdminInvitationRow = {
  id: string;
  token: string;
  bucketCrud: number;
  messageCrud: number;
  adminCrud?: number;
  status: string;
  expiresAt: string;
};

export type BucketAdminsViewLabels = {
  addAdmin: string;
  addAdminDescription: string;
  bucketPermissions: string;
  messagePermissions: string;
  adminPermissionsLabel: string;
  crudCreate: string;
  crudRead: string;
  crudUpdate: string;
  crudDelete: string;
  noAdminsYet: string;
  edit: string;
  delete: string;
  deleteConfirmAdmin: string;
  deleteConfirmInvitation: string;
  owner: string;
  pendingInvitations: string;
  invitationLink: string;
  expires: string;
  inviteLinkCopy: string;
  copy: string;
  copied: string;
  save: string;
  cancel: string;
  /** Optional fallback when a delete callback returns { ok: false, error }. If not set, the returned error is shown. */
  deleteError?: string;
};

const CRUD_ORDER: Array<'create' | 'read' | 'update' | 'delete'> = [
  'create',
  'read',
  'update',
  'delete',
];

function formatEmailDisplayName(email: string, displayName: string | null | undefined): string {
  const trimmed =
    displayName !== undefined && displayName !== null && displayName !== ''
      ? displayName.trim()
      : null;
  return trimmed !== null ? `${email} (${trimmed})` : email;
}

function formatCrudMask(
  mask: number,
  labels: Record<'create' | 'read' | 'update' | 'delete', string>
): string {
  const flags = bitmaskToFlags(mask);
  const set = CRUD_ORDER.filter((k) => flags[k]).map((k) => labels[k]);
  return set.length > 0 ? set.join(', ') : '—';
}

export type BucketAdminsViewProps = {
  admins: BucketAdminRow[];
  pendingInvitations: BucketAdminInvitationRow[];
  ownerId: string;
  labels: BucketAdminsViewLabels;
  /** Create invitation; returns token on success or error message. */
  onCreateInvitation: (body: {
    bucketCrud: number;
    messageCrud: number;
    adminCrud: number;
  }) => Promise<{ token: string } | { error: string }>;
  /**
   * Best-effort delete of a bucket admin. May return { ok: false, error } on failure;
   * the view will show that error. Parent may still update list only when ok.
   */
  onDeleteAdmin: (userId: string) => void | Promise<void | { ok: boolean; error?: string }>;
  /**
   * Best-effort delete of a pending invitation. May return { ok: false, error } on failure;
   * the view will show that error. Parent may still update list only when ok.
   */
  onDeleteInvitation: (
    invitationId: string
  ) => void | Promise<void | { ok: boolean; error?: string }>;
  /** Build edit page URL for an admin (userId is shortId or UUID). */
  getEditHref: (userId: string) => string;
  /** Build full invite link URL from token (e.g. origin + /invite/{token}). */
  getInviteLinkUrl: (token: string) => string;
  /** Optional: locale for formatting invitation expiry (e.g. from useLocale()). */
  locale?: string;
};

function formatExpiresAt(locale: string, expiresAt: string): string {
  const d = new Date(expiresAt);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
}

export function BucketAdminsView({
  admins,
  pendingInvitations,
  ownerId,
  labels,
  onCreateInvitation,
  onDeleteAdmin,
  onDeleteInvitation,
  getEditHref,
  getInviteLinkUrl,
  locale = 'en-US',
}: BucketAdminsViewProps) {
  const crudLabels: Record<'create' | 'read' | 'update' | 'delete', string> = {
    create: labels.crudCreate,
    read: labels.crudRead,
    update: labels.crudUpdate,
    delete: labels.crudDelete,
  };
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
  const [deleteError, setDeleteError] = useState<string | null>(null);
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
    try {
      const result = await onCreateInvitation({
        bucketCrud: flagsToBitmask(bucketFlags),
        messageCrud: flagsToBitmask(messageFlags),
        adminCrud: flagsToBitmask(adminFlags) | CRUD_BITS.read,
      });
      if ('token' in result) {
        setInviteLink(getInviteLinkUrl(result.token));
      } else {
        setSubmitError(result.error);
      }
    } catch {
      setSubmitError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminUserId: string) => {
    setDeleteError(null);
    if (!confirm(labels.deleteConfirmAdmin)) return;
    const result = await Promise.resolve(onDeleteAdmin(adminUserId));
    if (
      result !== undefined &&
      typeof result === 'object' &&
      result !== null &&
      'ok' in result &&
      result.ok === false &&
      typeof result.error === 'string'
    ) {
      setDeleteError(labels.deleteError ?? result.error);
    }
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    setDeleteError(null);
    if (!confirm(labels.deleteConfirmInvitation)) return;
    const result = await Promise.resolve(onDeleteInvitation(invitationId));
    if (
      result !== undefined &&
      typeof result === 'object' &&
      result !== null &&
      'ok' in result &&
      result.ok === false &&
      typeof result.error === 'string'
    ) {
      setDeleteError(labels.deleteError ?? result.error);
    }
  };

  return (
    <>
      <FormContainer onSubmit={handleGenerateLink}>
        <Stack>
          <Text as="p" variant="muted">
            {labels.addAdminDescription}
          </Text>
          <CrudCheckboxes
            label={labels.bucketPermissions}
            labels={crudLabels}
            flags={bucketFlags}
            onChange={setBucketFlags}
          />
          <CrudCheckboxes
            label={labels.messagePermissions}
            labels={crudLabels}
            flags={messageFlags}
            onChange={setMessageFlags}
          />
          <CrudCheckboxes
            label={labels.adminPermissionsLabel}
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
            {labels.addAdmin}
          </Button>
          {inviteLink !== null && (
            <CopyLinkBox
              value={inviteLink}
              description={labels.inviteLinkCopy}
              copyLabel={labels.copy}
              copiedLabel={labels.copied}
              inputAriaLabel={labels.inviteLinkCopy}
            />
          )}
        </Stack>
        <Divider />

        {deleteError !== null && (
          <Text variant="error" size="sm" as="p" role="alert">
            {deleteError}
          </Text>
        )}
        {admins.length === 0 ? (
          <Text variant="muted">{labels.noAdminsYet}</Text>
        ) : (
          <UnorderedList>
            {admins.map((a) => {
              const userIdForHref = a.user?.shortId ?? a.userId;
              return (
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
                        editHref={getEditHref(userIdForHref)}
                        editLabel={labels.edit}
                        onDelete={() => handleDeleteAdmin(userIdForHref)}
                        deleteLabel={labels.delete}
                      />
                    ) : (
                      <Text variant="muted" size="sm">
                        {labels.owner}
                      </Text>
                    )}
                  </div>
                </li>
              );
            })}
          </UnorderedList>
        )}
      </FormContainer>

      {pendingInvitations.length > 0 ? (
        <>
          <Divider />
          <SectionWithHeading title={labels.pendingInvitations}>
            <table className={styles.pendingTable}>
              <thead>
                <tr>
                  <th scope="col">{labels.invitationLink}</th>
                  <th scope="col">{labels.expires}</th>
                  <th scope="col" aria-label={labels.delete} />
                </tr>
              </thead>
              <tbody>
                {pendingInvitations.map((inv) => {
                  const url = getInviteLinkUrl(inv.token);
                  return (
                    <tr key={inv.id}>
                      <td>
                        <Link href={url} target="_blank" rel="noopener noreferrer">
                          {url}
                        </Link>
                      </td>
                      <td>{formatExpiresAt(locale, inv.expiresAt)}</td>
                      <td>
                        <CrudButtons
                          onDelete={() => handleDeleteInvitation(inv.id)}
                          deleteLabel={labels.delete}
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
