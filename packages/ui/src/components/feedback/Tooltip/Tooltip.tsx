'use client';

import { useId, useState } from 'react';

import styles from './Tooltip.module.scss';

export type TooltipProps = {
  /** Content shown on hover or focus. */
  content: React.ReactNode;
  /** Trigger element (e.g. an icon). */
  children: React.ReactNode;
  /** Optional class for the wrapper. */
  className?: string;
};

/**
 * Shows content in a tooltip on hover and focus. Use for short explanations (e.g. next to a label).
 * The trigger is focusable so keyboard users can reveal the tooltip.
 */
export function Tooltip({ content, children, className = '' }: TooltipProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const wrapperClass = [styles.wrapper, className].filter(Boolean).join(' ');

  return (
    <span
      className={wrapperClass}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span
        tabIndex={0}
        className={styles.trigger}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        aria-describedby={visible ? id : undefined}
      >
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        className={styles.tooltip}
        data-visible={visible ? 'true' : undefined}
      >
        {content}
      </span>
    </span>
  );
}
