'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import { useNavigationContext } from '../../../contexts/NavigationContext';
import styles from './Link.module.scss';

export type LinkProps = Omit<React.ComponentProps<typeof NextLink>, 'onClick'> & {
  onClick?: () => void;
};

function isInternalHref(href: React.ComponentProps<typeof NextLink>['href']): boolean {
  return typeof href === 'string' && href.startsWith('/') && !href.startsWith('//');
}

function normalizePath(p: string): string {
  return p === '/' ? p : p.replace(/\/$/, '') || '/';
}

/**
 * Link component that wraps Next.js Link for client-side navigation.
 * When used inside NavigationProvider, shows a full-screen loading overlay on click for internal links
 * only when navigating to a different route (not when clicking the current page).
 * Use as the default LinkComponent for FormLinks, NavBar, and other UI components.
 * Applies shared link styles (primary color, hover underline).
 */
export function Link({ href, children, className = '', onClick, ...rest }: LinkProps) {
  const pathname = usePathname();
  const navigationContext = useNavigationContext();
  const combinedClass = [styles.root, className].filter(Boolean).join(' ');

  const handleClick = () => {
    if (isInternalHref(href)) {
      const targetPath = normalizePath(href);
      const currentPath = pathname !== null ? normalizePath(pathname) : '';
      if (targetPath !== currentPath) {
        navigationContext?.setNavigating(true);
      }
    }
    onClick?.();
  };

  return (
    <NextLink href={href} className={combinedClass} onClick={handleClick} {...rest}>
      {children}
    </NextLink>
  );
}
