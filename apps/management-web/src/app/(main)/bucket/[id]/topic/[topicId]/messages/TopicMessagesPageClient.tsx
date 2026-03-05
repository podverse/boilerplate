'use client';

import { useRouter } from 'next/navigation';
import { managementWebBucketMessages } from '@boilerplate/helpers-requests';
import { Breadcrumbs, BucketMessageList, ContentPageLayout, Link } from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';
import type { BucketMessageListItem } from '@boilerplate/ui';

import { getManagementApiBaseUrl } from '../../../../../../../config/env';
import { topicMessageEditRoute } from '../../../../../../../lib/routes';

export type TopicMessagesPageClientProps = {
  parentId: string;
  topicId: string;
  parentName: string;
  topicName: string;
  parentHref: string;
  topicHref: string;
  messages: BucketMessageListItem[];
  messagesTitle: string;
  messagesAriaLabel: string;
  emptyMessage: string;
};

function BreadcrumbLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function TopicMessagesPageClient({
  parentId,
  topicId,
  parentName,
  topicName,
  parentHref,
  topicHref,
  messages,
  messagesTitle,
  messagesAriaLabel,
  emptyMessage,
}: TopicMessagesPageClientProps) {
  const router = useRouter();
  const apiBaseUrl = getManagementApiBaseUrl();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: parentName, href: parentHref },
    { label: topicName, href: topicHref },
    { label: messagesTitle, href: undefined },
  ];

  const handleDelete = async (messageId: string): Promise<void> => {
    const res = await managementWebBucketMessages.deleteBucketMessage(
      apiBaseUrl,
      topicId,
      messageId
    );
    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <ContentPageLayout
      breadcrumbs={
        <Breadcrumbs
          items={breadcrumbItems}
          LinkComponent={BreadcrumbLink}
          ariaLabel={messagesAriaLabel}
        />
      }
      title={messagesTitle}
      contentMaxWidth="readable"
    >
      <BucketMessageList
        messages={messages}
        variant="management"
        bucketId={topicId}
        emptyMessage={emptyMessage}
        onDelete={handleDelete}
        getEditHref={(messageId) => topicMessageEditRoute(parentId, topicId, messageId)}
      />
    </ContentPageLayout>
  );
}
