import { clsx } from 'clsx';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={clsx('flex flex-col items-center justify-center text-center', className)}
      style={{ gap: 'var(--spacing-3)', padding: 'var(--spacing-16) var(--spacing-6)' }}
    >
      {icon && (
        <div
          aria-hidden="true"
          style={{
            fontSize: '2.5rem',
            color: 'var(--color-border)',
            lineHeight: 1,
          }}
        >
          {icon}
        </div>
      )}
      <p
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--color-foreground)',
        }}
      >
        {title}
      </p>
      {description && (
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-foreground-subtle)',
            maxWidth: '20rem',
            lineHeight: 'var(--leading-relaxed)',
          }}
        >
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 'var(--spacing-2)' }}>{action}</div>}
    </div>
  );
}
