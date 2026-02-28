import type { HTMLAttributes } from 'react';

export type ListProps = HTMLAttributes<HTMLUListElement> & {
  size?: 'sm';
};

export function List({ size, className = '', ...props }: ListProps) {
  const layoutClass = size === 'sm' ? 'list-plain list-plain-sm' : 'list-plain';
  return <ul className={`${layoutClass} ${className}`.trim()} {...props} />;
}
