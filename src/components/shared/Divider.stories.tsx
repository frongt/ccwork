import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Design System/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '구분선 컴포넌트. 3가지 variant:\n\n' +
          '- `default` / `subtle` — rgba(197,197,212,0.3) — 카드 하단 구분선\n' +
          '- `editor` — rgba(197,197,212,0.2) — 에디터 제목과 본문 사이 구분선',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'subtle', 'editor'],
      table: { defaultValue: { summary: 'default' } },
    },
  },
  decorators: [
    (Story: React.FC) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const Editor: Story = {
  args: { variant: 'editor' },
  parameters: {
    docs: {
      description: { story: '에디터 제목 인풋 아래 구분선 — 더 투명한 버전' },
    },
  },
};

export const InContext: Story = {
  render: () => (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-border)' }}>
        Note Title
      </p>
      <Divider variant="editor" />
      <p style={{ fontSize: 'var(--text-lg)', color: 'rgba(197,197,212,0.6)' }}>
        Start writing your thoughts...
      </p>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '에디터 캔버스 내 제목-본문 구분선 사용 예시' },
    },
  },
};
