import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FilterChip } from './FilterChip';

const meta: Meta<typeof FilterChip> = {
  title: 'Design System/FilterChip',
  component: FilterChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '노트 목록 상단 수평 스크롤 태그 필터. Figma 스펙:\n\n' +
          '- 비활성: 배경 #ffffff, 보더 #c5c5d4, 텍스트 #454652\n' +
          '- 활성: 배경 #3f51b5, 텍스트 #cacfff\n' +
          '- 패딩 9px 20px, radius-full, 14px medium',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    isActive: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof FilterChip>;

export const Inactive: Story = {
  args: { label: 'Work', isActive: false, onClick: () => {} },
};

export const Active: Story = {
  args: { label: 'All', isActive: true, onClick: () => {} },
};

const TAGS = ['All', 'Work', 'Personal', 'Ideas', 'Reading', 'Archive'];

function FilterRowComponent() {
  const [active, setActive] = useState('All');
  return (
    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
      {TAGS.map((tag) => (
        <FilterChip key={tag} label={tag} isActive={active === tag} onClick={() => setActive(tag)} />
      ))}
    </div>
  );
}

export const FilterRow: Story = {
  render: () => <FilterRowComponent />,
  parameters: {
    controls: { disable: true },
    layout: 'padded',
    docs: {
      description: { story: 'Figma Note List 화면의 수평 스크롤 필터 전체 행' },
    },
  },
};
