import type { HTMLAttributes } from 'react';

import { Stack } from '../Stack';

import styles from './Container.module.scss';

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  /** When set, constrains inner content width: "readable" (e.g. messages list), "form" (form width). Passed to Stack. */
  contentMaxWidth?: 'readable' | 'form';
};

export function Container({ className = '', children, contentMaxWidth, ...rest }: ContainerProps) {
  return (
    <div className={className ? `${styles.container} ${className}` : styles.container} {...rest}>
      <Stack maxWidth={contentMaxWidth}>{children}</Stack>
    </div>
  );
}
