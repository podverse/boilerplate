'use client';

import { managementWebAdmins } from '@boilerplate/helpers-requests';
import type { TableFilterBarColumn } from '@boilerplate/ui';

import { useAuth } from '../context/AuthContext';
import { adminEditRoute } from '../lib/routes';
import {
  ResourceTableWithFilter,
  type FilterableTableRow,
  type ResourceTableWithFilterPagination,
} from './ResourceTableWithFilter';

export type { FilterableTableRow };

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
  canUpdateAdmin: boolean;
  canDeleteAdmin: boolean;
  adminApiBaseUrl: string;
  addAdminHref?: string;
  currentUserId?: string;
};

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
  canUpdateAdmin,
  canDeleteAdmin,
  adminApiBaseUrl,
  addAdminHref,
  currentUserId,
}: AdminsTableWithFilterProps) {
  const { logout } = useAuth();

  const pagination: ResourceTableWithFilterPagination = {
    currentPage,
    totalPages,
    limit,
    defaultLimit,
    maxGoToPage,
  };

  const getRowActions = (row: FilterableTableRow): { canUpdate: boolean; canDelete: boolean } => {
    if (row.isSuperAdmin === true) {
      return {
        canUpdate: currentUserId !== undefined && row.id === currentUserId,
        canDelete: false,
      };
    }
    return { canUpdate: canUpdateAdmin, canDelete: canDeleteAdmin };
  };

  return (
    <ResourceTableWithFilter
      tableRows={tableRows}
      emptyMessage={emptyMessage}
      columns={columns}
      initialFilterColumns={initialFilterColumns}
      initialSearch={initialSearch}
      basePath={basePath}
      currentQueryParams={currentQueryParams}
      editRoute={adminEditRoute}
      onDelete={(baseUrl, id) => managementWebAdmins.deleteAdmin(baseUrl, id)}
      addHref={addAdminHref}
      addLabelKey="addAdmin"
      actionsLabelKey="adminsTable.actions"
      editLabelKey="adminsTable.edit"
      deleteLabelKey="adminsTable.delete"
      canUpdate={canUpdateAdmin}
      canDelete={canDeleteAdmin}
      getRowActions={getRowActions}
      apiBaseUrl={adminApiBaseUrl}
      confirmDeleteTranslationKeyPrefix="common.confirmDeleteAdmin"
      getDisplayName={(row) => row.cells['displayName'] ?? ''}
      pagination={pagination}
      currentUserId={currentUserId}
      onSelfDelete={async () => {
        logout();
      }}
      searchSyncParams={{ page: '1' }}
    />
  );
}
