import type { HTMLAttributes } from 'react';

export type AppViewProps = HTMLAttributes<HTMLDivElement>;

export function AppView({ className = '', ...props }: AppViewProps) {
  return <div className={`app-view ${className}`.trim()} {...props} />;
}
