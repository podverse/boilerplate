import type { ReactNode } from 'react';

import styles from './SectionWithHeading.module.scss';

export type SectionWithHeadingProps = {
  /** Section heading (e.g. "Profile information", "Change password"). Rendered as an h2 with Card-title-style sizing. */
  title: ReactNode;
  /** Content below the heading. */
  children: ReactNode;
  className?: string;
};

/**
 * Wrapper for a page section: an h2 heading (styled like former Card titles) and content below.
 * Use for profile sections, form blocks, and any place that needs a small section heading + content without a card.
 */
export function SectionWithHeading({ title, children, className = '' }: SectionWithHeadingProps) {
  return (
    <section className={`${styles.root} ${className}`.trim()}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  );
}
