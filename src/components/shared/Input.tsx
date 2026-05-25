import { clsx } from 'clsx';
import { useId } from 'react';

type InputVariant = 'default' | 'editor-title' | 'editor-body';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  variant?: InputVariant;
  className?: string;
}

const variantClass: Record<InputVariant, string> = {
  'default': 'input',
  'editor-title': 'editor-title-input',
  'editor-body': 'input',
};

export function Input({ label, errorMessage, variant = 'default', className, id: idProp, ...rest }: InputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-foreground-subtle)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={clsx(variantClass[variant], errorMessage && 'border-[var(--color-destructive)]', className)}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? `${id}-error` : undefined}
        {...rest}
      />
      {errorMessage && (
        <p id={`${id}-error`} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-destructive)' }} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
