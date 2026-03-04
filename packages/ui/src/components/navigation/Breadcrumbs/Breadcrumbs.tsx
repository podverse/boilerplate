import type { ReactNode } from 'react';

import styles from './Breadcrumbs.module.scss';

export type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
};

export type BreadcrumbsLinkComponentProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  LinkComponent: React.ComponentType<BreadcrumbsLinkComponentProps>;
  /** Accessible label for the nav element. */
  ariaLabel?: string;
};

/**
 * Renders a list of breadcrumb items. Items with href use LinkComponent; the last item without href is current page.
 */
export function Breadcrumbs({ items, LinkComponent, ariaLabel = 'Breadcrumb' }: BreadcrumbsProps) {
  if (items.length === 0) return null;
  return (
    <nav aria-label={ariaLabel} className={styles.wrapper}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isLink = item.href !== undefined && item.href !== '' && !isLast;
          return (
            <li key={index} className={styles.item}>
              {isLink && item.href !== undefined && item.href !== '' ? (
                <LinkComponent href={item.href} className={styles.link}>
                  {item.label}
                </LinkComponent>
              ) : (
                <span className={styles.current}>{item.label}</span>
              )}
              {!isLast && <span className={styles.separator} aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
