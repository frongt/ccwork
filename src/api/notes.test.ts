import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { updateNote } from './notes';
import type { Note } from '../types/note';

const testNote: Note = {
  id: 'test-1',
  title: '테스트 노트',
  content: '내용',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

describe('api.updateNote', () => {
  // 실제 서버(localhost:3001, db.json)로 요청이 나가지 않도록 fetch를 대체한다
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2025-01-15T09:00:00.000Z'));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  // A1 — 회귀 테스트: 기존 updateNote가 이미 충족하는 동작이라 Red 단계에서도 통과한다.
  it('should PATCH 본문에 tags를 포함 when updates에 tags를 전달', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ...testNote, tags: ['react', 'design'] }),
    });

    await updateNote('test-1', { tags: ['react', 'design'] });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:3001/notes/test-1');
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body)).toEqual({
      tags: ['react', 'design'],
      updatedAt: '2025-01-15T09:00:00.000Z',
    });
  });

  // A2 — 회귀 테스트: 기존 updateNote가 이미 충족하는 동작이라 Red 단계에서도 통과한다.
  it("should Error('Failed to update note')를 던짐 when 응답이 !res.ok", async () => {
    fetchMock.mockResolvedValue({ ok: false, json: async () => ({}) });

    await expect(updateNote('test-1', { tags: ['react'] })).rejects.toThrow(
      'Failed to update note',
    );
  });
});
