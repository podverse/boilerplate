'use client';

import { LoadingSpinner } from '../LoadingSpinner';
import { Modal } from './Modal';

/**
 * Full-window transparent overlay with an extra-large centered loading spinner.
 * Use with NavigationProvider to show while client-side navigation is in progress.
 */
export function NavigationLoadingOverlay() {
  return (
    <Modal withBackdrop={false}>
      <LoadingSpinner size="xl" />
    </Modal>
  );
}
