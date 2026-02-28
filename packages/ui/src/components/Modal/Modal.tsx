'use client';

import styles from './Modal.module.scss';

export type ModalProps = {
  children: React.ReactNode;
  /** When true, overlay has a subtle dark backdrop; when false, fully transparent. Default false. */
  withBackdrop?: boolean;
  /** Optional className for the overlay. */
  className?: string;
};

/**
 * Full-window overlay that centers its children. Use for loading overlays, dialogs, or
 * other modal content. Transparent by default; set withBackdrop for a dimmed backdrop.
 */
export function Modal({
  children,
  withBackdrop = false,
  className = '',
}: ModalProps) {
  const overlayClass = [
    styles.overlay,
    withBackdrop ? styles.overlayBackdrop : styles.overlayTransparent,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={overlayClass} role="presentation">
      <div className={styles.content}>{children}</div>
    </div>
  );
}
