'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button, Pagination, Table, TableFilterBar, Text } from '@boilerplate/ui';
import type { TableFilterBarColumn } from '@boilerplate/ui';

import { useDeleteModal } from '../hooks/useDeleteModal';
import { filterRows, useTableFilterState } from '../hooks/useTableFilterState';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import styles from './ResourceTableWithFilter.module.scss';

export type FilterableTableRow = {
  id: string;
  cells: Record<string, string>;
};

export type ResourceTableWithFilterPagination = {
  currentPage: number;
  totalPages: number;
  limit: number;
  defaultLimit: number;
  maxGoToPage?: number;
};

export type ResourceTableWithFilterProps = {
  tableRows: FilterableTableRow[];
  emptyMessage?: string;
  columns: TableFilterBarColumn[];
  initialFilterColumns: string[];
  initialSearch: string;
  basePath: string;
  currentQueryParams: Record<string, string>;
  editRoute: (id: string) => string;
  onDelete: (
    baseUrl: string,
    id: string
  ) => Promise<{
    ok: boolean;
    error?: { message?: string };
  }>;
  addHref?: string;
  addLabelKey: string;
  actionsLabelKey: string;
  editLabelKey: string;
  deleteLabelKey: string;
  canUpdate: boolean;
  canDelete: boolean;
  apiBaseUrl: string;
  confirmDeleteTranslationKeyPrefix: string;
  getDisplayName: (row: FilterableTableRow) => string;
  pagination?: ResourceTableWithFilterPagination;
  currentUserId?: string;
  onSelfDelete?: () => Promise<void>;
  searchSyncParams?: Record<string, string>;
};

export function ResourceTableWithFilter({
  tableRows,
  emptyMessage,
  columns,
  initialFilterColumns,
  initialSearch,
  basePath,
  currentQueryParams,
  editRoute,
  onDelete,
  addHref,
  addLabelKey,
  actionsLabelKey,
  editLabelKey,
  deleteLabelKey,
  canUpdate,
  canDelete,
  apiBaseUrl,
  confirmDeleteTranslationKeyPrefix,
  getDisplayName,
  pagination,
  currentUserId,
  onSelfDelete,
  searchSyncParams,
}: ResourceTableWithFilterProps) {
  const tFilterBar = useTranslations('ui.tableFilterBar');
  const tPagination = useTranslations('ui.pagination');
  const tGoToModal = useTranslations('ui.pagination.goToPageModal');
  const tCommon = useTranslations('common');
  const tErrors = useTranslations('errors');

  const filterPlaceholder = tFilterBar('placeholder');
  const filterColumnsLabel = tFilterBar('filterColumnsLabel');
  const funnelButtonLabel = tFilterBar('funnelButtonLabel');

  const paginationLabels = useMemo(
    () =>
      pagination !== undefined
        ? {
            previous: tPagination('previous'),
            next: tPagination('next'),
            goToPage: tPagination('goToPage'),
            goToPageModal: {
              title: tGoToModal('title'),
              pageLabel: tGoToModal('pageLabel'),
              submitLabel: tGoToModal('submitLabel'),
              closeLabel: tGoToModal('closeLabel'),
            },
          }
        : undefined,
    [pagination, tPagination, tGoToModal]
  );

  const allColumnIds = useMemo(() => columns.map((c) => c.id), [columns]);
  const { filter, setFilter, selectedColumnIds, handleFilterColumnsChange } = useTableFilterState({
    initialSearch,
    initialFilterColumns,
    allColumnIds,
    basePath,
    currentQueryParams,
    searchSyncParams,
  });

  const {
    deleteTarget,
    setDeleteTarget,
    deleteLoading,
    deleteError,
    handleConfirm: handleDeleteConfirm,
    handleCancel: handleDeleteCancel,
  } = useDeleteModal({
    onDelete,
    apiBaseUrl,
    deleteFailedMessage: tErrors('deleteFailed'),
    currentUserId,
    onSelfDelete,
  });

  const rowsToShow =
    initialSearch.trim() !== '' ? tableRows : filterRows(tableRows, filter, selectedColumnIds);

  const showActions = canUpdate || canDelete;

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
      {addHref !== undefined && (
        <div className={styles.addRow}>
          <Link href={addHref} className={styles.addLink}>
            {tCommon(addLabelKey)}
          </Link>
        </div>
      )}
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
              {showActions && <Table.HeaderCell>{tCommon(actionsLabelKey)}</Table.HeaderCell>}
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
                      {canUpdate && (
                        <Link href={editRoute(row.id)} className={styles.editLink}>
                          {tCommon(editLabelKey)}
                        </Link>
                      )}
                      {canDelete && (
                        <Button
                          variant="secondary"
                          onClick={() =>
                            setDeleteTarget({
                              id: row.id,
                              displayName: getDisplayName(row),
                            })
                          }
                        >
                          {tCommon(deleteLabelKey)}
                        </Button>
                      )}
                    </div>
                  </Table.Cell>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Table.ScrollContainer>
      {pagination !== undefined && paginationLabels !== undefined && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          basePath={basePath}
          limit={pagination.limit}
          defaultLimit={pagination.defaultLimit}
          queryParams={Object.keys(currentQueryParams).length > 0 ? currentQueryParams : undefined}
          maxGoToPage={pagination.maxGoToPage}
          labels={paginationLabels}
        />
      )}
      <ConfirmDeleteModal
        open={deleteTarget !== null}
        displayName={deleteTarget?.displayName ?? ''}
        translationKeyPrefix={confirmDeleteTranslationKeyPrefix}
        onConfirm={() => {
          void handleDeleteConfirm();
        }}
        onCancel={handleDeleteCancel}
        confirmLoading={deleteLoading}
      />
    </>
  );
}
