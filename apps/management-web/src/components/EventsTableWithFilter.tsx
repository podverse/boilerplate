'use client';

import {
  TableWithFilter,
  type FilterableTableRow,
  type TableFilterBarColumn,
} from '@boilerplate/ui';

export type { FilterableTableRow };

export type EventsTableWithFilterProps = {
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
  sort: string;
  maxGoToPage?: number;
};

export function EventsTableWithFilter(props: EventsTableWithFilterProps) {
  const { sort, ...rest } = props;
  const extraPaginationParams = sort === 'oldest' ? { sort: 'oldest' } : undefined;
  return <TableWithFilter {...rest} extraPaginationParams={extraPaginationParams} />;
}
