'use client';

import { useTranslations } from 'next-intl';

import styles from './Modal.module.scss';

export type ModalProps = {
  children: React.ReactNode;
  /** When true, overlay has a dark backdrop; when false, fully transparent. Default false. */
  withBackdrop?: boolean;
  /** When true (and withBackdrop), backdrop is opaque for better readability. Default false. */
  backdropOpaque?: boolean;
  /** Optional className for the overlay. */
  className?: string;
  /** When provided, a close button is shown in the upper-right corner of the modal content. */
  onClose?: () => void;
};

/**
 * Full-window overlay that centers its children. Use for loading overlays, dialogs, or
 * other modal content. Transparent by default; set withBackdrop for a dimmed backdrop.
 * When onClose is provided, a close button appears in the upper-right corner of the content.
 */
export function Modal({
  children,
  withBackdrop = false,
  backdropOpaque = false,
  className = '',
  onClose,
}: ModalProps) {
  const t = useTranslations('ui.modal');
  const overlayClass = [
    styles.overlay,
    withBackdrop
      ? backdropOpaque
        ? styles.overlayBackdropOpaque
        : styles.overlayBackdrop
      : styles.overlayTransparent,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={overlayClass} role="presentation">
      <div className={styles.content}>
        <div className={styles.contentInner}>
          {onClose !== undefined && (
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label={t('ariaClose')}
            >
              <i className="fa-solid fa-xmark" aria-hidden />
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
