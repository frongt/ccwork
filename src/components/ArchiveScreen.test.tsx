import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ArchiveScreen } from './ArchiveScreen';

vi.mock('../context/NotesContext', () => ({
  useNotes: vi.fn(),
}));

import { useNotes } from '../context/NotesContext';

describe('ArchiveScreen', () => {
  it('아카이브된 노트만 목록에 표시한다', () => {
    vi.mocked(useNotes).mockReturnValue({
      notes: [
        {
          id: '1',
          title: '일반 노트',
          content: '',
          tags: [],
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          archivedAt: null,
        },
        {
          id: '2',
          title: '아카이브 노트',
          content: '',
          tags: [],
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          archivedAt: '2026-05-25T10:00:00.000Z',
        },
      ],
      loading: false,
      error: null,
      addNote: vi.fn(),
      editNote: vi.fn(),
      removeNote: vi.fn(),
    });

    render(<ArchiveScreen onSelectNote={vi.fn()} onBack={vi.fn()} />);

    expect(screen.queryByText('일반 노트')).not.toBeInTheDocument();
    expect(screen.getByText('아카이브 노트')).toBeInTheDocument();
  });

  it('아카이브가 비어 있으면 빈 상태 메시지를 표시한다', () => {
    vi.mocked(useNotes).mockReturnValue({
      notes: [],
      loading: false,
      error: null,
      addNote: vi.fn(),
      editNote: vi.fn(),
      removeNote: vi.fn(),
    });

    render(<ArchiveScreen onSelectNote={vi.fn()} onBack={vi.fn()} />);

    expect(screen.getByText('보관된 노트가 없습니다')).toBeInTheDocument();
  });
});
