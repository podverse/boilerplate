import type { HTMLAttributes } from 'react';

import styles from './Card.module.scss';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
};

export function Card({ title, className = '', children, ...props }: CardProps) {
  return (
    <div className={`${styles.root} ${className}`.trim()} {...props}>
      {title !== undefined && <h2 className={styles.title}>{title}</h2>}
      {children}
    </div>
  );
}
