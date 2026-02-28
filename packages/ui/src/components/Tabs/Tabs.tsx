'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from './Tabs.module.scss';

export type TabItem = {
  href: string;
  label: string;
};

export type TabsLinkComponentProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export type TabsProps = {
  /** Tab items (href + label). Uses Next.js client navigation when LinkComponent is Next Link. */
  items: TabItem[];
  /** Link component for client-side navigation (e.g. Next.js Link from @boilerplate/ui). */
  LinkComponent: React.ComponentType<TabsLinkComponentProps>;
  /** Optional: current path for active state. If omitted, uses usePathname() (Next.js). */
  activeHref?: string;
};

/**
 * Horizontal tabs navigation. Renders a list of links with active state based on current path.
 * Pass LinkComponent for framework routing (e.g. Next.js Link) so clicks do not trigger full reload.
 */
export function Tabs({ items, LinkComponent, activeHref }: TabsProps) {
  const t = useTranslations('ui.tabs');
  const pathname = usePathname();
  const currentHref = activeHref ?? pathname ?? '';

  return (
    <nav aria-label={t('navAriaLabel')}>
      <div className={styles.scrollWrap}>
        <ul className={styles.nav}>
          {items.map((item) => {
            const isActive =
              currentHref === item.href ||
              (item.href !== '/' && currentHref.startsWith(item.href + '/'));
            const linkClass = [styles.tabLink, isActive ? styles.tabLinkActive : '']
              .filter(Boolean)
              .join(' ');
            return (
              <li key={item.href} className={styles.tab}>
                <LinkComponent href={item.href} className={linkClass}>
                  {item.label}
                </LinkComponent>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
