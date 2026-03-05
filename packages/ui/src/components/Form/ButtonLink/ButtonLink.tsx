'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import { useNavigationContext } from '../../../contexts/NavigationContext';
import type { LinkProps } from '../../navigation/Link';
import type { ButtonVariant } from '../Button/Button';

import styles from './ButtonLink.module.scss';

export type ButtonLinkProps = Omit<LinkProps, 'className'> & {
  variant?: ButtonVariant;
  className?: string;
};

function isInternalHref(href: ButtonLinkProps['href']): href is string {
  return typeof href === 'string' && href.startsWith('/') && !href.startsWith('//');
}

function normalizePath(p: string): string {
  return p === '/' ? p : p.replace(/\/$/, '') || '/';
}

export function ButtonLink({
  href,
  variant = 'secondary',
  className = '',
  children,
  onClick,
  ...rest
}: ButtonLinkProps) {
  const pathname = usePathname();
  const navigationContext = useNavigationContext();
  const variantClass =
    variant === 'primary'
      ? styles.primary
      : variant === 'link'
        ? styles.linkVariant
        : styles.secondary;
  const combinedClass = [styles.root, variantClass, className].filter(Boolean).join(' ');

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
