import type { HTMLAttributes } from 'react';

export type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ className = '', ...props }: ContainerProps) {
  return <div className={`container ${className}`.trim()} {...props} />;
}
