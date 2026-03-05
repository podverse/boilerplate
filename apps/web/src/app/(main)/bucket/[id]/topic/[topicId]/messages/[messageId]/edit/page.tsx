import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { Breadcrumbs, Container, Link, SectionWithHeading } from '@boilerplate/ui';
import type { BreadcrumbItem } from '@boilerplate/ui';

import { getServerUser } from '../../../../../../../../../lib/server-auth';
import {
  getCookieHeader,
  getServerApiBaseUrl,
} from '../../../../../../../../../lib/server-request';
import {
  ROUTES,
  bucketDetailRoute,
  topicDetailRoute,
  topicMessagesRoute,
} from '../../../../../../../../../lib/routes';
import { EditMessageForm } from '../../../../../EditMessageForm';

type Bucket = {
  id: string;
  name: string;
  messageBodyMaxLength?: number | null;
  parentBucketId?: string | null;
};
type Message = {
  id: string;
  bucketId: string;
  senderName: string;
  body: string;
  isPublic: boolean;
};

async function fetchBucket(id: string): Promise<{ bucket: Bucket | null }> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  const res = await request(baseUrl, `/buckets/${id}`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok || res.data === undefined) return { bucket: null };
  const data = res.data as { bucket?: Bucket };
  const bucket = data.bucket;
  return bucket !== undefined && typeof bucket?.id === 'string' ? { bucket } : { bucket: null };
}

async function fetchMessage(bucketId: string, messageId: string): Promise<Message | null> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  const res = await request(baseUrl, `/buckets/${bucketId}/messages/${messageId}`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!res.ok || res.data === undefined) return null;
  const data = res.data as { message?: Message };
  const msg = data.message;
  return msg !== undefined && typeof msg?.id === 'string' ? msg : null;
}

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

export default async function TopicMessageEditPage({
  params,
}: {
  params: Promise<{ id: string; topicId: string; messageId: string }>;
}) {
  const user = await getServerUser();
  if (user === null) redirect(ROUTES.LOGIN);

  const { id: parentId, topicId, messageId } = await params;
  const { bucket: parent } = await fetchBucket(parentId);
  const { bucket: topic } = await fetchBucket(topicId);
  if (parent === null || topic === null || topic.parentBucketId !== parent.id) {
    notFound();
  }

  const message = await fetchMessage(topicId, messageId);
  if (message === null) notFound();

  const t = await getTranslations('buckets');
  const messagesHref = topicMessagesRoute(parentId, topicId);
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: parent.name, href: bucketDetailRoute(parentId) },
    { label: topic.name, href: topicDetailRoute(parentId, topicId) },
    { label: t('messages'), href: messagesHref },
    { label: `${t('edit')} message`, href: undefined },
  ];

  return (
    <Container>
      <Breadcrumbs
        items={breadcrumbItems}
        LinkComponent={BreadcrumbLink}
        ariaLabel={t('messages')}
      />
      <SectionWithHeading title={`${t('edit')} message`}>
        <EditMessageForm
          bucketId={topicId}
          messageId={messageId}
          initialBody={message.body}
          initialIsPublic={message.isPublic}
          messageBodyMaxLength={topic.messageBodyMaxLength ?? null}
          successHref={messagesHref}
          cancelHref={messagesHref}
        />
      </SectionWithHeading>
    </Container>
  );
}
