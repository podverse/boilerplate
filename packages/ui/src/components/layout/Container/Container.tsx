import type { HTMLAttributes } from 'react';

import { Stack } from '../Stack';

import styles from './Container.module.scss';

export type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ className = '', children, ...rest }: ContainerProps) {
  return (
    <div className={className ? `${styles.container} ${className}` : styles.container} {...rest}>
      <Stack>{children}</Stack>
    </div>
  );
}
