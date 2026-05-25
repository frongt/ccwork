import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SearchBar } from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Design System/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '노트 목록 상단 검색 바. Figma 스펙:\n\n' +
          '- 높이 48px, border-radius 16px\n' +
          '- 보더 #c5c5d4, 배경 #ffffff\n' +
          '- 검색 아이콘 18×18px, left 19px\n' +
          '- placeholder: rgba(117,118,132,0.6)',
      },
    },
  },
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    onChange: { action: 'changed' },
    onClear: { action: 'cleared' },
  },
  decorators: [
    (Story: React.FC) => (
      <div style={{ width: '350px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Empty: Story = {
  args: { value: '', placeholder: 'Search your thoughts...' },
};

export const WithValue: Story = {
  args: { value: 'quarterly', placeholder: 'Search your thoughts...' },
};

export const WithClear: Story = {
  args: { value: 'quarterly', onClear: () => {} },
};

function InteractiveSearchBar() {
  const [value, setValue] = useState('');
  return (
    <SearchBar
      value={value}
      onChange={setValue}
      onClear={() => setValue('')}
      placeholder="Search your thoughts..."
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveSearchBar />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '실제 입력이 가능한 인터랙티브 예시' },
    },
  },
};
