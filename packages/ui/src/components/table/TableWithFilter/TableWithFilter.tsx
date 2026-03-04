'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { SEARCH_DEBOUNCE_MS } from '@boilerplate/helpers';

import { Pagination } from '../../navigation/Pagination';
import { Table } from '../Table';
import { TableFilterBar, type TableFilterBarColumn } from '../TableFilterBar';

import styles from './TableWithFilter.module.scss';

export type FilterableTableRow = {
  id: string;
  cells: Record<string, string>;
};

export type TableWithFilterProps = {
  tableRows: FilterableTableRow[];
  /** Shown below the filter when there are no rows (e.g. "No admins found."). */
  emptyMessage?: string;
  columns: TableFilterBarColumn[];
  initialFilterColumns: string[];
  /** Current server-side search from URL; filter input syncs with this and pushes URL on change. */
  initialSearch: string;
  basePath: string;
  currentQueryParams: Record<string, string>;
  currentPage: number;
  totalPages: number;
  limit: number;
  defaultLimit: number;
  /** Optional extra query params to include in pagination URLs (e.g. { sort: 'oldest' }). */
  extraPaginationParams?: Record<string, string>;
  /** When set, go-to-page modal is capped at this many pages (e.g. 500). */
  maxGoToPage?: number;
  /** Optional content rendered on the same row as the filter bar (e.g. sort select), aligned to the end. Row wraps when space is tight. */
  trailingToolbar?: React.ReactNode;
  /** When set, only these column IDs appear in the filter dropdown. Omit to allow all columns. */
  filterableColumnIds?: string[];
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

export function TableWithFilter({
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
  extraPaginationParams,
  maxGoToPage,
  trailingToolbar,
  filterableColumnIds,
}: TableWithFilterProps) {
  const router = useRouter();
  const tFilterBar = useTranslations('ui.tableFilterBar');
  const tPagination = useTranslations('ui.pagination');
  const tGoToModal = useTranslations('ui.pagination.goToPageModal');

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
  const filterColumns = useMemo(
    () =>
      filterableColumnIds !== undefined && filterableColumnIds.length > 0
        ? columns.filter((c) => filterableColumnIds.includes(c.id))
        : columns,
    [columns, filterableColumnIds]
  );
  const allColumnIds = useMemo(() => filterColumns.map((c) => c.id), [filterColumns]);
  const [filter, setFilter] = useState(initialSearch);
  const lastInitialSearchRef = useRef(initialSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedColumnIds, setSelectedColumnIds] = useState<string[]>(() =>
    initialFilterColumns.length > 0 ? initialFilterColumns : allColumnIds
  );

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

  const paginationQueryParams = useMemo(() => {
    const merged = { ...currentQueryParams, ...extraPaginationParams };
    return Object.keys(merged).length > 0 ? merged : undefined;
  }, [currentQueryParams, extraPaginationParams]);

  return (
    <>
      <div className={styles.filterRow}>
        <div className={styles.filterBarWrapper}>
          <TableFilterBar
            searchValue={filter}
            onSearchChange={setFilter}
            columns={filterColumns}
            selectedColumnIds={selectedColumnIds}
            onSelectedColumnIdsChange={handleFilterColumnsChange}
            placeholder={filterPlaceholder}
            filterColumnsLabel={filterColumnsLabel}
            funnelButtonLabel={funnelButtonLabel}
          />
        </div>
        {trailingToolbar !== undefined && trailingToolbar !== null && (
          <div className={styles.trailingToolbar}>{trailingToolbar}</div>
        )}
      </div>
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
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rowsToShow.map((row) => (
              <Table.Row key={row.id}>
                {columns.map((col) => (
                  <Table.Cell key={col.id}>{row.cells[col.id] ?? '—'}</Table.Cell>
                ))}
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
          queryParams={paginationQueryParams}
          maxGoToPage={maxGoToPage}
          labels={paginationLabels}
        />
      )}
    </>
  );
}
