'use client';

import { useRouter } from 'next/navigation';
import { BucketMessagesPageContent } from '@boilerplate/ui';
import type { BucketMessageListItem } from '@boilerplate/ui';

import { getApiBaseUrl } from '../../../../../lib/api-client';
import { bucketMessageEditRoute } from '../../../../../lib/routes';

export type BucketMessagesPageClientProps = {
  bucketId: string;
  bucketName: string;
  bucketDetailHref: string;
  messages: BucketMessageListItem[];
  messagesTitle: string;
  messagesAriaLabel: string;
  emptyMessage: string;
};

export function BucketMessagesPageClient({
  bucketId,
  bucketName,
  bucketDetailHref,
  messages,
  messagesTitle,
  messagesAriaLabel,
  emptyMessage,
}: BucketMessagesPageClientProps) {
  const router = useRouter();

  const handleDelete = async (messageId: string): Promise<void> => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/buckets/${bucketId}/messages/${messageId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <BucketMessagesPageContent
      bucketName={bucketName}
      bucketDetailHref={bucketDetailHref}
      messagesAriaLabel={messagesAriaLabel}
      messagesTitle={messagesTitle}
      messages={messages}
      bucketId={bucketId}
      emptyMessage={emptyMessage}
      onDelete={handleDelete}
      getEditHref={(messageId) => bucketMessageEditRoute(bucketId, messageId)}
    />
  );
}
