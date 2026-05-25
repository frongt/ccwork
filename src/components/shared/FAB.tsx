import type { ReactNode } from 'react';

interface FABProps {
  onClick: () => void;
  'aria-label': string;
  icon: ReactNode;
}

export function FAB({ onClick, 'aria-label': ariaLabel, icon }: FABProps) {
  return (
    <button
      className="fab"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        position: 'absolute',
        right: 24,
        bottom: 'calc(var(--bottom-nav-height) + 16px)',
      }}
    >
      {icon}
    </button>
  );
}
