'use client';

import {
  TableWithFilter,
  type FilterableTableRow,
  type TableFilterBarColumn,
} from '@boilerplate/ui';

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
};

export function AdminsTableWithFilter(props: AdminsTableWithFilterProps) {
  return <TableWithFilter {...props} />;
}
