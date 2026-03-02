'use client';

import { useId } from 'react';

import styles from './Select.module.scss';

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'value' | 'onChange'
> & {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  /** When true, select width is sized to the selected option (CSS field-sizing: content). */
  sizeToSelected?: boolean;
};

export function Select({
  label,
  options,
  value,
  onChange,
  id: idProp,
  className = '',
  disabled = false,
  sizeToSelected = false,
  'aria-label': ariaLabel,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const id = idProp ?? `select-${generatedId.replace(/:/g, '')}`;

  const wrapperClassName = [
    styles.wrapper,
    sizeToSelected ? styles.wrapperSizeToSelected : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClassName}>
      {label !== undefined && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={sizeToSelected ? styles.selectSizeToSelected : styles.select}
        aria-label={ariaLabel ?? label}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
