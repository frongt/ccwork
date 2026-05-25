import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Design System/Tokens',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Lumina Notes 디자인 시스템 토큰 전체 목록. ' +
          'Figma 파일(`a9XjY7zW6ax6ifSKWqBG3x`) 실측값 기준.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/* ---- 공통 스타일 헬퍼 ---- */
const section = (title: string) => (
  <h3
    style={{
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-semibold)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--color-foreground-subtle)',
      marginBottom: '12px',
      marginTop: '32px',
    }}
  >
    {title}
  </h3>
);

const row = (label: string, value: string, preview: React.ReactNode) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '220px 1fr 120px',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 0',
      borderBottom: '1px solid var(--color-border-subtle)',
    }}
  >
    <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontFamily: 'monospace' }}>
      {label}
    </code>
    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-foreground-subtle)', fontFamily: 'monospace' }}>
      {value}
    </span>
    {preview}
  </div>
);

const swatch = (bg: string, size = 32) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '6px',
      background: bg,
      border: '1px solid var(--color-border-subtle)',
      flexShrink: 0,
    }}
  />
);

/* ---- Colors ---- */
export const Colors: Story = {
  render: () => (
    <div>
      {section('Brand — Primary')}
      {row('--color-primary', '#24389c', swatch('#24389c'))}
      {row('--color-primary-hover', '#1e2f87', swatch('#1e2f87'))}
      {row('--color-primary-active', '#182470', swatch('#182470'))}
      {row('--color-primary-foreground', '#ffffff', swatch('#ffffff'))}
      {row('--color-primary-light', '#cacfff', swatch('#cacfff'))}

      {section('Brand — Accent')}
      {row('--color-accent', '#3f51b5', swatch('#3f51b5'))}
      {row('--color-accent-hover', '#3949ab', swatch('#3949ab'))}
      {row('--color-accent-subtle', 'rgba(63,81,181,0.1)', swatch('rgba(63,81,181,0.1)'))}

      {section('Surface')}
      {row('--color-background', '#faf9f6', swatch('#faf9f6'))}
      {row('--color-background-app', '#f9f9fb', swatch('#f9f9fb'))}
      {row('--color-surface', '#ffffff', swatch('#ffffff'))}
      {row('--color-surface-raised', '#eeeef0', swatch('#eeeef0'))}

      {section('Foreground / Text')}
      {row('--color-foreground', '#1a1c1d', swatch('#1a1c1d'))}
      {row('--color-foreground-muted', '#454652', swatch('#454652'))}
      {row('--color-foreground-subtle', '#757684', swatch('#757684'))}
      {row('--color-foreground-placeholder', 'rgba(117,118,132,0.6)', swatch('rgba(117,118,132,0.6)'))}

      {section('Border')}
      {row('--color-border', '#c5c5d4', swatch('#c5c5d4'))}
      {row('--color-border-subtle', 'rgba(197,197,212,0.3)', swatch('rgba(197,197,212,0.3)'))}
      {row('--color-border-divider', 'rgba(197,197,212,0.2)', swatch('rgba(197,197,212,0.2)'))}
      {row('--color-border-focus', '#24389c', swatch('#24389c'))}

      {section('Tag Palette')}
      {row('--color-tag-indigo-bg / text', 'rgba(63,81,181,0.1) / #24389c',
        <div style={{ display: 'flex', gap: 4 }}>{swatch('rgba(63,81,181,0.1)', 24)}{swatch('#24389c', 24)}</div>)}
      {row('--color-tag-pink-bg / text', '#fad7ff / #583d5f',
        <div style={{ display: 'flex', gap: 4 }}>{swatch('#fad7ff', 24)}{swatch('#583d5f', 24)}</div>)}
      {row('--color-tag-rose-bg / text', '#ffd6fe / #7b008f',
        <div style={{ display: 'flex', gap: 4 }}>{swatch('#ffd6fe', 24)}{swatch('#7b008f', 24)}</div>)}

      {section('State')}
      {row('--color-destructive', '#d32f2f', swatch('#d32f2f'))}
      {row('--color-success', '#2e7d32', swatch('#2e7d32'))}
      {row('--color-warning', '#e65100', swatch('#e65100'))}
    </div>
  ),
};

/* ---- Typography ---- */
export const Typography: Story = {
  render: () => (
    <div>
      {section('Type Scale')}
      {[
        { token: '--text-xs',   size: '12px', usage: '날짜, 태그 배지, 상태 배지' },
        { token: '--text-sm',   size: '14px', usage: '카드 제목, 필터칩, 버튼, Cancel' },
        { token: '--text-base', size: '16px', usage: '노트 본문 미리보기, 서치바, 체크리스트' },
        { token: '--text-lg',   size: '18px', usage: '에디터 본문 textarea' },
        { token: '--text-xl',   size: '20px', usage: '—' },
        { token: '--text-2xl',  size: '24px', usage: '에디터 헤더 타이틀 ("Edit Note")' },
        { token: '--text-3xl',  size: '32px', usage: '에디터 노트 제목 인풋' },
      ].map(({ token, size }) => (
        <div
          key={token}
          style={{
            display: 'grid',
            gridTemplateColumns: '180px 60px 1fr',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 0',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          <code style={{ fontSize: 12, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{token}</code>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-foreground-subtle)' }}>{size}</span>
          <span style={{ fontSize: `var(${token})`, color: 'var(--color-foreground)' }}>Lumina Notes</span>
        </div>
      ))}

      {section('Letter Spacing')}
      {[
        { token: '--tracking-tight',  value: '-0.64px', sample: '에디터 제목 제목' },
        { token: '--tracking-snug',   value: '-0.4px',  sample: '앱 헤더 타이틀' },
        { token: '--tracking-normal', value: '0',       sample: '일반 본문 텍스트' },
        { token: '--tracking-wide',   value: '0.14px',  sample: '카드 제목 필터칩' },
        { token: '--tracking-wider',  value: '0.6px',   sample: 'SYNCED STATUS' },
      ].map(({ token, value, sample }) => (
        <div
          key={token}
          style={{
            display: 'grid',
            gridTemplateColumns: '200px 80px 1fr',
            gap: '12px',
            padding: '8px 0',
            borderBottom: '1px solid var(--color-border-subtle)',
            alignItems: 'center',
          }}
        >
          <code style={{ fontSize: 12, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{token}</code>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-foreground-subtle)' }}>{value}</span>
          <span style={{ fontSize: 'var(--text-sm)', letterSpacing: `var(${token})`, color: 'var(--color-foreground)' }}>
            {sample}
          </span>
        </div>
      ))}
    </div>
  ),
};

/* ---- Spacing ---- */
export const Spacing: Story = {
  render: () => (
    <div>
      {section('Spacing Scale (8px base)')}
      {[
        { token: '--spacing-1', px: '4px' },
        { token: '--spacing-2', px: '8px' },
        { token: '--spacing-3', px: '12px' },
        { token: '--spacing-4', px: '16px' },
        { token: '--spacing-5', px: '20px' },
        { token: '--spacing-6', px: '24px' },
        { token: '--spacing-8', px: '32px' },
        { token: '--spacing-12', px: '48px' },
        { token: '--spacing-16', px: '64px' },
      ].map(({ token, px }) => (
        <div
          key={token}
          style={{
            display: 'grid',
            gridTemplateColumns: '180px 60px 1fr',
            gap: '12px',
            padding: '6px 0',
            borderBottom: '1px solid var(--color-border-subtle)',
            alignItems: 'center',
          }}
        >
          <code style={{ fontSize: 12, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{token}</code>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-foreground-subtle)' }}>{px}</span>
          <div style={{ height: 8, background: 'var(--color-accent)', borderRadius: 2, width: `var(${token})` }} />
        </div>
      ))}

      {section('Layout Constants')}
      {[
        { token: '--header-height',     value: '64px' },
        { token: '--bottom-nav-height', value: '80px' },
        { token: '--fab-size',          value: '56px' },
        { token: '--search-height',     value: '48px' },
      ].map(({ token, value }) => (
        <div
          key={token}
          style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr',
            gap: '12px',
            padding: '8px 0',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          <code style={{ fontSize: 12, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{token}</code>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-foreground-subtle)' }}>{value}</span>
        </div>
      ))}
    </div>
  ),
};

/* ---- Radius & Shadow ---- */
export const RadiusAndShadow: Story = {
  render: () => (
    <div>
      {section('Border Radius')}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {[
          { token: 'sm', px: '4px', label: 'checkbox' },
          { token: 'md', px: '8px', label: '범용' },
          { token: 'lg', px: '12px', label: '바텀 내비 상단' },
          { token: 'xl', px: '16px', label: '카드·인풋' },
          { token: 'full', px: '9999px', label: 'pill·태그·FAB' },
        ].map(({ token, px, label }) => (
          <div key={token} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 56,
                height: 56,
                background: 'var(--color-accent-subtle)',
                border: '2px solid var(--color-accent)',
                borderRadius: `var(--radius-${token})`,
              }}
            />
            <code style={{ fontSize: 11, color: 'var(--color-primary)', fontFamily: 'monospace' }}>
              {token}
            </code>
            <span style={{ fontSize: 10, color: 'var(--color-foreground-subtle)' }}>{px}</span>
            <span style={{ fontSize: 10, color: 'var(--color-foreground-muted)', textAlign: 'center' }}>{label}</span>
          </div>
        ))}
      </div>

      {section('Shadows')}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {[
          { label: 'shadow-card', value: '0 4px 10px rgba(63,81,181,0.05)', desc: '일반 카드' },
          { label: 'shadow-card-elevated', value: '0 10px 15px -3px rgba(0,0,0,0.1)…', desc: '핀 카드·호버' },
          { label: 'shadow-nav', value: '0 -4px 10px rgba(63,81,181,0.05)', desc: '하단 내비' },
          { label: 'shadow-focus', value: '0 0 0 3px rgba(36,56,156,0.25)', desc: '포커스 링' },
        ].map(({ label, value, desc }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                width: 100,
                height: 60,
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: `var(--${label})`,
              }}
            />
            <code style={{ fontSize: 11, color: 'var(--color-primary)', fontFamily: 'monospace' }}>
              --{label}
            </code>
            <span style={{ fontSize: 10, color: 'var(--color-foreground-subtle)', maxWidth: 120 }}>{value}</span>
            <span style={{ fontSize: 10, color: 'var(--color-foreground-muted)' }}>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};
