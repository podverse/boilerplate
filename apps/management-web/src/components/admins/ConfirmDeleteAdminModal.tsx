'use client';

import { useTranslations } from 'next-intl';
import { Button, Modal } from '@boilerplate/ui';

import styles from './ConfirmDeleteAdminModal.module.scss';

export type ConfirmDeleteAdminModalProps = {
  open: boolean;
  displayName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDeleteAdminModal({
  open,
  displayName,
  onConfirm,
  onCancel,
}: ConfirmDeleteAdminModalProps) {
  const t = useTranslations('common.confirmDeleteAdmin');

  if (!open) {
    return null;
  }

  return (
    <Modal withBackdrop backdropOpaque onClose={onCancel}>
      <div className={styles.body}>
        <p className={styles.message}>
          {t('message', { name: displayName !== '' ? displayName : t('fallbackName') })}
        </p>
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button
            type="button"
            variant="primary"
            className={styles.deleteButton}
            onClick={onConfirm}
          >
            {t('delete')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
