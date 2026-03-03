import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { Card, Container, Stack } from '@boilerplate/ui';

import { getServerUser } from '../../../../../../../lib/server-auth';
import { getCookieHeader, getServerApiBaseUrl } from '../../../../../../../lib/server-request';
import { ROUTES, bucketMessagesRoute } from '../../../../../../../lib/routes';
import { EditMessageForm } from '../../../EditMessageForm';

type Bucket = { id: string; name: string };
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
  const bucket = res.data as Bucket;
  return typeof bucket?.id === 'string' ? { bucket } : { bucket: null };
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

export default async function EditMessagePage({
  params,
}: {
  params: Promise<{ id: string; messageId: string }>;
}) {
  const user = await getServerUser();
  if (user === null) redirect(ROUTES.LOGIN);

  const { id: bucketId, messageId } = await params;
  const { bucket } = await fetchBucket(bucketId);
  if (bucket === null) notFound();

  const message = await fetchMessage(bucketId, messageId);
  if (message === null) notFound();

  const t = await getTranslations('buckets');
  return (
    <Container>
      <Stack>
        <Card title={`${t('edit')} message`}>
          <EditMessageForm
            bucketId={bucketId}
            messageId={messageId}
            initialBody={message.body}
            initialIsPublic={message.isPublic}
            successHref={bucketMessagesRoute(bucketId)}
            cancelHref={bucketMessagesRoute(bucketId)}
          />
        </Card>
      </Stack>
    </Container>
  );
}
