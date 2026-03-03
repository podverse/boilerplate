'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button, CrudCheckboxes, FormActions, Text } from '@boilerplate/ui';
import type { CrudFlags } from '@boilerplate/ui';
import { bitmaskToFlags, flagsToBitmask } from '@boilerplate/helpers';
import { getApiBaseUrl } from '../../../../lib/api-client';

export function EditBucketAdminForm({
  bucketId,
  userId,
  initialBucketCrud,
  initialMessageCrud,
  successHref,
  cancelHref,
}: {
  bucketId: string;
  userId: string;
  initialBucketCrud: number;
  initialMessageCrud: number;
  successHref: string;
  cancelHref: string;
}) {
  const t = useTranslations('buckets');
  const crudLabels: Record<'create' | 'read' | 'update' | 'delete', string> = {
    create: t('crudCreate'),
    read: t('crudRead'),
    update: t('crudUpdate'),
    delete: t('crudDelete'),
  };
  const router = useRouter();
  const [bucketFlags, setBucketFlags] = useState<CrudFlags>(bitmaskToFlags(initialBucketCrud));
  const [messageFlags, setMessageFlags] = useState<CrudFlags>(bitmaskToFlags(initialMessageCrud));
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setLoading(true);
    const baseUrl = getApiBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/v1/buckets/${bucketId}/admins/${userId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bucketCrud: flagsToBitmask(bucketFlags),
          messageCrud: flagsToBitmask(messageFlags),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(typeof data?.message === 'string' ? data.message : 'Failed to update admin');
        return;
      }
      router.push(successHref);
    } catch {
      setSubmitError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <Text variant="error" size="sm" as="p" role="alert" style={{ marginBottom: '1rem' }}>
          {submitError}
        </Text>
      )}
      <FormActions>
        <Button type="submit" variant="primary" loading={loading}>
          {t('save')}
        </Button>
        <Link href={cancelHref}>
          <Button type="button" variant="secondary">
            {t('cancel')}
          </Button>
        </Link>
      </FormActions>
    </form>
  );
}
