import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NoteItem } from './NoteItem';

const baseNote = {
  id: '1',
  title: '테스트 노트',
  content: '<p>내용</p>',
  tags: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  archivedAt: null,
};

describe('NoteItem', () => {
  it('기본 모드에서 삭제 버튼이 표시된다', () => {
    render(
      <NoteItem
        note={baseNote}
        isSelected={false}
        onSelect={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /삭제/ })).toBeInTheDocument();
  });

  it('isReadOnly=true 이면 삭제 버튼이 표시되지 않는다', () => {
    render(
      <NoteItem
        note={{ ...baseNote, archivedAt: '2026-05-25T10:00:00.000Z' }}
        isSelected={false}
        onSelect={vi.fn()}
        onDelete={vi.fn()}
        isReadOnly
      />,
    );
    expect(screen.queryByRole('button', { name: /삭제/ })).not.toBeInTheDocument();
  });
});
