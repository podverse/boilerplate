'use client';

import { useEffect, useRef } from 'react';

import type { CrudBit } from '@boilerplate/helpers';

import styles from './CrudCheckboxes.module.scss';

export type CrudFlags = Record<CrudBit, boolean>;

export type CrudCheckboxesProps = {
  /** Group label shown in the header row alongside the select-all checkbox. */
  label: string;
  /** Display label for each bit. Typically translated by the consumer. */
  labels: Record<CrudBit, string>;
  /** Current checked state for each bit. */
  flags: CrudFlags;
  onChange: (flags: CrudFlags) => void;
};

const BITS: CrudBit[] = ['create', 'read', 'update', 'delete'];

/**
 * Renders a bordered group with a select-all header checkbox and four CRUD
 * permission checkboxes. The header checkbox reflects partial selections as
 * an indeterminate state. Labels are provided by the consumer so this
 * component stays translation-agnostic.
 */
export function CrudCheckboxes({ label, labels, flags, onChange }: CrudCheckboxesProps) {
  const checkedCount = BITS.filter((bit) => flags[bit]).length;
  const allChecked = checkedCount === BITS.length;
  const isIndeterminate = checkedCount > 0 && checkedCount < BITS.length;

  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current !== null) {
      selectAllRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const handleSelectAll = (checked: boolean) => {
    const next = Object.fromEntries(BITS.map((bit) => [bit, checked])) as CrudFlags;
    onChange(next);
  };

  return (
    <div className={styles.container}>
      <label className={styles.headerLabel}>
        {label}
        <input
          ref={selectAllRef}
          type="checkbox"
          checked={allChecked}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      </label>
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
    </div>
  );
}
