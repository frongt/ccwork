import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { fn } from '@storybook/test';
import { Card, CardTitle, CardPreview, CardFooter } from './Card';
import { Tag } from './Tag';

const meta: Meta<typeof Card> = {
  title: 'Design System/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '노트 목록 카드. Figma 기준 radius 16px, shadow `0 4px 10px rgba(63,81,181,0.05)`.\n\n' +
          '- 기본: 흰 배경, 인디고 틴트 섀도\n' +
          '- `isAccent`: 핀 카드 (배경 #3f51b5, 텍스트 #cacfff)\n' +
          '- `isSelected`: 포커스 링 + 인디고 보더',
      },
    },
  },
  argTypes: {
    isAccent: { control: 'boolean', description: '핀/강조 카드 (인디고 배경)' },
    isSelected: { control: 'boolean', description: '선택된 상태 (포커스 링)' },
    onClick: { action: 'clicked' },
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
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args: ComponentProps<typeof Card>) => (
    <Card {...args}>
      <CardTitle>Quarterly Roadmap 2024</CardTitle>
      <CardPreview>
        Focus on scaling infrastructure and improving the mobile note-taking experience with offline
        support and…
      </CardPreview>
      <CardFooter
        date="Oct 24, 2023"
        tags={
          <>
            <Tag label="#Work" color="indigo" />
            <Tag label="#Strategy" color="pink" />
          </>
        }
      />
    </Card>
  ),
  args: { onClick: fn() },
};

export const Selected: Story = {
  render: (args: ComponentProps<typeof Card>) => (
    <Card {...args}>
      <CardTitle>세 번째 노트</CardTitle>
      <CardPreview>React와 TypeScript를 공부 중입니다.</CardPreview>
      <CardFooter date="2026. 5. 19." />
    </Card>
  ),
  args: { isSelected: true, onClick: fn() },
};

export const Accent: Story = {
  render: (args: ComponentProps<typeof Card>) => (
    <Card {...args}>
      <CardTitle>Idea: Lumina Web</CardTitle>
      <CardPreview>
        Create a progressive web app version that maintains the exact same paper-like feel but
        optimized for desktop keyboard…
      </CardPreview>
      <CardFooter date="Today, 10:45 AM" />
    </Card>
  ),
  args: { isAccent: true, onClick: fn() },
  parameters: {
    docs: {
      description: { story: 'Figma Card 5 — 핀된 노트, 인디고(#3f51b5) 배경' },
    },
  },
};

export const WithChecklist: Story = {
  render: (args: ComponentProps<typeof Card>) => (
    <Card {...args}>
      <CardTitle>Weekend Errands</CardTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '4px 0' }}>
        {['Grocery shopping', 'Book car service', 'Visit gallery'].map((item, i) => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                border: i === 0 ? 'none' : '2px solid var(--color-foreground-subtle)',
                background: i === 0 ? 'var(--color-primary)' : 'transparent',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 'var(--text-base)',
                color: i === 0 ? 'var(--color-foreground-subtle)' : 'var(--color-foreground)',
                textDecoration: i === 0 ? 'line-through' : 'none',
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
      <CardFooter date="Oct 21, 2023" />
    </Card>
  ),
  args: { onClick: fn() },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '350px' }}>
      <Card onClick={() => {}}>
        <CardTitle>일반 카드</CardTitle>
        <CardPreview>기본 흰 배경, 인디고 틴트 섀도</CardPreview>
        <CardFooter date="Oct 24, 2023" tags={<Tag label="#Work" color="indigo" />} />
      </Card>
      <Card isSelected onClick={() => {}}>
        <CardTitle>선택된 카드</CardTitle>
        <CardPreview>현재 편집 중인 노트 — 인디고 보더 + 포커스 링</CardPreview>
        <CardFooter date="Oct 23, 2023" />
      </Card>
      <Card isAccent onClick={() => {}}>
        <CardTitle>핀 카드 (Accent)</CardTitle>
        <CardPreview>핀된 노트 — 인디고 배경, 연한 라벤더 텍스트</CardPreview>
        <CardFooter date="Today" />
      </Card>
    </div>
  ),
  parameters: { controls: { disable: true } },
};
