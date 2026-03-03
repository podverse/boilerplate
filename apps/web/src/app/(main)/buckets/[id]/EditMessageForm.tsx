'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button, CheckboxField, FormActions, Text } from '@boilerplate/ui';
import { getApiBaseUrl } from '../../../../lib/api-client';

export function EditMessageForm({
  bucketId,
  messageId,
  initialBody,
  initialIsPublic,
  successHref,
  cancelHref,
}: {
  bucketId: string;
  messageId: string;
  initialBody: string;
  initialIsPublic: boolean;
  successHref: string;
  cancelHref: string;
}) {
  const t = useTranslations('buckets');
  const router = useRouter();
  const [body, setBody] = useState(initialBody);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    if (!body.trim()) {
      setSubmitError('Message body is required.');
      return;
    }
    setLoading(true);
    const baseUrl = getApiBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/v1/buckets/${bucketId}/messages/${messageId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: body.trim(), isPublic }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(
          typeof data?.message === 'string' ? data.message : 'Failed to update message'
        );
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
      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 500 }}>Body</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={loading}
          rows={4}
          style={{ display: 'block', width: '100%', marginTop: '0.25rem', padding: '0.5rem' }}
        />
      </label>
      <CheckboxField
        label={t('isPublic')}
        checked={isPublic}
        onChange={setIsPublic}
        disabled={loading}
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
