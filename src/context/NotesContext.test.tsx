import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NotesProvider, useNotes } from './NotesContext';
import * as api from '../api/notes';
import type { Note } from '../types/note';

// 실제 서버(db.json)를 건드리지 않도록 api 모듈 전체를 대체한다
vi.mock('../api/notes');

const testNotes: Note[] = [
  {
    id: 'test-1',
    title: '테스트 노트 1',
    content: '내용 1',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'test-2',
    title: '테스트 노트 2',
    content: '내용 2',
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  },
];

describe('NotesContext.updateNote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.fetchNotes).mockResolvedValue(testNotes);
  });

  // X1 — 회귀 테스트: 기존 Context가 이미 충족하는 동작이라 Red 단계에서도 통과한다.
  // 응답에만 있는 값(서버가 갱신한 updatedAt)을 넣어, updates를 로컬 병합하는 구현과 구분한다.
  it('should notes 배열의 해당 노트를 서버 응답(tags 포함)으로 교체 when tags를 포함한 updates를 전달', async () => {
    const updated: Note = {
      ...testNotes[0],
      tags: ['react', 'design'],
      updatedAt: '2025-01-15T09:00:00.000Z',
    };
    vi.mocked(api.updateNote).mockResolvedValue(updated);
    const { result } = renderHook(() => useNotes(), { wrapper: NotesProvider });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(() => result.current.updateNote('test-1', { tags: ['react', 'design'] }));

    expect(api.updateNote).toHaveBeenCalledWith('test-1', { tags: ['react', 'design'] });
    expect(result.current.notes.find((n) => n.id === 'test-1')).toEqual(updated);
    expect(result.current.notes.find((n) => n.id === 'test-2')).toEqual(testNotes[1]);
  });
});
