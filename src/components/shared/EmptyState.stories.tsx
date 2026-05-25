import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { Button } from './Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Design System/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '데이터가 없는 상태를 표시하는 컴포넌트. 아이콘·제목·설명·액션 버튼 조합.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    icon: { control: false },
    action: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: '노트가 없습니다',
    description: '새 노트를 만들어 첫 번째 기록을 시작해 보세요.',
  },
};

export const WithIcon: Story = {
  args: {
    icon: '📝',
    title: '노트가 없습니다',
    description: '새 노트를 만들어 첫 번째 기록을 시작해 보세요.',
  },
};

export const WithAction: Story = {
  args: {
    icon: '📝',
    title: '노트가 없습니다',
    description: '새 노트를 만들어 첫 번째 기록을 시작해 보세요.',
    action: <Button variant="primary">새 노트 만들기</Button>,
  },
};

export const SearchEmpty: Story = {
  args: {
    icon: '🔍',
    title: '검색 결과가 없습니다',
    description: '다른 키워드나 태그로 다시 검색해 보세요.',
  },
};
