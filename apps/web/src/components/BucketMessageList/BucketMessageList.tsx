'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CrudButtons, Text } from '@boilerplate/ui';

import { getApiBaseUrl } from '../../lib/api-client';

import styles from './BucketMessageList.module.scss';

export type BucketMessageListItem = {
  id: string;
  senderName: string;
  body: string;
  isPublic: boolean;
  createdAt: string;
  bucketId?: string;
};

export type BucketMessageListProps = {
  messages: BucketMessageListItem[];
  variant: 'management' | 'public';
  bucketId?: string;
  emptyMessage?: string;
  onDelete?: (messageId: string) => void;
  /** When true, constrains the list to 600px max-width for readable text. */
  readableText?: boolean;
};

function snippet(body: string, max = 80): string {
  return body.length <= max ? body : body.slice(0, max) + '…';
}

export function BucketMessageList({
  messages: initialMessages,
  variant,
  bucketId,
  emptyMessage,
  onDelete,
  readableText = false,
}: BucketMessageListProps) {
  const t = useTranslations('buckets');
  const [messages, setMessages] = useState<BucketMessageListItem[]>(initialMessages);
  const showActions = variant === 'management' && bucketId !== undefined;

  const handleDelete = async (messageId: string): Promise<void> => {
    if (onDelete !== undefined) {
      onDelete(messageId);
      return;
    }
    if (!confirm(t('delete') + ' this message?')) return;
    const baseUrl = getApiBaseUrl();
    if (bucketId === undefined) return;
    const res = await fetch(`${baseUrl}/buckets/${bucketId}/messages/${messageId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    }
  };

  const empty =
    emptyMessage ?? (variant === 'public' ? 'No public messages yet.' : 'No messages yet.');

  if (messages.length === 0) {
    return <Text variant="muted">{empty}</Text>;
  }

  const listClassName = readableText ? `${styles.list} ${styles.readableText}` : styles.list;

  return (
    <ul className={listClassName}>
      {messages.map((m) => (
        <li key={m.id} className={styles.listItem}>
          <div className={styles.listItemInner}>
            <Card className={styles.messageCard}>
              <div className={styles.content}>
                <div className={styles.headerRow}>
                  <span className={styles.senderName}>{m.senderName}</span>
                  <span className={styles.meta}>
                    {variant === 'management' && (
                      <span
                        className={styles.publicPrivateIcon}
                        title={m.isPublic ? t('publicLabel') : t('privateLabel')}
                        aria-label={m.isPublic ? t('publicLabel') : t('privateLabel')}
                      >
                        <i
                          className={m.isPublic ? 'fa-solid fa-globe' : 'fa-solid fa-lock'}
                          aria-hidden
                        />
                      </span>
                    )}
                    <span>{new Date(m.createdAt).toLocaleString()}</span>
                  </span>
                </div>
                {variant === 'public' ? (
                  <div className={styles.bodyFull}>{m.body}</div>
                ) : (
                  <div className={styles.bodySnippet}>{snippet(m.body)}</div>
                )}
              </div>
            </Card>
            {showActions && (
              <div className={styles.actions}>
                <CrudButtons
                  editHref={`/buckets/${bucketId}/messages/${m.id}/edit`}
                  editLabel={t('edit')}
                  onDelete={() => handleDelete(m.id)}
                  deleteLabel={t('delete')}
                />
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
