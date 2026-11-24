import type { ReactElement } from 'react';

interface TagProps {
  label: string;
}

export function Tag({ label }: TagProps): ReactElement {
  return (
    <span className="rounded-full bg-surface-container-highest px-3 py-1 text-xs text-on-surface-variant">
      {label}
    </span>
  );
}
