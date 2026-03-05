'use client';

import { BucketMessageList } from '../BucketMessageList';
import type { BucketMessageListItem } from '../BucketMessageList';
import { BucketMessagesBreadcrumbs } from '../BucketMessagesBreadcrumbs';
import { ContentPageLayout } from '../../layout/ContentPageLayout';

/**
 * Shared bucket messages page content for web and management-web.
 * Renders breadcrumbs + title + message list only. No "Add message" — that is only on the public bucket page.
 */
export type BucketMessagesPageContentProps = {
  bucketName: string;
  bucketDetailHref: string;
  messagesAriaLabel: string;
  messagesTitle: string;
  messages: BucketMessageListItem[];
  bucketId: string;
  emptyMessage: string;
  onDelete?: (messageId: string) => void | Promise<void>;
  getEditHref: (messageId: string) => string;
};

export function BucketMessagesPageContent({
  bucketName,
  bucketDetailHref,
  messagesAriaLabel,
  messagesTitle,
  messages,
  bucketId,
  emptyMessage,
  onDelete,
  getEditHref,
}: BucketMessagesPageContentProps) {
  return (
    <ContentPageLayout
      breadcrumbs={
        <BucketMessagesBreadcrumbs
          bucketName={bucketName}
          bucketDetailHref={bucketDetailHref}
          messagesAriaLabel={messagesAriaLabel}
        />
      }
      title={messagesTitle}
      contentMaxWidth="readable"
    >
      <BucketMessageList
        messages={messages}
        variant="management"
        bucketId={bucketId}
        emptyMessage={emptyMessage}
        onDelete={onDelete}
        getEditHref={getEditHref}
      />
    </ContentPageLayout>
  );
}
