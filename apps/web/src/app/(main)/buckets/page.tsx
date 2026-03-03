import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { Button, Card, Container, Stack, Text } from '@boilerplate/ui';

import { getServerUser } from '../../../lib/server-auth';
import { getCookieHeader, getServerApiBaseUrl } from '../../../lib/server-request';
import { ROUTES, bucketDetailRoute, bucketEditRoute } from '../../../lib/routes';

export type Bucket = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  isPublic: boolean;
  parentBucketId: string | null;
  createdAt: string;
  updatedAt: string;
};

type BucketsResponse = { buckets: Bucket[] };

async function fetchBuckets(): Promise<{ data: BucketsResponse | null; error: string | null }> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  try {
    const res = await request(baseUrl, '/buckets', {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) {
      return { data: null, error: 'Failed to load buckets' };
    }
    const data = res.data as BucketsResponse | undefined;
    if (data === undefined || !Array.isArray(data.buckets)) {
      return { data: null, error: null };
    }
    return { data, error: null };
  } catch {
    return { data: null, error: 'Failed to load buckets' };
  }
}

export default async function BucketsPage() {
  const user = await getServerUser();
  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const t = await getTranslations('buckets');
  const { data, error } = await fetchBuckets();
  const buckets = data?.buckets ?? [];

  return (
    <Container>
      <Stack>
        <Card title={t('title')}>
          <div style={{ marginBottom: '1rem' }}>
            <Link href={ROUTES.BUCKETS_NEW}>
              <Button variant="primary">{t('addBucket')}</Button>
            </Link>
          </div>
          {error !== null && <Text variant="muted">{t('failedToLoad')}</Text>}
          {error === null && buckets.length === 0 && <Text variant="muted">{t('noBuckets')}</Text>}
          {error === null && buckets.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {buckets.map((b) => (
                <li
                  key={b.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid var(--pv-color-border, #eee)',
                  }}
                >
                  <div>
                    <Link
                      href={bucketDetailRoute(b.id)}
                      style={{ fontWeight: 600, textDecoration: 'none' }}
                    >
                      {b.name}
                    </Link>
                    <Text variant="muted" style={{ marginLeft: '0.5rem' }}>
                      {[b.slug?.trim(), `${t('isPublic')}: ${b.isPublic ? t('publicYes') : t('publicNo')}`]
                        .filter(Boolean)
                        .join(', ')}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={bucketEditRoute(b.id)}>
                      <Button variant="secondary">{t('edit')}</Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Stack>
    </Container>
  );
}
