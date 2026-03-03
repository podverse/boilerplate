'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Input, FormActions, CheckboxField, Text } from '@boilerplate/ui';
import { webBuckets } from '@boilerplate/helpers-requests';
import { getApiBaseUrl } from '../../../../../lib/api-client';

export function PublicSubmitForm({
  bucketId,
  successHref,
}: {
  bucketId: string;
  successHref: string;
}) {
  const t = useTranslations('buckets');
  const router = useRouter();
  const [senderName, setSenderName] = useState('');
  const [body, setBody] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    if (!senderName.trim()) {
      setSubmitError('Your name is required.');
      return;
    }
    if (!body.trim()) {
      setSubmitError('Message body is required.');
      return;
    }
    setLoading(true);
    const baseUrl = getApiBaseUrl();
    try {
      const res = await webBuckets.reqPostPublicBucketMessage(baseUrl, bucketId, {
        senderName: senderName.trim(),
        body: body.trim(),
        isPublic,
      });
      if (!res.ok) {
        setSubmitError(res.error.message ?? 'Failed to submit message');
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
      <Input
        label="Your name"
        type="text"
        value={senderName}
        onChange={setSenderName}
        disabled={loading}
        required
      />
      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 500 }}>Message</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={loading}
          rows={4}
          required
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
          Submit
        </Button>
      </FormActions>
    </form>
  );
}
