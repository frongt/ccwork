import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Design System/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '노트에 붙이는 태그 배지. Figma 실측 3가지 색상 팔레트:\n\n' +
          '- `indigo` — Work, Journal (배경 rgba(63,81,181,0.1) / 텍스트 #24389c)\n' +
          '- `pink` — Personal, Strategy (배경 #fad7ff / 텍스트 #583d5f)\n' +
          '- `rose` — Design, Research (배경 #ffd6fe / 텍스트 #7b008f)\n\n' +
          '`onRemove` prop을 넘기면 X 버튼이 있는 에디터용 태그로 전환됩니다.',
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['indigo', 'pink', 'rose'],
      table: { defaultValue: { summary: 'indigo' } },
    },
    label: { control: 'text' },
    onRemove: { action: 'removed' },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Indigo: Story = {
  args: { label: '#Work', color: 'indigo' },
};

export const Pink: Story = {
  args: { label: '#Personal', color: 'pink' },
};

export const Rose: Story = {
  args: { label: '#Design', color: 'rose' },
};

export const Removable: Story = {
  args: { label: 'Research', color: 'rose', onRemove: fn() },
  parameters: {
    docs: {
      description: {
        story: '에디터 태그 관리 영역에서 사용. onRemove 전달 시 X 버튼 표시.',
      },
    },
  },
};

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Tag label="#Work" color="indigo" />
      <Tag label="#Journal" color="indigo" />
      <Tag label="#Personal" color="pink" />
      <Tag label="#Strategy" color="pink" />
      <Tag label="#Design" color="rose" />
      <Tag label="#Research" color="rose" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const EditorTags: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag label="Research" onRemove={() => {}} />
      <Tag label="Draft" onRemove={() => {}} />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: '에디터 태그 영역 — X 버튼 포함, rose 스타일 고정' },
    },
  },
};
