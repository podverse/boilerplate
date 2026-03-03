import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { PublicBucket, PublicBucketMessage } from '@boilerplate/helpers-requests';
import { webBuckets } from '@boilerplate/helpers-requests';
import { Button, Card, Container, Stack, Text } from '@boilerplate/ui';

import { getServerApiBaseUrl } from '../../../../lib/server-request';
import { publicBucketSubmitRoute } from '../../../../lib/routes';

async function fetchPublicBucket(id: string): Promise<PublicBucket | null> {
  const baseUrl = getServerApiBaseUrl();
  const res = await webBuckets.reqFetchPublicBucket(baseUrl, id);
  if (!res.ok || res.data === undefined) return null;
  const bucket = res.data.bucket;
  return bucket !== undefined && typeof bucket?.id === 'string' ? bucket : null;
}

async function fetchPublicMessages(id: string): Promise<PublicBucketMessage[]> {
  const baseUrl = getServerApiBaseUrl();
  const res = await webBuckets.reqFetchPublicBucketMessages(baseUrl, id);
  if (!res.ok || res.data === undefined) return [];
  const data = res.data;
  return Array.isArray(data.messages) ? data.messages : [];
}

export default async function PublicBucketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bucket = await fetchPublicBucket(id);
  if (bucket === null || !bucket.isPublic) {
    notFound();
  }

  const messages = await fetchPublicMessages(id);
  const t = await getTranslations('buckets');

  return (
    <Container>
      <Stack>
        <Card title={bucket.name}>
          <div style={{ marginTop: '1rem' }}>
            <Link href={publicBucketSubmitRoute(id)}>
              <Button variant="primary">Submit a message</Button>
            </Link>
          </div>
        </Card>
        <Card title={t('messages')}>
          {messages.length === 0 ? (
            <Text variant="muted">No public messages yet.</Text>
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
                  <Text style={{ fontWeight: 600 }}>{m.senderName}</Text>
                  <Text variant="muted" style={{ fontSize: '0.875rem' }}>
                    {new Date(m.createdAt).toLocaleString()}
                  </Text>
                  <Text style={{ display: 'block', marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>
                    {m.body}
                  </Text>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Stack>
    </Container>
  );
}
