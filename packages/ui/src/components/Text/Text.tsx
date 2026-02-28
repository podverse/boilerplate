import type { HTMLAttributes } from 'react';

export type TextVariant = 'muted' | 'error';
export type TextSize = 'sm';

export type TextProps = HTMLAttributes<HTMLParagraphElement | HTMLSpanElement> & {
  variant?: TextVariant;
  size?: TextSize;
  as?: 'p' | 'span';
};

export function Text({ variant, size, as: As = 'p', className = '', ...props }: TextProps) {
  const classes: string[] = [];
  if (variant === 'muted') classes.push('text-muted');
  if (variant === 'error') classes.push('text-error');
  if (size === 'sm') classes.push('text-sm');
  const combined = [...classes, className].filter(Boolean).join(' ');
  return <As className={combined || undefined} {...props} />;
}
