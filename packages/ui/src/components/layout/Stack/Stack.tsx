import type { HTMLAttributes } from 'react';

import styles from './Stack.module.scss';

export type StackProps = HTMLAttributes<HTMLDivElement>;

export function Stack({ className = '', ...props }: StackProps) {
  return <div className={className ? `${styles.stack} ${className}` : styles.stack} {...props} />;
}
