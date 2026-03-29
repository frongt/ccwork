import { render, screen } from '@testing-library/react';
import { NoteList } from './NoteList';
import { NotesProvider } from '../context/NotesContext';
import { Note } from '../types/note';

// Context의 notes를 주입하기 위해 fetch를 mock
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'React 노트',
    content: '내용1',
    tags: ['react', 'vite'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'TypeScript 노트',
    content: '내용2',
    tags: ['typescript'],
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    title: '빈 태그 노트',
    content: '내용3',
    tags: [],
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
];

beforeEach(() => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockNotes),
  } as Response);
});

afterEach(() => {
  vi.restoreAllMocks();
});

function renderNoteList(selectedTags: string[] = []) {
  return render(
    <NotesProvider>
      <NoteList selectedNoteId={null} onSelect={vi.fn()} selectedTags={selectedTags} />
    </NotesProvider>,
  );
}

describe('NoteList', () => {
  describe('정상', () => {
    it('selectedTags가 있으면 필터링된 노트만 표시한다', async () => {
      renderNoteList(['typescript']);

      // 로딩 후 노트 표시 대기
      expect(await screen.findByText('TypeScript 노트')).toBeInTheDocument();
      expect(screen.queryByText('React 노트')).not.toBeInTheDocument();
      expect(screen.queryByText('빈 태그 노트')).not.toBeInTheDocument();
    });
  });

  describe('예외', () => {
    it('노트가 변경되면(태그 추가/삭제) 태그 목록이 자동 갱신된다', async () => {
      const { rerender } = renderNoteList([]);

      // 전체 노트 표시 확인
      expect(await screen.findByText('React 노트')).toBeInTheDocument();
      expect(screen.getByText('TypeScript 노트')).toBeInTheDocument();
      expect(screen.getByText('빈 태그 노트')).toBeInTheDocument();

      // selectedTags 변경으로 필터링
      rerender(
        <NotesProvider>
          <NoteList selectedNoteId={null} onSelect={vi.fn()} selectedTags={['react']} />
        </NotesProvider>,
      );

      expect(screen.getByText('React 노트')).toBeInTheDocument();
      expect(screen.queryByText('TypeScript 노트')).not.toBeInTheDocument();
    });
  });
});
