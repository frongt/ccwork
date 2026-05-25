import { clsx } from 'clsx';

interface FilterChipProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
}

export function FilterChip({ label, isActive, onClick, className }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx('filter-chip', isActive && 'active', className)}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}
