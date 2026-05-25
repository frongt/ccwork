import type { ReactNode } from 'react';

export interface BottomNavItem {
  id: string;
  label: string;
  icon: (active: boolean) => ReactNode;
  onClick?: () => void;
}

interface BottomNavProps {
  items: BottomNavItem[];
  activeId: string;
}

export function BottomNav({ items, activeId }: BottomNavProps) {
  return (
    <nav className="bottom-nav" style={{ flexShrink: 0, position: 'relative' }}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            className={`bottom-nav-item${isActive ? ' active' : ''}`}
            aria-label={item.label}
            onClick={item.onClick}
          >
            {item.icon(isActive)}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
