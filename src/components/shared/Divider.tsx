import { clsx } from 'clsx';

type DividerVariant = 'default' | 'subtle' | 'editor';

interface DividerProps {
  variant?: DividerVariant;
  className?: string;
}

const variantStyle: Record<DividerVariant, React.CSSProperties> = {
  default: { backgroundColor: 'var(--color-border-subtle)' },
  subtle:  { backgroundColor: 'var(--color-border-subtle)' },
  editor:  { backgroundColor: 'var(--color-border-divider)' },
};

export function Divider({ variant = 'default', className }: DividerProps) {
  return (
    <hr
      className={clsx('divider', className)}
      style={variantStyle[variant]}
    />
  );
}
