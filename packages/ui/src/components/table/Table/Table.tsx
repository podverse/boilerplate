import type { HTMLAttributes, ThHTMLAttributes } from 'react';

import styles from './Table.module.scss';

export type TableScrollContainerProps = HTMLAttributes<HTMLDivElement>;

function TableScrollContainer({ className = '', children, ...props }: TableScrollContainerProps) {
  return (
    <div className={`${styles.scrollContainer} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export type TableProps = HTMLAttributes<HTMLTableElement>;

export function Table({ className = '', ...props }: TableProps) {
  return <table className={`${styles.root} ${className}`.trim()} {...props} />;
}

export type TableHeadProps = HTMLAttributes<HTMLTableSectionElement>;

function TableHead({ className = '', ...props }: TableHeadProps) {
  return <thead className={className} {...props} />;
}

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

function TableBody({ className = '', ...props }: TableBodyProps) {
  return <tbody className={`${styles.body} ${className}`.trim()} {...props} />;
}

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

function TableRow({ className = '', ...props }: TableRowProps) {
  return <tr className={className} {...props} />;
}

export type TableHeaderCellProps = ThHTMLAttributes<HTMLTableCellElement>;

function TableHeaderCell({ className = '', scope = 'col', ...props }: TableHeaderCellProps) {
  return <th className={`${styles.headerCell} ${className}`.trim()} scope={scope} {...props} />;
}

export type TableCellProps = HTMLAttributes<HTMLTableCellElement>;

function TableCell({ className = '', ...props }: TableCellProps) {
  return <td className={`${styles.cell} ${className}`.trim()} {...props} />;
}

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.HeaderCell = TableHeaderCell;
Table.Cell = TableCell;
Table.ScrollContainer = TableScrollContainer;
