'use client';

import type { CrudBit } from '@boilerplate/helpers';

import styles from './CrudCheckboxes.module.scss';

export type CrudFlags = Record<CrudBit, boolean>;

export type CrudCheckboxesProps = {
  /** Fieldset legend — the name of the permission group (e.g. "Admins", "Users"). */
  label: string;
  /** Display label for each bit. Typically translated by the consumer. */
  labels: Record<CrudBit, string>;
  /** Current checked state for each bit. */
  flags: CrudFlags;
  onChange: (flags: CrudFlags) => void;
};

const BITS: CrudBit[] = ['create', 'read', 'update', 'delete'];

/**
 * Renders a labeled fieldset with four CRUD permission checkboxes.
 * Labels are provided by the consumer so this component stays translation-agnostic.
 */
export function CrudCheckboxes({ label, labels, flags, onChange }: CrudCheckboxesProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{label}</legend>
      <div className={styles.checkboxGroup}>
        {BITS.map((bit) => (
          <label key={bit} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={flags[bit]}
              onChange={(e) => onChange({ ...flags, [bit]: e.target.checked })}
            />
            {labels[bit]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
