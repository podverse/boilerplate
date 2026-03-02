import type { HTMLAttributes } from 'react';

import styles from './Text.module.scss';

export type TextVariant = 'muted' | 'error';
export type TextSize = 'sm';

export type TextProps = HTMLAttributes<HTMLParagraphElement | HTMLSpanElement> & {
  variant?: TextVariant;
  size?: TextSize;
  as?: 'p' | 'span';
};

export function Text({ variant, size, as: As = 'p', className = '', ...props }: TextProps) {
  const classes: string[] = [];
  if (variant === 'muted') classes.push(styles.muted);
  if (variant === 'error') classes.push(styles.error);
  if (size === 'sm') classes.push(styles.sm);
  if (className) classes.push(className);
  const combined = classes.join(' ');
  return <As className={combined || undefined} {...props} />;
}
