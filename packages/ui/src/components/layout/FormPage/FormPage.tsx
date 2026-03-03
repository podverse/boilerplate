import type { HTMLAttributes } from 'react';

import styles from './FormPage.module.scss';

export type FormPageProps = HTMLAttributes<HTMLDivElement>;

/**
 * Wraps multiple form sections (e.g. Cards, Dividers) so the whole block
 * uses the same max-width as form inputs. Use on pages that have several
 * forms so dividers and cards stay within the form width.
 */
export function FormPage({ className = '', ...props }: FormPageProps) {
  return (
    <div
      className={className ? `${styles.root} ${className}` : styles.root}
      {...props}
    />
  );
}
