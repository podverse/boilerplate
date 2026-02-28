import type { HTMLAttributes } from 'react';

export type StackProps = HTMLAttributes<HTMLDivElement>;

export function Stack({ className = '', ...props }: StackProps) {
  return <div className={`stack ${className}`.trim()} {...props} />;
}
