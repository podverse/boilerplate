'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Input, CrudCheckboxes, Text } from '@boilerplate/ui';
import type { CrudFlags } from '@boilerplate/ui';
import { flagsToBitmask } from '@boilerplate/helpers';
import { getApiBaseUrl } from '../../../../lib/api-client';

type AdminRow = {
  id: string;
  bucketId: string;
  userId: string;
  bucketCrud: number;
  messageCrud: number;
  createdAt: string;
  user: { id: string; email: string; displayName: string | null } | null;
};

export function BucketAdminsClient({
  bucketId,
  initialAdmins,
}: {
  bucketId: string;
  initialAdmins: AdminRow[];
}) {
  const t = useTranslations('buckets');
  const crudLabels: Record<'create' | 'read' | 'update' | 'delete', string> = {
    create: t('crudCreate'),
    read: t('crudRead'),
    update: t('crudUpdate'),
    delete: t('crudDelete'),
  };
  const [admins, setAdmins] = useState<AdminRow[]>(initialAdmins);
  const [userId, setUserId] = useState('');
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    const trimmed = userId.trim();
    if (!trimmed) {
      setSubmitError('User ID is required.');
      return;
    }
    setLoading(true);
    const baseUrl = getApiBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/v1/buckets/${bucketId}/admins`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: trimmed,
          bucketCrud: flagsToBitmask(bucketFlags),
          messageCrud: flagsToBitmask(messageFlags),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(typeof data?.message === 'string' ? data.message : 'Failed to add admin');
        return;
      }
      const data = (await res.json()) as { admin?: AdminRow };
      if (data.admin !== undefined) {
        setAdmins((prev) => [...prev, data.admin as AdminRow]);
        setUserId('');
        setBucketFlags({ create: false, read: true, update: false, delete: false });
        setMessageFlags({ create: true, read: true, update: false, delete: false });
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
    const res = await fetch(`${baseUrl}/v1/buckets/${bucketId}/admins/${adminUserId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      setAdmins((prev) => prev.filter((a) => a.userId !== adminUserId));
    }
  };

  return (
    <>
      <form onSubmit={handleAdd} style={{ marginBottom: '1.5rem' }}>
        <Input
          label="User ID (UUID)"
          type="text"
          value={userId}
          onChange={setUserId}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          disabled={loading}
        />
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
        {submitError !== null && (
          <Text variant="error" size="sm" as="p" role="alert" style={{ marginBottom: '0.5rem' }}>
            {submitError}
          </Text>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          Add admin
        </Button>
      </form>

      {admins.length === 0 ? (
        <Text variant="muted">No bucket admins yet.</Text>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {admins.map((a) => (
            <li
              key={a.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--pv-color-border, #eee)',
              }}
            >
              <div>
                <Text>{a.user?.displayName ?? a.user?.email ?? a.userId}</Text>
                <Text variant="muted" style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                  Bucket: {a.bucketCrud} · Message: {a.messageCrud}
                </Text>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href={`/buckets/${bucketId}/admins/${a.userId}/edit`}>
                  <Button type="button" variant="secondary">
                    {t('edit')}
                  </Button>
                </Link>
                <Button type="button" variant="secondary" onClick={() => handleDelete(a.userId)}>
                  {t('delete')}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
