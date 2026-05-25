import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NoteEditor } from './NoteEditor';

vi.mock('../context/NotesContext', () => ({
  useNotes: vi.fn(),
}));

import { useNotes } from '../context/NotesContext';

const archivedNote = {
  id: '1',
  title: '아카이브 노트',
  content: '<p>내용</p>',
  tags: ['react'],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  archivedAt: '2026-05-25T10:00:00.000Z',
};

describe('NoteEditor 읽기 전용 모드', () => {
  beforeEach(() => {
    vi.mocked(useNotes).mockReturnValue({
      notes: [archivedNote],
      loading: false,
      error: null,
      addNote: vi.fn(),
      editNote: vi.fn(),
      removeNote: vi.fn(),
    });
  });

  it('isReadOnly=true 이면 저장 버튼이 표시되지 않는다', () => {
    render(
      <NoteEditor selectedNoteId="1" isCreating={false} onDone={vi.fn()} isReadOnly />,
    );
    expect(screen.queryByRole('button', { name: '저장' })).not.toBeInTheDocument();
  });

  it('isReadOnly=true 이면 제목 input이 disabled 상태이다', () => {
    render(
      <NoteEditor selectedNoteId="1" isCreating={false} onDone={vi.fn()} isReadOnly />,
    );
    expect(screen.getByPlaceholderText('제목')).toBeDisabled();
  });
});
