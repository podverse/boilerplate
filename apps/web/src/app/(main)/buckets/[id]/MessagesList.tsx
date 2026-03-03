'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button, Text } from '@boilerplate/ui';
import { getApiBaseUrl } from '../../../../lib/api-client';

type Message = {
  id: string;
  bucketId: string;
  senderName: string;
  body: string;
  isPublic: boolean;
  createdAt: string;
};

export function MessagesList({
  bucketId,
  initialMessages,
}: {
  bucketId: string;
  initialMessages: Message[];
}) {
  const t = useTranslations('buckets');
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleDelete = async (messageId: string) => {
    if (!confirm(t('delete') + ' this message?')) return;
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/buckets/${bucketId}/messages/${messageId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    }
  };

  const snippet = (body: string, max = 80) =>
    body.length <= max ? body : body.slice(0, max) + '…';

  return (
    <>
      {messages.length === 0 ? (
        <Text variant="muted">No messages yet.</Text>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {messages.map((m) => (
            <li
              key={m.id}
              style={{
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--pv-color-border, #eee)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                }}
              >
                <div>
                  <Text style={{ fontWeight: 600 }}>{m.senderName}</Text>
                  <Text variant="muted" style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                    {m.isPublic ? t('publicYes') : t('publicNo')} ·{' '}
                    {new Date(m.createdAt).toLocaleString()}
                  </Text>
                  <Text style={{ display: 'block', marginTop: '0.25rem' }}>{snippet(m.body)}</Text>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <Link href={`/buckets/${bucketId}/messages/${m.id}/edit`}>
                    <Button type="button" variant="secondary">
                      {t('edit')}
                    </Button>
                  </Link>
                  <Button type="button" variant="secondary" onClick={() => handleDelete(m.id)}>
                    {t('delete')}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
