import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { DEFAULT_PAGE_LIMIT } from '@boilerplate/helpers';
import { request } from '@boilerplate/helpers-requests';
import { Card, Container, Stack, Text } from '@boilerplate/ui';

import { AdminsTableWithFilter } from '../../../components/AdminsTableWithFilter';
import { getServerUser } from '../../../lib/server-auth';
import { getManagementApiBaseUrl } from '../../../config/env';
import { adminEditRoute, ROUTES } from '../../../lib/routes';
import type { ManagementUser } from '../../../types/management-api';
import styles from './admins.module.scss';

type AdminsResponse = {
  admins: ManagementUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

async function fetchAdmins(
  page: number,
  limit: number,
  search?: string
): Promise<{ data: AdminsResponse | null; error: string | null }> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const baseUrl = getManagementApiBaseUrl();
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (limit !== DEFAULT_PAGE_LIMIT) params.set('limit', String(limit));
  if (search !== undefined && search !== '') params.set('search', search);
  const query = params.toString();
  const path = query ? `${ROUTES.ADMINS}?${query}` : ROUTES.ADMINS;

  try {
    const res = await request(baseUrl, path, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { data: null, error: 'Failed to load admins' };
    }

    const data = res.data as AdminsResponse | undefined;
    if (
      data === undefined ||
      !Array.isArray(data.admins) ||
      typeof data.total !== 'number' ||
      typeof data.page !== 'number' ||
      typeof data.totalPages !== 'number'
    ) {
      return { data: null, error: null };
    }
    return { data, error: null };
  } catch {
    return { data: null, error: 'Failed to load admins' };
  }
}

type PageProps = {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    filterColumns?: string;
    search?: string;
  }>;
};

export default async function AdminsPage({ searchParams }: PageProps) {
  const user = await getServerUser();

  if (user === null) {
    redirect(ROUTES.LOGIN);
  }

  const resolved = searchParams !== undefined ? await searchParams : {};
  const page = Math.max(1, Number(resolved.page) || 1);
  const limit = DEFAULT_PAGE_LIMIT;
  const filterColumnsRaw = resolved.filterColumns ?? '';
  const adminColumnIds = ['email', 'displayName'];
  const initialFilterColumns =
    filterColumnsRaw.trim() === ''
      ? adminColumnIds
      : filterColumnsRaw
          .split(',')
          .map((s) => s.trim())
          .filter((id) => adminColumnIds.includes(id));
  const effectiveFilterColumns =
    initialFilterColumns.length > 0 ? initialFilterColumns : adminColumnIds;
  const search = resolved.search ?? '';

  const tCommon = await getTranslations('common');
  const { data, error } = await fetchAdmins(page, limit, search === '' ? undefined : search);

  const admins = data?.admins ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? 1;

  const isSuperAdmin = user.isSuperAdmin;
  const apiBaseUrl = getManagementApiBaseUrl();

  const tableRows = admins.map((a) => ({
    id: a.id,
    cells: {
      email: a.email,
      displayName: a.displayName !== null && a.displayName !== '' ? a.displayName : '—',
    },
  }));

  const adminColumns = [
    { id: 'email', label: tCommon('adminsTable.email') },
    { id: 'displayName', label: tCommon('adminsTable.displayName') },
  ];

  const currentQueryParams: Record<string, string> = {};
  if (page > 1) currentQueryParams.page = String(page);
  if (filterColumnsRaw.trim() !== '') currentQueryParams.filterColumns = filterColumnsRaw;
  if (search !== '') currentQueryParams.search = search;

  return (
    <Container>
      <Stack>
        <Card title={tCommon('admins')}>
          {isSuperAdmin && (
            <div className={styles.addAdminActions}>
              <Link href={ROUTES.ADMINS_NEW} className={styles.addAdminLink}>
                {tCommon('addAdmin')}
              </Link>
            </div>
          )}
          {error !== null && (
            <Text variant="error" role="alert">
              {error}
            </Text>
          )}
          {error === null && (
            <Stack>
              <AdminsTableWithFilter
                tableRows={tableRows}
                emptyMessage={admins.length === 0 ? tCommon('noAdmins') : undefined}
                columns={adminColumns}
                initialFilterColumns={effectiveFilterColumns}
                initialSearch={search}
                basePath={ROUTES.ADMINS}
                currentQueryParams={currentQueryParams}
                currentPage={currentPage}
                totalPages={totalPages}
                limit={limit}
                defaultLimit={DEFAULT_PAGE_LIMIT}
                maxGoToPage={500}
                isSuperAdmin={isSuperAdmin}
                adminApiBaseUrl={apiBaseUrl}
                adminEditRoute={adminEditRoute}
              />
            </Stack>
          )}
        </Card>
      </Stack>
    </Container>
  );
}
