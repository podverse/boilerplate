import type { HTMLAttributes } from 'react';

export type RowProps = HTMLAttributes<HTMLDivElement> & {
  wrap?: boolean;
};

export function Row({ wrap = false, className = '', ...props }: RowProps) {
  const layoutClass = wrap ? 'row-wrap' : 'row';
  return <div className={`${layoutClass} ${className}`.trim()} {...props} />;
}
