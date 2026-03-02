'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { SEARCH_DEBOUNCE_MS } from '@boilerplate/helpers';
import { managementWebAdmins } from '@boilerplate/helpers-requests';
import { Button, Pagination, Table, TableFilterBar, Text } from '@boilerplate/ui';
import type { TableFilterBarColumn } from '@boilerplate/ui';

import { ConfirmDeleteAdminModal } from './admins/ConfirmDeleteAdminModal';
import styles from './AdminsTableWithFilter.module.scss';

export type FilterableTableRow = {
  id: string;
  cells: Record<string, string>;
};

export type AdminsTableWithFilterProps = {
  tableRows: FilterableTableRow[];
  emptyMessage?: string;
  columns: TableFilterBarColumn[];
  initialFilterColumns: string[];
  initialSearch: string;
  basePath: string;
  currentQueryParams: Record<string, string>;
  currentPage: number;
  totalPages: number;
  limit: number;
  defaultLimit: number;
  maxGoToPage?: number;
  isSuperAdmin: boolean;
  adminApiBaseUrl: string;
  adminEditRoute: (id: string) => string;
};

function filterRows(
  rows: FilterableTableRow[],
  search: string,
  selectedColumnIds: string[]
): FilterableTableRow[] {
  const q = search.trim().toLowerCase();
  if (q === '') return rows;
  return rows.filter((row) =>
    selectedColumnIds.some((colId) => {
      const cell = row.cells[colId];
      return typeof cell === 'string' && cell.toLowerCase().includes(q);
    })
  );
}

export function AdminsTableWithFilter({
  tableRows,
  emptyMessage,
  columns,
  initialFilterColumns,
  initialSearch,
  basePath,
  currentQueryParams,
  currentPage,
  totalPages,
  limit,
  defaultLimit,
  maxGoToPage,
  isSuperAdmin,
  adminApiBaseUrl,
  adminEditRoute,
}: AdminsTableWithFilterProps) {
  const router = useRouter();
  const tFilterBar = useTranslations('ui.tableFilterBar');
  const tPagination = useTranslations('ui.pagination');
  const tGoToModal = useTranslations('ui.pagination.goToPageModal');
  const tCommon = useTranslations('common');
  const tErrors = useTranslations('errors');

  const filterPlaceholder = tFilterBar('placeholder');
  const filterColumnsLabel = tFilterBar('filterColumnsLabel');
  const funnelButtonLabel = tFilterBar('funnelButtonLabel');

  const paginationLabels = useMemo(
    () => ({
      previous: tPagination('previous'),
      next: tPagination('next'),
      goToPage: tPagination('goToPage'),
      goToPageModal: {
        title: tGoToModal('title'),
        pageLabel: tGoToModal('pageLabel'),
        submitLabel: tGoToModal('submitLabel'),
        closeLabel: tGoToModal('closeLabel'),
      },
    }),
    [tPagination, tGoToModal]
  );

  const allColumnIds = useMemo(() => columns.map((c) => c.id), [columns]);
  const [filter, setFilter] = useState(initialSearch);
  const lastInitialSearchRef = useRef(initialSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedColumnIds, setSelectedColumnIds] = useState<string[]>(() =>
    initialFilterColumns.length > 0 ? initialFilterColumns : allColumnIds
  );

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; displayName: string } | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (initialSearch !== lastInitialSearchRef.current) {
      lastInitialSearchRef.current = initialSearch;
      setFilter(initialSearch);
    }
  }, [initialSearch]);

  const queryParamsKey = JSON.stringify(currentQueryParams);
  useEffect(() => {
    if (debounceRef.current !== null) clearTimeout(debounceRef.current);
    if (filter === initialSearch) return;
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      const params = new URLSearchParams(currentQueryParams);
      params.set('search', filter.trim());
      params.set('page', '1');
      router.push(`${basePath}?${params.toString()}`);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current !== null) clearTimeout(debounceRef.current);
    };
  }, [filter, initialSearch, basePath, queryParamsKey, router]);

  const rowsToShow =
    initialSearch.trim() !== '' ? tableRows : filterRows(tableRows, filter, selectedColumnIds);

  const handleFilterColumnsChange = useCallback(
    (ids: string[]) => {
      setSelectedColumnIds(ids);
      const params = new URLSearchParams(currentQueryParams);
      params.set('filterColumns', ids.join(','));
      router.push(`${basePath}?${params.toString()}`);
    },
    [basePath, currentQueryParams, router]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteTarget === null) return;
    setDeleteLoading(true);
    setDeleteError(null);
    const res = await managementWebAdmins.deleteAdmin(adminApiBaseUrl, deleteTarget.id);
    setDeleteLoading(false);
    if (res.ok) {
      setDeleteTarget(null);
      router.refresh();
    } else {
      setDeleteError(res.error.message ?? tErrors('deleteFailed'));
    }
  }, [deleteTarget, adminApiBaseUrl, router, tCommon]);

  const showActions = isSuperAdmin;

  return (
    <>
      <div className={styles.filterRow}>
        <TableFilterBar
          searchValue={filter}
          onSearchChange={setFilter}
          columns={columns}
          selectedColumnIds={selectedColumnIds}
          onSelectedColumnIdsChange={handleFilterColumnsChange}
          placeholder={filterPlaceholder}
          filterColumnsLabel={filterColumnsLabel}
          funnelButtonLabel={funnelButtonLabel}
        />
      </div>
      {deleteError !== null && (
        <Text variant="error" role="alert" className={styles.deleteError}>
          {deleteError}
        </Text>
      )}
      {emptyMessage !== undefined && emptyMessage !== '' && (
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      )}
      <Table.ScrollContainer>
        <Table>
          <Table.Head>
            <Table.Row>
              {columns.map((col) => (
                <Table.HeaderCell key={col.id}>{col.label}</Table.HeaderCell>
              ))}
              {showActions && <Table.HeaderCell>{tCommon('adminsTable.actions')}</Table.HeaderCell>}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rowsToShow.map((row) => (
              <Table.Row key={row.id}>
                {columns.map((col) => (
                  <Table.Cell key={col.id}>{row.cells[col.id] ?? '—'}</Table.Cell>
                ))}
                {showActions && (
                  <Table.Cell>
                    <div className={styles.actionsCell}>
                      <Link href={adminEditRoute(row.id)} className={styles.editLink}>
                        {tCommon('adminsTable.edit')}
                      </Link>
                      <Button
                        variant="secondary"
                        className={styles.deleteButton}
                        onClick={() =>
                          setDeleteTarget({
                            id: row.id,
                            displayName: row.cells['displayName'] ?? '',
                          })
                        }
                      >
                        {tCommon('adminsTable.delete')}
                      </Button>
                    </div>
                  </Table.Cell>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Table.ScrollContainer>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={basePath}
          limit={limit}
          defaultLimit={defaultLimit}
          queryParams={Object.keys(currentQueryParams).length > 0 ? currentQueryParams : undefined}
          maxGoToPage={maxGoToPage}
          labels={paginationLabels}
        />
      )}
      <ConfirmDeleteAdminModal
        open={deleteTarget !== null}
        displayName={deleteTarget?.displayName ?? ''}
        onConfirm={() => {
          void handleDeleteConfirm();
        }}
        onCancel={() => {
          if (!deleteLoading) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
      />
    </>
  );
}
