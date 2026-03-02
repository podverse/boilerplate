'use client';

import { managementWebUsers } from '@boilerplate/helpers-requests';
import type { TableFilterBarColumn } from '@boilerplate/ui';

import { userEditRoute } from '../lib/routes';
import {
  ResourceTableWithFilter,
  type FilterableTableRow,
} from './ResourceTableWithFilter';

export type { FilterableTableRow };

export type UsersTableWithFilterProps = {
  tableRows: FilterableTableRow[];
  emptyMessage?: string;
  columns: TableFilterBarColumn[];
  initialFilterColumns: string[];
  initialSearch: string;
  basePath: string;
  currentQueryParams: Record<string, string>;
  canUpdateUser: boolean;
  canDeleteUser: boolean;
  userApiBaseUrl: string;
  addUserHref?: string;
};

export function UsersTableWithFilter({
  tableRows,
  emptyMessage,
  columns,
  initialFilterColumns,
  initialSearch,
  basePath,
  currentQueryParams,
  canUpdateUser,
  canDeleteUser,
  userApiBaseUrl,
  addUserHref,
}: UsersTableWithFilterProps) {
  return (
    <ResourceTableWithFilter
      tableRows={tableRows}
      emptyMessage={emptyMessage}
      columns={columns}
      initialFilterColumns={initialFilterColumns}
      initialSearch={initialSearch}
      basePath={basePath}
      currentQueryParams={currentQueryParams}
      editRoute={userEditRoute}
      onDelete={(baseUrl, id) => managementWebUsers.deleteUser(baseUrl, id)}
      addHref={addUserHref}
      addLabelKey="addUser"
      actionsLabelKey="usersTable.actions"
      editLabelKey="usersTable.edit"
      deleteLabelKey="usersTable.delete"
      canUpdate={canUpdateUser}
      canDelete={canDeleteUser}
      apiBaseUrl={userApiBaseUrl}
      confirmDeleteTranslationKeyPrefix="common.confirmDeleteUser"
      getDisplayName={(row) =>
        row.cells['displayName'] ?? row.cells['email'] ?? ''
      }
    />
  );
}
