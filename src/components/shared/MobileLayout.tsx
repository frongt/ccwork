import type { ReactNode } from 'react';

interface MobileLayoutProps {
  header: ReactNode;
  children: ReactNode;
  fab?: ReactNode;
  bottomNav?: ReactNode;
}

export function MobileLayout({ header, children, fab, bottomNav }: MobileLayoutProps) {
  return (
    <div
      style={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-background-app)',
        position: 'relative',
      }}
    >
      {header}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          paddingBottom: bottomNav
            ? 'calc(var(--bottom-nav-height) + var(--fab-size) + 16px)'
            : 'calc(var(--fab-size) + 24px)',
        }}
      >
        {children}
      </main>
      {fab}
      {bottomNav}
    </div>
  );
}
