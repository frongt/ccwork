import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Design System/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '폼 입력 컴포넌트. 3가지 variant:\n\n' +
          '- `default` — 일반 폼 인풋 (border #c5c5d4, radius 16px)\n' +
          '- `editor-title` — 에디터 노트 제목 (32px bold, tracking -0.64px)\n' +
          '- `editor-body` — 에디터 본문 (18px regular, 28px line-height)',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'editor-title', 'editor-body'],
      table: { defaultValue: { summary: 'default' } },
    },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    errorMessage: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story: React.FC) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: '입력하세요', label: '제목' },
};

export const WithError: Story = {
  args: {
    label: '태그',
    placeholder: '태그 입력',
    errorMessage: '태그는 10자 이하로 입력해 주세요.',
    defaultValue: 'verylongtag!!',
  },
};

export const Disabled: Story = {
  args: { label: '제목', placeholder: '비활성 상태', disabled: true },
};

export const EditorTitle: Story = {
  args: { variant: 'editor-title', placeholder: 'Note Title' },
  parameters: {
    docs: {
      description: { story: '에디터 노트 제목 인풋 — 32px bold, tracking -0.64px, 테두리 없음' },
    },
  },
  decorators: [
    (Story: React.FC) => (
      <div style={{ width: '302px', background: 'var(--color-surface)', padding: '24px', borderRadius: '16px' }}>
        <Story />
      </div>
    ),
  ],
};

export const NoLabel: Story = {
  args: { placeholder: '라벨 없는 인풋' },
};
