import type { HTMLAttributes } from 'react';

import styles from './Row.module.scss';

export type RowProps = HTMLAttributes<HTMLDivElement> & {
  wrap?: boolean;
};

export function Row({ wrap = false, className = '', ...props }: RowProps) {
  const layoutClass = wrap ? styles.rowWrap : styles.row;
  return <div className={className ? `${layoutClass} ${className}` : layoutClass} {...props} />;
}
