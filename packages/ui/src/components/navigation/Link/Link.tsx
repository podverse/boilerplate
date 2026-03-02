'use client';

import NextLink from 'next/link';

import { useNavigationContext } from '../../../contexts/NavigationContext';
import styles from './Link.module.scss';

export type LinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
};

function isInternalHref(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

/**
 * Link component that wraps Next.js Link for client-side navigation.
 * When used inside NavigationProvider, shows a full-screen loading overlay on click for internal links.
 * Use as the default LinkComponent for FormLinks, AppHeader, and other UI components.
 * Applies shared link styles (primary color, hover underline).
 */
export function Link({ href, children, className = '', onClick, role, ...rest }: LinkProps) {
  const navigationContext = useNavigationContext();
  const combinedClass = [styles.root, className].filter(Boolean).join(' ');

  const handleClick = () => {
    if (isInternalHref(href)) {
      navigationContext?.setNavigating(true);
    }
    onClick?.();
  };

  return (
    <NextLink href={href} className={combinedClass} onClick={handleClick} role={role} {...rest}>
      {children}
    </NextLink>
  );
}
