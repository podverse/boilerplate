import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { request } from '@boilerplate/helpers-requests';
import { BucketsTableWithFilter } from '../../../components/BucketsTableWithFilter';
import { FilterTablePageLayout } from '@boilerplate/ui';

import { getServerUser } from '../../../lib/server-auth';
import {
  getCookieHeader,
  getServerApiBaseUrl,
  parseFilterColumns,
} from '../../../lib/server-request';
import { ROUTES } from '../../../lib/routes';

export const dynamic = 'force-dynamic';

export type Bucket = {
  id: string;
  shortId: string;
  ownerId: string;
  name: string;
  slug: string;
  isPublic: boolean;
  parentBucketId: string | null;
  createdAt: string;
  updatedAt: string;
};

type BucketsResponse = { buckets: Bucket[] };

async function fetchBuckets(
  search?: string
): Promise<{ data: BucketsResponse | null; error: string | null }> {
  const cookieHeader = await getCookieHeader();
  const baseUrl = getServerApiBaseUrl();
  const path =
    search !== undefined && search.trim() !== ''
      ? `/buckets?${new URLSearchParams({ search: search.trim() }).toString()}`
      : '/buckets';
  try {
    const res = await request(baseUrl, path, {
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

type PageProps = {
  searchParams?: Promise<{ filterColumns?: string; search?: string }>;
};

export default async function BucketsPage({ searchParams }: PageProps) {
  const user = await getServerUser();
  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const t = await getTranslations('buckets');
  const resolved = searchParams !== undefined ? await searchParams : {};
  const bucketColumnIds = ['name'];
  const effectiveFilterColumns = parseFilterColumns(resolved, bucketColumnIds);
  const search = resolved.search ?? '';

  const { data, error } = await fetchBuckets(search);
  const buckets = data?.buckets ?? [];

  const tableRows = buckets.map((b) => ({
    id: b.shortId,
    cells: {
      name: b.name,
      isPublic: b.isPublic ? t('publicYes') : t('publicNo'),
    },
  }));

  const columns = [
    { id: 'name', label: t('name') },
    { id: 'isPublic', label: t('isPublic') },
  ];

  const currentQueryParams: Record<string, string> = {};
  if ((resolved.filterColumns ?? '').trim() !== '')
    currentQueryParams.filterColumns = resolved.filterColumns ?? '';
  if (search !== '') currentQueryParams.search = search;

  return (
    <FilterTablePageLayout
      title={t('title')}
      error={error !== null ? t('failedToLoad') : undefined}
    >
      {error === null && (
        <BucketsTableWithFilter
          tableRows={tableRows}
          emptyMessage={buckets.length === 0 ? t('noBuckets') : undefined}
          columns={columns}
          initialFilterColumns={effectiveFilterColumns}
          initialSearch={search}
          basePath={ROUTES.BUCKETS}
          currentQueryParams={currentQueryParams}
          addBucketHref={ROUTES.BUCKETS_NEW}
          filterableColumnIds={['name']}
        />
      )}
    </FilterTablePageLayout>
  );
}
