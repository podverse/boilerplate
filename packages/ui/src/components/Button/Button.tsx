import type { ButtonHTMLAttributes } from 'react';

import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

export function Button({
  variant = 'secondary',
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const cn = [
    styles.root,
    variant === 'primary' ? styles.primary : styles.secondary,
    loading ? styles.loading : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={cn} disabled={isDisabled} {...props}>
      {children}
    </button>
  );
}
