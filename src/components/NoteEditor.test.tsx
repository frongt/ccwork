import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NoteEditor } from './NoteEditor';
import { NotesProvider } from '../context/NotesContext';
import * as notesApi from '../api/notes';

// json-server를 mock
vi.mock('../api/notes', () => ({
  fetchNotes: vi.fn().mockResolvedValue([
    {
      id: '1',
      title: '테스트 노트',
      content: '내용',
      tags: ['react', 'typescript'],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ]),
  createNote: vi.fn().mockResolvedValue({
    id: '2',
    title: '새 노트',
    content: '새 내용',
    tags: ['react'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }),
  updateNote: vi.fn().mockResolvedValue({
    id: '1',
    title: '테스트 노트',
    content: '내용',
    tags: ['react', 'typescript', 'vitest'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }),
  deleteNote: vi.fn().mockResolvedValue(undefined),
}));

function renderWithProvider(ui: React.ReactElement) {
  return render(<NotesProvider>{ui}</NotesProvider>);
}

describe('NoteEditor', () => {
  describe('정상', () => {
    it('should save tags when creating a new note', async () => {
      const onDone = vi.fn();
      renderWithProvider(<NoteEditor selectedNoteId={null} isCreating={true} onDone={onDone} />);

      // 제목 입력
      const titleInput = screen.getByPlaceholderText('제목');
      fireEvent.change(titleInput, { target: { value: '새 노트' } });

      // 태그 입력 — TagInput이 렌더링되어야 함
      const tagInput = screen.getByPlaceholderText(/태그/);
      fireEvent.change(tagInput, { target: { value: 'react' } });
      fireEvent.keyDown(tagInput, { key: 'Enter' });

      // 저장
      const saveButton = screen.getByText('저장');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onDone).toHaveBeenCalled();
      });
    });

    it('should save tags when editing an existing note', async () => {
      const onDone = vi.fn();
      renderWithProvider(<NoteEditor selectedNoteId="1" isCreating={false} onDone={onDone} />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('테스트 노트')).toBeInTheDocument();
      });

      // 태그 입력
      const tagInput = screen.getByPlaceholderText(/태그/);
      fireEvent.change(tagInput, { target: { value: 'vitest' } });
      fireEvent.keyDown(tagInput, { key: 'Enter' });

      // 저장
      const saveButton = screen.getByText('저장');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onDone).toHaveBeenCalled();
      });
    });

    it('should display existing tags as chips when entering edit mode', async () => {
      const onDone = vi.fn();
      renderWithProvider(<NoteEditor selectedNoteId="1" isCreating={false} onDone={onDone} />);

      await waitFor(() => {
        expect(screen.getByText('react')).toBeInTheDocument();
        expect(screen.getByText('typescript')).toBeInTheDocument();
      });
    });

    it('should not submit form when Enter is pressed to add tag', async () => {
      const onDone = vi.fn();
      renderWithProvider(<NoteEditor selectedNoteId="1" isCreating={false} onDone={onDone} />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('테스트 노트')).toBeInTheDocument();
      });

      const tagInput = screen.getByPlaceholderText(/태그/);
      fireEvent.change(tagInput, { target: { value: 'vitest' } });
      fireEvent.keyDown(tagInput, { key: 'Enter' });

      // 태그 추가 후에도 편집 화면에 머물러야 함 (onDone 호출 안 됨)
      expect(onDone).not.toHaveBeenCalled();
      expect(screen.getByDisplayValue('테스트 노트')).toBeInTheDocument();
    });

    it('should send PATCH request immediately when tag is added (without save button)', async () => {
      const onDone = vi.fn();
      renderWithProvider(<NoteEditor selectedNoteId="1" isCreating={false} onDone={onDone} />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('테스트 노트')).toBeInTheDocument();
      });

      const tagInput = screen.getByPlaceholderText(/태그/);
      fireEvent.change(tagInput, { target: { value: 'vitest' } });
      fireEvent.keyDown(tagInput, { key: 'Enter' });

      await waitFor(() => {
        expect(notesApi.updateNote).toHaveBeenCalledWith('1', {
          tags: ['react', 'typescript', 'vitest'],
        });
      });
    });

    it('should send PATCH request immediately when tag is removed (without save button)', async () => {
      const onDone = vi.fn();
      renderWithProvider(<NoteEditor selectedNoteId="1" isCreating={false} onDone={onDone} />);

      await waitFor(() => {
        expect(screen.getByText('react')).toBeInTheDocument();
      });

      // react 태그의 × 버튼 클릭
      const deleteButtons = screen.getAllByRole('button', { name: '×' });
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(notesApi.updateNote).toHaveBeenCalledWith('1', {
          tags: ['typescript'],
        });
      });
    });
  });
});
