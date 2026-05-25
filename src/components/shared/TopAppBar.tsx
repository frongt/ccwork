import type { ReactNode } from 'react';

interface TopAppBarProps {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
}

export function TopAppBar({ title, left, right }: TopAppBarProps) {
  return (
    <header className="top-app-bar" style={{ flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {left}
        <span className="top-app-bar-title">{title}</span>
      </div>
      {right && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{right}</div>}
    </header>
  );
}
