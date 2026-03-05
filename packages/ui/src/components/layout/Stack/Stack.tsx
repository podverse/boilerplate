import type { HTMLAttributes } from 'react';

import styles from './Stack.module.scss';

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  /** When set, constrains width: "readable" (e.g. messages list), "form" (form width, aligns with FormContainer). */
  maxWidth?: 'readable' | 'form';
};

export function Stack({ className = '', maxWidth, ...props }: StackProps) {
  const widthClass =
    maxWidth === 'readable' ? styles.stackReadable : maxWidth === 'form' ? styles.stackForm : '';
  const stackClass =
    widthClass !== ''
      ? `${styles.stack} ${widthClass}${className ? ` ${className}` : ''}`
      : className
        ? `${styles.stack} ${className}`
        : styles.stack;
  return <div className={stackClass} {...props} />;
}
