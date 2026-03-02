'use client';

import { useTranslations } from 'next-intl';
import {
  getPasswordStrength,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_STRENGTH,
} from '@boilerplate/helpers';

import styles from './PasswordStrengthMeter.module.scss';

export type PasswordStrengthMeterProps = {
  password: string;
  /** Whether to show the requirements hint below the bar (default true when password is non-empty). */
  showHint?: boolean;
};

/**
 * Displays password strength (0–4 segments) and optional requirements text.
 * Does not validate; use isPasswordValid from @boilerplate/helpers to gate submit.
 */
export function PasswordStrengthMeter({ password, showHint = true }: PasswordStrengthMeterProps) {
  const t = useTranslations('ui.passwordStrength');
  const strength = getPasswordStrength(password);
  const meetsMinimum = strength >= PASSWORD_MIN_STRENGTH;
  const hasInput = password.length > 0;

  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.bar} aria-hidden>
        {[0, 1, 2, 3].map((i) => {
          const filled = i < strength;
          const strong = filled && meetsMinimum;
          const segmentClass = filled
            ? strong
              ? `${styles.segment} ${styles.segmentStrong}`
              : `${styles.segment} ${styles.segmentFilled}`
            : styles.segment;
          return <span key={i} className={segmentClass} />;
        })}
      </div>
      {showHint && hasInput && !meetsMinimum && (
        <p className={styles.hint}>{t('hint', { minLength: PASSWORD_MIN_LENGTH })}</p>
      )}
    </div>
  );
}
