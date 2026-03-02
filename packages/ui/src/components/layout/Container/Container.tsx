import type { HTMLAttributes } from 'react';

import styles from './Container.module.scss';

export type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ className = '', ...props }: ContainerProps) {
  return (
    <div
      className={className ? `${styles.container} ${className}` : styles.container}
      {...props}
    />
  );
}
