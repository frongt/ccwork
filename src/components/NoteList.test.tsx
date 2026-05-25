import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NoteList } from './NoteList';

vi.mock('../context/NotesContext', () => ({
  useNotes: vi.fn(),
}));

import { useNotes } from '../context/NotesContext';

const mockNotes = [
  {
    id: '1',
    title: '일반 노트',
    content: '<p>내용</p>',
    tags: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    archivedAt: null,
  },
  {
    id: '2',
    title: '아카이브된 노트',
    content: '<p>내용2</p>',
    tags: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    archivedAt: '2026-05-25T10:00:00.000Z',
  },
];

describe('NoteList', () => {
  it('archivedAt이 null인 노트만 표시한다', () => {
    vi.mocked(useNotes).mockReturnValue({
      notes: mockNotes,
      loading: false,
      error: null,
      addNote: vi.fn(),
      editNote: vi.fn(),
      removeNote: vi.fn(),
    });

    render(<NoteList selectedNoteId={null} onSelect={vi.fn()} />);

    expect(screen.getByText('일반 노트')).toBeInTheDocument();
    expect(screen.queryByText('아카이브된 노트')).not.toBeInTheDocument();
  });

  it('archivedAt 필드가 없는 노트(구버전 데이터)는 정상 노트로 표시한다', () => {
    vi.mocked(useNotes).mockReturnValue({
      notes: [{ id: '3', title: '구버전 노트', content: '', tags: [], createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', archivedAt: null }],
      loading: false,
      error: null,
      addNote: vi.fn(),
      editNote: vi.fn(),
      removeNote: vi.fn(),
    });

    render(<NoteList selectedNoteId={null} onSelect={vi.fn()} />);

    expect(screen.getByText('구버전 노트')).toBeInTheDocument();
  });
});
