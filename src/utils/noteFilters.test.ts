import { extractAllTags, filterNotesByTags } from './noteFilters';
import { Note } from '../types/note';

const createNote = (id: string, tags: string[]): Note => ({
  id,
  title: `노트 ${id}`,
  content: '내용',
  tags,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
});

describe('extractAllTags', () => {
  describe('정상', () => {
    it('모든 노트에서 태그를 정렬된 유니크 목록으로 반환한다', () => {
      const notes = [createNote('1', ['react', 'vite']), createNote('2', ['typescript'])];

      expect(extractAllTags(notes)).toEqual(['react', 'typescript', 'vite']);
    });
  });

  describe('경계', () => {
    it('태그가 있는 노트가 없으면 빈 배열을 반환한다', () => {
      const notes = [createNote('1', []), createNote('2', [])];

      expect(extractAllTags(notes)).toEqual([]);
    });
  });

  describe('예외', () => {
    it('여러 노트에 중복된 태그가 있으면 중복을 제거한다', () => {
      const notes = [createNote('1', ['react', 'vite']), createNote('2', ['react', 'typescript'])];

      expect(extractAllTags(notes)).toEqual(['react', 'typescript', 'vite']);
    });
  });
});

describe('filterNotesByTags', () => {
  const notes = [
    createNote('1', ['react', 'vite']),
    createNote('2', ['typescript']),
    createNote('3', ['react', 'typescript']),
    createNote('4', []),
  ];

  describe('정상', () => {
    it('선택한 태그를 하나라도 가진 노트를 반환한다 (OR 조건)', () => {
      const result = filterNotesByTags(notes, ['vite']);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('경계', () => {
    it('selectedTags가 빈 배열이면 전체 노트를 반환한다', () => {
      const result = filterNotesByTags(notes, []);

      expect(result).toHaveLength(4);
    });

    it('여러 태그 선택 시 하나라도 매칭되면 반환한다 (OR)', () => {
      const result = filterNotesByTags(notes, ['vite', 'typescript']);

      expect(result).toHaveLength(3);
      expect(result.map((n) => n.id)).toEqual(['1', '2', '3']);
    });
  });

  describe('예외', () => {
    it('매칭되는 노트가 없으면 빈 배열을 반환한다', () => {
      const result = filterNotesByTags(notes, ['nonexistent']);

      expect(result).toEqual([]);
    });
  });
});
