import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '앱 전역에서 사용하는 버튼 컴포넌트. Figma 기준 pill(radius-full) 형태. ' +
          '`primary`(#24389c) · `outline` · `ghost` · `destructive` 4가지 variant.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'ghost', 'destructive'],
      description: '버튼 스타일 변형',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '버튼 크기',
      table: { defaultValue: { summary: 'md' } },
    },
    isLoading: {
      control: 'boolean',
      description: 'true일 때 스피너 표시 + 비활성화',
    },
    disabled: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Save' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: '취소' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Cancel' },
  parameters: {
    docs: {
      description: { story: '에디터 헤더 Cancel 버튼 — 텍스트만, 패딩 없음' },
    },
  },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: '삭제' },
};

export const Loading: Story = {
  args: { variant: 'primary', children: '저장 중', isLoading: true },
};

export const Disabled: Story = {
  args: { variant: 'primary', children: '저장', disabled: true },
};

export const Small: Story = {
  args: { variant: 'outline', size: 'sm', children: '작은 버튼' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Save</Button>
      <Button variant="outline">취소</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive">삭제</Button>
      <Button variant="primary" isLoading>저장 중</Button>
      <Button variant="primary" disabled>비활성</Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};
